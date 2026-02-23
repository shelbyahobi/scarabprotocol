const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ScarabSubscriptions", function () {
    let mockUsdc;
    let subscriptions;
    let treasury, user, nonSubscribedUser;

    beforeEach(async function () {
        [owner, treasury, user, nonSubscribedUser] = await ethers.getSigners();

        // Deploy a mock ERC20 token for USDC
        const MockToken = await ethers.getContractFactory("MockToken");
        // For testing, we can just compile a quick MockToken inline or use ScarabToken as mock
        mockUsdc = await MockToken.deploy("Mock USDC", "USDC");

        const Subscriptions = await ethers.getContractFactory("ScarabSubscriptions");
        subscriptions = await Subscriptions.deploy(await mockUsdc.getAddress(), treasury.address);

        // Mint USDC to user and approve subscriptions contract
        await mockUsdc.mint(user.address, ethers.parseUnits("100", 6));
        await mockUsdc.connect(user).approve(await subscriptions.getAddress(), ethers.MaxUint256);
    });

    it("Should allow user to purchase subscription", async () => {
        expect(await subscriptions.isSubscribed(user.address)).to.be.false;

        await subscriptions.connect(user).renewSubscription();

        expect(await subscriptions.isSubscribed(user.address)).to.be.true;

        // Treasury should have received 12 USDC
        const treasuryBal = await mockUsdc.balanceOf(treasury.address);
        expect(treasuryBal).to.equal(ethers.parseUnits("12", 6));
    });

    it("Should expire subscription after 30 days", async () => {
        await subscriptions.connect(user).renewSubscription();
        expect(await subscriptions.isSubscribed(user.address)).to.be.true;

        // Fast forward 31 days
        await time.increase(31 * 24 * 60 * 60);

        expect(await subscriptions.isSubscribed(user.address)).to.be.false;
    });
});
