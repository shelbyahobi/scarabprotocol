// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ScarabRevenueSplitter
 * @notice Immutable 40/30/20/10 routing of protocol fiat/stablecoin revenue.
 *         Upgrades to routing percentages require a strict 30-day Timelock.
 *
 * Base Routing Mechanism:
 *  - 40% -> Manufacturing (Hardware Reinvestment)
 *  - 30% -> R&D (New SKU Development)
 *  - 20% -> Liquidity (DEX/CEX backing pools)
 *  - 10% -> Deflationary Buy & Burn
 */
contract ScarabRevenueSplitter is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant TIMELOCK_ADMIN_ROLE = keccak256("TIMELOCK_ADMIN_ROLE");

    IERC20 public immutable usdc;

    struct RoutingTargets {
        address manufacturing;
        address rAndD;
        address liquidity;
        address buyAndBurn;
    }

    RoutingTargets public targets;

    // Hardcoded 40/30/20/10 split in Basis Points
    uint256 public constant SPLIT_MANUFACTURING = 4000;
    uint256 public constant SPLIT_RANDD         = 3000;
    uint256 public constant SPLIT_LIQUIDITY     = 2000;
    uint256 public constant SPLIT_BUY_BURN      = 1000;

    // --- Timelock State ---
    uint256 public constant TIMELOCK_DURATION = 30 days;
    uint256 public pendingUpgradeExecutionTime;

    struct PendingUpgrade {
        address manufacturing;
        address rAndD;
        address liquidity;
        address buyAndBurn;
    }

    PendingUpgrade public pendingTargets;

    event RevenueRouted(uint256 totalAmount, uint256 manufacturing, uint256 rAndD, uint256 liquidity, uint256 buyAndBurn);
    event UpgradeScheduled(address mfg, address rd, address liq, address bb, uint256 executionTime);
    event UpgradeExecuted(address mfg, address rd, address liq, address bb);

    constructor(
        address _usdc,
        address _manufacturing,
        address _rAndD,
        address _liquidity,
        address _buyAndBurn,
        address _timelockAdmin
    ) {
        require(_usdc != address(0), "Splitter: zero USDC token");
        require(_manufacturing != address(0), "Splitter: zero mfg address");
        require(_rAndD != address(0), "Splitter: zero R&D address");
        require(_liquidity != address(0), "Splitter: zero liquidity address");
        require(_buyAndBurn != address(0), "Splitter: zero buyAndBurn address");
        require(_timelockAdmin != address(0), "Splitter: zero admin address");

        usdc = IERC20(_usdc);
        
        targets = RoutingTargets({
            manufacturing: _manufacturing,
            rAndD: _rAndD,
            liquidity: _liquidity,
            buyAndBurn: _buyAndBurn
        });

        _grantRole(DEFAULT_ADMIN_ROLE, _timelockAdmin);
        _grantRole(TIMELOCK_ADMIN_ROLE, _timelockAdmin);
    }

    /**
     * @notice Anyone can call this to router pending balances according to the splits.
     */
    function routeRevenue() external nonReentrant {
        uint256 balance = usdc.balanceOf(address(this));
        require(balance > 0, "Splitter: No USDC to route");

        uint256 mfgAmount = (balance * SPLIT_MANUFACTURING) / 10000;
        uint256 rdAmount  = (balance * SPLIT_RANDD) / 10000;
        uint256 liqAmount = (balance * SPLIT_LIQUIDITY) / 10000;
        uint256 bbAmount  = balance - (mfgAmount + rdAmount + liqAmount); // dust

        usdc.safeTransfer(targets.manufacturing, mfgAmount);
        usdc.safeTransfer(targets.rAndD, rdAmount);
        usdc.safeTransfer(targets.liquidity, liqAmount);
        usdc.safeTransfer(targets.buyAndBurn, bbAmount);

        emit RevenueRouted(balance, mfgAmount, rdAmount, liqAmount, bbAmount);
    }

    // --- Timelock Upgrade Mechanism ---

    /**
     * @notice Schedules a change to the routing target addresses. Must wait 30 days.
     */
    function scheduleTargetUpgrade(
        address _mfg,
        address _rd,
        address _liq,
        address _bb
    ) external onlyRole(TIMELOCK_ADMIN_ROLE) {
        require(_mfg != address(0), "Splitter: zero mfg address");
        require(_rd != address(0), "Splitter: zero R&D address");
        require(_liq != address(0), "Splitter: zero liquidity address");
        require(_bb != address(0), "Splitter: zero buyAndBurn address");

        pendingTargets = PendingUpgrade({
            manufacturing: _mfg,
            rAndD: _rd,
            liquidity: _liq,
            buyAndBurn: _bb
        });

        pendingUpgradeExecutionTime = block.timestamp + TIMELOCK_DURATION;

        emit UpgradeScheduled(_mfg, _rd, _liq, _bb, pendingUpgradeExecutionTime);
    }

    /**
     * @notice Executes the target upgrade after the 30 day timelock expires.
     */
    function executeTargetUpgrade() external onlyRole(TIMELOCK_ADMIN_ROLE) {
        require(pendingUpgradeExecutionTime != 0, "Splitter: No upgrade scheduled");
        require(block.timestamp >= pendingUpgradeExecutionTime, "Splitter: Timelock active");

        targets = RoutingTargets({
            manufacturing: pendingTargets.manufacturing,
            rAndD: pendingTargets.rAndD,
            liquidity: pendingTargets.liquidity,
            buyAndBurn: pendingTargets.buyAndBurn
        });

        // Reset
        pendingUpgradeExecutionTime = 0;

        emit UpgradeExecuted(targets.manufacturing, targets.rAndD, targets.liquidity, targets.buyAndBurn);
    }
}
