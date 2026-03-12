import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Globe, ShieldCheck, Tag, ExternalLink, ArrowRight, Leaf, Toolbox, Star, Shield, CheckCircle } from 'lucide-react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { useAccount, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { CONFIG } from '../config';

const ERC20_ABI = [
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

const AFFILIATE_PRODUCTS = [
    {
        id: 'starlink',
        name: "Starlink Mobility Kit",
        category: "Connectivity",
        description: "High-speed, low-latency internet for off-grid mining operations anywhere on Earth. Verified for Solar Sentinel LoRaWAN backhaul.",
        price: "$599",
        partner: "SpaceX / Starlink",
        discount: "Priority Setup for Holders",
        image: "📡",
        link: "https://www.starlink.com",
        premium: true
    },
    {
        id: 'ecoflow',
        name: "EcoFlow Delta Pro",
        category: "Energy",
        description: "Industrial grade power station for Solar Sentinel redundancy. Features X-Stream fast charging and smart app control.",
        price: "$3,699",
        partner: "EcoFlow Authorized",
        discount: "10% ROLL Rebate Active",
        image: "🔋",
        link: "https://www.ecoflow.com"
    },
    {
        id: 'meshtastic',
        name: "Meshtastic T-Beam V1.1",
        category: "Networking",
        description: "Off-grid telemetry mesh. Pre-configured for Scarab Protocol peer discovery in contested GSM zones.",
        price: "$45",
        partner: "LilyGO / Scarab Opt.",
        discount: "Scarab Firmware Pre-load",
        image: "📟",
        link: "https://meshtastic.org"
    },
    {
        id: 'survivor',
        name: "Survivor Filter Pro",
        category: "Survival",
        description: "Advanced water filtration for long-duration site maintenance. 0.01 micron protection.",
        price: "$125",
        partner: "Survivor Filter",
        discount: "Affiliate Referral Active",
        image: "💧",
        link: "https://www.survivorfilter.com"
    }
];

export default function Marketplace() {
    const { address, isConnected } = useAccount();

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

    return (
        <div className="min-h-screen bg-[#050B08] text-[#E8E8E8] font-sans selection:bg-beetle-gold selection:text-black">
            <Navbar isLanding={false} />

            {/* Hero */}
            <section className="pt-48 pb-24 relative overflow-hidden border-b border-white/5">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <span className="text-beetle-gold text-xs font-bold uppercase tracking-[0.5em] mb-6 block font-mono">
                            Institutional Supply Chain
                        </span>
                        <h1 className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tighter italic">
                            The <span className="text-beetle-gold">Armory</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed mb-12">
                            A curated ecosystem of off-grid infrastructure. From high-capacity energy storage
                            to mesh-networking backhauls, the Armory equips protocol stakeholders for any environment.
                        </p>

                        {isHolder ? (
                            <div className="inline-flex items-center gap-4 bg-beetle-gold/10 border border-beetle-gold/30 px-6 py-3 rounded-2xl">
                                <Star className="text-beetle-gold fill-beetle-gold" size={20} />
                                <span className="text-beetle-gold font-black uppercase tracking-widest text-xs">
                                    Active Stakeholder: Exclusive Partner Discounts Applied
                                </span>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 text-gray-500 text-xs font-bold border border-white/10 px-6 py-3 rounded-2xl">
                                <Lock size={14} />
                                <span>Hold 1,000 SCARAB to unlock partner rebates</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Partner Ecosystem Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-4 flex items-center gap-3">
                            <Shield className="text-beetle-gold" /> Equipment Partners
                        </h2>
                        <p className="text-gray-500">Industry-leading hardware verified for Scarab Protocol integration.</p>
                    </div>
                    <div className="flex gap-3">
                        {['Connectivity', 'Energy', 'Networking', 'Survival'].map(cat => (
                            <button key={cat} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-beetle-gold/10 hover:border-beetle-gold/30 hover:text-beetle-gold transition-all">
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {AFFILIATE_PRODUCTS.map(product => (
                        <div key={product.id} className={`bg-black/40 border ${product.premium ? 'border-beetle-gold/30 shadow-[0_0_40px_rgba(255,184,0,0.05)]' : 'border-white/10'} rounded-[2.5rem] overflow-hidden group hover:border-beetle-gold/50 transition-all flex flex-col`}>
                            <div className="aspect-[4/3] bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center text-7xl relative">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                                <span className="grayscale-[0.5] group-hover:grayscale-0 transition-all group-hover:scale-110 duration-500">{product.image}</span>
                                {product.premium && (
                                    <div className="absolute top-6 left-6 bg-beetle-gold text-black text-[9px] font-black px-3 py-1 rounded-full shadow-lg">PREMIUM CHOICE</div>
                                )}
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <span className="text-[10px] font-black text-beetle-gold uppercase tracking-[0.2em] mb-2 block">{product.category}</span>
                                    <h4 className="text-xl font-black text-white leading-none mb-4">{product.name}</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{product.description}</p>
                                </div>

                                <div className="space-y-3 mb-8 flex-1">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-beetle-green">
                                        <CheckCircle size={14} />
                                        {isHolder ? "DEPIN REBATE VERIFIED" : product.discount}
                                    </div>
                                    <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest border-t border-white/5 pt-3">
                                        Source: {product.partner}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-gray-600 uppercase">MSRP</span>
                                        <span className="text-2xl font-black text-white font-mono">{product.price}</span>
                                    </div>
                                    <a
                                        href={product.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/5 hover:bg-white text-white hover:text-black w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center transition-all group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                    >
                                        <ExternalLink size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Partnership CTA */}
            <section className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-beetle-gold/5 rounded-full blur-[140px] pointer-events-none"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <ShieldCheck className="text-beetle-gold w-20 h-20 mx-auto mb-10" />
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Verified <span className="text-beetle-gold">Partner</span> Network</h2>
                    <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed opacity-70">
                        Are you building the future of off-grid sovereignty? We are seeking
                        industrial-grade partners to expand the Armory ecosystem.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-black font-black px-12 py-5 rounded-2xl hover:scale-105 transition-all text-lg shadow-xl">
                            Inquire for Partnership
                        </button>
                        <Link to="/products" className="bg-white/5 border border-white/10 text-white font-black px-12 py-5 rounded-2xl hover:bg-white/10 transition-all text-lg">
                            Internal R&D Hardware
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
