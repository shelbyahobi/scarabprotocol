const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeviceRegistry Activation Fee", function () {
    let ScarabToken, scarabToken;
    let DeviceRegistry, deviceRegistry;
    let owner, addr1, marketingWallet, shopFundWallet;

    beforeEach(async function () {
        [owner, addr1, marketingWallet, shopFundWallet] = await ethers.getSigners();

        ScarabToken = await ethers.getContractFactory("ScarabToken");
        scarabToken = await ScarabToken.deploy(
            marketingWallet.address,
            shopFundWallet.address
        );

        DeviceRegistry = await ethers.getContractFactory("DeviceRegistry");
        // Using a dummy 64-byte factory key array
        const dummyKey = new Uint8Array(64);
        deviceRegistry = await DeviceRegistry.deploy(dummyKey);

        // Grand roles if necessary (owner gets DEFAULT_ADMIN_ROLE and REGISTRAR_ROLE in constructor)
        await scarabToken.enableTrading();
    });

    it("Should burn 50 SCARAB on registration", async function () {
        // Send user sum tokens
        await scarabToken.transfer(addr1.address, ethers.parseEther("100"));

        // Approve DeviceRegistry
        await scarabToken.connect(addr1).approve(
            deviceRegistry.target,
            ethers.parseEther("50")
        );

        // Enable activation fee
        await deviceRegistry.setActivationConfig(
            scarabToken.target,
            ethers.parseEther("50"),
            true
        );

        const burnedBefore = await scarabToken.totalBurned();

        // Register device
        await deviceRegistry.registerDevice(
            "SOLAR-001",
            addr1.address,
            0, // Solar
            "ipfs://CID",
            new Uint8Array(64), // pubkey
            new Uint8Array(64), // signature
            ethers.zeroPadValue(ethers.toBeHex(1), 32)
        );

        const burnedAfter = await scarabToken.totalBurned();

        // Verify 50 SCARAB burned
        expect(burnedAfter - burnedBefore).to.equal(ethers.parseEther("50"));
    });

    it("Should work without activation fee when disabled", async function () {
        // Fee disabled by default in setup
        const burnedBefore = await scarabToken.totalBurned();

        await deviceRegistry.registerDevice(
            "WATER-001",
            addr1.address,
            1, // Water
            "ipfs://CID2",
            new Uint8Array(64), // pubkey
            new Uint8Array(64), // signature
            ethers.zeroPadValue(ethers.toBeHex(2), 32)
        );

        // Should succeed without burning
        expect(await scarabToken.totalBurned()).to.equal(burnedBefore);
    });
});
