const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SCARABToken Burning", function () {
    let ScarabToken;
    let scarabToken;
    let owner;
    let addr1;
    let marketingWallet;
    let shopFundWallet;

    beforeEach(async function () {
        [owner, addr1, marketingWallet, shopFundWallet] = await ethers.getSigners();

        ScarabToken = await ethers.getContractFactory("ScarabToken");
        scarabToken = await ScarabToken.deploy(
            marketingWallet.address,
            shopFundWallet.address
        );
    });

    it("Should inherit ERC20Burnable correctly and track burns", async function () {
        // Mint some tokens from owner to owner (already has max supply via constructor)
        // Send some to addr1
        await scarabToken.transfer(addr1.address, ethers.parseEther("1000"));

        // Burn tokens using ERC20Burnable
        await scarabToken.connect(addr1).burn(ethers.parseEther("100"));

        // Check total burned
        expect(await scarabToken.totalBurned()).to.equal(ethers.parseEther("100"));
    });

    it("Should track burns with reason", async function () {
        await scarabToken.transfer(addr1.address, ethers.parseEther("100"));

        await expect(scarabToken.connect(addr1).burnWithReason(
            ethers.parseEther("50"),
            "Node activation"
        )).to.emit(scarabToken, "TokensBurned")
            .withArgs(addr1.address, ethers.parseEther("50"), "Node activation");

        expect(await scarabToken.totalBurned()).to.equal(ethers.parseEther("50"));
    });
});
