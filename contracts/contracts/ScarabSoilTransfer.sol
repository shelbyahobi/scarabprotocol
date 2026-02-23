// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IEmissionController {
    /**
     * @notice Record earned reward WITHOUT minting.
     * @param deviceIdHash Device that produced the value (Node ID)
     * @param owner        Wallet to credit
     * @param rewardAmount SCARAB amount (18 decimals)
     */
    function accumulateReward(bytes32 deviceIdHash, address owner, uint256 rewardAmount) external;
}

/**
 * @title ScarabSoilTransfer
 * @notice Solves the "Soil-as-a-Service" urban compost friction by treating
 *         Farmers as "Verified Sink Nodes". Users drop off fermented organic
 *         waste (pre-compost) to Farmers, completing a digital handshake to
 *         release "Closure Bonuses" to both parties. Now integrated with
 *         Halving Cycles, Farmer Staking, and Solar Node Verification.
 */
contract ScarabSoilTransfer is AccessControl {
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    
    IEmissionController public emissionController;
    IERC20 public scarabToken;

    struct Transfer {
        bytes32 deviceIdHash;
        address user;
        address farmer;
        uint256 weight;
        uint256 timestamp;
        bool completed;
    }

    // Dynamic Reward Baseline Constraints
    uint256 public constant BASE_USER_REWARD = 15 * 10**18;
    uint256 public constant BASE_FARMER_REWARD = 7 * 10**18;
    uint256 public constant BASE_SOLAR_REWARD = 3 * 10**18;

    uint256 public totalTransfersCompleted;
    uint256 public constant HALVING_THRESHOLD = 50000;

    // Staking & Registry
    uint256 public requiredFarmerStake = 100 * 10**18; // Genesis Phase Sink
    mapping(address => uint256) public farmerStakes;
    mapping(address => bool) public isSolarActive;

    mapping(bytes32 => Transfer) public pendingTransfers;

    event HandshakeInitiated(bytes32 indexed transferId, address indexed user);
    event LoopClosed(bytes32 indexed transferId, address indexed farmer, uint256 scarabRewarded);
    event FarmerStaked(address indexed farmer, uint256 amount);
    event FarmerUnstaked(address indexed farmer, uint256 amount);
    event FarmerSlashed(address indexed farmer, uint256 amount);

    constructor(address _emissionController, address _scarabToken) {
        require(_emissionController != address(0), "Invalid EmissionController");
        require(_scarabToken != address(0), "Invalid Token");
        
        emissionController = IEmissionController(_emissionController);
        scarabToken = IERC20(_scarabToken);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Allows Farmers to stake SCARAB to become a "Verified Sink Node"
     */
    function stakeScarab(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(scarabToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        farmerStakes[msg.sender] += amount;
        emit FarmerStaked(msg.sender, amount);
    }

    /**
     * @notice Allows Farmers to unstake SCARAB and exit the network
     */
    function unstakeScarab(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(farmerStakes[msg.sender] >= amount, "Insufficient stake");
        
        farmerStakes[msg.sender] -= amount;
        require(scarabToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit FarmerUnstaked(msg.sender, amount);
    }

    /**
     * @notice Allows Governance to slash bad actors who accept fake soil
     */
    function slashBadFarmer(address _farmer, uint256 _amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(farmerStakes[_farmer] >= _amount, "Amount exceeds stake");
        
        farmerStakes[_farmer] -= _amount;
        
        // Burn to dead address
        require(scarabToken.transfer(address(0x000000000000000000000000000000000000dEaD), _amount), "Burn failed");
        emit FarmerSlashed(_farmer, _amount);
    }

    /**
     * @notice Allows Governance to adjust the required staking barrier
     */
    function setRequiredStake(uint256 _newStake) external onlyRole(DEFAULT_ADMIN_ROLE) {
        requiredFarmerStake = _newStake;
    }

    /**
     * @notice Allows Governance to register active Solar Nodes for validation
     */
    function setSolarNode(address _nodeOwner, bool _isActive) external onlyRole(DEFAULT_ADMIN_ROLE) {
        isSolarActive[_nodeOwner] = _isActive;
    }

    /**
     * @notice Computes current active rewards using a bitwise halving schedule
     */
    function getCurrentRewards() public view returns (uint256 userReward, uint256 farmerReward, uint256 solarReward) {
        uint256 halvingCycles = totalTransfersCompleted / HALVING_THRESHOLD;
        
        // Using bitwise shift for hyper-efficient halving math over epochs
        userReward = BASE_USER_REWARD >> halvingCycles;
        farmerReward = BASE_FARMER_REWARD >> halvingCycles;
        solarReward = BASE_SOLAR_REWARD >> halvingCycles;
    }

    /**
     * @notice User initiates the transfer after fermentation is complete.
     */
    function initiateTransfer(bytes32 _deviceIdHash, uint256 _weight) external {
        bytes32 transferId = keccak256(abi.encodePacked(_deviceIdHash, block.timestamp, msg.sender));
        
        pendingTransfers[transferId] = Transfer({
            deviceIdHash: _deviceIdHash,
            user: msg.sender,
            farmer: address(0),
            weight: _weight,
            timestamp: block.timestamp,
            completed: false
        });
        
        emit HandshakeInitiated(transferId, msg.sender);
    }

    /**
     * @notice Farmer scans user's QR code, and a local Solar Node signs to verify location.
     */
    function completeTransfer(bytes32 _transferId, address _solarNodeOwner) external onlyRole(FARMER_ROLE) {
        Transfer storage t = pendingTransfers[_transferId];
        require(t.timestamp != 0, "Transfer does not exist");
        require(!t.completed, "Already closed");
        require(block.timestamp <= t.timestamp + 48 hours, "Transfer expired");
        require(farmerStakes[msg.sender] >= requiredFarmerStake, "Insufficient Farmer Stake");
        require(isSolarActive[_solarNodeOwner], "Invalid Solar Node Gateway");

        t.farmer = msg.sender;
        t.completed = true;
        totalTransfersCompleted++;

        (uint256 userReward, uint256 farmerReward, uint256 solarReward) = getCurrentRewards();

        // Release Rewards via EmissionController
        emissionController.accumulateReward(t.deviceIdHash, t.user, userReward);
        emissionController.accumulateReward(t.deviceIdHash, msg.sender, farmerReward);
        emissionController.accumulateReward(t.deviceIdHash, _solarNodeOwner, solarReward);

        emit LoopClosed(_transferId, msg.sender, userReward + farmerReward + solarReward);
    }
}
