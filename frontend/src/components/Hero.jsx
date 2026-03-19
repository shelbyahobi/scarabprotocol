import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Network, ShieldCheck, PlayCircle } from 'lucide-react';
import ScarabLogo from './ScarabLogo';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-24 bg-black">
            {/* Minimalist Grid Overlay for Hardware Vibe */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] z-0 pointer-events-none" />
            
            {/* Subtle Ambient Studio Lighting */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-zinc-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[0%] w-[600px] h-[600px] bg-beetle-gold/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

            <div className="z-10 container mx-auto px-6 max-w-7xl flex flex-col items-center">
                
                {/* Institutional Eyebrow */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">
                        Protocol Mainnet Live • Version 2.0
                    </span>
                </motion.div>

                {/* Core Typographic Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center w-full max-w-4xl"
                >
                    <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-white mb-6 leading-[1.05]">
                        Ecological Data,
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 font-bold">
                            Cryptographically Proven.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                        The institutional-grade DePIN for the regenerative economy. We deploy physical network infrastructure to map and verify the world's most critical ecological metrics.
                    </p>

                    {/* Primary CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <Link 
                            to="/hardware" 
                            className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
                        >
                            Reserve Hardware <ArrowRight size={18} />
                        </Link>
                        <Link 
                            to="/docs" 
                            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-zinc-700 text-white rounded-full font-medium text-lg hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <PlayCircle size={18} className="text-zinc-400"/> Watch Tech Demo
                        </Link>
                    </div>
                </motion.div>

                {/* Sub-Feature Glass Pane */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                    className="w-full max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-xl p-8 shadow-2xl overflow-hidden relative"
                >
                    {/* Inner subtle glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        
                        <div className="flex flex-col gap-3">
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                                <Cpu size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-white">ATECC608A Integration</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Every device features a dedicated secure element chip, guaranteeing hardware-level elliptic-curve signature validity on all telemetry.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Sybil-Resilient Oracles</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Physical infrastructure cost mechanics combined with cryptographically unique keypairs eliminate standard blockchain oracle manipulation.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                                <Network size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Automated Treasury</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Verifiable fiat off-ramping powers the on-chain Buy & Burn engine. Real hardware revenue autonomously scales total network deflation.
                            </p>
                        </div>

                    </div>
                </motion.div>
                
            </div>
        </section>
    );
}
