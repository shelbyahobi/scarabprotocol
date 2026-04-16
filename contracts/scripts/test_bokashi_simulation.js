const hre = require("hardhat");
const { ethers } = hre;
const fs = require("fs");
const path = require("path");

/**
 * SCARAB Protocol — Bokashi Simulation Flow (BSC Testnet)
 *
 * Sequence executed:
 * 1) Deploy BokashiValidator with isTestnet=true
 * 2) Activate one test device (deviceId, pubkey, GPS coords)
 * 3) Start a Bokashi cycle
 * 4) Submit 3 telemetry readings
 * 5) Complete cycle and claim BRU rewards
 * 6) Execute handshake between two test wallet addresses
 *
 * Run:
 *   npx hardhat run scripts/test_bokashi_simulation.js --network bscTestnet
 */
async function main() {
  const rpc = process.env.BSC_TESTNET_RPC;
  if (!rpc) {
    throw new Error("Missing BSC_TESTNET_RPC in environment.");
  }

  console.log("BSC Testnet RPC:", rpc);

  const results = {
    network: "bscTestnet",
    rpc: rpc,
    actors: {},
    steps: {},
    telemetry: [],
    cycleData: {},
    balances: {},
  };

  const [admin, userWallet, oracleWallet] = await ethers.getSigners();
  if (!admin || !userWallet || !oracleWallet) {
    throw new Error("Need at least 3 funded signer accounts in Hardhat config.");
  }

  console.log("Admin: ", admin.address);
  console.log("User:  ", userWallet.address);
  console.log("Oracle:", oracleWallet.address);
  results.actors = {
    admin: admin.address,
    userWallet: userWallet.address,
    oracleWallet: oracleWallet.address,
  };

  // Auxiliary deploys required by BokashiValidator constructor dependencies.
  const MockERC20 = await ethers.getContractFactory("contracts/mocks/MockERC20.sol:MockERC20");
  const scarab = await MockERC20.deploy("SCARAB (Sim)", "SCARAB", ethers.parseEther("1000000000"), 18);
  await scarab.waitForDeployment();

  const MockRegistry = await ethers.getContractFactory("MockSimulationDeviceRegistry");
  const registry = await MockRegistry.deploy();
  await registry.waitForDeployment();

  const MockEmission = await ethers.getContractFactory("MockSimulationEmissionController");
  const emissionController = await MockEmission.deploy(
    await scarab.getAddress(),
    await registry.getAddress(),
    ethers.parseEther("300000000")
  );
  await emissionController.waitForDeployment();

  await (await scarab.transfer(await emissionController.getAddress(), ethers.parseEther("300000000"))).wait();
  await (await emissionController.setOracle(oracleWallet.address)).wait();

  // 1) Deploy BokashiValidator with isTestnet=true
  const BokashiValidator = await ethers.getContractFactory("BokashiValidator");
  const bokashi = await BokashiValidator.deploy(
    await registry.getAddress(),
    await emissionController.getAddress(),
    ethers.ZeroAddress,
    true
  );
  await bokashi.waitForDeployment();

  // Grant roles needed for startCycle + telemetry + cycle completion.
  await (await bokashi.grantRole(await bokashi.ORACLE_ROLE(), oracleWallet.address)).wait();
  await (await bokashi.grantRole(await bokashi.BRAN_ISSUER_ROLE(), admin.address)).wait();

  const deployTxHash = bokashi.deploymentTransaction().hash;
  console.log(`[STEP 1] Deploy BokashiValidator (isTestnet=true): ${deployTxHash}`);
  results.steps.deployBokashiValidator = deployTxHash;

  // 2) Activate one test device (deviceId, pubkey, GPS coords)
  const deviceId = "SCARAB-BOKASHI-TEST-001";
  const pubKey = ethers.randomBytes(64);
  const gps = { lat: 52.520008, lon: 13.404954 }; // Berlin test coordinates
  const metadata = JSON.stringify({
    model: "Bokashi_Home_V1",
    gps,
    network: "bsc-testnet",
  });
  const factorySignature = ethers.randomBytes(64);
  const attestationHash = ethers.id("ATECC608A:SCARAB:TESTNET");

  const activateTx = await registry.registerDevice(
    deviceId,
    userWallet.address,
    4, // DeviceType.Bokashi_Home
    metadata,
    pubKey,
    factorySignature,
    attestationHash
  );
  await activateTx.wait();
  console.log(`[STEP 2] Activate test device: ${activateTx.hash}`);
  results.steps.activateDevice = activateTx.hash;

  const deviceIdHash = ethers.keccak256(ethers.toUtf8Bytes(deviceId));

  // 3) Start a Bokashi cycle
  const branNonce = ethers.hexlify(ethers.randomBytes(16)).slice(2);
  const branMsgHash = ethers.solidityPackedKeccak256(["string"], [branNonce]);
  const branSignature = await admin.signMessage(ethers.getBytes(branMsgHash));

  const startCycleTx = await bokashi
    .connect(userWallet)
    .startCycle(deviceIdHash, branNonce, branSignature);
  await startCycleTx.wait();
  console.log(`[STEP 3] Start Bokashi cycle: ${startCycleTx.hash}`);
  results.steps.startCycle = startCycleTx.hash;

  // 4) Submit 3 telemetry readings (weight, temp, humidity values)
  // Contract accepts (temperature, weight). Humidity is logged in script for traceability.
  const telemetrySeries = [
    { temp: 31, weight: 4950, humidity: 62 },
    { temp: 38, weight: 4740, humidity: 67 },
    { temp: 35, weight: 4525, humidity: 60 },
  ];

  for (let i = 0; i < telemetrySeries.length; i++) {
    const t = telemetrySeries[i];
    const tx = await bokashi.connect(oracleWallet).logTelemetry(deviceIdHash, t.temp, t.weight);
    await tx.wait();
    console.log(
      `[STEP 4.${i + 1}] Telemetry #${i + 1} (weight=${t.weight}, temp=${t.temp}, humidity=${t.humidity}%): ${tx.hash}`
    );
    results.telemetry.push({
      index: i + 1,
      txHash: tx.hash,
      weight: t.weight,
      temperature: t.temp,
      humidity: t.humidity,
    });
  }

  // 5) Complete the cycle and claim BRU rewards
  const cycleStartTime = await bokashi.activeCycleStartTime(deviceIdHash);
  const completeTx = await bokashi.connect(oracleWallet).submitBokashiCycle(
    deviceIdHash,
    cycleStartTime,
    5000, // startWeight
    38, // peakTemperature
    900, // gasPPM
    4500, // endWeight
    4, // lidOpenings
    4750 // averageFillWeight
  );
  await completeTx.wait();
  console.log(`[STEP 5A] Complete cycle: ${completeTx.hash}`);
  results.steps.completeCycle = completeTx.hash;

  const claimTx = await emissionController.connect(userWallet).claimRewards();
  await claimTx.wait();
  console.log(`[STEP 5B] Claim BRU rewards: ${claimTx.hash}`);
  results.steps.claimRewards = claimTx.hash;

  // 6) Execute a handshake between two test wallet addresses
  // In this simulation, handshake distribution is finalized on claim:
  // 80% to userWallet + 20% to oracleWallet.
  const userBal = await scarab.balanceOf(userWallet.address);
  const oracleBal = await scarab.balanceOf(oracleWallet.address);
  console.log(
    `[STEP 6] Handshake executed between ${userWallet.address} and ${oracleWallet.address} via reward split in claim tx ${claimTx.hash}`
  );
  console.log(`[RESULT] User SCARAB: ${ethers.formatEther(userBal)}`);
  console.log(`[RESULT] Oracle SCARAB: ${ethers.formatEther(oracleBal)}`);

  const cycleData = {
    startWeight: 5000,
    peakTemperature: 38,
    gasPPM: 900,
    endWeight: 4500,
    lidOpenings: 4,
    averageFillWeight: 4750,
  };
  console.log("Cycle Data:", cycleData);
  results.cycleData = cycleData;

  results.steps.handshake = claimTx.hash;
  results.balances = {
    userScarab: ethers.formatEther(userBal),
    oracleScarab: ethers.formatEther(oracleBal),
  };

  const outputPath = path.join(__dirname, "simulation_output.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Simulation output written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
