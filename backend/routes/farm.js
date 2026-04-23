const express = require('express');
const router = express.Router();
const Redis = require('ioredis');
const { calculateSoilingLoss } = require('../services/soilingCalculator');
const { generateComplianceReport } = require('../services/complianceReport');

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Mock data generation for soiling (usually this comes from hardware)
router.get('/soiling/:device_id', async (req, res) => {
    try {
        const { device_id } = req.params;
        
        // In a real app, we'd fetch actual sensor readings from Redis/DB
        // Here we mock the photodiode lux values
        const refIrradiance = 100000; // lux
        const soiledIrradiance = 96800; // lux (3.2% loss)
        const systemKwp = 100; // 100 kWp system
        const energyRate = parseFloat(process.env.VITE_FIAT_RATE_ENERGY || 0.08);

        const metrics = calculateSoilingLoss(refIrradiance, soiledIrradiance, systemKwp, energyRate);
        
        // check when last cleaned
        const lastCleaned = await redis.get(`farm:cleaning:${device_id}`);
        const daysSinceClean = lastCleaned ? Math.floor((Date.now() - parseInt(lastCleaned)) / (1000 * 60 * 60 * 24)) : 45;

        res.json({
            ...metrics,
            daysSinceLastClean: daysSinceClean
        });
    } catch (err) {
        console.error('[FARM] Soiling error:', err);
        res.status(500).json({ error: 'Failed to calculate soiling' });
    }
});

router.post('/cleaning-log', async (req, res) => {
    try {
        const { device_id } = req.body;
        if (!device_id) return res.status(400).json({ error: 'device_id required' });

        const timestamp = Date.now();
        await redis.set(`farm:cleaning:${device_id}`, timestamp);

        res.json({ status: 'logged', timestamp });
    } catch (err) {
        console.error('[FARM] Cleaning log error:', err);
        res.status(500).json({ error: 'Failed to log cleaning event' });
    }
});

router.get('/compliance-report/:device_id', async (req, res) => {
    try {
        const { device_id } = req.params;
        const mockData = {
            deviceId: device_id,
            h3Cell: '881f1d4887fffff',
            installationDate: '2026-01-15',
            tier: 'AgriSentinel Pro',
            laiAvg: '2.4',
            soilHealthAvg: '4.2',
            microclimateAvg: '3.1',
            signature: '304402207a9...'
        };
        const pdfBuffer = await generateComplianceReport(mockData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="compliance_report_${device_id}.pdf"`);
        res.send(pdfBuffer);
    } catch (err) {
        console.error('[FARM] Report generation error:', err);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

module.exports = router;
