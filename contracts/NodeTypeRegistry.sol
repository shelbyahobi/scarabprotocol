// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title NodeTypeRegistry
 * @notice Central registry defining the economic parameters for various infrastructure nodes 
 *         (Solar, Bokashi, Wind, etc.) based on the Base Regenerative Unit (BRU) standard.
 *         1 BRU = 1 kg CO2-eq.
 */
contract NodeTypeRegistry is AccessControl, Pausable {
    bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");

    struct NodeType {
        string name;
        uint256 maxAnnualBRU;     // Safety upper bound for total annual BRU
        uint256 maxDailyBRU;      // Anti-spam/frontloading daily cap
        uint256 rwm;              // Immutable Regen Weight Multiplier (max 13000 -> 1.3x)
        uint256 activationCost;   // Required SCARAB to activate (50% burned, 50% staked)
        bytes32 methodologyHash;  // IPFS hash of measurement methodology document
        bool isActive;            // Is this node type permitted on the network
    }

    mapping(uint256 => NodeType) public nodeTypes;
    uint256 public nextNodeTypeId;

    event NodeTypeAdded(uint256 indexed id, string name, uint256 maxAnnualBRU, uint256 rwm, bytes32 methodologyHash);
    event NodeTypeDeactivated(uint256 indexed id);
    event MethodologyHashUpdated(uint256 indexed id, bytes32 newMethodologyHash);

    constructor(address initialAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(DAO_ROLE, initialAdmin);
    }

    /**
     * @notice DAO can add a new Node Type after security due diligence.
     * @dev RWM is immutable to prevent political manipulation.
     */
    function addNodeType(
        string memory _name,
        uint256 _maxAnnualBRU,
        uint256 _maxDailyBRU,
        uint256 _rwm,
        uint256 _activationCost,
        bytes32 _methodologyHash
    ) external onlyRole(DAO_ROLE) {
        require(_rwm <= 13000, "RWM cannot exceed 1.3x (13000 bps)");
        require(_maxDailyBRU > 0 && _maxAnnualBRU >= _maxDailyBRU, "Invalid BRU bounds");
        require(_methodologyHash != bytes32(0), "Methodology hash required");

        uint256 id = nextNodeTypeId++;
        
        nodeTypes[id] = NodeType({
            name: _name,
            maxAnnualBRU: _maxAnnualBRU,
            maxDailyBRU: _maxDailyBRU,
            rwm: _rwm,
            activationCost: _activationCost,
            methodologyHash: _methodologyHash,
            isActive: true
        });

        emit NodeTypeAdded(id, _name, _maxAnnualBRU, _rwm, _methodologyHash);
    }

    /**
     * @notice DAO can deactivate a node type if vulnerabilities are found.
     *         Cannot reactivate, must issue a new node type version.
     */
    function deactivateNodeType(uint256 _id) external onlyRole(DAO_ROLE) {
        require(_id < nextNodeTypeId, "Invalid ID");
        require(nodeTypes[_id].isActive, "Already inactive");

        nodeTypes[_id].isActive = false;
        
        emit NodeTypeDeactivated(_id);
    }

    /**
     * @notice DAO can update the methodology reference (e.g. if the IPFS doc is updated).
     */
    function updateMethodologyHash(uint256 _id, bytes32 _newMethodologyHash) external onlyRole(DAO_ROLE) {
        require(_id < nextNodeTypeId, "Invalid ID");
        require(_newMethodologyHash != bytes32(0), "Invalid hash");

        nodeTypes[_id].methodologyHash = _newMethodologyHash;
        
        emit MethodologyHashUpdated(_id, _newMethodologyHash);
    }

    /**
     * @notice Helper to fetch scaling attributes for EmissionController integration
     */
    function getNodeEconometrics(uint256 _id) external view returns (uint256 maxDailyBRU, uint256 rwm, bool isActive) {
        NodeType memory nt = nodeTypes[_id];
        return (nt.maxDailyBRU, nt.rwm, nt.isActive);
    }
}
