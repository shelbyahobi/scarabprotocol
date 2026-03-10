const hre = require("hardhat");
const { ethers, upgrades } = hre;
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("💰  Deploying Treasury & Emission Infrastructure (UUPS)...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    // Load Governance & Core
    const deploymentDir = path.join(__dirname, '../../deployments');
    const govPath = path.join(deploymentDir, `00-governance-${hre.network.name}.json`);
    const corePath = path.join(deploymentDir, `01-core-${hre.network.name}.json`);

    const governance = JSON.parse(fs.readFileSync(govPath));
    const core = JSON.parse(fs.readFileSync(corePath));

    const TIMELOCK = governance.timelock;
    const TOKEN = core.scarabToken.proxy;
    const REGISTRY = core.deviceRegistry.proxy;

    // 1. Deploy TreasuryVault
    // Mocking USDC and Router for Phase 1 Template
    const MOCK_USDC = "0x" + "0".repeat(40);
    const MOCK_ROUTER = "0x" + "0".repeat(40);

    console.log("1️⃣  Deploying TreasuryVault...");
    const TreasuryVault = await ethers.getContractFactory("TreasuryVault");
    // constructor args: usdc, scarabToken, dexRouter
    const treasuryVault = await TreasuryVault.deploy(MOCK_USDC, TOKEN, MOCK_ROUTER);
    await treasuryVault.waitForDeployment();
    const treasuryVaultAddress = await treasuryVault.getAddress();
    console.log("✅ TreasuryVault deployed:", treasuryVaultAddress);

    // 2. Deploy EmissionController (UUPS Proxy)
    console.log("\n2️⃣  Deploying EmissionController...");
    const EmissionController = await ethers.getContractFactory("EmissionController");
    const emissionController = await upgrades.deployProxy(
        EmissionController,
        [TOKEN, REGISTRY, TIMELOCK, TIMELOCK],
        { kind: 'uups', initializer: 'initialize' }
    );
    await emissionController.waitForDeployment();
    const emissionAddress = await emissionController.getAddress();
    const emissionImpl = await upgrades.erc1967.getImplementationAddress(emissionAddress);

    console.log("✅ EmissionController Proxy:", emissionAddress);
    console.log("   Implementation:", emissionImpl);

    // Save deployments
    const treasuryDeployments = {
        treasuryVault: treasuryVaultAddress,
        emissionController: {
            proxy: emissionAddress,
            implementation: emissionImpl
        },
        network: hre.network.name,
        deployedAt: new Date().toISOString()
    };

    fs.writeFileSync(
        path.join(deploymentDir, `02-treasury-${hre.network.name}.json`),
        JSON.stringify(treasuryDeployments, null, 2)
    );

    console.log("\n📝 Treasury addresses saved.\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
