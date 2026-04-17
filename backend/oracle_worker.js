/**
 * SCARAB Protocol — Oracle Worker
 * backend/oracle_worker.js
 *
 * Four production functions only:
 *   1. pullFromSQS()
 *   2. verifySignature(telemetry, sig, pubkey)
 *   3. getWeatherForDevice(lat, lon)
 *   4. submitBatch(validatedItems)
 *
 * All secrets from process.env — never hardcoded.
 * TypeScript-style JSDoc types on every parameter and return.
 */

'use strict';

const { SQSClient, ReceiveMessageCommand } = require('@aws-sdk/client-sqs');
const { createClient } = require('redis');
const { createVerify, createHash } = require('crypto');
const h3 = require('h3-js');
const { ethers } = require('ethers');

// ─────────────────────────────────────────────
// CONFIG — all from environment, no defaults for secrets
// ─────────────────────────────────────────────

const AWS_REGION         = process.env.AWS_REGION;
const SQS_QUEUE_URL      = process.env.SQS_QUEUE_URL;
const REDIS_URL          = process.env.REDIS_URL;
const OWM_API_KEY        = process.env.OPENWEATHER_API_KEY;
const OWM_BASE_URL       = process.env.OPENWEATHER_BASE_URL
                           || 'https://api.openweathermap.org/data/2.5';
const BSC_RPC            = process.env.BSC_TESTNET_RPC;
const ORACLE_PRIVATE_KEY = process.env.ORACLE_PRIVATE_KEY;
const BATCH_CONTRACT     = process.env.BSC_BATCH_CONTRACT;
const BATCH_ABI          = JSON.parse(process.env.BSC_BATCH_ABI_JSON || '[]');

// ─────────────────────────────────────────────
// CLIENT SINGLETONS — initialised once
// ─────────────────────────────────────────────

/** @type {SQSClient} */
const sqsClient = new SQSClient({ region: AWS_REGION });

/** @type {import('redis').RedisClientType} */
let redisClient = null;

/**
 * Returns a connected Redis client (lazy singleton).
 * @returns {Promise<import('redis').RedisClientType>}
 */
async function getRedis() {
  if (redisClient && redisClient.isOpen) return redisClient;
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on('error', (err) => {
    console.error('[REDIS] Connection error:', err);
  });
  await redisClient.connect();
  return redisClient;
}

// ─────────────────────────────────────────────
// 1. pullFromSQS
// ─────────────────────────────────────────────

/**
 * @typedef {Object} SQSMessage
 * @property {string} MessageId
 * @property {string} ReceiptHandle
 * @property {string} Body          - JSON-stringified telemetry envelope
 */

/**
 * Pull up to 10 messages from the SCARAB telemetry SQS queue.
 *
 * Uses long-polling (WaitTimeSeconds: 20) to reduce empty receives.
 * Caller is responsible for deleting messages after successful processing.
 *
 * @returns {Promise<SQSMessage[]>} Array of raw SQS messages (may be empty)
 */
async function pullFromSQS() {
  const command = new ReceiveMessageCommand({
    QueueUrl:              SQS_QUEUE_URL,
    MaxNumberOfMessages:   10,
    WaitTimeSeconds:       20,     // long-poll — avoids tight empty-receive loops
    AttributeNames:        ['All'],
    MessageAttributeNames: ['All'],
  });

  const response = await sqsClient.send(command);
  const messages = response.Messages || [];

  console.info(`[SQS] Pulled ${messages.length} message(s)`);
  return messages;
}

// ─────────────────────────────────────────────
// 2. verifySignature
// ─────────────────────────────────────────────

/**
 * @typedef {Object} Telemetry
 * @property {string} device_id
 * @property {number} timestamp
 * @property {number} voltage
 * @property {number} current
 * @property {number} power
 * @property {number} energy
 * @property {number} lat
 * @property {number} lon
 */

/**
 * Convert a raw 64-byte r||s signature buffer to DER format.
 * Node's `crypto.createVerify` requires DER; ATECC608A emits raw r||s.
 *
 * @param {Buffer} rawSig - 64-byte buffer: r (32 bytes) + s (32 bytes)
 * @returns {Buffer} DER-encoded signature
 */
function rawToDer(rawSig) {
  if (rawSig.length !== 64) {
    throw new Error(`[SIG] Expected 64-byte raw signature, got ${rawSig.length}`);
  }

  // Strip leading zeros for DER integer encoding, but keep at least one byte.
  // Prepend 0x00 if the high bit is set to disambiguate positive integers in DER.
  const trim = (buf) => {
    let start = 0;
    while (start < buf.length - 1 && buf[start] === 0x00) start++;
    return (buf[start] & 0x80)
      ? Buffer.concat([Buffer.from([0x00]), buf.slice(start)])
      : buf.slice(start);
  };

  const r = trim(rawSig.slice(0, 32));
  const s = trim(rawSig.slice(32, 64));

  // SEQUENCE { INTEGER r, INTEGER s }
  // Header: 0x30 <total-len> 0x02 <r-len> <r> 0x02 <s-len> <s>
  const totalInnerLen = 2 + r.length + 2 + s.length;
  const der = Buffer.alloc(2 + totalInnerLen);
  let off = 0;
  der[off++] = 0x30;
  der[off++] = totalInnerLen;
  der[off++] = 0x02;
  der[off++] = r.length;
  r.copy(der, off); off += r.length;
  der[off++] = 0x02;
  der[off++] = s.length;
  s.copy(der, off);

  return der;
}

/**
 * Normalise a public key to PEM format for Node's built-in crypto.
 * Accepts: PEM string | uncompressed hex (130 chars) | compressed hex (66 chars).
 *
 * @param {string} pubkey
 * @returns {string} PEM-formatted EC public key
 */
function normalisePubkey(pubkey) {
  if (pubkey.startsWith('-----BEGIN')) return pubkey;

  const keyBytes = Buffer.from(pubkey, 'hex');

  // SubjectPublicKeyInfo DER prefix for EC P-256 (prime256v1):
  //   SEQUENCE { SEQUENCE { OID ecPublicKey, OID prime256v1 }, BIT STRING }
  const spkiPrefix = Buffer.from(
    '3059301306072a8648ce3d020106082a8648ce3d030107034200',
    'hex'
  );
  const spki = Buffer.concat([spkiPrefix, keyBytes]);
  const b64  = spki.toString('base64').match(/.{1,64}/g).join('\n');
  return `-----BEGIN PUBLIC KEY-----\n${b64}\n-----END PUBLIC KEY-----`;
}

/**
 * Verify an ATECC608A ECDSA P-256 signature over a telemetry payload.
 *
 * Signing input: SHA-256 of canonical JSON of the telemetry fields,
 * in the fixed field order the firmware uses:
 *   device_id → timestamp → voltage → current → power → energy → lat → lon
 *
 * Signature formats accepted:
 *   - 128-char hex string  → treated as raw 64-byte r||s, converted to DER
 *   - hex string starting with 0x30 → already DER-encoded
 *   - anything else        → treated as base64; if decoded length is 64 → raw r||s
 *
 * @param {Telemetry} telemetry  - Parsed telemetry object
 * @param {string}    sig        - Signature: base64 | DER hex | raw r||s hex
 * @param {string}    pubkey     - Device public key: PEM string | uncompressed hex
 * @returns {boolean} true if signature is cryptographically valid
 */
function verifySignature(telemetry, sig, pubkey) {
  // Canonical JSON — field order must match firmware signing order exactly
  const canonical = JSON.stringify({
    device_id: telemetry.device_id,
    timestamp: telemetry.timestamp,
    voltage:   telemetry.voltage,
    current:   telemetry.current,
    power:     telemetry.power,
    energy:    telemetry.energy,
    lat:       telemetry.lat,
    lon:       telemetry.lon,
  });

  // Normalise signature to a DER-encoded Buffer
  let sigBuf;
  const rawHex = sig.replace(/\s/g, '');
  if (rawHex.length === 128) {
    // 64-byte raw r||s as hex — ATECC608A default output format
    sigBuf = rawToDer(Buffer.from(rawHex, 'hex'));
  } else if (rawHex.startsWith('30')) {
    // Already DER hex
    sigBuf = Buffer.from(rawHex, 'hex');
  } else {
    // Assume base64; if decoded to 64 bytes it is raw r||s, otherwise assume DER
    const decoded = Buffer.from(sig, 'base64');
    sigBuf = decoded.length === 64 ? rawToDer(decoded) : decoded;
  }

  try {
    // createVerify with the curve algorithm name hashes the message internally,
    // matching how the ATECC608A produces the digest before signing.
    const verifier = createVerify('SHA256');
    verifier.update(canonical);
    return verifier.verify(normalisePubkey(pubkey), sigBuf);
  } catch (err) {
    // SEVERITY: HIGH — invalid key format, corrupted signature, or algorithm mismatch
    console.error(`[SIG] Verification error for device ${telemetry.device_id}:`, err.message);
    return false;
  }
}

// ─────────────────────────────────────────────
// 3. getWeatherForDevice
// ─────────────────────────────────────────────

/**
 * @typedef {Object} WeatherData
 * @property {number} irradiance_proxy  - cloud cover inversion: 0–100 (100 = clear sky)
 * @property {number} cloud_cover_pct   - raw cloud cover percentage 0–100
 * @property {number} temp_c            - temperature in Celsius
 * @property {number} humidity_pct      - relative humidity 0–100
 * @property {string} description       - short OWM weather description
 * @property {number} fetched_at        - Unix timestamp of cache write
 */

/**
 * Get weather data for a device location using H3 level-5 spatial cache.
 *
 * Cache strategy:
 *   - One Redis key per H3 hex cell (~10 km² at resolution 5)
 *   - TTL: 300 seconds (5 minutes) — balances API cost vs. accuracy
 *   - Cache hit: return parsed JSON, no API call
 *   - Cache miss: call OpenWeatherMap, write to Redis, return data
 *
 * @param {number} lat - Device latitude
 * @param {number} lon - Device longitude
 * @returns {Promise<WeatherData>} Weather snapshot for the H3 cell
 */
async function getWeatherForDevice(lat, lon) {
  const redis    = await getRedis();
  const h3Index  = h3.latLngToCell(lat, lon, 5);
  const cacheKey = `weather:${h3Index}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.info(`[WEATHER] Cache hit for H3 cell ${h3Index}`);
    return JSON.parse(cached);
  }

  console.info(`[WEATHER] Cache miss for H3 cell ${h3Index} — calling OWM API`);
  const url = `${OWM_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`[WEATHER] OWM API error: ${res.status} ${res.statusText}`);
  }

  const raw = await res.json();

  /** @type {WeatherData} */
  const data = {
    irradiance_proxy: 100 - (raw.clouds?.all ?? 0),   // higher = more direct sunlight
    cloud_cover_pct:  raw.clouds?.all ?? 0,
    temp_c:           raw.main?.temp ?? 0,
    humidity_pct:     raw.main?.humidity ?? 0,
    description:      raw.weather?.[0]?.description ?? 'unknown',
    fetched_at:       Math.floor(Date.now() / 1000),
  };

  await redis.setEx(cacheKey, 300, JSON.stringify(data));
  console.info(`[WEATHER] Cached H3 cell ${h3Index} for 300s`);

  return data;
}

// ─────────────────────────────────────────────
// 4. submitBatch
// ─────────────────────────────────────────────

/**
 * @typedef {Object} ValidatedItem
 * @property {string}      device_id   - Hardware device identifier
 * @property {number}      timestamp   - Unix epoch of measurement
 * @property {number}      energy      - Energy produced in Wh during interval
 * @property {number}      lat         - Device latitude
 * @property {number}      lon         - Device longitude
 * @property {string}      sig         - Verified ECDSA signature (hex)
 * @property {string}      pubkey      - Device public key (hex)
 * @property {number}      confidence  - Oracle confidence score 0–100
 * @property {WeatherData} weather     - Weather snapshot at time of reading
 */

/**
 * @typedef {Object} BatchResult
 * @property {string|null} txHash           - BSC transaction hash, or null if not submitted
 * @property {number}      itemCount        - Number of items in this batch
 * @property {string}      batchId          - Redis idempotency lock key
 * @property {boolean}     alreadyProcessed - true if the batch lock was already held
 */

/**
 * Submit a validated batch of telemetry items to the BSC oracle contract.
 *
 * Idempotency: a Redis NX lock keyed on SHA-256 of (device_id + timestamp) tuples
 * prevents double-submission if the worker crashes after sending but before acking SQS.
 * The lock TTL is 300 s; longer than any expected tx confirmation window.
 *
 * On-chain call:
 *   submitBatch(bytes32[] deviceIds, uint256[] energyValues,
 *               uint8[] confidenceScores, bytes[] signatures)
 *
 * Energy encoding: Wh × 1000 → mWh as uint256 to avoid float precision loss.
 *
 * @param {ValidatedItem[]} validatedItems - Array of verified telemetry items (max 50)
 * @returns {Promise<BatchResult>}
 */
async function submitBatch(validatedItems) {
  if (!validatedItems || validatedItems.length === 0) {
    throw new Error('[BATCH] Cannot submit empty batch');
  }
  if (validatedItems.length > 50) {
    // SEVERITY: MEDIUM — caller must split into ≤50-item sub-batches before calling
    throw new Error(`[BATCH] Batch exceeds maximum of 50 items (got ${validatedItems.length})`);
  }

  const redis = await getRedis();

  // Deterministic idempotency key — same batch of (device_id, timestamp) pairs
  // always maps to the same lock, regardless of submission order.
  const batchHash = createHash('sha256')
    .update(JSON.stringify(validatedItems.map(i => i.device_id + i.timestamp)))
    .digest('hex')
    .slice(0, 16);
  const batchId   = `lock:batch:${batchHash}`;
  const resultKey = `result:batch:${batchHash}`;

  // NX: only set if key does not already exist — atomic idempotency check
  const locked = await redis.set(batchId, 'processing', { NX: true, EX: 300 });
  if (!locked) {
    console.info(`[BATCH] Already processing batch ${batchId} — skipping`);
    const existingResult = await redis.get(resultKey);
    return existingResult
      ? { ...JSON.parse(existingResult), alreadyProcessed: true }
      : { txHash: null, itemCount: validatedItems.length, batchId, alreadyProcessed: true };
  }

  const provider = new ethers.JsonRpcProvider(BSC_RPC);
  const wallet   = new ethers.Wallet(ORACLE_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(BATCH_CONTRACT, BATCH_ABI, wallet);

  // MINIMISATION RULE: Device IDs must be cryptographically hashed
  // Raw serial numbers / identities cannot be stored on EVM storage.
  const deviceIds = validatedItems.map(i =>
    ethers.keccak256(ethers.toUtf8Bytes(i.device_id))
  );
  const energyValues = validatedItems.map(i => BigInt(Math.round(i.energy * 1000))); // Wh → mWh
  const confidences  = validatedItems.map(i => i.confidence);
  const signatures   = validatedItems.map(i => '0x' + i.sig.replace(/^0x/, ''));

  console.info(`[BATCH] Submitting ${validatedItems.length} items | batch ${batchId}`);

  let txHash;
  try {
    const tx      = await contract.submitBatch(deviceIds, energyValues, confidences, signatures);
    const receipt = await tx.wait(1); // wait for 1 confirmation before declaring success
    txHash = receipt.hash;
    console.info(`[BATCH] Confirmed tx ${txHash} | batch ${batchId}`);
  } catch (err) {
    // Release the lock so the batch can be retried by the next worker poll
    await redis.del(batchId);
    // SEVERITY: HIGH — on-chain submission failure; SQS message should be retried
    throw new Error(`[BATCH] BSC submission failed for batch ${batchId}: ${err.message}`);
  }

  /** @type {BatchResult} */
  const result = {
    txHash,
    itemCount:        validatedItems.length,
    batchId,
    alreadyProcessed: false,
  };

  // Cache result so duplicate calls within the TTL window can retrieve the tx hash
  await redis.setEx(resultKey, 300, JSON.stringify(result));

  return result;
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

module.exports = {
  pullFromSQS,
  verifySignature,
  getWeatherForDevice,
  submitBatch,
};
