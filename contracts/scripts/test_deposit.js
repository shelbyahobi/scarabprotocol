const hre = require("hardhat");

async function main() {
    console.log("🚀 Starting Deposit Test on Phase 1...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Testing with account:", deployer.address);

    const SEED_SALE_ADDRESS = "0xe728096AE39d68681E3292d27ecF6C909C9b8335"; // Phase 1 Active
    const SeedSale = await hre.ethers.getContractFactory("SeedSale");
    const seedSale = SeedSale.attach(SEED_SALE_ADDRESS);

    // 1. Check Limits before deposit
    try {
        const depositAmount = hre.ethers.parseEther("0.1"); // Valid amount (Min 0.01, Max 1.0)

        console.log(`\nAttempting to deposit ${hre.ethers.formatEther(depositAmount)} BNB...`);

        const tx = await seedSale.connect(deployer).deposit({ value: depositAmount });
        console.log("Transaction sent:", tx.hash);

        await tx.wait();
        console.log("✅ Deposit confirmed!");

        // 2. Verify Deposit Record
        const myDeposit = await seedSale.deposits(deployer.address);
        console.log(`\n🔍 Verified Deposit Balance: ${hre.ethers.formatEther(myDeposit)} BNB`);

        if (myDeposit >= depositAmount) {
            console.log("🎉 SUCCESS: State updated correctly.");
        } else {
            console.error("❌ FAILURE: State did not update.");
        }

    } catch (error) {
        console.error("\n❌ Deposit Failed:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
