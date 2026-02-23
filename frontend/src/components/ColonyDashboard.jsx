import { useState, useEffect } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import GovernanceDashboard from './GovernanceDashboard';
import { Lock, ShieldCheck, Zap, ShoppingCart, ExternalLink, Copy, Users, Leaf, Vote, Server, Activity, Plus, Vault, Gift } from 'lucide-react';
import { formatEther } from 'viem';
import { CONFIG } from '../config';

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

// ABI for SeedSale contributions
const SEED_SALE_ABI = [
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "contributions", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "totalRaised", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

const SEED_SALE_ADDRESS = CONFIG.SEED_SALE_ADDRESS;
const TOKEN_ADDRESS = CONFIG.ROLL_TOKEN_ADDRESS;

export default function ColonyDashboard() {
    const { address, isConnected } = useAccount();
    const [tier, setTier] = useState('Guest'); // Guest, Scout, Guardian, Elder
    const [selectedProduct, setSelectedProduct] = useState(null); // For Modal
    const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace', 'hive', 'governance'
    const [userContribution, setUserContribution] = useState(0n);
    const [treasuryBalance, setTreasuryBalance] = useState("0");

    // Batch Read for Efficiency & Reliability
    const { data: contractData } = useReadContracts({
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
                functionName: 'contributions',
                args: [address],
            },
            {
                address: SEED_SALE_ADDRESS,
                abi: SEED_SALE_ABI,
                functionName: 'totalRaised',
            }
        ],
        query: {
            enabled: isConnected && !!address,
            refetchInterval: 5000,
        }
    });

    useEffect(() => {
        if (!isConnected || !address) {
            setTier('Guest');
            return;
        }

        if (contractData && contractData[0]?.status === 'success') {
            const tokenBalance = contractData[0].result ? BigInt(contractData[0].result) : 0n;
            const seedDeposit = contractData[1]?.result ? BigInt(contractData[1].result) : 0n;
            const totalRaised = contractData[2]?.result ? BigInt(contractData[2].result) : 0n;

            setUserContribution(seedDeposit);
            setTreasuryBalance(parseFloat(formatEther(totalRaised)).toFixed(2));

            // Tier Logic
            const decimals = 10n ** 18n;

            // Priority 1: High Token Balance
            if (tokenBalance >= 5000000n * decimals) { // 5M SCARAB
                setTier('Elder');
            } else if (tokenBalance >= 1000000n * decimals) { // 1M SCARAB
                setTier('Guardian');
            }
            // Priority 2: Seed Contributor (Any Amount) or Token Holder
            else if (seedDeposit > 0n || tokenBalance > 0n) {
                setTier('Scout');
            }
            // Default: Guest
            else {
                setTier('Guest');
            }
        }

    }, [contractData, isConnected, address]);

    const hardwareProducts = [
        {
            id: 1,
            name: "Scarab Node v1",
            price: "2,500 SCARAB",
            retailPrice: "$450 USD",
            image: "/beetlebox-prototype.png",
            features: ["Solar MPPT", "LoRaWAN Gateway", "Bio-Sensor"],
            stock: "Pre-Order Q3",
            minTier: "Scout"
        },
        {
            id: 2,
            name: "Hydro-Bit Sensor",
            price: "500 SCARAB",
            retailPrice: "$99 USD",
            image: "/hydrobit-prototype.png",
            features: ["Water Flow Meter", "Purity Sensor", "WiFi"],
            stock: "Design Phase",
            minTier: "Scout"
        }
    ];

    const utilityProducts = [
        {
            id: 3,
            name: "Tactical Solar Kit (60W)",
            priceMember: "$600 (Equiv. SCARAB)",
            retailPrice: "$1,200",
            discount: "50% OFF",
            image: "/solar-kit-prototype.png",
            minTier: "Guardian",
            code: "SCARAB-SOLAR-2026",
            link: "https://example-solar-partner.com"
        },
        {
            id: 4,
            name: "Starlink Auto-Pay",
            priceMember: "Data Rebate",
            retailPrice: "$120/mo",
            discount: "Pay w/ ROLL",
            image: "/starlink-kit-prototype.png",
            minTier: "Elder",
            code: "ROLL-STARLINK-VIP",
            link: "https://starlink.com"
        }
    ];

    const handleBuy = (product) => {
        if (tier === 'Guest') return;
        setSelectedProduct(product);
    };

    return (
        <section id="colony-dashboard" className="py-24 relative overflow-hidden bg-[#0c0c0c] border-t border-white/5">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-beetle-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-white/10 pb-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                            Colony <span className="text-beetle-gold">Command Center</span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Manage your assets, hardware, and governance rights.
                        </p>
                    </div>

                    {/* Tier Status Badge */}
                    <div className="bg-[#111] border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tier === 'Guest' ? 'bg-red-500/20 text-red-500' : 'bg-beetle-green/20 text-beetle-green'}`}>
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Clearance Level</div>
                            <div className={`text-xl font-black ${tier === 'Guest' ? 'text-white' : 'text-beetle-electric'}`}>
                                {tier.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-12 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('marketplace')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'marketplace' ? 'bg-beetle-gold text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <ShoppingCart size={18} /> The Armory (Market)
                    </button>
                    <button
                        onClick={() => setActiveTab('hive')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'hive' ? 'bg-beetle-electric text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <Server size={18} /> The Hive (My Nodes)
                    </button>
                    <button
                        onClick={() => setActiveTab('governance')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'governance' ? 'bg-beetle-green text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <Vote size={18} /> The Council (DAO)
                    </button>
                </div>

                {/* ─── CLAIM REWARDS PANEL (Pull Model) ─── */}
                {isConnected && tier !== 'Guest' && (
                    <div className="mb-8 bg-gradient-to-r from-beetle-gold/10 to-transparent border border-beetle-gold/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-beetle-gold/20 rounded-xl flex items-center justify-center">
                                <Gift size={24} className="text-beetle-gold" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Pending Rewards (Pull Model)</div>
                                <div className="text-2xl font-black text-white font-mono">0 <span className="text-beetle-gold text-sm">SCARAB</span></div>
                                <div className="text-xs text-gray-500 mt-1">~0 SCARAB/day estimated · claim from EmissionController</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <button
                                className="px-8 py-3 bg-beetle-gold text-black font-black rounded-xl hover:brightness-110 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={true}
                                title="EmissionController not yet deployed to this network"
                            >
                                Claim SCARAB →
                            </button>
                            <span className="text-[10px] text-gray-600 font-mono">EmissionController: awaiting testnet deploy</span>
                        </div>
                    </div>
                )}

                {/* --- TAB: MARKETPLACE (Consolidated) --- */}
                {activeTab === 'marketplace' && (
                    <div className="space-y-16">
                        {/* Section 1: Hardware (Revenue Generating) */}
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Zap className="text-beetle-gold" /> Mining Hardware (Generates ROLL)
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hardwareProducts.map(product => {
                                    const isLocked = tier === 'Guest';
                                    return (
                                        <div key={product.id} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-beetle-gold/50 transition-all flex flex-col">
                                            <div className="aspect-video bg-gray-900 relative overflow-hidden flex items-center justify-center p-6">
                                                {product.image.startsWith('/') ? (
                                                    <img src={product.image} alt={product.name} className="h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform" />
                                                ) : (
                                                    <div className="text-6xl">{product.image}</div>
                                                )}
                                                {isLocked && (
                                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                                                        <Lock className="text-beetle-gold" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-lg font-bold text-white">{product.name}</h4>
                                                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">Priority</span>
                                                </div>
                                                <div className="flex items-baseline gap-2 mb-4">
                                                    <span className="text-beetle-gold font-mono font-bold text-xl">{product.price}</span>
                                                    <span className="text-gray-500 text-sm line-through">{product.retailPrice}</span>
                                                </div>
                                                <ul className="space-y-2 mb-6 text-sm text-gray-400 flex-1">
                                                    {product.features.map((f, i) => <li key={i} className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-beetle-electric mt-1.5" /> {f}</li>)}
                                                </ul>
                                                <button
                                                    disabled
                                                    className="w-full bg-white/10 text-gray-300 font-bold py-3 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {product.stock}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Section 2: Utility (Spending ROLL) */}
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Leaf className="text-green-400" /> Survival Gear (Spends ROLL)
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {utilityProducts.map(product => {
                                    const isLocked = tier === 'Guest';
                                    return (
                                        <div key={product.id} className="bg-[#0a1a0f]/40 border border-white/5 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all">
                                            <div className="p-6 flex justify-between items-start">
                                                <div className="text-4xl">{product.image}</div>
                                                <div className="text-right">
                                                    <div className="text-xl font-black text-white">{product.priceMember}</div>
                                                    <div className="text-sm text-gray-500 line-through">{product.retailPrice}</div>
                                                </div>
                                            </div>
                                            <div className="px-6 pb-6">
                                                <h4 className="font-bold text-white mb-1">{product.name}</h4>
                                                <div className="text-green-400 text-sm font-bold mb-4">{product.discount}</div>
                                                <button
                                                    onClick={() => !isLocked && handleBuy(product)}
                                                    disabled={isLocked}
                                                    className={`w-full font-bold py-3 rounded-lg transition-all ${isLocked ? 'bg-white/5 text-gray-500' : 'bg-green-600 text-black hover:bg-green-500'}`}
                                                >
                                                    {isLocked ? "Unlock Access" : "Claim Deal"}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: THE HIVE (Simulated Mining) --- */}
                {activeTab === 'hive' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-12 gap-8">
                        {/* Simulation Stats */}
                        <div className="md:col-span-8 bg-black/40 border border-white/10 rounded-3xl p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">My Nodes</h3>
                                    <p className="text-gray-400">Manage your connected hardware and monitor Production Rewards.</p>
                                </div>
                                <button className="bg-beetle-electric text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white transition-colors">
                                    <Plus size={18} /> Add Device
                                </button>
                            </div>

                            {/* Empty State / Simulator */}
                            <div className="bg-[#0a1a0f] border border-dashed border-beetle-electric/30 rounded-2xl p-8 text-center">
                                <div className="w-16 h-16 bg-beetle-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Activity className="text-beetle-electric" size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">No Active Miners Found</h4>
                                <p className="text-gray-500 mb-6">Connect a verified Scarab Node to start earning.</p>

                                {/* Simulator */}
                                <div className="bg-black/50 rounded-xl p-4 max-w-md mx-auto text-left">
                                    <div className="text-xs text-gray-500 uppercase font-bold mb-3">Projected Earnings (1x Scarab Node)</div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300">Daily Output (Est)</span>
                                        <span className="text-beetle-gold font-mono font-bold">250 ROLL</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Monthly Yield</span>
                                        <span className="text-beetle-gold font-mono font-bold">7,500 ROLL</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Network Stats */}
                        <div className="md:col-span-4 space-y-4">
                            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                                <div className="text-gray-500 text-sm mb-1">Network Difficulty</div>
                                <div className="text-2xl font-bold text-white">1.05x</div>
                            </div>
                            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                                <div className="text-gray-500 text-sm mb-1">Active Nodes (Testnet)</div>
                                <div className="text-2xl font-bold text-beetle-electric">12 <span className="text-xs text-gray-500 font-normal">Online</span></div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- TAB: GOVERNANCE (DAO) --- */}
                {activeTab === 'governance' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
                        <GovernanceDashboard />
                    </motion.div>
                )}

            </div>

            {/* Modal Reuse from Previous (Discount Code) */}
            <AnimatePresence>
                {selectedProduct && selectedProduct.code && (
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
