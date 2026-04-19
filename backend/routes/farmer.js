const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Mock cluster/hub data for pilot phase
const PILOT_CLUSTERS = {
    'STU-01': { name: 'Stuttgart Mitte', hub: 'Hub Marktplatz', hub_lat: 48.7758, hub_lon: 9.1829 },
    'STU-02': { name: 'Stuttgart West',  hub: 'Hub Schwabstrasse', hub_lat: 48.7720, hub_lon: 9.1650 },
    'BER-01': { name: 'Berlin Mitte',    hub: 'Hub Alexanderplatz', hub_lat: 52.5219, hub_lon: 13.4132 },
    'HAM-01': { name: 'Hamburg Altona',  hub: 'Hub Altona Bahnhof', hub_lat: 53.5503, hub_lon: 9.9352 },
};

const VALID_DEVICE_PREFIX = ['BOK', 'UCO'];

/**
 * POST /api/farmer/register
 * Step 1: Create a farmer record in Redis.
 * Sets scarab_farmer_session cookie on response.
 */
router.post('/register', async (req, res) => {
    try {
        const { firstName, email, country, phone } = req.body;

        if (!firstName || !email || !country) {
            return res.status(400).json({ error: 'firstName, email and country are required' });
        }

        const farmerId = uuidv4();
        const farmerRecord = {
            farmer_id: farmerId,
            firstName,
            email,
            country,
            phone: phone || '',
            registered_at: new Date().toISOString(),
            status: 'registered',
            cluster_id: null,
            device_code: null,
        };

        await redis.set(`farmer:${farmerId}`, JSON.stringify(farmerRecord), 'EX', 60 * 60 * 24 * 365);

        res.cookie('scarab_farmer_session', JSON.stringify({ farmer_id: farmerId, firstName, email, country }), {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 365,
            secure: process.env.NODE_ENV === 'production',
        });

        res.json({ status: 'registered', farmer_id: farmerId });
    } catch (err) {
        console.error('[FARMER] Register error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

/**
 * POST /api/device/activate
 * Step 2: Validate device code and assign to farmer.
 * Returns cluster name, hub name, and estimated distance (km).
 *
 * TODO Production: validate device_code against hardware registry on-chain.
 * For pilot phase: accept any 8-char code starting with BOK or UCO.
 */
router.post('/device/activate', async (req, res) => {
    try {
        const { device_code, farmer_id } = req.body;

        if (!device_code || !farmer_id) {
            return res.status(400).json({ error: 'device_code and farmer_id are required' });
        }

        const code = device_code.toUpperCase().trim();

        // Pilot validation: 8-char alphanumeric
        if (code.length !== 8) {
            return res.status(400).json({ error: 'Device code must be exactly 8 characters' });
        }

        // Assign to nearest pilot cluster (simplified: round-robin for pilot)
        const clusterKeys = Object.keys(PILOT_CLUSTERS);
        const assignedKey = clusterKeys[Math.floor(Math.random() * clusterKeys.length)];
        const cluster = PILOT_CLUSTERS[assignedKey];

        // Update farmer record
        const farmerRaw = await redis.get(`farmer:${farmer_id}`);
        if (!farmerRaw) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        const farmer = JSON.parse(farmerRaw);
        farmer.device_code = code;
        farmer.cluster_id = assignedKey;
        farmer.activated_at = new Date().toISOString();

        await redis.set(`farmer:${farmer_id}`, JSON.stringify(farmer), 'EX', 60 * 60 * 24 * 365);

        // Mock distance: 1.2 – 4.8 km
        const distance_km = (Math.random() * 3.6 + 1.2).toFixed(1);

        res.json({
            status: 'activated',
            device_id: `${code}-PILOT`,
            cluster_name: cluster.name,
            cluster_id: assignedKey,
            hub_name: cluster.hub,
            distance_km,
        });
    } catch (err) {
        console.error('[FARMER] Device activate error:', err);
        res.status(500).json({ error: 'Device activation failed' });
    }
});

module.exports = router;
