// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockEmissionController {
    mapping(address => uint256) public rewards;

    function accumulateReward(bytes32 deviceIdHash, address owner, uint256 amount) external {
        // Simple mock to verify reward assignment
        rewards[owner] += amount;
    }
}
