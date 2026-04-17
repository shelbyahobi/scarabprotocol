require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const clusterWaitlist = require('./routes/clusterWaitlist');

app.use('/api', clusterWaitlist);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', worker: 'scarab-oracle-api' });
});

app.listen(PORT, () => {
    console.log(`🚀 SCARAB Backend API listening on port ${PORT}`);
});
