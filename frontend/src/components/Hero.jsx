import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-24 bg-black">
            {/* Minimalist Grid Overlay for Hardware Vibe */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] z-0 pointer-events-none" />
            
            {/* Subtle Ambient Studio Lighting */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-zinc-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[0%] w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

            <div className="z-10 container mx-auto px-6 max-w-5xl flex flex-col items-center">
                
                {/* Core Typographic Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center w-full"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-2 leading-[1.05]">
                        Verified ecological output.
                    </h1>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-emerald-500 mb-8 leading-[1.05]">
                        For every stakeholder in the circular economy.
                    </h2>
                    
                    <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
                        SCARAB hardware-attests energy production, biological waste, food safety compliance, biodiversity, and feedstock provenance — creating verified data that municipalities, corporations, and carbon registries actually pay for.
                    </p>

                    {/* Trust Signals */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-zinc-300 font-bold mb-12 uppercase tracking-widest">
                        <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                            ⬡ Stuttgart Pilot — Q4 2026
                        </span>
                        <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                            🔐 ATECC608A Hardware-Attested
                        </span>
                        <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                            🇩🇪 EU Data Residency — Hetzner Frankfurt
                        </span>
                    </div>

                    {/* Primary CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto">
                        <a 
                            href="#how-it-works"
                            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white rounded-xl font-bold text-base hover:bg-white/5 transition-colors text-center"
                        >
                            How it works ↓
                        </a>
                        <Link 
                            to="/municipalities#apply" 
                            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-base hover:bg-emerald-500 transition-colors text-center"
                        >
                            Apply for Pilot →
                        </Link>
                    </div>
                </motion.div>
                
            </div>
        </section>
    );
}
