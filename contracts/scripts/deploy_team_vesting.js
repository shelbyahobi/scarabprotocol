const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying TeamVesting with account:", deployer.address);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

    // Make sure we have the token deployed first
    const depinInfoPath = path.join(__dirname, '..', 'deployments', `depin_testnet.json`);
    if (!fs.existsSync(depinInfoPath)) {
        throw new Error("Cannot find deployment info for SCARAB token on this network!");
    }
    const depinInfo = JSON.parse(fs.readFileSync(depinInfoPath));
    const SCARAB_TOKEN = depinInfo.scarabToken;

    // Use deployer as the safe multi-sig beneficiary for now. When transferring to Mainnet, we'll swap this to a Safe contract.
    const BENEFICIARY = deployer.address;
    const TOTAL_ALLOCATION = hre.ethers.parseEther("50000000"); // 50M SCARAB

    // Deploy
    const TeamVesting = await hre.ethers.getContractFactory("TeamVesting");
    const teamVesting = await TeamVesting.deploy(
        SCARAB_TOKEN,
        BENEFICIARY,
        TOTAL_ALLOCATION
    );

    await teamVesting.waitForDeployment();
    const teamVestingAddress = await teamVesting.getAddress();

    console.log("TeamVesting deployed to:", teamVestingAddress);
    console.log("\nVesting Schedule:");
    console.log("- Total allocation: 50,000,000 SCARAB");
    console.log("- Cliff period: 12 months");
    console.log("- Vesting period: 24 months");
    console.log("- Beneficiary:", BENEFICIARY);

    // Save deployment info
    const deploymentInfo = {
        teamVesting: teamVestingAddress,
        beneficiary: BENEFICIARY,
        totalAllocation: "50000000",
        deployedAt: new Date().toISOString(),
        network: hre.network.name
    };

    const outPath = path.join(__dirname, '..', 'deployments', `team_vesting_${hre.network.name}.json`);
    fs.writeFileSync(outPath, JSON.stringify(deploymentInfo, null, 2));

    console.log("\n✅ Deployment info saved to deployments/");

    const scarab = await hre.ethers.getContractAt("ScarabToken", SCARAB_TOKEN);

    console.log("\nExcluding TeamVesting from max wallet limits...");
    const tx1 = await scarab.connect(deployer).excludeFromLimits(teamVestingAddress, true);
    await tx1.wait();

    console.log("Transferring 50,000,000 tokens to TeamVesting contract...");
    const tx2 = await scarab.connect(deployer).transfer(teamVestingAddress, TOTAL_ALLOCATION);
    await tx2.wait();
    console.log("✅ Team allocation securely locked!");

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
