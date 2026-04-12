import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import { BookOpen, Factory, ArrowRightLeft, Database, ShieldCheck, Microscope, GraduationCap, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AcademicResearch() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#050A05] text-[#E8E8E8] font-sans selection:bg-beetle-green/30">
            <Navbar isLanding={false} />
            
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10 px-4">
                
                {/* Header Phase */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        Enterprise & Academic Rigor
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        Validating the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Bioeconomy.</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-lg md:text-xl leading-relaxed">
                        SCARAB is built on verifiable science. We collaborate with leading research institutions to enforce cryptographic traceability across industrial biorefineries and agrivoltaic networks.
                    </motion.p>
                </div>

                {/* Section 1: The Circular Economy Handshake */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-white mb-3 text-center">SaaS 2.0: Soil-as-a-Service</h2>
                    <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Connecting urban consumers with institutional regenerative farming through mathematics.</p>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-beetle-gold via-beetle-green to-purple-500 -z-10 -translate-y-1/2 opacity-30"></div>

                        {/* Node 1: Citizen */}
                        <div className="bg-[#050A05] border border-beetle-gold/30 p-8 rounded-3xl text-center w-full md:w-1/3 relative z-10 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
                            <div className="w-16 h-16 bg-beetle-gold/10 text-beetle-gold rounded-full flex items-center justify-center mx-auto mb-4 border border-beetle-gold/20">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Urban Consumers</h3>
                            <p className="text-sm text-gray-400">Citizens process organic waste using the Smart Bokashi Kit. Telemetry verifies the anaerobic fermentation.</p>
                        </div>

                        {/* Node 2: The Handshake */}
                        <div className="bg-[#0A1A0F] border border-beetle-green/50 p-6 rounded-2xl text-center w-full md:w-1/4 relative z-10 scale-105 shadow-[0_0_40px_rgba(74,222,128,0.1)]">
                            <div className="text-beetle-green mb-3 flex justify-center animate-bounce"><ArrowRightLeft size={32} /></div>
                            <h3 className="font-black text-white text-lg mb-1">Cryptographic Handshake</h3>
                            <p className="text-xs text-gray-400">QR Code validation logs physical transfer. Both parties instantly minted bonus BRU tokens.</p>
                        </div>

                        {/* Node 3: Farmer */}
                        <div className="bg-[#050A05] border border-purple-500/30 p-8 rounded-3xl text-center w-full md:w-1/3 relative z-10 shadow-[0_0_30px_rgba(168,85,247,0.05)]">
                            <div className="w-16 h-16 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                                <Factory size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Industrial Farming</h3>
                            <p className="text-sm text-gray-400">Farmers ingest urban biomass into Pro Bioreactors, converting it to high-value industrial soil amendment.</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: University Collaborations */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-blue-500/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                                <Microscope size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Biorefinery Tracing</h3>
                        </div>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex gap-3">
                                <Link2 className="text-blue-400 shrink-0 mt-1" size={18} />
                                <span><strong>Lignin Valorization:</strong> IoT sensors tracking material flows from source to phenol for ESG compliance.</span>
                            </li>
                            <li className="flex gap-3">
                                <Link2 className="text-blue-400 shrink-0 mt-1" size={18} />
                                <span><strong>Feedstock Tracing:</strong> Cryptographic verification of chicory root / Miscanthus supply chains.</span>
                            </li>
                            <li className="flex gap-3">
                                <Link2 className="text-blue-400 shrink-0 mt-1" size={18} />
                                <span><strong>Modular Processing:</strong> Distributed refineries leveraging SCARAB endpoints to automatically report throughput to researchers.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-teal-500/30 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400 border border-teal-500/20">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Agrivoltaics Research</h3>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Through comprehensive thesis studies, we continuously evaluate the behavioral economics of DePIN adoption among solar farmers vs. traditional REC markets.
                        </p>
                        <div className="bg-black/50 border border-white/5 p-5 rounded-xl">
                            <div className="text-xs text-teal-400 font-bold uppercase mb-2">Core Research Questions</div>
                            <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                                <li>Does cryptographically verified data demand a premium?</li>
                                <li>Willingness-to-pay for hardware-enforced energy monitoring?</li>
                                <li>Regulatory routing for agrivoltaic token incentives?</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                {/* Footer Callout */}
                <div className="text-center pb-12">
                     <Link to="/docs/carbon-methodology" className="inline-flex items-center bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors gap-2 border border-white/10">
                         Read the Carbon Methodology <Database size={18} />
                     </Link>
                </div>

            </main>
        </div>
    );
}
