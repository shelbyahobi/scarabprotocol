import { useState, useEffect } from 'react';
import { useAccount, useContractReads } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, Zap, ShoppingCart, ExternalLink, Copy, Map, Users, Leaf, Vote } from 'lucide-react';

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

// ABI for SeedSale deposits (FIXED: Using 'contributions' to match deployed contract)
const SEED_SALE_ABI = [
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "contributions", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

const SEED_SALE_ADDRESS = "0x4D9c1cCA15fAB71FF56A51768DA2B85716b38c9f";
// Placeholder Address - UPDATE AFTER DEPLOYMENT
const TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function ColonyDashboard() {
    const { address, isConnected } = useAccount();
    const [tier, setTier] = useState('Guest'); // Guest, Scout, Guardian, Elder
    const [selectedProduct, setSelectedProduct] = useState(null); // For Modal
    const [activeTab, setActiveTab] = useState('market'); // 'market', 'vision', 'governance'
    const [userContribution, setUserContribution] = useState(0n);

    // Batch Read for Efficiency & Reliability
    const { data: contractData, isError, isLoading } = useContractReads({
        contracts: [
            {
                address: TOKEN_ADDRESS,
                abi: ERC20_ABI,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                address: SEED_SALE_ADDRESS,
                abi: SEED_SALE_ABI,
                functionName: 'contributions', // FIXED from 'deposits'
                args: [address],
            }
        ],
        enabled: isConnected && !!address,
        watch: true,
    });

    useEffect(() => {
        if (!isConnected || !address) {
            setTier('Guest');
            return;
        }

        if (contractData) {
            const tokenBalance = contractData[0]?.result ? BigInt(contractData[0].result) : 0n;
            const seedDeposit = contractData[1]?.result ? BigInt(contractData[1].result) : 0n;
            setUserContribution(seedDeposit);

            // Tier Logic
            const decimals = 10n ** 18n;

            // Priority 1: High Token Balance
            if (tokenBalance >= 5000000n * decimals) {
                setTier('Elder');
            } else if (tokenBalance >= 1000000n * decimals) {
                setTier('Guardian');
            }
            // Priority 2: Seed Contributor (Any Amount) or Token Holder
            else if (seedDeposit > 0n || tokenBalance > 0n) {
                setTier('Scout'); // Seed Buyers get Scout access immediately
            }
            // Default: Guest
            else {
                setTier('Guest');
            }
        }

    }, [contractData, isConnected, address]);

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

    const communities = [
        { id: 1, name: "Project Alpha (Arizona)", status: "Land Secured", type: "Solar Farm", slots: "10/50 Filled" },
        { id: 2, name: "Haven Node (Portugal)", status: "Scouting", type: "Permaculture", slots: "Open Soon" },
        { id: 3, name: "Bunker DAO (Swiss)", status: "Proposal", type: "Secure Storage", slots: "Voting" },
    ];

    const handleBuy = (product) => {
        if (tier === 'Guest') return;
        setSelectedProduct(product);
    };

    return (
        <section id="marketplace" className="py-24 relative overflow-hidden bg-[#0c0c0c]">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-beetle-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Header Copy */}
                <div className="text-center mb-12 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                        The Grid is Fragile. <br />
                        <span className="text-beetle-gold">Your Portfolio Shouldn't Be.</span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        Welcome to the <strong>Colony Command Center</strong>.
                        Your gateway to off-grid resilience, exclusive hardware, and the future DAO network.
                    </p>

                    {/* Navigation Tabs */}
                    <div className="flex justify-center gap-4 mb-8 flex-wrap">
                        <button
                            onClick={() => setActiveTab('market')}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'market' ? 'bg-beetle-gold text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                        >
                            Utility Marketplace
                        </button>
                        <button
                            onClick={() => setActiveTab('vision')}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'vision' ? 'bg-beetle-electric text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                        >
                            DAO Vision & Map
                        </button>
                        {tier !== 'Guest' && (
                            <button
                                onClick={() => setActiveTab('governance')}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'governance' ? 'bg-beetle-green text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                            >
                                Governance (Beta)
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Bar */}
                <div className="flex justify-between items-center bg-[#111] border border-white/10 p-4 rounded-xl mb-12">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${tier === 'Guest' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                        <span className="text-gray-400 font-mono text-sm uppercase">Colony Status:</span>
                        <span className={`font-bold ${tier === 'Guest' ? 'text-white' : 'text-beetle-electric'}`}>
                            {tier.toUpperCase()} {tier !== 'Guest' && '✓'}
                        </span>
                    </div>
                    {tier === 'Guest' && (
                        <div className="hidden md:flex text-xs text-beetle-gold animate-pulse">
                            Seed Contributors get Instant Access
                        </div>
                    )}
                    {tier !== 'Guest' && (
                        <div className="hidden md:flex text-xs text-green-400 font-bold items-center gap-2">
                            <ShieldCheck size={14} /> Access Unlocked
                        </div>
                    )}
                </div>

                {/* --- TAB: MARKETPLACE --- */}
                {activeTab === 'market' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {products.map((product) => {
                            const isLocked = tier === 'Guest';
                            // Simple view logic: Guests see blurred "Locked" state or just "Connect"
                            // User request: "Glimpse of app". So show the item but lock the button.

                            return (
                                <div key={product.id} className="group bg-[#0a1a0f]/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden hover:border-beetle-electric/50 transition-all hover:-translate-y-2 relative">

                                    <div className="h-64 bg-black/40 relative flex items-center justify-center text-6xl">
                                        {product.image}
                                        <div className="absolute top-4 right-4 bg-beetle-gold text-black text-xs font-black px-3 py-1 rounded-full z-10">
                                            {product.discount}
                                        </div>
                                        {isLocked && (
                                            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center flex-col gap-4 border border-beetle-gold/20 z-20">
                                                <Lock className="text-beetle-gold w-12 h-12 mb-2 animate-pulse" />
                                                <div className="text-center">
                                                    <span className="text-white font-black bg-black/80 border border-white/10 px-4 py-2 rounded-full text-sm uppercase tracking-widest">
                                                        Colony Access Required
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-2">Join Seed Sale to Unlock</p>
                                                </div>
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
                                                ? 'bg-white/5 text-gray-400 cursor-not-allowed border border-white/5'
                                                : 'bg-beetle-electric text-black hover:bg-white border border-beetle-electric'
                                                }`}
                                        >
                                            {isLocked ? (
                                                <>Join Seed to Unlock</>
                                            ) : (
                                                <> <ShoppingCart size={18} /> Reveal Code </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {/* --- TAB: DAO VISION --- */}
                {activeTab === 'vision' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                        className="bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 text-left"
                    >
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-4">Phase 4: <span className="text-beetle-electric">The Physical Network</span></h3>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    Our ultimate goal is to establish a DAO that owns and operates self-sufficient, off-grid communities.
                                    $ROLL holders will have governance rights to vote on land acquisitions, resource allocation,
                                    and even priority access to physical residency.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <ShieldCheck className="text-beetle-gold" /> Legal Entity Formation (Wyoming DAO LLC)
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <Map className="text-beetle-gold" /> Global Land Scouting & Acquisition
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <Users className="text-beetle-gold" /> "Refer-a-Worker" Bounty Program
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <Leaf className="text-beetle-gold" /> Permaculture & Energy Independence
                                    </li>
                                </ul>

                                <button className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold border border-white/5 hover:bg-white/20 transition-all flex items-center gap-2">
                                    Read the Whitepaper <ExternalLink size={16} />
                                </button>
                            </div>

                            <div className="bg-[#0a1a0f] rounded-2xl p-6 border border-beetle-electric/20 relative overflow-hidden">
                                {/* Fake Map Visualization */}
                                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-10 bg-center"></div>

                                <h4 className="text-beetle-electric font-mono mb-4 uppercase tracking-widest relative z-10">Active Proposals</h4>
                                <div className="space-y-3 relative z-10">
                                    {communities.map(c => (
                                        <div key={c.id} className="bg-black/80 p-4 rounded-xl border border-white/5 flex justify-between items-center hover:border-beetle-gold/50 cursor-pointer transition-colors">
                                            <div>
                                                <div className="text-white font-bold">{c.name}</div>
                                                <div className="text-xs text-gray-500">{c.type}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-beetle-gold text-xs font-bold">{c.status}</div>
                                                <div className="text-[10px] text-gray-600">{c.slots}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 text-center text-xs text-gray-500">
                                    *Map data is for demonstration of Phase 4 goals. Real-time DAO map coming Q4 2026.
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- TAB: GOVERNANCE (NEW) --- */}
                {activeTab === 'governance' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                        className="bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 text-center"
                    >
                        <Vote className="w-16 h-16 text-beetle-green mx-auto mb-6" />
                        <h3 className="text-3xl font-bold text-white mb-4">Your Voice Power</h3>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                            As a Seed Contributor, you don't just get tokens. You get a seat at the table.
                            Your 'Scout' status grants you early voting rights on the first hardware deployment location.
                        </p>

                        <div className="bg-[#0a1a0f] border border-beetle-green/30 inline-flex flex-col p-6 rounded-2xl mb-8">
                            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Current Voting Power</span>
                            <span className="text-4xl font-black text-white">{(Number(userContribution) / 10 ** 18 * 10).toFixed(0)} <span className="text-lg text-beetle-green">VP</span></span>
                        </div>

                        <div>
                            <button className="bg-beetle-green/20 text-beetle-green border border-beetle-green/50 px-8 py-3 rounded-xl font-bold hover:bg-beetle-green hover:text-black transition-all">
                                View Active Proposals (Coming Soon)
                            </button>
                        </div>
                    </motion.div>
                )}

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
