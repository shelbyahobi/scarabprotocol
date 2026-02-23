// scripts/grant_minter_role.js
// Grants MINTER_ROLE on ScarabToken to EmissionController
// Run: npx hardhat run scripts/grant_minter_role.js --network bscTestnet

const { ethers } = require("hardhat");

const SCARAB_TOKEN = "0xf0b0fDa82035B3052504398d4759046374b13684";
const EMISSION_CONTROLLER = "0x335c5fa723e66bb5237E61Adf3f39C25eE1a023A";

// Minimal ABI — only grantRole + hasRole
const TOKEN_ABI = [
    "function grantRole(bytes32 role, address account) external",
    "function hasRole(bytes32 role, address account) external view returns (bool)",
    "function DEFAULT_ADMIN_ROLE() external view returns (bytes32)",
];

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("\n🔑 Grant MINTER_ROLE — SCARAB Protocol");
    console.log("========================================");
    console.log("Deployer:", deployer.address);

    const token = new ethers.Contract(SCARAB_TOKEN, TOKEN_ABI, deployer);

    const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));

    // Check current state
    const alreadyGranted = await token.hasRole(MINTER_ROLE, EMISSION_CONTROLLER);
    if (alreadyGranted) {
        console.log("✅ EmissionController already has MINTER_ROLE — nothing to do.");
        return;
    }

    console.log("Granting MINTER_ROLE to EmissionController...");
    const tx = await token.grantRole(MINTER_ROLE, EMISSION_CONTROLLER);
    console.log("  Tx sent:", tx.hash);
    await tx.wait();
    console.log("  ✅ MINTER_ROLE granted!");

    // Verify
    const confirmed = await token.hasRole(MINTER_ROLE, EMISSION_CONTROLLER);
    console.log("  Confirmed:", confirmed ? "✅ YES" : "❌ NO");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Failed:", err.message);
        process.exit(1);
    });
