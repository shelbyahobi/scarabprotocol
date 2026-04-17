const hre = require("hardhat");

async function main() {
    console.log("🚀 Starting Deployment...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy Wallet Addresses (Use Deployer for now, UPDATE THESE FOR MAINNET)
    const MARKETING_WALLET = deployer.address;
    const SHOP_FUND_WALLET = deployer.address;

    // 2. Deploy SCARAB token (factory name must match the Solidity contract in this repo)
    console.log("\n📄 Deploying SCARAB token (ROLLToken factory name)...");
    const ROLLToken = await hre.ethers.getContractFactory("ROLLToken");
    const rollToken = await ROLLToken.deploy(MARKETING_WALLET, SHOP_FUND_WALLET);
    await rollToken.waitForDeployment();
    const rollAddress = await rollToken.getAddress();
    console.log(`✅ Token deployed to: ${rollAddress}`);

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
    await (await seedSale.setSaleToken(rollAddress)).wait();
    console.log("✅ Sale Token Set");

    // 5. Fund SeedSale (Transfer 30% Supply)
    console.log("\n💰 Funding SeedSale Contract...");
    // Update: Exclude SeedSale from Limits first
    await (await rollToken.excludeFromFees(seedSaleAddress, true)).wait();
    await (await rollToken.excludeFromLimits(seedSaleAddress, true)).wait();

    const FUND_AMOUNT = hre.ethers.parseEther("300000000"); // 300M Tokens
    await (await rollToken.transfer(seedSaleAddress, FUND_AMOUNT)).wait();
    console.log("✅ SeedSale Funded with 300M SCARAB");

    // 6. Deploy Liquidity Locker
    console.log("\n📄 Deploying LiquidityLocker...");
    const LiquidityLocker = await hre.ethers.getContractFactory("LiquidityLocker");
    const locker = await LiquidityLocker.deploy();
    await locker.waitForDeployment();
    const lockerAddress = await locker.getAddress();
    console.log(`✅ LiquidityLocker deployed to: ${lockerAddress}`);

    // 7. Deploy DAO (Timelock & Governor)
    console.log("\n🏛️ Deploying DAO Governance...");

    // Timelock
    const MIN_DELAY = 172800; // 2 days
    const proposers = [];
    const executors = [];
    const admin = deployer.address;

    const Timelock = await hre.ethers.getContractFactory("Timelock");
    const timelock = await Timelock.deploy(MIN_DELAY, proposers, executors, admin);
    await timelock.waitForDeployment();
    const timelockAddress = await timelock.getAddress();
    console.log(`✅ Timelock deployed to: ${timelockAddress}`);

    // Governor
    const BeetleGovernor = await hre.ethers.getContractFactory("BeetleGovernor");
    const governor = await BeetleGovernor.deploy(rollAddress, timelockAddress);
    await governor.waitForDeployment();
    const governorAddress = await governor.getAddress();
    console.log(`✅ BeetleGovernor deployed to: ${governorAddress}`);

    // Setup Roles
    console.log("\n👮 Setting up DAO Roles...");
    const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
    const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
    const CANCELLER_ROLE = await timelock.CANCELLER_ROLE();
    const TIMELOCK_ADMIN_ROLE = await timelock.DEFAULT_ADMIN_ROLE();

    await (await timelock.grantRole(PROPOSER_ROLE, governorAddress)).wait();
    await (await timelock.grantRole(EXECUTOR_ROLE, ethers.ZeroAddress)).wait(); // Open execution
    await (await timelock.grantRole(CANCELLER_ROLE, governorAddress)).wait();
    console.log("✅ Roles granted");

    // Transfer Ownerships to Timelock (DAO)
    // Optional: wait for user confirmation or do it now? 
    // Plan lists "Design DAO Architecture" but doesn't explicitly say transfer ownership NOW, but it's implied for DAO to work.
    // I will *not* transfer ownership yet to keep it simple for now, or just log it.
    // Actually, if we don't transfer, the DAO can't do much on the token/sale.
    // But for verification, we might want to keep control.
    // Let's leave ownership with deployer for now and just log the DAO setup.
    console.log("\n🚚 Deploying HubValidator...");
    const HubValidator = await hre.ethers.getContractFactory("HubValidator");
    const hubValidator = await HubValidator.deploy();
    await hubValidator.waitForDeployment();
    const hubValidatorAddress = await hubValidator.getAddress();
    console.log(`✅ HubValidator deployed to: ${hubValidatorAddress}`);

    console.log("\n🏦 Deploying LiquidityBackingVault...");
    const LiquidityBackingVault = await hre.ethers.getContractFactory("LiquidityBackingVault");
    
    // Mock USDC for testnet
    const usdcAddress = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"; // BSC Mainnet USDC placeholder or testnet
    const pancakeRouter = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3"; // Testnet Router
    const lbv = await LiquidityBackingVault.deploy(usdcAddress, rollAddress, pancakeRouter);
    await lbv.waitForDeployment();
    const lbvAddress = await lbv.getAddress();
    console.log(`✅ LiquidityBackingVault deployed to: ${lbvAddress}`);

    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("----------------------------------------------------");
    console.log(`SCARAB token:             ${rollAddress}`);
    console.log(`SeedSale:                 ${seedSaleAddress}`);
    console.log(`LiquidityLocker:          ${lockerAddress}`);
    console.log(`Timelock:                 ${timelockAddress}`);
    console.log(`BeetleGovernor:           ${governorAddress}`);
    console.log(`HubValidator:             ${hubValidatorAddress}`);
    console.log(`LiquidityBackingVault:    ${lbvAddress}`);
    console.log("----------------------------------------------------");

    console.log("\n⚠️  NEXT STEP: Verify on BscScan");
    console.log(`npx hardhat verify --network bscTestnet ${rollAddress} "${MARKETING_WALLET}" "${SHOP_FUND_WALLET}"`);
    console.log(`npx hardhat verify --network bscTestnet ${seedSaleAddress} ${SOFT_CAP} ${HARD_CAP} ${START_TIME} ${END_TIME}`);
    console.log(`npx hardhat verify --network bscTestnet ${hubValidatorAddress}`);
    console.log(`npx hardhat verify --network bscTestnet ${lbvAddress} "${usdcAddress}" "${rollAddress}" "${pancakeRouter}"`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
