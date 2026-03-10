// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title ScarabTimelockController
 * @notice 48-hour delay on all governance actions for the SCARAB Protocol.
 * 
 * Security Properties:
 * - Community has 48h to exit if malicious proposal passes.
 * - Emergency actions require multi-sig override (Governance Safe).
 * - Cannot be bypassed by any single entity.
 */
contract ScarabTimelockController is TimelockController {
    uint256 public constant MIN_DELAY_SEC = 48 hours;
    
    /**
     * @param proposers Addresses that can schedule operations (Governance Safe)
     * @param executors Addresses that can execute operations (anyone for decentralization)
     * @param admin Address that can change proposers/executors (set to zero after setup)
     */
    constructor(
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(MIN_DELAY_SEC, proposers, executors, admin) {}
}
