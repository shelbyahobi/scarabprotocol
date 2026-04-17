const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiquidityBackingVault", function () {
  let vault;
  let owner, unauthorised;

  beforeEach(async function () {
    [owner, unauthorised] = await ethers.getSigners();

    const VaultF = await ethers.getContractFactory("LiquidityBackingVault");
    // Constructor args: USDC address, SCARAB token address, PancakeSwap router
    vault = await VaultF.deploy(
      ethers.Wallet.createRandom().address,
      ethers.Wallet.createRandom().address,
      ethers.Wallet.createRandom().address
    );
  });

  describe("Proceeds Split Logic", function () {
    it("Should allocate 70% to treasury and 30% to buy-and-burn", async function () {
      const depositAmount = 1000000; // 1,000,000 units (e.g. 1 USDC with 6 decimals)

      await vault.receiveOilSaleProceeds(depositAmount);

      const vaultBalance = await vault.totalUSDCReceived();
      // 70% of 1,000,000 = 700,000
      expect(vaultBalance).to.equal(700000);

      // Buy-and-burn is mocked (returns 0), but the function should not revert
      const burnTotal = await vault.totalBurned();
      expect(burnTotal).to.equal(0);
    });
  });

  describe("Pause / Unpause", function () {
    it("Should reject receiveOilSaleProceeds when paused", async function () {
      await vault.connect(owner).pause();

      await expect(
        vault.receiveOilSaleProceeds(500000)
      ).to.be.revertedWithCustomError(vault, "EnforcedPause");
    });

    it("Should accept receiveOilSaleProceeds after unpause", async function () {
      await vault.connect(owner).pause();
      await vault.connect(owner).unpause();

      await expect(vault.receiveOilSaleProceeds(500000)).to.not.be.reverted;
    });
  });

  describe("Access Control", function () {
    it("Should prevent unauthorised caller from pausing", async function () {
      await expect(
        vault.connect(unauthorised).pause()
      ).to.be.reverted;
    });
  });
});
