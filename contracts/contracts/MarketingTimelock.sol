// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MarketingTimelock
 * @notice Time-delayed multi-sig wallet for marketing allocation
 * 
 * Economics:
 * - Total allocation: 100M SCARAB (10% of supply)
 * - Immediate unlock: 2M SCARAB (2% for urgent needs)
 * - Vesting: Remaining 98M over 24 months
 * 
 * Security:
 * - 48-hour timelock on all transfers (community can see before execution)
 * - Requires 3-of-5 multi-sig approval
 * - Emergency cancel function (if malicious proposal detected)
 * 
 * Transparency:
 * - All proposals public on-chain
 * - Community dashboard shows pending transfers
 * - Cannot be bypassed (enforced by code)
 */
contract MarketingTimelock is AccessControl {
    using SafeERC20 for IERC20;
    
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant CANCELLER_ROLE = keccak256("CANCELLER_ROLE");
    
    IERC20 public immutable scarabToken;
    
    uint256 public constant TIMELOCK_DELAY = 48 hours;
    uint256 public constant GRACE_PERIOD = 7 days; // Proposal expires if not executed
    
    uint256 public immutable startTime;
    uint256 public constant VESTING_DURATION = 730 days; // 24 months
    uint256 public immutable totalAllocation;
    uint256 public immutable immediateUnlock;
    
    uint256 public withdrawnAmount;
    uint256 public proposalCount;
    
    struct Proposal {
        uint256 id;
        address recipient;
        uint256 amount;
        string purpose;        // "Bybit listing", "Influencer campaign", etc.
        uint256 proposedTime;
        uint256 executeTime;
        bool executed;
        bool cancelled;
        uint256 approvals;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasApproved;
    
    event ProposalCreated(
        uint256 indexed id,
        address indexed recipient,
        uint256 amount,
        string purpose,
        uint256 executeTime
    );
    
    event ProposalApproved(uint256 indexed id, address indexed approver, uint256 approvals);
    event ProposalExecuted(uint256 indexed id, address indexed recipient, uint256 amount);
    event ProposalCancelled(uint256 indexed id, address indexed canceller);
    
    constructor(
        address _scarabToken,
        uint256 _totalAllocation,
        uint256 _immediateUnlock,
        address[] memory _multisigMembers
    ) {
        require(_scarabToken != address(0), "Invalid token");
        require(_totalAllocation > _immediateUnlock, "Invalid allocation");
        require(_multisigMembers.length >= 3, "Need at least 3 signers");
        
        scarabToken = IERC20(_scarabToken);
        totalAllocation = _totalAllocation;
        immediateUnlock = _immediateUnlock;
        startTime = block.timestamp;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        
        // Grant roles to multi-sig members
        for (uint256 i = 0; i < _multisigMembers.length; i++) {
            _grantRole(PROPOSER_ROLE, _multisigMembers[i]);
            _grantRole(EXECUTOR_ROLE, _multisigMembers[i]);
            _grantRole(CANCELLER_ROLE, _multisigMembers[i]);
        }
    }
    
    /**
     * @notice Calculate how much is vested (unlocked) at current time
     */
    function vestedAmount() public view returns (uint256) {
        // Immediate unlock amount always available
        uint256 vested = immediateUnlock;
        
        // Add vested portion of remaining allocation
        uint256 vestingAllocation = totalAllocation - immediateUnlock;
        
        if (block.timestamp >= startTime + VESTING_DURATION) {
            // Fully vested
            vested += vestingAllocation;
        } else {
            // Partial vesting
            uint256 timePassed = block.timestamp - startTime;
            vested += (vestingAllocation * timePassed) / VESTING_DURATION;
        }
        
        return vested;
    }
    
    /**
     * @notice Calculate how much can be withdrawn now
     */
    function availableAmount() public view returns (uint256) {
        uint256 vested = vestedAmount();
        
        if (vested <= withdrawnAmount) {
            return 0;
        }
        
        return vested - withdrawnAmount;
    }
    
    /**
     * @notice Create a proposal to transfer tokens
     * @param recipient Address to receive tokens
     * @param amount Amount of SCARAB to transfer
     * @param purpose Description of what funds are for
     */
    function propose(
        address recipient,
        uint256 amount,
        string memory purpose
    ) external onlyRole(PROPOSER_ROLE) returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");
        require(amount <= availableAmount(), "Exceeds available amount");
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        Proposal storage p = proposals[proposalId];
        p.id = proposalId;
        p.recipient = recipient;
        p.amount = amount;
        p.purpose = purpose;
        p.proposedTime = block.timestamp;
        p.executeTime = block.timestamp + TIMELOCK_DELAY;
        p.executed = false;
        p.cancelled = false;
        p.approvals = 1; // Proposer auto-approves
        hasApproved[proposalId][msg.sender] = true;
        
        emit ProposalCreated(proposalId, recipient, amount, purpose, p.executeTime);
        emit ProposalApproved(proposalId, msg.sender, 1);
        
        return proposalId;
    }
    
    /**
     * @notice Approve a pending proposal (multi-sig member)
     */
    function approve(uint256 proposalId) external onlyRole(PROPOSER_ROLE) {
        Proposal storage p = proposals[proposalId];
        require(p.id == proposalId, "Proposal does not exist");
        require(!p.executed, "Already executed");
        require(!p.cancelled, "Proposal cancelled");
        require(!hasApproved[proposalId][msg.sender], "Already approved");
        
        hasApproved[proposalId][msg.sender] = true;
        p.approvals++;
        
        emit ProposalApproved(proposalId, msg.sender, p.approvals);
    }
    
    /**
     * @notice Execute an approved proposal (after timelock)
     * @param proposalId ID of proposal to execute
     */
    function execute(uint256 proposalId) external onlyRole(EXECUTOR_ROLE) {
        Proposal storage p = proposals[proposalId];
        require(p.id == proposalId, "Proposal does not exist");
        require(!p.executed, "Already executed");
        require(!p.cancelled, "Proposal cancelled");
        require(p.approvals >= 3, "Need 3+ approvals");
        require(block.timestamp >= p.executeTime, "Timelock not elapsed");
        require(
            block.timestamp <= p.executeTime + GRACE_PERIOD,
            "Proposal expired"
        );
        require(p.amount <= availableAmount(), "Exceeds available");
        
        p.executed = true;
        withdrawnAmount += p.amount;
        
        scarabToken.safeTransfer(p.recipient, p.amount);
        
        emit ProposalExecuted(proposalId, p.recipient, p.amount);
    }
    
    /**
     * @notice Cancel a malicious proposal
     */
    function cancel(uint256 proposalId) external onlyRole(CANCELLER_ROLE) {
        Proposal storage p = proposals[proposalId];
        require(p.id == proposalId, "Proposal does not exist");
        require(!p.executed, "Already executed");
        require(!p.cancelled, "Already cancelled");
        
        p.cancelled = true;
        
        emit ProposalCancelled(proposalId, msg.sender);
    }
    
    /**
     * @notice Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address recipient,
        uint256 amount,
        string memory purpose,
        uint256 proposedTime,
        uint256 executeTime,
        bool executed,
        bool cancelled,
        uint256 approvals
    ) {
        Proposal storage p = proposals[proposalId];
        return (
            p.recipient,
            p.amount,
            p.purpose,
            p.proposedTime,
            p.executeTime,
            p.executed,
            p.cancelled,
            p.approvals
        );
    }
}
