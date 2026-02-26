const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying MarketingTimelock with account:", deployer.address);

    // Load config
    const depinInfoPath = path.join(__dirname, '..', 'deployments', `depin_testnet.json`);
    const depinInfo = JSON.parse(fs.readFileSync(depinInfoPath));
    const SCARAB_TOKEN = depinInfo.scarabToken;

    const TOTAL_ALLOCATION = hre.ethers.parseEther("100000000"); // 100M
    const IMMEDIATE_UNLOCK = hre.ethers.parseEther("2000000");   // 2M

    // For testnet demonstration, setting the deployer and two mock addresses as the multi-sig members.
    // In production, these should be Ledger hardware wallets or actual Safe signers.
    const MULTISIG_MEMBERS = [
        deployer.address,
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Hardhat Account 1
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Hardhat Account 2
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Hardhat Account 3
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906"  // Hardhat Account 4
    ];

    // Deploy
    const MarketingTimelock = await hre.ethers.getContractFactory("MarketingTimelock");
    const marketingTimelock = await MarketingTimelock.deploy(
        SCARAB_TOKEN,
        TOTAL_ALLOCATION,
        IMMEDIATE_UNLOCK,
        MULTISIG_MEMBERS
    );

    await marketingTimelock.waitForDeployment();
    const marketingAddress = await marketingTimelock.getAddress();

    console.log("MarketingTimelock deployed to:", marketingAddress);
    console.log("\nAllocation:");
    console.log("- Total: 100,000,000 SCARAB");
    console.log("- Immediate: 2,000,000 SCARAB (2%)");
    console.log("- Vesting: 98,000,000 SCARAB over 24 months");
    console.log("\nMulti-sig members:", MULTISIG_MEMBERS.length);
    console.log("- Approvals required: 3");
    console.log("- Timelock delay: 48 hours");

    // Save deployment info
    const deploymentInfo = {
        marketingTimelock: marketingAddress,
        multisigMembers: MULTISIG_MEMBERS,
        totalAllocation: "100000000",
        immediateUnlock: "2000000",
        deployedAt: new Date().toISOString(),
        network: hre.network.name
    };

    const outPath = path.join(__dirname, '..', 'deployments', `marketing_timelock_${hre.network.name}.json`);
    fs.writeFileSync(outPath, JSON.stringify(deploymentInfo, null, 2));

    console.log("\n✅ Deployment saved");

    const scarab = await hre.ethers.getContractAt("ScarabToken", SCARAB_TOKEN);

    console.log("\nExcluding MarketingTimelock from max wallet limits...");
    const tx1 = await scarab.connect(deployer).excludeFromLimits(marketingAddress, true);
    await tx1.wait();

    console.log("Transferring 100,000,000 tokens to MarketingTimelock contract...");
    const tx2 = await scarab.connect(deployer).transfer(marketingAddress, TOTAL_ALLOCATION);
    await tx2.wait();
    console.log("✅ Marketing allocation securely locked in Timelock!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
