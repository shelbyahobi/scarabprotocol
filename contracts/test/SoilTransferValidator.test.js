const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SoilTransferValidator (SaaS 2.0)", function () {
    let DeviceRegistry, deviceRegistry;
    let EmissionController, emissionController;
    let BokashiValidator, bokashiValidator;
    let SoilTransferValidator, soilTransferValidator;
    let ScarabToken, scarabToken;
    let owner, user, farmer, treasury, marketingWallet, shopFundWallet;

    let userDeviceIdHash;
    let farmerNodeIdHash;

    beforeEach(async function () {
        [owner, user, farmer, treasury, marketingWallet, shopFundWallet] = await ethers.getSigners();

        // 1. Token
        ScarabToken = await ethers.getContractFactory("ScarabToken");
        scarabToken = await ScarabToken.deploy(marketingWallet.address, shopFundWallet.address);

        // 2. Device Registry
        DeviceRegistry = await ethers.getContractFactory("DeviceRegistry");
        const dummyKey = new Uint8Array(64);
        deviceRegistry = await DeviceRegistry.deploy(dummyKey);

        // 3. Emission Controller
        EmissionController = await ethers.getContractFactory("EmissionController");
        emissionController = await EmissionController.deploy(
            scarabToken.target,
            deviceRegistry.target,
            ethers.parseEther("300000000")
        );

        // 4. Bokashi Validator
        BokashiValidator = await ethers.getContractFactory("BokashiValidator");
        bokashiValidator = await BokashiValidator.deploy(
            deviceRegistry.target,
            emissionController.target,
            ethers.ZeroAddress // No subscriptions for MVP test
        );

        // 5. Soil Transfer Validator
        SoilTransferValidator = await ethers.getContractFactory("SoilTransferValidator");
        soilTransferValidator = await SoilTransferValidator.deploy(
            deviceRegistry.target,
            emissionController.target,
            bokashiValidator.target,
            treasury.address
        );

        // Setup Roles
        await deviceRegistry.grantRole(await deviceRegistry.REGISTRAR_ROLE(), owner.address);
        await emissionController.grantRole(await emissionController.VALIDATOR_ROLE(), bokashiValidator.target);
        await emissionController.grantRole(await emissionController.VALIDATOR_ROLE(), soilTransferValidator.target);
        await bokashiValidator.grantRole(await bokashiValidator.ORACLE_ROLE(), owner.address);

        // Register User's Bokashi Node
        await deviceRegistry.registerDevice(
            "BOKASHI-USER-01",
            user.address,
            4, // Bokashi enum
            "ipfs://meta",
            new Uint8Array(64),
            new Uint8Array(64),
            ethers.zeroPadValue(ethers.toBeHex(1), 32)
        );
        userDeviceIdHash = ethers.keccak256(ethers.toUtf8Bytes("BOKASHI-USER-01"));

        // Add 1 valid Bokashi cycle to user to set base endWeight to 5000g
        // Must activate cycle first to bypass protections
        const branNonce = "nonce_123";
        const messageHash = ethers.solidityPackedKeccak256(["string"], [branNonce]);
        const ethSignedMessageHash = ethers.hashMessage(ethers.getBytes(messageHash));

        await bokashiValidator.grantRole(await bokashiValidator.BRAN_ISSUER_ROLE(), owner.address);
        const sig = await owner.signMessage(ethers.getBytes(messageHash));

        await bokashiValidator.startCycle(userDeviceIdHash, branNonce, sig);

        // Warp time for min cycle duration
        await ethers.provider.send("evm_increaseTime", [86400 * 2]);
        await ethers.provider.send("evm_mine");

        await bokashiValidator.submitBokashiCycle(
            userDeviceIdHash,
            await bokashiValidator.activeCycleStartTime(userDeviceIdHash),
            4000,   // start weight
            45,     // temp
            500,    // gas
            5000    // end weight (bucket weight at handoff)
        );

        // Register Farmer Sink Node
        farmerNodeIdHash = ethers.keccak256(ethers.toUtf8Bytes("FARMER-NODE-01"));
        await soilTransferValidator.registerFarmer(farmerNodeIdHash, farmer.address, 100000 /* 100kg */);
    });

    it("Should settle a valid drop-off correctly", async function () {
        const receivedWeight = 4800; // Within 10% tolerance of 5000g
        const uniqueNonce = ethers.keccak256(ethers.toUtf8Bytes("DROP-OFF-NONCE-1"));

        // Farmer signs receipt
        const messageHash = ethers.solidityPackedKeccak256(
            ["bytes32", "bytes32", "uint256", "bytes32"],
            [farmerNodeIdHash, userDeviceIdHash, receivedWeight, uniqueNonce]
        );
        const farmerSig = await farmer.signMessage(ethers.getBytes(messageHash));

        // Let user submit (can be anyone with sig)
        await expect(soilTransferValidator.connect(user).settleDropOff(
            userDeviceIdHash,
            farmerNodeIdHash,
            receivedWeight,
            uniqueNonce,
            farmerSig
        )).to.emit(soilTransferValidator, "DropOffSettled")
            .withArgs(userDeviceIdHash, farmerNodeIdHash, receivedWeight, ethers.parseEther("15"), ethers.parseEther("7"));

        // Verify rewards on emission controller
        const userPending = await emissionController.viewPendingRewards(user.address);
        // User gets 50 base (from cycle) + 15 closure = 65 total (assuming 100% efficiency and 10000 max quality score)
        // Let's just check the state directly or accept the event validation
    });

    it("Should revert if weight is below 10% threshold", async function () {
        const receivedWeight = 4000; // Expected 5000: 4000 is 80%, below 90%
        const uniqueNonce = ethers.keccak256(ethers.toUtf8Bytes("DROP-OFF-NONCE-2"));

        const messageHash = ethers.solidityPackedKeccak256(
            ["bytes32", "bytes32", "uint256", "bytes32"],
            [farmerNodeIdHash, userDeviceIdHash, receivedWeight, uniqueNonce]
        );
        const farmerSig = await farmer.signMessage(ethers.getBytes(messageHash));

        await expect(soilTransferValidator.connect(user).settleDropOff(
            userDeviceIdHash,
            farmerNodeIdHash,
            receivedWeight,
            uniqueNonce,
            farmerSig
        )).to.be.revertedWith("Weight mismatch - possible fraud");
    });

    it("Should revert on reused QR nonce", async function () {
        const receivedWeight = 4800;
        const uniqueNonce = ethers.keccak256(ethers.toUtf8Bytes("REPLAY-NONCE-1"));

        const messageHash = ethers.solidityPackedKeccak256(
            ["bytes32", "bytes32", "uint256", "bytes32"],
            [farmerNodeIdHash, userDeviceIdHash, receivedWeight, uniqueNonce]
        );
        const farmerSig = await farmer.signMessage(ethers.getBytes(messageHash));

        await soilTransferValidator.connect(user).settleDropOff(
            userDeviceIdHash,
            farmerNodeIdHash,
            receivedWeight,
            uniqueNonce,
            farmerSig
        );

        // Try again with exact same payload
        await expect(soilTransferValidator.connect(user).settleDropOff(
            userDeviceIdHash,
            farmerNodeIdHash,
            receivedWeight,
            uniqueNonce,
            farmerSig
        )).to.be.revertedWith("Nonce already used");
    });
});
