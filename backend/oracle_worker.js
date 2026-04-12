// oracle_worker.js
// V2 Oracle Architecture: SQS Fan-Out + Redis Idempotency + H3 Weather Caching

const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const { createClient } = require("redis");
const { h3ToGeo, geoToH3 } = require("h3-js");
const ethers = require("ethers");

/**
 * ARCHITECTURE OVERVIEW: (ASI-Evolve Compatible)
 * 1. 72,000 devices POST telemetry to AWS API Gateway -> SQS Queue (Handles concurrency spikes).
 * 2. Stateless Workers (like this script) drain the SQS queue.
 * 3. Worker computes H3 Hex-Grid resolution 5 (~250km2) for the device.
 * 4. Checks Redis for cached weather API data for that Hex-Grid to bypass 60/min API limits.
 * 5. ECDSA verifies the ATECC608A signature.
 * 6. Checks Redis `batch_tx:batchId` to prevent double-spending on worker crash (Idempotency).
 * 7. Submits batch to BSC.
 */

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;
const REDIS_URL = process.env.REDIS_URL;
const BSC_RPC_URL = process.env.BSC_RPC_URL;
const H3_RESOLUTION = 5; // ~250km2 per cell

const sqsClient = new SQSClient({ region: "us-east-1" });
const redisClient = createClient({ url: REDIS_URL });

const BATCH_SIZE = 50; // BSC tx limit for gas reasons

async function startWorker() {
    await redisClient.connect();
    console.log("🟢 Oracle Worker Node Started: Listening to SQS...");

    let currentBatch = [];

    while (true) {
        try {
            // 1. Drain SQS 
            const data = await sqsClient.send(new ReceiveMessageCommand({
                QueueUrl: SQS_QUEUE_URL,
                MaxNumberOfMessages: 10,
                WaitTimeSeconds: 5
            }));

            if (!data.Messages) continue;

            for (const msg of data.Messages) {
                const telemetry = JSON.parse(msg.Body);
                
                // 2. ECDSA P-256 Async Verification (Offloaded from single-thread)
                const isValid = await verifySignatureOffchain(telemetry);
                if (!isValid) {
                    console.error(`🚨 Fraud Alert: Invalid signature for ${telemetry.deviceId}`);
                    await deleteMsg(msg.ReceiptHandle);
                    continue;
                }

                // 3. H3 Hex-Grid Weather Caching
                const hexIndex = geoToH3(telemetry.lat, telemetry.lon, H3_RESOLUTION);
                const weatherData = await getCachedWeather(hexIndex);
                
                if (telemetry.kwh_produced > weatherData.max_theoretical_yield) {
                     console.error(`🚨 Anomaly Detected: Device ${telemetry.deviceId} exceeds physics limit.`);
                     // ASI-Evolve Integration: Push bounded anomaly data into a separate training queue
                     await redisClient.lPush("asi_evolve:training_data", JSON.stringify(telemetry));
                     await deleteMsg(msg.ReceiptHandle);
                     continue;
                }

                // Valid telemetry confirmed.
                currentBatch.push(telemetry);
                await deleteMsg(msg.ReceiptHandle);

                if (currentBatch.length >= BATCH_SIZE) {
                    await submitBatchToBlockchain(currentBatch);
                    currentBatch = []; // reset
                }
            }
        } catch (err) {
            console.error("Worker Loop Error:", err);
        }
    }
}

async function getCachedWeather(hexIndex) {
    // Check Redis FIRST (Reduces OpenWeather API calls by 99% across dense clusters)
    let cached = await redisClient.get(`weather:${hexIndex}`);
    if (cached) return JSON.parse(cached);

    // If cache miss, calculate center of H3 hex and query API
    const [lat, lon] = h3ToGeo(hexIndex);
    const apiData = await fetchWeatherAPI(lat, lon);
    
    // Store in Redis with TTL of 5 minutes 
    await redisClient.setEx(`weather:${hexIndex}`, 300, JSON.stringify(apiData));
    return apiData;
}

async function submitBatchToBlockchain(batch) {
    // Generate a deterministic batch ID based on the payload hashes
    const batchId = ethers.utils.id(JSON.stringify(batch));

    // 4. Idempotency Lock: Prevent Double Submissions if worker restarts
    // Includes a 5-minute TTL (EX: 300) so a crashed worker doesn't permanently deadlock the batch
    const isLocked = await redisClient.set(`lock:batch:${batchId}`, "processing", { NX: true, EX: 300 });
    if (!isLocked) {
        console.warn(`⚠️ Batch ${batchId} is already locked by another worker.`);
        return;
    }

    try {
        console.log(`📡 Broadcasting Batch of ${batch.length} nodes to BSC...`);
        // Mock Contract Call:
        // const tx = await productionValidatorContract.submitBatch(batchData);
        // await tx.wait();

        const mockTxHash = "0xABC123..."; 

        // Store the final idempotency state
        await redisClient.set(`tx:batch:${batchId}`, mockTxHash);
        console.log(`✅ Batch successful. TX: ${mockTxHash}`);
        
    } catch (err) {
        console.error("Blockchain submission failed, dropping lock.", err);
        await redisClient.del(`lock:batch:${batchId}`); // Allow retry
    }
}

// Mocks
async function verifySignatureOffchain(telemetry) { return true; }
async function fetchWeatherAPI(lat, lon) { return { max_theoretical_yield: 25.5 }; }
async function deleteMsg(handle) {
    await sqsClient.send(new DeleteMessageCommand({ QueueUrl: SQS_QUEUE_URL, ReceiptHandle: handle }));
}

if (require.main === module) {
    startWorker().catch(console.error);
}
