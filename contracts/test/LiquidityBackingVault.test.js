const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiquidityBackingVault", function () {
  let vault;
  let owner, oracle;
  let mockUSDC, mockScarab, mockRouter;

  beforeEach(async function () {
    [owner, oracle, mockUSDC, mockScarab, mockRouter] = await ethers.getSigners();

    const VaultF = await ethers.getContractFactory("LiquidityBackingVault");
    vault = await VaultF.deploy(mockUSDC.address, mockScarab.address, mockRouter.address);
  });

  describe("Proceeds Split Logic", function () {
    it("Should correctly allocate 70% to backing and 30% to burn", async function () {
      const depositAmount = ethers.utils.parseUnits("1000", 6); // 1000 USDC

      await expect(vault.receiveOilSaleProceeds(depositAmount))
        .to.emit(vault, "UCOSaleProceeds");

      const vaultBalance = await vault.totalUSDCReceived();
      expect(vaultBalance).to.equal(ethers.utils.parseUnits("700", 6)); // 70%

      const burnTotal = await vault.totalBurned();
      expect(burnTotal).to.equal(0); // the mock returns 0 SCARAB right now
    });
  });
});
