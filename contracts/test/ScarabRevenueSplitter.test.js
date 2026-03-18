const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ScarabRevenueSplitter", function () {
    let mockUsdc;
    let splitter;
    let owner, mfgVault, rdTreasury, lpWallet, bnbWallet, otherAccount;

    beforeEach(async function () {
        [owner, mfgVault, rdTreasury, lpWallet, bnbWallet, otherAccount] = await ethers.getSigners();

        const MockUSDC = await ethers.getContractFactory("MockUSDC");
        mockUsdc = await MockUSDC.deploy();

        const usdcAddress = await mockUsdc.getAddress();
        await mockUsdc.mint(owner.address, ethers.parseUnits("1000", 18));

        const Splitter = await ethers.getContractFactory("ScarabRevenueSplitter");
        splitter = await Splitter.deploy(
            usdcAddress,
            mfgVault.address,
            rdTreasury.address,
            lpWallet.address,
            bnbWallet.address,
            owner.address // Setting deployer as multisig owner for testing
        );
    });

    it("should correctly route revenue according to 40/30/20/10 split", async function () {
        const splitterAddress = await splitter.getAddress();
        
        // Send 100 USDC to splitter directly (as if swept from HardwarePreorder)
        const amount = ethers.parseUnits("100", 18);
        await mockUsdc.transfer(splitterAddress, amount);

        expect(await mockUsdc.balanceOf(mfgVault.address)).to.equal(0);

        // Execute routing
        await expect(splitter.routeRevenue())
            .to.emit(splitter, "RevenueRouted")
            .withArgs(
                await mockUsdc.getAddress(),
                amount,
                ethers.parseUnits("40", 18),
                ethers.parseUnits("30", 18),
                ethers.parseUnits("20", 18),
                ethers.parseUnits("10", 18)
            );

        expect(await mockUsdc.balanceOf(mfgVault.address)).to.equal(ethers.parseUnits("40", 18));
        expect(await mockUsdc.balanceOf(rdTreasury.address)).to.equal(ethers.parseUnits("30", 18));
        expect(await mockUsdc.balanceOf(lpWallet.address)).to.equal(ethers.parseUnits("20", 18));
        expect(await mockUsdc.balanceOf(bnbWallet.address)).to.equal(ethers.parseUnits("10", 18));
    });

    it("should allow the multisig owner to update payees", async function () {
        await expect(splitter.setManufacturingVault(otherAccount.address))
            .to.emit(splitter, "PayeeUpdated")
            .withArgs("Manufacturing", mfgVault.address, otherAccount.address);
            
        expect(await splitter.manufacturingVault()).to.equal(otherAccount.address);
    });

    it("should prevent non-owners from updating payees", async function () {
        await expect(
            splitter.connect(otherAccount).setManufacturingVault(otherAccount.address)
        ).to.be.revertedWithCustomError(splitter, "OwnableUnauthorizedAccount").withArgs(otherAccount.address);
    });
});
