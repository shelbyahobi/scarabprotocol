import { Sun, Recycle, CheckCircle, Leaf, Zap, BarChart3 } from 'lucide-react';

export default function PhysicalUtility() {
    return (
        <section className="py-24 bg-gradient-to-b from-black via-[#0a1a0f] to-black relative overflow-hidden">
            {/* Grid Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <div className="text-center mb-16">
                    <span className="text-beetle-green font-bold uppercase tracking-[0.2em] text-sm">The Ecosystem</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-6 leading-tight">
                        The Regenerative Platform. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-beetle-green to-beetle-gold">Two Pillars of Utility.</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        SCARAB isn't just a point solution for solar — it's the universal incentive layer for regenerative infrastructure.
                        Every regenerative action on Earth should be measurable, verifiable, and economically rewarded.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Solar Node */}
                    <div className="bg-black/40 border border-beetle-electric/30 rounded-3xl p-8 relative overflow-hidden group hover:bg-black/60 transition-colors">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-beetle-electric/5 rounded-full blur-[100px]"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-beetle-electric/10 rounded-2xl flex items-center justify-center text-beetle-electric shadow-[0_0_30px_rgba(0,240,255,0.15)]">
                                <Sun size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white">Solar Node</h3>
                                <p className="text-beetle-electric font-bold tracking-widest text-sm">ENERGY PRODUCTION</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <span className="text-gray-400">Target</span>
                                <span className="text-white font-bold">Homeowners</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <span className="text-gray-400">Price Point</span>
                                <span className="text-white font-bold text-xl">$349</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <span className="text-gray-400">Est. Protocol Rewards*</span>
                                <span className="text-beetle-electric font-mono font-bold">~2,920 SCARAB/yr <span className="text-xs text-gray-500 font-normal">(1.0x Base)</span></span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">TAM</span>
                                <span className="text-white font-bold">30 Million</span>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-5 mb-6">
                            <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Zap size={16} className="text-beetle-electric" /> Verifiable Metrics</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-400 mt-1 shrink-0" /> DC Voltage & Current (INA226)</li>
                                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-400 mt-1 shrink-0" /> Local 2.0 kW anti-cheat capacity breaker</li>
                                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-400 mt-1 shrink-0" /> P-256 ATECC608A cryptographic signature</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bokashi Node */}
                    <div className="bg-black/40 border border-beetle-gold/30 rounded-3xl p-8 relative overflow-hidden group hover:bg-black/60 transition-colors">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-beetle-gold/5 rounded-full blur-[100px]"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-beetle-gold/10 rounded-2xl flex items-center justify-center text-beetle-gold shadow-[0_0_30px_rgba(255,200,0,0.1)]">
                                <Recycle size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white">Smart Bokashi</h3>
                                <p className="text-beetle-gold font-bold tracking-widest text-sm">WASTE TRANSFORMATION</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <span className="text-gray-400">Target</span>
                                <span className="text-white font-bold">Everyone (Apartments welcome)</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <span className="text-gray-400">Price Point</span>
                                <span className="text-white font-bold text-xl">€265 <span className="text-xs font-normal text-gray-500">+ €12/mo sub</span></span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <span className="text-gray-400">Est. Protocol Rewards*</span>
                                <span className="text-beetle-gold font-mono font-bold">~1,200 SCARAB/yr</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">TAM</span>
                                <span className="text-white font-bold">2+ Billion</span>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-5 mb-6">
                            <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Leaf size={16} className="text-beetle-gold" /> Verifiable Metrics</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-400 mt-1 shrink-0" /> Temperature profiling (35-42°C ideal)</li>
                                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-400 mt-1 shrink-0" /> Fermentation Gas Production (800+ ppm)</li>
                                <li className="flex items-start gap-2"><CheckCircle size={14} className="text-green-400 mt-1 shrink-0" /> Optional: "Soil-as-a-Service" drop-off verification</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-gray-500 text-sm">
                        *Illustrative only. Rewards are variable and depend on protocol parameters, validation outcomes, and governance decisions.
                    </p>
                </div>
            </div>
        </section>
    );
}
