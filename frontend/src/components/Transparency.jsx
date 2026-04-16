import { motion } from 'framer-motion';
import { Shield, Lock, Clock, Cpu, TrendingUp, Vault } from 'lucide-react';

const pillars = [
    {
        icon: Clock,
        color: 'text-beetle-gold',
        bg: 'bg-beetle-gold/10',
        border: 'hover:border-beetle-gold/30',
        title: 'Timelocked Governance',
        description: 'Administrative actions are delayed by on-chain timelocks. Review the deployed contracts for exact delay values before each network claim.',
    },
    {
        icon: Cpu,
        color: 'text-beetle-electric',
        bg: 'bg-beetle-electric/10',
        border: 'hover:border-beetle-electric/30',
        title: 'Hardware Attestation',
        description: 'Every SCARAB node carries an ATECC608A secure element. Factory-signed certificates prove the device is genuine — no Sybil attacks.',
    },
    {
        icon: Shield,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'hover:border-green-500/30',
        title: 'Confidence Scoring',
        description: 'Production reports are scored against weather API data. Lower-confidence submissions are escrowed per protocol parameters instead of immediate rejection.',
    },
    {
        icon: Vault,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'hover:border-yellow-500/30',
        title: 'USDC Treasury Backing',
        description: '$50 from each $349 node sale is earmarked to the treasury vault. Backing metric = USDC reserve ÷ circulating supply (non-guaranteed).',
    },
    {
        icon: TrendingUp,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'hover:border-purple-500/30',
        title: 'TWAP Buyback',
        description: 'If governance enables buyback logic, execution follows configured TWAP safeguards and timelock controls.',
    },
    {
        icon: Lock,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'hover:border-red-500/30',
        title: 'Pull‑Based Rewards',
        description: 'Rewards accumulate in a ledger — no gas-expensive push minting. Users claim weekly in one transaction. 99.86% gas reduction at scale.',
    },
];

export default function Transparency() {
    return (
        <section className="py-24 bg-black/40 border-t border-white/5 relative overflow-hidden">

            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-beetle-gold/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">

                <div className="text-center mb-16">
                    <span className="text-xs font-mono tracking-widest text-beetle-gold uppercase mb-4 block">Security Architecture</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                        Industrial‑Grade <span className="text-beetle-gold">Trust Layers</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        SCARAB is not a meme coin with a roadmap. It is a DePIN infrastructure protocol hardened
                        by cryptographic guarantees at every layer — physical, economic, and governance.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {pillars.map((pillar, i) => (
                        <motion.div
                            key={pillar.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.07 }}
                            className={`bg-[#0a1a0f]/40 border border-white/5 p-8 rounded-3xl transition-all group ${pillar.border}`}
                        >
                            <div className={`w-14 h-14 ${pillar.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <pillar.icon size={28} className={pillar.color} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">{pillar.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Anti-Ponzi comparison table */}
                <div className="max-w-3xl mx-auto bg-[#0a1a0f]/60 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-center text-white font-bold text-lg mb-6">The Anti‑Ponzi Framework</h3>
                    <div className="grid grid-cols-2 gap-0 text-sm">
                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-tl-2xl">
                            <p className="text-red-400 font-bold mb-3 text-xs uppercase tracking-widest">Old Way (Speculative)</p>
                            <ul className="space-y-2 text-gray-500">
                                <li>Price based on new buyers entering</li>
                                <li>Treasury is 100% native tokens</li>
                                <li>No real revenue stream</li>
                                <li>Vibes‑based valuation</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-beetle-gold/5 border border-beetle-gold/20 rounded-tr-2xl">
                            <p className="text-beetle-gold font-bold mb-3 text-xs uppercase tracking-widest">SCARAB Way (RealFi)</p>
                            <ul className="space-y-2 text-gray-300">
                                <li>Price backed by hardware margin</li>
                                <li>Treasury: USDC + buyback mechanism</li>
                                <li>Revenue from hardware node sales</li>
                                <li>Treasury-backed accounting metric</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
