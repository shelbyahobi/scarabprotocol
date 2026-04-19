const express = require('express');
const router = express.Router();

/**
 * POST /api/internal/design-review
 * Internal-only Claude API proxy for design feedback.
 *
 * Authentication: ADMIN_SECRET header required.
 * The Anthropic API key (ANTHROPIC_API_KEY) NEVER touches the browser bundle.
 * This is a server-side-only proxy — do not expose this route publicly.
 *
 * Usage:
 *   curl -X POST http://localhost:3001/api/internal/design-review \
 *     -H "x-admin-secret: YOUR_ADMIN_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"pageSection": "Municipal hero section copy"}'
 */
router.post('/', async (req, res) => {
    // Auth gate
    const adminSecret = req.headers['x-admin-secret'];
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
        return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server' });
    }

    const { pageSection } = req.body;
    if (!pageSection || typeof pageSection !== 'string') {
        return res.status(400).json({ error: 'pageSection (string) is required' });
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': anthropicKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: [{
                    role: 'user',
                    content: `You are a senior product designer reviewing a DePIN protocol website targeting European municipalities and impact investors. Review this page section and suggest one specific improvement to make it more professional and trustworthy for a German procurement officer. Be concrete, not generic.\n\nSection:\n${pageSection}`
                }]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('[DESIGN-REVIEW] Anthropic API error:', response.status, errText);
            return res.status(502).json({ error: 'Upstream API error', detail: response.status });
        }

        const data = await response.json();
        const suggestion = data?.content?.[0]?.text || 'No suggestion returned.';

        res.json({ suggestion });
    } catch (err) {
        console.error('[DESIGN-REVIEW] Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
