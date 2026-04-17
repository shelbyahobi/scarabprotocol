#!/bin/bash
# SCARAB BSC Testnet Deployment Pipeline
# This script enforces strict chronological deployment sequencing to prevent oracle dependency lockouts.

set -e

echo "============================================="
echo "🐞 SCARAB PROTOCOL TESTNET DEPLOYMENT"
echo "============================================="

# 1. Check Configuration
if [ -z "$PRIVATE_KEY" ]; then
    echo "ERROR: PRIVATE_KEY not found in environment."
    exit 1
fi

echo ">> Environment verified."

# 2. Compile contracts (triggering viaIR pipeline)
echo ">> Compiling Solidity contracts (viaIR enabled)..."
npx hardhat compile

# 3. Clean local testnet dump
rm -f testnet.json

# 4. Execute Hardhat Script
echo ">> Triggering network deployment on bscTestnet..."
npx hardhat run scripts/deploy.js --network bscTestnet

echo "============================================="
echo "✅ DEPLOYMENT COMPLETE. Awaiting verification."
echo "============================================="
