import { motion } from 'framer-motion';
import { MapPin, Sprout, QrCode, ArrowRight, CheckCircle, Tractor, LineChart } from 'lucide-react';

export default function SoilAsAService() {
    return (
        <section className="py-24 bg-[#0a1a0f] relative overflow-hidden border-t border-beetle-gold/10">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-beetle-gold/10 border border-beetle-gold/30 text-beetle-gold text-sm font-bold mb-6">
                        <Sprout size={14} /> The Farmer Pillar
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-6 leading-tight">
                        Soil-as-a-Service: <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-beetle-gold">Proof of Sequestration.</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        In the SCARAB DePIN model, the urban user produces the nutrient value, but the local farmer secures it into the earth.
                        We treat Farmers as <strong className="text-white">"Verified Sink Nodes."</strong>
                    </p>
                </div>

                {/* Handshake Logic Visualization */}
                <div className="bg-black/50 border border-white/10 rounded-3xl p-8 mb-16 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-beetle-gold/5 via-transparent to-green-500/5 pointer-events-none"></div>
                    <div className="grid md:grid-cols-3 gap-8 items-center relative z-10">
                        {/* Urban User */}
                        <div className="text-center group">
                            <div className="w-20 h-20 mx-auto bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                                <QrCode size={32} className="text-green-400" />
                            </div>
                            <h4 className="text-white font-bold mb-2">1. The Drop-off</h4>
                            <p className="text-sm text-gray-400">Urban user brings 15-day fermented Bokashi pre-compost to a verified community hub.</p>
                            <div className="mt-4 text-xs font-mono text-green-400 bg-green-500/10 inline-block px-3 py-1 rounded-full">
                                +15 SCARAB Closure Bonus
                            </div>
                        </div>

                        {/* Handshake */}
                        <div className="hidden md:flex flex-col items-center justify-center">
                            <div className="flex gap-2 text-beetle-gold/50 animate-pulse">
                                <ArrowRight size={24} />
                                <ArrowRight size={24} />
                                <ArrowRight size={24} />
                            </div>
                            <span className="text-xs uppercase tracking-widest text-beetle-gold mt-2 font-bold">Smart Handshake</span>
                        </div>
                        {/* Mobile separator */}
                        <div className="md:hidden flex justify-center text-beetle-gold/50">
                            <ArrowRight size={24} className="rotate-90" />
                        </div>

                        {/* Farmer */}
                        <div className="text-center group">
                            <div className="w-20 h-20 mx-auto bg-beetle-gold/10 border border-beetle-gold/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-beetle-gold/20 transition-colors">
                                <Tractor size={32} className="text-beetle-gold" />
                            </div>
                            <h4 className="text-white font-bold mb-2">2. The Sink</h4>
                            <p className="text-sm text-gray-400">Farmer scans the user's bucket QR code, receiving free high-grade fertilizer.</p>
                            <div className="mt-4 text-xs font-mono text-beetle-gold bg-beetle-gold/10 inline-block px-3 py-1 rounded-full">
                                +10 SCARAB Processing Fee
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-features: Regen-Map and Farmer Dashboard */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Regen-Map */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                            <MapPin size={24} className="text-blue-400" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-3">The "Regen-Map"</h3>
                        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                            For Urban Users. Locate verified farms and community hubs ready to receive pre-compost.
                            Users can view farm profiles (total carbon sequestered) and securely book automated drop-off times.
                        </p>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-center gap-3"><CheckCircle size={14} className="text-green-400" /> Farm Transparency Profiles</li>
                            <li className="flex items-center gap-3"><CheckCircle size={14} className="text-green-400" /> Automated Drop-off Booking</li>
                        </ul>
                    </div>

                    {/* Farmer Dashboard */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                            <LineChart size={24} className="text-purple-400" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-3">Farmer Dashboard</h3>
                        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                            For Local Growers. Track nitrogen/phosphorus influx data. Farmers earn SCARAB to buy
                            discounted Solar Nodes, or use Phase 6 soil sensors to prove fertility for premium crop pricing.
                        </p>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-center gap-3"><CheckCircle size={14} className="text-green-400" /> Nutrient Influx Tracking</li>
                            <li className="flex items-center gap-3"><CheckCircle size={14} className="text-green-400" /> SCARAB Hardware Discounts</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm italic">
                        "Every successful transfer is a Proof of Sequestration. The DAO may route related USDC revenue into the Liquidity Backing Vault,
                        strengthening treasury backing metrics over time subject to governance and legal constraints."
                    </p>
                </div>

            </div>
        </section>
    );
}
