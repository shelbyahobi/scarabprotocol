import { motion } from 'framer-motion';

export default function Hero({ onOpenBlueprint }) {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-beetle-green/20 via-black to-black z-0"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay"></div>

            <div className="z-10 container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 text-center md:text-left"
                >
                    <div className="inline-block mb-4 px-4 py-1 rounded-full border border-beetle-electric/30 bg-beetle-electric/5 text-beetle-electric font-mono text-xs tracking-widest uppercase">
                        Web3 Solar & Survival Ecosystem
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                        The Digital Hedge <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-beetle-gold via-yellow-200 to-beetle-gold animate-gradient-x">
                            For Physical Independence.
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                        Bridge the gap between meme culture and off-grid resilience.
                        A gated utility protocol for the new world.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button className="bg-beetle-electric text-black font-black py-4 px-8 rounded-xl hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2">
                            BUY $ROLL
                        </button>
                        <button
                            onClick={() => document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-black/40 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:border-beetle-gold/50 hover:text-beetle-gold transition-all flex items-center gap-2"
                        >
                            Enter Colony
                        </button>
                    </div>

                    <div className="mt-12 flex items-center gap-6 justify-center md:justify-start text-xs text-gray-500 font-mono">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-beetle-gold rounded-full"></div> 100% Liquidity Locked
                        </span>
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-beetle-electric rounded-full"></div> Audited Contract
                        </span>
                    </div>
                </motion.div>

                {/* 3D Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex-1 relative"
                >
                    {/* Glowing Backdrops */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-beetle-gold/20 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-beetle-electric/10 rounded-full blur-[80px]"></div>

                    <img
                        src="/hero.png" // User should ensure this is the 3D beetle transparent PNG
                        alt="Dung Beetle Rolling Gold"
                        className="w-full max-w-lg mx-auto relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float"
                    />
                </motion.div>
            </div>
        </section>
    )
}
