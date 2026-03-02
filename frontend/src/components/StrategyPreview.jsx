import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, ShieldCheck } from 'lucide-react';

export default function StrategyPreview() {
    return (
        <section className="py-24 bg-[#050a05] border-t border-white/5 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-beetle-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                        The <span className="text-beetle-gold">Launch Strategy</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
                        A fair, transparent, and phased approach to bootstrapping the Colony.
                        Designed to reward early believers and build sustainable liquidity.
                    </p>
                    <Link to="/strategy" className="inline-flex items-center gap-2 text-beetle-gold font-bold hover:gap-4 transition-all">
                        View Full Price Ladder <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Phase 1 */}
                    <div className="bg-[#111] border border-beetle-gold/30 rounded-2xl p-8 relative group hover:-translate-y-2 transition-transform duration-300">
                        <div className="absolute top-0 left-0 w-full h-1 bg-beetle-gold"></div>
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-beetle-gold font-black text-4xl">01</span>
                            <span className="bg-beetle-gold/10 text-beetle-gold px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Live Now</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Infrastructure Seed</h3>
                        <p className="text-gray-400 text-sm mb-6 h-10">R&D Capital for the Embedded Node Firmware.</p>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-500">Price</span>
                                <span className="text-white font-mono font-bold">8M / $100</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-500">Allocation</span>
                                <span className="text-white font-mono font-bold">5% (50M)</span>
                            </div>
                            <div className="flex justify-between text-sm pb-2">
                                <span className="text-gray-500">Purpose</span>
                                <span className="text-green-400 font-bold">R&D Bootstrapping</span>
                            </div>
                        </div>

                        <Link to="/app" className="block w-full bg-beetle-gold text-black font-bold py-3 rounded-lg text-center hover:bg-white transition-colors">
                            Join Phase 1
                        </Link>
                    </div>

                    {/* Phase 2 */}
                    <div className="bg-[#0a1a0f] border border-white/10 rounded-2xl p-8 relative group hover:-translate-y-2 transition-transform duration-300 opacity-80 hover:opacity-100">
                        <div className="absolute top-0 left-0 w-full h-1 bg-beetle-green"></div>
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-gray-600 font-black text-4xl group-hover:text-beetle-green transition-colors">02</span>
                            <span className="bg-white/5 text-gray-500 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Coming Soon</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Hardware Production</h3>
                        <p className="text-gray-400 text-sm mb-6 h-10">Manufacturing the first batch of 1,000 nodes.</p>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-500">Price</span>
                                <span className="text-white font-mono font-bold">6M / $100</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-500">Allocation</span>
                                <span className="text-white font-mono font-bold">10% (100M)</span>
                            </div>
                            <div className="flex justify-between text-sm pb-2">
                                <span className="text-gray-500">Purpose</span>
                                <span className="text-green-400 font-bold">Initial Manufacturing</span>
                            </div>
                        </div>

                        <button disabled className="block w-full bg-white/5 text-gray-500 font-bold py-3 rounded-lg text-center cursor-not-allowed border border-white/5">
                            Locked
                        </button>
                    </div>

                    {/* Phase 3 */}
                    <div className="bg-[#0a1a0f] border border-white/10 rounded-2xl p-8 relative group hover:-translate-y-2 transition-transform duration-300 opacity-60 hover:opacity-100">
                        <div className="absolute top-0 left-0 w-full h-1 bg-beetle-electric"></div>
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-gray-700 font-black text-4xl group-hover:text-beetle-electric transition-colors">03</span>
                            <span className="bg-white/5 text-gray-500 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Final</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Liquidity & Launch</h3>
                        <p className="text-gray-400 text-sm mb-6 h-10">Global marketing and DEX liquidity injection.</p>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-500">Price</span>
                                <span className="text-white font-mono font-bold">4.5M / $100</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-gray-500">Allocation</span>
                                <span className="text-white font-mono font-bold">15% (150M)</span>
                            </div>
                            <div className="flex justify-between text-sm pb-2">
                                <span className="text-gray-500">Purpose</span>
                                <span className="text-green-400 font-bold">Strategic Scale</span>
                            </div>
                        </div>

                        <button disabled className="block w-full bg-white/5 text-gray-500 font-bold py-3 rounded-lg text-center cursor-not-allowed border border-white/5">
                            Locked
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
