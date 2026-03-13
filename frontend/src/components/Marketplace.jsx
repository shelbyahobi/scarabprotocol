import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { 
    Lock, Star, ExternalLink, ShieldCheck, 
    Zap, Droplet, Sprout, Radio, Shield,
    Filter, Search, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import { CONFIG } from '../config';
import { MARKETPLACE_CATEGORIES, MARKETPLACE_PRODUCTS } from '../data/marketplaceProducts';

const ERC20_ABI = [
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

const CATEGORY_ICONS = {
    energy: Zap,
    water: Droplet,
    food: Sprout,
    comms: Radio,
    security: Shield
};

export default function Marketplace() {
    const { address, isConnected } = useAccount();
    const [activeCategory, setActiveCategory] = useState('energy');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('priority'); // priority | price-low | price-high

    // Check holder status (≥1000 SCARAB)
    const { data: scarabBalance } = useReadContract({
        address: CONFIG.ROLL_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
        query: {
            enabled: isConnected && !!address
        }
    });

    const isHolder = scarabBalance && scarabBalance >= parseUnits('1000', 18);

    // Get active category products
    const rawProducts = MARKETPLACE_PRODUCTS[activeCategory] || [];

    // Filter by search
    const filteredProducts = searchQuery
        ? rawProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : rawProducts;

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'priority') {
            if (a.scarabProduct && !b.scarabProduct) return -1;
            if (!a.scarabProduct && b.scarabProduct) return 1;
            if (a.isPriority && !b.isPriority) return -1;
            if (!a.isPriority && b.isPriority) return 1;
            return 0;
        }
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
    });

    return (
        <div className="min-h-screen bg-[#050A05] text-[#E8E8E8] font-sans selection:bg-beetle-gold selection:text-black">
            <Navbar isLanding={false} />

            <div className="pt-32 pb-24 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <span className="text-beetle-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block font-mono">
                            Institutional Supply Chain
                        </span>
                        <h1 className="text-7xl md:text-9xl font-black text-white mt-6 mb-8 tracking-tighter leading-none italic">
                            The <span className="text-beetle-gold">Armory</span>
                        </h1>
                        <p className="text-gray-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                            A curated ecosystem of off-grid infrastructure. From high-capacity
                            energy storage to mesh-networking backhauls, the Armory equips
                            protocol stakeholders for any environment.
                        </p>

                        {/* Holder Status Badge */}
                        <div className="mt-12">
                            {isHolder ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="inline-flex items-center gap-3 bg-beetle-gold/10 border border-beetle-gold/30 rounded-2xl px-8 py-4 shadow-[0_0_50px_rgba(212,175,67,0.1)]"
                                >
                                    <Star className="text-beetle-gold fill-beetle-gold" size={20} />
                                    <span className="text-beetle-gold font-black uppercase tracking-widest text-sm">
                                        Exclusive Rebates Unlocked
                                    </span>
                                </motion.div>
                            ) : (
                                <div className="inline-flex flex-col items-center gap-4">
                                    <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-8 py-4 backdrop-blur-xl">
                                        <Lock className="text-gray-600" size={20} />
                                        <span className="text-gray-500 font-bold text-sm">
                                            Hold 1,000 SCARAB to unlock partner rebates
                                        </span>
                                    </div>
                                    <Link
                                        to="/app"
                                        className="text-xs text-beetle-electric font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        Visit The Hive <ArrowRight size={14} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Category Navigation */}
                    <div className="mb-12">
                        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                            {Object.entries(MARKETPLACE_CATEGORIES).map(([key, cat]) => {
                                const Icon = CATEGORY_ICONS[key];
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setActiveCategory(key)}
                                        className={`
                                            flex items-center gap-4 px-8 py-5 rounded-2xl border transition-all whitespace-nowrap group
                                            ${activeCategory === key
                                                ? 'bg-beetle-gold/10 border-beetle-gold/30 text-beetle-gold shadow-[0_0_30px_rgba(212,175,67,0.05)]'
                                                : 'bg-black/40 border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                                            }
                                        `}
                                    >
                                        <Icon size={24} className={activeCategory === key ? "text-beetle-gold" : "text-gray-600 group-hover:text-white"} />
                                        <div className="text-left">
                                            <div className="font-black uppercase tracking-widest text-xs">{cat.name}</div>
                                            <div className="text-[10px] opacity-60 font-mono mt-0.5">{cat.description}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4 mb-16">
                        <div className="relative flex-1">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                            <input
                                type="text"
                                placeholder="Search the armory..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white placeholder-gray-700 focus:border-beetle-electric outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl px-6 py-2">
                            <Filter className="text-gray-600" size={18} />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-gray-400 font-bold text-sm py-3 focus:text-white outline-none appearance-none"
                            >
                                <option value="priority">Recommended</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory + searchQuery + sortBy}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                        >
                            {sortedProducts.length > 0 ? (
                                sortedProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        isHolder={isHolder}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-32 border border-dashed border-white/10 rounded-[3rem]">
                                    <Search size={48} className="text-gray-800 mx-auto mb-6" />
                                    <h3 className="text-2xl font-black text-gray-700">No matching infrastructure found</h3>
                                    <button
                                        onClick={() => { setSearchQuery(''); setActiveCategory('energy'); }}
                                        className="mt-6 text-beetle-gold font-bold hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Partnership CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-32 bg-gradient-to-br from-[#0a1a0f] to-black border border-beetle-green/20 rounded-[4rem] p-16 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-beetle-green/5 rounded-full blur-[120px] pointer-events-none"></div>
                        <ShieldCheck size={64} className="text-beetle-green mx-auto mb-10" />
                        <h3 className="text-5xl font-black text-white mb-6 tracking-tighter">Verified Partner Network</h3>
                        <p className="text-gray-500 max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
                            Are you building the future of off-grid sovereignty? We're vetting institutional
                            partners to join the Armory ecosystem.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:scale-[1.02] transition-all shadow-2xl">
                                Apply for Curation
                            </button>
                            <Link
                                to="/products"
                                className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all font-mono uppercase tracking-widest text-sm"
                            >
                                View Native R&D
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
