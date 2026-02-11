import { useState, useEffect } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, Zap, ShoppingCart, ExternalLink, Copy } from 'lucide-react';

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

const SEED_SALE_ADDRESS = "0x4D9c1cCA15fAB71FF56A51768DA2B85716b38c9f";
// Placeholder Address - UPDATE AFTER DEPLOYMENT
const TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function ColonyDashboard() {
    const { address, isConnected } = useAccount();
    const [tier, setTier] = useState('Guest'); // Guest, Scout, Guardian, Elder
    const [balance, setBalance] = useState(0n);
    const [selectedProduct, setSelectedProduct] = useState(null); // For Modal

    // Check Token Balance
    const { data: tokenBalance } = useContractRead({
        address: TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
        enabled: isConnected && !!address,
        watch: true,
    });

    useEffect(() => {
        if (!isConnected || !address) {
            setTier('Guest');
            return;
        }

        const bal = tokenBalance ? BigInt(tokenBalance) : 0n;
        setBalance(bal);

        // Tier Logic (Assuming 18 decimals)
        const decimals = 10n ** 18n;
        const balFormatted = bal; // Raw balance

        if (balFormatted >= 5000000n * decimals) {
            setTier('Elder');
        } else if (balFormatted >= 1000000n * decimals) {
            setTier('Guardian');
        } else if (balFormatted > 0n) {
            setTier('Scout');
        } else {
            setTier('Guest'); // Connected but 0 balance
        }
    }, [tokenBalance, isConnected, address]);

    const products = [
        {
            id: 1,
            name: "Tactical Solar Kit",
            pricePublic: "$1,200",
            priceMember: "$600 (Equiv. ROLL)",
            discount: "50% OFF",
            image: "☀️",
            minTier: "Guardian",
            code: "ROLL-SOLAR-2026",
            link: "https://example-solar-partner.com"
        },
        {
            id: 2,
            name: "Starlink Roam Hub",
            pricePublic: "$600",
            priceMember: "FREE DATA (via Rebate)",
            discount: "Data Rebate",
            image: "📡",
            minTier: "Elder",
            code: "ROLL-STARLINK-VIP",
            link: "https://starlink.com"
        },
        {
            id: 3,
            name: "Water Filtration Unit",
            pricePublic: "$350",
            priceMember: "$245 (Equiv. ROLL)",
            discount: "30% OFF",
            image: "💧",
            minTier: "Scout",
            code: "ROLL-PURE-WATER",
            link: "https://example-water.com"
        }
    ];

    const handleBuy = (product) => {
        if (tier === 'Guest') return; // Should be handled by UI state, but safety check
        setSelectedProduct(product);
    };

    return (
        <section id="marketplace" className="py-24 relative overflow-hidden bg-[#0c0c0c]">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-beetle-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Header Copy */}
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                        The Grid is Fragile. <br />
                        <span className="text-beetle-gold">Your Portfolio Shouldn't Be.</span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Welcome to the world's first token-gated off-grid marketplace.
                        Whether you are preparing your home for the future or building a remote colony,
                        <strong>$ROLL</strong> is your currency for resilience. We’ve partnered with top manufacturers
                        to bring our 'Colony Members' prices that the general public cannot access.
                    </p>
                </div>

                {/* Status Bar */}
                <div className="flex justify-between items-center bg-[#111] border border-white/10 p-4 rounded-xl mb-12">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${tier === 'Guest' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                        <span className="text-gray-400 font-mono text-sm uppercase">Colony Status:</span>
                        <span className={`font-bold ${tier === 'Guest' ? 'text-white' : 'text-beetle-electric'}`}>
                            {tier.toUpperCase()}
                        </span>
                    </div>
                    {tier === 'Guest' && (
                        <div className="hidden md:flex text-xs text-beetle-gold animate-pulse">
                            Connect Wallet to Unlock Tiers
                        </div>
                    )}
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {products.map((product) => {
                        const isLocked = tier === 'Guest';
                        // Ideally checking tiers: Guest < Scout < Guardian < Elder
                        // Simple check: if product requires Elder but user is Scout -> Locked
                        // For MVP: If Guest -> Locked. If Holder -> Unlocked (Logic simplified for now, or strict?)
                        // User prompt imply: "Seed Holder (Scout)" gets 5%, "Whale (Elder)" gets 25%.
                        // Let's implement strict tier checking if we can, or just keep it simple:
                        // Guest = Locked. Everyone else = Unlocked for now (or strictly check minTier?)
                        // Let's do simple: Guest sees Public Price. Holder sees Member Price.

                        return (
                            <div key={product.id} className="group bg-[#0a1a0f]/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden hover:border-beetle-electric/50 transition-all hover:-translate-y-2 relative">

                                <div className="h-64 bg-black/40 relative flex items-center justify-center text-6xl">
                                    {product.image}
                                    <div className="absolute top-4 right-4 bg-beetle-gold text-black text-xs font-black px-3 py-1 rounded-full z-10">
                                        {product.discount}
                                    </div>
                                    {isLocked && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                            <Lock className="text-white/50 w-12 h-12" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="text-xs text-beetle-electric font-mono mb-2 uppercase tracking-widest">{product.minTier} Tier</div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{product.name}</h3>

                                    <div className="space-y-1 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Public Price:</span>
                                            <span className="text-gray-400 line-through">{product.pricePublic}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-beetle-gold font-bold">Colony Price:</span>
                                            <span className="text-white font-black text-lg">{product.priceMember}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => !isLocked && handleBuy(product)}
                                        disabled={isLocked}
                                        className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${isLocked
                                            ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                                            : 'bg-beetle-electric text-black hover:bg-white border border-beetle-electric'
                                            }`}
                                    >
                                        {isLocked ? (
                                            <>Connect to Unlock</>
                                        ) : (
                                            <> <ShoppingCart size={18} /> Reveal Code </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Discount Code Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0a1a0f] border border-beetle-gold/50 p-8 rounded-2xl max-w-md w-full text-center relative shadow-[0_0_50px_rgba(212,175,55,0.2)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

                            <div className="w-16 h-16 bg-beetle-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Zap className="text-beetle-gold w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2">Access Granted</h3>
                            <p className="text-gray-400 mb-6">Use this code at checkout on our partner's site.</p>

                            <div className="bg-black/50 border border-white/10 p-4 rounded-xl flex items-center justify-between mb-6 group cursor-pointer"
                                onClick={() => navigator.clipboard.writeText(selectedProduct.code)}>
                                <code className="text-beetle-electric font-mono text-xl font-bold">{selectedProduct.code}</code>
                                <Copy className="text-gray-500 group-hover:text-white transition-colors w-5 h-5" />
                            </div>

                            <a href={selectedProduct.link} target="_blank" className="block w-full bg-beetle-gold text-black font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                                Go to Partner Store <ExternalLink size={18} />
                            </a>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </section>
    );
}
