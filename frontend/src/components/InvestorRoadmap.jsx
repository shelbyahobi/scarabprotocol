import { motion } from 'framer-motion';
import { Zap, Users, Globe, Database, ArrowRight, TrendingUp, BarChart3, CheckCircle, Leaf, DollarSign, Recycle } from 'lucide-react';

// ─── 4-Phase Growth Roadmap ────────────────────────────────────────────────
const phases = [
    {
        phase: 'Genesis',
        months: 'Months 1–3',
        nodes: '100',
        focus: 'Beta testing in 2 high-sun cities (Phoenix, Dubai) + 250 Bokashi Kits',
        treasury: '$5,000',
        treasuryRaw: 5000,
        milestone: '$1M Treasury: 0.5%',
        color: 'border-gray-600',
        badge: 'bg-gray-700 text-gray-300',
        icon: Zap,
        iconColor: 'text-gray-400',
    },
    {
        phase: 'Seed Alpha',
        months: 'Months 4–6',
        nodes: '1,000',
        focus: 'Community mint · Regional clustering · 5–10km dense grids',
        treasury: '$50,000',
        treasuryRaw: 50000,
        milestone: '$1M Treasury: 5%',
        color: 'border-beetle-electric/40',
        badge: 'bg-beetle-electric/20 text-beetle-electric',
        icon: Users,
        iconColor: 'text-beetle-electric',
    },
    {
        phase: 'Beta Scale',
        months: 'Months 7–9',
        nodes: '5,000',
        focus: 'Strategic channel partners · Global city expansion',
        treasury: '$250,000',
        treasuryRaw: 250000,
        milestone: '$1M Treasury: 25%',
        color: 'border-beetle-gold/40',
        badge: 'bg-beetle-gold/20 text-beetle-gold',
        icon: Globe,
        iconColor: 'text-beetle-gold',
    },
    {
        phase: 'Utility Lock',
        months: 'Months 10–12',
        nodes: '20,000',
        focus: '$1M LBV milestone · Data API sales begin · Energy trader subscriptions',
        treasury: '$1,000,000',
        treasuryRaw: 1000000,
        milestone: '🎯 $1M TARGET HIT',
        color: 'border-green-500/40',
        badge: 'bg-green-500/20 text-green-400',
        icon: CheckCircle,
        iconColor: 'text-green-400',
    },
];

// ─── Year 2 Data Revenue Tiers ─────────────────────────────────────────────
const dataProductTiers = [
    {
        tier: 'Level 1',
        name: 'Historical Archive',
        price: '$200/mo',
        desc: '12-month irradiance dataset per city cluster. Energy traders use for backtesting models.',
        burn: '~4,000 SCARAB/mo burned',
        color: 'border-gray-600',
        label: 'bg-gray-700 text-gray-300',
    },
    {
        tier: 'Level 2',
        name: 'Real-Time Nowcast',
        price: '$800/mo',
        desc: 'Live 15-min solar production data from dense node clusters. Reduces energy imbalance cost by up to 27%.',
        burn: '~16,000 SCARAB/mo burned',
        color: 'border-beetle-gold/40',
        label: 'bg-beetle-gold/20 text-beetle-gold',
    },
    {
        tier: 'Level 3',
        name: 'Forecasting API',
        price: '$2,500/mo',
        desc: '48-hr ahead generation forecast. Institutional-grade. Paid in SCARAB — tokens are burned on receipt.',
        burn: '~50,000 SCARAB/mo burned',
        color: 'border-green-500/40',
        label: 'bg-green-500/20 text-green-400',
    },
];

// ─── Risk Matrix ───────────────────────────────────────────────────────────
const risks = [
    {
        risk: 'Market Volatility',
        comms: '"The LBV provides a soft floor, not a peg."',
        mit: '80% of vault in stables/RWAs — insulated from crypto-corr crashes.',
        color: 'text-yellow-400',
    },
    {
        risk: 'Hardware Spoofing',
        comms: '"Our PoPA includes geospatial + weather cross-checks."',
        mit: 'Slashed rewards re-enter the LBV — bad actors raise the floor for honest users.',
        color: 'text-red-400',
    },
    {
        risk: 'Regulatory Change',
        comms: '"We are a utility protocol measuring real physics."',
        mit: 'No profit-sharing language. Focus on Production Credits, data API revenue.',
        color: 'text-purple-400',
    },
    {
        risk: 'Market Education',
        comms: '"We sell a Smart Compost Kit. They earn crypto from food scraps."',
        mit: 'Bokashi is unfamiliar. Bundling the bucket + bran + node into one kit simplifies onboarding.',
        color: 'text-orange-400',
    },
];

export default function InvestorRoadmap() {
    const targetTreasury = 1_000_000;

    return (
        <section className="py-24 bg-[#050a05] border-t border-white/5 relative overflow-hidden">

            {/* Background */}
            <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-beetle-gold/3 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">

                {/* Header */}
                <div className="text-center mb-20">
                    <span className="text-xs font-mono tracking-widest text-beetle-gold uppercase mb-4 block">Year 1 Execution Plan</span>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        The $1M <span className="text-beetle-gold">Treasury Milestone</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        A density-first rollout strategy targeting 5–10km node clusters — the minimum spatial resolution
                        required to generate commercially-viable solar forecasting data.
                    </p>
                </div>

                {/* ── Phase Roadmap ── */}
                <div className="mb-24">
                    <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                        <BarChart3 className="text-beetle-gold" /> Growth Roadmap
                    </h2>

                    {/* Timeline cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {phases.map((p, i) => (
                            <motion.div
                                key={p.phase}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`bg-black/40 border ${p.color} rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/5 transition-all`}
                            >
                                <div className="flex items-start justify-between">
                                    <p.icon size={22} className={p.iconColor} />
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${p.badge}`}>
                                        {p.months}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-white font-black text-lg">{p.phase}</div>
                                    <div className="text-4xl font-black font-mono text-beetle-gold mt-1">{p.nodes}</div>
                                    <div className="text-gray-500 text-[10px] mt-0.5">target nodes</div>
                                </div>
                                <p className="text-gray-400 text-xs leading-relaxed">{p.focus}</p>
                                <div className="mt-auto border-t border-white/5 pt-4">
                                    <div className="text-white font-mono font-bold">{p.treasury}</div>
                                    <div className="text-gray-600 text-[10px]">LBV target</div>
                                    <div className={`text-[10px] font-bold mt-1 ${p.milestone.includes('🎯') ? 'text-green-400' : 'text-gray-600'}`}>
                                        {p.milestone}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress bar toward $1M */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-3 text-sm">
                            <span className="text-gray-400 font-bold">Treasury Progress toward $1M Milestone</span>
                            <span className="text-beetle-gold font-mono font-bold">$0 / $1,000,000</span>
                        </div>
                        <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-beetle-gold to-green-400"
                                initial={{ width: 0 }}
                                whileInView={{ width: '0.5%' }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-600 mt-2">
                            <span>Genesis: $5K</span>
                            <span>Seed: $50K</span>
                            <span>Beta: $250K</span>
                            <span className="text-green-500 font-bold">🎯 Utility Lock: $1M</span>
                        </div>
                    </div>
                </div>

                {/* ── RWA Yield Formula ── */}
                <div className="mb-24 bg-gradient-to-br from-beetle-gold/10 to-transparent border border-beetle-gold/20 rounded-3xl p-10">
                    <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                        <TrendingUp className="text-beetle-gold" /> Floor Price: The RWA-Enhanced Formula
                    </h2>
                    <p className="text-gray-400 mb-8">
                        SCARAB's treasury doesn't just sit idle. 80% is parked in tokenised T-bills generating ~5% APY.
                        This means the floor price <strong className="text-white">grows continuously</strong> — even with zero new node sales.
                    </p>

                    {/* Formula display */}
                    <div className="bg-black/60 rounded-2xl p-8 text-center font-mono mb-8 border border-white/10">
                        <div className="text-2xl md:text-3xl font-black">
                            <span className="text-beetle-gold">P</span>
                            <span className="text-beetle-gold/60 text-lg align-sub">floor</span>
                            <span className="text-white mx-4">=</span>
                            <span>
                                <span className="text-green-400">V</span>
                                <span className="text-green-400/60 text-lg align-sub">USDC</span>
                                <span className="text-gray-500 mx-3">×</span>
                                <span className="text-yellow-300">(1 + y)</span>
                                <span className="text-yellow-300/60 text-lg align-super">t</span>
                            </span>
                            <span className="text-white mx-4">/</span>
                            <span className="text-beetle-electric">S</span>
                            <span className="text-beetle-electric/60 text-lg align-sub">circ</span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mt-8 text-left">
                            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                                <div className="text-green-400 font-bold text-sm mb-1">V<sub>USDC</sub></div>
                                <div className="text-gray-300 text-xs">$50/node (hardware margin) + HaaS fees. Actual USDC balance in TreasuryVault contract.</div>
                            </div>
                            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                                <div className="text-yellow-400 font-bold text-sm mb-1">(1 + y)<sup>t</sup></div>
                                <div className="text-gray-300 text-xs">5% annual yield from tokenised T-bills (RWA). Default: 500 bps. DAO can update via <code className="text-xs">setYieldBps()</code>.</div>
                            </div>
                            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                                <div className="text-beetle-electric font-bold text-sm mb-1">S<sub>circ</sub></div>
                                <div className="text-gray-300 text-xs">Circulating supply. Mints ONLY on verified energy production. Burns on data API purchases.</div>
                            </div>
                        </div>
                    </div>

                    {/* 5-yr compounding table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm font-mono">
                            <thead>
                                <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
                                    <th className="text-left py-2">Year</th>
                                    <th className="py-2">Nodes</th>
                                    <th className="py-2">USDC Vault</th>
                                    <th className="py-2">+5% Yield</th>
                                    <th className="py-2 text-right text-beetle-gold">Floor Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { y: 'Y1', nodes: '20,000', usdc: '$1.00M', yield: '$1.05M', floor: '$0.0026' },
                                    { y: 'Y2', nodes: '50,000', usdc: '$3.50M', yield: '$3.86M', floor: '$0.0072' },
                                    { y: 'Y3', nodes: '100,000', usdc: '$8.50M', yield: '$9.85M', floor: '$0.0147' },
                                    { y: 'Y4', nodes: '120,000', usdc: '$13.50M', yield: '$16.41M', floor: '$0.0246' },
                                    { y: 'Y5', nodes: '150,000', usdc: '$20.00M', yield: '$25.53M', floor: '$0.0382' },
                                ].map((r, i) => (
                                    <tr key={r.y} className={`${i === 4 ? 'text-beetle-gold font-bold' : 'text-gray-400'} hover:bg-white/3 transition-colors`}>
                                        <td className="py-3">{r.y}</td>
                                        <td className="py-3 text-center">{r.nodes}</td>
                                        <td className="py-3 text-center">{r.usdc}</td>
                                        <td className="py-3 text-center text-green-400">{r.yield}</td>
                                        <td className="py-3 text-right font-black">{r.floor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-gray-600 text-[10px] mt-3">Assumptions: 5% APY T-bill yield, 670M S_circ at Y5. Market price typically 5–10× floor.</p>
                    </div>
                </div>

                {/* ── Data Revenue Flywheel ── */}
                <div className="mb-24">
                    <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                        <Database className="text-beetle-electric" /> Year 2: The Data Revenue Flywheel
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-3xl">
                        By Month 12, dense node clusters unlock the protocol's primary value proposition:
                        <strong className="text-white"> selling solar production data</strong> to energy traders and grid operators.
                        Subscriptions are paid in SCARAB — which are burned on receipt, creating a deflationary loop.
                    </p>

                    {/* Impact callout */}
                    <div className="bg-beetle-electric/10 border border-beetle-electric/20 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
                        <div className="text-5xl font-black text-beetle-electric font-mono">27%</div>
                        <div>
                            <div className="text-white font-bold text-lg">Energy Imbalance Cost Reduction</div>
                            <div className="text-gray-400 text-sm mt-1">
                                Research shows high-density solar DePIN data reduces grid imbalance costs for energy traders by up to 27%.
                                SCARAB captures a portion of those savings as protocol revenue through the Data API.
                            </div>
                        </div>
                    </div>

                    {/* Data product tiers */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {dataProductTiers.map((tier, i) => (
                            <motion.div
                                key={tier.tier}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`bg-black/40 border ${tier.color} rounded-2xl p-6 flex flex-col gap-3`}
                            >
                                <div className="flex items-start justify-between">
                                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${tier.label}`}>{tier.tier}</span>
                                    <span className="text-white font-black text-lg font-mono">{tier.price}</span>
                                </div>
                                <div className="text-white font-bold">{tier.name}</div>
                                <p className="text-gray-400 text-sm flex-grow">{tier.desc}</p>
                                <div className="border-t border-white/5 pt-3 text-xs font-mono text-green-400">
                                    🔥 {tier.burn}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-gray-600 text-xs mt-4 text-center">Data API payments are denominated in SCARAB and burned on receipt — creating supply deflation proportional to network utility.</p>
                </div>

                {/* ── Subscriptions & Bran Burn Mechanism ── */}
                <div className="mb-24">
                    <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                        <Recycle className="text-beetle-gold" /> The "Bran Burn" Mechanism
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-3xl">
                        Organic waste transformation yields tangible "Soil-as-a-Service" products while preventing methane emissions.
                        The $9/month Bran subscription isn't just revenue; it's a programmatic <strong className="text-white">Token Sink</strong>.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-beetle-gold/10 border border-beetle-gold/20 rounded-2xl p-6">
                            <div className="text-3xl font-black text-beetle-gold font-mono mb-2">20% Burn Rate</div>
                            <div className="text-white font-bold text-lg mb-2">Automated Buybacks</div>
                            <div className="text-gray-400 text-sm">
                                20% of all monthly USDC revenue from the $9/mo Bokashi Bran subscription is used by the DAO to programmatically
                                buy back and burn SCARAB tokens from the open market.
                            </div>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="text-green-400" size={24} />
                                <div className="text-3xl font-black text-green-400 font-mono">Soil Data</div>
                            </div>
                            <div className="text-white font-bold text-lg mb-2">Compost Credits</div>
                            <div className="text-gray-400 text-sm">
                                Verified soil transformation data is sold as "Carbon Removal Credits". 100% of this USDC goes
                                straight into the Liquidity Backing Vault (LBV), relentlessly raising the token floor price.
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Risk Matrix ── */}
                <div>
                    <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                        <Leaf className="text-green-400" /> Investor Risk & Defensive Playbook
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
                                    <th className="text-left py-3 w-1/6">Risk</th>
                                    <th className="text-left py-3 w-2/5">Community Communication</th>
                                    <th className="text-left py-3">Mitigation Strategy</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {risks.map(r => (
                                    <tr key={r.risk} className="hover:bg-white/3 transition-colors">
                                        <td className={`py-4 font-bold ${r.color}`}>{r.risk}</td>
                                        <td className="py-4 text-gray-400 italic text-xs pr-6">{r.comms}</td>
                                        <td className="py-4 text-gray-300 text-xs">{r.mit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </section>
    );
}
