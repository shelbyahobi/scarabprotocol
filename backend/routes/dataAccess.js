const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Fallback for admin notifications
const { validateDataAccess, redis } = require('../middleware/dataAccessMiddleware');

// Admin Auth Middleware explicitly for /activate logic
const adminGuard = (req, res, next) => {
    const auth = req.header('Authorization');
    if (!auth || auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
};

/**
 * POST /api/data-access/request
 * Stores pending request in Redis and notifies admin
 */
router.post('/request', async (req, res) => {
    try {
        const { entity_name, entity_type, jurisdiction, contact_email } = req.body;
        
        if (!entity_name || !contact_email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const reqId = `pending_req:${Date.now()}`;
        const payload = JSON.stringify({ entity_name, entity_type, jurisdiction, contact_email, timestamp: Date.now() });
        
        await redis.set(reqId, payload);

        // Notify Admin (Fallback to console if SMTP env missing)
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            });
            await transporter.sendMail({
                from: '"SCARAB System" <system@scarabprotocol.org>',
                to: 'admin@scarabprotocol.org',
                subject: `New API Key Request: ${entity_name}`,
                text: `Entity: ${entity_name}\nType: ${entity_type}\nJurisdiction: ${jurisdiction}\nEmail: ${contact_email}`
            });
        } else {
            console.log(`[SMTP FALLBACK] MailTo Admin -> New API Key Request from ${contact_email}`);
        }

        res.status(200).json({ status: 'queued', message: 'Request submitted successfully' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * POST /api/data-access/activate (Admin Only)
 * Activates key, sets H3 cell scope, sets tier
 */
router.post('/activate', adminGuard, async (req, res) => {
    try {
        const { entity_name, access_tier, jurisdiction_h3_cells } = req.body;
        
        // Generate a new API Key for the user
        const rawApiKey = crypto.randomBytes(32).toString('hex');
        const hash = Buffer.from(rawApiKey).toString('base64');
        
        const payload = {
            entity_name,
            access_tier,
            jurisdiction_h3_cells: jurisdiction_h3_cells || [],
            expires_at: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
        };

        await redis.set(`apikey:${hash}`, JSON.stringify(payload));

        res.status(200).json({ 
            message: 'API Key Activated', 
            api_key: rawApiKey, // Output once to send via secure channel manually
            tier: access_tier 
        });
    } catch(err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

/**
 * GET /api/data/aggregate
 * Public, no key required, returns network stats without device IDs
 */
router.get('/aggregate', validateDataAccess, async (req, res) => {
    // Mock aggregated metrics fetched via Redis metrics loops
    const aggregateStats = {
        total_active_devices: 4200,
        total_kwh_verified: 1542000,
        total_co2_avoided_kg: 890000,
        total_waste_processed_kg: 4500000 
    };

    res.status(200).json(aggregateStats);
});

/**
 * GET /api/data/jurisdiction/:h3index
 * Municipality tier - returns specific data for their district.
 */
router.get('/jurisdiction/:h3index', validateDataAccess, async (req, res) => {
    const { h3index } = req.params;
    
    // GATING: Enforce municipality tier
    if (req.apiContext.tier !== 'municipality' && req.apiContext.tier !== 'corporate') {
        return res.status(401).json({ error: 'Access Denied: Municipality or Corporate API Key Required' });
    }

    // GATING: Ensure requested H3 index is within their assigned jurisdiction
    if (req.apiContext.tier === 'municipality' && !req.apiContext.jurisdiction_h3_cells.includes(h3index)) {
        return res.status(403).json({ error: 'Access Denied: Requested jurisdiction is outside of your license scope' });
    }

    // Mock data scoped to H3
    const cellStats = {
        h3_cell: h3index,
        device_count: 142,
        aggregate_energy_kwh: 5400,
        aggregate_waste_kg: 18000
    };

    res.status(200).json(cellStats);
});

/**
 * GET /api/data/devices
 * Corporate tier - returns full device list with last telemetry for licensed cells.
 */
router.get('/devices', validateDataAccess, async (req, res) => {
    // GATING
    if (req.apiContext.tier !== 'corporate') {
        return res.status(401).json({ error: 'Access Denied: Corporate Level Data Firehose Requires Full Node Operator API License.' });
    }

    // Mock response simulating raw array of devices
    const deviceData = [
        { device_id_hash: '0x1a2b3c', h3_cell_level5: '852834bffffffff', energy_wh: 120, waste_kg: 14, timestamp: Date.now() },
        { device_id_hash: '0x9z8y7x', h3_cell_level5: '852834bffffffff', energy_wh: 80, waste_kg: 9, timestamp: Date.now() - 10000 }
    ];

    res.status(200).json({ devices: deviceData });
});

module.exports = router;
