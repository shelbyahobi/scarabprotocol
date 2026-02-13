// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SeedSale is Ownable, ReentrancyGuard, Pausable {
    
    uint256 public softCap; // Minimum BNB to proceed
    uint256 public hardCap; // Maximum BNB to raise
    
    mapping(address => uint256) public deposits; // Renamed from contributions
    uint256 public raisedAmount; // Renamed from totalRaised
    
    bool public saleActive = true;
    bool public saleFinalized = false;
    bool public failed = false;

    uint256 public startTime; // New variable
    uint256 public endTime; // New variable

    event Deposited(address indexed user, uint256 amount); // Renamed from Contributed
    event SaleFinalized(uint256 totalBnBRaised);
    event SaleFailed();
    event RefundClaimed(address indexed user, uint256 amount); // Renamed from Refunded

    constructor(uint256 _softCap, uint256 _hardCap, uint256 _startTime, uint256 _endTime) Ownable(msg.sender) {
        require(_startTime < _endTime, "Start time must be before end time");
        softCap = _softCap;
        hardCap = _hardCap;
        startTime = _startTime;
        endTime = _endTime;
    }

    IERC20 public saleToken;
    uint256 public constant TOKENS_PER_BNB = 5_000_000; 
    uint256 public constant REFERRAL_PERCENT = 5; // 5% Reward for referrer

    mapping(address => bool) public participation;
    
    // Referral Systems
    mapping(address => uint256) public referralRewards; // BNBEarned
    mapping(address => uint256) public totalReferrals;  // Count of people referred
    uint256 public totalReferralRewards; // Total BNB allocated to referrals

    event TokensClaimed(address indexed user, uint256 amount);
    event ReferralRecorded(address indexed referrer, address indexed referee, uint256 commission);
    event ReferralRewardClaimed(address indexed referrer, uint256 amount);

    // ... constructor ...

    function setSaleToken(address _token) external onlyOwner {
        require(address(saleToken) == address(0), "Token already set");
        saleToken = IERC20(_token);
    }

    function deposit() external payable nonReentrant whenNotPaused {
        _processDeposit(address(0));
    }

    function depositWithReferral(address _referrer) external payable nonReentrant whenNotPaused {
        _processDeposit(_referrer);
    }

    function _processDeposit(address _referrer) internal {
        require(block.timestamp >= startTime, "Sale not started");
        require(block.timestamp <= endTime, "Sale ended");
        require(raisedAmount + msg.value <= hardCap, "HardCap exceeded");
        require(msg.value > 0, "Cannot deposit 0"); 
        
        deposits[msg.sender] += msg.value;
        raisedAmount += msg.value;
        participation[msg.sender] = true;

        // Referral Logic
        if (_referrer != address(0) && _referrer != msg.sender) {
            uint256 commission = (msg.value * REFERRAL_PERCENT) / 100;
            referralRewards[_referrer] += commission;
            totalReferralRewards += commission;
            totalReferrals[_referrer] += 1;
            emit ReferralRecorded(_referrer, msg.sender, commission);
        }
        
        emit Deposited(msg.sender, msg.value);
    }
    
    function finalizeSale() external onlyOwner {
        require(saleActive, "Sale already ended");
        require(raisedAmount >= softCap, "SoftCap not met"); // Only finalize if success
        
        saleFinalized = true;
        saleActive = false;
        
        emit SaleFinalized(raisedAmount);
    }

    // New: Investors claim their tokens safely
    function claimTokens() external nonReentrant {
        require(saleFinalized, "Sale not finalized");
        require(!failed, "Sale failed, claim refund instead");
        
        uint256 deposited = deposits[msg.sender];
        require(deposited > 0, "No deposit");
        
        uint256 tokenAmount = deposited * TOKENS_PER_BNB;
        
        // Safety: Prevent double claiming by checking deposit, but wait.
        // Better pattern: Set deposit to 0? No, we might need record.
        // Usage of 'participation' or just deduct?
        // Let's use a separate mapping for claims or just reset deposit?
        // Resetting deposit prevents Refund, which is good if Finalized.
        
        deposits[msg.sender] = 0; // Prevent re-entry
        
        saleToken.transfer(msg.sender, tokenAmount);
        emit TokensClaimed(msg.sender, tokenAmount);
    }
    
    // New: Explicit withdrawal for Owner (Liquidity Creation)
    function withdrawFunds() external onlyOwner {
        require(saleFinalized, "Sale not finalized");
        
        // Owner can only withdraw the net amount (Total - ReferralRewards)
        // Referral rewards stay in contract to be claimed by referrers
        uint256 balance = address(this).balance;
        require(balance > totalReferralRewards, "No funds to withdraw");
        
        uint256 withdrawable = balance - totalReferralRewards;

        (bool sent, ) = payable(owner()).call{value: withdrawable}("");
        require(sent, "Failed to send BNB");
    }

    function claimReferralRewards() external nonReentrant {
        require(saleFinalized, "Sale must be finalized"); // Safety: Refund priority
        require(!failed, "Sale failed");
        
        uint256 reward = referralRewards[msg.sender];
        require(reward > 0, "No rewards");
        
        referralRewards[msg.sender] = 0;
        
        (bool sent, ) = payable(msg.sender).call{value: reward}("");
        require(sent, "Failed to send reward");
        
        emit ReferralRewardClaimed(msg.sender, reward);
    }
    
    function claimRefund() external nonReentrant {
        require(block.timestamp > endTime, "Sale not ended");
        require(raisedAmount < softCap, "SoftCap reached"); // Refund only if failed
        require(!saleFinalized, "Sale success");
        
        uint256 deposited = deposits[msg.sender];
        require(deposited > 0, "No deposit");
        
        deposits[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: deposited}("");
        require(success, "Refund failed");
        
        emit RefundClaimed(msg.sender, deposited);
    }

    // Safety: Recover UNSOLD tokens if any
    function withdrawUnsoldTokens() external onlyOwner {
        require(block.timestamp > endTime + 7 days, "Timelock on recovery"); // Safety buffer
        uint256 balance = saleToken.balanceOf(address(this));
        saleToken.transfer(owner(), balance);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
