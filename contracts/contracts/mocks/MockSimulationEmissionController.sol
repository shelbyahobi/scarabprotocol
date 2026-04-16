// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IScarabTokenMock {
    function mintFromRegenPool(address to, uint256 amount) external;
    function transfer(address to, uint256 amount) external returns (bool);
}

contract MockSimulationEmissionController {
    IScarabTokenMock public scarab;
    mapping(address => uint256) public pendingRewards;

    constructor(address _scarab, address _registry, uint256 _regenPool) {
        scarab = IScarabTokenMock(_scarab);
    }

    function accumulateReward(bytes32 deviceIdHash, address owner, uint256 amount) external {
        pendingRewards[owner] += amount;
    }

    address public currentOracle;

    function setOracle(address _oracle) external {
        currentOracle = _oracle;
    }

    function claimRewards() external {
        uint256 amount = pendingRewards[msg.sender];
        require(amount > 0, "No rewards");
        pendingRewards[msg.sender] = 0;
        
        uint256 userShare = (amount * 80) / 100;
        uint256 oracleShare = amount - userShare;
        
        scarab.transfer(msg.sender, userShare);
        if (currentOracle != address(0)) {
            scarab.transfer(currentOracle, oracleShare);
        }
    }
}
