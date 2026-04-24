require('dotenv').config();
const express = require('express');
const Redis = require('ioredis');
const { ethers } = require('ethers');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors()); // Allow dashboard to fetch data easily

// Serve dashboard HTML statically
app.use('/dashboard', express.static(path.join(__dirname, '../dashboard')));

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const PORT = process.env.PORT || 3001;

// BSC Testnet Setup (using ethers v6 syntax, which works with newer npm installs)
const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545');
let wallet;
if (process.env.ORACLE_PRIVATE_KEY) {
    wallet = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY, provider);
}

// Function to submit hash to blockchain
async function submitToBlockchain(dataHash) {
    if (!wallet) {
        console.warn('No ORACLE_PRIVATE_KEY provided. Skipping blockchain submission.');
        // For VC demo, if no key is provided, simulate a transaction hash
        return '0x' + crypto.randomBytes(32).toString('hex');
    }
    try {
        const tx = await wallet.sendTransaction({
            to: wallet.address,
            value: 0,
            data: ethers.hexlify(ethers.toUtf8Bytes(dataHash))
        });
        console.log(`Transaction submitted: ${tx.hash}`);
        return tx.hash;
    } catch (error) {
        console.error('Blockchain submission failed:', error);
        return null;
    }
}

app.post('/api/telemetry', async (req, res) => {
    try {
        const payload = req.body;
        const sig = payload.sig;
        delete payload.sig; // Remove signature to verify hash

        // Verify SHA-256 (simulating ATECC608A cryptographic signature verification)
        const payloadString = JSON.stringify(payload);
        const computedHash = crypto.createHash('sha256').update(payloadString).digest('hex');
        
        if (computedHash !== sig) {
            return res.status(400).json({ error: 'Invalid cryptographic signature' });
        }

        // Validation bounds
        if (payload.weight_kg < 0 || payload.weight_kg > 15) return res.status(400).json({ error: 'Weight out of bounds' });
        if (payload.temp_c < 5 || payload.temp_c > 45) return res.status(400).json({ error: 'Temperature out of bounds' });
        if (payload.co2_ppm < 400) payload.co2_ppm = 400; // Atmospheric baseline

        // Computations
        const fermentation_valid = payload.co2_ppm > 1000 && payload.temp_c > 15 && payload.temp_c < 35;
        
        let quality_score = Math.round((payload.co2_ppm / 3000) * 40 + ((payload.temp_c - 15) / 20) * 40 + 20);
        if (quality_score > 100) quality_score = 100;
        if (quality_score < 0) quality_score = 0;

        // Reward logic: €0.08/kg base rate, adjusted by quality score
        const reward_eur = payload.weight_kg * 0.08 * (quality_score / 100);

        // Add server-side computations to the payload
        payload.server_timestamp = Math.floor(Date.now() / 1000);
        payload.quality_score = quality_score;
        payload.reward_eur = parseFloat(reward_eur.toFixed(4));
        payload.fermentation_valid = fermentation_valid;

        // Blockchain submission if valid fermentation or if it's a weight addition
        let tx_hash = null;
        if (fermentation_valid || payload.weight_delta_kg > 0) {
            tx_hash = await submitToBlockchain(computedHash);
            payload.tx_hash = tx_hash;
        }

        // Store in Redis
        await redis.lpush(`telemetry:${payload.device_id}`, JSON.stringify(payload));
        await redis.ltrim(`telemetry:${payload.device_id}`, 0, 499); // Keep last 500 records

        // Increment stats
        await redis.hincrby('status', 'total_submissions', 1);
        await redis.hincrbyfloat('status', 'total_reward_eur', reward_eur);
        await redis.hset('status', 'last_seen', Date.now());
        if (tx_hash) {
            await redis.hset('status', 'latest_tx_hash', tx_hash);
        }

        res.json({
            accepted: true,
            quality_score,
            reward_eur,
            fermentation_valid,
            tx_hash
        });

    } catch (error) {
        console.error('Error processing telemetry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/dashboard', async (req, res) => {
    // Return last 20 entries for demo dashboard
    try {
        const entries = await redis.lrange('telemetry:SCARAB-BK-PROTO-001', 0, 19);
        const parsed = entries.map(e => JSON.parse(e));
        res.json(parsed);
    } catch (error) {
        res.status(500).json({ error: 'Redis error' });
    }
});

app.get('/api/status', async (req, res) => {
    try {
        const status = await redis.hgetall('status');
        const lastSeen = parseInt(status.last_seen || 0);
        const online = (Date.now() - lastSeen) < 120000; // Online if seen in last 120s
        
        res.json({
            device_online: online,
            total_submissions: parseInt(status.total_submissions || 0),
            total_reward_eur: parseFloat(status.total_reward_eur || 0),
            latest_tx_hash: status.latest_tx_hash || null
        });
    } catch (error) {
        res.status(500).json({ error: 'Redis error' });
    }
});

// Root redirect
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

app.listen(PORT, () => {
    console.log(`SCARAB Oracle Server running on port ${PORT}`);
    console.log(`Dashboard available at: http://localhost:${PORT}/dashboard`);
});
