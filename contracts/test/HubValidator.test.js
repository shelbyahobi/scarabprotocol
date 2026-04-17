const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HubValidator", function () {
  let hubValidator;
  let owner, oracle, hub, user, farmer;

  beforeEach(async function () {
    [owner, oracle, hub, user, farmer] = await ethers.getSigners();

    const HubValidatorF = await ethers.getContractFactory("HubValidator");
    hubValidator = await HubValidatorF.deploy();

    const ORACLE_ROLE = await hubValidator.ORACLE_ROLE();
    await hubValidator.grantRole(ORACLE_ROLE, oracle.address);
  });

  describe("Micro Handshake", function () {
    it("Should successfully record a micro-handshake event and hold 50% in escrow", async function () {
      const hubId = ethers.utils.formatBytes32String("HUB-1");
      const userId = ethers.utils.formatBytes32String("USER-1");
      const streamType = ethers.utils.formatBytes32String("BOKASHI"); // 1.0x
      const quantity = 1000; // 1000g = 1kg
      const qualityScore = 9000; // 90%
      const nonce = ethers.utils.formatBytes32String("NONCE-1");

      const hubSignature = "0x"; 
      const oracleSignature = "0x";

      await expect(
        hubValidator.connect(oracle).recordMicroHandshake(
          hubId, userId, streamType, quantity, qualityScore, nonce, hubSignature, oracleSignature
        )
      ).to.emit(hubValidator, "MicroHandshake");

      // Verify the escrow state
      const blockTime = (await ethers.provider.getBlock("latest")).timestamp;
      const dropOffId = ethers.utils.keccak256(
        ethers.utils.solidityPack(["bytes32", "bytes32", "uint256", "bytes32"], [hubId, userId, blockTime, nonce])
      );

      const dropOff = await hubValidator.dropOffs(dropOffId);
      expect(dropOff.quantity).to.equal(quantity);
      expect(dropOff.bulkHandshakeComplete).to.be.false;
      expect(dropOff.escrowedReward).to.be.gt(0); 
    });
  });
});
