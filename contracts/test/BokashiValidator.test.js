const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("BokashiValidator - Bran QR Code & Quality Score", function () {
    let validator;
    let branIssuer;
    let deviceIdHash;
    let branNonce;

    beforeEach(async function () {
        [owner, oracle, user, branIssuerWallet] = await ethers.getSigners();
        branIssuer = branIssuerWallet;
        deviceIdHash = ethers.id("DEVICE_001");
        branNonce = "BRAN_UUID_12345";

        // We can deploy BokashiValidator with dummy addresses for the interfaces if we only test the pure functions.
        const Validator = await ethers.getContractFactory("BokashiValidator");
        validator = await Validator.deploy(ethers.ZeroAddress, ethers.ZeroAddress, ethers.ZeroAddress);

        // We can't easily test `startCycle` end-to-end here without a real DeviceRegistry mock
        // because it checks `require(deviceRegistry.isDeviceValid(deviceIdHash))`.
        // However, we CAN test the pure math of calculateQualityScore.
    });

    describe("Quality Score Calculation", function () {
        it("1. Ideal Conditions (100% Score)", async function () {
            // temp: 38 (4000), gas: 900 (3000), weightLoss: 10% (3000) -> 10000
            const score = await validator.calculateQualityScore(38, 900, 100, 1000);
            expect(score).to.equal(10000);
        });

        it("2. Sub-optimal Temperature", async function () {
            // temp: 32 (2000), gas: 900 (3000), weightLoss: 10% (3000) -> 8000
            const score = await validator.calculateQualityScore(32, 900, 100, 1000);
            expect(score).to.equal(8000);
        });

        it("3. Low Gas Production", async function () {
            // temp: 38 (4000), gas: 500 (1500), weightLoss: 10% (3000) -> 8500
            const score = await validator.calculateQualityScore(38, 500, 100, 1000);
            expect(score).to.equal(8500);
        });

        it("4. Poor Weight Loss", async function () {
            // temp: 38 (4000), gas: 900 (3000), weightLoss: 4% (0) -> 7000
            const score = await validator.calculateQualityScore(38, 900, 40, 1000);
            expect(score).to.equal(7000);
        });

        it("5. Highly Suspicious / Fake conditions", async function () {
            // temp: 20 (0), gas: 100 (0), weightLoss: 0% (0) -> 0
            const score = await validator.calculateQualityScore(20, 100, 0, 1000);
            expect(score).to.equal(0);
        });

        it("6. Extreme Weight Loss Anomaly", async function () {
            // temp: 38 (4000), gas: 900 (3000), weightLoss: 50% (0) -> 7000
            const score = await validator.calculateQualityScore(38, 900, 500, 1000);
            expect(score).to.equal(7000);
        });

        it("7. Overheating Edge Case", async function () {
            // temp: 44 (2000), gas: 900 (3000), weightLoss: 10% (3000) -> 8000
            const score = await validator.calculateQualityScore(44, 900, 100, 1000);
            expect(score).to.equal(8000);
        });
    });
});

