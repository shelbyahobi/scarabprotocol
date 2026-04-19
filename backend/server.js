require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const { validateEnv } = require('./startup');
validateEnv();

// Middleware
app.use(cors());
app.use(express.json());

// Jurisdiction detection middleware (applied globally)
const { jurisdictionGuard, serveJurisdictionConfig } = require('./middleware/jurisdictionGuard');
app.use(jurisdictionGuard);

// Routes
const clusterWaitlist = require('./routes/clusterWaitlist');
const dataAccess = require('./routes/dataAccess');
const municipalityRoutes = require('./routes/municipality');
const farmerRoutes = require('./routes/farmer');
const designReviewRoute = require('./routes/designReview');

app.use('/api', clusterWaitlist);
app.use('/api/data', dataAccess);
app.use('/api/data-access', dataAccess);
app.use('/api/municipality', municipalityRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/device', farmerRoutes); // device/activate lives in farmer.js
app.use('/api/internal/design-review', designReviewRoute);

// Jurisdiction config endpoint for frontend
app.get('/api/jurisdiction', serveJurisdictionConfig);

// Public embeddable stats widget (HTML card for iframe embedding)
app.get('/api/data/widget', async (req, res) => {
    const stats = {
        total_active_devices: 4200,
        total_kwh_verified: 1542000,
        total_co2_avoided_kg: 890000,
        total_waste_processed_kg: 4500000
    };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SCARAB Network Stats</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', system-ui, sans-serif; background: #050A05; color: #fff; padding: 16px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; }
  .label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 4px; }
  .value { font-size: 24px; font-weight: 900; color: #1D9E75; }
  .footer { text-align: center; margin-top: 12px; font-size: 9px; color: #555; }
  .footer a { color: #1D9E75; text-decoration: none; }
</style>
</head>
<body>
<div class="grid">
  <div class="card"><div class="label">Active Devices</div><div class="value">${stats.total_active_devices.toLocaleString()}</div></div>
  <div class="card"><div class="label">kWh Verified</div><div class="value">${stats.total_kwh_verified.toLocaleString()}</div></div>
  <div class="card"><div class="label">CO₂ Avoided (kg)</div><div class="value">${stats.total_co2_avoided_kg.toLocaleString()}</div></div>
  <div class="card"><div class="label">Waste Processed (kg)</div><div class="value">${stats.total_waste_processed_kg.toLocaleString()}</div></div>
</div>
<div class="footer">Powered by <a href="https://scarabprotocol.org" target="_blank">SCARAB Protocol</a></div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
});

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', worker: 'scarab-oracle-api' });
});

app.listen(PORT, () => {
    console.log(`🚀 SCARAB Backend API listening on port ${PORT}`);
});
