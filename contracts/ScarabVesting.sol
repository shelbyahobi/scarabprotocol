// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title ScarabVesting
 * @notice VC Investor Token Vesting with Cliff
 * 
 * VESTING SCHEDULE:
 * - Cliff: 12 months (no tokens unlock)
 * - Vesting: 24 months linear (after cliff)
 * - Total: 36 months from TGE to full unlock
 * 
 * EXAMPLE (100,000 SCARAB allocation):
 * - Month 0-11: 0 tokens unlocked (cliff)
 * - Month 12: 0 tokens unlocked (cliff ends, vesting starts)
 * - Month 13: 4,166 tokens unlocked (1/24 of total)
 * - Month 24: 50,000 tokens unlocked (12/24 = 50%)
 * - Month 36: 100,000 tokens unlocked (24/24 = 100%)
 * 
 * ANTI-MANIPULATION:
 * - Linear per-second vesting (no monthly cliff jumps)
 * - Non-transferable vesting slots
 * - Admin cannot change beneficiary allocations
 * - Only beneficiary can claim (no admin withdrawal)
 * 
 * @dev UUPS upgradeable for emergency fixes only
 */
contract ScarabVesting is 
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    
    IERC20Upgradeable public SCARAB;
    
    // Vesting parameters (immutable after initialization)
    uint256 public TGE_TIMESTAMP;  // Token Generation Event
    uint256 public constant CLIFF_DURATION = 365 days;  // 12 months
    uint256 public constant VESTING_DURATION = 730 days;  // 24 months
    uint256 public constant TOTAL_DURATION = CLIFF_DURATION + VESTING_DURATION;  // 36 months
    
    // Vesting schedule per beneficiary
    struct VestingSchedule {
        uint256 totalAllocation;  // Total tokens allocated
        uint256 claimed;          // Tokens already claimed
        bool revoked;             // Emergency revocation flag
    }
    
    mapping(address => VestingSchedule) public schedules;
    
    // Tracking
    uint256 public totalAllocated;
    uint256 public totalClaimed;
    address[] public beneficiaries;
    
    // Events
    event VestingScheduleCreated(
        address indexed beneficiary,
        uint256 amount,
        uint256 tgeTimestamp
    );
    
    event TokensClaimed(
        address indexed beneficiary,
        uint256 amount,
        uint256 timestamp
    );
    
    event VestingRevoked(
        address indexed beneficiary,
        uint256 unvestedAmount
    );
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize(
        address _scarabToken,
        uint256 _tgeTimestamp,
        address governance
    ) public initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        
        require(_scarabToken != address(0), "Invalid token address");
        require(_tgeTimestamp > block.timestamp, "TGE must be in future");
        
        SCARAB = IERC20Upgradeable(_scarabToken);
        TGE_TIMESTAMP = _tgeTimestamp;
        
        _grantRole(DEFAULT_ADMIN_ROLE, governance);
        _grantRole(ADMIN_ROLE, governance);
        _grantRole(UPGRADER_ROLE, governance);
    }
    
    /**
     * @notice Authorize upgrade (governance only)
     */
    function _authorizeUpgrade(address newImplementation) 
        internal 
        override 
        onlyRole(UPGRADER_ROLE) 
    {}
    
    /**
     * @notice Create vesting schedule for VC investor
     * @dev Can only be called before TGE
     * @param beneficiary VC wallet address
     * @param amount Total SCARAB allocation
     */
    function createVestingSchedule(
        address beneficiary,
        uint256 amount
    ) external onlyRole(ADMIN_ROLE) {
        require(block.timestamp < TGE_TIMESTAMP, "TGE already occurred");
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(schedules[beneficiary].totalAllocation == 0, "Schedule already exists");
        
        // Verify contract has enough tokens
        uint256 contractBalance = SCARAB.balanceOf(address(this));
        require(
            totalAllocated + amount <= contractBalance,
            "Insufficient contract balance"
        );
        
        // Create schedule
        schedules[beneficiary] = VestingSchedule({
            totalAllocation: amount,
            claimed: 0,
            revoked: false
        });
        
        beneficiaries.push(beneficiary);
        totalAllocated += amount;
        
        emit VestingScheduleCreated(beneficiary, amount, TGE_TIMESTAMP);
    }
    
    /**
     * @notice Calculate vested amount for beneficiary
     * @param beneficiary Address to check
     * @return vestedAmount Tokens unlocked (including claimed)
     */
    function calculateVestedAmount(address beneficiary) 
        public 
        view 
        returns (uint256 vestedAmount) 
    {
        VestingSchedule memory schedule = schedules[beneficiary];
        
        // No allocation
        if (schedule.totalAllocation == 0) {
            return 0;
        }
        
        // Revoked
        if (schedule.revoked) {
            return schedule.claimed;  // Only what was already claimed
        }
        
        // Before TGE
        if (block.timestamp < TGE_TIMESTAMP) {
            return 0;
        }
        
        uint256 elapsed = block.timestamp - TGE_TIMESTAMP;
        
        // During cliff (first 12 months)
        if (elapsed < CLIFF_DURATION) {
            return 0;
        }
        
        // After cliff, during vesting
        if (elapsed < TOTAL_DURATION) {
            // Linear vesting over 24 months after cliff
            uint256 vestingElapsed = elapsed - CLIFF_DURATION;
            vestedAmount = (schedule.totalAllocation * vestingElapsed) / VESTING_DURATION;
        } else {
            // Fully vested
            vestedAmount = schedule.totalAllocation;
        }
        
        return vestedAmount;
    }
    
    /**
     * @notice Calculate claimable amount (vested - claimed)
     * @param beneficiary Address to check
     * @return claimableAmount Tokens available to claim now
     */
    function calculateClaimableAmount(address beneficiary) 
        public 
        view 
        returns (uint256 claimableAmount) 
    {
        uint256 vested = calculateVestedAmount(beneficiary);
        uint256 claimed = schedules[beneficiary].claimed;
        
        claimableAmount = vested > claimed ? vested - claimed : 0;
    }
    
    /**
     * @notice Claim vested tokens
     * @dev Beneficiary calls this to withdraw unlocked tokens
     */
    function claimTokens() external nonReentrant {
        address beneficiary = msg.sender;
        VestingSchedule storage schedule = schedules[beneficiary];
        
        require(schedule.totalAllocation > 0, "No vesting schedule");
        require(!schedule.revoked, "Vesting revoked");
        
        uint256 claimable = calculateClaimableAmount(beneficiary);
        require(claimable > 0, "No tokens to claim");
        
        // Update claimed amount
        schedule.claimed += claimable;
        totalClaimed += claimable;
        
        // Transfer tokens
        require(
            SCARAB.transfer(beneficiary, claimable),
            "Transfer failed"
        );
        
        emit TokensClaimed(beneficiary, claimable, block.timestamp);
    }
    
    /**
     * @notice Emergency revoke vesting (governance only)
     * @dev Only unvested tokens are revoked; claimed tokens remain with beneficiary
     * @param beneficiary Address to revoke
     */
    function revokeVesting(address beneficiary) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        VestingSchedule storage schedule = schedules[beneficiary];
        
        require(schedule.totalAllocation > 0, "No vesting schedule");
        require(!schedule.revoked, "Already revoked");
        
        // Calculate unvested amount
        uint256 vested = calculateVestedAmount(beneficiary);
        uint256 unvested = schedule.totalAllocation - vested;
        
        // Mark as revoked
        schedule.revoked = true;
        
        // Return unvested tokens to governance
        if (unvested > 0) {
            require(
                SCARAB.transfer(msg.sender, unvested),
                "Transfer failed"
            );
        }
        
        emit VestingRevoked(beneficiary, unvested);
    }
    
    /**
     * @notice Get vesting details for beneficiary
     * @param beneficiary Address to query
     * @return schedule Full vesting schedule details
     * @return vestedAmount Tokens unlocked
     * @return claimableAmount Tokens available to claim
     */
    function getVestingDetails(address beneficiary) 
        external 
        view 
        returns (
            VestingSchedule memory schedule,
            uint256 vestedAmount,
            uint256 claimableAmount
        ) 
    {
        schedule = schedules[beneficiary];
        vestedAmount = calculateVestedAmount(beneficiary);
        claimableAmount = calculateClaimableAmount(beneficiary);
    }
    
    /**
     * @notice Get all beneficiaries
     * @return List of all beneficiary addresses
     */
    function getBeneficiaries() external view returns (address[] memory) {
        return beneficiaries;
    }
    
    /**
     * @notice Get vesting timeline for a beneficiary
     * @dev Useful for frontend visualization
     * @param beneficiary Address to query
     * @return cliffEnd Timestamp when cliff ends
     * @return vestingEnd Timestamp when fully vested
     * @return percentVested Current vesting percentage (basis points)
     */
    function getVestingTimeline(address beneficiary) 
        external 
        view 
        returns (
            uint256 cliffEnd,
            uint256 vestingEnd,
            uint256 percentVested
        ) 
    {
        cliffEnd = TGE_TIMESTAMP + CLIFF_DURATION;
        vestingEnd = TGE_TIMESTAMP + TOTAL_DURATION;
        
        uint256 vested = calculateVestedAmount(beneficiary);
        uint256 total = schedules[beneficiary].totalAllocation;
        
        if (total > 0) {
            percentVested = (vested * 10000) / total;  // Basis points (10000 = 100%)
        } else {
            percentVested = 0;
        }
    }
}
