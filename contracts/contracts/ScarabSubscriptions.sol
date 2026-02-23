// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ScarabSubscriptions
 * @notice Handles the $12/month SaaS recurring revenue model for Bokashi nodes.
 *         Users pay in USDC. The BokashiValidator checks this contract before
 *         allowing fermentation cycle submissions.
 */
contract ScarabSubscriptions is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IERC20 public usdc;
    address public treasury;

    // Default rate: $12 per 30 days. USDC has 6 decimals, so 12 * 10^6
    uint256 public monthlyFee = 12 * 1e6;
    uint256 public constant SUBSCRIPTION_PERIOD = 30 days;

    // Mapping from user address to their subscription expiration timestamp
    mapping(address => uint256) public subscriptionExpiry;

    event SubscriptionPurchased(address indexed user, uint256 amountPaid, uint256 newExpiry);
    event FeeUpdated(uint256 newFee);
    event TreasuryUpdated(address newTreasury);

    /**
     * @param _usdc Token used for payment (e.g., BSC Testnet USDC)
     * @param _treasury Address where fees are sent (e.g., TreasuryVault)
     */
    constructor(address _usdc, address _treasury) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_treasury != address(0), "Invalid treasury address");

        usdc = IERC20(_usdc);
        treasury = _treasury;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Purchase or extend a subscription by one period (30 days).
     * @dev User must have approved this contract to spend `monthlyFee` USDC.
     */
    function renewSubscription() external {
        // Transfer USDC from user to treasury
        usdc.safeTransferFrom(msg.sender, treasury, monthlyFee);

        // If subscription is already active, extend from current expiry.
        // If expired, start from block.timestamp.
        uint256 currentExpiry = subscriptionExpiry[msg.sender];
        if (currentExpiry > block.timestamp) {
            subscriptionExpiry[msg.sender] = currentExpiry + SUBSCRIPTION_PERIOD;
        } else {
            subscriptionExpiry[msg.sender] = block.timestamp + SUBSCRIPTION_PERIOD;
        }

        emit SubscriptionPurchased(msg.sender, monthlyFee, subscriptionExpiry[msg.sender]);
    }

    /**
     * @notice Check if a user has an active subscription.
     * @param user Address of the user to check.
     */
    function isSubscribed(address user) external view returns (bool) {
        return subscriptionExpiry[user] >= block.timestamp;
    }

    // --- Admin Functions ---

    function setMonthlyFee(uint256 _newFee) external onlyRole(ADMIN_ROLE) {
        monthlyFee = _newFee;
        emit FeeUpdated(_newFee);
    }

    function setTreasury(address _newTreasury) external onlyRole(ADMIN_ROLE) {
        require(_newTreasury != address(0), "Invalid treasury address");
        treasury = _newTreasury;
        emit TreasuryUpdated(_newTreasury);
    }
}
