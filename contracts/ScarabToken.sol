// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title ScarabToken
 * @notice SCARAB Protocol Utility Token
 * 
 * TOKENOMICS:
 * - Fixed supply: 1,000,000,000 SCARAB
 * - No inflation (except from regeneration pool emissions)
 * - Deflationary via burns
 * 
 * ALLOCATION (Genesis Distribution):
 * - Seed Sale: 8% (80,000,000) → Vesting contract (12mo cliff + 24mo linear)
 * - Strategic Sale: 4% (40,000,000) → IDO contract
 * - Regeneration Pool: 30% (300,000,000) → EmissionController (40-year decay)
 * - Liquidity: 25% (250,000,000) → Locked on PancakeSwap
 * - Marketing: 10% (100,000,000) → 48h timelock
 * - Team: 5% (50,000,000) → TeamVesting (12mo cliff + 24mo linear)
 * - Advisors: 2% (20,000,000) → AdvisorVesting (6mo cliff + 18mo linear)
 * - Treasury: 16% (160,000,000) → Multi-sig governance vault
 * 
 * ANTI-MANIPULATION:
 * - Transfer pausable (emergency only)
 * - Burn-only mechanism (no new minting)
 * - Emission only via EmissionController
 */
contract ScarabToken is 
    ERC20Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant EMISSION_CONTROLLER_ROLE = keccak256("EMISSION_CONTROLLER_ROLE");
    
    // Fixed supply
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;  // 1 billion
    
    // Allocation percentages (basis points: 10000 = 100%)
    uint256 public constant SEED_ALLOCATION_BPS = 800;     // 8%
    uint256 public constant IDO_ALLOCATION_BPS = 400;      // 4%
    uint256 public constant REGEN_POOL_BPS = 3000;         // 30%
    uint256 public constant LIQUIDITY_BPS = 2500;          // 25%
    uint256 public constant MARKETING_BPS = 1000;          // 10%
    uint256 public constant TEAM_BPS = 500;                // 5%
    uint256 public constant ADVISOR_BPS = 200;             // 2%
    uint256 public constant TREASURY_BPS = 1600;           // 16%
    
    // Allocation amounts (calculated in initialize)
    uint256 public SEED_ALLOCATION;
    uint256 public IDO_ALLOCATION;
    uint256 public REGEN_POOL_ALLOCATION;
    uint256 public LIQUIDITY_ALLOCATION;
    uint256 public MARKETING_ALLOCATION;
    uint256 public TEAM_ALLOCATION;
    uint256 public ADVISOR_ALLOCATION;
    uint256 public TREASURY_ALLOCATION;
    
    // Addresses (set during initialization)
    address public seedVestingContract;
    address public idoContract;
    address public emissionController;
    address public liquidityVault;
    address public marketingTimelock;
    address public teamVestingContract;
    address public advisorVestingContract;
    address public treasuryVault;
    
    // Tracking
    uint256 public totalBurned;
    
    // Events
    event GenesisDistribution(
        address indexed recipient,
        uint256 amount,
        string category
    );
    
    event TokensBurned(
        address indexed burner,
        uint256 amount
    );
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    /**
     * @notice Initialize token with genesis distribution
     * @param _seedVesting VC vesting contract address
     * @param _ido IDO contract address
     * @param _emissionController Regeneration pool controller
     * @param _liquidity Liquidity vault (locked)
     * @param _marketing Marketing timelock
     * @param _teamVesting Team vesting contract
     * @param _advisorVesting Advisor vesting contract
     * @param _treasury Treasury multi-sig
     * @param governance Governance timelock
     */
    function initialize(
        address _seedVesting,
        address _ido,
        address _emissionController,
        address _liquidity,
        address _marketing,
        address _teamVesting,
        address _advisorVesting,
        address _treasury,
        address governance
    ) public initializer {
        __ERC20_init("SCARAB Protocol", "SCARAB");
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();
        
        // Validate addresses
        require(_seedVesting != address(0), "Invalid seed vesting address");
        require(_ido != address(0), "Invalid IDO address");
        require(_emissionController != address(0), "Invalid emission controller");
        require(_liquidity != address(0), "Invalid liquidity address");
        require(_marketing != address(0), "Invalid marketing address");
        require(_teamVesting != address(0), "Invalid team vesting address");
        require(_advisorVesting != address(0), "Invalid advisor vesting address");
        require(_treasury != address(0), "Invalid treasury address");
        
        // Store addresses
        seedVestingContract = _seedVesting;
        idoContract = _ido;
        emissionController = _emissionController;
        liquidityVault = _liquidity;
        marketingTimelock = _marketing;
        teamVestingContract = _teamVesting;
        advisorVestingContract = _advisorVesting;
        treasuryVault = _treasury;
        
        // Calculate allocations
        SEED_ALLOCATION = (TOTAL_SUPPLY * SEED_ALLOCATION_BPS) / 10000;
        IDO_ALLOCATION = (TOTAL_SUPPLY * IDO_ALLOCATION_BPS) / 10000;
        REGEN_POOL_ALLOCATION = (TOTAL_SUPPLY * REGEN_POOL_BPS) / 10000;
        LIQUIDITY_ALLOCATION = (TOTAL_SUPPLY * LIQUIDITY_BPS) / 10000;
        MARKETING_ALLOCATION = (TOTAL_SUPPLY * MARKETING_BPS) / 10000;
        TEAM_ALLOCATION = (TOTAL_SUPPLY * TEAM_BPS) / 10000;
        ADVISOR_ALLOCATION = (TOTAL_SUPPLY * ADVISOR_BPS) / 10000;
        TREASURY_ALLOCATION = (TOTAL_SUPPLY * TREASURY_BPS) / 10000;
        
        // Genesis distribution
        _mint(_seedVesting, SEED_ALLOCATION);
        emit GenesisDistribution(_seedVesting, SEED_ALLOCATION, "Seed Sale");
        
        _mint(_ido, IDO_ALLOCATION);
        emit GenesisDistribution(_ido, IDO_ALLOCATION, "IDO");
        
        _mint(_emissionController, REGEN_POOL_ALLOCATION);
        emit GenesisDistribution(_emissionController, REGEN_POOL_ALLOCATION, "Regeneration Pool");
        
        _mint(_liquidity, LIQUIDITY_ALLOCATION);
        emit GenesisDistribution(_liquidity, LIQUIDITY_ALLOCATION, "Liquidity");
        
        _mint(_marketing, MARKETING_ALLOCATION);
        emit GenesisDistribution(_marketing, MARKETING_ALLOCATION, "Marketing");
        
        _mint(_teamVesting, TEAM_ALLOCATION);
        emit GenesisDistribution(_teamVesting, TEAM_ALLOCATION, "Team");
        
        _mint(_advisorVesting, ADVISOR_ALLOCATION);
        emit GenesisDistribution(_advisorVesting, ADVISOR_ALLOCATION, "Advisors");
        
        _mint(_treasury, TREASURY_ALLOCATION);
        emit GenesisDistribution(_treasury, TREASURY_ALLOCATION, "Treasury");
        
        // Verify total supply
        require(totalSupply() == TOTAL_SUPPLY, "Supply mismatch");
        
        // Grant roles
        _grantRole(DEFAULT_ADMIN_ROLE, governance);
        _grantRole(ADMIN_ROLE, governance);
        _grantRole(PAUSER_ROLE, governance);
        _grantRole(UPGRADER_ROLE, governance);
        _grantRole(EMISSION_CONTROLLER_ROLE, _emissionController);
    }
    
    /**
     * @notice Authorize upgrade
     */
    function _authorizeUpgrade(address newImplementation) 
        internal 
        override 
        onlyRole(UPGRADER_ROLE) 
    {}
    
    /**
     * @notice Pause transfers (emergency only)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @notice Override transfer to add pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @notice Burn tokens (deflationary mechanism)
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        totalBurned += amount;
        
        emit TokensBurned(msg.sender, amount);
    }
    
    /**
     * @notice Mint from regeneration pool (EmissionController only)
     * @dev This is the ONLY way new tokens enter circulation after genesis
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mintFromRegenPool(address to, uint256 amount) 
        external 
        onlyRole(EMISSION_CONTROLLER_ROLE) 
    {
        // Verify EmissionController has enough balance
        require(
            balanceOf(emissionController) >= amount,
            "Insufficient regeneration pool balance"
        );
        
        // Transfer from EmissionController to recipient
        _transfer(emissionController, to, amount);
    }
    
    /**
     * @notice Get circulating supply (total - locked/vested)
     * @return Circulating supply
     */
    function circulatingSupply() external view returns (uint256) {
        uint256 locked = 
            balanceOf(seedVestingContract) +
            balanceOf(teamVestingContract) +
            balanceOf(advisorVestingContract) +
            balanceOf(emissionController);
        
        return totalSupply() - locked;
    }
}
