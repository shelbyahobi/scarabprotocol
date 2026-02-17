const hre = require("hardhat");

async function main() {
    console.log("🚀 Starting Phase 1 (Architect Round) Deployment...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    // 1. Deploy Scarab Token
    console.log("\n📄 Deploying ScarabToken ($SCARAB)...");
    const ScarabToken = await hre.ethers.getContractFactory("ScarabToken");
    // Constructor requires: _marketingWallet, _shopFundWallet
    // We use deployer for now.
    const scarabToken = await ScarabToken.deploy(deployer.address, deployer.address);
    await scarabToken.waitForDeployment();
    const scarabAddress = await scarabToken.getAddress();
    console.log(`✅ ScarabToken deployed to: ${scarabAddress}`);

    // 2. Deploy SeedSale Phase 1
    console.log("\n📄 Deploying SeedSale (Phase 1)...");
    const SeedSale = await hre.ethers.getContractFactory("SeedSale");

    // PHASE 1 PARAMETERS
    const SOFT_CAP = hre.ethers.parseEther("5");      // 5 BNB
    const HARD_CAP = hre.ethers.parseEther("6.25");   // 6.25 BNB
    const START_TIME = Math.floor(Date.now() / 1000) + 60; // Start in 1 minute
    const END_TIME = START_TIME + (21 * 24 * 60 * 60); // 21 Days

    const TOKENS_PER_BNB = 8_000_000;
    const REFERRAL_PERCENT = 7;
    const MAX_CONTRIBUTION = hre.ethers.parseEther("1"); // 1 BNB Max

    const seedSale = await SeedSale.deploy(
        SOFT_CAP,
        HARD_CAP,
        START_TIME,
        END_TIME,
        TOKENS_PER_BNB,
        REFERRAL_PERCENT,
        MAX_CONTRIBUTION
    );
    await seedSale.waitForDeployment();
    const seedSaleAddress = await seedSale.getAddress();
    console.log(`✅ SeedSale (Phase 1) deployed to: ${seedSaleAddress}`);

    // 3. Link Token & Fund
    console.log("\n🔗 Configuring Sale...");
    await (await seedSale.setSaleToken(scarabAddress)).wait();

    // Amount needed: 6.25 BNB * 8,000,000 = 50,000,000 SCARAB
    const FUND_AMOUNT = hre.ethers.parseEther("50000000");

    await (await scarabToken.excludeFromFees(seedSaleAddress, true)).wait();
    await (await scarabToken.excludeFromLimits(seedSaleAddress, true)).wait();
    await (await scarabToken.transfer(seedSaleAddress, FUND_AMOUNT)).wait();
    console.log(`✅ Funded Sale with 50,000,000 SCARAB`);

    console.log("\n🎉 PHASE 1 DEPLOYMENT COMPLETE!");
    console.log("----------------------------------------------------");
    console.log(`ScarabToken: ${scarabAddress}`);
    console.log(`SeedSale:    ${seedSaleAddress}`);
    console.log("----------------------------------------------------");
    console.log(`Use this to verify SeedSale:`);
    console.log(`npx hardhat verify --network bscTestnet ${seedSaleAddress} ${SOFT_CAP} ${HARD_CAP} ${START_TIME} ${END_TIME} ${TOKENS_PER_BNB} ${REFERRAL_PERCENT} ${MAX_CONTRIBUTION}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
