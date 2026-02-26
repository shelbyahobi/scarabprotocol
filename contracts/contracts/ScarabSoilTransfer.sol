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


    struct Transfer {
        bytes32 deviceIdHash;
        address user;
        address farmer;
        uint256 weight;
        uint256 timestamp;
        bool completed;
    }

    // Reward Constants
    uint256 public constant USER_CLOSURE_BONUS = 15 * 10**18;
    uint256 public constant FARMER_PROCESSING_FEE = 10 * 10**18;

    mapping(bytes32 => Transfer) public pendingTransfers;

    event HandshakeInitiated(bytes32 indexed transferId, address indexed user);
    event LoopClosed(bytes32 indexed transferId, address indexed farmer, uint256 scarabRewarded);

    constructor(address _emissionController) {
        require(_emissionController != address(0), "Invalid EmissionController");
        
        emissionController = IEmissionController(_emissionController);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
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
     * @notice Farmer scans user's QR code to verify drop-off.
     */
    function completeTransfer(bytes32 _transferId) external onlyRole(FARMER_ROLE) {
        Transfer storage t = pendingTransfers[_transferId];
        require(t.timestamp != 0, "Transfer does not exist");
        require(!t.completed, "Already closed");
        require(block.timestamp <= t.timestamp + 48 hours, "Transfer expired");

        t.farmer = msg.sender;
        t.completed = true;

        // Release Rewards via EmissionController
        emissionController.accumulateReward(t.deviceIdHash, t.user, USER_CLOSURE_BONUS);
        emissionController.accumulateReward(t.deviceIdHash, msg.sender, FARMER_PROCESSING_FEE);

        emit LoopClosed(_transferId, msg.sender, USER_CLOSURE_BONUS + FARMER_PROCESSING_FEE);
    }
}
