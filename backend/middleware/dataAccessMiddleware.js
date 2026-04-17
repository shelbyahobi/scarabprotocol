const Redis = require('ioredis');

// Connect to real Redis instance
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Middleware: Validates X-SCARAB-API-KEY and applies data access tier scopes.
 * Off-chain telemetry endpoints are strictly gated by this.
 */
async function validateDataAccess(req, res, next) {
    const apiKey = req.header('X-SCARAB-API-KEY');

    // If no key is provided, the request is restricted to the 'public' tier logic
    if (!apiKey) {
        req.apiContext = {
            tier: 'public',
            entity_name: 'Anonymous',
            jurisdiction_h3_cells: []
        };
        return next();
    }

    try {
        const hash = Buffer.from(apiKey).toString('base64'); // Simple encoding for mock lookup mechanism
        const keyDataStr = await redis.get(`apikey:${hash}`);

        if (!keyDataStr) {
            return res.status(401).json({ error: 'Invalid API Key' });
        }

        const keyData = JSON.parse(keyDataStr);

        if (keyData.expires_at && Date.now() > keyData.expires_at) {
            return res.status(401).json({ error: 'API Key Expired' });
        }

        req.apiContext = {
            tier: keyData.access_tier, // 'public', 'municipality', 'corporate'
            entity_name: keyData.entity_name,
            jurisdiction_h3_cells: keyData.jurisdiction_h3_cells || []
        };

        next();
    } catch (err) {
        console.error('Redis API Key Validation Error:', err);
        return res.status(500).json({ error: 'Internal server error validating access control' });
    }
}

module.exports = { validateDataAccess, redis };
