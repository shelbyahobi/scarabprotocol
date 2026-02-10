import { useState, useEffect } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { motion } from 'framer-motion';

// ABI for balanceOf
const ERC20_ABI = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
];

// ABI for Seed Sale Deposit Check
const SEED_SALE_ABI = [
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "deposits", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];
const SEED_SALE_ADDRESS = "0x4D9c1cCA15fAB71FF56A51768DA2B85716b38c9f";

// Placeholder Address - UPDATE AFTER DEPLOYMENT
const TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function ColonyDashboard() {
    const { address, isConnected } = useAccount();
    const [hasAccess, setHasAccess] = useState(false);
    const [balance, setBalance] = useState(0n);

    // Check Token Balance
    const { data: tokenBalance } = useContractRead({
        address: TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
        enabled: isConnected && !!address,
        watch: true,
    });

    // Check Seed Sale Deposit
    const { data: seedDeposit } = useContractRead({
        address: SEED_SALE_ADDRESS,
        abi: SEED_SALE_ABI,
        functionName: 'deposits',
        args: [address],
        enabled: isConnected && !!address,
        watch: true,
    });

    useEffect(() => {
        const bal = tokenBalance ? BigInt(tokenBalance) : 0n;
        const dep = seedDeposit ? BigInt(seedDeposit) : 0n;

        setBalance(bal);

        // Access Rule: Has Tokens OR Has Contributed to Seed
        if (bal > 0n || dep > 0n) {
            setHasAccess(true);
        } else {
            setHasAccess(false);
        }
    }, [tokenBalance, seedDeposit]);

    // Visual Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8 } }
    };

    if (!isConnected) {
        return (
            <section className="py-24 bg-[#1a1a1a] border-t border-[#333]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-beetle-gold mb-6">The Colony Vault</h2>
                    <div className="max-w-md mx-auto p-8 rounded-2xl bg-black/60 border border-[#333] shadow-2xl">
                        <div className="text-4xl mb-4">🔒</div>
                        <p className="text-gray-400 mb-6">Connect your wallet to verify your <strong>$ROLL</strong> Access Level.</p>
                        {/* Connect Button is in Navbar, but we guide them */}
                        <div className="text-sm text-beetle-blue animate-pulse">Waiting for connection...</div>
                    </div>
                </div>
            </section>
        );
    }

    // STATE A: Access Denied
    if (!hasAccess) {
        return (
            <section className="py-24 bg-[#0a0a0a] border-t border-beetle-gold/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-5 pointer-events-none"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial="hidden" animate="visible" variants={containerVariants}
                        className="max-w-2xl mx-auto"
                    >
                        <h2 className="text-4xl font-black text-white mb-2">ACCESS <span className="text-red-500">DENIED</span></h2>
                        <p className="text-xl text-beetle-gold mb-8 font-mono">The Colony Vault is locked.</p>

                        <div className="p-10 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                            <div className="text-6xl mb-6">🚫</div>
                            <h3 className="text-2xl font-bold text-white mb-4">You must hold $ROLL to enter.</h3>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                This area contains exclusive discounts, beta access, and voting rights reserved for the Colony.
                            </p>

                            <div className="flex gap-4 justify-center">
                                <button className="px-8 py-3 bg-beetle-gold text-black font-black rounded-lg hover:bg-white hover:scale-105 transition-all">
                                    BUY $ROLL
                                </button>
                                <button className="px-8 py-3 bg-[#111] text-gray-300 font-bold border border-gray-700 rounded-lg hover:border-white transition-all">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    // STATE B: Dashboard (Holder)
    return (
        <section className="py-24 bg-[#0c0c0c] border-t border-beetle-blue/20">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
                    <div>
                        <h2 className="text-3xl font-black text-white">Marketplace <span className="text-beetle-blue">Dashboard</span></h2>
                        <p className="text-beetle-gold font-mono text-sm mt-2">Status: VERIFIED MEMBER</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-xs text-gray-500 uppercase">Your Balance</div>
                        <div className="text-2xl font-bold text-white">{balance.toString() / 10 ** 18} ROLL</div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="group bg-[#151515] rounded-2xl border border-white/5 overflow-hidden hover:border-beetle-gold/50 transition-all">
                        <div className="h-48 bg-gray-800 relative">
                            {/* Placeholder for Merch Image */}
                            <div className="absolute inset-0 flex items-center justify-center text-4xl">👕</div>
                            <div className="absolute top-4 right-4 bg-beetle-gold text-black text-xs font-black px-2 py-1 rounded">20% OFF</div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">Colony Hoodie</h3>
                            <p className="text-gray-400 text-sm mb-4">Limited Edition Embroidered Merch.</p>
                            <div className="flex justify-between items-center">
                                <div className="text-gray-600 line-through text-sm">$60.00</div>
                                <div className="text-beetle-blue font-bold text-xl">$48.00</div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group bg-[#151515] rounded-2xl border border-white/5 overflow-hidden hover:border-beetle-gold/50 transition-all">
                        <div className="h-48 bg-gray-800 relative">
                            <div className="absolute inset-0 flex items-center justify-center text-4xl">🖼️</div>
                            <div className="absolute top-4 right-4 bg-beetle-gold text-black text-xs font-black px-2 py-1 rounded">EARLY ACCESS</div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">Beetle NFT Gen 1</h3>
                            <p className="text-gray-400 text-sm mb-4">Original artwork. Stake for yield.</p>
                            <div className="flex justify-between items-center">
                                <div className="text-gray-600 line-through text-sm">0.5 BNB</div>
                                <div className="text-beetle-blue font-bold text-xl">0.4 BNB</div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="group bg-[#151515] rounded-2xl border border-white/5 overflow-hidden hover:border-beetle-gold/50 transition-all">
                        <div className="h-48 bg-gray-800 relative">
                            <div className="absolute inset-0 flex items-center justify-center text-4xl">💊</div>
                            <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-black px-2 py-1 rounded">BETA</div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">Beta Trading Bot</h3>
                            <p className="text-gray-400 text-sm mb-4">Automated buy/sell protection.</p>
                            <div className="flex justify-between items-center">
                                <div className="text-gray-600 line-through text-sm">$100/mo</div>
                                <div className="text-beetle-blue font-bold text-xl">FREE</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
