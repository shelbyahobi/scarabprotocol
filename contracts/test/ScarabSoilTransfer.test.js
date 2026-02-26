const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ScarabSoilTransfer - MVP Handshake", function () {
    let mockEmissionController;
    let mockScarabToken;
    let soilTransfer;
    let owner, user, farmer;
    let deviceIdHash;

    beforeEach(async function () {
        [owner, user, farmer] = await ethers.getSigners();
        deviceIdHash = ethers.id("BOKASHI_01");

        const MockController = await ethers.getContractFactory("MockEmissionController");
        mockEmissionController = await MockController.deploy();

        const MockERC20 = await ethers.getContractFactory("MockERC20");
        mockScarabToken = await MockERC20.deploy();

        const SoilTransfer = await ethers.getContractFactory("ScarabSoilTransfer");
        soilTransfer = await SoilTransfer.deploy(
            await mockEmissionController.getAddress()
        );

        // Grant roles
        const FARMER_ROLE = await soilTransfer.FARMER_ROLE();
        await soilTransfer.grantRole(FARMER_ROLE, farmer.address);
    });

    it("1. User can initiate a transfer", async function () {
        const weight = 2000;
        await expect(soilTransfer.connect(user).initiateTransfer(deviceIdHash, weight))
            .to.emit(soilTransfer, "HandshakeInitiated");
    });

    it("2. Farmer can complete the transfer and release rewards", async function () {
        const weight = 2000;
        const tx = await soilTransfer.connect(user).initiateTransfer(deviceIdHash, weight);
        const receipt = await tx.wait();
        const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'HandshakeInitiated');
        const transferId = event.args.transferId;

        await expect(soilTransfer.connect(farmer).completeTransfer(transferId))
            .to.emit(soilTransfer, "LoopClosed")
            .withArgs(transferId, farmer.address, ethers.parseUnits("25", 18));

        const userReward = await mockEmissionController.rewards(user.address);
        const farmerReward = await mockEmissionController.rewards(farmer.address);

        expect(userReward).to.equal(ethers.parseUnits("15", 18));
        expect(farmerReward).to.equal(ethers.parseUnits("10", 18));
    });
});
