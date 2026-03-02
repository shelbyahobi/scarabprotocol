import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const phases = [
    {
        title: "Q1 2026: Emergence",
        subtitle: "Phase 1 & Prototype",
        status: "current",
        items: [
            "Smart Contract Deployment (BSC Mainnet)",
            "SCARAB Branding & Domain Live",
            "Pre-Seed Round: $600K MVP target",
            "Working Prototype Video Demonstration"
        ],
        kpis: [
            { label: "Target Raise", value: "$600K", color: "text-beetle-gold" },
            { label: "Community", value: "1,000+", color: "text-white" },
            { label: "Prototype Units", value: "100", color: "text-beetle-green" }
        ]
    },
    {
        title: "Q2 2026: First Light",
        subtitle: "Manufacturing",
        status: "upcoming",
        items: [
            "Seed Round: Manufacturing Allocation",
            "Validator Network: 50+ nodes operational",
            "Manufacturing: 1,000 SCARAB Nodes",
            "Wyoming DAO LLC Formation"
        ],
        kpis: [
            { label: "Cumulative Raise", value: "$1.4M", color: "text-beetle-gold" },
            { label: "Devices Produced", value: "1,000", color: "text-white" },
            { label: "Partnerships", value: "3-5 signed", color: "text-beetle-green" }
        ]
    },
    {
        title: "Q3 2026: The Colony",
        subtitle: "Launch & Utility",
        status: "upcoming",
        items: [
            "Strategic / Public Round Finalization",
            "CoinGecko & CoinMarketCap Verified",
            "SCARAB Marketplace v1.0 Launch",
            "First 100 Devices Deployed (Pilot)"
        ],
        kpis: [
            { label: "Total Raised", value: "$2M+", color: "text-beetle-gold" },
            { label: "Active Devices", value: "100+", color: "text-white" },
            { label: "Locked Liquidity", value: "Strategic", color: "text-beetle-green" }
        ]
    },
    {
        title: "Q4 2026: Regeneration",
        subtitle: "Expansion",
        status: "upcoming",
        items: [
            "Compliance-First Exchange Expansion",
            "2,500+ Active SCARAB Nodes Deployed",
            "Hardware v2.0 R&D (Miniaturization)",
            "ESG Fund & Carbon Credit Partnerships"
        ],
        kpis: [
            { label: "Active Devices", value: "2,500+", color: "text-beetle-gold" },
            { label: "Exchange Strategy", value: "Tier 1", color: "text-white" },
            { label: "B2B Pilots", value: "3+", color: "text-beetle-green" }
        ]
    },
    {
        title: "2027+: Network State",
        subtitle: "Global Scale",
        status: "upcoming",
        items: [
            "50,000+ Devices Across 50+ Countries",
            "Carbon Credit Marketplace Integration",
            "Multi-Chain Expansion (Polygon, Arbitrum)",
            "Community Land Acquisitions (Resilience Hubs)"
        ],
        kpis: [
            { label: "Global Devices", value: "50K+", color: "text-beetle-gold" },
            { label: "Countries", value: "50+", color: "text-white" },
            { label: "Network Value", value: "Maturing", color: "text-beetle-green" }
        ]
    }
];

export default function Roadmap() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Line */}
            <div className="absolute left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-beetle-gold/30 to-transparent hidden md:block"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-white mb-4">The <span className="text-beetle-gold">Master Plan</span></h2>
                    <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Patient. Persistent. Purposeful.
                        <span className="block mt-2 text-white">
                            Like the scarab rolling toward the sunrise — this is how regeneration unfolds.
                        </span>
                    </p>
                </div>

                <div className="space-y-12 md:space-y-0 relative">
                    {phases.map((phase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className={`flex flex-col md:flex-row items-center justify-between gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Content Side */}
                            <div className="w-full md:w-5/12">
                                <div className={`p-8 rounded-2xl border ${phase.status === 'current' ? 'bg-beetle-gold/10 border-beetle-gold' : 'bg-[#111] border-white/10'} hover:border-beetle-gold/50 transition-all`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className={`text-2xl font-bold ${phase.status === 'current' ? 'text-beetle-gold' : 'text-white'}`}>{phase.title}</h3>
                                        {phase.status === 'current' && (
                                            <span className="px-3 py-1 bg-beetle-gold text-black text-xs font-black rounded-full animate-pulse">
                                                ACTIVE
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 font-mono mb-6 uppercase tracking-widest">{phase.subtitle}</p>

                                    <ul className="space-y-3 mb-6">
                                        {phase.items.map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                                                <span className={`w-2 h-2 rounded-full shrink-0 ${phase.status === 'current' ? 'bg-beetle-gold' : 'bg-gray-600'
                                                    }`}></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* NEW: KPI Section */}
                                    {phase.kpis && (
                                        <div className="pt-4 border-t border-white/10">
                                            <div className="flex flex-wrap gap-2">
                                                {phase.kpis.map((kpi, i) => (
                                                    <div key={i} className="flex-1 min-w-[80px] bg-black/40 rounded-lg p-2 border border-white/5">
                                                        <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">
                                                            {kpi.label}
                                                        </div>
                                                        <div className={`text-sm font-mono font-bold ${kpi.color}`}>
                                                            {kpi.value}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Center Marker */}
                            <div className="md:w-2/12 flex justify-center relative">
                                <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center relative z-10 ${phase.status === 'current' ? 'border-beetle-gold bg-black' : 'border-gray-700 bg-[#111]'}`}>
                                    <div className={`w-3 h-3 rounded-full ${phase.status === 'current' ? 'bg-beetle-gold' : 'bg-gray-700'}`}></div>
                                </div>
                            </div>

                            {/* Spacer Side */}
                            <div className="w-full md:w-5/12"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Timeline Disclaimer */}
                <div className="mt-20 text-center">
                    <div className="inline-block max-w-3xl bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
                        <div className="flex items-start gap-3 text-left">
                            <AlertTriangle className="text-amber-400 w-5 h-5 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="text-white font-bold text-sm mb-2">Timeline Disclaimer</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Roadmap estimates assume hard cap achievement in each phase. Actual deployment
                                    timelines may vary based on manufacturing capacity, regulatory requirements,
                                    partnership negotiations, and technical validation. Hardware development carries
                                    inherent risk. All dates are best-effort projections, not guarantees.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
