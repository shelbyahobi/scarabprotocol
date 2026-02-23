// scripts/verify_balances.js
// Checks token balances and the receipt of the transfer tx
// Run: npx hardhat run scripts/verify_balances.js --network bscTestnet

const { ethers } = require("hardhat");

const SCARAB_TOKEN = "0xf0b0fDa82035B3052504398d4759046374b13684";
const EMISSION_CONTROLLER = "0x335c5fa723e66bb5237E61Adf3f39C25eE1a023A";
const TX_HASH = "0x652d732fcfe02969db47a87bfa0fdb6fc7a202144cd91712d827a0194857bd68";

const TOKEN_ABI = [
    "function balanceOf(address) external view returns (uint256)",
    "function name() external view returns (string)",
];

async function main() {
    const [signer] = await ethers.getSigners();
    const token = new ethers.Contract(SCARAB_TOKEN, TOKEN_ABI, signer);

    const depBal = await token.balanceOf(signer.address);
    const ecBal = await token.balanceOf(EMISSION_CONTROLLER);

    console.log("\n🔍 Balance Check");
    console.log("Deployer:          ", ethers.formatEther(depBal), "ROLL");
    console.log("EmissionController:", ethers.formatEther(ecBal), "ROLL");

    // Check tx receipt
    const receipt = await signer.provider.getTransactionReceipt(TX_HASH);
    if (receipt) {
        console.log("\nTx receipt status:", receipt.status === 1 ? "✅ SUCCESS" : "❌ REVERTED (silent)");
        console.log("Block:", receipt.blockNumber, "| Gas used:", receipt.gasUsed.toString());
    } else {
        console.log("\nTx receipt: NOT FOUND (may still be pending)");
    }
}

main().then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(1); });
