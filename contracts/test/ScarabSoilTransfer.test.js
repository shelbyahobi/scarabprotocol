const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ScarabSoilTransfer - Dynamic Handshake with Staking", function () {
    let mockEmissionController;
    let mockScarabToken;
    let soilTransfer;
    let owner, user, farmer, solarNode;
    let deviceIdHash;

    beforeEach(async function () {
        [owner, user, farmer, solarNode] = await ethers.getSigners();
        deviceIdHash = ethers.id("BOKASHI_01");

        const MockController = await ethers.getContractFactory("MockEmissionController");
        mockEmissionController = await MockController.deploy();

        const MockERC20 = await ethers.getContractFactory("MockERC20");
        mockScarabToken = await MockERC20.deploy();

        const SoilTransfer = await ethers.getContractFactory("ScarabSoilTransfer");
        soilTransfer = await SoilTransfer.deploy(
            await mockEmissionController.getAddress(),
            await mockScarabToken.getAddress()
        );

        // Grant roles
        const FARMER_ROLE = await soilTransfer.FARMER_ROLE();
        await soilTransfer.grantRole(FARMER_ROLE, farmer.address);

        // Active Solar Node
        await soilTransfer.setSolarNode(solarNode.address, true);

        // Mint SCARAB to farmer and stake
        await mockScarabToken.mint(farmer.address, ethers.parseUnits("500", 18));
        await mockScarabToken.connect(farmer).approve(await soilTransfer.getAddress(), ethers.parseUnits("100", 18));
        await soilTransfer.connect(farmer).stakeScarab(ethers.parseUnits("100", 18));
    });

    it("1. User can initiate a transfer", async function () {
        const weight = 2000;
        await expect(soilTransfer.connect(user).initiateTransfer(deviceIdHash, weight))
            .to.emit(soilTransfer, "HandshakeInitiated");
    });

    it("2. Farmer can complete the transfer and rewards split 3 ways", async function () {
        const weight = 2000;
        const tx = await soilTransfer.connect(user).initiateTransfer(deviceIdHash, weight);
        const receipt = await tx.wait();
        const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'HandshakeInitiated');
        const transferId = event.args.transferId;

        await expect(soilTransfer.connect(farmer).completeTransfer(transferId, solarNode.address))
            .to.emit(soilTransfer, "LoopClosed")
            .withArgs(transferId, farmer.address, ethers.parseUnits("25", 18));

        const userReward = await mockEmissionController.rewards(user.address);
        const farmerReward = await mockEmissionController.rewards(farmer.address);
        const solarReward = await mockEmissionController.rewards(solarNode.address);

        expect(userReward).to.equal(ethers.parseUnits("15", 18));
        expect(farmerReward).to.equal(ethers.parseUnits("7", 18));
        expect(solarReward).to.equal(ethers.parseUnits("3", 18));
    });

    it("3. Non-staked farmers cannot complete transfers", async function () {
        const [_, __, ___, unstakedFarmer] = await ethers.getSigners();
        const FARMER_ROLE = await soilTransfer.FARMER_ROLE();
        await soilTransfer.grantRole(FARMER_ROLE, unstakedFarmer.address);

        const tx = await soilTransfer.connect(user).initiateTransfer(deviceIdHash, 2000);
        const receipt = await tx.wait();
        const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'HandshakeInitiated');

        await expect(soilTransfer.connect(unstakedFarmer).completeTransfer(event.args.transferId, solarNode.address))
            .to.be.revertedWith("Insufficient Farmer Stake");
    });

    it("4. Slashing protocol works", async function () {
        // Slashing 50 scarab from farmer's stake
        await soilTransfer.slashBadFarmer(farmer.address, ethers.parseUnits("50", 18));

        // Farmer's stake should drop from 100 to 50
        const currentStake = await soilTransfer.farmerStakes(farmer.address);
        expect(currentStake).to.equal(ethers.parseUnits("50", 18));
    });
});
