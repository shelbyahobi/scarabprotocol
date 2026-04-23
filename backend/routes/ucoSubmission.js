const express = require('express');
const router = express.Router();
const Redis = require('ioredis');
const { validateUCO } = require('../services/ucoValidator');

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

router.post('/submit', async (req, res) => {
    try {
        const telemetry = req.body;
        
        if (!telemetry.device_id || !telemetry.user_qr_hash) {
            return res.status(400).json({ error: 'device_id and user_qr_hash are required' });
        }

        // Idempotency lock
        const currentMinute = Math.floor(Date.now() / 60000);
        const lockKey = `lock:uco:${telemetry.device_id}:${currentMinute}`;
        
        const isLocked = await redis.set(lockKey, 'locked', 'NX', 'EX', 120);
        if (!isLocked) {
            return res.status(429).json({ error: 'Submission already processing for this device in this time window.' });
        }

        const result = validateUCO(telemetry);

        if (result.accepted) {
            // Store submission and queue reward
            const submissionKey = `uco:submissions:${telemetry.device_id}`;
            await redis.lpush(submissionKey, JSON.stringify({ ...telemetry, ...result, processed_at: Date.now() }));
            
            const rewardKey = `uco:rewards:${telemetry.user_qr_hash}`;
            await redis.lpush(rewardKey, JSON.stringify({ reward_eur: result.reward_eur, volume: result.verified_litres, timestamp: Date.now() }));

            return res.json(result);
        } else {
            // Return 200 with rejection reasons for UI display
            return res.status(200).json(result);
        }

    } catch (err) {
        console.error('[UCO] Submission error:', err);
        res.status(500).json({ error: 'Failed to process UCO submission' });
    }
});

module.exports = router;
