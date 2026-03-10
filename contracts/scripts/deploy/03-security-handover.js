const hre = require("hardhat");
const { ethers } = hre;
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("🔐 Security Handover: Revoking Deployer & Empowering Timelock...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Current deployer:", deployer.address);

    // Load All Deployment Records
    const deploymentDir = path.join(__dirname, '../../deployments');
    const govPath = path.join(deploymentDir, `00-governance-${hre.network.name}.json`);
    const corePath = path.join(deploymentDir, `01-core-${hre.network.name}.json`);
    const trsyPath = path.join(deploymentDir, `02-treasury-${hre.network.name}.json`);

    const governance = JSON.parse(fs.readFileSync(govPath));
    const core = JSON.parse(fs.readFileSync(corePath));
    const treasury = JSON.parse(fs.readFileSync(trsyPath));

    const TIMELOCK = governance.timelock;
    const TOKEN = core.scarabToken.proxy;
    const REGISTRY = core.deviceRegistry.proxy;
    const EMISSION = treasury.emissionController.proxy;

    // Contract Instances
    const scarabToken = await ethers.getContractAt("SCARABToken", TOKEN);
    const deviceRegistry = await ethers.getContractAt("DeviceRegistry", REGISTRY);
    const emissionController = await ethers.getContractAt("EmissionController", EMISSION);

    const DEFAULT_ADMIN_ROLE = await scarabToken.DEFAULT_ADMIN_ROLE();
    const MINTER_ROLE = await scarabToken.MINTER_ROLE();

    console.log("Step 1: Granting Roles to Timelock...");
    await (await scarabToken.grantRole(DEFAULT_ADMIN_ROLE, TIMELOCK)).wait();
    await (await deviceRegistry.grantRole(DEFAULT_ADMIN_ROLE, TIMELOCK)).wait();
    await (await emissionController.grantRole(DEFAULT_ADMIN_ROLE, TIMELOCK)).wait();
    console.log("✅ Timelock is now Default Admin.");

    console.log("\nStep 2: Linking Logic (Minter Role)...");
    await (await scarabToken.grantRole(MINTER_ROLE, EMISSION)).wait();
    console.log("✅ EmissionController can now mint.");

    console.log("\nStep 3: Revoking Deployer Roles...");
    await (await scarabToken.revokeRole(DEFAULT_ADMIN_ROLE, deployer.address)).wait();
    await (await deviceRegistry.revokeRole(DEFAULT_ADMIN_ROLE, deployer.address)).wait();
    await (await emissionController.revokeRole(DEFAULT_ADMIN_ROLE, deployer.address)).wait();
    console.log("✅ Deployer Admin roles revoked.");

    // Final Revocation of Timelock Admin itself (The 'admin' param in constructor)
    const timelock = await ethers.getContractAt("ScarabTimelockController", TIMELOCK);
    const TIMELOCK_ADMIN_ROLE = await timelock.DEFAULT_ADMIN_ROLE();
    await (await timelock.revokeRole(TIMELOCK_ADMIN_ROLE, deployer.address)).wait();
    console.log("✅ Deployer Timelock-Admin role revoked.");

    console.log("\nStep 4: Verification Assertions...");
    const hasAdmin = await scarabToken.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
    if (hasAdmin) throw new Error("🚨 SECURITY BREACH: Deployer still has admin role!");

    const timelockHasAdmin = await scarabToken.hasRole(DEFAULT_ADMIN_ROLE, TIMELOCK);
    if (!timelockHasAdmin) throw new Error("🚨 FAILURE: Timelock failed to receive admin role!");

    console.log("\n" + "=".repeat(60));
    console.log("🎉 SECURITY HANDOVER COMPLETE");
    console.log("=".repeat(60));

    // Emit Handover Proof Record
    const configHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
            ['address', 'address', 'address'],
            [TOKEN, REGISTRY, EMISSION]
        )
    );

    const handover = {
        timelock: TIMELOCK,
        configHash: configHash,
        networks: hre.network.name,
        timestamp: new Date().toISOString(),
        deployerRevoked: true
    };

    fs.writeFileSync(
        path.join(deploymentDir, `03-handover-${hre.network.name}.json`),
        JSON.stringify(handover, null, 2)
    );

    console.log("📝 Handover Complete Record Saved.\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
