const { ethers } = require("hardhat");

// ===================================================================
//  SCARAB PROTOCOL — END-TO-END BOKASHI TELEMETRY SIMULATION
//  Network: BSC Testnet (chainId 97, isTestnet=true)
//  This script deploys fresh simulation contracts and exercises the
//  full lifecycle, logging each cryptographic TX hash for VC review.
// ===================================================================

async function main() {
    console.log("\n========================================================");
    console.log(" 🧪 SCARAB PROTOCOL: END-TO-END BOKASHI MINING SIMULATION ");
    console.log("========================================================\n");

    const signers = await ethers.getSigners();
    const admin  = signers[0];
    const user   = signers.length > 1 ? signers[1] : admin;
    const oracle = signers.length > 2 ? signers[2] : admin;

    console.log(`🔑 Admin Address:  ${admin.address}`);
    console.log(`👤 User Address:   ${user.address}`);
    console.log(`🤖 Oracle Address: ${oracle.address}\n`);

    // -------------------------------------------------------------------------
    // 1. DEPLOY SIMULATION CONTRACTS
    // -------------------------------------------------------------------------
    process.stdout.write("[1/6] Deploying simulation contracts to BSC Testnet... ");

    // Mock USDC (6-decimal ERC20 — used to pay $12/mo subscription)
    const MockERC20 = await ethers.getContractFactory("contracts/mocks/MockERC20.sol:MockERC20");
    const mockUSDC = await MockERC20.deploy("USD Coin (Sim)", "USDC", ethers.parseUnits("1000000", 6), 6);
    await mockUSDC.waitForDeployment();
    const usdcAddress = await mockUSDC.getAddress();

    // Simulation SCARAB token (18-decimal ERC20 — rewards will be this)
    const mockSCARAB = await MockERC20.deploy("SCARAB (Sim)", "SCARAB", ethers.parseEther("1000000000"), 18);
    await mockSCARAB.waitForDeployment();
    const scarabAddress = await mockSCARAB.getAddress();

    // Device Registry (Simulation — directly deployable, no proxy required)
    const DeviceRegistry = await ethers.getContractFactory("MockSimulationDeviceRegistry");
    const registry = await DeviceRegistry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();

    // Emission Controller (Mock — supports accumulate + claimRewards + oracle bonus)
    const regenPool = ethers.parseEther("300000000"); // 300M SCARAB regen pool
    const EmissionController = await ethers.getContractFactory("MockSimulationEmissionController");
    const emissions = await EmissionController.deploy(scarabAddress, registryAddress, regenPool);
    await emissions.waitForDeployment();
    const emissionsAddress = await emissions.getAddress();

    // Fund the emission controller and configure oracle for the handshake bonus
    await mockSCARAB.transfer(emissionsAddress, regenPool);
    await emissions.setOracle(oracle.address);

    // Bokashi Validator — deployed with isTestnet=true so time constraints are zero
    const BokashiValidator = await ethers.getContractFactory("BokashiValidator");
    const bokashi = await BokashiValidator.deploy(
        registryAddress,
        emissionsAddress,
        ethers.ZeroAddress, // No subscription gating in simulation
        true               // isTestnet = true → minCycleDuration=0, minCooldownDuration=0
    );
    await bokashi.waitForDeployment();
    const bokashiAddress = await bokashi.getAddress();

    // Setup Roles on BokashiValidator only (registry and emission controller are mock/permissionless)
    await bokashi.grantRole(await bokashi.ORACLE_ROLE(), oracle.address);
    await bokashi.grantRole(await bokashi.BRAN_ISSUER_ROLE(), admin.address);

    console.log("✅ Done.");
    console.log(`   SCARAB (Sim):            ${scarabAddress}`);
    console.log(`   USDC (Sim):              ${usdcAddress}`);
    console.log(`   DeviceRegistry:          ${registryAddress}`);
    console.log(`   EmissionController:      ${emissionsAddress}`);
    console.log(`   BokashiValidator:        ${bokashiAddress} [isTestnet=true]`);

    // -------------------------------------------------------------------------
    // 2. HARDWARE NODE REGISTRATION (TX Hash #1)
    // -------------------------------------------------------------------------
    process.stdout.write("\n[2/6] Manufacturing & Registering Bokashi Node V1 on-chain... ");
    const deviceId = "SCARAB-BOKASHI-001";
    const devicePubKey = ethers.randomBytes(64);
    const factorySig   = ethers.randomBytes(64);
    const initialAttest = ethers.id("ATECC608A:ATTEST:V1");

    // DeviceType enum index 4 = Bokashi_Home
    const registerTx = await registry.registerDevice(
        deviceId, user.address, 4,
        "ipfs://bafkreiexamplehardwaremetadatacid",
        devicePubKey, factorySig, initialAttest
    );
    await registerTx.wait();
    const deviceIdHash = ethers.keccak256(ethers.toUtf8Bytes(deviceId));
    console.log("✅ Done.");
    console.log(`   🔗 [TX #1] Device Activation:   ${registerTx.hash}`);
    console.log(`      🔎 https://testnet.bscscan.com/tx/${registerTx.hash}`);
    // -------------------------------------------------------------------------
    // 3. SCAN BRAN QR CODE → START CYCLE  (TX Hash #2)
    // -------------------------------------------------------------------------
    process.stdout.write("\n[3/6] User scans physical Bran Bag QR Code to start fermentation cycle... ");
    const branNonce = ethers.hexlify(ethers.randomBytes(16)).substring(2);
    const msgHash  = ethers.solidityPackedKeccak256(["string"], [branNonce]);
    const signature = await admin.signMessage(ethers.getBytes(msgHash));

    const startTx = await bokashi.connect(user).startCycle(deviceIdHash, branNonce, signature);
    await startTx.wait();
    console.log("✅ Done.");
    console.log(`   🔗 [TX #2] Cycle Start:          ${startTx.hash}`);
    console.log(`      🔎 https://testnet.bscscan.com/tx/${startTx.hash}`);

    // -------------------------------------------------------------------------
    // 4. ORACLE SUBMITS INTERMEDIATE TELEMETRY  (TX Hashes #3, #4, #5)
    //    Simulates 3 firmware readings across the 15-day composting window:
    //    Day 3 → temp rising, Day 8 → peak fermentation, Day 13 → stabilising
    // -------------------------------------------------------------------------
    console.log("\n[4/6] 📡 Oracle pushing intermediate telemetry to chain (3-reading window)...");

    const t1 = await bokashi.connect(oracle).logTelemetry(deviceIdHash, 28, 4950); // Day 3: 28°C, 4950g
    await t1.wait();
    console.log(`   🔸 [TX #3] Telemetry Day 3  | Temp: 28°C | Weight: 4950g | ${t1.hash}`);
    console.log(`      🔎 https://testnet.bscscan.com/tx/${t1.hash}`);

    const t2 = await bokashi.connect(oracle).logTelemetry(deviceIdHash, 38, 4730); // Day 8: 38°C peak, 4730g
    await t2.wait();
    console.log(`   🔸 [TX #4] Telemetry Day 8  | Temp: 38°C | Weight: 4730g | ${t2.hash}`);
    console.log(`      🔎 https://testnet.bscscan.com/tx/${t2.hash}`);

    const t3 = await bokashi.connect(oracle).logTelemetry(deviceIdHash, 35, 4520); // Day 13: stabilising, 4520g
    await t3.wait();
    console.log(`   🔸 [TX #5] Telemetry Day 13 | Temp: 35°C | Weight: 4520g | ${t3.hash}`);
    console.log(`      🔎 https://testnet.bscscan.com/tx/${t3.hash}`);
    console.log("   ✅ 3-point telemetry chain committed.");

    // -------------------------------------------------------------------------
    // 5. ORACLE CLOSES CYCLE + VALIDATOR LOGIC RUNS  (TX Hash #6)
    // -------------------------------------------------------------------------
    console.log("\n[5/6] Oracle submitting final validated cycle data...");
    const cycleStartTime = await bokashi.activeCycleStartTime(deviceIdHash);
    const startWeight = 5000; // 5.0 kg initial mass
    const peakTemp    = 38;   // 38°C — ideal fermentation
    const gasPPM      = 900;  // 900 ppm CO2/VOC — ideal
    const endWeight   = 4500; // 4.5 kg — 10% mass loss (perfect range)
    const lidOpenings = 4;    // minimal oxygen exposure
    const avgFill     = 4750; // average fill weight (proof of mass, >2000g threshold)

    const completionTx = await bokashi.connect(oracle).submitBokashiCycle(
        deviceIdHash, cycleStartTime,
        startWeight, peakTemp, gasPPM, endWeight,
        lidOpenings, avgFill
    );
    await completionTx.wait();
    console.log(`   🔗 [TX #6] Cycle Completion:     ${completionTx.hash}`);
    console.log(`      🔎 https://testnet.bscscan.com/tx/${completionTx.hash}`);

    // -------------------------------------------------------------------------
    // 6. USER CLAIMS REWARDS (HANDSHAKE TX)  (TX Hash #7)
    //    MockSimulationEmissionController splits 80% → user, 20% → oracle
    // -------------------------------------------------------------------------
    console.log("\n[6/6] User claiming SCARAB rewards (handshake — dual-wallet bonus distribution)...");
    const oracleBalanceBefore = await mockSCARAB.balanceOf(oracle.address);

    const handshakeTx = await emissions.connect(user).claimRewards();
    await handshakeTx.wait();

    const userBalance   = await mockSCARAB.balanceOf(user.address);
    const oracleBalance = await mockSCARAB.balanceOf(oracle.address);
    const oracleBonus   = oracleBalance - oracleBalanceBefore;

    console.log(`   🔗 [TX #7] Handshake (BRU Mint): ${handshakeTx.hash}`);
    console.log(`      🔎 https://testnet.bscscan.com/tx/${handshakeTx.hash}`);

    // -------------------------------------------------------------------------
    // SUMMARY — CRYPTOGRAPHIC PROOF CHAIN
    // -------------------------------------------------------------------------
    console.log("\n╔════════════════════════════════════════════════════════════╗");
    console.log("║         SIMULATION COMPLETE — PROOF CHAIN SUMMARY         ║");
    console.log("╠════════════════════════════════════════════════════════════╣");
    console.log(`║ [TX #1] Device Activation:  ${registerTx.hash.substring(0,20)}...  ║`);
    console.log(`║ [TX #2] Cycle Start:         ${startTx.hash.substring(0,20)}...  ║`);
    console.log(`║ [TX #3] Telemetry Day 3:     ${t1.hash.substring(0,20)}...  ║`);
    console.log(`║ [TX #4] Telemetry Day 8:     ${t2.hash.substring(0,20)}...  ║`);
    console.log(`║ [TX #5] Telemetry Day 13:    ${t3.hash.substring(0,20)}...  ║`);
    console.log(`║ [TX #6] Cycle Completion:    ${completionTx.hash.substring(0,20)}...  ║`);
    console.log(`║ [TX #7] Handshake (BRU):     ${handshakeTx.hash.substring(0,20)}...  ║`);
    console.log("╠════════════════════════════════════════════════════════════╣");
    console.log(`║ User SCARAB Reward:     ${ethers.formatEther(userBalance).padEnd(12)} $SCARAB (80%)       ║`);
    console.log(`║ Oracle Bonus Received:  ${ethers.formatEther(oracleBonus).padEnd(12)} $SCARAB (20%)       ║`);
    console.log("╚════════════════════════════════════════════════════════════╝\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
