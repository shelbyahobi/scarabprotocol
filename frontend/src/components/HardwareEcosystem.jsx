import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import { Sun, Sprout, MapPin, Droplets, Wind, Battery, Zap, Factory, Server, ChevronRight, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const CORE_SKUS = [
    {
        icon: <Sun size={32} className="text-beetle-electric" />,
        title: "Solar Sentinel V1",
        metric: "Energy Production",
        desc: "Residential & Commercial PV monitoring. Cryptographically verifies kWh generation via ATECC608A signatures at source.",
        bru: "2,400 BRU/Year",
        color: "group-hover:border-beetle-electric/50",
        market: "Actively Mining"
    },
    {
        icon: <Sprout size={32} className="text-beetle-gold" />,
        title: "Smart Bokashi Kit",
        metric: "Methane Avoidance",
        desc: "Transforms residential kitchen waste into verifiable carbon sequestration using integrated weight and thermodynamic sensors.",
        bru: "650 BRU/Year",
        color: "group-hover:border-beetle-gold/50",
        market: "Actively Mining"
    },
    {
        icon: <MapPin size={32} className="text-purple-400" />,
        title: "Pro Bioreactor",
        metric: "Industrial Soil-as-a-Service",
        desc: "Processes localized urban waste at scale. Forms the end-point of our circular economy cryptographic handshake loop.",
        bru: "8,000 BRU/Year",
        color: "group-hover:border-purple-500/50",
        market: "Actively Mining"
    }
];

const EXPANSION_SKUS = [
    { icon: <Droplets />, title: "AquaSentinel", metric: "Water Conservation" },
    { icon: <Wind />, title: "AirNode", metric: "Urban Air Quality (AQI)" },
    { icon: <Server />, title: "SoilSentinel", metric: "Regenerative Carbon Tracking" },
    { icon: <Battery />, title: "PowerVault Monitor", metric: "Battery Storage Efficiency" },
    { icon: <Zap />, title: "ChargeNode", metric: "Renewable EV Charging" },
    { icon: <Factory />, title: "CarbonVault", metric: "Industrial CO2 Capture" },
];

export default function HardwareEcosystem() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#050A05] text-[#E8E8E8] font-sans selection:bg-beetle-green/30">
            <Navbar isLanding={false} />
            
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10 px-4">
                
                {/* Header Phase */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full border border-beetle-green/20 bg-beetle-green/5 text-beetle-green text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                        Modular DePIN Infrastructure
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        The Universal Standard for <span className="text-transparent bg-clip-text bg-gradient-to-r from-beetle-green to-teal-400">Ecological Output.</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-lg md:text-xl leading-relaxed">
                        SCARAB is not limited to solar or composting. By standardizing ATECC608A cryptographic validation, we construct a 9-SKU planetary monitoring matrix.
                    </motion.p>
                </div>

                {/* Section 1: Core Network */}
                <div className="mb-24">
                    <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Phase 1: Active Infrastructure</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {CORE_SKUS.map((sku, idx) => (
                            <motion.div 
                                key={sku.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`bg-[#0a1a0f]/50 border border-white/10 p-8 rounded-3xl group transition-all duration-300 hover:bg-[#0a1a0f] hover:shadow-2xl hover:-translate-y-1 ${sku.color}`}
                            >
                                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                                    {sku.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{sku.title}</h3>
                                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{sku.metric}</div>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 h-20">
                                    {sku.desc}
                                </p>
                                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                    <div className="text-sm font-mono text-white">{sku.bru}</div>
                                    <div className="text-[10px] font-black uppercase text-beetle-green flex items-center gap-1.5 bg-beetle-green/10 px-2.5 py-1 rounded-full border border-beetle-green/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-beetle-green animate-pulse"></div>
                                        {sku.market}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Section 2: Universal Standard Framework */}
                <div className="bg-gradient-to-br from-[#0A1A0F] to-black border border-beetle-green/20 rounded-3xl p-10 md:p-16 mb-24 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                     <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-beetle-green/5 rounded-full blur-[100px] pointer-events-none"></div>
                     <div className="md:w-1/2 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-6">The Zero-Trust Firmware Lock</h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Every SCARAB device, regardless of form factor, relies on an air-gapped cryptographic foundation. We provision <strong>ATECC608A Secure Elements</strong> at the factory level, ensuring private keys never touch the internet.
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-8">
                            This creates an irreversible ECDSA standard. A Solar Panel and a Bioreactor communicate in the exact same mathematical language on our network.
                        </p>
                        <Link to="/docs/architecture" className="inline-flex items-center bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors gap-2">
                            Read Security Architecture <ChevronRight size={18} />
                        </Link>
                     </div>
                     <div className="md:w-1/2 w-full grid grid-cols-2 gap-4 relative z-10">
                         <div className="bg-black/50 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
                            <Cpu className="text-beetle-electric mb-3" size={28} />
                            <div className="font-bold text-white text-sm mb-1">Hardware Layer</div>
                            <div className="text-xs text-gray-500">Unextractable Silicon Keys</div>
                         </div>
                         <div className="bg-black/50 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center mt-8">
                            <Zap className="text-beetle-gold mb-3" size={28} />
                            <div className="font-bold text-white text-sm mb-1">Logic Layer</div>
                            <div className="text-xs text-gray-500">DePIN SQS Fan-out Layer</div>
                         </div>
                     </div>
                </div>

                {/* Section 3: Modular Future (Phase 2) */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Phase 2: Ecosystem Expansion</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl">Because the underlying cryptographic verification model is standardized, SCARAB can seamlessly absorb new DePIN vectors without protocol redesign.</p>
                    
                    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {EXPANSION_SKUS.map((sku, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + (idx * 0.05) }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center opacity-70 hover:opacity-100 hover:border-gray-500 transition-all filter grayscale hover:grayscale-0"
                            >
                                <div className="text-gray-400 mb-4 flex justify-center">{sku.icon}</div>
                                <h4 className="text-white font-bold text-sm mb-1">{sku.title}</h4>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">{sku.metric}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}
