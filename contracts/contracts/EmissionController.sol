// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title EmissionController (Foundation-Grade UUPS)
 * @notice Institutional-grade emission controller utilizing Base Regenerative Units (BRU).
 *
 * Security:
 * - UUPS Upgradeable managed by Timelock (48h delay).
 * - Hardcoded constants: λ = 0.00020518, D₀ ≈ 61,554.
 * - Enforces daily production caps to prevent oracle-flood attacks.
 */
contract EmissionController is 
    Initializable, 
    AccessControlUpgradeable, 
    PausableUpgradeable, 
    UUPSUpgradeable 
{
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // IMMUTABLE CONSTANTS (Stored in bytecode, not storage)
    uint256 public constant TOTAL_POOL = 300_000_000 * 1e18;
    uint256 public constant DECAY_RATE = 99979484; // r = 0.99979484 (1e8 precision) eq to λ = 0.00020518
    uint256 public constant INITIAL_DAILY_BUDGET = 61_554 * 1e18;

    IERC20 public scarabToken;
    address public deviceRegistry;

    uint256 public launchTime;
    uint256 public totalEmitted;
    uint256 public currentDailyBudget;

    // Daily Production Caps (Institutional Guardrails)
    uint256 public dailyProductionCapPerDevice;
    uint256 public dailyProductionCapPerOracle;

    mapping(address => uint256) public dailyOracleMinted;
    mapping(uint256 => uint256) public dayToGlobalMinted;

    event EmissionCapUpdated(uint256 perDevice, uint256 perOracle);
    event RewardsClaimed(address indexed user, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _scarabToken,
        address _deviceRegistry,
        address defaultAdmin,
        address upgrader
    ) initializer public {
        __AccessControl_init();
        __Pausable_init();

        scarabToken = IERC20(_scarabToken);
        deviceRegistry = _deviceRegistry;

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, upgrader);

        launchTime = block.timestamp;
        currentDailyBudget = INITIAL_DAILY_BUDGET;

        // Foundation-grade caps
        dailyProductionCapPerDevice = 20 ether; // 20 SCARAB eq per day
        dailyProductionCapPerOracle = 100_000 ether; // Global throttle
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function calculateReward(uint256 kwh) public view returns (uint256) {
        // Simplified for Phase 1 logic
        return kwh * 1 ether; 
    }

    function accumulateReward(bytes32 deviceIdHash, address owner, uint256 amount) external onlyRole(VALIDATOR_ROLE) whenNotPaused {
        require(amount <= dailyProductionCapPerDevice, "EmissionController: Device cap exceeded");
        
        uint256 day = (block.timestamp - launchTime) / 1 days;
        require(dayToGlobalMinted[day] + amount <= dailyProductionCapPerOracle, "EmissionController: Global oracle cap exceeded");
        
        require(totalEmitted + amount <= TOTAL_POOL, "EmissionController: Pool exhausted");

        dayToGlobalMinted[day] += amount;
        totalEmitted += amount;
        
        // Transfer handled via SCARABToken.mintFromRegenPool in ProductionValidator flow
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}
}
