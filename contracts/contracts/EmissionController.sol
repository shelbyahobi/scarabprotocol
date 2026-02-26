// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDeviceRegistry {
    function getDevicesByOwner(address owner) external view returns (bytes32[] memory);
}

/**
 * @title EmissionController
 * @notice Pull-based reward emission for SCARAB Protocol DePIN nodes.
 *
 * GAS MODEL:
 *   PUSH (old): 1,000 devices × 288 submissions/day = 288,000 txs → $374/day
 *   PULL (now): 1,000 users × 1 claim/week = 143 txs/day → $0.53/day
 *   Savings: 99.86% gas reduction
 *
 * Flow:
 *   1. ProductionValidator calls accumulateReward() → updates ledger, NO MINT
 *   2. User calls claimRewards() when ready → single mint tx
 */
contract EmissionController is AccessControl, ReentrancyGuard {

    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    IERC20 public scarabToken;
    IDeviceRegistry public deviceRegistry;

    /// @notice Total SCARAB allocated to the Regeneration Pool (from tokenomics: 30%)
    uint256 public regenPoolAllocation;
    /// @notice Total rewards minted to date
    uint256 public totalRewardsMinted;

    uint256 public constant MIN_CLAIM_INTERVAL = 1 days;
    uint256 public constant ADMIN_CLAIM_LOCKOUT = 90 days; // centralization guard

    // ─── Per-user reward ledger ─────────────────────────────────────────────
    mapping(address  => uint256) public accumulatedRewards;
    mapping(address  => uint256) public lastClaimTime;
    mapping(address  => uint256) public totalClaimed;

    // ─── Per-device tracking ────────────────────────────────────────────────
    mapping(bytes32 => uint256) public pendingRewards;       // deviceIdHash => pending
    mapping(bytes32 => uint256) public deviceTotalRewards;   // deviceIdHash => lifetime
    mapping(bytes32 => uint256) public deviceLastSubmission;

    // ─── Reward rate config ─────────────────────────────────────────────────
    /// @notice Base reward per kWh in SCARAB (18 decimals). Adjusted by DAO.
    uint256 public rewardPerKwh = 10 * 1e18; // 10 SCARAB per kWh
    uint256 public constant DECAY_LAMBDA_BP = 19; // 0.0019 = 19 basis points (halves every ~365 days)
    uint256 public immutable launchTime;

    // ─── Events ─────────────────────────────────────────────────────────────

    event RewardAccumulated(
        address indexed user,
        bytes32 indexed deviceIdHash,
        uint256 amount,
        uint256 totalPending
    );

    event RewardsClaimed(
        address indexed user,
        uint256 amount,
        uint256 deviceCount
    );

    event RewardPerKwhUpdated(uint256 oldRate, uint256 newRate);

    // ─── Constructor ─────────────────────────────────────────────────────────

    constructor(address _scarabToken, address _deviceRegistry, uint256 _regenPoolAllocation) {
        require(_scarabToken    != address(0), "EmissionController: zero token");
        require(_deviceRegistry != address(0), "EmissionController: zero registry");

        scarabToken          = IERC20(_scarabToken);
        deviceRegistry       = IDeviceRegistry(_deviceRegistry);
        regenPoolAllocation  = _regenPoolAllocation;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VALIDATOR_ROLE,     msg.sender);

        launchTime = block.timestamp;
    }

    // ─── Accumulation (called by ProductionValidator) ─────────────────────────

    /**
     * @notice Record earned reward WITHOUT minting. Gas cost: ~30k vs ~80k for mint.
     * @param deviceIdHash Device that produced energy
     * @param owner        Wallet to credit
     * @param rewardAmount SCARAB amount (18 decimals)
     */
    function accumulateReward(
        bytes32 deviceIdHash,
        address owner,
        uint256 rewardAmount
    ) external onlyRole(VALIDATOR_ROLE) {
        require(owner      != address(0), "EmissionController: zero owner");
        require(rewardAmount > 0,         "EmissionController: zero reward");
        require(
            totalRewardsMinted + rewardAmount <= regenPoolAllocation,
            "EmissionController: regen pool exhausted"
        );

        accumulatedRewards[owner]       += rewardAmount;
        pendingRewards[deviceIdHash]    += rewardAmount;
        deviceTotalRewards[deviceIdHash]+= rewardAmount;
        deviceLastSubmission[deviceIdHash] = block.timestamp;

        emit RewardAccumulated(owner, deviceIdHash, rewardAmount, accumulatedRewards[owner]);
    }

    // ─── Claiming (called by user) ────────────────────────────────────────────

    /**
     * @notice Claim all accumulated rewards in a single transaction.
     *         Can claim at most once per day (prevents spam; weekly typical).
     */
    function claimRewards() external nonReentrant returns (uint256 amount) {
        require(
            block.timestamp >= lastClaimTime[msg.sender] + MIN_CLAIM_INTERVAL,
            "EmissionController: claim too soon"
        );

        amount = accumulatedRewards[msg.sender];
        require(amount > 0, "EmissionController: nothing to claim");

        // Update state before external call (CEI pattern)
        accumulatedRewards[msg.sender]  = 0;
        lastClaimTime[msg.sender]       = block.timestamp;
        totalClaimed[msg.sender]        += amount;
        totalRewardsMinted              += amount;

        // Single transfer transaction from protocol vault
        require(scarabToken.transfer(msg.sender, amount), "EmissionController: transfer failed");

        uint256 deviceCount = deviceRegistry.getDevicesByOwner(msg.sender).length;
        emit RewardsClaimed(msg.sender, amount, deviceCount);
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    /**
     * @notice Returns pending rewards, lifetime claimed, and estimated daily rate.
     */
    function estimateRewards(address user) external view returns (
        uint256 pending,
        uint256 claimedTotal,
        uint256 estimatedDailyRate
    ) {
        pending      = accumulatedRewards[user];
        claimedTotal = totalClaimed[user];

        if (lastClaimTime[user] > 0 && block.timestamp > lastClaimTime[user]) {
            uint256 daysSinceClaim = (block.timestamp - lastClaimTime[user]) / 1 days;
            if (daysSinceClaim > 0) {
                estimatedDailyRate = pending / daysSinceClaim;
            }
        }
    }

    function viewPendingRewards(address user) external view returns (uint256) {
        return accumulatedRewards[user];
    }

    function regenPoolRemaining() external view returns (uint256) {
        return regenPoolAllocation - totalRewardsMinted;
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    /**
     * @notice Calculate exponential decay multiplier for token emission constraints.
     *         Calculates: M = (1 - 0.0019)^days
     */
    function calculateExponentialDecay(uint256 daysSinceLaunch) public view returns (uint256) {
        uint256 rate = rewardPerKwh;
        uint256 base = 10000 - DECAY_LAMBDA_BP; 
        uint256 precision = 10000;
        
        uint256 multiplier = 10000;
        uint256 _days = daysSinceLaunch;
        uint256 currentBase = base;
        
        while (_days > 0) {
            if (_days % 2 != 0) {
                multiplier = (multiplier * currentBase) / precision;
            }
            currentBase = (currentBase * currentBase) / precision;
            _days /= 2;
        }
        
        return (rate * multiplier) / precision;
    }

    /**
     * @notice Calculate reward for a given kWh output.
     */
    function calculateReward(uint256 kwh) public view returns (uint256) {
        uint256 daysSinceLaunch = (block.timestamp - launchTime) / 1 days;
        uint256 decayedRate = calculateExponentialDecay(daysSinceLaunch);
        return kwh * decayedRate;
    }

    function setRewardPerKwh(uint256 newRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        emit RewardPerKwhUpdated(rewardPerKwh, newRate);
        rewardPerKwh = newRate;
    }

    /**
     * @notice Emergency claim for inactive users (e.g. lost wallet migration).
     * @dev    Restricted to accounts inactive for 90+ days to prevent centralization.
     */
    function adminClaim(address user) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant returns (uint256) {
        require(
            block.timestamp >= lastClaimTime[user] + ADMIN_CLAIM_LOCKOUT,
            "EmissionController: user is active, cannot admin claim"
        );

        uint256 amount = accumulatedRewards[user];
        require(amount > 0, "EmissionController: no rewards");

        accumulatedRewards[user]  = 0;
        totalClaimed[user]        += amount;
        totalRewardsMinted        += amount;

        require(scarabToken.transfer(user, amount), "EmissionController: transfer failed");
        return amount;
    }

    function setValidatorRole(address validator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(VALIDATOR_ROLE, validator);
    }
}
