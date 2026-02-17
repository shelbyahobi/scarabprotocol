import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi';
import { parseEther, formatEther, isAddress } from 'viem';
import { Clock, Lock, CheckCircle, AlertTriangle, RefreshCw, ExternalLink, ShieldCheck, Wallet } from 'lucide-react';

import { CONFIG } from '../config';

const SEED_SALE_ABI = [
    { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_referrer", "type": "address" }], "name": "depositWithReferral", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "inputs": [], "name": "claimRefund", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "claimReferralRewards", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "claimTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "raisedAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "hardCap", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "softCap", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "deposits", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "referralRewards", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "totalReferrals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "endTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "TOKENS_PER_BNB", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "MAX_CONTRIBUTION", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "saleFinalized", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "failed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }
];

const SEED_SALE_ADDRESS = CONFIG.SEED_SALE_ADDRESS;
const TOKENS_PER_BNB = 8000000; // Architect Round
const MIN_CONTRIBUTION = 0.01;
const MAX_CONTRIBUTION = 1.0;
const BSCSCAN_URL = "https://testnet.bscscan.com"; // Change for mainnet

const getFriendlyError = (err) => {
    if (!err) return null;
    const msg = err.message || '';
    if (msg.includes('rejected') || msg.includes('denied'))
        return 'Transaction cancelled — you rejected it in your wallet.';
    if (msg.includes('insufficient funds'))
        return 'Not enough BNB. You need the contribution amount plus ~0.001 BNB for gas.';
    if (msg.includes('HardCap') || msg.includes('exceeds'))
        return 'Amount exceeds the hard cap. Try a smaller contribution.';
    if (msg.includes('Exceeds wallet limit'))
        return `Maximum per wallet is ${MAX_CONTRIBUTION} BNB.`;
    if (msg.includes('Sale ended') || msg.includes('not active'))
        return 'This phase has ended. Watch for Phase 2 announcement.';
    if (msg.includes('Sale not started'))
        return 'Sale has not started yet. Check the countdown timer.';
    return 'Transaction failed. Please check your wallet and try again.';
};

export default function SeedSale() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const [amount, setAmount] = useState('0.1');
    const [referrer, setReferrer] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [copySuccess, setCopySuccess] = useState(false);

    const EXPECTED_CHAIN_ID = CONFIG.CHAIN_ID;
    const isWrongNetwork = isConnected && chainId !== EXPECTED_CHAIN_ID;

    // --- WRITES (Separate instances) ---
    // 1. Deposit
    const { writeContract: writeDeposit, data: depositHash, isPending: isDepositPending, error: depositError } = useWriteContract();
    const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed } = useWaitForTransactionReceipt({ hash: depositHash });

    // 2. Claim Rewards
    const { writeContract: writeClaimRewards, isPending: isClaimRewardsPending } = useWriteContract();

    // 3. Claim Tokens (Post-Sale)
    const { writeContract: writeClaimTokens, isPending: isClaimTokensPending } = useWriteContract();

    // 4. Refund
    const { writeContract: writeRefund, isPending: isRefundPending } = useWriteContract();


    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const refParam = queryParams.get("ref");
        if (refParam && isAddress(refParam) && refParam !== address) {
            setReferrer(refParam);
            console.log("Valid Referrer set:", refParam);
        }
    }, [address]);

    // ---------------- READS ---------------- //

    const { data: endTimeData } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'endTime',
    });

    // Timer Logic
    useEffect(() => {
        if (!endTimeData) return;
        const interval = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            const end = Number(endTimeData);
            const diff = end - now;
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(interval);
            } else {
                const days = Math.floor(diff / 86400);
                const hours = Math.floor((diff % 86400) / 3600);
                const minutes = Math.floor((diff % 3600) / 60);
                const seconds = diff % 60;
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [endTimeData]);

    // Corrected ABI name: raisedAmount
    const { data: totalRaisedData, refetch: refetchRaised } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'raisedAmount',
    });

    const { data: hardCapData } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'hardCap',
    });

    const { data: softCapData } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'softCap',
    });

    const { data: saleFinalizedData } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'saleFinalized',
    });

    const { data: failedData } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'failed',
    });

    // Referral Stats
    const { data: myRewards } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'referralRewards',
        args: [address],
        query: { enabled: !!address }
    });

    const { data: myReferralCount } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'totalReferrals',
        args: [address],
        query: { enabled: !!address }
    });

    // User Deposit
    const { data: userDeposit, refetch: refetchDeposit } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'deposits',
        args: [address],
        query: { enabled: !!address }
    });

    // Actions
    const handleDeposit = () => {
        if (!amount || parseFloat(amount) < MIN_CONTRIBUTION) return;

        if (referrer) {
            writeDeposit({
                address: SEED_SALE_ADDRESS,
                abi: SEED_SALE_ABI,
                functionName: 'depositWithReferral',
                args: [referrer],
                value: parseEther(amount)
            });
        } else {
            writeDeposit({
                address: SEED_SALE_ADDRESS,
                abi: SEED_SALE_ABI,
                functionName: 'deposit',
                value: parseEther(amount)
            });
        }
    };

    const handleClaimRewards = () => {
        writeClaimRewards({
            address: SEED_SALE_ADDRESS,
            abi: SEED_SALE_ABI,
            functionName: 'claimReferralRewards'
        });
    };

    // Force Refetch on Success
    useEffect(() => {
        if (isDepositConfirmed) {
            console.log("Transaction Confirmed! Refetching...");
            refetchDeposit();
            refetchRaised();
        }
    }, [isDepositConfirmed]);

    // Derived State
    const raised = totalRaisedData ? parseFloat(formatEther(totalRaisedData)) : 0;
    const cap = hardCapData ? parseFloat(formatEther(hardCapData)) : 6.25;
    const softCap = softCapData ? parseFloat(formatEther(softCapData)) : 5;

    const percent = Math.min((raised / cap) * 100, 100);
    const softCapPercent = Math.min((softCap / cap) * 100, 100);

    const rewardsEth = myRewards ? parseFloat(formatEther(myRewards)).toFixed(4) : "0.0000";
    const referralLink = `${window.location.origin}/app?ref=${address || '0x...'}`;

    const userBnB = userDeposit ? parseFloat(formatEther(userDeposit)) : 0;
    const isAmountValid = parseFloat(amount) >= MIN_CONTRIBUTION && parseFloat(amount) <= MAX_CONTRIBUTION;
    const isFinalized = !!saleFinalizedData;
    const isFailed = !!failedData;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch {
            const el = document.createElement('textarea');
            el.value = referralLink;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    return (
        <div id="seed-sale" className="w-full">
            {/* Header: Urgency */}
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                    Seed Funding <span className="text-beetle-gold">Access</span>
                </h2>
                <div className="flex justify-center gap-4 text-2xl md:text-3xl font-mono text-white font-bold">
                    <div className="bg-black/50 border border-white/10 px-3 py-2 rounded-xl">
                        {String(timeLeft.days).padStart(2, '0')}<span className="text-xs text-gray-500 block">DAYS</span>
                    </div>
                    <div className="bg-black/50 border border-white/10 px-3 py-2 rounded-xl">
                        {String(timeLeft.hours).padStart(2, '0')}<span className="text-xs text-gray-500 block">HRS</span>
                    </div>
                    <div className="bg-black/50 border border-white/10 px-3 py-2 rounded-xl">
                        {String(timeLeft.minutes).padStart(2, '0')}<span className="text-xs text-gray-500 block">MIN</span>
                    </div>
                    <div className="bg-black/50 border border-white/10 px-3 py-2 rounded-xl text-beetle-electric">
                        {String(timeLeft.seconds).padStart(2, '0')}<span className="text-xs text-gray-500 block">SEC</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8">

                {/* WRONG NETWORK BANNER */}
                {isWrongNetwork && (
                    <div className="mb-4 flex items-center justify-between bg-orange-500/10 border border-orange-500/40 rounded-xl p-4 animate-pulse">
                        <span className="text-sm text-orange-300 font-bold flex items-center gap-2">
                            <AlertTriangle size={16} />
                            Wrong network — switch to BSC Testnet
                        </span>
                        <button
                            onClick={() => switchChain({ chainId: EXPECTED_CHAIN_ID })}
                            className="bg-orange-500 hover:bg-orange-600 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Switch Network
                        </button>
                    </div>
                )}

                {/* MY POSITION CARD */}
                {userBnB > 0 && (
                    <div className="bg-beetle-gold/10 border border-beetle-gold/30 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-beetle-gold/20 rounded-full blur-[40px] pointer-events-none"></div>
                        <p className="text-xs text-beetle-gold uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                            <Wallet size={14} /> Your Position
                        </p>
                        <div className="grid grid-cols-2 gap-8 relative z-10">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Contributed</p>
                                <p className="text-2xl font-black text-white">{userBnB.toFixed(4)} BNB</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Reserved SCARAB</p>
                                <p className="text-2xl font-black text-beetle-gold">
                                    {(userBnB * TOKENS_PER_BNB).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Round 1 (Live) */}
                <div className="w-full bg-gradient-to-br from-beetle-green/20 to-black border border-beetle-gold/50 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                    <div className="absolute top-0 right-0 bg-beetle-gold text-black font-bold px-4 py-2 rounded-bl-xl z-20">
                        PHASE 1: ARCHITECT ROUND
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-beetle-gold rounded-full flex items-center justify-center text-black font-black text-xl">1</div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">The "Architect" Round</h3>
                            <p className="text-beetle-gold">Price: 8,000,000 SCARAB / BNB</p>
                        </div>
                    </div>

                    <div className="mb-8 relative">
                        <div className="flex justify-between text-sm mb-2 text-gray-400">
                            <span>Raised: {raised.toFixed(2)} BNB</span>
                            <span>HardCap: {cap} BNB</span>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-4 border border-white/5 overflow-hidden relative">
                            {/* Soft Cap Marker */}
                            <div
                                className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10 h-full"
                                style={{ left: `${softCapPercent}%` }}
                            >
                                <div className="absolute -top-6 -translate-x-1/2 text-[10px] text-gray-400 font-bold bg-black/80 px-1 rounded">SoftCap</div>
                            </div>

                            <div
                                className="bg-beetle-gold h-full transition-all duration-1000 ease-out shadow-[0_0_10px_#d4af37]"
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-black/40 rounded-2xl p-6 border border-white/5 mb-6">
                        <label className="block text-sm text-gray-400 mb-2">Contribution (BNB)</label>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min={MIN_CONTRIBUTION}
                                step="0.01"
                                disabled={isWrongNetwork || isDepositPending}
                                className="w-full bg-black border border-beetle-gold/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-beetle-gold disabled:opacity-50"
                                placeholder={`Min ${MIN_CONTRIBUTION}`}
                            />
                            <div className="flex items-center justify-center bg-gray-800 rounded-xl px-4 font-bold text-gray-400">BNB</div>
                        </div>

                        {/* Estimated Output Preview */}
                        <div className="mb-4 text-right text-sm text-gray-400">
                            Est. Receive: <span className="text-beetle-gold font-bold">{(parseFloat(amount || '0') * TOKENS_PER_BNB).toLocaleString()} SCARAB</span>
                        </div>

                        {/* Referrer Verification Badge */}
                        {referrer && (
                            <div className="mb-4 bg-beetle-green/10 border border-beetle-green/30 rounded-lg p-3 flex justify-between items-center animate-pulse">
                                <span className="text-sm text-beetle-green flex items-center gap-2">
                                    <CheckCircle size={16} />
                                    Referrer: <span className="font-mono font-bold text-white">{referrer.slice(0, 6)}...{referrer.slice(-4)}</span>
                                </span>
                                <button
                                    onClick={() => setReferrer(null)}
                                    className="text-xs text-gray-400 hover:text-white underline"
                                >
                                    Remove
                                </button>
                            </div>
                        )}

                        {!isConnected ? (
                            <button className="w-full bg-white/5 text-gray-400 font-bold py-4 rounded-xl border border-white/10 cursor-not-allowed">
                                Connect Wallet to Join
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    disabled={isDepositPending || isDepositConfirming || !isAmountValid || isWrongNetwork}
                                    onClick={handleDeposit}
                                    className="w-full bg-beetle-gold text-black font-black text-xl py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDepositPending ? 'Check Wallet...' : isDepositConfirming ? 'Confirming...' : !isAmountValid ? `Min ${MIN_CONTRIBUTION} BNB` : 'JOIN ARCHITECT ROUND'}
                                </button>

                                {/* Claim Tokens (Finalized) */}
                                {isFinalized && userBnB > 0 && (
                                    <button
                                        onClick={() => writeClaimTokens({
                                            address: SEED_SALE_ADDRESS, abi: SEED_SALE_ABI,
                                            functionName: 'claimTokens'
                                        })}
                                        disabled={isClaimTokensPending}
                                        className="w-full bg-beetle-green text-black font-bold py-3 rounded-xl hover:bg-beetle-green/90 transition-all"
                                    >
                                        {isClaimTokensPending ? "Processing..." : `Claim ${(userBnB * TOKENS_PER_BNB).toLocaleString()} SCARAB`}
                                    </button>
                                )}

                                {/* Refund (Failed) */}
                                {isFailed && userBnB > 0 && (
                                    <button
                                        onClick={() => writeRefund({
                                            address: SEED_SALE_ADDRESS, abi: SEED_SALE_ABI,
                                            functionName: 'claimRefund'
                                        })}
                                        disabled={isRefundPending}
                                        className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-all"
                                    >
                                        {isRefundPending ? "Processing..." : `Claim Refund (${userBnB.toFixed(4)} BNB)`}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Friendly Error Messages */}
                        {depositError && (
                            <div className="mt-2 text-red-400 text-center text-sm bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                                {getFriendlyError(depositError)}
                            </div>
                        )}

                        {/* Success Message & Link */}
                        {isDepositConfirmed && depositHash && (
                            <div className="mt-4 text-center bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                <span className="text-green-400 text-sm font-bold block mb-1">✓ Contribution Confirmed!</span>
                                <a
                                    href={`${BSCSCAN_URL}/tx/${depositHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-gray-400 hover:text-white underline flex justify-center items-center gap-1"
                                >
                                    View on BSCScan <ExternalLink size={10} />
                                </a>
                            </div>
                        )}

                        <div className="mt-6 space-y-2">
                            <a href={`${BSCSCAN_URL}/address/${SEED_SALE_ADDRESS}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5 group hover:border-white/20 transition-colors cursor-pointer">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <ShieldCheck size={13} className="text-beetle-green" />
                                    <span>Contract verified on BSCScan</span>
                                </div>
                                <ExternalLink size={12} className="text-gray-600 group-hover:text-white" />
                            </a>
                            <div className="flex items-start gap-2 text-xs text-gray-500 bg-black/20 p-3 rounded-lg border border-white/5">
                                <CheckCircle size={13} className="mt-0.5 text-beetle-green" />
                                <span>
                                    <strong className="text-gray-400">Refund guarantee:</strong> If Phase 1
                                    does not reach its 5 BNB soft cap, your full contribution is
                                    claimable directly from the contract.
                                </span>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-gray-500 bg-black/20 p-3 rounded-lg border border-white/5">
                                <CheckCircle size={13} className="mt-0.5 text-beetle-green" />
                                <span>
                                    <strong className="text-gray-400">Funds usage:</strong> 80% of all raised BNB goes directly to PancakeSwap liquidity, locked 12 months.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REFERRAL DASHBOARD */}
                <div className="w-full bg-black/40 border border-beetle-green/30 rounded-3xl p-8 relative overflow-hidden group hover:border-beetle-green/50 transition-all">
                    <div className="absolute top-0 left-0 bg-beetle-green/20 w-full h-1"></div>

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <RefreshCw className="text-beetle-green animate-spin-slow" />
                            Community Referral
                        </h3>
                        <span className="bg-beetle-green/10 text-beetle-green px-3 py-1 rounded-lg text-sm font-bold">EARN 7% BNB</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-gray-400 text-sm mb-2">Share your link to earn 7% of every deposit made by your friends. Rewards claimable after sale success.</p>

                            {!isConnected ? (
                                <div className="bg-black border border-white/10 rounded-xl p-3 flex items-center gap-3 mb-4 opacity-70">
                                    <code className="text-gray-500 w-full truncate text-sm italic">
                                        rolltoken.io/app?ref=0xYourWallet...
                                    </code>
                                    <span className="text-xs text-gray-500 shrink-0">Connect →</span>
                                </div>
                            ) : (
                                <div className="bg-black border border-white/10 rounded-xl p-3 flex items-center gap-3 mb-4">
                                    <code className="text-beetle-electric w-full truncate text-sm">
                                        {referralLink}
                                    </code>
                                    <button
                                        onClick={copyLink}
                                        className={`bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all w-24 ${copySuccess ? 'bg-green-600 text-white' : ''}`}
                                    >
                                        {copySuccess ? '✓ Copied!' : 'COPY'}
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-4 text-sm">
                                <div className="text-gray-400">
                                    Referrals: <strong className="text-white">{myReferralCount ? myReferralCount.toString() : '0'}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/20 rounded-xl p-6 border border-white/5 flex flex-col justify-center items-center text-center">
                            <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">Unclaimed Rewards</span>
                            <div className="text-3xl font-black text-beetle-gold mb-4">{rewardsEth} BNB</div>

                            <button
                                disabled={!myRewards || myRewards <= 0n || isClaimRewardsPending}
                                onClick={handleClaimRewards}
                                className="w-full bg-beetle-green/20 text-beetle-green border border-beetle-green/50 hover:bg-beetle-green hover:text-black font-bold py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isClaimRewardsPending ? "Processing..." : "CLAIM REWARDS"}
                            </button>
                            <p className="text-[10px] text-gray-600 mt-2">Requires Sale Finalization</p>
                        </div>
                    </div>
                </div>

                {/* Future Rounds (Locked) - Improved UX */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 relative opacity-70 hover:opacity-90 transition-opacity cursor-not-allowed">
                    <div className="absolute top-4 right-4">
                        <Lock size={18} className="text-gray-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-bold text-sm">2</div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-400">Builder Round</h3>
                            <p className="text-xs text-gray-600">Unlocks when Phase 1 completes</p>
                        </div>
                    </div>
                    <div className="flex justify-between text-sm mt-4">
                        <span className="text-gray-600">Price</span>
                        <span className="text-gray-500">6,000,000 SCARAB / BNB</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                        <div className="text-xs text-amber-500/70 font-medium bg-amber-900/10 px-2 py-1 rounded">
                            ⚡ Phase 1 buyers get 33% more SCARAB vs Round 2
                        </div>
                    </div>
                    <div className="mt-3 w-full bg-gray-900 rounded-lg py-2 text-center text-xs text-gray-600 border border-white/5">
                        🔒 Opens after Phase 1 fills
                    </div>
                </div>

            </div>
        </div>
    )
}
