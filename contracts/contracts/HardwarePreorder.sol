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

    uint256 public constant BOKASHI_HOME_DEPOSIT = 25 * 10**6; // 25 USDC
    uint256 public constant BOKASHI_PRO_DEPOSIT = 50 * 10**6;  // 50 USDC
    uint256 public constant SOLAR_DEPOSIT = 100 * 10**6; // 100 USDC

    uint256 public constant MAX_BOKASHI_HOME_UNITS = 1000;
    uint256 public constant MAX_BOKASHI_PRO_UNITS = 250;
    uint256 public constant MAX_SOLAR_UNITS = 1000;

    uint256 public totalBokashiHomePreordered;
    uint256 public totalBokashiProPreordered;
    uint256 public totalSolarPreordered;

    uint256 public refundableUntil;
    bool public manufacturingLocked = false;

    enum NodeType { Bokashi_Home, Bokashi_Pro, Solar }

    mapping(address => mapping(NodeType => uint256)) public userPreorders;

    event PreorderPlaced(address indexed user, NodeType nodeType, uint256 quantity, uint256 amountPaid);
    event PreorderRefunded(address indexed user, NodeType nodeType, uint256 quantity, uint256 amountRefunded);
    event ManufacturingLocked(uint256 amountTransferred);
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
        refundableUntil = block.timestamp + 90 days;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Place a pre-order reservation for Smart Bokashi Home Kits.
     */
    function preorderBokashiHome(uint256 quantity) external nonReentrant {
        require(quantity > 0, "Zero quantity");
        require(!manufacturingLocked, "Manufacturing already locked");
        require(totalBokashiHomePreordered + quantity <= MAX_BOKASHI_HOME_UNITS, "Exceeds max Home units");

        uint256 cost = quantity * BOKASHI_HOME_DEPOSIT;
        usdc.safeTransferFrom(msg.sender, address(this), cost);

        totalBokashiHomePreordered += quantity;
        userPreorders[msg.sender][NodeType.Bokashi_Home] += quantity;

        emit PreorderPlaced(msg.sender, NodeType.Bokashi_Home, quantity, cost);
    }

    /**
     * @notice Place a pre-order reservation for Smart Bokashi Pro Kits.
     */
    function preorderBokashiPro(uint256 quantity) external nonReentrant {
        require(quantity > 0, "Zero quantity");
        require(!manufacturingLocked, "Manufacturing already locked");
        require(totalBokashiProPreordered + quantity <= MAX_BOKASHI_PRO_UNITS, "Exceeds max Pro units");

        uint256 cost = quantity * BOKASHI_PRO_DEPOSIT;
        usdc.safeTransferFrom(msg.sender, address(this), cost);

        totalBokashiProPreordered += quantity;
        userPreorders[msg.sender][NodeType.Bokashi_Pro] += quantity;

        emit PreorderPlaced(msg.sender, NodeType.Bokashi_Pro, quantity, cost);
    }

    /**
     * @notice Place a pre-order reservation for Solar Sentinel Nodes.
     */
    function preorderSolar(uint256 quantity) external nonReentrant {
        require(quantity > 0, "Zero quantity");
        require(!manufacturingLocked, "Manufacturing already locked");
        require(totalSolarPreordered + quantity <= MAX_SOLAR_UNITS, "Exceeds max Solar units");

        uint256 cost = quantity * SOLAR_DEPOSIT;
        usdc.safeTransferFrom(msg.sender, address(this), cost);

        totalSolarPreordered += quantity;
        userPreorders[msg.sender][NodeType.Solar] += quantity;

        emit PreorderPlaced(msg.sender, NodeType.Solar, quantity, cost);
    }

    /**
     * @notice Refund a pre-order reservation before manufacturing locks.
     */
    function refundPreorder(NodeType nodeType, uint256 quantity) external nonReentrant {
        require(!manufacturingLocked, "Manufacturing is locked, deposits are non-refundable");
        require(block.timestamp <= refundableUntil, "Refund period has expired");
        require(userPreorders[msg.sender][nodeType] >= quantity, "Insufficient preorders");

        uint256 refundAmount;
        if (nodeType == NodeType.Bokashi_Home) {
            refundAmount = quantity * BOKASHI_HOME_DEPOSIT;
            totalBokashiHomePreordered -= quantity;
        } else if (nodeType == NodeType.Bokashi_Pro) {
            refundAmount = quantity * BOKASHI_PRO_DEPOSIT;
            totalBokashiProPreordered -= quantity;
        } else if (nodeType == NodeType.Solar) {
            refundAmount = quantity * SOLAR_DEPOSIT;
            totalSolarPreordered -= quantity;
        }

        userPreorders[msg.sender][nodeType] -= quantity;
        usdc.safeTransfer(msg.sender, refundAmount);

        emit PreorderRefunded(msg.sender, nodeType, quantity, refundAmount);
    }

    /**
     * @notice DAO locks manufacturing and routes accumulated USDC directly to the R&D vault.
     */
    function lockManufacturing() external onlyRole(ADMIN_ROLE) {
        require(!manufacturingLocked, "Already locked");
        manufacturingLocked = true;
        
        uint256 balance = usdc.balanceOf(address(this));
        if (balance > 0) {
            usdc.safeTransfer(rdWallet, balance);
        }
        
        emit ManufacturingLocked(balance);
    }

    // --- Admin Settings ---

    function setRDWallet(address _newWallet) external onlyRole(ADMIN_ROLE) {
        require(_newWallet != address(0), "Invalid address");
        rdWallet = _newWallet;
        emit RDWalletUpdated(_newWallet);
    }
}
