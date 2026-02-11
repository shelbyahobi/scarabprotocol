import { useState } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther, formatEther } from 'viem';

// Valid ABI for SeedSale (placeholder address)
const SEED_SALE_ABI = [
    { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "inputs": [], "name": "totalRaised", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "hardCap", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];
const SEED_SALE_ADDRESS = "0x4D9c1cCA15fAB71FF56A51768DA2B85716b38c9f"; // BSC Testnet Deployed

export default function SeedSale() {
    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState('0.1');

    // Read Contract Stats
    const { data: totalRaisedData } = useContractRead({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'totalRaised',
        watch: true,
    });

    const { data: hardCapData } = useContractRead({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'hardCap',
    });

    // Read User Deposit
    const { data: userDeposit } = useContractRead({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'deposits',
        args: [address],
        watch: true,
        enabled: isConnected && !!address
    });

    // Deposit Logic
    const { config } = usePrepareContractWrite({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'deposit',
        value: parseEther(amount || '0'),
        enabled: isConnected && parseFloat(amount || '0') > 0,
    });

    const { write, data: writeData, isLoading } = useContractWrite(config);

    const { isLoading: isTxLoading, isSuccess } = useWaitForTransaction({
        hash: writeData?.hash,
    });

    // Derived State
    const raised = totalRaisedData ? parseFloat(formatEther(totalRaisedData)) : 0;
    const cap = hardCapData ? parseFloat(formatEther(hardCapData)) : 500; // Default to 500 if not loaded
    const percent = Math.min((raised / cap) * 100, 100);

    const userBnB = userDeposit ? parseFloat(formatEther(userDeposit)) : 0;
    const pendingRoll = (userBnB * 5000000).toLocaleString(); // 5M per BNB

    return (
        <div className="max-w-4xl mx-auto bg-beetle-green/30 backdrop-blur-lg border border-beetle-gold/30 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-beetle-gold text-black text-xs font-bold px-2 py-1 rounded">LIVE NOW</span>
                        <h3 className="text-3xl font-bold text-beetle-gold">Seed Round (Stage 1)</h3>
                    </div>
                    <p className="text-gray-300 mb-6">
                        Early community access. Funds raised are locked into Liquidity for 1 Year.
                        <br /><span className="text-sm text-gray-500">Stage 1 Price: Best Value • Stage 2: +10% Price • Stage 3: Listed</span>
                    </p>

                    <div className="mb-8">
                        <div className="flex justify-between text-sm mb-2 text-gray-400">
                            <span>Raised: {raised.toFixed(2)} BNB</span>
                            <span>HardCap: {cap} BNB</span>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-4 border border-white/5 overflow-hidden">
                            <div
                                className="bg-beetle-gold h-full transition-all duration-1000 ease-out shadow-[0_0_10px_#d4af37]"
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* --- NEW: User Allocation Display --- */}
                    {isConnected && userBnB > 0 && (
                        <div className="bg-white/5 border border-beetle-gold/30 rounded-xl p-4 animate-fade-in">
                            <h4 className="text-beetle-gold font-bold mb-2 flex items-center gap-2">
                                <span>🎉</span> Your Reserved Allocation
                            </h4>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs text-gray-400">Contributed</div>
                                    <div className="text-white font-mono">{userBnB} BNB</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-400">Pending Claim</div>
                                    <div className="text-2xl font-black text-white text-shadow-glow">{pendingRoll} ROLL</div>
                                </div>
                            </div>
                            <div className="mt-3 text-xs text-gray-500 bg-black/30 p-2 rounded">
                                *Tokens will be claimable here exactly 24 hours after the HardCap is hit (or Sale Ends).
                            </div>
                        </div>
                    )}

                </div>

                <div className="flex-1 bg-black/40 rounded-2xl p-6 border border-white/5">
                    <label className="block text-sm text-gray-400 mb-2">Contribution Amount (BNB)</label>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-black border border-beetle-gold/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-beetle-gold"
                            placeholder="0.1"
                        />
                        <div className="flex items-center justify-center bg-gray-800 rounded-xl px-4 font-bold text-gray-400">
                            BNB
                        </div>
                    </div>

                    {!isConnected ? (
                        <div className="text-center p-4 bg-yellow-500/20 text-yellow-200 rounded-xl border border-yellow-500/50">
                            Please Connect Wallet
                        </div>
                    ) : (
                        <button
                            disabled={!write || isLoading || isTxLoading}
                            onClick={() => write?.()}
                            className="w-full bg-beetle-gold text-black font-black text-xl py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]"
                        >
                            {isTxLoading ? 'Confirming...' : 'DEPOSIT BNB'}
                        </button>
                    )}

                    {isSuccess && (
                        <div className="mt-4 p-3 bg-green-500/20 text-green-400 text-center rounded-lg border border-green-500/50">
                            Contribution Successful! Rolling...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
