// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

interface IDeviceRegistry {
    enum DeviceType { Solar, Water, Biogas, Hydroponics, Bokashi, Other }
    function isDeviceValid(bytes32 deviceIdHash) external view returns (bool);
    function getDevice(bytes32 deviceIdHash) external view returns (
        string memory deviceId,
        address owner,
        uint256 registrationTime,
        bool isActive,
        DeviceType deviceType,
        string memory metadata,
        bytes memory devicePublicKey,
        bytes memory factorySignature,
        bytes32 attestationHash,
        uint256 lastAttestationTime
    );
}

interface IEmissionController {
    function accumulateReward(bytes32 deviceIdHash, address owner, uint256 amount) external;
}

interface IScarabSubscriptions {
    function isSubscribed(address user) external view returns (bool);
}

/**
 * @title BokashiValidator
 * @notice Validates 15-day fermentation cycles for SCARAB Bokashi Smart Nodes.
 *         Implements anti-cheat and quality scoring based on physical metrics
 *         (Temperature, Gas PPM, Weight).
 */
contract BokashiValidator is AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant REVIEWER_ROLE = keccak256("REVIEWER_ROLE");
    bytes32 public constant BRAN_ISSUER_ROLE = keccak256("BRAN_ISSUER_ROLE");

    IDeviceRegistry public deviceRegistry;
    IEmissionController public emissionController;
    IScarabSubscriptions public subscriptions;

    uint256 public constant BASE_BOKASHI_REWARD = 50 * 1e18; // 50 SCARAB per cycle

    struct BokashiCycle {
        uint256 startTime;
        uint256 startWeight;
        uint256 peakTemperature;
        uint256 gasPPM;
        uint256 endWeight;
        uint256 cycleId;
        bool verified;
        bool flagged;
    }

    mapping(bytes32 => BokashiCycle[]) public bokashiCycles; // deviceIdHash => cycles
    mapping(bytes32 => uint256) public lastCycleCompletionTime;
    mapping(string => bool) public usedBranCodes;
    mapping(bytes32 => uint256) public activeCycleStartTime;

    event CycleSubmitted(bytes32 indexed deviceIdHash, uint256 cycleId, uint256 rewardAmount, uint256 qualityScore);
    event CycleFlagged(bytes32 indexed deviceIdHash, uint256 cycleId, string reason);
    event CycleStarted(bytes32 indexed deviceIdHash, string branNonce, uint256 startTime);

    constructor(address _deviceRegistry, address _emissionController, address _subscriptions) {
        deviceRegistry = IDeviceRegistry(_deviceRegistry);
        emissionController = IEmissionController(_emissionController);
        if (_subscriptions != address(0)) {
            subscriptions = IScarabSubscriptions(_subscriptions);
        }

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setSubscriptions(address _subscriptions) external onlyRole(DEFAULT_ADMIN_ROLE) {
        subscriptions = IScarabSubscriptions(_subscriptions);
    }

    /**
     * @notice Start a fermentation cycle by scanning a physical QR code from a Bran bag.
     * @param deviceIdHash Hash of the device ID starting the cycle.
     * @param branNonce Unique single-use string/UUID from the physical bag.
     * @param signature ECDSA signature of (deviceIdHash, branNonce) by BRAN_ISSUER_ROLE.
     */
    function startCycle(bytes32 deviceIdHash, string calldata branNonce, bytes calldata signature) external {
        require(deviceRegistry.isDeviceValid(deviceIdHash), "BokashiValidator: Invalid device");
        
        (, address owner, , , IDeviceRegistry.DeviceType dType, , , , , ) = deviceRegistry.getDevice(deviceIdHash);
        require(dType == IDeviceRegistry.DeviceType.Bokashi, "BokashiValidator: Not a Bokashi device");
        require(msg.sender == owner || hasRole(ORACLE_ROLE, msg.sender), "BokashiValidator: Not authorized");

        if (address(subscriptions) != address(0)) {
            require(subscriptions.isSubscribed(owner), "BokashiValidator: No active bran subscription");
        }

        require(!usedBranCodes[branNonce], "BokashiValidator: Bran code already used");
        require(activeCycleStartTime[deviceIdHash] == 0, "BokashiValidator: Cycle already active");
        
        // Enforce cooldown (approx 14 days minimum between cycles for a device)
        require(block.timestamp >= lastCycleCompletionTime[deviceIdHash] + 14 days, "BokashiValidator: Cooldown active");

        // Verify the signature is from an authorized BRAN_ISSUER
        bytes32 messageHash = keccak256(abi.encodePacked(deviceIdHash, branNonce));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address recoveredSigner = ECDSA.recover(ethSignedMessageHash, signature);
        
        require(hasRole(BRAN_ISSUER_ROLE, recoveredSigner), "BokashiValidator: Invalid signature");

        usedBranCodes[branNonce] = true;
        activeCycleStartTime[deviceIdHash] = block.timestamp;

        emit CycleStarted(deviceIdHash, branNonce, block.timestamp);
    }

    /**
     * @notice Submit a completed Bokashi fermentation cycle (approx 15 days).
     * @param deviceIdHash    Hash of device ID submitting data.
     * @param startTime       UNIX timestamp when cycle started.
     * @param startWeight     Weight at beginning of fermentation (grams).
     * @param peakTemperature Peak temp reached during fermentation (°C).
     * @param gasPPM          Average or peak CO2/VOC ppm detected.
     * @param endWeight       Weight at end of fermentation (grams).
     */
    function submitBokashiCycle(
        bytes32 deviceIdHash,
        uint256 startTime,
        uint256 startWeight,
        uint256 peakTemperature,
        uint256 gasPPM,
        uint256 endWeight
    ) external onlyRole(ORACLE_ROLE) {
        require(deviceRegistry.isDeviceValid(deviceIdHash), "BokashiValidator: Invalid device");
        
        (, address owner, , , IDeviceRegistry.DeviceType dType, , , , , ) = deviceRegistry.getDevice(deviceIdHash);
        require(dType == IDeviceRegistry.DeviceType.Bokashi, "BokashiValidator: Not a Bokashi device");

        if (address(subscriptions) != address(0)) {
            require(subscriptions.isSubscribed(owner), "BokashiValidator: No active bran subscription");
        }

        require(activeCycleStartTime[deviceIdHash] != 0, "BokashiValidator: No active cycle");
        require(startTime >= activeCycleStartTime[deviceIdHash], "BokashiValidator: Start time mismatch");
        require(block.timestamp >= activeCycleStartTime[deviceIdHash] + 1 days, "BokashiValidator: Cycle too short");

        uint256 cycleId = bokashiCycles[deviceIdHash].length;
        
        // Basic anti-cheat sanity checks
        if (startWeight < endWeight || startWeight == 0) {
            _flagCycle(deviceIdHash, startTime, startWeight, peakTemperature, gasPPM, endWeight, cycleId, "INVALID_WEIGHTS");
            return;
        }

        uint256 qualityScore = calculateQualityScore(peakTemperature, gasPPM, startWeight - endWeight, startWeight);
        
        // If quality score is extremely low (e.g. padding numbers), flag it for manual review.
        if (qualityScore < 5000) { 
            _flagCycle(deviceIdHash, startTime, startWeight, peakTemperature, gasPPM, endWeight, cycleId, "LOW_QUALITY_SCORE");
            return;
        }

        bokashiCycles[deviceIdHash].push(BokashiCycle({
            startTime: startTime,
            startWeight: startWeight,
            peakTemperature: peakTemperature,
            gasPPM: gasPPM,
            endWeight: endWeight,
            cycleId: cycleId,
            verified: true,
            flagged: false
        }));

        lastCycleCompletionTime[deviceIdHash] = block.timestamp;
        activeCycleStartTime[deviceIdHash] = 0; // Reset for next cycle

        // Accumulate reward in the EmissionController for the user to claim
        emissionController.accumulateReward(deviceIdHash, owner, (BASE_BOKASHI_REWARD * qualityScore) / 10000);

        emit CycleSubmitted(deviceIdHash, cycleId, (BASE_BOKASHI_REWARD * qualityScore) / 10000, qualityScore);
    }

    function _flagCycle(
        bytes32 deviceIdHash,
        uint256 startTime,
        uint256 startWeight,
        uint256 peakTemperature,
        uint256 gasPPM,
        uint256 endWeight,
        uint256 cycleId,
        string memory reason
    ) internal {
        bokashiCycles[deviceIdHash].push(BokashiCycle({
            startTime: startTime,
            startWeight: startWeight,
            peakTemperature: peakTemperature,
            gasPPM: gasPPM,
            endWeight: endWeight,
            cycleId: cycleId,
            verified: false,
            flagged: true
        }));
        
        lastCycleCompletionTime[deviceIdHash] = block.timestamp; // Enforce wait time even when flagged
        activeCycleStartTime[deviceIdHash] = 0; // Reset
        emit CycleFlagged(deviceIdHash, cycleId, reason);
    }

    /**
     * @notice Calculate quality score (0 - 10000 basis points)
     * Temperature: 40% weight (35-42°C ideal)
     * Gas Production: 30% weight (800+ ppm ideal)
     * Weight Loss: 30% weight (8-15% ideal)
     */
    function calculateQualityScore(
        uint256 peakTemp,
        uint256 gasPPM,
        uint256 weightLoss,
        uint256 startWeight
    ) public pure returns (uint256) {
        uint256 score = 0;
        
        // 1. Temperature check (40% weight = max 4000 pts)
        if (peakTemp >= 35 && peakTemp <= 42) {
            score += 4000;
        } else if (peakTemp >= 30 && peakTemp < 35) {
            score += 2000;
        } else if (peakTemp > 42 && peakTemp <= 45) {
            score += 2000;
        }
        
        // 2. Gas production check (30% weight = max 3000 pts) -> 800+ ppm CO2/VOC
        if (gasPPM >= 800) {
            score += 3000;
        } else if (gasPPM >= 400 && gasPPM < 800) {
            score += 1500;
        }
        
        // 3. Weight loss check (30% weight = max 3000 pts) -> 8-15% ideal
        uint256 lossPercent = (weightLoss * 100) / startWeight;
        if (lossPercent >= 8 && lossPercent <= 15) {
            score += 3000;
        } else if (lossPercent >= 5 && lossPercent < 8) {
            score += 1500;
        } else if (lossPercent > 15 && lossPercent <= 20) {
            score += 1500;
        }
        
        return score;
    }

    function getCycleCount(bytes32 deviceIdHash) external view returns (uint256) {
        return bokashiCycles[deviceIdHash].length;
    }
}
