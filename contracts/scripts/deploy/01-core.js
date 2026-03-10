const hre = require("hardhat");
const { ethers, upgrades } = hre;
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("⚙️  Deploying Core Protocol Contracts (UUPS)...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    // Load Governance
    const deploymentDir = path.join(__dirname, '../../deployments');
    const governancePath = path.join(deploymentDir, `00-governance-${hre.network.name}.json`);
    if (!fs.existsSync(governancePath)) {
        throw new Error("Governance deployment not found. Run 00-governance.js first.");
    }
    const governance = JSON.parse(fs.readFileSync(governancePath));
    const TIMELOCK = governance.timelock;

    // 1. Deploy SCARABToken (UUPS Proxy)
    console.log("1️⃣  Deploying SCARABToken...");
    const SCARABToken = await ethers.getContractFactory("SCARABToken");
    const scarabToken = await upgrades.deployProxy(
        SCARABToken,
        [TIMELOCK, TIMELOCK], // defaultAdmin, upgrader
        { kind: 'uups', initializer: 'initialize' }
    );
    await scarabToken.waitForDeployment();
    const tokenAddress = await scarabToken.getAddress();
    const tokenImpl = await upgrades.erc1967.getImplementationAddress(tokenAddress);

    console.log("✅ SCARABToken Proxy:", tokenAddress);
    console.log("   Implementation:", tokenImpl);

    // 2. Deploy DeviceRegistry (UUPS Proxy)
    console.log("\n2️⃣  Deploying DeviceRegistry...");
    const DeviceRegistry = await ethers.getContractFactory("DeviceRegistry");
    const factoryKey = "0x" + "0".repeat(128); // Placeholder P-256 Public Key (64 bytes)

    const deviceRegistry = await upgrades.deployProxy(
        DeviceRegistry,
        [factoryKey, TIMELOCK, TIMELOCK],
        { kind: 'uups', initializer: 'initialize' }
    );
    await deviceRegistry.waitForDeployment();
    const registryAddress = await deviceRegistry.getAddress();
    const registryImpl = await upgrades.erc1967.getImplementationAddress(registryAddress);

    console.log("✅ DeviceRegistry Proxy:", registryAddress);
    console.log("   Implementation:", registryImpl);

    // Save deployments
    const coreDeployments = {
        scarabToken: {
            proxy: tokenAddress,
            implementation: tokenImpl
        },
        deviceRegistry: {
            proxy: registryAddress,
            implementation: registryImpl
        },
        network: hre.network.name,
        deployedAt: new Date().toISOString()
    };

    fs.writeFileSync(
        path.join(deploymentDir, `01-core-${hre.network.name}.json`),
        JSON.stringify(coreDeployments, null, 2)
    );

    console.log("\n📝 Core addresses saved.\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
