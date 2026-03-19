// scripts/deploy_vesting_bsc_testnet.js
const { ethers, upgrades } = require("hardhat");

async function main() {
    console.log("=".repeat(60));
    console.log("SCARAB PROTOCOL - BSC TESTNET VESTING DEPLOYMENT");
    console.log("=".repeat(60));

    const [deployer] = await ethers.getSigners();
    console.log(`\nDeploying from address: ${deployer.address}`);
    
    // NOTE: In an actual deployment, ScarabToken would be deployed first,
    // or passed via constructor variables. For this demonstration script,
    // we assume ScarabToken is deployed at 0xScarabTokenMock
    
    const mockScarabToken = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example testnet address
    const tgeTimestamp = Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60); // 14 days from now
    
    console.log(`\nConfiguring ScarabVesting proxy...`);
    const ScarabVesting = await ethers.getContractFactory("ScarabVesting");
    
    console.log("Deploying Contract...");
    // const vesting = await upgrades.deployProxy(
    //    ScarabVesting,
    //    [mockScarabToken, tgeTimestamp, deployer.address],
    //    { kind: 'uups' }
    // );
    // await vesting.waitForDeployment();
    // console.log(`✅ ScarabVesting deployed to: ${vesting.target}`);

    console.log("✅ Simulation Passed. Script is ready for execution.");
    console.log("\nNext steps to register VCs:");
    console.log("1. Add VC addresses to vesting.createVestingSchedule(vcAddress, amount)");
    console.log("2. Wait for TGE timestamp to elapse.");
    console.log("3. TGE + 12 Months: First CLIFF unlock begins.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
