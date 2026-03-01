const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dynamic Emission Efficiency Ratio", function () {
    let scarabToken;
    let mockRegistry;
    let emissionController;
    let owner;
    let user;
    let validator;
    const REGEN_POOL_ALLOCATION = ethers.parseEther("300000000"); // 300 million

    beforeEach(async function () {
        [owner, user, validator] = await ethers.getSigners();

        // Deploy Token
        const ScarabToken = await ethers.getContractFactory("ScarabToken");
        scarabToken = await ScarabToken.deploy(owner.address, owner.address);

        // Deploy Mock Registry
        const MockRegistry = await ethers.getContractFactory("MockDeviceRegistry");
        mockRegistry = await MockRegistry.deploy();

        // Deploy Emission Controller
        const EmissionController = await ethers.getContractFactory("EmissionController");
        emissionController = await EmissionController.deploy(
            await scarabToken.getAddress(),
            await mockRegistry.getAddress(),
            REGEN_POOL_ALLOCATION
        );

        await emissionController.setValidatorRole(validator.address);
    });

    it("should calculate 100% efficiency when demand is below cap", async function () {
        await mockRegistry.setActiveDeviceCount(100);
        const efficiency = await emissionController.getEfficiencyRatio();
        expect(efficiency).to.equal(10000); // 100%
    });

    it("should dynamically scale down rewards with 50,000 devices", async function () {
        // Set to 50,000 devices
        await mockRegistry.setActiveDeviceCount(50000);

        const eff = await emissionController.getEfficiencyRatio();

        // Target demand: 50,000 * 5.33 SCARAB = 266,500 SCARAB
        // Cap is 80,000
        // Ratio should be 80,000 / 266,500 * 10000 = ~3001 (30%)
        expect(eff).to.be.lessThan(10000n);
        console.log(`Efficiency at 50k devices: ${Number(eff) / 100}%`);

        // Try accumulating a reward
        const deviceIdHash = ethers.id("test");
        await emissionController.connect(validator).accumulateReward(
            deviceIdHash,
            user.address,
            ethers.parseEther("50") // Base 50 SCARAB reward
        );

        const pending = await emissionController.viewPendingRewards(user.address);

        // Should scale down the 50 SCARAB to ~15
        expect(pending).to.be.lessThan(ethers.parseEther("50"));

        // 50 * 0.3001 = 15.005
        const expectedMin = ethers.parseEther("14.0");
        const expectedMax = ethers.parseEther("16.0");

        expect(pending).to.be.greaterThan(expectedMin);
        expect(pending).to.be.lessThan(expectedMax);
        console.log(`Scaled Reward (from 50): ${ethers.formatEther(pending)} SCARAB`);
    });
});
