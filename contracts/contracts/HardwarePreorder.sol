// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title HardwarePreorder
 * @dev Professionalized UUPS Upgradeable contract for DePIN hardware preorders.
 * Includes manufacturing lock-in logic, stakeholder discounts, and on-chain shipping proof.
 */
contract HardwarePreorder is 
    Initializable, 
    AccessControlUpgradeable, 
    ReentrancyGuardUpgradeable, 
    PausableUpgradeable, 
    UUPSUpgradeable 
{
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    struct ProductConfig {
        uint256 depositAmount;
        uint256 fullPrice;
        uint256 manufacturingThreshold;
        uint256 currentPreorders;
        bool manufacturingStarted;
        bool active;
    }

    struct Preorder {
        uint256 amountPaid;
        bytes32 shippingDataHash;
        uint256 timestamp;
        bool refunded;
        bool holderDiscountApplied;
    }

    IERC20Upgradeable public usdc;
    IERC20Upgradeable public scarab;

    mapping(string => ProductConfig) public products;
    mapping(string => mapping(address => Preorder)) public userPreorders;
    
    uint256 public constant HOLDER_DISCOUNT_BPS = 1000; // 10%
    uint256 public holderDiscountThreshold; // e.g., 1000 * 10**18

    event PreorderPlaced(address indexed user, string productId, uint256 amount);
    event RefundIssued(address indexed user, string productId, uint256 amount);
    event ManufacturingStarted(string productId);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _usdc,
        address _scarab,
        uint256 _holderThreshold,
        address _admin
    ) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        usdc = IERC20Upgradeable(_usdc);
        scarab = IERC20Upgradeable(_scarab);
        holderDiscountThreshold = _holderThreshold;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(UPGRADER_ROLE, _admin);
        _grantRole(MANAGER_ROLE, _admin);
    }

    function setProduct(
        string memory productId,
        uint256 deposit,
        uint256 fullPrice,
        uint256 threshold,
        bool active
    ) external onlyRole(MANAGER_ROLE) {
        products[productId] = ProductConfig({
            depositAmount: deposit,
            fullPrice: fullPrice,
            manufacturingThreshold: threshold,
            currentPreorders: products[productId].currentPreorders, 
            manufacturingStarted: products[productId].manufacturingStarted,
            active: active
        });
    }

    function placePreorder(string memory productId, bytes32 shippingHash) external nonReentrant whenNotPaused {
        ProductConfig storage prod = products[productId];
        require(prod.active, "Product not active");
        require(userPreorders[productId][msg.sender].amountPaid == 0, "Already preordered");

        uint256 deposit = prod.depositAmount;
        bool applyDiscount = false;

        if (scarab.balanceOf(msg.sender) >= holderDiscountThreshold) {
            deposit = deposit - (deposit * HOLDER_DISCOUNT_BPS / 10000);
            applyDiscount = true;
        }

        require(usdc.transferFrom(msg.sender, address(this), deposit), "Transfer failed");

        userPreorders[productId][msg.sender] = Preorder({
            amountPaid: deposit,
            shippingDataHash: shippingHash,
            timestamp: block.timestamp,
            refunded: false,
            holderDiscountApplied: applyDiscount
        });

        prod.currentPreorders++;

        if (prod.currentPreorders >= prod.manufacturingThreshold && !prod.manufacturingStarted) {
            prod.manufacturingStarted = true;
            emit ManufacturingStarted(productId);
        }

        emit PreorderPlaced(msg.sender, productId, deposit);
    }

    function refundPreorder(string memory productId) external nonReentrant {
        ProductConfig storage prod = products[productId];
        require(!prod.manufacturingStarted, "Manufacturing started, non-refundable");
        
        Preorder storage order = userPreorders[productId][msg.sender];
        require(order.amountPaid > 0, "No preorder found");
        require(!order.refunded, "Already refunded");

        uint256 amount = order.amountPaid;
        order.refunded = true;
        order.amountPaid = 0;
        prod.currentPreorders--;

        require(usdc.transfer(msg.sender, amount), "Transfer failed");
        emit RefundIssued(msg.sender, productId, amount);
    }

    function getPreorderProgress(string memory productId) external view returns (uint256 current, uint256 threshold, bool started) {
        ProductConfig storage prod = products[productId];
        return (prod.currentPreorders, prod.manufacturingThreshold, prod.manufacturingStarted);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    // Admin Tools
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }
    function setHolderThreshold(uint256 _new) external onlyRole(MANAGER_ROLE) { holderDiscountThreshold = _new; }
}
