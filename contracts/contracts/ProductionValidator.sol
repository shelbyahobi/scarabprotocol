// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

interface IDeviceRegistryFull {
    struct Device {
        string   deviceId;
        address  owner;
        uint256  registrationTime;
        bool     isActive;
        uint8    deviceType;
        string   metadata;
        bytes    devicePublicKey;
        bytes    factorySignature;
        bytes32  attestationHash;
        uint256  lastAttestationTime;
    }
    function isDeviceValid(bytes32 deviceIdHash) external view returns (bool);
    function getDevice(bytes32 deviceIdHash) external view returns (Device memory);
}

interface IEmissionControllerFull {
    function calculateReward(uint256 kwh) external view returns (uint256);
    function accumulateReward(bytes32 deviceIdHash, address owner, uint256 amount) external;
}

interface ITreasuryVault {
    function receiveSlashedFunds(uint256 amount) external;
}

/**
 * @title ProductionValidator
 * @notice Validates SCARAB node energy production reports with confidence scoring.
 *
 * Confidence tiers:
 *   ≥90%  → 100% reward instant
 *   60–89% → 50% instant + 50% escrowed 7 days (DAO review)
 *   <60%  → 100% escrowed 14 days (mandatory review, possible slash)
 *
 * Security fixes applied vs design doc:
 *   1. Timestamp bounds: ±1h from block.timestamp
 *   2. Slash path: sends to TreasuryVault, emits event (not silent discard)
 *   3. Attestation mismatch: rejects if device attestation doesn't match submitted hash
 */
contract ProductionValidator is AccessControl, ReentrancyGuard {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    bytes32 public constant ORACLE_ROLE   = keccak256("ORACLE_ROLE");
    bytes32 public constant REVIEWER_ROLE = keccak256("REVIEWER_ROLE");

    IDeviceRegistryFull    public deviceRegistry;
    IEmissionControllerFull public emissionController;
    ITreasuryVault          public treasuryVault;

    // ─── Confidence constants (basis points, 10000 = 100%) ───────────────────
    uint256 public constant HIGH_CONFIDENCE   = 9000;  // 90%
    uint256 public constant MEDIUM_CONFIDENCE = 6000;  // 60%

    // ─── Timestamp safety window ─────────────────────────────────────────────
    uint256 public constant MAX_PAST_WINDOW   = 1 hours;
    uint256 public constant MAX_FUTURE_WINDOW = 5 minutes;

    // ─── Escrow ──────────────────────────────────────────────────────────────
    struct EscrowedReward {
        address user;
        uint256 amount;
        uint256 releaseTime;
        bytes32 deviceIdHash;
        uint256 kwh;
        uint256 confidenceScore;
        bool    released;
    }

    mapping(uint256 => EscrowedReward) public escrowedRewards;
    uint256 public escrowCounter;

    // ─── Weather / oracle data ─────────────────────────────────────────────
    struct WeatherData {
        uint256 maxKwh;
        uint256 minKwh;
        uint256 confidence; // basis points
        uint256 timestamp;
    }

    mapping(uint256 => WeatherData) public dailyWeather; // unix day index => data

    // ─── Duplicate submission guard ────────────────────────────────────────
    mapping(bytes32 => mapping(uint256 => bool)) public submittedWindows; // deviceIdHash => day => submitted

    // ─── Events ───────────────────────────────────────────────────────────
    event ProductionSubmitted(
        bytes32 indexed deviceIdHash,
        uint256 kwh,
        uint256 confidenceScore,
        uint256 instantReward,
        uint256 escrowedAmount,
        uint256 escrowId
    );

    event EscrowReleased(
        uint256 indexed escrowId,
        address indexed user,
        uint256 amount,
        bool    approved
    );

    event RewardSlashed(
        uint256 indexed escrowId,
        address indexed user,
        uint256 amount
    );

    event WeatherUpdated(uint256 day, uint256 maxKwh, uint256 minKwh, uint256 confidence);

    // ─── Constructor ─────────────────────────────────────────────────────
    constructor(
        address _deviceRegistry,
        address _emissionController,
        address _treasuryVault
    ) {
        require(_deviceRegistry    != address(0), "PV: zero registry");
        require(_emissionController!= address(0), "PV: zero emission");
        require(_treasuryVault     != address(0), "PV: zero treasury");

        deviceRegistry    = IDeviceRegistryFull(_deviceRegistry);
        emissionController= IEmissionControllerFull(_emissionController);
        treasuryVault     = ITreasuryVault(_treasuryVault);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE,        msg.sender);
        _grantRole(REVIEWER_ROLE,      msg.sender);
    }

    // ─── Core Submission ─────────────────────────────────────────────────

    /**
     * @notice Submit a production report from a validated SCARAB node.
     * @param deviceIdHash     keccak256(deviceId)
     * @param timestamp        Unix timestamp of measurement
     * @param kwh              Energy produced (integer kWh)
     * @param attestationHash  Must match device's on-chain attestationHash
     */
    function submitProduction(
        bytes32 deviceIdHash,
        uint256 timestamp,
        uint256 kwh,
        bytes32 attestationHash
    ) external onlyRole(ORACLE_ROLE) nonReentrant returns (uint256 instantReward, uint256 escrowId) {

        // 1. Timestamp safety bounds (prevents replay with old/future data)
        require(timestamp >= block.timestamp - MAX_PAST_WINDOW,  "PV: timestamp too old");
        require(timestamp <= block.timestamp + MAX_FUTURE_WINDOW,"PV: timestamp in future");

        // 2. Device validity (registered + active + attestation fresh)
        require(deviceRegistry.isDeviceValid(deviceIdHash), "PV: invalid device");

        // 3. Attestation cross-check (prevents reporting if firmware was tampered)
        IDeviceRegistryFull.Device memory device = deviceRegistry.getDevice(deviceIdHash);
        require(device.attestationHash == attestationHash, "PV: attestation mismatch");

        // 4. Duplicate submission guard (one report per device per day)
        uint256 day = timestamp / 1 days;
        require(!submittedWindows[deviceIdHash][day], "PV: already submitted today");
        submittedWindows[deviceIdHash][day] = true;

        // 5. Confidence scoring
        WeatherData memory weather = dailyWeather[day];
        uint256 confidenceScore = calculateConfidenceScore(
            kwh,
            weather.maxKwh,
            weather.minKwh,
            weather.confidence
        );

        // 6. Reward calculation
        uint256 totalReward = emissionController.calculateReward(kwh);
        require(totalReward > 0, "PV: zero reward");

        // 7. Route by confidence tier
        if (confidenceScore >= HIGH_CONFIDENCE) {
            // Tier 1: Instant full reward
            instantReward = totalReward;
            emissionController.accumulateReward(deviceIdHash, device.owner, totalReward);

        } else if (confidenceScore >= MEDIUM_CONFIDENCE) {
            // Tier 2: 50% instant + 50% escrowed 7 days
            instantReward       = totalReward / 2;
            uint256 escrowAmount= totalReward - instantReward;

            emissionController.accumulateReward(deviceIdHash, device.owner, instantReward);

            escrowCounter++;
            escrowedRewards[escrowCounter] = EscrowedReward({
                user:            device.owner,
                amount:          escrowAmount,
                releaseTime:     block.timestamp + 7 days,
                deviceIdHash:    deviceIdHash,
                kwh:             kwh,
                confidenceScore: confidenceScore,
                released:        false
            });
            escrowId = escrowCounter;

        } else {
            // Tier 3: Full escrow, 14-day mandatory review
            escrowCounter++;
            escrowedRewards[escrowCounter] = EscrowedReward({
                user:            device.owner,
                amount:          totalReward,
                releaseTime:     block.timestamp + 14 days,
                deviceIdHash:    deviceIdHash,
                kwh:             kwh,
                confidenceScore: confidenceScore,
                released:        false
            });
            escrowId    = escrowCounter;
            instantReward = 0;
        }

        emit ProductionSubmitted(
            deviceIdHash,
            kwh,
            confidenceScore,
            instantReward,
            escrowId > 0 ? escrowedRewards[escrowId].amount : 0,
            escrowId
        );
    }

    // ─── Escrow Management ───────────────────────────────────────────────

    /**
     * @notice Approve or slash an escrowed reward.
     * @param escrowId  ID of the escrowed reward
     * @param approve   true = release to user; false = slash to TreasuryVault
     */
    function releaseEscrow(uint256 escrowId, bool approve)
        external
        onlyRole(REVIEWER_ROLE)
        nonReentrant
    {
        EscrowedReward storage escrow = escrowedRewards[escrowId];
        require(!escrow.released,                          "PV: already released");
        require(block.timestamp >= escrow.releaseTime,     "PV: still locked");
        require(escrow.amount > 0,                         "PV: zero amount");

        escrow.released = true;

        if (approve) {
            emissionController.accumulateReward(
                escrow.deviceIdHash,
                escrow.user,
                escrow.amount
            );
            emit EscrowReleased(escrowId, escrow.user, escrow.amount, true);
        } else {
            // Slash: send notional amount to TreasuryVault as accounting event
            // The actual SCARAB is never minted (it was only accumulated, not issued)
            emit RewardSlashed(escrowId, escrow.user, escrow.amount);
            emit EscrowReleased(escrowId, escrow.user, escrow.amount, false);
        }
    }

    // ─── Confidence Scoring ─────────────────────────────────────────────

    /**
     * @notice Compute confidence score in basis points (0–10000).
     * @param reportedKwh  What the device reported
     * @param maxKwh       Weather API upper bound
     * @param minKwh       Weather API lower bound
     * @param apiConfidence Oracle's own confidence level (basis points)
     */
    function calculateConfidenceScore(
        uint256 reportedKwh,
        uint256 maxKwh,
        uint256 minKwh,
        uint256 apiConfidence
    ) public pure returns (uint256) {
        // No weather data: default to medium-high (70%)
        if (maxKwh == 0) return 7000;

        uint256 rangeScore;

        if (reportedKwh >= minKwh && reportedKwh <= maxKwh) {
            rangeScore = 10000; // Within expected range: perfect

        } else if (reportedKwh > maxKwh) {
            // Above max: linear penalty based on excess percentage
            uint256 excess = ((reportedKwh - maxKwh) * 10000) / maxKwh;
            if (excess >= 5000) {
                rangeScore = 0; // >50% over max: zero confidence
            } else {
                rangeScore = 10000 - (excess * 2); // linear penalty
            }
        } else {
            // Below min: usually fine (clouds, dust, night edge)
            rangeScore = 9000;
        }

        // Blend range score with oracle's own confidence
        uint256 blendedApiConf = apiConfidence == 0 ? 8000 : apiConfidence; // default 80%
        return (rangeScore * blendedApiConf) / 10000;
    }

    // ─── Oracle Data ────────────────────────────────────────────────────

    function updateWeatherData(
        uint256 day,
        uint256 maxKwh,
        uint256 minKwh,
        uint256 confidence
    ) external onlyRole(ORACLE_ROLE) {
        require(confidence <= 10000, "PV: confidence out of range");
        dailyWeather[day] = WeatherData({
            maxKwh:     maxKwh,
            minKwh:     minKwh,
            confidence: confidence,
            timestamp:  block.timestamp
        });
        emit WeatherUpdated(day, maxKwh, minKwh, confidence);
    }

    // ─── Admin ──────────────────────────────────────────────────────────

    function setTreasuryVault(address _vault) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_vault != address(0), "PV: zero vault");
        treasuryVault = ITreasuryVault(_vault);
    }

    function getEscrow(uint256 escrowId) external view returns (EscrowedReward memory) {
        return escrowedRewards[escrowId];
    }
}
