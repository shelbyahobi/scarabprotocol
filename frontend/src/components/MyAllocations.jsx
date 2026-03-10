import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { ShieldCheck, AlertTriangle, Clock, CheckCircle, RefreshCw, Wallet } from 'lucide-react';
import { useEffect } from 'react';
import { CONFIG } from '../config';

// Re-use ABI/Address constants (In a real app, move these to a config file)
const SEED_SALE_ADDRESS = CONFIG.SEED_SALE_ADDRESS;
const TOKENS_PER_BNB = 8000000;

const SEED_SALE_ABI = [
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "deposits", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "softCap", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "raisedAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "saleFinalized", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "claimTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "claimRefund", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

export default function MyAllocations() {
    const { address, isConnected } = useAccount();

    const formattedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

    // 1. READ USER DEPOSIT (Aggressive Polling)
    const { data: depositData, refetch: refetchDeposit, isFetching } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'deposits',
        args: [address],
        query: {
            enabled: isConnected && !!address,
            refetchInterval: 5000,
        }
    });

    // 2. READ SALE STATUS
    const { data: softCapData } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'softCap',
    });
    const { data: raisedData } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'raisedAmount',
    });
    const { data: finalizedData } = useReadContract({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'saleFinalized',
    });

    // 3. ACTIONS via Write
    const { writeContract: claimWrite, data: claimHash, isPending: isClaimLoading } = useWriteContract();
    const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({ hash: claimHash });

    const { writeContract: refundWrite, data: refundHash, isPending: isRefundLoading } = useWriteContract();
    const { isLoading: isRefundConfirming, isSuccess: isRefundSuccess } = useWaitForTransactionReceipt({ hash: refundHash });


    // PARSE DATA
    const userBnB = depositData ? parseFloat(formatEther(depositData)) : 0;
    const reservedRoll = (userBnB * TOKENS_PER_BNB).toLocaleString();

    const softCap = softCapData ? parseFloat(formatEther(softCapData)) : 0;
    const raised = raisedData ? parseFloat(formatEther(raisedData)) : 0;
    const isFinalized = !!finalizedData;
    const isSoftCapMet = raised >= softCap;

    // DETERMINE STATUS
    let status = "Connect Wallet";
    let statusColor = "text-gray-500";
    let statusBg = "bg-gray-900";
    let statusIcon = <Wallet size={16} />;

    if (isConnected) {
        if (userBnB === 0) {
            status = "No Allocation";
            statusColor = "text-gray-400";
            statusBg = "bg-gray-800";
            statusIcon = <Clock size={16} />;
        } else if (isFinalized) {
            status = "Ready to Claim";
            statusColor = "text-green-400";
            statusBg = "bg-green-900/40";
            statusIcon = <CheckCircle size={16} />;
        } else if (isSoftCapMet) {
            status = "Qualified (Sale Live)";
            statusColor = "text-beetle-electric";
            statusBg = "bg-beetle-electric/10";
            statusIcon = <ShieldCheck size={16} />;
        } else {
            status = "Pending Soft Cap";
            statusColor = "text-yellow-500";
            statusBg = "bg-yellow-900/20";
            statusIcon = <Clock size={16} />;
        }
    }

    const handleClaim = () => {
        claimWrite({
            address: SEED_SALE_ADDRESS,
            abi: SEED_SALE_ABI,
            functionName: 'claimTokens'
        });
    };

    const handleRefund = () => {
        refundWrite({
            address: SEED_SALE_ADDRESS,
            abi: SEED_SALE_ABI,
            functionName: 'claimRefund'
        });
    };

    if (!isConnected) return null; // Or show a simplified banner

    return (
        <div className="w-full bg-[#0a1a0f] border-y md:border border-beetle-gold/30 md:rounded-2xl p-6 mb-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">

            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-beetle-electric/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="grid md:grid-cols-4 gap-8 items-center relative z-10">

                {/* 1. Status Badge */}
                <div className="col-span-1">
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Allocation Status</div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 ${statusBg} ${statusColor} font-bold text-sm`}>
                        {statusIcon}
                        {status}
                    </div>
                </div>

                {/* 2. Contributed Amount */}
                <div className="col-span-1">
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Your Contribution</div>
                    <div className="text-2xl font-mono text-white font-bold flex items-center gap-2">
                        {userBnB.toFixed(4)} <span className="text-sm text-gray-600">BNB</span>
                    </div>
                </div>

                {/* 3. Reserved Tokens */}
                <div className="col-span-1">
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Reserved Tokens</div>
                    <div className="text-2xl font-mono text-beetle-gold font-bold flex items-center gap-2">
                        {reservedRoll} <span className="text-sm text-gray-600">SCARAB</span>
                    </div>
                </div>

                {/* 4. Actions */}
                <div className="col-span-1 flex flex-col gap-2">
                    {/* Refresh Button */}
                    <button
                        onClick={() => refetchDeposit()}
                        className="absolute top-2 right-2 text-gray-600 hover:text-white transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
                    </button>

                    {/* Claim Button */}
                    <button
                        disabled={!isFinalized || userBnB === 0 || isClaimLoading}
                        onClick={handleClaim}
                        className={`w-full py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2
                            ${isFinalized && userBnB > 0
                                ? 'bg-beetle-gold text-black hover:bg-white'
                                : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                            }`}
                    >
                        {isClaimLoading ? "Claiming..." : "Claim Tokens"}
                    </button>

                    {/* Refund Button (Only visible if likely failed or manually triggered) */}
                    {isSoftCapMet === false && raised > 0 && ( /* show only if relevant */
                        <button
                            onClick={handleRefund}
                            disabled={isSoftCapMet || isRefundLoading} // Disable if soft cap met
                            className="text-[10px] text-gray-500 hover:text-red-500 underline text-center"
                        >
                            {isRefundLoading ? "Refunding..." : "Check for Refund"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
