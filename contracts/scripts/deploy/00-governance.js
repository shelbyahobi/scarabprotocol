const hre = require("hardhat");
const { ethers } = hre;
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("🏛️  Deploying Governance Infrastructure...\n");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    
    // Configuration - Foundation Safe (5-of-9)
    const GOVERNANCE_SAFE = process.env.GOVERNANCE_SAFE_ADDRESS;
    const MIN_DELAY = 48 * 60 * 60; // 48 hours
    
    if (!GOVERNANCE_SAFE) {
        console.warn("⚠️ GOVERNANCE_SAFE_ADDRESS not set in .env. Using deployer for testing.");
    }
    const finalProposer = GOVERNANCE_SAFE || deployer.address;
    
    // 1. Deploy TimelockController
    const TimelockController = await ethers.getContractFactory("ScarabTimelockController");
    
    const proposers = [finalProposer];
    const executors = [ethers.ZeroAddress]; // Anyone can execute matured tx
    const admin = deployer.address; // Temporary logic admin
    
    const timelock = await TimelockController.deploy(
        proposers,
        executors,
        admin
    );
    await timelock.waitForDeployment();
    const timelockAddress = await timelock.getAddress();
    
    console.log("✅ TimelockController deployed:", timelockAddress);
    console.log("   Min Delay:", MIN_DELAY / 3600, "hours");
    console.log("   Proposers:", proposers);
    
    // 2. Deploy ProxyAdmin (Owned by Timelock)
    const ProxyAdmin = await ethers.getContractFactory("ScarabProxyAdmin");
    const proxyAdmin = await ProxyAdmin.deploy(timelockAddress);
    await proxyAdmin.waitForDeployment();
    const proxyAdminAddress = await proxyAdmin.getAddress();
    
    console.log("✅ ProxyAdmin deployed:", proxyAdminAddress);
    console.log("   Owner:", timelockAddress);
    
    // Save deployments
    const deploymentDir = path.join(__dirname, '../../deployments');
    if (!fs.existsSync(deploymentDir)) fs.mkdirSync(deploymentDir);
    
    const deployments = {
        timelock: timelockAddress,
        proxyAdmin: proxyAdminAddress,
        governanceSafe: finalProposer,
        network: hre.network.name,
        deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
        path.join(deploymentDir, `00-governance-${hre.network.name}.json`),
        JSON.stringify(deployments, null, 2)
    );
    
    console.log("\n📝 Governance addresses saved.\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
