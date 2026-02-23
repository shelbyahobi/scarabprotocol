const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ScarabSoilTransfer - Fertility Handshake", function () {
    let mockEmissionController;
    let soilTransfer;
    let owner, user, farmer;
    let deviceIdHash;

    beforeEach(async function () {
        [owner, user, farmer] = await ethers.getSigners();
        deviceIdHash = ethers.id("BOKASHI_01");

        // Mock Emission Controller to track accumulateReward calls
        const MockController = await ethers.getContractFactory("MockEmissionController");
        mockEmissionController = await MockController.deploy();

        const SoilTransfer = await ethers.getContractFactory("ScarabSoilTransfer");
        soilTransfer = await SoilTransfer.deploy(await mockEmissionController.getAddress());

        // Grant FARMER_ROLE
        const FARMER_ROLE = await soilTransfer.FARMER_ROLE();
        await soilTransfer.grantRole(FARMER_ROLE, farmer.address);
    });

    it("1. User can initiate a transfer", async function () {
        const weight = 2000; // 2kg

        // Listen for HandshakeInitiated
        await expect(soilTransfer.connect(user).initiateTransfer(deviceIdHash, weight))
            .to.emit(soilTransfer, "HandshakeInitiated");
    });

    it("2. Farmer can complete the transfer and release rewards", async function () {
        const weight = 2000;

        // Let user initiate
        const tx = await soilTransfer.connect(user).initiateTransfer(deviceIdHash, weight);
        const receipt = await tx.wait();

        // Find transferId from event
        const event = receipt.logs.find(
            log => log.fragment && log.fragment.name === 'HandshakeInitiated'
        );
        const transferId = event.args.transferId;

        // Farmer completes transfer
        await expect(soilTransfer.connect(farmer).completeTransfer(transferId))
            .to.emit(soilTransfer, "LoopClosed")
            .withArgs(transferId, farmer.address, ethers.parseUnits("25", 18));

        // Verify Mock Emission Controller got called correctly
        const userReward = await mockEmissionController.rewards(user.address);
        const farmerReward = await mockEmissionController.rewards(farmer.address);

        expect(userReward).to.equal(ethers.parseUnits("15", 18));
        expect(farmerReward).to.equal(ethers.parseUnits("10", 18));
    });

    it("3. Non-farmers cannot complete transfers", async function () {
        const tx = await soilTransfer.connect(user).initiateTransfer(deviceIdHash, 2000);
        const receipt = await tx.wait();
        const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'HandshakeInitiated');
        const transferId = event.args.transferId;

        // A regular user tries to complete it
        await expect(soilTransfer.connect(user).completeTransfer(transferId))
            .to.be.revertedWithCustomError(soilTransfer, "AccessControlUnauthorizedAccount");
    });

    it("4. Cannot complete expired transfers (>48h)", async function () {
        const tx = await soilTransfer.connect(user).initiateTransfer(deviceIdHash, 2000);
        const receipt = await tx.wait();
        const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'HandshakeInitiated');
        const transferId = event.args.transferId;

        // Fast forward 49 hours
        await time.increase(49 * 60 * 60);

        await expect(soilTransfer.connect(farmer).completeTransfer(transferId))
            .to.be.revertedWith("Transfer expired");
    });
});
