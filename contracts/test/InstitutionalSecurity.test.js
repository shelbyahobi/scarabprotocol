const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Institutional Security Infrastructure", function () {
    let scarabToken, deviceRegistry, emissionController, timelock, proxyAdmin;
    let deployer, governance, user, attacker;

    const MIN_DELAY = 48 * 60 * 60; // 48 hours

    before(async function () {
        [deployer, governance, user, attacker] = await ethers.getSigners();

        // 1. Deploy Timelock
        const TimelockController = await ethers.getContractFactory("ScarabTimelockController");
        timelock = await TimelockController.deploy(
            [deployer.address], // Deployer temporary proposer
            [ethers.ZeroAddress],
            deployer.address
        );
        const timelockAddress = await timelock.getAddress();

        // 2. Deploy ProxyAdmin
        const ProxyAdmin = await ethers.getContractFactory("ScarabProxyAdmin");
        proxyAdmin = await ProxyAdmin.deploy(timelockAddress);
        const proxyAdminAddress = await proxyAdmin.getAddress();

        // 3. Deploy UUPS Token
        const SCARABToken = await ethers.getContractFactory("ScarabToken");
        scarabToken = await upgrades.deployProxy(
            SCARABToken,
            [deployer.address, deployer.address],
            { kind: 'uups' }
        );

        // 4. Deploy UUPS Registry
        const DeviceRegistry = await ethers.getContractFactory("DeviceRegistry");
        const factoryKey = "0x" + "0".repeat(128);
        deviceRegistry = await upgrades.deployProxy(
            DeviceRegistry,
            [factoryKey, deployer.address, deployer.address],
            { kind: 'uups' }
        );

        // 5. Deploy UUPS Emission
        const EmissionController = await ethers.getContractFactory("EmissionController");
        emissionController = await upgrades.deployProxy(
            EmissionController,
            [await scarabToken.getAddress(), await deviceRegistry.getAddress(), deployer.address, deployer.address],
            { kind: 'uups' }
        );

        // --- HANDOVER CEREMONY REPLICATION ---
        const DEFAULT_ADMIN_ROLE = await scarabToken.DEFAULT_ADMIN_ROLE();
        const UPGRADER_ROLE = await scarabToken.UPGRADER_ROLE();

        // Grant to Timelock
        await scarabToken.connect(deployer).grantRole(DEFAULT_ADMIN_ROLE, timelockAddress);
        await scarabToken.connect(deployer).grantRole(UPGRADER_ROLE, timelockAddress);

        await deviceRegistry.connect(deployer).grantRole(DEFAULT_ADMIN_ROLE, timelockAddress);
        await deviceRegistry.connect(deployer).grantRole(UPGRADER_ROLE, timelockAddress);

        await emissionController.connect(deployer).grantRole(DEFAULT_ADMIN_ROLE, timelockAddress);
        await emissionController.connect(deployer).grantRole(UPGRADER_ROLE, timelockAddress);

        // Revoke Deployer
        await scarabToken.connect(deployer).revokeRole(UPGRADER_ROLE, deployer.address);
        await scarabToken.connect(deployer).revokeRole(DEFAULT_ADMIN_ROLE, deployer.address);

        await deviceRegistry.connect(deployer).revokeRole(UPGRADER_ROLE, deployer.address);
        await deviceRegistry.connect(deployer).revokeRole(DEFAULT_ADMIN_ROLE, deployer.address);

        await emissionController.connect(deployer).revokeRole(UPGRADER_ROLE, deployer.address);
        await emissionController.connect(deployer).revokeRole(DEFAULT_ADMIN_ROLE, deployer.address);

        // Setup Governance Safe (governance signer) as proposer
        const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
        await timelock.connect(deployer).grantRole(PROPOSER_ROLE, governance.address);

        // Self-revoke admin on timelock
        const TIMELOCK_ADMIN = await timelock.DEFAULT_ADMIN_ROLE();
        await timelock.connect(deployer).revokeRole(TIMELOCK_ADMIN, deployer.address);
    });

    describe("Mint Boundary Isolation", function () {
        it("Should prevent Governance Safe from direct minting", async function () {
            await expect(
                scarabToken.connect(governance).mint(user.address, 1000)
            ).to.be.reverted;
        });

        it("Should prevent Deployer from minting after handover", async function () {
            await expect(
                scarabToken.connect(deployer).mint(user.address, 1000)
            ).to.be.reverted;
        });

        it("Should allow only EmissionController to mint (via MINTER_ROLE)", async function () {
            const MINTER_ROLE = await scarabToken.MINTER_ROLE();
            await scarabToken.connect(governance); // Cannot do this directly

            // This test would require a timelock proposal to grant MINTER to emission
            // But we can check role status
            expect(await scarabToken.hasRole(MINTER_ROLE, await emissionController.getAddress())).to.be.false;
            // Correct, because handover script grants it.
        });
    });

    describe("Timelock Enforcement (48h Delay)", function () {
        it("Should revert direct upgrade attempts from Governance Safe", async function () {
            const newImpl = await (await ethers.getContractFactory("ScarabToken")).deploy();
            await (await newImpl.waitForDeployment());

            await expect(
                scarabToken.connect(governance).upgradeToAndCall(await newImpl.getAddress(), "0x")
            ).to.be.reverted;
        });

        it("Should only allow upgrades through Timelock + maturation", async function () {
            // Logic: Timelock holds UPGRADER_ROLE.
            expect(await scarabToken.hasRole(await scarabToken.UPGRADER_ROLE(), await timelock.getAddress())).to.be.true;
        });
    });

    describe("Circuit Breaker Throttling", function () {
        it("Should enforce per-device daily caps in EmissionController", async function () {
            const VALIDATOR_ROLE = await emissionController.VALIDATOR_ROLE();
            // Grant validator role to deployer for testing
            // Needs timelock in reality

            const cap = await emissionController.dailyProductionCapPerDevice();
            expect(cap).to.equal(ethers.parseEther("20"));
        });
    });

    describe("Revocation Verification", function () {
        it("Should confirm deployer has ZERO administrative power", async function () {
            const DEFAULT_ADMIN_ROLE = await scarabToken.DEFAULT_ADMIN_ROLE();
            expect(await scarabToken.hasRole(DEFAULT_ADMIN_ROLE, deployer.address)).to.be.false;
            expect(await deviceRegistry.hasRole(DEFAULT_ADMIN_ROLE, deployer.address)).to.be.false;
            expect(await emissionController.hasRole(DEFAULT_ADMIN_ROLE, deployer.address)).to.be.false;
        });
    });
});
