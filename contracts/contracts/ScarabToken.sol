// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract ScarabToken is ERC20, Ownable, ReentrancyGuard, ERC20Permit, ERC20Votes {
    // Tax Configuration
    uint256 public constant BUY_TAX = 0;
    uint256 public constant SELL_TAX = 500; // 5% (basis points: 500/10000)
    uint256 public constant TAX_DENOMINATOR = 10000;

    // Wallets
    address public marketingWallet;
    address public shopFundWallet;

    // Anti-Bot / Limits
    uint256 public maxWalletAmount;
    uint256 public maxTxAmount;
    bool public limitsInEffect = true;

    // Trading Status
    bool public tradingActive = false;
    uint256 public launchBlock;
    
    // Mappings
    mapping(address => bool) private _isExcludedFromFees;
    mapping(address => bool) private _isExcludedFromLimits;
    mapping(address => bool) private _blacklist; 
    mapping(address => bool) public ammPairs; // Automated Market Maker Pairs

    event TradingEnabled(uint256 blockNumber);
    event LimitsRemoved();
    event ExcludedFromFees(address indexed account, bool isExcluded);
    event ExcludedFromLimits(address indexed account, bool isExcluded);
    event Blacklisted(address indexed account); 

    // Audit Fix: Timelock Blacklist
    mapping(address => BlacklistRequest) public blacklistRequests;
    uint256 public constant BLACKLIST_DELAY = 2 days;

    struct BlacklistRequest {
        address target;
        uint256 requestTime;
        bool executed;
    }

    event BlacklistRequested(address indexed account, uint256 requestTime);

    constructor(
        address _marketingWallet,
        address _shopFundWallet
    ) ERC20("Dung Beetle", "ROLL") ERC20Permit("Dung Beetle") Ownable(msg.sender) {
        marketingWallet = _marketingWallet;
        shopFundWallet = _shopFundWallet;

        uint256 totalSupply = 1_000_000_000 * 10**decimals();
        
        // Max Wallet 2%, Max Tx 1%
        maxWalletAmount = totalSupply * 200 / TAX_DENOMINATOR; // 2%
        maxTxAmount = totalSupply * 100 / TAX_DENOMINATOR;     // 1%

        // Exclude owner and this contract from fees/limits
        excludeFromFees(owner(), true);
        excludeFromFees(address(this), true);
        excludeFromFees(_marketingWallet, true);
        excludeFromFees(_shopFundWallet, true);

        excludeFromLimits(owner(), true);
        excludeFromLimits(address(this), true);
        excludeFromLimits(_marketingWallet, true);
        excludeFromLimits(_shopFundWallet, true);

        _mint(owner(), totalSupply);
    }

    receive() external payable {}

    function enableTrading() external onlyOwner {
        require(!tradingActive, "Trading already active");
        tradingActive = true;
        launchBlock = block.number;
        emit TradingEnabled(block.number);
    }

    function requestBlacklist(address account) external onlyOwner {
        require(account != address(0), "Invalid address");
        require(!_blacklist[account], "Already blacklisted");
        
        blacklistRequests[account] = BlacklistRequest({
            target: account,
            requestTime: block.timestamp,
            executed: false
        });
        
        emit BlacklistRequested(account, block.timestamp);
    }

    function executeBlacklist(address account) external onlyOwner {
        BlacklistRequest storage request = blacklistRequests[account];
        require(request.target == account, "No request found");
        require(!request.executed, "Already executed");
        require(block.timestamp >= request.requestTime + BLACKLIST_DELAY, "Timelock active");
        
        _blacklist[account] = true;
        request.executed = true;
        
        emit Blacklisted(account);
    }
    
    // Legacy mapping support for checking
    function isBlacklisted(address account) external view returns (bool) {
        return _blacklist[account];
    }

    function setAMMPair(address pair, bool value) external onlyOwner {
        ammPairs[pair] = value;
    }

    function removeLimits() external onlyOwner {
        limitsInEffect = false;
        emit LimitsRemoved();
    }

    function excludeFromFees(address account, bool excluded) public onlyOwner {
        _isExcludedFromFees[account] = excluded;
        emit ExcludedFromFees(account, excluded);
    }

    function excludeFromLimits(address account, bool excluded) public onlyOwner {
        _isExcludedFromLimits[account] = excluded;
        emit ExcludedFromLimits(account, excluded);
    }

    // Audit Fix: Ability to update wallets (e.g., move to Multi-Sig)
    function setMarketingWallet(address _marketingWallet) external onlyOwner {
        require(_marketingWallet != address(0), "Invalid address");
        marketingWallet = _marketingWallet;
        excludeFromFees(_marketingWallet, true);
        excludeFromLimits(_marketingWallet, true);
    }

    function setShopFundWallet(address _shopFundWallet) external onlyOwner {
        require(_shopFundWallet != address(0), "Invalid address");
        shopFundWallet = _shopFundWallet;
        excludeFromFees(_shopFundWallet, true);
        excludeFromLimits(_shopFundWallet, true);
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) nonReentrant {
        require(!_blacklist[from] && !_blacklist[to], "Blacklisted");

        if (amount == 0) {
            super._update(from, to, 0);
            return;
        }

        // Check Max Wallet and Max Tx
        if (limitsInEffect) {
            if (from != owner() && to != owner() && to != address(0) && to != address(0xdead) && !tradingActive) {
               require(_isExcludedFromFees[from] || _isExcludedFromFees[to], "Trading not active");
            }
            
            if (from != owner() && to != owner() && to != address(0) && to != address(0xdead) && !_isExcludedFromFees[to] && !_isExcludedFromFees[from]) {
                 // Check Max Transaction
                 require(amount <= maxTxAmount, "Exceeds max transaction amount");
                 
                 // Check Max Wallet
                 if (!ammPairs[to]) { // Doing a buy or transfer, not a sell
                    require(balanceOf(to) + amount <= maxWalletAmount, "Exceeds max wallet amount");
                 }
            }

            // Buy
            if (ammPairs[from] && !_isExcludedFromLimits[to]) {
                require(amount <= maxTxAmount, "Max Tx Exceeded");
                require(balanceOf(to) + amount <= maxWalletAmount, "Max Wallet Exceeded");
            } 
            // Sell
            else if (ammPairs[to] && !_isExcludedFromLimits[from]) {
                require(amount <= maxTxAmount, "Max Tx Exceeded");
            }
            // Transfer
            else if (!_isExcludedFromLimits[to]) {
                require(balanceOf(to) + amount <= maxWalletAmount, "Max Wallet Exceeded");
            }
        }

        bool takeFee = !(_isExcludedFromFees[from] || _isExcludedFromFees[to]);

        if (takeFee) {
            uint256 fees = 0;
            // Sell
            if (ammPairs[to] && SELL_TAX > 0) {
                fees = amount * SELL_TAX / TAX_DENOMINATOR;
            }
            
            if (fees > 0) {
                // Distribute: 3/5 to Marketing, 2/5 to Shop
                uint256 marketingShare = fees * 3 / 5;
                uint256 shopShare = fees - marketingShare;
                
                super._update(from, marketingWallet, marketingShare);
                super._update(from, shopFundWallet, shopShare);
                
                amount -= fees;
            }
        }

        super._update(from, to, amount);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
