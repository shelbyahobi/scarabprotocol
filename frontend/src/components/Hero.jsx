import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, FileText, Shield, Lock, CheckCircle } from 'lucide-react';

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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-300 tracking-wide uppercase">Seed Round Live • Phase 1</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
                        THE CURRENCY OF <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-beetle-gold via-yellow-200 to-beetle-gold animate-gradient-x">
                            PHYSICAL RESILIENCE
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
                        Turning organic waste into energy credits.
                        Backed by the <strong className="text-white">Ecoloop Network</strong> of physical hardware, not just hype.
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

                    {/* Trust Signals (New) */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 opacity-80">
                        <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-lg bg-black/40">
                            <Shield className="text-beetle-green w-4 h-4" />
                            <span className="font-bold text-white text-xs">Audited Contract</span>
                        </div>
                        <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-lg bg-black/40">
                            <CheckCircle className="text-beetle-electric w-4 h-4" />
                            <span className="font-bold text-white text-xs">KYC Verified Team</span>
                        </div>
                        <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-lg bg-black/40">
                            <Lock className="text-beetle-gold w-4 h-4" />
                            <span className="font-bold text-white text-xs">Liquidity Locked 1YR</span>
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
                        alt="BeetleBox Hardware Prototype"
                        className="w-full max-w-lg mx-auto relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float"
                    />
                </motion.div>
            </div>
        </section>
    )
}
