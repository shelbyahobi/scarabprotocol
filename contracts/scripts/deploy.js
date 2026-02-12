const hre = require("hardhat");

async function main() {
    console.log("🚀 Starting Deployment...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy Wallet Addresses (Use Deployer for now, UPDATE THESE FOR MAINNET)
    const MARKETING_WALLET = deployer.address;
    const SHOP_FUND_WALLET = deployer.address;

    // 2. Deploy ROLL Token
    console.log("\n📄 Deploying ROLLToken...");
    const ROLLToken = await hre.ethers.getContractFactory("ROLLToken");
    const rollToken = await ROLLToken.deploy(MARKETING_WALLET, SHOP_FUND_WALLET);
    await rollToken.waitForDeployment();
    const rollAddress = await rollToken.getAddress();
    console.log(`✅ ROLLToken deployed to: ${rollAddress}`);

    // 3. Deploy SeedSale
    console.log("\n📄 Deploying SeedSale...");
    const SeedSale = await hre.ethers.getContractFactory("SeedSale");

    // Config
    const SOFT_CAP = hre.ethers.parseEther("50"); // 50 BNB
    const HARD_CAP = hre.ethers.parseEther("1000"); // 1000 BNB
    const START_TIME = Math.floor(Date.now() / 1000) + 60; // Start in 1 minute
    const END_TIME = START_TIME + (7 * 24 * 60 * 60); // 7 Days

    const seedSale = await SeedSale.deploy(SOFT_CAP, HARD_CAP, START_TIME, END_TIME);
    await seedSale.waitForDeployment();
    const seedSaleAddress = await seedSale.getAddress();
    console.log(`✅ SeedSale deployed to: ${seedSaleAddress}`);

    // 4. Link Token to Sale
    console.log("\n🔗 Linking Token to SeedSale...");
    await seedSale.setSaleToken(rollAddress);
    console.log("✅ Sale Token Set");

    // 5. Fund SeedSale (Transfer 30% Supply)
    console.log("\n💰 Funding SeedSale Contract...");
    const FUND_AMOUNT = hre.ethers.parseEther("300000000"); // 300M Tokens
    await rollToken.transfer(seedSaleAddress, FUND_AMOUNT);
    console.log("✅ SeedSale Funded with 300M ROLL");

    // 6. Deploy Liquidity Locker
    console.log("\n📄 Deploying LiquidityLocker...");
    const LiquidityLocker = await hre.ethers.getContractFactory("LiquidityLocker");
    const locker = await LiquidityLocker.deploy(rollAddress);
    await locker.waitForDeployment();
    const lockerAddress = await locker.getAddress();
    console.log(`✅ LiquidityLocker deployed to: ${lockerAddress}`);

    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("----------------------------------------------------");
    console.log(`ROLLToken:       ${rollAddress}`);
    console.log(`SeedSale:        ${seedSaleAddress}`);
    console.log(`LiquidityLocker: ${lockerAddress}`);
    console.log("----------------------------------------------------");

    console.log("\n⚠️  NEXT STEP: Verify on BscScan");
    console.log(`npx hardhat verify --network bscTestnet ${rollAddress} "${MARKETING_WALLET}" "${SHOP_FUND_WALLET}"`);
    console.log(`npx hardhat verify --network bscTestnet ${seedSaleAddress} ${SOFT_CAP} ${HARD_CAP} ${START_TIME} ${END_TIME}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
