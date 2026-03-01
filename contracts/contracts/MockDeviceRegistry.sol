// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockDeviceRegistry {
    uint256 public activeDeviceCount;

    function getDevicesByOwner(address) external pure returns (bytes32[] memory) {
        return new bytes32[](0);
    }
    
    function setActiveDeviceCount(uint256 count) external {
        activeDeviceCount = count;
    }
}
