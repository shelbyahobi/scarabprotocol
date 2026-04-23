import React from 'react';
import { ArrowRight, Droplet, ScanLine, CreditCard, Activity, Leaf, CheckCircle2, Factory } from 'lucide-react';
import UCORewardCalculator from '../components/UCORewardCalculator';

export default function UCOPage() {
    return (
        <div className="min-h-screen bg-[#050B08] text-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 relative overflow-hidden text-center border-b border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-[#050B08] to-[#050B08] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                    <span className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4 block">Sustainable Drop-off</span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        Your used cooking oil is worth money. <span className="text-amber-400">Drop it off. Get paid.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        We verify the quality on the spot. You receive euros within 24 hours.
                    </p>
                    <a href="/ecosystem" className="bg-amber-500 text-black px-8 py-4 rounded-xl font-black text-lg hover:bg-white transition-all inline-flex items-center gap-2">
                        Find your nearest collection point <ArrowRight size={20} />
                    </a>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 border-b border-white/5 bg-black/40">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-black text-center mb-16">How it works</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center relative">
                            <div className="w-16 h-16 mx-auto bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-4 text-amber-500">
                                <Droplet size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">1. Bring your oil</h3>
                            <p className="text-sm text-gray-400">Any sealed container, minimum 1 litre, maximum 25 litres per visit.</p>
                            <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-amber-500/30 to-transparent"></div>
                        </div>
                        <div className="text-center relative">
                            <div className="w-16 h-16 mx-auto bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-4 text-amber-500">
                                <Activity size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">2. Pour it in</h3>
                            <p className="text-sm text-gray-400">The kiosk measures volume and runs an automatic quality check (10 seconds).</p>
                            <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-amber-500/30 to-transparent"></div>
                        </div>
                        <div className="text-center relative">
                            <div className="w-16 h-16 mx-auto bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-4 text-amber-500">
                                <ScanLine size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">3. Scan your app</h3>
                            <p className="text-sm text-gray-400">Scan your SCARAB QR code or enter your email.</p>
                            <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-amber-500/30 to-transparent"></div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-4 text-amber-500">
                                <CreditCard size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">4. Receive payment</h3>
                            <p className="text-sm text-gray-400">€0.28 per verified litre credited to your IBAN within 24 hours.</p>
                        </div>
                    </div>

                    <UCORewardCalculator />
                </div>
            </section>

            {/* Quality Transparency Panel */}
            <section className="py-24 border-b border-white/5">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-black mb-6">Automated Quality Checks</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Our kiosks use advanced sensor technology to ensure the oil collected meets the standards for biofuel production. This protects the recycling process and guarantees fair payouts.
                            </p>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="mt-1 text-amber-500"><CheckCircle2 size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Colour and clarity check</h4>
                                        <p className="text-sm text-gray-400">We detect water, motor oil, or heavily degraded oil. Clean oil passes immediately.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1 text-amber-500"><CheckCircle2 size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Conductivity check</h4>
                                        <p className="text-sm text-gray-400">Measures water content. Oil with more than 1% water is flagged for re-check.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1 text-amber-500"><CheckCircle2 size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Weight and volume check</h4>
                                        <p className="text-sm text-gray-400">Precise measurement using a calibrated load cell. You see the verified litres on screen before confirming.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative">
                            <div className="absolute -top-4 -right-4 bg-amber-500 text-black font-black px-4 py-2 rounded-xl text-sm transform rotate-3">
                                10 Seconds Flat
                            </div>
                            <img src="https://images.unsplash.com/photo-1590247659560-61019013c415?auto=format&fit=crop&q=80&w=800" alt="Oil quality" className="w-full h-64 object-cover rounded-xl mb-6 opacity-70 mix-blend-luminosity" />
                            <div className="flex justify-between items-center text-sm font-bold border-t border-white/10 pt-4">
                                <span className="text-gray-400">Average processing time</span>
                                <span className="text-amber-400">10.4s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Supply Chain & B2B */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-black border border-white/10 rounded-3xl p-8 md:p-12">
                            <Leaf className="text-green-500 mb-6" size={40} />
                            <h2 className="text-2xl font-black mb-6">What happens to your oil?</h2>
                            <ol className="space-y-4 mb-8">
                                <li className="flex gap-4 items-start">
                                    <span className="bg-white/10 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                                    <p className="text-gray-300">Collected and quality-graded at the kiosk</p>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="bg-white/10 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                                    <p className="text-gray-300">Transported to our regional processing partner (within 50km)</p>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="bg-white/10 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                                    <p className="text-gray-300">Refined into certified biodiesel or SAF feedstock for aviation fuel</p>
                                </li>
                            </ol>
                            <p className="text-sm text-gray-500 italic border-l-2 border-green-500/50 pl-4">
                                Every collection is logged with a tamper-proof digital record — making your oil traceable for ISCC and EU sustainability certification.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-amber-900/40 to-black border border-amber-500/20 rounded-3xl p-8 md:p-12 flex flex-col">
                            <Factory className="text-amber-500 mb-6" size={40} />
                            <h2 className="text-2xl font-black mb-6">Restaurant & Commercial</h2>
                            <p className="text-xl font-bold text-amber-400 mb-6">We collect at scale.</p>
                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex gap-2 text-gray-300"><CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" /> Scheduled collection directly from your premises</li>
                                <li className="flex gap-2 text-gray-300"><CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" /> Volume pricing above 200L/month</li>
                                <li className="flex gap-2 text-gray-300"><CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" /> Automated invoicing and sustainability certificates provided</li>
                            </ul>
                            <a href="mailto:uco@scarabprotocol.org" className="bg-amber-500 text-black text-center py-4 rounded-xl font-bold hover:bg-white transition-all">
                                Contact for commercial collection →
                            </a>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <h3 className="text-lg font-bold mb-6 text-gray-400">Pricing Transparency</h3>
                        <div className="inline-block border border-white/10 rounded-2xl overflow-hidden bg-white/5">
                            <div className="grid grid-cols-3 divide-x divide-white/10 text-sm">
                                <div className="p-4">
                                    <div className="text-gray-500 mb-1">Household (&lt;25L/visit)</div>
                                    <div className="font-bold text-white text-lg">€0.28/L</div>
                                </div>
                                <div className="p-4 bg-white/5">
                                    <div className="text-gray-500 mb-1">Regular User (&gt;50L/month)</div>
                                    <div className="font-bold text-amber-400 text-lg">€0.31/L</div>
                                </div>
                                <div className="p-4">
                                    <div className="text-gray-500 mb-1">Commercial (&gt;200L/month)</div>
                                    <div className="font-bold text-white text-lg">€0.35/L <span className="text-xs text-gray-500 font-normal">+ pickup</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
