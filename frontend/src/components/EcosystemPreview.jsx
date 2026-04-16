import { motion } from 'framer-motion';

export default function EcosystemPreview() {
    const tiers = [
        { name: "Scarab", amount: "1k", disc: "5%" },
        { name: "Goliath", amount: "5k", disc: "10%" },
        { name: "Titan", amount: "10k", disc: "15%" },
        { name: "King", amount: "50k", disc: "25%" },
    ];

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-beetle-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-beetle-gold font-bold tracking-widest text-sm uppercase"
                    >
                        Phase 2: Use Your Tokens
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white mt-4 mb-6"
                    >
                        Real World <span className="text-transparent bg-clip-text bg-gradient-to-r from-beetle-gold to-yellow-200">Utility</span>
                    </motion.h2>
                    <p className="text-gray-400 text-lg">
                        We are building the first "Discount Flywheel". Hold $SCARAB to automatically unlock massive savings on tech, travel, and dining.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Left: The Vision (Tiers) */}
                    <div className="space-y-8">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-beetle-gold/30 transition-colors">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span>💎</span> VIP Discount Tiers
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {tiers.map((tier, i) => (
                                    <div key={i} className={`p-4 rounded-xl border ${i === 3 ? 'bg-beetle-gold/20 border-beetle-gold text-white' : 'bg-black/40 border-white/5 text-gray-400'}`}>
                                        <div className="text-xs font-bold uppercase mb-1 opacity-70">{tier.name}</div>
                                        <div className="text-xl font-black">{tier.disc} OFF</div>
                                        <div className="text-xs mt-2">Hold {tier.amount} $SCARAB</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Launch Partners (Targeting)</h3>
                            <div className="flex flex-wrap gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                {/* Placeholders for brands */}
                                <div className="h-10 w-24 bg-white/10 rounded flex items-center justify-center font-bold text-xs">TECH</div>
                                <div className="h-10 w-24 bg-white/10 rounded flex items-center justify-center font-bold text-xs">TRAVEL</div>
                                <div className="h-10 w-24 bg-white/10 rounded flex items-center justify-center font-bold text-xs">FASHION</div>
                                <div className="h-10 w-24 bg-white/10 rounded flex items-center justify-center font-bold text-xs">DINING</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: The App Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-beetle-gold to-beetle-green opacity-20 blur-3xl rounded-full"></div>
                        <img
                            src="/app_market_mockup.png"
                            alt="ROLL Marketplace App"
                            className="relative z-10 w-full rounded-3xl shadow-2xl border border-white/10 hover:scale-[1.02] transition-transform duration-500"
                        />

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-black/80 backdrop-blur-md border border-beetle-gold p-4 rounded-2xl shadow-xl z-20">
                            <div className="text-xs text-gray-400 uppercase font-bold">Current Status</div>
                            <div className="text-xl font-bold text-beetle-gold flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                In Development
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
