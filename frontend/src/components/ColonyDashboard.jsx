import { useState, useEffect } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Zap } from 'lucide-react';

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

    const products = [
        {
            name: "Tactical Solar Kit",
            priceFiat: "$1,200",
            priceRoll: "12,000 ROLL",
            discount: "50% OFF",
            image: "☀️", // Placeholder emoji, replace with generated images later
            tier: "Guardian"
        },
        {
            name: "Starlink Roam Hub",
            priceFiat: "$600",
            priceRoll: "6,000 ROLL",
            discount: "FREE DATA",
            image: "📡",
            tier: "Elder"
        },
        {
            name: "Water Filtration Unit",
            priceFiat: "$350",
            priceRoll: "3,500 ROLL",
            discount: "30% OFF",
            image: "💧",
            tier: "Scout"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-beetle-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-tighter">
                            Colony <span className="text-beetle-electric">Marketplace</span>
                        </h2>
                        <p className="text-gray-400 mt-2 flex items-center gap-2">
                            <Zap size={16} className="text-beetle-gold" />
                            Exchange $ROLL for real-world survival utility.
                        </p>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Your Status</div>
                        <div className={`text-xl font-bold ${hasAccess ? 'text-beetle-electric' : 'text-gray-500'}`}>
                            {hasAccess ? 'VERIFIED MEMBER' : 'UNVERIFIED'}
                        </div>
                    </div>
                </div>

                {/* Main Content Area - Stacked for Blur Effect */}
                <div className="relative">

                    {/* The "blurred" layer (The Marketplace itself) */}
                    <div className={`grid md:grid-cols-3 gap-8 transition-all duration-500 ${!hasAccess ? 'blur-xl opacity-30 pointer-events-none scale-95' : ''}`}>
                        {products.map((product, index) => (
                            <div key={index} className="group bg-[#0a1a0f]/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden hover:border-beetle-electric/50 transition-all hover:-translate-y-2">
                                <div className="h-64 bg-black/40 relative flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                                    {product.image}
                                    <div className="absolute top-4 right-4 bg-beetle-gold text-black text-xs font-black px-3 py-1 rounded-full">
                                        {product.discount}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-xs text-beetle-electric font-mono mb-2 uppercase tracking-widest">{product.tier} Tier</div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{product.name}</h3>

                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <div className="text-gray-500 line-through text-sm">{product.priceFiat}</div>
                                            <div className="text-white font-black text-xl">{product.priceRoll}</div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-white/5 hover:bg-beetle-electric hover:text-black text-white border border-white/10 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* The "Access Denied" Overlay */}
                    {!hasAccess && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-black/80 backdrop-blur-xl border border-beetle-gold/30 p-10 rounded-3xl text-center max-w-lg shadow-[0_0_50px_rgba(212,175,55,0.2)]"
                            >
                                <Lock size={48} className="text-beetle-gold mx-auto mb-6" />
                                <h3 className="text-3xl font-black text-white mb-2">MEMBERS ONLY</h3>
                                <p className="text-gray-400 mb-8">
                                    This marketplace is gated for the defined Colony. <br />
                                    <strong>Connect Wallet</strong> and hold <strong>$ROLL</strong> to reveal prices.
                                </p>
                                <button className="bg-beetle-gold text-black font-black py-3 px-8 rounded-xl hover:scale-105 transition-transform">
                                    CONNECT WALLET
                                </button>
                            </motion.div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}
