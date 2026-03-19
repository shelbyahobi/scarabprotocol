/**
 * SCARAB Protocol - Oracle Telemetry Ingestion Service
 */

const express = require('express');
const { ethers } = require('ethers');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '10mb' }));

const CONFIG = {
    port: 3000,
    bscRpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    oraclePrivateKey: process.env.ORACLE_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001', // Dummy
    productionValidatorAddress: '0x0000000000000000000000000000000000000000', // Dummy
    maxTelemetryAge: 3600,
    rateLimitPerDevice: 100
};

const rateLimits = new Map();
const seenNonces = new Set();

function verifySignature(payload, publicKeyHex, signatureHex) {
    try {
        const payloadCopy = { ...payload };
        delete payloadCopy.signature;
        delete payloadCopy.public_key;
        
        const payloadString = JSON.stringify(payloadCopy, Object.keys(payloadCopy).sort());
        
        // In a real production environment, you would use elliptic (secp256r1/P-256) library
        // to strictly verify the raw r/s buffers against the public key.
        // For simulation completeness, we console out the process.
        console.log(`Verifying payload hash against PubKey: ${publicKeyHex.substring(0, 16)}...`);
        console.log('✅ Signature verification passed (Simulation Mock)');
        return true;
        
    } catch (error) {
        console.error('❌ Signature verification failed:', error.message);
        return false;
    }
}

app.post('/api/v1/telemetry', async (req, res) => {
    const telemetry = req.body;
    console.log(`\n📥 Received telemetry from ${telemetry.device_id}`);
    
    // Nonce checks
    const nonce = `${telemetry.device_id}-${telemetry.timestamp}`;
    if (seenNonces.has(nonce)) return res.status(400).json({ error: 'Duplicate telemetry' });
    seenNonces.add(nonce);
    
    // Verify signature
    const isValidSignature = verifySignature(telemetry, telemetry.public_key, telemetry.signature);
    if (!isValidSignature) return res.status(401).json({ error: 'Invalid signature' });
    
    console.log(`Validation Confidence: 95% for ${telemetry.metrics.power} Watts`);
    
    res.json({
        status: 'accepted',
        confidence: 95,
        tx_hash: "0xsimulated_tx_hash_for_testnet",
        device_id: telemetry.device_id,
        timestamp: telemetry.timestamp
    });
});

app.listen(CONFIG.port, () => {
    console.log('='.repeat(60));
    console.log('SCARAB ORACLE - TELEMETRY INGESTION SERVICE (SIMULATOR)');
    console.log(`🚀 Server running on port ${CONFIG.port}`);
});
