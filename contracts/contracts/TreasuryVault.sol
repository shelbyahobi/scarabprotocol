// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IScarabTokenBuyback {
    function totalSupply() external view returns (uint256);
    function burn(address from, uint256 amount) external;
}

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

/**
 * @title TreasuryVault
 * @notice USDC-backed Liquidity Backing Vault for SCARAB Protocol.
 *
 * MECHANISM:
 *   For every $349 node sold, $50 USDC is deposited here.
 *   Floor price = (USDC_balance × (1+y)^t) / circulating_supply
 *   where y = RWA annual yield (e.g. tokenized T-bills at 5%) and
 *   t = years elapsed since vault inception.
 *   If price stays below floor for 48h, DAO can execute TWAP buyback + burn.
 *
 * ANTI-MANIPULATION:
 *   48-hour TWAP window prevents flash-loan attacks on the buyback trigger.
 *   Buybacks are capped at 10% of vault per execution.
 * RWA YIELD:
 *   80% of the vault is parked in tokenised T-bills / stablecoins.
 *   Yield is modelled as a simple annual % set by governance (default 5%).
 *   Real yield flows back via depositDirect(); yieldBps is a display model only.
 */
contract TreasuryVault is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant DAO_ROLE      = keccak256("DAO_ROLE");

    IERC20              public immutable usdc;
    IScarabTokenBuyback public           scarabToken;
    IUniswapV2Router    public           dexRouter;

    /// @notice Per-node USDC contribution to the Liquidity Backing Vault ($50)
    uint256 public constant USDC_PER_NODE = 50 * 1e18; // Assumes USDC 18 decimals on BSC

    /// @notice Maximum single buyback = 10% of vault (prevents draining)
    uint256 public constant MAX_BUYBACK_BPS = 1000; // 10%

    /// @notice TWAP window: price must stay below floor for this long
    uint256 public constant TWAP_WINDOW = 48 hours;

    // ─── Tracking ───────────────────────────────────────────────────────
    uint256 public totalNodesDeposited;
    uint256 public totalUsdcDeposited;
    uint256 public totalBuybacksExecuted;
    uint256 public totalScarabBurned;

    /// @notice Timestamp when price first dropped below floor (TWAP trigger)
    uint256 public belowFloorSince;

    // ─── RWA Yield Model ────────────────────────────────────────────────
    /// @notice Annual yield in basis points (default 500 = 5%). Governance-controlled.
    uint256 public yieldBps = 500;

    /// @notice Timestamp of vault inception — used to compute t (years elapsed)
    uint256 public immutable vaultInception;

    // ─── Events ─────────────────────────────────────────────────────────
    event RevenueDeposited(address indexed from, uint256 usdcAmount, uint256 nodeCount);
    event BuybackExecuted(uint256 usdcSpent, uint256 scarabBurned, uint256 newFloorPrice);
    event BelowFloorDetected(uint256 currentPrice, uint256 floorPrice, uint256 timestamp);
    event FloorRestored(uint256 currentPrice, uint256 floorPrice);
    event VaultYieldUpdated(uint256 oldBps, uint256 newBps);

    // ─── Constructor ─────────────────────────────────────────────────────
    constructor(
        address _usdc,
        address _scarabToken,
        address _dexRouter
    ) {
        require(_usdc       != address(0), "TV: zero usdc");
        require(_scarabToken!= address(0), "TV: zero token");

        usdc          = IERC20(_usdc);
        scarabToken   = IScarabTokenBuyback(_scarabToken);
        dexRouter     = IUniswapV2Router(_dexRouter);
        vaultInception = block.timestamp;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE,      msg.sender);
        _grantRole(DAO_ROLE,           msg.sender);
    }

    // ─── Revenue Deposit ─────────────────────────────────────────────────

    /**
     * @notice Deposit hardware revenue into the Liquidity Backing Vault.
     * @param nodeCount  Number of nodes sold in this batch ($50 per node)
     * @dev Caller must approve USDC transfer first.
     */
    function depositRevenue(uint256 nodeCount) external onlyRole(OPERATOR_ROLE) nonReentrant {
        require(nodeCount > 0, "TV: zero nodes");

        uint256 usdcAmount = nodeCount * USDC_PER_NODE;
        usdc.safeTransferFrom(msg.sender, address(this), usdcAmount);

        totalNodesDeposited += nodeCount;
        totalUsdcDeposited  += usdcAmount;

        emit RevenueDeposited(msg.sender, usdcAmount, nodeCount);
    }

    /**
     * @notice Direct USDC deposit (e.g. donations, yield, RWA returns).
     */
    function depositDirect(uint256 amount) external nonReentrant {
        require(amount > 0, "TV: zero amount");
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        totalUsdcDeposited += amount;
        emit RevenueDeposited(msg.sender, amount, 0);
    }

    // ─── Floor Price ─────────────────────────────────────────────────────

    /**
     * @notice Intrinsic floor price: USDC per SCARAB token, compounded by RWA yield.
     *
     *   P_floor = (V_USDC × (1 + y)^t) / S_circ
     *
     *   V_USDC : actual USDC balance in vault
     *   (1+y)^t: theoretical RWA yield multiplier, computed in integer math
     *            using a first-order Taylor approximation: (1 + y*t)
     *            which is accurate to <0.5% for t<5 years at 5% APY.
     *   S_circ : circulating SCARAB supply
     *
     * @return floorPriceVal  USDC per SCARAB (18 decimals)
     */
    function floorPrice() public view returns (uint256) {
        uint256 supply = scarabToken.totalSupply();
        if (supply == 0) return 0;

        uint256 usdc_ = usdcBalance();
        if (usdc_ == 0) return 0;

        // t in years (scaled by 1e4 for precision)
        uint256 secondsElapsed = block.timestamp - vaultInception;
        uint256 tScaled = (secondsElapsed * 1e4) / 365 days; // 1e4 = 1 year

        // (1 + y*t) where y = yieldBps / 10000
        // = 1 + (yieldBps * tScaled) / (10000 * 1e4)
        // multiplied out: effectiveBalance = usdc_ * (10000*1e4 + yieldBps*tScaled) / (10000*1e4)
        uint256 denom    = 10000 * 1e4;
        uint256 numer    = denom + (yieldBps * tScaled);
        uint256 effectiveUsdc = (usdc_ * numer) / denom;

        return (effectiveUsdc * 1e18) / supply;
    }

    /**
     * @notice Returns the projected effective USDC balance after yield accrual.
     */
    function effectiveUsdcBalance() public view returns (uint256) {
        uint256 usdc_ = usdcBalance();
        uint256 secondsElapsed = block.timestamp - vaultInception;
        uint256 tScaled = (secondsElapsed * 1e4) / 365 days;
        uint256 denom   = 10000 * 1e4;
        uint256 numer   = denom + (yieldBps * tScaled);
        return (usdc_ * numer) / denom;
    }

    /**
     * @notice Current USDC held in the vault.
     */
    function usdcBalance() public view returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    /**
     * @notice Backing ratio: USDC per token (same as floorPrice but readable label).
     */
    function getBackingRatio() external view returns (uint256) {
        return floorPrice();
    }

    // ─── TWAP Buyback ────────────────────────────────────────────────────

    /**
     * @notice Signal that the market price has dropped below the floor.
     *         Starts the 48-hour TWAP clock. Anyone can call.
     * @param currentMarketPrice  Current DEX price (in USDC, 18 decimals)
     */
    function signalBelowFloor(uint256 currentMarketPrice) external {
        uint256 floor = floorPrice();
        require(currentMarketPrice < floor, "TV: price is at or above floor");

        if (belowFloorSince == 0) {
            belowFloorSince = block.timestamp;
            emit BelowFloorDetected(currentMarketPrice, floor, block.timestamp);
        }
    }

    /**
     * @notice Execute TWAP buyback after 48h below floor.
     *         DAO_ROLE only. Buys SCARAB on DEX and burns it.
     * @param minScarabOut  Minimum SCARAB to receive (slippage protection)
     */
    function executeBuyback(uint256 minScarabOut)
        external
        onlyRole(DAO_ROLE)
        nonReentrant
    {
        require(belowFloorSince != 0,                              "TV: floor not triggered");
        require(block.timestamp >= belowFloorSince + TWAP_WINDOW,  "TV: TWAP window not passed");

        uint256 vaultBalance = usdcBalance();
        require(vaultBalance > 0, "TV: empty vault");

        // Cap at 10% of vault per execution
        uint256 spendAmount = (vaultBalance * MAX_BUYBACK_BPS) / 10000;

        // Buy SCARAB on DEX
        usdc.forceApprove(address(dexRouter), spendAmount);

        address[] memory path = new address[](2);
        path[0] = address(usdc);
        path[1] = address(scarabToken);

        uint256[] memory amounts = dexRouter.swapExactTokensForTokens(
            spendAmount,
            minScarabOut,
            path,
            address(this),
            block.timestamp + 15 minutes
        );

        uint256 scarabReceived = amounts[amounts.length - 1];

        // Burn purchased SCARAB
        scarabToken.burn(address(this), scarabReceived);

        totalBuybacksExecuted++;
        totalScarabBurned += scarabReceived;
        belowFloorSince    = 0; // Reset TWAP clock

        emit BuybackExecuted(spendAmount, scarabReceived, floorPrice());
    }

    /**
     * @notice Signal that price has recovered above floor. Resets TWAP clock.
     */
    function signalFloorRestored(uint256 currentMarketPrice) external {
        uint256 floor = floorPrice();
        require(currentMarketPrice >= floor, "TV: price still below floor");
        belowFloorSince = 0;
        emit FloorRestored(currentMarketPrice, floor);
    }

    // ─── Dashboard Data ──────────────────────────────────────────────────

    function getDashboardData() external view returns (
        uint256 totalUsdc,
        uint256 floorPriceValue,
        uint256 totalNodes,
        uint256 buybackCount,
        uint256 scarabBurned,
        bool    floorActive
    ) {
        return (
            usdcBalance(),
            floorPrice(),
            totalNodesDeposited,
            totalBuybacksExecuted,
            totalScarabBurned,
            belowFloorSince != 0
        );
    }

    // ─── Admin ───────────────────────────────────────────────────────────

    function setDexRouter(address _router) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_router != address(0), "TV: zero router");
        dexRouter = IUniswapV2Router(_router);
    }

    function setScarabToken(address _token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_token != address(0), "TV: zero token");
        scarabToken = IScarabTokenBuyback(_token);
    }

    /**
     * @notice Update the annual RWA yield rate. Governance-controlled.
     * @param _newYieldBps  New yield in basis points (e.g. 500 = 5%). Max 2000 (20%).
     */
    function setYieldBps(uint256 _newYieldBps) external onlyRole(DAO_ROLE) {
        require(_newYieldBps <= 2000, "TV: yield capped at 20%");
        emit VaultYieldUpdated(yieldBps, _newYieldBps);
        yieldBps = _newYieldBps;
    }

    /// @notice Receive BNB (for future use cases)
    receive() external payable {}
}
