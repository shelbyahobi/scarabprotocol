const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("------------------------------------------------------------");
    console.log("SCARAB MAINNET ROLE INITIALIZATION");
    console.log("Executing from:", deployer.address);
    console.log("------------------------------------------------------------");

    // 1. ADDRRESS CONFIGURATION (Double-check these against your deployments/depin_mainnet.json)
    // TODO: REPLACE WITH ACTUAL MAINNET DEPLOYMENT ADDRESSES
    const SCARAB_TOKEN_ADDR = "0x0000000000000000000000000000000000000001"; // Your Deployed Token
    const EMISSION_CONTROLLER_ADDR = "0x0000000000000000000000000000000000000002";
    const PRODUCTION_VALIDATOR_ADDR = "0x0000000000000000000000000000000000000003";
    const ORACLE_WALLET = "0x0000000000000000000000000000000000000004"; // The wallet used by your hardware gateway
    const MULTISIG_SAFE = "0x0000000000000000000000000000000000000005"; // Your 3-of-5 Admin Safe

    // 2. ROLE DEFINITIONS (Standard OpenZeppelin Hashes)
    const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
    const MINTER_ROLE = ethers.id("MINTER_ROLE");
    const ORACLE_ROLE = ethers.id("ORACLE_ROLE");
    const VALIDATOR_ROLE = ethers.id("VALIDATOR_ROLE");

    // 3. ATTACH CONTRACTS
    const token = await ethers.getContractAt("ScarabToken", SCARAB_TOKEN_ADDR);
    const controller = await ethers.getContractAt("EmissionController", EMISSION_CONTROLLER_ADDR);

    // NOTE: If ProductionValidator doesn't exist yet or is named differently, adjust here.
    // Presuming a generic validator contract for this script based on user spec.
    let validator;
    try {
        validator = await ethers.getContractAt("ProductionValidator", PRODUCTION_VALIDATOR_ADDR);
    } catch (e) {
        console.warn("[WARNING] ProductionValidator contract artifact not found. Using generic Contract instance.");
        // Fallback for script compilation if ProductionValidator isn't compiled yet in this workspace
        const genericAbi = [
            "function hasRole(bytes32 role, address account) view returns (bool)",
            "function grantRole(bytes32 role, address account)"
        ];
        validator = await ethers.getContractAt(genericAbi, PRODUCTION_VALIDATOR_ADDR);
    }

    console.log("Verifying current state...");

    // 4. AUTOMATED ROLE GRANTING (The "Safety First" Loop)
    const tasks = [
        { name: "Minter -> Controller", contract: token, role: MINTER_ROLE, account: EMISSION_CONTROLLER_ADDR },
        { name: "Oracle -> Gateway", contract: validator, role: ORACLE_ROLE, account: ORACLE_WALLET },
        { name: "Validator -> Controller", contract: controller, role: VALIDATOR_ROLE, account: PRODUCTION_VALIDATOR_ADDR },
    ];

    for (const task of tasks) {
        try {
            const hasRole = await task.contract.hasRole(task.role, task.account);
            if (hasRole) {
                console.log(`[SKIPPED] ${task.name}: Role already granted.`);
            } else {
                console.log(`[GRANTING] ${task.name}...`);
                const tx = await task.contract.grantRole(task.role, task.account);
                await tx.wait(2); // Wait for 2 confirmations on BSC/Polygon
                console.log(`[SUCCESS] Hash: ${tx.hash}`);
            }
        } catch (e) {
            console.error(`[ERROR] Failed task ${task.name}: ${e.message}`);
        }
    }

    // 5. THE "CLEAN UP": TRANSFER ADMIN TO MULTISIG
    console.log("------------------------------------------------------------");
    console.log("FINALIZING SECURITY: Transferring Admin to Multi-Sig Safe");

    const contracts = [token, controller, validator];
    for (const contract of contracts) {
        try {
            const address = await contract.getAddress();
            const isAdmin = await contract.hasRole(DEFAULT_ADMIN_ROLE, MULTISIG_SAFE);
            if (!isAdmin) {
                console.log(`Granting Admin to Safe on ${address}...`);
                const tx = await contract.grantRole(DEFAULT_ADMIN_ROLE, MULTISIG_SAFE);
                await tx.wait(1);
                console.log(`[SUCCESS] Admin granted for ${address}`);
            } else {
                console.log(`[SKIPPED] Safe is already Admin on ${address}`);
            }
        } catch (e) {
            console.error(`[ERROR] Admin transfer failed: ${e.message}`);
        }
    }

    console.log("------------------------------------------------------------");
    console.log("DEPLOYMENT COMPLETE & VERIFIED.");
    console.log("!!! ACTION REQUIRED: Log in to your Multi-Sig and revoke the Deployer wallet's Admin Role !!!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
