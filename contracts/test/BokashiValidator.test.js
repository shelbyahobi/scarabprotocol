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
            // lidOpenings = 5 (100%), averageFillWeight = 4000g (100%)
            const score = await validator.calculateQualityScore(38, 900, 500, 5000, 5, 4000);
            expect(score).to.equal(10000);
        });

        it("2. Sub-optimal Temperature", async function () {
            const score = await validator.calculateQualityScore(32, 900, 500, 5000, 5, 4000);
            expect(score).to.equal(8000);
        });

        it("3. Low Gas Production", async function () {
            const score = await validator.calculateQualityScore(38, 500, 500, 5000, 5, 4000);
            expect(score).to.equal(8500);
        });

        it("4. Poor Weight Loss", async function () {
            const score = await validator.calculateQualityScore(38, 900, 200, 5000, 5, 4000);
            expect(score).to.equal(7000);
        });

        it("5. Highly Suspicious / Fake conditions", async function () {
            const score = await validator.calculateQualityScore(20, 100, 0, 5000, 5, 4000);
            expect(score).to.equal(0);
        });

        it("6. Extreme Weight Loss Anomaly", async function () {
            const score = await validator.calculateQualityScore(38, 900, 2500, 5000, 5, 4000);
            expect(score).to.equal(7000);
        });

        it("7. Overheating Edge Case", async function () {
            const score = await validator.calculateQualityScore(44, 900, 500, 5000, 5, 4000);
            expect(score).to.equal(8000);
        });

        it("8. Excessive Oxygen Exposure (Lid Openings 18 -> 80% penalty)", async function () {
            // Base score 10000 * 0.8 = 8000
            const score = await validator.calculateQualityScore(38, 900, 500, 5000, 18, 4000);
            expect(score).to.equal(8000);
        });

        it("9. Severe Oxygen Exposure (Lid Openings 22 -> 50% penalty)", async function () {
            // Base score 10000 * 0.5 = 5000
            const score = await validator.calculateQualityScore(38, 900, 500, 5000, 22, 4000);
            expect(score).to.equal(5000);
        });

        it("10. Critical Oxygen Exposure (Lid Openings > 25 -> Slashed to 0)", async function () {
            const score = await validator.calculateQualityScore(38, 900, 500, 5000, 30, 4000);
            expect(score).to.equal(0);
        });

        it("11. Low Fill Weight Penalty (< 2000g -> 50% penalty)", async function () {
            // Base score 10000 * 0.5 = 5000
            const score = await validator.calculateQualityScore(38, 900, 500, 5000, 5, 1000);
            expect(score).to.equal(5000);
        });

        it("12. Combined Penalties (Oxygen 80% and Low Fill Weight 50%)", async function () {
            // Base score 10000 * 0.8 * 0.5 = 4000
            const score = await validator.calculateQualityScore(38, 900, 500, 5000, 18, 1000);
            expect(score).to.equal(4000);
        });
    });
});

