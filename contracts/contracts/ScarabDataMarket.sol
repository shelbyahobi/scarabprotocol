// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ScarabDataMarket
 * @notice Corporate data access with 100% burn
 * 
 * REGULATORY DEFENSE:
 * - Establishes consumptive utility
 * - Proves token is NOT a security
 * - Creates deflationary sink
 * 
 * CUSTOMERS:
 * - ESG corporations (carbon footprint verification)
 * - Carbon credit registries (offset validation)
 * - Universities (climate research data)
 * - Governments (grid resilience analytics)
 * 
 * PRICING MODEL:
 * - Query cost = f(data volume, freshness, granularity)
 * - Example: 100 SCARAB per 1GB of verified telemetry
 * - Enterprise annual license: 100,000 SCARAB
 * 
 * BURN MECHANISM:
 * - 100% of SCARAB paid is burned
 * - No revenue to protocol (pure sink)
 * - Net deflationary at scale
 */
contract ScarabDataMarket is Ownable {
    
    IERC20 public SCARAB;
    address public constant BURN_ADDRESS = address(0x000000000000000000000000000000000000dEaD); // Standard burn address
    
    // Pricing tiers
    uint256 public QUERY_BASE_COST = 10 * 10**18;  // 10 SCARAB
    uint256 public ENTERPRISE_LICENSE = 100000 * 10**18;  // 100K SCARAB/year
    
    struct DataQuery {
        address requester;
        uint256 cost;
        uint256 timestamp;
        bytes32 queryHash;
    }
    
    mapping(bytes32 => DataQuery) public queries;
    uint256 public totalBurned;
    
    event DataPurchased(
        address indexed buyer,
        uint256 cost,
        bytes32 queryHash,
        uint256 burned
    );
    
    constructor(address _scarabToken) Ownable(msg.sender) {
        SCARAB = IERC20(_scarabToken);
    }
    
    /**
     * @notice Purchase verified ecological data query access.
     * @param queryHash The keccak256 hash defining the requested data endpoint/query
     * @param maxCost The maximum SCARAB the caller is willing to burn (slippage protection)
     */
    function purchaseData(
        bytes32 queryHash,
        uint256 maxCost
    ) external {
        uint256 cost = calculateCost(queryHash);
        require(cost <= maxCost, "Cost exceeds limit");
        
        // Transfer SCARAB from buyer directly to this contract
        require(
            SCARAB.transferFrom(msg.sender, address(this), cost),
            "Transfer failed"
        );
        
        // BURN IT ALL -> Move to dead address
        require(
            SCARAB.transfer(BURN_ADDRESS, cost),
            "Burn failed"
        );
        
        totalBurned += cost;
        
        // Record query authorization
        queries[queryHash] = DataQuery({
            requester: msg.sender,
            cost: cost,
            timestamp: block.timestamp,
            queryHash: queryHash
        });
        
        emit DataPurchased(msg.sender, cost, queryHash, cost);
    }
    
    /**
     * @notice Calculates the SCARAB required to ungate specific data.
     * @param queryHash The query fingerprint
     */
    function calculateCost(bytes32 queryHash) public view returns (uint256) {
        // Advanced integrations will decode the queryHash to charge dynamically
        // based on volume, freshness, and SKU type (e.g. Solar vs CarbonVault).
        // For V1, we maintain a baseline oracle query cost.
        return QUERY_BASE_COST;
    }

    /**
     * @notice Governance updates to enterprise pricing tiers
     */
    function updatePricing(uint256 _baseCost, uint256 _enterprise) external onlyOwner {
        QUERY_BASE_COST = _baseCost;
        ENTERPRISE_LICENSE = _enterprise;
    }
}
