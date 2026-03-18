// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ScarabRevenueSplitter
 * @dev Immutable revenue router for DePIN hardware sales to prove PoPW Traction.
 * Automatically splits incoming ERC20 (USDC) into strict, verifiable treasury buckets.
 */
contract ScarabRevenueSplitter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // The token being split (USDC)
    IERC20 public immutable paymentToken;

    // Hardcoded Payees and Shares
    address public manufacturingVault; // 40%
    address public rdTreasury;         // 30%
    address public liquidityProvision; // 20%
    address public buyAndBurn;         // 10%

    // Basis points (10000 = 100%)
    uint256 public constant MFG_SHARE = 4000;
    uint256 public constant RD_SHARE = 3000;
    uint256 public constant LP_SHARE = 2000;
    uint256 public constant BNB_SHARE = 1000;
    uint256 public constant TOTAL_SHARES = 10000;

    event RevenueRouted(
        address indexed token,
        uint256 totalAmount,
        uint256 mfgAmount,
        uint256 rdAmount,
        uint256 lpAmount,
        uint256 bnbAmount
    );

    event PayeeUpdated(string role, address oldAccount, address newAccount);

    constructor(
        address _paymentToken,
        address _manufacturingVault,
        address _rdTreasury,
        address _liquidityProvision,
        address _buyAndBurn,
        address _multisigOwner
    ) Ownable(_multisigOwner) {
        require(_paymentToken != address(0), "Invalid token");
        require(_manufacturingVault != address(0), "Invalid mfg wallet");
        require(_rdTreasury != address(0), "Invalid rd wallet");
        require(_liquidityProvision != address(0), "Invalid lp wallet");
        require(_buyAndBurn != address(0), "Invalid bnb wallet");
        require(_multisigOwner != address(0), "Invalid owner");

        paymentToken = IERC20(_paymentToken);
        manufacturingVault = _manufacturingVault;
        rdTreasury = _rdTreasury;
        liquidityProvision = _liquidityProvision;
        buyAndBurn = _buyAndBurn;
    }

    /**
     * @dev Routes all current token balance according to the strict percentages.
     * Can be called by anyone (permissionless execution).
     */
    function routeRevenue() external nonReentrant {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No revenue to route");

        uint256 mfgAmount = (balance * MFG_SHARE) / TOTAL_SHARES;
        uint256 rdAmount = (balance * RD_SHARE) / TOTAL_SHARES;
        uint256 lpAmount = (balance * LP_SHARE) / TOTAL_SHARES;
        
        // Use remainder for final bucket to avoid rounding dust traps
        uint256 bnbAmount = balance - mfgAmount - rdAmount - lpAmount;

        paymentToken.safeTransfer(manufacturingVault, mfgAmount);
        paymentToken.safeTransfer(rdTreasury, rdAmount);
        paymentToken.safeTransfer(liquidityProvision, lpAmount);
        paymentToken.safeTransfer(buyAndBurn, bnbAmount);

        emit RevenueRouted(address(paymentToken), balance, mfgAmount, rdAmount, lpAmount, bnbAmount);
    }

    // Owner functions to update wallets (e.g., rotating the multisig)
    function setManufacturingVault(address _new) external onlyOwner {
        require(_new != address(0), "Invalid address");
        emit PayeeUpdated("Manufacturing", manufacturingVault, _new);
        manufacturingVault = _new;
    }

    function setRDTreasury(address _new) external onlyOwner {
        require(_new != address(0), "Invalid address");
        emit PayeeUpdated("R&D", rdTreasury, _new);
        rdTreasury = _new;
    }

    function setLiquidityProvision(address _new) external onlyOwner {
        require(_new != address(0), "Invalid address");
        emit PayeeUpdated("Liquidity", liquidityProvision, _new);
        liquidityProvision = _new;
    }

    function setBuyAndBurn(address _new) external onlyOwner {
        require(_new != address(0), "Invalid address");
        emit PayeeUpdated("BuyAndBurn", buyAndBurn, _new);
        buyAndBurn = _new;
    }
}
