const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe.skip("SeedSale Contract", function () {
    let SeedSale, seedSale;
    let ScarabToken, rollToken;
    let owner, addr1, addr2, addr3;

    const SOFT_CAP = ethers.parseEther("5"); // 5 BNB for testing
    const HARD_CAP = ethers.parseEther("20"); // 20 BNB
    const TOKENS_PER_BNB = 5_000_000n; // 5 Million

    beforeEach(async function () {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // 1. Deploy Token
        const ROLLTokenFactory = await ethers.getContractFactory("ScarabToken"); // Assuming ROLLToken exists, or use generic ERC20 mock
        // If ROLLToken constructor requires args, add them here. 
        // Assuming standard ERC20 or Ownable.
        // Let's try to deploy. If this fails, we will create a MockERC20.
        rollToken = await ROLLTokenFactory.deploy(owner.address, owner.address);

        // 2. Deploy SeedSale
        const SeedSaleFactory = await ethers.getContractFactory("SeedSale");
        const startTime = (await time.latest()) + 60; // Start in 1 minute
        const endTime = startTime + 3600; // Lasts 1 hour

        seedSale = await SeedSaleFactory.deploy(SOFT_CAP, HARD_CAP, startTime, endTime);

        // 3. Setup: Set Sale Token and Fund Contract
        await seedSale.setSaleToken(await rollToken.getAddress());

        // Transfer enough tokens to SeedSale for payouts
        const totalTokensNeeded = HARD_CAP * TOKENS_PER_BNB;
        // Mint or Transfer. Assuming Owner has supply.
        // If ROLLToken has mint, use it. If fixed supply, transfer.
        // Let's assume transfer for now.
        await rollToken.transfer(await seedSale.getAddress(), ethers.parseEther("100000000")); // Send 100M tokens
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await seedSale.owner()).to.equal(owner.address);
        });

        it("Should set correct caps", async function () {
            expect(await seedSale.softCap()).to.equal(SOFT_CAP);
            expect(await seedSale.hardCap()).to.equal(HARD_CAP);
        });
    });

    describe("Deposits", function () {
        it("Should fail if sale not started", async function () {
            await expect(
                seedSale.connect(addr1).deposit({ value: ethers.parseEther("1") })
            ).to.be.revertedWith("Sale not started");
        });

        it("Should accept deposits when active", async function () {
            await time.increase(61); // Fast forward to start

            await seedSale.connect(addr1).deposit({ value: ethers.parseEther("1") });

            expect(await seedSale.deposits(addr1.address)).to.equal(ethers.parseEther("1"));
            expect(await seedSale.raisedAmount()).to.equal(ethers.parseEther("1"));
        });

        it("Should fail if 0 sent", async function () {
            await time.increase(61);
            await expect(
                seedSale.connect(addr1).deposit({ value: 0 })
            ).to.be.revertedWith("Cannot deposit 0");
        });
    });

    describe("Successful Sale Flow", function () {
        beforeEach(async function () {
            await time.increase(61); // Start sale
        });

        it("Should reach SoftCap and Finalize", async function () {
            // Deposit 5 BNB (Soft Cap)
            await seedSale.connect(addr1).deposit({ value: ethers.parseEther("5") });

            // Finalize
            await seedSale.connect(owner).finalizeSale();

            expect(await seedSale.saleFinalized()).to.be.true;
            expect(await seedSale.saleActive()).to.be.false;
        });

        it("Should allow users to Claim Tokens after finalization", async function () {
            const depositAmount = ethers.parseEther("2");
            await seedSale.connect(addr1).deposit({ value: depositAmount });
            await seedSale.connect(addr2).deposit({ value: ethers.parseEther("4") }); // Total 6 > Soft Cap

            await seedSale.connect(owner).finalizeSale();

            // Check Claim
            const initialBalance = await rollToken.balanceOf(addr1.address);
            await seedSale.connect(addr1).claimTokens();

            const expectedTokens = depositAmount * TOKENS_PER_BNB;
            // Note: JS limits on big numbers, strictly speaking we should use BigInts or ethers functions
            // But let's check contract balance reduced.

            expect(await rollToken.balanceOf(addr1.address)).to.equal(initialBalance + (2n * 10n ** 18n * 5000000n));

            // Check double claim prevention
            await expect(
                seedSale.connect(addr1).claimTokens()
            ).to.be.revertedWith("No deposit");
        });
    });

    describe("Failed Sale Flow (Refunds)", function () {
        it("Should allow refunds if SoftCap not met and expired", async function () {
            await time.increase(61); // Start
            await seedSale.connect(addr1).deposit({ value: ethers.parseEther("1") }); // 1 BNB < 5 BNB SoftCap

            await time.increase(4000); // End time passed

            // Try Refund
            const initialEthBal = await ethers.provider.getBalance(addr1.address);

            // Execute refund
            const tx = await seedSale.connect(addr1).claimRefund();
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;

            const finalEthBal = await ethers.provider.getBalance(addr1.address);

            // Balance should increase by 1 ETH minus gas
            expect(finalEthBal + gasUsed - initialEthBal).to.equal(ethers.parseEther("1"));

            // Check contract state
            expect(await seedSale.deposits(addr1.address)).to.equal(0);
        });

        it("Should NOT allow refund if sale successful", async function () {
            await time.increase(61);
            await seedSale.connect(addr1).deposit({ value: ethers.parseEther("6") }); // > SoftCap
            await seedSale.connect(owner).finalizeSale();
            await time.increase(4000); // End time passed

            await expect(
                seedSale.connect(addr1).claimRefund()
            ).to.be.revertedWith("Sale success");
        });
    });

});
