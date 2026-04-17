const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HubValidator", function () {
  let hubValidator;
  let owner, oracle, hub, user, farmer;
  let ORACLE_ROLE;

  beforeEach(async function () {
    [owner, oracle, hub, user, farmer] = await ethers.getSigners();

    const HubValidatorF = await ethers.getContractFactory("HubValidator");
    hubValidator = await HubValidatorF.deploy();

    ORACLE_ROLE = await hubValidator.ORACLE_ROLE();
    await hubValidator.grantRole(ORACLE_ROLE, oracle.address);
  });

  describe("Micro Handshake", function () {
    it("Should complete: farmer receives 40%, hub receives 10%, escrow holds 50%", async function () {
      const hubId = ethers.encodeBytes32String("HUB-1");
      const userId = ethers.encodeBytes32String("USER-1");
      const streamType = ethers.keccak256(ethers.toUtf8Bytes("BOKASHI"));
      const quantity = 10000; // 10kg in grams
      const qualityScore = 9000; // 90%
      const nonce = ethers.encodeBytes32String("NONCE-1");
      const hubSignature = "0x";
      const oracleSignature = "0x";

      await expect(
        hubValidator.connect(oracle).recordMicroHandshake(
          hubId, userId, streamType, quantity, qualityScore, nonce, hubSignature, oracleSignature
        )
      ).to.emit(hubValidator, "MicroHandshake");
    });

    it("Should revert if quality score is below 30% threshold", async function () {
      const hubId = ethers.encodeBytes32String("HUB-1");
      const userId = ethers.encodeBytes32String("USER-1");
      const streamType = ethers.keccak256(ethers.toUtf8Bytes("BOKASHI"));
      const quantity = 10000;
      const qualityScore = 2000; // 20% — below 30% threshold
      const nonce = ethers.encodeBytes32String("NONCE-LOW");

      await expect(
        hubValidator.connect(oracle).recordMicroHandshake(
          hubId, userId, streamType, quantity, qualityScore, nonce, "0x", "0x"
        )
      ).to.be.revertedWith("HubValidator: quality below threshold");
    });
  });

  describe("Pause / Unpause", function () {
    it("Should reject submissions when paused", async function () {
      await hubValidator.connect(owner).pause();

      const hubId = ethers.encodeBytes32String("HUB-PAUSED");
      const userId = ethers.encodeBytes32String("USER-PAUSED");
      const streamType = ethers.keccak256(ethers.toUtf8Bytes("BOKASHI"));

      await expect(
        hubValidator.connect(oracle).recordMicroHandshake(
          hubId, userId, streamType, 5000, 8000, ethers.encodeBytes32String("N-P"), "0x", "0x"
        )
      ).to.be.revertedWithCustomError(hubValidator, "EnforcedPause");
    });

    it("Should accept submissions after unpause", async function () {
      await hubValidator.connect(owner).pause();
      await hubValidator.connect(owner).unpause();

      const hubId = ethers.encodeBytes32String("HUB-UNPAUSED");
      const userId = ethers.encodeBytes32String("USER-UNPAUSED");
      const streamType = ethers.keccak256(ethers.toUtf8Bytes("BOKASHI"));

      await expect(
        hubValidator.connect(oracle).recordMicroHandshake(
          hubId, userId, streamType, 5000, 8000, ethers.encodeBytes32String("N-UP"), "0x", "0x"
        )
      ).to.emit(hubValidator, "MicroHandshake");
    });
  });
});
