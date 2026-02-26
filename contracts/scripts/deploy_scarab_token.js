// scripts/deploy_scarab_token.js
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("\n🪲 Deploying SCARABToken to BSC Testnet");
    console.log("======================================");
    console.log("Deployer:", deployer.address);
    console.log("Balance: ", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "BNB\n");

    const Token = await ethers.getContractFactory("ScarabToken");
    const token = await Token.deploy(deployer.address, deployer.address);
    await token.waitForDeployment();

    const tokenAddress = await token.getAddress();
    console.log("   ✅ SCARABToken Deployed:", tokenAddress);

    // Update depin_testnet.json
    const configPath = path.join(__dirname, "../deployments/depin_testnet.json");
    let config = {};
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath));
    }

    config.scarabToken = tokenAddress;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("\n💾 SCARABToken address saved to deployments/depin_testnet.json");

    // Also tell user to update .env
    console.log(`\n⚠️  ACTION REQUIRED: Update your .env file with:`);
    console.log(`SCARAB_TOKEN_ADDRESS=${tokenAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
