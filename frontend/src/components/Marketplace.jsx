import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Globe, ShieldCheck, Tag, ExternalLink, ArrowRight, Leaf, Toolbox } from 'lucide-react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const AFFILIATE_PRODUCTS = [
    {
        id: 'starlink',
        name: "Starlink Mobility Kit",
        category: "Connectivity",
        description: "High-speed, low-latency internet for off-grid mining operations anywhere on Earth.",
        price: "$599",
        partner: "SpaceX / Starlink",
        discount: "Priority Setup for Scarab Holders",
        image: "📡",
        link: "https://www.starlink.com"
    },
    {
        id: 'solar-power',
        name: "EcoFlow Delta Pro",
        category: "Energy Storage",
        description: "Portable power station for Solar Sentinel redundancy and emergency off-grid backup.",
        price: "$3,699",
        partner: "EcoFlow Partner",
        discount: "10% ROLL Rebate Available",
        image: "🔋",
        link: "https://www.ecoflow.com"
    },
    {
        id: 'mesh-radio',
        name: "Meshtastic T-Beam",
        category: "Networking",
        description: "LoRa mesh communication for node-to-node telemetry in zones without GSM coverage.",
        price: "$45",
        partner: "LilyGO / Scarab Optimized",
        discount: "SCARAB Config Included",
        image: "📟",
        link: "https://meshtastic.org"
    },
    {
        id: 'water-fltration',
        name: "Survivor Filter Pro",
        category: "Life Support",
        description: "Industrial grade water filtration for long-term off-grid site maintenance.",
        price: "$125",
        partner: "Survivor Filter",
        discount: "Affiliate Partner",
        image: "💧",
        link: "https://www.survivorfilter.com"
    }
];

export default function Marketplace() {
    return (
        <div className="min-h-screen bg-[#050B08] text-white selection:bg-beetle-gold selection:text-black">
            <Navbar />

            {/* Hero */}
            <section className="pt-40 pb-20 relative overflow-hidden text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-beetle-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter italic">
                            The <span className="text-beetle-gold">Armory</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            A curated marketplace for survival gear, off-grid energy, and secure connectivity.
                            <span className="text-white font-bold"> Powered by Scarab DAO Partnerships.</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* In-House Hardware Teaser */}
            <section className="py-12 border-y border-white/5 bg-black/40">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-beetle-electric/10 rounded-2xl flex items-center justify-center border border-beetle-electric/30">
                            <Zap className="text-beetle-electric" size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Scarab Native Hardware</h3>
                            <p className="text-gray-500 text-sm">Solar Sentinels and Bokashi Kits are now available for preorder.</p>
                        </div>
                    </div>
                    <Link to="/products" className="bg-beetle-electric text-black font-black px-8 py-4 rounded-xl hover:scale-105 transition-all text-sm flex items-center gap-2">
                        View Native Hardware <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Affiliate Grid */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-black flex items-center gap-3">
                            <Toolbox className="text-beetle-gold" /> Partner Ecosystem
                        </h2>
                        <div className="hidden md:flex gap-4">
                            <CategoryBadge label="All Tools" active />
                            <CategoryBadge label="Energy" />
                            <CategoryBadge label="Comm" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {AFFILIATE_PRODUCTS.map(product => (
                            <div key={product.id} className="bg-black border border-white/10 rounded-3xl overflow-hidden group hover:border-beetle-gold/50 transition-all flex flex-col">
                                <div className="aspect-square bg-white/5 flex items-center justify-center text-8xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-beetle-gold/10 to-transparent"></div>
                                    {product.image}
                                    <div className="absolute top-4 left-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-black px-2 py-1 rounded border border-white/10 text-gray-400">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-bold text-white leading-tight">{product.name}</h4>
                                    </div>
                                    <p className="text-gray-500 text-xs mb-6 line-clamp-3">
                                        {product.description}
                                    </p>

                                    <div className="space-y-3 mb-8 flex-1">
                                        <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                                            <Tag size={14} /> {product.discount}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600 uppercase">
                                            Partner: {product.partner}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="text-xl font-bold font-mono">{product.price}</div>
                                        <a href={product.link} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full transition-all">
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partnership CTA */}
            <section className="py-24 border-t border-white/5 bg-gradient-to-b from-black to-[#0a1a0f]">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <ShieldCheck className="text-beetle-gold w-16 h-16 mx-auto mb-6" />
                    <h2 className="text-4xl font-black mb-6 tracking-tighter">Become a <span className="text-beetle-gold">Verified Partner</span></h2>
                    <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                        Are you building off-grid infrastructure, renewable energy solutions, or secure communication hardware?
                        The Scarab DAO is looking for partners to expand the Armory.
                    </p>
                    <button className="bg-white text-black font-black px-10 py-4 rounded-2xl hover:bg-beetle-gold transition-all">
                        Inquire for Partnership
                    </button>
                </div>
            </section>
        </div>
    );
}

function CategoryBadge({ label, active }) {
    return (
        <button className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${active ? 'bg-beetle-gold text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
            {label}
        </button>
    );
}
