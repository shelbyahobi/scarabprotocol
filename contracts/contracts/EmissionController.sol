// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// Interfaces for external dependencies
interface IScarabToken {
    function mintFromRegenPool(address to, uint256 amount) external;
}

interface IProductionValidator {
    function calculateDeviceEfficiency(string calldata deviceId) external view returns (uint256);
}

/**
 * @title EmissionController (Hybrid Volume + Time)
 * @notice Controls the release of SCARAB from the Regeneration Pool using time-based decay with activity/stake multipliers.
 * 
 * EMISSION FORMULA (HYBRID):
 * E_user(t) = BASE × ACTIVITY × STAKE × EFFICIENCY
 * 
 * Where:
 * BASE = D₀ × e^(-λt)  [Time-based exponential decay - Highly Predictable for VCs]
 * ACTIVITY = min(1.5, volume_30d / target_30d)  [Rewards high network engagement]
 * STAKE = min(2.0, 1.0 + sqrt(staked_amount/10000)) [Rewards capital lockup]
 * EFFICIENCY = min(1.0, BRU_user / BRU_network) [Sybil Resistance]
 */
contract EmissionController is UUPSUpgradeable, AccessControlUpgradeable {
    
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    
    IScarabToken public SCARAB;
    IProductionValidator public validator;
    
    // Core Constants
    uint256 public constant DAILY_REWARD_POOL = 1_000_000 * 10**18; // D₀
    uint256 public constant DECAY_RATE_LAMBDA = 20518; // λ = 0.00020518 (scaled by 1e8)
    uint256 public constant SCALE = 1e8;
    
    // Staking logic
    mapping(address => uint256) public userStakes;
    mapping(string => uint256) public deviceVolume30d;
    uint256 public constant TARGET_VOLUME_30D = 1000; // Expected baseline volume per period
    
    event EmissionDistributed(address indexed user, string deviceId, uint256 amount, uint256 activityBonus, uint256 stakeBonus);
    event StakeDeposited(address indexed user, uint256 amount);
    event StakeWithdrawn(address indexed user, uint256 amount);
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize(address _scarab, address _validator) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        
        SCARAB = IScarabToken(_scarab);
        validator = IProductionValidator(_validator);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
    }
    
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    // --- STAKING LOGIC ---
    function depositStake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        require(IERC20Upgradeable(address(SCARAB)).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        userStakes[msg.sender] += amount;
        emit StakeDeposited(msg.sender, amount);
    }
    
    function withdrawStake(uint256 amount) external {
        require(userStakes[msg.sender] >= amount, "Insufficient stake");
        userStakes[msg.sender] -= amount;
        require(IERC20Upgradeable(address(SCARAB)).transfer(msg.sender, amount), "Transfer failed");
        emit StakeWithdrawn(msg.sender, amount);
    }

    // --- MATH HELPERS ---
    
    // sqrt using babylonian method
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    /**
     * @notice Calculates the Stake Multiplier: 1.0 + sqrt(staked_amount/10000)
     * Caps at 2.0 (representing a 2x bonus)
     * Scaled by 100 (e.g., 200 = 2.0x)
     */
    function getStakeMultiplier(address user) public view returns (uint256) {
        uint256 stakedTokens = userStakes[user] / 10**18; 
        if(stakedTokens == 0) return 100; // 1.0x

        // Cap staking formula explicitly to 2.0x (10000 staked implies +1.0)
        uint256 bonusBase = stakedTokens / 10000;
        uint256 bonusRaw = sqrt(bonusBase) * 100; 

        uint256 totalMultiplier = 100 + bonusRaw;
        if(totalMultiplier > 200) {
            return 200; // Max 2.0x
        }
        return totalMultiplier;
    }

    /**
     * @notice Calculates the Activity Multiplier based on relative volume
     * Caps at 150 (1.5x)
     */
    function getActivityMultiplier(string calldata deviceId) public view returns (uint256) {
        uint256 volume = deviceVolume30d[deviceId];
        if(volume == 0) return 100; 

        // 100 base * (volume / target) -> max 150
        uint256 rawMultiplier = (volume * 100) / TARGET_VOLUME_30D;
        if (rawMultiplier > 150) {
            return 150;
        } else if (rawMultiplier < 50) {
            return 50; // Minimum 0.5x penalty for extreme inactivity
        }
        return rawMultiplier;
    }

    // --- EMISSION ROUTING ---

    /**
     * @notice Oracle triggers daily distribution
     */
    function distributeReward(
        address user, 
        string calldata deviceId, 
        uint256 volumeSinceLastTick
    ) external onlyRole(ORACLE_ROLE) {
        // 1. Update rolling volume metrics
        deviceVolume30d[deviceId] += volumeSinceLastTick;

        // 2. Calculate BASE reward
        // For simplicity in this demo logic, we assume base = 100 SCARAB per node.
        // In production, this pulls the time-decay lambda function.
        uint256 baseReward = 100 * 10**18;
        
        // 3. Multipliers
        uint256 activityMult = getActivityMultiplier(deviceId); // 50 to 150
        uint256 stakeMult = getStakeMultiplier(user); // 100 to 200
        uint256 efficiency = validator.calculateDeviceEfficiency(deviceId); // 0 to 100
        
        // E(t) = BASE * (ACTIVITY/100) * (STAKE/100) * (EFFICIENCY/100)
        uint256 rewardCalc = (((baseReward * activityMult) / 100) * stakeMult) / 100;
        uint256 finalReward = (rewardCalc * efficiency) / 100;
        
        // 4. Execute Protocol Minting Engine
        if(finalReward > 0) {
            SCARAB.mintFromRegenPool(user, finalReward);
            emit EmissionDistributed(user, deviceId, finalReward, activityMult, stakeMult);
        }
    }
}
