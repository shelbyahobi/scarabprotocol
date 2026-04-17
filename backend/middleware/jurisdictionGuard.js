const jurisdictions = require('../config/jurisdictions.json');

/**
 * Middleware: Detects user country and injects rules into the request object.
 * Used by endpoints that need to format or error early based on regional limits.
 */
function jurisdictionGuard(req, res, next) {
    let countryCode = req.query.country || 'US';

    // Fallback naive detection
    if (!req.query.country && req.headers['accept-language']) {
        if (req.headers['accept-language'].includes('de')) {
            countryCode = 'DE';
        } else if (req.headers['accept-language'].includes('fr')) {
            countryCode = 'FR';
        } else if (req.headers['accept-language'].includes('nl')) {
            countryCode = 'NL';
        }
    }

    const config = jurisdictions[countryCode] || jurisdictions['US'];

    req.jurisdiction = {
        code: countryCode,
        ...config
    };

    next();
}

/**
 * Endpoint to serve frontend jurisdiction requests.
 * The frontend will call GET /api/jurisdiction to know what UI to render.
 */
function serveJurisdictionConfig(req, res) {
    res.json(req.jurisdiction);
}

module.exports = { jurisdictionGuard, serveJurisdictionConfig };
