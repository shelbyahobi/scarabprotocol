// scripts/fund_emission_controller.js
// Excludes EmissionController from wallet limits, then transfers 300M SCARAB (Regen Pool)
// Run: npx hardhat run scripts/fund_emission_controller.js --network bscTestnet

const { ethers } = require("hardhat");

const SCARAB_TOKEN = "0xf0b0fDa82035B3052504398d4759046374b13684";
const EMISSION_CONTROLLER = "0x335c5fa723e66bb5237E61Adf3f39C25eE1a023A";
const REGEN_POOL_AMOUNT = ethers.parseEther("300000000"); // 300M

const TOKEN_ABI = [
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function balanceOf(address) external view returns (uint256)",
    "function excludeFromLimits(address account, bool excluded) external",
    "function removeLimits() external",
];

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("\n💰 Fund EmissionController — Regen Pool Transfer");
    console.log("=================================================");
    console.log("Deployer:", deployer.address);

    const token = new ethers.Contract(SCARAB_TOKEN, TOKEN_ABI, deployer);

    // Step 1: Exclude EmissionController from wallet limits
    console.log("\n📋 Step 1: Excluding EmissionController from wallet limits...");
    try {
        const tx1 = await token.excludeFromLimits(EMISSION_CONTROLLER, true);
        await tx1.wait();
        console.log("   ✅ excludeFromLimits() done");
    } catch (e) {
        console.log("   ℹ️  excludeFromLimits() failed:", e.message.slice(0, 80));
        try {
            console.log("   Trying removeLimits()...");
            const tx1b = await token.removeLimits();
            await tx1b.wait();
            console.log("   ✅ removeLimits() — all limits disabled");
        } catch (e2) {
            console.log("   ⚠️  removeLimits() also failed:", e2.message.slice(0, 80));
            console.log("   Proceeding anyway...");
        }
    }

    // Step 2: Check balances
    const deployerBal = await token.balanceOf(deployer.address);
    const ecBal = await token.balanceOf(EMISSION_CONTROLLER);
    console.log("\nDeployer balance:       ", ethers.formatEther(deployerBal), "SCARAB");
    console.log("EmissionController bal: ", ethers.formatEther(ecBal), "SCARAB");

    if (ecBal >= REGEN_POOL_AMOUNT) {
        console.log("✅ Already funded — nothing to do.");
        return;
    }

    // Step 3: Transfer
    console.log("\n📋 Step 2: Transferring", ethers.formatEther(REGEN_POOL_AMOUNT), "SCARAB...");
    const tx = await token.transfer(EMISSION_CONTROLLER, REGEN_POOL_AMOUNT);
    console.log("   Tx:", tx.hash);
    await tx.wait();

    const newBal = await token.balanceOf(EMISSION_CONTROLLER);
    console.log("\n✅ Done! EmissionController balance:", ethers.formatEther(newBal), "SCARAB");
    console.log("📝 Note: On mainnet, use a mintable ScarabToken with MINTER_ROLE.");
}

main().then(() => process.exit(0)).catch(e => { console.error("❌", e.message); process.exit(1); });
