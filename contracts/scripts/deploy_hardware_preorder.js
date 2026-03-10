const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("Starting Hardware Preorder Deployment...");
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

    // Paths
    const deployPath = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deployPath)) {
        fs.mkdirSync(deployPath, { recursive: true });
    }
    const deploymentFile = path.join(deployPath, 'hardware_testnet.json');
    let deployments = {};
    if (fs.existsSync(deploymentFile)) {
        deployments = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    }

    // Deploy or reuse Mock USDC
    let usdcAddress = deployments.MockUSDC;
    if (!usdcAddress) {
        console.log("Deploying Mock USDC...");
        const MockToken = await ethers.getContractFactory("MockToken");
        const mockUsdc = await MockToken.deploy("Mock USDC", "mUSDC");
        await mockUsdc.waitForDeployment();
        usdcAddress = mockUsdc.target;
        console.log("Mock USDC Deployed to:", usdcAddress);
        deployments.MockUSDC = usdcAddress;

        // Mint some mock USDC to deployer for testing
        await mockUsdc.mint(deployer.address, ethers.parseUnits("100000", 6));
    } else {
        console.log("Reusing Mock USDC at:", usdcAddress);
    }

    const rdWallet = deployer.address; // For testnet, use deployer as R&D wallet

    // Deploy HardwarePreorder
    console.log("Deploying HardwarePreorder...");
    const HardwarePreorder = await ethers.getContractFactory("HardwarePreorder");
    const hardwarePreorder = await HardwarePreorder.deploy(usdcAddress, rdWallet);
    await hardwarePreorder.waitForDeployment();

    const hardwareAddress = hardwarePreorder.target;
    console.log(`HardwarePreorder deployed to: ${hardwareAddress}`);

    deployments.HardwarePreorder = hardwareAddress;

    // Save
    fs.writeFileSync(deploymentFile, JSON.stringify(deployments, null, 2));
    console.log("Deployment details saved to deployments/hardware_testnet.json");

    // Verify
    console.log("Waiting for block confirmations...");
    if (network.name !== "hardhat" && network.name !== "localhost") {
        await new Promise(r => setTimeout(r, 30000));
        try {
            await run("verify:verify", {
                address: hardwareAddress,
                constructorArguments: [usdcAddress, rdWallet],
            });
            console.log("Verification complete.");
        } catch (e) {
            console.error("Verification failed:", e.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
