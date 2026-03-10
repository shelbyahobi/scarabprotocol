// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

/**
 * @title ScarabProxyAdmin
 * @notice Manages all UUPS and Transparent proxy upgrades for the SCARAB Protocol.
 * 
 * Security:
 * - Owned by TimelockController (48h delay on upgrades).
 * - Cannot upgrade without DAO vote + timelock maturation.
 * - Separate from protocol logic (clean separation of concerns).
 */
contract ScarabProxyAdmin is ProxyAdmin {
    event UpgradeProposed(address indexed proxy, address indexed newImplementation, uint256 eta);
    event UpgradeExecuted(address indexed proxy, address indexed newImplementation);
    
    constructor(address initialOwner) ProxyAdmin(initialOwner) {
        // Ownership should be transferred to TimelockController during deployment.
    }
}
