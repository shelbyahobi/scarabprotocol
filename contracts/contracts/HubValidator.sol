// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title HubValidator
 * @notice Manages the two-phase hub handshake reward system.
 *         Phase 1: Micro-handshake at user drop-off (40% instant)
 *         Phase 2: Bulk handshake at farm delivery (50% released)
 *         Hub operator receives 10% at Phase 1.
 *
 *         Escrow timeout: 72 hours. If farm delivery not confirmed,
 *         escrowed 50% redistributed as penalty compensation.
 */
contract HubValidator is AccessControl, ReentrancyGuard, Pausable {

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant HUB_OPERATOR_ROLE = keccak256("HUB_OPERATOR_ROLE");

    uint256 public constant ESCROW_TIMEOUT = 72 hours;

    // Waste stream reward multipliers (basis points, 10000 = 1.0x)
    mapping(bytes32 => uint256) public streamMultipliers;

    struct DropOffEvent {
        bytes32 hubId;
        bytes32 userId;
        bytes32 streamType;      // "BOKASHI", "UCO", "FAT"
        uint256 quantity;        // grams or millilitres
        uint256 qualityScore;    // 0-10000 (basis points)
        uint256 microReward;     // 40% released immediately (BRU)
        uint256 escrowedReward;  // 50% held until bulk handshake
        uint256 hubReward;       // 10% to hub operator
        uint256 depositedAt;
        bool bulkHandshakeComplete;
        bool expired;
    }

    // keccak256(hubId || userId || timestamp) => DropOffEvent
    mapping(bytes32 => DropOffEvent) public dropOffs;

    struct BulkHandshakeEvent {
        bytes32 hubId;
        bytes32 farmId;
        bytes32[] dropOffIds;    // all events in this bulk transfer
        uint256 totalQuantity;
        uint256 logisticsEfficiencyRatio; // car trips avoided
        uint256 co2SavedGrams;   // calculable from trip count
        uint256 executedAt;
    }

    mapping(bytes32 => BulkHandshakeEvent) public bulkHandshakes;

    // Nonce registry for replay protection
    // keccak256(hubId || userId || nonce) => used
    mapping(bytes32 => bool) public usedNonces;

    event MicroHandshake(
        bytes32 indexed dropOffId,
        bytes32 indexed hubId,
        bytes32 indexed userId,
        bytes32 streamType,
        uint256 quantity,
        uint256 microReward
    );

    event BulkHandshake(
        bytes32 indexed bulkId,
        bytes32 indexed hubId,
        bytes32 indexed farmId,
        uint256 dropOffCount,
        uint256 co2SavedGrams
    );

    event EscrowReleased(bytes32 indexed dropOffId, address recipient);
    event EscrowExpired(bytes32 indexed dropOffId);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // Set initial multipliers (in basis points, 10000 = 1.0)
        streamMultipliers[keccak256("BOKASHI")] = 10000;  // 1.0x
        streamMultipliers[keccak256("UCO")]     = 25000;  // 2.5x
        streamMultipliers[keccak256("FAT")]     = 18000;  // 1.8x
        streamMultipliers[keccak256("GREASE")]  = 8000;   // 0.8x
    }

    /**
     * @notice Called by Oracle when user scans hub QR code.
     *         Releases 40% reward immediately, escrows 50%.
     * @param hubId The unique identifier of the hub taking delivery.
     * @param userId The unique identifier of the depositing user.
     * @param streamType Waste type (e.g., BOKASHI, UCO, FAT).
     * @param quantity Grams or Millilitres of material dropped off.
     * @param qualityScore Basis points from sensor evaluation (0-10000).
     * @param nonce Replay protection nonce.
     * @param hubSignature ECDSA signature validating the hub's intent.
     * @param oracleSignature ECDSA signature validating the Oracle's cloud validation.
     */
    function recordMicroHandshake(
        bytes32 hubId,
        bytes32 userId,
        bytes32 streamType,
        uint256 quantity,
        uint256 qualityScore,
        bytes32 nonce,
        bytes calldata hubSignature,
        bytes calldata oracleSignature
    ) external onlyRole(ORACLE_ROLE) nonReentrant whenNotPaused {

        // Replay protection
        bytes32 nonceKey = keccak256(abi.encodePacked(hubId, userId, nonce));
        require(!usedNonces[nonceKey], "HubValidator: nonce already used");
        usedNonces[nonceKey] = true;

        // Quality gate: reject if quality score < 30% (3000 basis points)
        require(qualityScore >= 3000, "HubValidator: quality below threshold");

        // Calculate rewards
        uint256 baseBRU = _calculateBaseBRU(streamType, quantity);
        uint256 qualityAdjusted = (baseBRU * qualityScore) / 10000;

        uint256 microReward  = (qualityAdjusted * 40) / 100;  // 40%
        uint256 escrowReward = (qualityAdjusted * 50) / 100;  // 50%
        uint256 hubReward    = (qualityAdjusted * 10) / 100;  // 10%

        bytes32 dropOffId = keccak256(
            abi.encodePacked(hubId, userId, block.timestamp, nonce)
        );

        dropOffs[dropOffId] = DropOffEvent({
            hubId: hubId,
            userId: userId,
            streamType: streamType,
            quantity: quantity,
            qualityScore: qualityScore,
            microReward: microReward,
            escrowedReward: escrowReward,
            hubReward: hubReward,
             depositedAt: block.timestamp,
            bulkHandshakeComplete: false,
            expired: false
        });

        // Emit for Oracle to trigger token distribution
        emit MicroHandshake(
            dropOffId, hubId, userId, streamType, quantity, microReward
        );
    }

    /**
     * @notice Called when farmer collects bulk load from hub.
     *         Releases escrowed 50% for all included drop-offs.
     *         Records Logistics Efficiency Ratio on-chain.
     * @param hubId The unique identifier of the hub releasing the load.
     * @param farmId The unique identifier of the farmer taking the load.
     * @param dropOffIds Array of micro-handshake event hashes being bundled.
     * @param vehicleType Logistics transport vector (0=diesel, 1=EV, 2=bike).
     * @param distanceKm Kilometres travelled from hub to sink.
     * @param nonce Replay protection nonce.
     * @param farmSignature ECDSA signature from the farmer authenticating receipt.
     */
    function recordBulkHandshake(
        bytes32 hubId,
        bytes32 farmId,
        bytes32[] calldata dropOffIds,
        uint256 vehicleType,  // 0=diesel van, 1=EV, 2=cargo bike
        uint256 distanceKm,
        bytes32 nonce,
        bytes calldata farmSignature
    ) external onlyRole(ORACLE_ROLE) nonReentrant whenNotPaused {

        uint256 totalQuantity = 0;
        uint256 dropOffCount = dropOffIds.length;
        require(dropOffCount > 0, "HubValidator: no drop-offs");

        (uint256 efficiencyRatio, uint256 netCO2savedGrams) = _calcLogistics(
            dropOffCount, vehicleType, distanceKm
        );


        // Release escrow for each drop-off
        for (uint256 i = 0; i < dropOffCount; i++) {
            DropOffEvent storage d = dropOffs[dropOffIds[i]];
            require(d.depositedAt > 0, "HubValidator: invalid drop-off ID");
            require(!d.bulkHandshakeComplete, "HubValidator: already processed");
            require(!d.expired, "HubValidator: escrow expired");
            require(
                block.timestamp <= d.depositedAt + ESCROW_TIMEOUT,
                "HubValidator: timeout exceeded"
            );

            d.bulkHandshakeComplete = true;
            totalQuantity += d.quantity;

            emit EscrowReleased(dropOffIds[i], address(0)); // Oracle handles transfer
        }

        bytes32 bulkId = keccak256(
            abi.encodePacked(hubId, farmId, block.timestamp, nonce)
        );

        bulkHandshakes[bulkId] = BulkHandshakeEvent({
            hubId: hubId,
            farmId: farmId,
            dropOffIds: dropOffIds,
            totalQuantity: totalQuantity,
            logisticsEfficiencyRatio: efficiencyRatio,
            co2SavedGrams: netCO2savedGrams,
            executedAt: block.timestamp
        });

        emit BulkHandshake(bulkId, hubId, farmId, dropOffCount, netCO2savedGrams);
    }

    /**
     * @notice Processes expired escrows (called by keeper/Oracle).
     *         If bulk handshake not completed within 72hr,
     *         escrowed 50% is redistributed: 40% user + 10% hub penalty.
     * @param dropOffId The specific hash ID of the expired deposit event.
     */
    function processExpiredEscrow(bytes32 dropOffId)
        external onlyRole(ORACLE_ROLE) whenNotPaused
    {
        DropOffEvent storage d = dropOffs[dropOffId];
        require(d.depositedAt > 0, "HubValidator: not found");
        require(!d.bulkHandshakeComplete, "HubValidator: already complete");
        require(!d.expired, "HubValidator: already expired");
        require(
            block.timestamp > d.depositedAt + ESCROW_TIMEOUT,
            "HubValidator: not yet expired"
        );

        d.expired = true;
        emit EscrowExpired(dropOffId);
        // Oracle triggers penalty redistribution off-chain
    }

    function _calculateBaseBRU(bytes32 streamType, uint256 quantity)
        internal view returns (uint256)
    {
        uint256 multiplier = streamMultipliers[streamType];
        require(multiplier > 0, "HubValidator: unknown stream type");
        // Base: 1 BRU per 100g Bokashi = 100 BRU per kg
        // Multiplied by stream-specific rate
        return (quantity * multiplier) / (10000 * 100);
    }

    /**
     * @notice Admin function to pause protocol for security emergencies.
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Admin function to unpause protocol after security emergencies.
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _calcLogistics(uint256 dropOffCount, uint256 vehicleType, uint256 distanceKm)
        internal pure returns (uint256 efficiencyRatio, uint256 netCO2savedGrams)
    {
        uint256 avoidedTrips = dropOffCount;
        uint256 avoidedCarKm = avoidedTrips * 4;
        uint256 actualKgCO2perKm = vehicleType == 1 ? 0 : 180; // EV = 0 tailpipe
        uint256 avoidedCO2grams = avoidedCarKm * 180;
        uint256 actualCO2grams  = distanceKm * actualKgCO2perKm;
        
        netCO2savedGrams = avoidedCO2grams > actualCO2grams
            ? avoidedCO2grams - actualCO2grams
            : 0;

        efficiencyRatio = (avoidedTrips * 10000) / 1;
    }
}
