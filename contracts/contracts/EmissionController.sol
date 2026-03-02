// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface INodeTypeRegistry {
    function getNodeEconometrics(uint256 _id) external view returns (uint256 maxDailyBRU, uint256 rwm, bool isActive);
}

/**
 * @title EmissionController V2 (BRU Standard)
 * @notice Institutional-grade emission controller utilizing Base Regenerative Units (BRU).
 *
 * MECHANICS:
 *   1. Epoch Accounting: Rewards are distributed via 30-day discrete epochs to prevent front-running.
 *   2. Daily Decay: Total emission applies a discrete daily exponential decay (λ = 0.00020518) to exactly 
 *      exhaust the 300,000,000 SCARAB pool over ~40 years without halving cliffs.
 *   3. Monopolization Guard: A 5% hard ceiling on individual user BRU share per epoch ensures early-network
 *      or extreme industrial players cannot capture the entirely of a daily emission block.
 */
contract EmissionController is AccessControl, ReentrancyGuard {
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    IERC20 public scarabToken;
    INodeTypeRegistry public nodeRegistry;

    // ─── Emission Constraints ───────────────────────────────────────────────
    uint256 public constant TOTAL_POOL = 300_000_000 * 1e18;
    uint256 public totalEmitted;
    uint256 public currentDailyBudget = 61_554 * 1e18; // D_0 mathematically derived
    uint256 public constant DECAY_RATE = 99979484;     // r = 0.99979484 (1e8 precision)

    uint256 public launchTime;
    uint256 public lastUpdateDay;

    // ─── Epoch Accounting ───────────────────────────────────────────────────
    uint256 public constant EPOCH_LENGTH_DAYS = 30;
    uint256 public currentEpochId;

    struct Epoch {
        uint256 totalBRU;
        uint256 totalBudget;
        bool isClosed;
    }
    mapping(uint256 => Epoch) public epochs;
    mapping(uint256 => mapping(address => uint256)) public userBRUPerEpoch;
    mapping(uint256 => mapping(address => bool))    public hasClaimedEpoch;

    // Lifetime tracking
    mapping(address => uint256) public totalClaimedLifetime;
    mapping(address => uint256) public lifetimeBRUContributed;

    // ─── Events ─────────────────────────────────────────────────────────────
    event BRURecorded(uint256 indexed epochId, address indexed user, uint256 bruAmount);
    event EpochClosed(uint256 indexed epochId, uint256 totalBRU, uint256 totalBudget);
    event RewardsClaimed(address indexed user, uint256 epochId, uint256 rewardAmount, uint256 effectiveBRU);

    // ─── Constructor ────────────────────────────────────────────────────────
    constructor(address _scarabToken, address _nodeRegistry) {
        require(_scarabToken  != address(0), "Zero token");
        require(_nodeRegistry != address(0), "Zero registry");

        scarabToken  = IERC20(_scarabToken);
        nodeRegistry = INodeTypeRegistry(_nodeRegistry);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VALIDATOR_ROLE,     msg.sender);

        launchTime = block.timestamp;
        lastUpdateDay = 0; // Starts at day 0
    }

    // ─── Internal Decay & Epoch Management ──────────────────────────────────

    /**
     * @notice Fast-forwards the exact daily budget decay and aligns funds to their respective epochs.
     * @dev    This approach completely eliminates float math, while remaining perfectly EVM accurate.
     */
    function _transitionEpochsIfNeeded() internal {
        uint256 currentDay = (block.timestamp - launchTime) / 1 days;
        uint256 expectedEpochId = currentDay / EPOCH_LENGTH_DAYS;

        if (currentDay > lastUpdateDay) {
            uint256 daysElapsed = currentDay - lastUpdateDay;

            // Cap the loop if it's been down to prevent out-of-gas, though unlikely on BSC
            if (daysElapsed > 365) daysElapsed = 365;

            for (uint256 i = 0; i < daysElapsed; i++) {
                uint256 dayToProcess = lastUpdateDay + i;
                uint256 epochForDay = dayToProcess / EPOCH_LENGTH_DAYS;

                // Stop emitting entirely if the hard cap is hit
                if (totalEmitted + currentDailyBudget <= TOTAL_POOL) {
                    epochs[epochForDay].totalBudget += currentDailyBudget;
                    totalEmitted += currentDailyBudget;
                    // Apply daily decay
                    currentDailyBudget = (currentDailyBudget * DECAY_RATE) / 1e8;
                }
            }
            lastUpdateDay += daysElapsed;
        }

        // Close epoch if we naturally crossed the boundary
        if (expectedEpochId > currentEpochId) {
            epochs[currentEpochId].isClosed = true;
            emit EpochClosed(currentEpochId, epochs[currentEpochId].totalBRU, epochs[currentEpochId].totalBudget);
            currentEpochId = expectedEpochId;
        }
    }

    // ─── Accumulation ───────────────────────────────────────────────────────

    /**
     * @notice Records verified BRU to the current active Epoch.
     * @param user     User receiving the BRU credit
     * @param bruAmount Quantified BRU (including RWM / GeoMultiplier calculated by Oracle layer)
     */
    function recordBRU(address user, uint256 bruAmount) external onlyRole(VALIDATOR_ROLE) {
        require(user != address(0), "Zero address");
        require(bruAmount > 0, "Zero BRU");

        _transitionEpochsIfNeeded();

        userBRUPerEpoch[currentEpochId][user] += bruAmount;
        epochs[currentEpochId].totalBRU += bruAmount;
        lifetimeBRUContributed[user] += bruAmount;

        emit BRURecorded(currentEpochId, user, bruAmount);
    }

    /**
     * @notice Fallback to trigger updates manually if no oracle submissions occur
     */
    function triggerNetworkUpdate() external { _transitionEpochsIfNeeded(); }

    // ─── Claiming ───────────────────────────────────────────────────────────

    /**
     * @notice Claims rewards for a closed epoch. 
     *         Enforces the 5% maximum epoch share rule to prevent industrial monopolization.
     */
    function claimEpochRewards(uint256 epochId) external nonReentrant returns (uint256) {
        _transitionEpochsIfNeeded(); // Ensure state is fresh
        
        Epoch memory ep = epochs[epochId];
        require(ep.isClosed, "EmissionController: Epoch not closed");
        require(!hasClaimedEpoch[epochId][msg.sender], "EmissionController: Already claimed");

        uint256 rawBru = userBRUPerEpoch[epochId][msg.sender];
        require(rawBru > 0, "EmissionController: No BRU for this epoch");

        uint256 effectiveBru = rawBru;
        uint256 maxBruAllowed = (ep.totalBRU * 5) / 100; // 5% Soft Cap

        // Slice off excess BRU. This permanently 'burns' the excess reward from the network
        // since the denominator remains `ep.totalBRU`.
        if (effectiveBru > maxBruAllowed) {
            effectiveBru = maxBruAllowed;
        }

        uint256 rewardAmount = (effectiveBru * ep.totalBudget) / ep.totalBRU;

        hasClaimedEpoch[epochId][msg.sender] = true;
        totalClaimedLifetime[msg.sender] += rewardAmount;

        require(scarabToken.transfer(msg.sender, rewardAmount), "Transfer failed");

        emit RewardsClaimed(msg.sender, epochId, rewardAmount, effectiveBru);
        return rewardAmount;
    }

    /**
     * @notice Batch claim for UX convenience
     */
    function claimMultipleEpochs(uint256[] calldata epochIds) external nonReentrant {
        _transitionEpochsIfNeeded();
        uint256 totalReward = 0;

        for (uint256 i = 0; i < epochIds.length; i++) {
            uint256 epId = epochIds[i];
            
            if (!epochs[epId].isClosed || hasClaimedEpoch[epId][msg.sender]) continue;
            
            uint256 rawBru = userBRUPerEpoch[epId][msg.sender];
            if (rawBru == 0) continue;

            uint256 effectiveBru = rawBru;
            uint256 maxBruAllowed = (epochs[epId].totalBRU * 5) / 100;
            if (effectiveBru > maxBruAllowed) effectiveBru = maxBruAllowed;

            uint256 reward = (effectiveBru * epochs[epId].totalBudget) / epochs[epId].totalBRU;
            hasClaimedEpoch[epId][msg.sender] = true;
            totalReward += reward;
        }

        require(totalReward > 0, "No valid claims");
        totalClaimedLifetime[msg.sender] += totalReward;
        
        require(scarabToken.transfer(msg.sender, totalReward), "Batch transfer failed");
    }

    // ─── Administration & Views ─────────────────────────────────────────────

    function setValidatorRole(address validator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(VALIDATOR_ROLE, validator);
    }
}
