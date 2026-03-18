const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Treasury contracts with account:", deployer.address);

    // Placeholder Founder Wallets (to be replaced with real multi-sig signers on Mainnet)
    const founders = [
        "0x1111111111111111111111111111111111111111",
        "0x2222222222222222222222222222222222222222",
        "0x3333333333333333333333333333333333333333",
        "0x4444444444444444444444444444444444444444",
        "0x5555555555555555555555555555555555555555",
        "0x6666666666666666666666666666666666666666",
        "0x7777777777777777777777777777777777777777"
    ];

    console.log("Founders (3-of-7 multisig placeholders):");
    founders.forEach((address, index) => console.log(`Founder ${index + 1}: ${address}`));

    // In a real environment, we would deploy a Gnosis Safe here.
    // For testnet/development, we use a mock address or deployer as the multisig owner.
    const mockMultisigOwner = deployer.address; 
    console.log(`Using ${mockMultisigOwner} as the Multisig owner for deployment Phase.`);

    // Mock USDC Address (or real Testnet USDC)
    const usdcAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"; // Testnet BUSD we use as mock
    
    // We need 4 treasury buckets. For now, placeholders:
    const mfgVault = "0x8888888888888888888888888888888888888888";
    const rdTreasury = "0x9999999999999999999999999999999999999999";
    const lpWallet = "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    const bnbWallet = "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";

    const Splitter = await ethers.getContractFactory("ScarabRevenueSplitter");
    console.log("Deploying ScarabRevenueSplitter...");
    const splitter = await Splitter.deploy(
        usdcAddress,
        mfgVault,
        rdTreasury,
        lpWallet,
        bnbWallet,
        mockMultisigOwner
    );

    await splitter.waitForDeployment();
    const splitterAddress = await splitter.getAddress();
    console.log("ScarabRevenueSplitter deployed to:", splitterAddress);

    console.log("\nDeployment Success!");
    console.log(`Treasury Architecture:
- Payment Token: ${usdcAddress}
- Splitter Contract: ${splitterAddress}
- Admin MULTISIG: ${mockMultisigOwner}
- Buckets: MFG(40%), R&D(30%), LP(20%), B&B(10%)`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
