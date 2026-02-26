// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TeamVesting
 * @notice Vests SCARAB team allocation over 36 months (12-month cliff + 24-month linear)
 * 
 * Economics:
 * - Total allocation: 50M SCARAB (5% of supply)
 * - Cliff period: 12 months (no tokens claimable)
 * - Vesting period: 24 months after cliff (linear release)
 * - Total duration: 36 months
 * 
 * Security:
 * - Beneficiary should be a multi-sig wallet (3-of-5 Safe)
 * - No emergency withdrawal function (prevents rug pull)
 * - Immutable after deployment (can't change beneficiary)
 */
contract TeamVesting is Ownable {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable scarabToken;
    address public immutable beneficiary;
    
    uint256 public immutable startTime;
    uint256 public immutable cliffDuration = 365 days;  // 12 months
    uint256 public immutable vestingDuration = 730 days; // 24 months
    uint256 public immutable totalAllocation;
    
    uint256 public claimedAmount;
    
    event TokensClaimed(address indexed beneficiary, uint256 amount, uint256 timestamp);
    
    /**
     * @param _scarabToken Address of SCARAB token contract
     * @param _beneficiary Address that can claim (should be multi-sig)
     * @param _totalAllocation Total tokens to vest (e.g. 50M SCARAB)
     */
    constructor(
        address _scarabToken,
        address _beneficiary,
        uint256 _totalAllocation
    ) Ownable(msg.sender) {
        require(_scarabToken != address(0), "Invalid token");
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(_totalAllocation > 0, "Invalid allocation");
        
        scarabToken = IERC20(_scarabToken);
        beneficiary = _beneficiary;
        totalAllocation = _totalAllocation;
        startTime = block.timestamp;
    }
    
    /**
     * @notice Calculate how many tokens are vested (unlocked) at current time
     * @return amount Vested amount in wei
     */
    function vestedAmount() public view returns (uint256) {
        // Before cliff: 0 tokens vested
        if (block.timestamp < startTime + cliffDuration) {
            return 0;
        }
        
        // After full vesting: 100% vested
        if (block.timestamp >= startTime + cliffDuration + vestingDuration) {
            return totalAllocation;
        }
        
        // During vesting period: linear unlock
        uint256 timeAfterCliff = block.timestamp - (startTime + cliffDuration);
        uint256 vestedPercentage = (timeAfterCliff * 10000) / vestingDuration; // Basis points
        
        return (totalAllocation * vestedPercentage) / 10000;
    }
    
    /**
     * @notice Calculate how many tokens are claimable right now
     * @return amount Claimable amount in wei
     */
    function claimableAmount() public view returns (uint256) {
        uint256 vested = vestedAmount();
        
        if (vested <= claimedAmount) {
            return 0;
        }
        
        return vested - claimedAmount;
    }
    
    /**
     * @notice Claim vested tokens (only callable by beneficiary)
     */
    function claim() external {
        require(msg.sender == beneficiary, "Only beneficiary can claim");
        
        uint256 claimable = claimableAmount();
        require(claimable > 0, "Nothing to claim");
        
        claimedAmount += claimable;
        
        scarabToken.safeTransfer(beneficiary, claimable);
        
        emit TokensClaimed(beneficiary, claimable, block.timestamp);
    }
    
    /**
     * @notice View function to see vesting schedule
     * @return cliff Cliff end timestamp
     * @return vestingEnd Full vesting end timestamp
     * @return vested Currently vested amount
     * @return claimed Already claimed amount
     * @return claimable Available to claim now
     */
    function getVestingInfo() external view returns (
        uint256 cliff,
        uint256 vestingEnd,
        uint256 vested,
        uint256 claimed,
        uint256 claimable
    ) {
        cliff = startTime + cliffDuration;
        vestingEnd = startTime + cliffDuration + vestingDuration;
        vested = vestedAmount();
        claimed = claimedAmount;
        claimable = claimableAmount();
    }
    
    /**
     * @notice Check current vesting progress (0-100%)
     */
    function vestingProgress() external view returns (uint256 percentage) {
        if (block.timestamp < startTime + cliffDuration) {
            return 0;
        }
        
        if (block.timestamp >= startTime + cliffDuration + vestingDuration) {
            return 100;
        }
        
        uint256 timeAfterCliff = block.timestamp - (startTime + cliffDuration);
        percentage = (timeAfterCliff * 100) / vestingDuration;
    }
}
