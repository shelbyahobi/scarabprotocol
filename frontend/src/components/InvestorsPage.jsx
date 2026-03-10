import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, BarChart3, Users, DollarSign, Rocket, PieChart, ArrowRight, Download, Calendar } from 'lucide-react';
import InvestorRoadmap from './InvestorRoadmap';
import StrategyPage from './StrategyPage';
import Navbar from './Navbar';

export default function InvestorsPage() {
    return (
        <div className="min-h-screen bg-[#050B08] text-[#E8E8E8] font-sans selection:bg-[#3DDB5A] selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-beetle-green/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-mono tracking-[4px] text-beetle-green uppercase mb-6 block"
                    >
                        Institutional Seed Sale · Phase 1
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight"
                    >
                        Invest in the Infrastructure of the <span className="text-beetle-green">Regenerative Economy</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 mb-12"
                    >
                        Backing the first hardware-secured DePIN protocol that turns organic waste and solar energy into verified carbon-neutral production.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <button className="bg-beetle-green text-black px-8 py-4 rounded-xl font-black text-lg hover:scale-105 transition-all flex items-center gap-2">
                            Download Investor Deck <Download size={20} />
                        </button>
                        <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
                            Schedule Technical Call <Calendar size={20} />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* High-Level Metrics */}
            <section className="py-20 bg-black/40 border-y border-white/5">
                <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">
                    <MetricCard label="Target Raise" value="$2.0M" sub="MVP & Phase 1 Mfg" />
                    <MetricCard label="Unit Margin" value="34% - 90%" sub="Hardware/SaaS Blended" />
                    <MetricCard label="Break-Even" value="1.3 Months" sub="Post-Deployment" />
                    <MetricCard label="5-Year Revenue" value="$74M" sub="Projected Data + SaaS" />
                </div>
            </section>

            {/* Seed Sale Price Ladder (Imported content component) */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-12 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Investment Opportunity</h2>
                        <p className="text-gray-400">Fixed USD pricing with tiered valuation expansion. Phase 1 prioritizing bridge manufacturing.</p>
                    </div>
                    {/* Note: In a real app we'd refactor StrategyPage parts out, but for here we link or repeat refined logic */}
                    <div className="bg-[#111] border border-[#1E1E1E] rounded-3xl p-8 md:p-12">
                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            <SalePhase
                                title="Phase 01: Infra Seed"
                                color="beetle-green"
                                allocation="5% of Supply"
                                hardcap="$600,000"
                                goal="Prototype R&D"
                            />
                            <SalePhase
                                title="Phase 02: Production"
                                color="beetle-electric"
                                allocation="10% of Supply"
                                hardcap="$800,000"
                                goal="Batch Manufacturing"
                            />
                            <SalePhase
                                title="Phase 03: Liquidity"
                                color="beetle-gold"
                                allocation="15% of Supply"
                                hardcap="$600,000"
                                goal="Global Launch"
                            />
                        </div>
                        <div className="text-center text-xs text-gray-500 font-mono">
                            Total Supply: 1,000,000,000 SCARAB · Emission decay λ = 0.00020518
                        </div>
                    </div>
                </div>
            </section>

            {/* Unit Economics Section */}
            <section className="py-24 bg-[#0A0F0C] border-y border-white/5">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-xs font-mono text-beetle-green uppercase tracking-widest mb-4 block">Hardware + SaaS</span>
                            <h2 className="text-4xl font-black text-white mb-6">Unit Economics & Profitability</h2>
                            <p className="text-gray-400 text-lg mb-8">
                                SCARAB isn't just a token. It's a high-margin hardware business. We generate revenue from initial hardware sales,
                                recurring SaaS subscriptions for Bokashi Bran, and institutional solar dataset APIs.
                            </p>
                            <div className="space-y-4">
                                <EconomicStat label="Solar Sentinel Margin" value="90%" icon={<TrendingUp className="text-beetle-electric" />} />
                                <EconomicStat label="Bokashi Kit LTV (Year 1)" value="$288" icon={<DollarSign className="text-beetle-green" />} />
                                <EconomicStat label="Data API Burn Participation" value="100%" icon={<PieChart className="text-beetle-gold" />} />
                            </div>
                        </div>
                        <div className="bg-black border border-white/10 rounded-3xl p-8">
                            <h4 className="text-white font-bold mb-6">Year 1 Performance Model</h4>
                            <div className="space-y-6">
                                <ProgressBar label="Infrastructure R&D (Phase 1)" pct={60} amount="$360K" color="#3DDB5A" />
                                <ProgressBar label="Manufacturing Scale (Phase 2)" pct={70} amount="$560K" color="#00F0FF" />
                                <ProgressBar label="Liquidity & Marketing (Phase 3)" pct={50} amount="$300K" color="#D4AF37" />
                            </div>
                            <div className="mt-10 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                <div className="text-gray-500 text-xs mb-1">Total Target Profitability</div>
                                <div className="text-3xl font-black text-white font-mono">$471,500 <span className="text-beetle-green text-sm">/ yr</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Execution Roadmap (Integrated from Roadmap component) */}
            <div id="roadmap">
                <InvestorRoadmap />
            </div>

            {/* Institutional Protections */}
            <section className="py-24 border-t border-white/5 bg-black">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <h2 className="text-3xl font-black text-white mb-12">Institutional Safeguards</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <ProtectionCard
                            title="Multi-Sig Custody"
                            desc="3-of-5 Multi-sig controls for all treasury and raise funds. Institutional key storage via HSM."
                            icon={<Shield className="text-beetle-green" />}
                        />
                        <ProtectionCard
                            title="Milestone Gating"
                            desc="Capital release tied to manufacturing deliverables. Zero 'deployer god-mode' after handover."
                            icon={<BarChart3 className="text-beetle-electric" />}
                        />
                        <ProtectionCard
                            title="12-Month Vesting"
                            desc="Team and seed investors are subject to 12-month linear cliff with daily unlocks."
                            icon={<PieChart className="text-beetle-gold" />}
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-gradient-to-b from-black to-[#0a1a0f] text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to Scale Global Infrastructure?</h2>
                    <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
                        Private round allocations close upon hardcap. Secure your position in the institutional seed round.
                    </p>
                    <button className="bg-white text-black px-12 py-5 rounded-2xl font-black text-2xl hover:bg-beetle-green transition-all shadow-2xl hover:shadow-beetle-green/20">
                        Access Allocation Portal
                    </button>
                </div>
            </section>
        </div>
    );
}

function MetricCard({ label, value, sub }) {
    return (
        <div className="p-6">
            <div className="text-gray-500 text-xs font-mono tracking-widest uppercase mb-1">{label}</div>
            <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">{value}</div>
            <div className="text-beetle-green font-bold text-xs">{sub}</div>
        </div>
    );
}

function SalePhase({ title, color, allocation, hardcap, goal }) {
    return (
        <div className={`p-6 rounded-2xl border-l-4 bg-white/5 border-${color}`}>
            <div className="text-white font-black text-lg mb-4">{title}</div>
            <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono"><span className="text-gray-500">Goal</span><span className="text-white">{goal}</span></div>
                <div className="flex justify-between text-xs font-mono"><span className="text-gray-500">Allocation</span><span className="text-white">{allocation}</span></div>
                <div className="flex justify-between text-xs font-mono"><span className="text-gray-500">Hard Cap</span><span className={`text-${color} font-bold`}>{hardcap}</span></div>
            </div>
        </div>
    );
}

function EconomicStat({ label, value, icon }) {
    return (
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center border border-white/10">
                {icon}
            </div>
            <div className="flex-1">
                <div className="text-gray-500 text-xs font-bold uppercase">{label}</div>
                <div className="text-xl font-black text-white font-mono">{value}</div>
            </div>
        </div>
    );
}

function ProgressBar({ label, pct, amount, color }) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400 font-bold uppercase">{label}</span>
                <span className="text-white font-mono">{amount}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    );
}

function ProtectionCard({ title, desc, icon }) {
    return (
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-white/20 transition-all text-center">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                {React.cloneElement(icon, { size: 32 })}
            </div>
            <h4 className="text-white font-black text-xl mb-4">{title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
