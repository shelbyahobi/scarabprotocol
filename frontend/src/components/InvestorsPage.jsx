import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, BarChart3, Users, DollarSign, Rocket, PieChart, ArrowRight, Download, Calendar, FileCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import InvestorRoadmap from './InvestorRoadmap';
import StrategyPage from './StrategyPage';
import Navbar from './Navbar';
import RevenueBreakdown from './RevenueBreakdown';

export default function InvestorsPage() {
    return (
        <div className="min-h-screen bg-[#050B08] text-[#E8E8E8] font-sans selection:bg-[#3DDB5A] selection:text-black print:bg-white print:text-black">
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { margin: 1cm; size: A4 portrait; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; color: black !important; }
                    .print-hide { display: none !important; }
                    .print-break-inside-avoid { break-inside: avoid; }
                    .print-text-black { color: black !important; }
                    .print-bg-white { background: white !important; }
                    .print-border { border-color: #e5e7eb !important; }
                    /* Make all text black in print */
                    * { color: black !important; }
                    .text-beetle-green { color: #1D9E75 !important; }
                    .bg-beetle-green { background-color: #1D9E75 !important; color: white !important; }
                }
            `}} />
            
            <div className="bg-amber-500 text-black text-xs font-bold text-center py-2 px-4 print-hide">
                Information on this page is for institutional qualification under the Markets in Crypto-Assets (MiCA) regulation. Not for retail distribution.
            </div>

            <div className="print-hide">
                <Navbar />
            </div>

            <div className="container mx-auto px-4 max-w-4xl flex justify-end pt-6 print-hide relative z-50">
                <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-white/20"
                >
                    <Download size={16} /> Print Briefing (A4)
                </button>
            </div>

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
                        Backing a hardware-secured DePIN protocol focused on verifiable ecological production data and infrastructure incentives.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Link to="/investors/summary" className="bg-white text-black px-8 py-4 rounded-xl font-black text-lg hover:bg-beetle-green transition-all flex items-center gap-2">
                            View Institutional Summary <ArrowRight size={20} />
                        </Link>
                        <a href="/docs" className="bg-beetle-green/10 border border-beetle-green/30 text-beetle-green px-8 py-4 rounded-xl font-bold text-lg hover:bg-beetle-green/20 transition-all flex items-center gap-2">
                            Download Investor Deck <Download size={20} />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* High-Level Metrics */}
            <section className="py-20 bg-black/40 border-y border-white/5 print-bg-white print-border print-break-inside-avoid">
                <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">
                    <MetricCard label="Raise Objective" value="$2.0M" sub="Prototype + early manufacturing" />
                    <MetricCard label="Network Status" value="BSC Testnet" sub="Public contracts and simulations" />
                    <MetricCard label="Current Stage" value="Pre-Seed" sub="VC diligence in progress" />
                    <MetricCard label="Forecast Policy" value="Scenario-Based" sub="Detailed model under NDA" />
                </div>
            </section>

            {/* Seed Sale Price Ladder (Imported content component) */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-12 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Capital Formation Overview</h2>
                        <p className="text-gray-400">This page is informational and does not constitute a public offering. Jurisdiction and eligibility checks apply.</p>
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
            <section className="py-24 bg-[#0A0F0C] border-y border-white/5 print-bg-white print-border print-break-inside-avoid">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-xs font-mono text-beetle-green uppercase tracking-widest mb-4 block">Hardware + SaaS</span>
                            <h2 className="text-4xl font-black text-white mb-6">Unit Economics (Illustrative)</h2>
                            <p className="text-gray-400 text-lg mb-8">
                                SCARAB combines hardware deployment, recurring service revenue, and data products.
                                Values shown here are scenario summaries; full assumptions are available in the investor data room.
                            </p>
                            <div className="space-y-4">
                                <EconomicStat label="Hardware Economics" value="Scenario Model" icon={<TrendingUp className="text-beetle-electric" />} />
                                <EconomicStat label="Recurring Revenue" value="Under Validation" icon={<DollarSign className="text-beetle-green" />} />
                                <EconomicStat label="Data Product Pipeline" value="Pilot Scope" icon={<PieChart className="text-beetle-gold" />} />
                            </div>
                        </div>
                        <div className="bg-black border border-white/10 rounded-3xl p-8">
                            <h4 className="text-white font-bold mb-6">Year 1 Allocation Model (Illustrative)</h4>
                            <div className="space-y-6">
                                <ProgressBar label="Infrastructure R&D (Phase 1)" pct={60} amount="$360K" color="#3DDB5A" />
                                <ProgressBar label="Manufacturing Scale (Phase 2)" pct={70} amount="$560K" color="#00F0FF" />
                                <ProgressBar label="Liquidity & Marketing (Phase 3)" pct={50} amount="$300K" color="#D4AF37" />
                            </div>
                            <div className="mt-10 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                <div className="text-gray-500 text-xs mb-1">Detailed P&L and sensitivity cases</div>
                                <div className="text-2xl font-black text-white font-mono">Available in VC data room (NDA)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 border-y border-white/5 bg-[#070B08]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 mb-24">
                        {/* What We Are Not Building */}
                        <div>
                            <span className="text-xs font-mono text-red-500 uppercase tracking-widest mb-4 block">Strategic Clarity</span>
                            <h2 className="text-3xl font-black text-white mb-6">What We Are <span className="text-red-500">Not</span> Building</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 min-w-[24px] text-red-500 font-bold">✕</div>
                                    <div><strong className="text-gray-200">Not a Consumer App:</strong> We build invisible B2B hardware routing. Farmers do not manage crypto keys.</div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 min-w-[24px] text-red-500 font-bold">✕</div>
                                    <div><strong className="text-gray-200">Not a Carbon Credit Broker:</strong> We produce raw, hardware-attested Scope 3 data. We sell APIs to institutional registries, we do not trade credits to retail.</div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 min-w-[24px] text-red-500 font-bold">✕</div>
                                    <div><strong className="text-gray-200">Not a Crypto Exchange:</strong> SCARAB is a utility token used exclusively for activating network bandwidth and data acquisition.</div>
                                </li>
                            </ul>
                        </div>

                        {/* Capital Efficiency */}
                        <div className="bg-black border border-beetle-green/20 rounded-3xl p-8">
                            <h2 className="text-2xl font-black text-white mb-2">Capital Efficiency</h2>
                            <p className="text-sm text-gray-400 mb-8 border-b border-white/10 pb-4">Because hardware hosts stake their own nodes, zero municipal CAPEX is required. This shifts scale velocity heavily into our favor.</p>
                            
                            <div className="space-y-6">
                                <div>
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Milestone 1: Prototype (Months 1-4)</div>
                                    <div className="flex items-end gap-2"><span className="text-2xl font-black text-beetle-green">$300k</span> <span className="text-sm text-gray-400 mb-1">Unlocks 100 Hubs / Hardware finalization</span></div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Milestone 2: Subsidized Rollout (Months 5-11)</div>
                                    <div className="flex items-end gap-2"><span className="text-2xl font-black text-white">$1.2M</span> <span className="text-sm text-gray-400 mb-1">Unlocks 1000 Hubs / ISCC Pilot Certification</span></div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Milestone 3: Institutional API (Months 12-18)</div>
                                    <div className="flex items-end gap-2"><span className="text-2xl font-black text-white">$500k</span> <span className="text-sm text-gray-400 mb-1">Unlocks ESG Data Market & Standalone Sales</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-white mb-10 text-center">Diligence Scope: Public vs. NDA</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                            <div className="flex items-center gap-3 mb-4">
                                <FileCheck className="text-beetle-green" />
                                <h3 className="text-xl font-black text-white">Public Information</h3>
                            </div>
                            <ul className="text-sm text-gray-300 space-y-2">
                                <li>Protocol architecture and contract modules</li>
                                <li>BSC testnet contract addresses and transaction history</li>
                                <li>Token mechanics overview and governance model</li>
                                <li>Legal pages, risk disclosures, and policy documents</li>
                            </ul>
                        </div>
                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="text-beetle-gold" />
                                <h3 className="text-xl font-black text-white">NDA Data Room (VC Only)</h3>
                            </div>
                            <ul className="text-sm text-gray-300 space-y-2">
                                <li>Detailed BOM, supplier terms, and manufacturing quotes</li>
                                <li>Financial model assumptions, downside cases, and sensitivities</li>
                                <li>Pilot pipeline, LOIs, and partner diligence artifacts</li>
                                <li>Security review artifacts, internal controls, and legal memos</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Go-To-Market Sequence */}
            <section className="py-24 bg-black border-y border-white/5">
                <div className="container mx-auto px-4 max-w-5xl">
                    <span className="text-xs font-mono text-beetle-green uppercase tracking-widest mb-4 block">Go-to-Market</span>
                    <h2 className="text-3xl font-black text-white mb-12">Execution Sequence</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        <GTMStep num="1" title="Stuttgart Pilot" desc="Single-city proof with hardware deployed, municipal API live, fiat payouts active." status="In Progress" />
                        <GTMStep num="2" title="3 German Cities" desc="Berlin, Hamburg, Stuttgart. Prove multi-cluster economics and logistics efficiency." status="Q3 2026" />
                        <GTMStep num="3" title="EU Expansion" desc="Netherlands, France. EURC stablecoin payouts. ISCC certification for UCO/SAF feedstock." status="Q1 2027" />
                        <GTMStep num="4" title="Token Mode (Non-EU)" desc="SCARAB token emissions enabled for US and non-EU jurisdictions where regulatory clarity exists." status="Q2 2027" />
                    </div>
                </div>
            </section>

            {/* Revenue breakdown chart integrated */}
            <section className="py-24 bg-[#050a05] border-y border-white/5">
                <div className="container mx-auto px-4 max-w-5xl">
                    <RevenueBreakdown />
                </div>
            </section>

            {/* Revenue Streams List */}
            <section className="py-24 bg-[#0A0F0C] print-bg-white print-break-inside-avoid">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-black text-white mb-12">Revenue & Value Capture</h2>
                    <div className="space-y-4">
                        <RevenueRow rank="1" stream="Hardware Licensing" desc="B2B hardware licensing fees for Pro Bioreactor and Commercial UCO Nodes." color="beetle-green" />
                        <RevenueRow rank="2" stream="Validator Slashing Mechanics" desc="Economic security model. Validators stake SCARAB. False telemetry or downtime results in slashing, capturing value back to the protocol treasury." color="beetle-electric" />
                        <RevenueRow rank="3" stream="API Data Monetization" desc="Corporate ESG compliance APIs and ISCC-certified UCO provenance datasets sold to aviation fuel producers." color="beetle-gold" />
                        <RevenueRow rank="4" stream="Token Appreciation" desc="Deflationary pressure from buy-and-burn mechanics tied to real-world fiat revenue." color="white" />
                    </div>
                    <p className="text-gray-400 mt-12 leading-relaxed">
                        UCO collection nodes complete the LiquidityBackingVault loop. Corporate SAF buyers burn SCARAB to access ISCC-certified provenance records generated by our kiosk hardware. This is the highest-margin data stream in the protocol — UCO verified at source commands a 3–5× premium over self-reported feedstock in the aviation fuel market.
                    </p>
                </div>
            </section>

            {/* SAM/SOM Market Sizing */}
            <section className="py-24 bg-black border-y border-white/5">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-4xl font-black text-white mb-16">Market Sizing (TAM/SAM/SOM)</h2>
                    
                    <div className="space-y-4 max-w-2xl mx-auto mb-16">
                        {/* Funnel Visual */}
                        <div className="bg-emerald-900/20 border border-emerald-500/30 p-10 rounded-t-[4rem]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">TAM (Total Addressable)</span>
                            <div className="text-4xl font-black">€56B</div>
                            <p className="text-xs text-emerald-500/60 mt-1">4 EU verticals, long-term ceiling</p>
                        </div>
                        <div className="bg-blue-900/20 border border-blue-500/30 p-8 w-[90%] mx-auto">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 block">SAM (Serviceable Addressable)</span>
                            <div className="text-3xl font-black">€1.2B</div>
                            <p className="text-xs text-blue-500/60 mt-1">German organic waste + solar monitoring, 3-year reachable</p>
                        </div>
                        <div className="bg-amber-900/20 border border-amber-500/30 p-6 w-[80%] mx-auto rounded-b-3xl">
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2 block">SOM (Serviceable Obtainable)</span>
                            <div className="text-2xl font-black">€4.8M</div>
                            <p className="text-xs text-amber-500/60 mt-1">Stuttgart + Berlin + Hamburg pilot addressable revenue Y1–Y2</p>
                        </div>
                    </div>

                    <div className="text-left bg-white/5 border border-white/10 p-8 rounded-3xl">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                             Calculation Transparency
                        </h4>
                        <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                            <p><strong>SAM Calculation:</strong> German organic waste market €800M/yr × SCARAB's addressable % (municipal data subscriptions + hardware penetration) + German solar monitoring €400M/yr × addressable %</p>
                            <p><strong>SOM Calculation:</strong> 3 pilot cities × avg district population 120K × participation rate 0.5% × hardware ARPU €265 + subscription €144/yr</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Entity Structure & Regulatory Positioning */}
            <section className="py-24 bg-black border-y border-white/5">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div>
                            <span className="text-xs font-mono text-beetle-gold uppercase tracking-widest mb-4 block">Legal Structure</span>
                            <h2 className="text-3xl font-black text-white mb-6">Entity Architecture</h2>
                            <div className="space-y-4">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <div className="text-beetle-green font-bold text-sm mb-1">Protocol Layer</div>
                                    <div className="text-white font-black text-lg">SCARAB DAO LLC (Wyoming, USA)</div>
                                    <p className="text-gray-400 text-xs mt-2">Governs smart contracts, token emissions, and on-chain treasury.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <div className="text-beetle-gold font-bold text-sm mb-1">European Operations</div>
                                    <div className="text-white font-black text-lg">SCARAB UG (Germany, registration in progress)</div>
                                    <p className="text-gray-400 text-xs mt-2">Manages EU hardware deployment, municipal contracts, GDPR compliance, and ISCC certification.</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-4 block">Regulatory</span>
                            <h2 className="text-3xl font-black text-white mb-6">Positioning</h2>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <p className="text-gray-300 leading-relaxed mb-6">
                                    "We are a <strong className="text-white">data verification and settlement layer</strong>. Waste logistics compliance is the municipality's existing obligation — we make it auditable."
                                </p>
                                <ul className="text-sm text-gray-400 space-y-2">
                                    <li>• EU users receive EUR fiat payouts only — no token exposure at launch</li>
                                    <li>• Hardware devices are owned by operators, not the protocol</li>
                                    <li>• Municipal data scoped exclusively to registered jurisdiction</li>
                                    <li>• All EU data processed on Hetzner Cloud, Frankfurt (GDPR-native)</li>
                                </ul>
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
                            desc="Multi-sig treasury controls are planned for custody-sensitive operations. Policy and signer setup are provided in diligence."
                            icon={<Shield className="text-beetle-green" />}
                        />
                        <ProtectionCard
                            title="Milestone Gating"
                            desc="Capital release and admin rights are designed to follow milestone-gated handover with timelocked governance."
                            icon={<BarChart3 className="text-beetle-electric" />}
                        />
                        <ProtectionCard
                            title="12-Month Vesting"
                            desc="Team and seed allocations follow vesting schedules; exact terms are disclosed in legal documents and investor materials."
                            icon={<PieChart className="text-beetle-gold" />}
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-gradient-to-b from-black to-[#0a1a0f] text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Continue Diligence</h2>
                    <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
                        Request access to the diligence package for technical walkthroughs, legal documentation, and scenario models.
                    </p>
                    <a href="mailto:investors@scarabprotocol.org?subject=SCARAB%20Data%20Room%20Request" className="bg-white text-black px-12 py-5 rounded-2xl font-black text-2xl hover:bg-beetle-green transition-all shadow-2xl hover:shadow-beetle-green/20 inline-block">
                        Request Data Room Access
                    </a>
                    <p className="text-xs text-gray-500 mt-6 max-w-3xl mx-auto">
                        Not investment advice. Information provided for diligence only. Eligibility and jurisdictional restrictions apply.
                    </p>
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

function GTMStep({ num, title, desc, status }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
            <div className="text-beetle-green font-mono text-xs mb-2">Phase {num}</div>
            <h4 className="text-white font-black text-lg mb-2">{title}</h4>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">{desc}</p>
            <div className="text-xs font-bold text-beetle-gold">{status}</div>
        </div>
    );
}

function RevenueRow({ rank, stream, desc, color }) {
    return (
        <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-xl p-5">
            <div className={`text-3xl font-black text-${color} min-w-[40px]`}>{rank}</div>
            <div>
                <div className="text-white font-bold">{stream}</div>
                <div className="text-gray-400 text-xs mt-1">{desc}</div>
            </div>
        </div>
    );
}
