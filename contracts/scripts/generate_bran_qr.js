const { ethers } = require("hardhat");
const QRCode = require('qrcode');

async function main() {
    // In production, this is the private key of the BRAN_ISSUER_ROLE
    // For testnet, we'll just use a random wallet or the deployer
    console.log("-----------------------------------------");
    console.log("  SCARAB BOKASHI BRAN QR GENERATOR");
    console.log("-----------------------------------------");

    const issuerWallet = ethers.Wallet.createRandom();
    console.log(`[INFO] Simulated Issuer Address: ${issuerWallet.address}`);
    console.log(`[INFO] (In production, ensure this address has BRAN_ISSUER_ROLE)\n`);

    // 1. Generate a unique nonce (simulating a unique serial printed on the bag)
    // We use a random UUID or a simple hex string
    const branNonce = ethers.hexlify(ethers.randomBytes(16)).substring(2);
    console.log(`[STEP 1] Generated Unique Bran Nonce: ${branNonce}`);

    // 2. Hash the nonce according to the smart contract logic
    // bytes32 messageHash = keccak256(abi.encodePacked(branNonce));
    const messageHash = ethers.solidityPackedKeccak256(["string"], [branNonce]);

    // 3. Sign the hash (ethers handles the Ethereum Signed Message prefix automatically)
    const signature = await issuerWallet.signMessage(ethers.getBytes(messageHash));
    console.log(`[STEP 2] Cryptographically Signed by Issuer:`);
    console.log(`${signature.substring(0, 30)}...\n`);

    // 4. Create the payload that will be embedded in the QR Code
    const payload = JSON.stringify({
        nonce: branNonce,
        sig: signature
    });

    console.log(`[STEP 3] QR Code Payload (JSON):`);
    console.log(payload, "\n");

    // 5. Output a terminal representation of what the user scans
    console.log("[STEP 4] Printing QR Code to terminal...");
    QRCode.toString(payload, { type: 'terminal', small: true }, function (err, url) {
        console.log(url);
    });

    console.log(`\nWhen a user scans this with the SCARAB App, the app calls:`);
    console.log(`BokashiValidator.startCycle(myDeviceIdHash, "${branNonce}", "<signature>")`);
    console.log("The smart contract cryptographically proves this came from SCARAB.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
