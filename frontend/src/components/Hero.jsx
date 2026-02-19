import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, FileText, Shield, Lock, CheckCircle, Zap, DollarSign } from 'lucide-react';

export default function Hero({ onOpenBlueprint }) {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-beetle-green/20 via-black to-black z-0"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay"></div>

            {/* Dynamic Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-beetle-green/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-beetle-electric/10 rounded-full blur-[100px] mix-blend-screen"></div>
            </div>

            <div className="z-10 container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 text-center md:text-left"
                >
                    {/* Eyebrow */}
                    <div className="mb-6 flex items-center justify-center md:justify-start gap-2">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-beetle-gold" />
                        <span className="text-xs uppercase tracking-[0.3em] text-beetle-gold/80">
                            Ancient Symbol • Modern Protocol
                        </span>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-beetle-gold" />
                    </div>

                    {/* Main headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-beetle-gold via-yellow-200 to-beetle-gold">
                            SCARAB
                        </span>
                        <span className="block text-white/90 text-4xl md:text-6xl font-light mt-2">
                            Regeneration Reimagined
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                        The ancient scarab beetle transformed waste into sustenance.
                        Today, SCARAB transforms digital assets into physical infrastructure.
                        <span className="block mt-3 text-white font-semibold">
                            Real hardware. Community governed. Built to endure.
                        </span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12">
                        <Link to="/app" className="group bg-beetle-gold text-black px-8 py-4 rounded-xl font-black text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2">
                            <Rocket className="group-hover:translate-x-1 transition-transform" />
                            JOIN SEED SALE
                        </Link>
                        <button
                            onClick={onOpenBlueprint}
                            className="bg-black/40 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:border-beetle-gold/50 hover:text-beetle-gold transition-all flex items-center justify-center gap-2"
                        >
                            <FileText size={18} />
                            Read Blueprint
                        </button>
                    </div>

                    {/* Layer 1: Transparency Visual (PoPA) */}
                    <div className="mt-10 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 text-center md:text-left">
                            Proof of Productive Asset (PoPA)
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-mono text-gray-300">

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-beetle-gold/20 flex items-center justify-center text-beetle-gold">
                                    <DollarSign size={14} />
                                </div>
                                <span className="opacity-80">Capital</span>
                            </div>

                            <div className="h-4 w-px md:w-8 md:h-px bg-white/20"></div>

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-beetle-electric/20 flex items-center justify-center text-beetle-electric">
                                    <Zap size={14} />
                                </div>
                                <span className="opacity-80">Hardware</span>
                            </div>

                            <div className="h-4 w-px md:w-8 md:h-px bg-white/20"></div>

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-beetle-green/20 flex items-center justify-center text-beetle-green">
                                    <Shield size={14} />
                                </div>
                                <span className="opacity-80">Verified Output</span>
                            </div>

                            <div className="h-4 w-px md:w-8 md:h-px bg-white/20"></div>

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 border border-amber-500/50">
                                    <Rocket size={14} />
                                </div>
                                <span className="text-white font-bold">Token Reward</span>
                            </div>

                        </div>
                    </div>
                </motion.div>

                {/* 3D Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex-1 relative hidden md:block"
                >
                    {/* Glowing Backdrops */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-beetle-gold/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-beetle-electric/10 rounded-full blur-[80px]"></div>

                    <img
                        src="/hero.png"
                        alt="Scarab Node Prototype"
                        className="w-full max-w-lg mx-auto relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float"
                    />
                </motion.div>
            </div>
        </section >
    )
}
