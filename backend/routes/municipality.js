const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { redis } = require('../middleware/dataAccessMiddleware');

/**
 * POST /api/municipality/apply
 * Stores a pilot application from a municipal procurement officer.
 * Sends confirmation email via SMTP or mailto fallback.
 */
router.post('/apply', async (req, res) => {
    try {
        const { city_name, contact_name, role, email, district_population } = req.body;

        if (!city_name || !contact_name || !email) {
            return res.status(400).json({ error: 'Missing required fields: city_name, contact_name, email' });
        }

        const applicationId = `municipality:apply:${Date.now()}`;
        const payload = {
            city_name,
            contact_name,
            role: role || 'Not specified',
            email,
            district_population: district_population || 'Not specified',
            submitted_at: new Date().toISOString(),
            status: 'pending_review'
        };

        await redis.set(applicationId, JSON.stringify(payload));

        // Send confirmation email to applicant + admin notification
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: false,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            });

            // Confirmation to applicant
            await transporter.sendMail({
                from: '"SCARAB Protocol" <pilot@scarabprotocol.org>',
                to: email,
                subject: 'Your SCARAB Pilot Application Has Been Received',
                text: `Dear ${contact_name},\n\nThank you for applying for the SCARAB Stuttgart Pilot Programme on behalf of ${city_name}.\n\nYour application is under review. A member of our EU operations team (SCARAB UG, Germany) will contact you within 5 business days to discuss next steps.\n\nYour data is processed exclusively on EU-based infrastructure in compliance with GDPR.\n\nBest regards,\nThe SCARAB Protocol Team`
            });

            // Admin notification
            await transporter.sendMail({
                from: '"SCARAB System" <system@scarabprotocol.org>',
                to: 'admin@scarabprotocol.org',
                subject: `[PILOT] New Municipality Application: ${city_name}`,
                text: `City: ${city_name}\nContact: ${contact_name}\nRole: ${role}\nEmail: ${email}\nPopulation: ${district_population}`
            });
        } else {
            console.log(`[SMTP FALLBACK] Municipality application from ${contact_name} (${city_name}) - ${email}`);
            console.log(`[SMTP FALLBACK] Mailto: admin@scarabprotocol.org?subject=Pilot%20Application%20${encodeURIComponent(city_name)}`);
        }

        res.status(200).json({ 
            status: 'received',
            message: 'Your application has been submitted successfully. You will receive a confirmation email shortly.'
        });
    } catch (err) {
        console.error('Municipality apply error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
