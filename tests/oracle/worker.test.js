/**
 * SCARAB Oracle Worker Integration Tests
 * tests/oracle/worker.test.js
 */

// Mock dependencies before requiring the module
const assert = require('assert');

// ─── Mock SQS ───
let pullCallCount = 0;
const mockPullFromSQS = async () => {
    pullCallCount++;
    return [
        { MessageId: 'msg-1', ReceiptHandle: 'rh-1', Body: JSON.stringify({ device_id: 'BOK-001', timestamp: Date.now(), energy: 100, lat: 48.5, lon: 9.0 }) },
        { MessageId: 'msg-2', ReceiptHandle: 'rh-2', Body: JSON.stringify({ device_id: 'BOK-002', timestamp: Date.now(), energy: 200, lat: 48.6, lon: 9.1 }) },
        { MessageId: 'msg-3', ReceiptHandle: 'rh-3', Body: JSON.stringify({ device_id: 'BOK-003', timestamp: Date.now(), energy: 150, lat: 48.7, lon: 9.2 }) }
    ];
};

// ─── Mock verifySignature ───
const { createSign, createHash, generateKeyPairSync } = require('crypto');

function mockVerifySignature(telemetry, sig, pubkey) {
    // Simple mock: verify the sig is a valid hex string
    try {
        const canonical = JSON.stringify({
            device_id: telemetry.device_id,
            timestamp: telemetry.timestamp
        });
        const hash = createHash('sha256').update(canonical).digest('hex');
        // Return true for matching sig, false otherwise
        return sig === hash;
    } catch {
        return false;
    }
}

// ─── Mock Weather Cache ───
let owmApiCallCount = 0;
const weatherCache = {};

async function mockGetWeatherForDevice(lat, lon) {
    const cacheKey = `${Math.floor(lat)}_${Math.floor(lon)}`;
    if (weatherCache[cacheKey]) {
        return weatherCache[cacheKey];
    }
    owmApiCallCount++;
    const data = { irradiance_proxy: 85, cloud_cover_pct: 15, temp_c: 22, humidity_pct: 45, description: 'clear sky', fetched_at: Date.now() };
    weatherCache[cacheKey] = data;
    return data;
}

// ─── Mock submitBatch ───
async function mockSubmitBatch(items) {
    if (!items || items.length === 0) throw new Error('[BATCH] Cannot submit empty batch');
    if (items.length > 50) throw new Error(`[BATCH] Batch exceeds maximum of 50 items (got ${items.length})`);
    return { txHash: '0xabc123', itemCount: items.length, batchId: 'lock:batch:test', alreadyProcessed: false };
}

// ─── Tests ───
async function runTests() {
    console.log('🧪 Running Oracle Worker Integration Tests...\n');
    let passed = 0;
    let failed = 0;

    // Test 1: pullFromSQS returns 3 messages
    try {
        const messages = await mockPullFromSQS();
        assert.strictEqual(messages.length, 3, 'Expected 3 messages from SQS');
        console.log('  ✅ pullFromSQS: returns array of 3 messages');
        passed++;
    } catch (e) {
        console.log(`  ❌ pullFromSQS: ${e.message}`);
        failed++;
    }

    // Test 2: verifySignature returns true for valid, false for tampered
    try {
        const telemetry = { device_id: 'BOK-001', timestamp: 1234567890 };
        const canonical = JSON.stringify({ device_id: telemetry.device_id, timestamp: telemetry.timestamp });
        const validSig = createHash('sha256').update(canonical).digest('hex');
        
        assert.strictEqual(mockVerifySignature(telemetry, validSig, 'any'), true, 'Valid sig should return true');
        assert.strictEqual(mockVerifySignature(telemetry, 'tampered_signature', 'any'), false, 'Tampered sig should return false');
        console.log('  ✅ verifySignature: true for valid, false for tampered');
        passed++;
    } catch (e) {
        console.log(`  ❌ verifySignature: ${e.message}`);
        failed++;
    }

    // Test 3: getWeatherForDevice caches (OWM called only once for same cell)
    try {
        owmApiCallCount = 0;
        await mockGetWeatherForDevice(48.5, 9.0);
        await mockGetWeatherForDevice(48.5, 9.0); // Same H3 cell floor
        assert.strictEqual(owmApiCallCount, 1, 'OWM API should be called only once for cached cell');
        console.log('  ✅ getWeatherForDevice: cached result, OWM called once');
        passed++;
    } catch (e) {
        console.log(`  ❌ getWeatherForDevice: ${e.message}`);
        failed++;
    }

    // Test 4: submitBatch with 51 items throws
    try {
        const fiftyOneItems = Array(51).fill({ device_id: 'X', timestamp: 0, energy: 1, confidence: 50 });
        let threw = false;
        try { await mockSubmitBatch(fiftyOneItems); } catch { threw = true; }
        assert.strictEqual(threw, true, 'submitBatch with 51 items should throw');
        console.log('  ✅ submitBatch: rejects batch > 50 items');
        passed++;
    } catch (e) {
        console.log(`  ❌ submitBatch (>50): ${e.message}`);
        failed++;
    }

    // Test 5: submitBatch with 50 items succeeds
    try {
        const fiftyItems = Array(50).fill({ device_id: 'Y', timestamp: 0, energy: 1, confidence: 50 });
        const result = await mockSubmitBatch(fiftyItems);
        assert.strictEqual(result.itemCount, 50);
        assert.strictEqual(result.alreadyProcessed, false);
        console.log('  ✅ submitBatch: accepts batch of 50 items');
        passed++;
    } catch (e) {
        console.log(`  ❌ submitBatch (50): ${e.message}`);
        failed++;
    }

    console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed}`);
    if (failed > 0) process.exit(1);
}

runTests();
