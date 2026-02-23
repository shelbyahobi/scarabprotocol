// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

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
 *         release "Closure Bonuses" to both parties.
 */
contract ScarabSoilTransfer is AccessControl {
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    
    IEmissionController public emissionController;

    struct Transfer {
        bytes32 deviceIdHash;
        address user;
        address farmer;
        uint256 weight;
        uint256 timestamp;
        bool completed;
    }

    // Rewards for closing the loop and verifying sequestration
    uint256 public userClosureBonus = 15 * 10**18;    // 15 SCARAB for proper disposal
    uint256 public farmerProcessingFee = 10 * 10**18; // 10 SCARAB for securing nutrient sink

    mapping(bytes32 => Transfer) public pendingTransfers;

    event HandshakeInitiated(bytes32 indexed transferId, address indexed user);
    event LoopClosed(bytes32 indexed transferId, address indexed farmer, uint256 scarabBurned);

    constructor(address _emissionController) {
        require(_emissionController != address(0), "Invalid EmissionController");
        emissionController = IEmissionController(_emissionController);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice User initiates the transfer after fermentation is complete and they arrive at a Hub/Farm.
     * @param _deviceIdHash The ID Hash of the Bokashi smart node.
     * @param _weight       The weight of the pre-compost dropped off.
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
     * @notice Farmer scans user's QR code (containing transferId) to confirm receipt of the pre-compost.
     * @param _transferId The hash ID of the initiated transfer.
     */
    function completeTransfer(bytes32 _transferId) external onlyRole(FARMER_ROLE) {
        Transfer storage t = pendingTransfers[_transferId];
        require(t.timestamp != 0, "Transfer does not exist");
        require(!t.completed, "Already closed");
        require(block.timestamp <= t.timestamp + 48 hours, "Transfer expired");

        t.farmer = msg.sender;
        t.completed = true;

        // Release Rewards via EmissionController
        // 1. User gets a 'Closure Bonus' for not throwing it in the trash
        emissionController.accumulateReward(t.deviceIdHash, t.user, userClosureBonus);
        
        // 2. Farmer gets a 'Processing Fee' for turning waste into soil
        emissionController.accumulateReward(t.deviceIdHash, msg.sender, farmerProcessingFee);

        // Emission tracking and "Proof of Sequestration"
        emit LoopClosed(_transferId, msg.sender, userClosureBonus + farmerProcessingFee);
    }
    
    /**
     * @notice Modifies the network reward incentives for completing the soil transfer loop.
     */
    function setRewards(uint256 _userClosureBonus, uint256 _farmerProcessingFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        userClosureBonus = _userClosureBonus;
        farmerProcessingFee = _farmerProcessingFee;
    }
}
