// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

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
    IERC20 public scarabToken;
    IUniswapV2Router02 public dexRouter;
    address public treasury;

    // Default rate: $12 per 30 days. USDC has 6 decimals, so 12 * 10^6
    uint256 public monthlyFee = 12 * 1e6;
    uint256 public constant SUBSCRIPTION_PERIOD = 30 days;

    // Mapping from user address to their subscription expiration timestamp
    mapping(address => uint256) public subscriptionExpiry;

    event SubscriptionPurchased(address indexed user, uint256 amountPaid, uint256 newExpiry);
    event DCABuybackExecuted(uint256 usdcSpent, uint256 scarabBought);
    event FeeUpdated(uint256 newFee);
    event TreasuryUpdated(address newTreasury);
    event RouterUpdated(address newRouter);

    /**
     * @param _usdc Token used for payment (USDC)
     * @param _scarab The SCARAB token
     * @param _router DEX router (e.g. PancakeSwap V2)
     * @param _treasury Address where bought SCARAB is sent
     */
    constructor(address _usdc, address _scarab, address _router, address _treasury) {
        require(_usdc != address(0) && _scarab != address(0) && _router != address(0) && _treasury != address(0), "Invalid addresses");

        usdc = IERC20(_usdc);
        scarabToken = IERC20(_scarab);
        dexRouter = IUniswapV2Router02(_router);
        treasury = _treasury;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Purchase or extend a subscription by one period (30 days).
     * @dev User must have approved this contract to spend `monthlyFee` USDC.
     */
    function renewSubscription() external {
        // Transfer USDC from user to this contract to pool for DCA
        usdc.safeTransferFrom(msg.sender, address(this), monthlyFee);

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

    /**
     * @notice Automates the DCA buyback by swapping accumulated USDC for SCARAB.
     * @dev Anyone can call this to trigger the decentralized buyback (keeper bot).
     * @param minScarabOut minimum amount of SCARAB to receive (slippage protection).
     */
    function triggerDCABuyback(uint256 minScarabOut) external {
        uint256 usdcBalance = usdc.balanceOf(address(this));
        require(usdcBalance > 0, "No USDC to swap");

        // Approve router
        usdc.safeIncreaseAllowance(address(dexRouter), usdcBalance);

        // Path: USDC -> SCARAB
        address[] memory path = new address[](2);
        path[0] = address(usdc);
        path[1] = address(scarabToken);

        uint256 preSwapBal = scarabToken.balanceOf(treasury);

        // Execute swap, send SCARAB directly to treasury
        dexRouter.swapExactTokensForTokens(
            usdcBalance,
            minScarabOut,
            path,
            treasury,
            block.timestamp
        );

        uint256 postSwapBal = scarabToken.balanceOf(treasury);
        emit DCABuybackExecuted(usdcBalance, postSwapBal - preSwapBal);
    }

    // --- Admin Functions ---

    function setMonthlyFee(uint256 _newFee) external onlyRole(ADMIN_ROLE) {
        monthlyFee = _newFee;
        emit FeeUpdated(_newFee);
    }

    function setTreasury(address _newTreasury) external onlyRole(ADMIN_ROLE) {
        require(_newTreasury != address(0), "Invalid treasury address");
    function setRouter(address _newRouter) external onlyRole(ADMIN_ROLE) {
        require(_newRouter != address(0), "Invalid router address");
        dexRouter = IUniswapV2Router02(_newRouter);
        emit RouterUpdated(_newRouter);
    }
}
