// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IDOStub
 * @notice Placeholder IDO contract for Phase 2 public sale.
 * @dev This will catch the 4% IDO Genesis allocation and hold it securely.
 */
contract IDOStub is Ownable {
    IERC20 public SCARAB;
    
    constructor() Ownable(msg.sender) {}
    
    function setToken(address _token) external onlyOwner {
        SCARAB = IERC20(_token);
    }
    
    function emergencyWithdraw(address _to, uint256 _amount) external onlyOwner {
        require(SCARAB.transfer(_to, _amount), "Transfer failed");
    }
}
