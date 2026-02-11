import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Clock, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

// Valid ABI for SeedSale (placeholder address)
const SEED_SALE_ABI = [
    { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "inputs": [], "name": "totalRaised", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "hardCap", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "deposits", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];
const SEED_SALE_ADDRESS = "0x4D9c1cCA15fAB71FF56A51768DA2B85716b38c9f"; // BSC Testnet Deployed
const TOKENS_PER_BNB = 100000; // Updated Price: 100,000 ROLL per BNB
const MIN_CONTRIBUTION = 0.05; // Bot Protection: Min 0.05 BNB

export default function SeedSale() {
    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState('0.1');

    // Timer Logic
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Mock End Date: 7 Days from now (Static for demo urgency)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 7);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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
    const { data: userDeposit, refetch } = useContractRead({
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
        enabled: isConnected && parseFloat(amount || '0') >= MIN_CONTRIBUTION, // Enforce Min Contribution
    });

    const { write, data: writeData, isLoading } = useContractWrite(config);

    const { isLoading: isTxLoading, isSuccess } = useWaitForTransaction({
        hash: writeData?.hash,
    });

    // Force Refetch on Success
    useEffect(() => {
        if (isSuccess) {
            refetch(); // Refetch deposit data
        }
    }, [isSuccess]);

    // Derived State
    const raised = totalRaisedData ? parseFloat(formatEther(totalRaisedData)) : 0;
    const cap = hardCapData ? parseFloat(formatEther(hardCapData)) : 500; // Default to 500
    const percent = Math.min((raised / cap) * 100, 100);

    const userBnB = userDeposit ? parseFloat(formatEther(userDeposit)) : 0;
    const reservedRoll = (userBnB * TOKENS_PER_BNB).toLocaleString();

    // Validation
    const isAmountValid = parseFloat(amount) >= MIN_CONTRIBUTION;

    return (
        <div id="seed-sale" className="max-w-6xl mx-auto">
            {/* Header: Urgency */}
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                    Seed Funding <span className="text-beetle-gold">Access</span>
                </h2>
                <div className="flex justify-center gap-4 text-2xl md:text-4xl font-mono text-white font-bold">
                    <div className="bg-black/50 border border-white/10 px-4 py-2 rounded-xl">
                        {String(timeLeft.days).padStart(2, '0')}<span className="text-sm text-gray-500 block">DAYS</span>
                    </div>
                    <div className="bg-black/50 border border-white/10 px-4 py-2 rounded-xl">
                        {String(timeLeft.hours).padStart(2, '0')}<span className="text-sm text-gray-500 block">HRS</span>
                    </div>
                    <div className="bg-black/50 border border-white/10 px-4 py-2 rounded-xl">
                        {String(timeLeft.minutes).padStart(2, '0')}<span className="text-sm text-gray-500 block">MIN</span>
                    </div>
                    <div className="bg-black/50 border border-white/10 px-4 py-2 rounded-xl text-beetle-electric">
                        {String(timeLeft.seconds).padStart(2, '0')}<span className="text-sm text-gray-500 block">SEC</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Round 1 (Live) */}
                <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-beetle-green/20 to-black border border-beetle-gold/50 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                    <div className="absolute top-0 right-0 bg-beetle-gold text-black font-bold px-4 py-2 rounded-bl-xl z-20">
                        ROUND 1: LIVE
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-beetle-gold rounded-full flex items-center justify-center text-black font-black text-xl">1</div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">The "Architect" Round</h3>
                            <p className="text-beetle-gold">Current Price: 100,000 ROLL / BNB</p>
                        </div>
                    </div>

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

                    <div className="bg-black/40 rounded-2xl p-6 border border-white/5 mb-6">
                        <label className="block text-sm text-gray-400 mb-2">Contribution (BNB)</label>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min={MIN_CONTRIBUTION}
                                step="0.01"
                                className="w-full bg-black border border-beetle-gold/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-beetle-gold"
                                placeholder={`Min ${MIN_CONTRIBUTION}`}
                            />
                            <div className="flex items-center justify-center bg-gray-800 rounded-xl px-4 font-bold text-gray-400">BNB</div>
                        </div>

                        {/* Estimated Output Preview */}
                        <div className="mb-4 text-right text-sm text-gray-400">
                            Est. Receive: <span className="text-beetle-gold font-bold">{(parseFloat(amount || '0') * TOKENS_PER_BNB).toLocaleString()} ROLL</span>
                        </div>

                        {!isConnected ? (
                            <button className="w-full bg-white/5 text-gray-400 font-bold py-4 rounded-xl border border-white/10 cursor-not-allowed">
                                Connect Wallet to Join
                            </button>
                        ) : (
                            <button
                                disabled={!write || isLoading || isTxLoading || !isAmountValid}
                                onClick={() => write?.()}
                                className="w-full bg-beetle-gold text-black font-black text-xl py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isTxLoading ? 'Confirming...' : !isAmountValid ? `Min Contribution ${MIN_CONTRIBUTION} BNB` : 'JOIN ROUND 1'}
                            </button>
                        )}
                        {isSuccess && <div className="mt-2 text-green-400 text-center text-sm">Contribution Confirmed!</div>}

                        {/* Refund Policy Text */}
                        <div className="mt-4 flex items-start gap-2 text-xs text-gray-500 bg-black/20 p-3 rounded-lg border border-white/5">
                            <AlertTriangle size={14} className="mt-0.5 text-orange-500" />
                            <span>
                                <strong>Safety Protocol:</strong> Funds are held in the contract. If the SoftCap is not reached by the deadline,
                                <span className="text-white"> 100% of your BNB is automatically refundable</span> via the 'Claim Refund' function.
                                Anti-Bot Protection Active: Min Contribution {MIN_CONTRIBUTION} BNB.
                            </span>
                        </div>
                    </div>

                    {/* PINK-SALE STYLE: MY POSITION CARD */}
                    {isConnected && (
                        <div className="bg-[#0a1a0f] border border-beetle-gold/30 rounded-xl p-6 shadow-inner">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="text-beetle-electric w-5 h-5" />
                                <h4 className="text-white font-bold uppercase tracking-widest text-sm">Your Position</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                    <div className="text-xs text-gray-500 mb-1">Total Contributed</div>
                                    <div className="text-white font-mono font-bold text-lg">{userBnB > 0 ? userBnB.toFixed(4) : "0.00"} BNB</div>
                                </div>
                                <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                    <div className="text-xs text-gray-500 mb-1">Reserved Allocation</div>
                                    <div className="text-beetle-electric font-mono font-bold text-lg">{reservedRoll} ROLL</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Future Rounds (Locked) */}
                <div className="space-y-4">

                    {/* Round 2 */}
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 relative opacity-70">
                        <div className="absolute top-4 right-4 text-gray-500"><Lock size={20} /></div>
                        <h3 className="text-xl font-bold text-gray-500 mb-1">Round 2: "Builder"</h3>
                        <p className="text-sm text-gray-600 mb-4">Starts when Round 1 fills.</p>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Price:</span>
                            <span className="text-gray-400 line-through">90,000 ROLL / BNB</span>
                        </div>
                        <div className="mt-2 text-red-500 text-xs font-bold">+11% MORE EXPENSIVE</div>
                    </div>

                    {/* Round 3 */}
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 relative opacity-70">
                        <div className="absolute top-4 right-4 text-gray-500"><Lock size={20} /></div>
                        <h3 className="text-xl font-bold text-gray-500 mb-1">Round 3: "Public"</h3>
                        <p className="text-sm text-gray-600 mb-4">DEX Listing Price.</p>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Price:</span>
                            <span className="text-gray-400 line-through">50,000 ROLL / BNB</span>
                        </div>
                        <div className="mt-2 text-red-500 text-xs font-bold">+100% MORE EXPENSIVE</div>
                    </div>

                </div>

            </div>
        </div>
    )
}
