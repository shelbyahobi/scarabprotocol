// scripts/deploy_depin.js
// Deploy SCARAB DePIN Protocol contracts to BSC Testnet
// Run: npx hardhat run scripts/deploy_depin.js --network bscTestnet

const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("\n🪲 SCARAB DePIN Protocol — Deployment");
    console.log("======================================");
    console.log("Deployer:", deployer.address);
    console.log("Balance: ", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "BNB\n");

    // ─── Deployment Config ──────────────────────────────────────────────────
    // BSC Testnet PancakeSwap V2 Router
    const DEX_ROUTER = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";

    // USDC on BSC Testnet (mock address — replace with actual testnet USDC)
    const USDC_ADDRESS = process.env.USDC_ADDRESS || "0x64544969ed7EBf5f083679233325356EbE738930";

    // ScarabToken address (already deployed in Phase 1)
    const SCARAB_TOKEN = process.env.SCARAB_TOKEN_ADDRESS;
    if (!SCARAB_TOKEN) throw new Error("❌ Set SCARAB_TOKEN_ADDRESS in .env");

    // Regen Pool: 30% of 1B supply = 300M tokens (18 decimals)
    const REGEN_POOL = ethers.parseEther("300000000");

    // Factory public key — 64-byte P-256 key (testnet: use dummy)
    // In production: set to actual hardware factory P-256 public key
    const FACTORY_PUBLIC_KEY = process.env.FACTORY_PUBLIC_KEY ||
        "0x" + "ab".repeat(32) + "cd".repeat(32); // 64-byte testnet dummy

    // ─── 1. DeviceRegistry ──────────────────────────────────────────────────
    console.log("📦 Deploying DeviceRegistry...");
    const DeviceRegistry = await ethers.getContractFactory("DeviceRegistry");
    const deviceRegistry = await DeviceRegistry.deploy(
        ethers.getBytes(FACTORY_PUBLIC_KEY)
    );
    await deviceRegistry.waitForDeployment();
    const deviceRegistryAddr = await deviceRegistry.getAddress();
    console.log("   ✅ DeviceRegistry:", deviceRegistryAddr);

    // ─── 2. EmissionController ──────────────────────────────────────────────
    console.log("\n📦 Deploying EmissionController...");
    const EmissionController = await ethers.getContractFactory("EmissionController");
    const emissionController = await EmissionController.deploy(
        SCARAB_TOKEN,
        deviceRegistryAddr,
        REGEN_POOL
    );
    await emissionController.waitForDeployment();
    const emissionControllerAddr = await emissionController.getAddress();
    console.log("   ✅ EmissionController:", emissionControllerAddr);

    // ─── 3. TreasuryVault ───────────────────────────────────────────────────
    console.log("\n📦 Deploying TreasuryVault...");
    const TreasuryVault = await ethers.getContractFactory("TreasuryVault");
    const treasuryVault = await TreasuryVault.deploy(
        USDC_ADDRESS,
        SCARAB_TOKEN,
        DEX_ROUTER
    );
    await treasuryVault.waitForDeployment();
    const treasuryVaultAddr = await treasuryVault.getAddress();
    console.log("   ✅ TreasuryVault:", treasuryVaultAddr);

    // ─── 4. ProductionValidator ─────────────────────────────────────────────
    console.log("\n📦 Deploying ProductionValidator...");
    const ProductionValidator = await ethers.getContractFactory("ProductionValidator");
    const productionValidator = await ProductionValidator.deploy(
        deviceRegistryAddr,
        emissionControllerAddr,
        treasuryVaultAddr
    );
    await productionValidator.waitForDeployment();
    const productionValidatorAddr = await productionValidator.getAddress();
    console.log("   ✅ ProductionValidator:", productionValidatorAddr);

    // ─── 5. Wire Roles ──────────────────────────────────────────────────────
    console.log("\n🔗 Wiring roles...");

    // EmissionController: grant VALIDATOR_ROLE to ProductionValidator
    const VALIDATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VALIDATOR_ROLE"));
    await emissionController.grantRole(VALIDATOR_ROLE, productionValidatorAddr);
    console.log("   ✅ EmissionController → VALIDATOR_ROLE → ProductionValidator");

    // DeviceRegistry: REGISTRAR_ROLE stays with deployer (oracle service)
    const REGISTRAR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("REGISTRAR_ROLE"));
    console.log("   ℹ️  DeviceRegistry REGISTRAR_ROLE: deployer (oracle service)");

    // ─── 6. Summary ─────────────────────────────────────────────────────────
    console.log("\n======================================");
    console.log("🎉 SCARAB DePIN Suite Deployed!");
    console.log("======================================");
    console.log("DeviceRegistry:      ", deviceRegistryAddr);
    console.log("EmissionController:  ", emissionControllerAddr);
    console.log("TreasuryVault:       ", treasuryVaultAddr);
    console.log("ProductionValidator: ", productionValidatorAddr);

    console.log("\n📋 Post-Deployment Checklist:");
    console.log("  [ ] Grant MINTER_ROLE on ScarabToken to EmissionController");
    console.log("  [ ] Set oracle service wallet as ORACLE_ROLE on ProductionValidator");
    console.log("  [ ] Set REVIEWER_ROLE on ProductionValidator (multisig)");
    console.log("  [ ] Set DAO_ROLE on TreasuryVault (Timelock contract)");
    console.log("  [ ] Test: registerDevice() on DeviceRegistry");
    console.log("  [ ] Test: submitProduction() on ProductionValidator");
    console.log("  [ ] Test: claimRewards() on EmissionController");
    console.log("  [ ] Update frontend config.js with new contract addresses");

    console.log("\n🔍 Verify contracts:");
    console.log(`  npx hardhat verify --network bscTestnet ${deviceRegistryAddr}`);
    console.log(`  npx hardhat verify --network bscTestnet ${emissionControllerAddr} ${SCARAB_TOKEN} ${deviceRegistryAddr} ${REGEN_POOL}`);
    console.log(`  npx hardhat verify --network bscTestnet ${treasuryVaultAddr} ${USDC_ADDRESS} ${SCARAB_TOKEN} ${DEX_ROUTER}`);
    console.log(`  npx hardhat verify --network bscTestnet ${productionValidatorAddr} ${deviceRegistryAddr} ${emissionControllerAddr} ${treasuryVaultAddr}`);

    // Save addresses to file for frontend config
    const fs = require("fs");
    const deployData = {
        network: "bscTestnet",
        timestamp: new Date().toISOString(),
        deployer: deployer.address,
        deviceRegistry: deviceRegistryAddr,
        emissionController: emissionControllerAddr,
        treasuryVault: treasuryVaultAddr,
        productionValidator: productionValidatorAddr,
    };

    fs.writeFileSync(
        "./deployments/depin_testnet.json",
        JSON.stringify(deployData, null, 2)
    );
    console.log("\n💾 Addresses saved to deployments/depin_testnet.json");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Deployment failed:", err);
        process.exit(1);
    });
