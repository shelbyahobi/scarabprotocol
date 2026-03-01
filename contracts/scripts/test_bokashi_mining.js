const { ethers, network } = require("hardhat");
const { toEthSignedMessageHash } = require("ethers");

async function main() {
    console.log("\n========================================================");
    console.log(" 🧪 SCARAB PROTOCOL: END-TO-END BOKASHI MINING SIMULATION ");
    console.log("========================================================\n");

    const [admin, user, oracle] = await ethers.getSigners();
    console.log(`👤 User Address:   ${user.address}`);
    console.log(`🤖 Oracle Address: ${oracle.address}\n`);

    // -------------------------------------------------------------------------
    // 1. DEPLOY MOCK CONTRACTS
    // -------------------------------------------------------------------------
    process.stdout.write("[1/6] Deploying Protocol Contracts... ");

    // Mock USDC for Subscription (Using ScarabToken contract as a generic ERC20 for the simulation)
    const ScarabToken = await ethers.getContractFactory("ScarabToken");
    const mockUSDC = await ScarabToken.deploy(admin.address, admin.address);
    await mockUSDC.waitForDeployment();
    const usdcAddress = await mockUSDC.getAddress();

    // SCARAB Token (Real)
    const scarab = await ScarabToken.deploy(admin.address, admin.address);
    await scarab.waitForDeployment();
    const scarabAddress = await scarab.getAddress();

    // Enable trading and remove limits for the simulation
    await scarab.enableTrading();
    await scarab.removeLimits();

    // Device Registry
    const factoryKey = ethers.randomBytes(64); // mock P-256 public key
    const DeviceRegistry = await ethers.getContractFactory("DeviceRegistry");
    const registry = await DeviceRegistry.deploy(factoryKey);
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();

    // Emission Controller (30% pool = 300M SCARAB)
    const regenPool = ethers.parseEther("300000000");
    const EmissionController = await ethers.getContractFactory("EmissionController");
    const emissions = await EmissionController.deploy(scarabAddress, registryAddress, regenPool);
    await emissions.waitForDeployment();
    const emissionsAddress = await emissions.getAddress();

    // Fund EmissionController with tokens (admin holds total supply)
    await scarab.transfer(emissionsAddress, regenPool);

    // Subscriptions ($12/mo)
    const Subscriptions = await ethers.getContractFactory("ScarabSubscriptions");
    const subscriptions = await Subscriptions.deploy(usdcAddress, admin.address);
    await subscriptions.waitForDeployment();
    const subsAddress = await subscriptions.getAddress();

    // Bokashi Validator
    const BokashiValidator = await ethers.getContractFactory("BokashiValidator");
    const bokashi = await BokashiValidator.deploy(registryAddress, emissionsAddress, subsAddress);
    await bokashi.waitForDeployment();
    const bokashiAddress = await bokashi.getAddress();

    // Setup Roles
    await registry.grantRole(await registry.REGISTRAR_ROLE(), admin.address);
    await emissions.grantRole(await emissions.VALIDATOR_ROLE(), bokashiAddress);
    await bokashi.grantRole(await bokashi.ORACLE_ROLE(), oracle.address);
    await bokashi.grantRole(await bokashi.BRAN_ISSUER_ROLE(), admin.address);

    console.log("✅ Done.");

    // -------------------------------------------------------------------------
    // 2. USER BUYS SUBSCRIPTION ($12 USDC)
    // -------------------------------------------------------------------------
    process.stdout.write("[2/6] User pays $12 USDC for monthly Bran subscription... ");

    // Give user 50 USDC
    await mockUSDC.transfer(user.address, ethers.parseUnits("50", 6));

    // User approves and pays
    await mockUSDC.connect(user).approve(subsAddress, ethers.parseUnits("12", 6));
    await subscriptions.connect(user).renewSubscription();
    console.log("✅ Done.");

    // -------------------------------------------------------------------------
    // 3. REGISTER HARDWARE NODE
    // -------------------------------------------------------------------------
    process.stdout.write("[3/6] Manufacturing & Registering Bokashi Node V1... ");
    const deviceId = "SCARAB-BOKASHI-001";
    const devicePubKey = ethers.randomBytes(64);
    const factorySig = ethers.randomBytes(64); // mock sig
    const initialAttest = ethers.id("attest");

    // Register type 4 = Bokashi
    await registry.registerDevice(deviceId, user.address, 4, "ipfs://mock", devicePubKey, factorySig, initialAttest);
    const deviceIdHash = ethers.keccak256(ethers.toUtf8Bytes(deviceId));
    console.log("✅ Done.");

    // -------------------------------------------------------------------------
    // 4. SCAN BRAN QR CODE & START CYCLE
    // -------------------------------------------------------------------------
    process.stdout.write("[4/6] User scans Physical Bran Bag QR Code to unlock cycle... ");
    const branNonce = ethers.hexlify(ethers.randomBytes(16)).substring(2);
    // Hash and sign exactly as the contract expects (just the nonce)
    const messageHash = ethers.solidityPackedKeccak256(["string"], [branNonce]);
    const signature = await admin.signMessage(ethers.getBytes(messageHash));

    await bokashi.connect(user).startCycle(deviceIdHash, branNonce, signature);
    console.log("✅ Done.");

    // -------------------------------------------------------------------------
    // 5. FAST FORWARD TIME (15 DAYS OF COMPOSTING)
    // -------------------------------------------------------------------------
    process.stdout.write("[5/6] ⏱️ Fast-Forwarding Blockchain time by 15 Days... ");
    // Add 15 days + 1 hour (1299600 seconds)
    await network.provider.send("evm_increaseTime", [15 * 24 * 60 * 60 + 3600]);
    await network.provider.send("evm_mine");
    console.log("✅ Done.");

    // -------------------------------------------------------------------------
    // 6. ORACLE VERIFIES CYCLE & USER CLAIMS REWARD
    // -------------------------------------------------------------------------
    console.log("\n[6/6] Oracle Submitting Telemetry Data & User Claiming Rewards...");

    const startTime = (await bokashi.activeCycleStartTime(deviceIdHash));
    const startWeight = 5000; // 5kg
    const peakTemp = 38;      // 38 degrees C (Ideal)
    const gasPPM = 900;       // 900 ppm (Ideal)
    const endWeight = 4500;   // 4.5kg (10% loss - Ideal)

    // Oracle submits
    const tx = await bokashi.connect(oracle).submitBokashiCycle(
        deviceIdHash,
        startTime,
        startWeight,
        peakTemp,
        gasPPM,
        endWeight
    );
    await tx.wait();

    // User claims from EmissionController
    const claimTx = await emissions.connect(user).claimRewards();
    await claimTx.wait();

    const userBalance = await scarab.balanceOf(user.address);
    console.log("\n========================================================");
    console.log(` 🎉 SIMULATION COMPLETE `);
    console.log("========================================================");
    console.log(` ➔ User Subscription Cost: $12.00 USDC`);
    console.log(` ➔ User SCARAB Balance:    ${ethers.formatEther(userBalance)} $SCARAB`);
    console.log("========================================================\n");

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
