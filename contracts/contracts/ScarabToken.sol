// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title SCARABToken (Foundation-Grade UUPS)
 * @notice Fixed 1B supply token with institutional governance and upgradeability.
 * 
 * Security:
 * - UUPS Upgradeable managed by Timelock (48h delay).
 * - Multi-layered roles (MINTER, PAUSER, UPGRADER).
 * - Capped total supply hardcoded in logic.
 */
contract ScarabToken is 
    Initializable, 
    ERC20Upgradeable, 
    ERC20BurnableUpgradeable, 
    PausableUpgradeable, 
    AccessControlUpgradeable, 
    ERC20PermitUpgradeable, 
    ERC20VotesUpgradeable, 
    UUPSUpgradeable 
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    uint256 public constant TOTAL_SUPPLY_CAP = 1_000_000_000 * 10**18;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address defaultAdmin, address upgrader) initializer public {
        __ERC20_init("SCARAB", "SCARAB");
        __ERC20Burnable_init();
        __Pausable_init();
        __AccessControl_init();
        __ERC20Permit_init("SCARAB");
        __ERC20Votes_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, upgrader);

        // Mint initial supply to the Treasury (handled via deployment)
        _mint(msg.sender, TOTAL_SUPPLY_CAP);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        // Enforce hard cap (though _mint above does it once)
        require(totalSupply() + amount <= TOTAL_SUPPLY_CAP, "SCARAB: Cap exceeded");
        _mint(to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20PermitUpgradeable, NoncesUpgradeable)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
