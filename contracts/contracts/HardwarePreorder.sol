// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title HardwarePreorder
 * @notice Handles USDC deposits for pre-ordering SCARAB mining hardware.
 *         Ensures strict supply caps and routes funds directly to the R&D vault.
 */
contract HardwarePreorder is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    IERC20 public usdc;
    address public rdWallet;

    uint256 public constant BOKASHI_PRICE = 25 * 10**6; // 25 USDC
    uint256 public constant SOLAR_PRICE = 100 * 10**6; // 100 USDC

    uint256 public constant MAX_BOKASHI_UNITS = 2000;
    uint256 public constant MAX_SOLAR_UNITS = 1000;

    uint256 public totalBokashiPreordered;
    uint256 public totalSolarPreordered;

    enum NodeType { Bokashi, Solar }

    mapping(address => mapping(NodeType => uint256)) public userPreorders;

    event PreorderPlaced(address indexed user, NodeType nodeType, uint256 quantity, uint256 amountPaid);
    event RDWalletUpdated(address newWallet);

    /**
     * @param _usdc USDC contract address for deposits
     * @param _rdWallet Research & Development multisig for hardware manufacturing
     */
    constructor(address _usdc, address _rdWallet) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_rdWallet != address(0), "Invalid R&D wallet address");

        usdc = IERC20(_usdc);
        rdWallet = _rdWallet;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Place a pre-order reservation for Smart Bokashi Kits.
     * @param quantity Number of units to pre-order.
     */
    function preorderBokashi(uint256 quantity) external nonReentrant {
        require(quantity > 0, "Zero quantity");
        require(totalBokashiPreordered + quantity <= MAX_BOKASHI_UNITS, "Exceeds max Bokashi units");

        uint256 cost = quantity * BOKASHI_PRICE;
        
        // Route directly to R&D Wallet
        usdc.safeTransferFrom(msg.sender, rdWallet, cost);

        totalBokashiPreordered += quantity;
        userPreorders[msg.sender][NodeType.Bokashi] += quantity;

        emit PreorderPlaced(msg.sender, NodeType.Bokashi, quantity, cost);
    }

    /**
     * @notice Place a pre-order reservation for Solar Sentinel Nodes.
     * @param quantity Number of units to pre-order.
     */
    function preorderSolar(uint256 quantity) external nonReentrant {
        require(quantity > 0, "Zero quantity");
        require(totalSolarPreordered + quantity <= MAX_SOLAR_UNITS, "Exceeds max Solar units");

        uint256 cost = quantity * SOLAR_PRICE;
        
        // Route directly to R&D Wallet
        usdc.safeTransferFrom(msg.sender, rdWallet, cost);

        totalSolarPreordered += quantity;
        userPreorders[msg.sender][NodeType.Solar] += quantity;

        emit PreorderPlaced(msg.sender, NodeType.Solar, quantity, cost);
    }

    // --- Admin Settings ---

    function setRDWallet(address _newWallet) external onlyRole(ADMIN_ROLE) {
        require(_newWallet != address(0), "Invalid address");
        rdWallet = _newWallet;
        emit RDWalletUpdated(_newWallet);
    }
}
