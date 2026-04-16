// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockERC20
 * @notice Simple ERC20 used exclusively for BSC Testnet simulation scripting.
 *         Deployed by the simulation script; not part of mainnet protocol.
 *         Accepts a custom decimal value so a single contract can serve both
 *         USDC (6 decimals) and SCARAB (18 decimals) in the simulation.
 */
contract MockERC20 is ERC20 {
    uint8 private _customDecimals;

    constructor(
        string memory name,
        string memory symbol,
        uint256 supply,
        uint8 decimalPlaces
    ) ERC20(name, symbol) {
        _customDecimals = decimalPlaces;
        _mint(msg.sender, supply);
    }

    function decimals() public view override returns (uint8) {
        return _customDecimals;
    }
}
