import React from 'react';
import { motion } from 'framer-motion';
import { 
    Wind, Droplets, Zap, ShieldCheck, Microscope, 
    Leaf, Database, Clock, ArrowRight, Table, 
    BookOpen, Activity, AlertCircle, TrendingUp, Battery
} from 'lucide-react';
import Navbar from '../components/Navbar';

/**
 * CarbonMethodology.jsx — Rebuilt v2.0
 * Three-Pathway Framework: Methane Avoidance, Soil Sequestration, Solar Displacement.
 * Academic tone, scientific transparency, no marketing fluff.
 */

const DISCLAIMER = `Carbon avoidance estimates use IPCC 2006 Tier 1 default parameters. Credits are not yet formally verified under Gold Standard or Verra. These estimates are provided for informational purposes only.`;

export default function CarbonMethodology() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans">
            <Navbar />

            {/* ── SECTION 1: Hero ── */}
            <section className="pt-32 pb-16 px-6 max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="text-[10px] font-black tracking-[4px] text-emerald-600 uppercase mb-4 block">
                        Scientific Methodology v2.1
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black leading-[1.1] text-gray-900 mb-8 tracking-tight">
                        How SCARAB quantifies <br/>
                        <span className="text-emerald-600">Avoided Emissions.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-3xl font-medium">
                        A three-pathway framework for measuring biological, spatial, and electrical ecological impact 
                        using hardware-attested telemetry and IPCC 2006 Tier 1 guidelines.
                    </p>
                </motion.div>
            </section>

            {/* ── SECTION 2: Pathway 1 — Methane Avoidance ── */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <PathwayHeader 
                        num="01" 
                        title="Methane Avoidance (Active)" 
                        subtitle="Organic Waste Diversion — IPCC 2006 Vol.5 Ch.3"
                        icon={<Droplets className="text-emerald-600" size={32} />}
                    />

                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <Microscope size={20} className="text-emerald-500" />
                                Biological Pathway Validation
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                <strong>SCD41 CO₂ Sensor:</strong> The SCD41 CO₂ sensor inside every Bokashi bucket measures CO₂ concentration during fermentation. 
                                Lactic acid fermentation produces CO₂ but not methane. If putrefaction were occurring instead, the gas profile would differ. 
                                The SCD41 gives us a second, independent confirmation that the correct biological pathway is active — not just that weight is being added.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                <strong>Temperature Cross-Validation:</strong> If the bucket temperature is measurably above ambient (as recorded by the H3-cell weather data), 
                                this is evidence of exothermic microbial metabolism. We cross-reference the DS18B20 internal reading against OpenWeatherMap H3-cell ambient data. 
                                A bucket 3–8°C above ambient while sealed is fermenting correctly; a bucket at ambient temperature for 5+ days flags for quality review.
                            </p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-[2rem] p-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6">Avoidance Equation</h4>
                            <div className="font-mono text-base md:text-lg text-gray-800 mb-6 leading-tight">
                                CO₂e avoided = MSW × MCF × DOC × DOCf × F × (16/12) × GWP₁₀₀
                            </div>
                            <div className="space-y-3">
                                <EquationParam k="MSW" v="Measured Mass (kg, ±2%)" />
                                <EquationParam k="MCF" v="1.0 (Direct measurement)" />
                                <EquationParam k="DOC" v="0.12 tC/t (Conservative)" />
                                <EquationParam k="GWP₁₀₀" v="27.9 (IPCC AR6)" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8">
                        <h4 className="text-sm font-black text-emerald-900 mb-2">Lid-Open Session Telemetry</h4>
                        <p className="text-sm text-emerald-800/80 leading-relaxed max-w-4xl">
                            Lid-open events are recorded as discrete feeding sessions: weight before, weight after, duration open, and ambient temperature. 
                            The weight delta confirms fresh input, while timing patterns feed into the fermentation quality model. 
                            <strong> Privacy check:</strong> Lid events are linked only to pseudonymous device IDs and the city-level H3 cell. Exact timestamps are jittered by 1–5 minutes to prevent residential occupancy tracking.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: Pathway 2 — Soil Carbon ── */}
            <section className="py-20 bg-gray-50 border-y border-gray-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <PathwayHeader 
                        num="02" 
                        title="Soil Carbon Sequestration" 
                        subtitle="The Second Sink — IPCC 2006 Vol.4 AFOLU"
                        icon={<Leaf className="text-amber-600" size={32} />}
                    />

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div className="space-y-8">
                            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">The Two-Phase Carbon Story</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                                        <div>
                                            <p className="text-sm font-bold">Methane Avoidance (Now)</p>
                                            <p className="text-xs text-gray-500">Neutralising the gas that would have escaped in landfill. (1.116 tCO₂e/tonne)</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                                        <div>
                                            <p className="text-sm font-bold">Humus Formation (Phase 2)</p>
                                            <p className="text-xs text-gray-500">Accelerating soil organic carbon (SOC) buildup. additive benefit post-handshake.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed italic">
                                "Soil carbon quantification requires direct measurement — an SOC probe at 0–30cm depth, bulk density sampling, 
                                and a 24-month baseline. SCARAB does not yet have SoilSentinel hardware deployed in all regions. Today, we measure 
                                the **Chain of Custody**."
                            </p>
                        </div>

                        <div className="bg-gray-900 text-white rounded-[2rem] p-10 relative overflow-hidden">
                            <Activity className="absolute bottom-[-20px] right-[-20px] text-emerald-500/10" size={120} />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-6">IPCC ΔSOC APPROACH</h4>
                            <div className="font-mono text-xl mb-6">
                                ΔSOC = (SOC_t2 - SOC_t1) / T × 44/12
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    <strong>The Hub Handshake as Proof:</strong> When a farmer scans the BulkHandshake QR at a Hub, 
                                    total weight, H3 spatial cell, and timestamp are committed to the ledger. 
                                    This creates an immutable record of biological material entering the ag-system.
                                </p>
                                <p className="text-xs text-emerald-400 font-bold">
                                    Status: Baseline data collection for Verra VM0042.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: Pathway 3 — Solar Sentinel ── */}
            <section className="py-20 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <PathwayHeader 
                        num="03" 
                        title="Solar Grid Displacement" 
                        subtitle="Renewable Generation — IPCC AMS-I.D"
                        icon={<Zap className="text-blue-600" size={32} />}
                    />

                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <Battery size={20} className="text-blue-500" />
                                Directly Measured Generation
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                <strong>INA226 Precision:</strong> The INA226 sensor measures real-time power output at the PV panel terminals. 
                                It integrates to kWh directly. The ATECC608A signs each hourly reading, producing a tamper-proof record 
                                superior to unverified panel rating estimates.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                <strong>Performance Ratio (PR):</strong> We compare actual kWh output against theoretical maxima for the H3 cell's 
                                irradiance (via OWM). A healthy residential PV maintains PR 0.75–0.85. If PR drops below 0.6, 
                                the system flags for maintenance or tampering review. This makes Solar Sentinel data defensible for REC claims.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border border-gray-200 rounded-2xl overflow-hidden">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="py-4 px-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Country</th>
                                        <th className="py-4 px-6 font-black text-gray-400 uppercase tracking-widest text-[9px]">Grid Emission Factor</th>
                                        <th className="py-4 px-6 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Annual Avoidance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <GridRow country="Germany" factor="~380 gCO₂e/kWh" avoidance="~342 kg CO₂e" />
                                    <GridRow country="France" factor="~85 gCO₂e/kWh" avoidance="~77 kg CO₂e" />
                                    <GridRow country="USA (Avg)" factor="~367 gCO₂e/kWh" avoidance="~330 kg CO₂e" />
                                    <GridRow country="EU Average" factor="~250 gCO₂e/kWh" avoidance="~225 kg CO₂e" />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 4.5: Is SCARAB energy positive? ── */}
            <section className="py-24 bg-gray-50 border-b border-gray-100 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Is SCARAB energy positive?</h2>
                        <p className="text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
                            Does the energy spent running the hardware negate the environmental benefit? The protocol's total energy footprint is orders of magnitude smaller than the logistics and cloud infrastructure it displaces.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-5 px-6 font-black text-gray-400 uppercase tracking-widest text-[10px]">Device</th>
                                    <th className="py-5 px-6 font-black text-gray-400 uppercase tracking-widest text-[10px]">Overhead</th>
                                    <th className="py-5 px-6 font-black text-gray-400 uppercase tracking-widest text-[10px]">Benefit</th>
                                    <th className="py-5 px-6 font-black text-emerald-600 uppercase tracking-widest text-[10px] text-right">ROI (Energy)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-5 px-6 font-bold text-gray-900">Solar Sentinel V1</td>
                                    <td className="py-5 px-6 text-gray-500">1.2W continuous</td>
                                    <td className="py-5 px-6 text-gray-500">Secures 1,500W+ generation</td>
                                    <td className="py-5 px-6 text-right font-black text-emerald-600">1,250x</td>
                                </tr>
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-5 px-6 font-bold text-gray-900">Smart Bokashi Kit</td>
                                    <td className="py-5 px-6 text-gray-500">0.1W (BLE only)</td>
                                    <td className="py-5 px-6 text-gray-500">Diverts 200kg methane-emitting waste</td>
                                    <td className="py-5 px-6 text-right font-black text-emerald-600">Infinite (Passive)</td>
                                </tr>
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-5 px-6 font-bold text-gray-900">Pro Bioreactor</td>
                                    <td className="py-5 px-6 text-gray-500">450W (Heating/Motors)</td>
                                    <td className="py-5 px-6 text-gray-500">Processes 2,000kg/month locally</td>
                                    <td className="py-5 px-6 text-right font-black text-emerald-600">Net positive vs central transport</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── SECTION 5: BRU Transparency Table ── */}
            <section className="py-24 bg-gray-900 text-white px-6">
                <div className="container mx-auto max-w-5xl text-center">
                    <h2 className="text-3xl font-black mb-4">What does one BRU represent?</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-16">BRU = Baseline Reward Unit. Each integer has a physical anchor.</p>
                    
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="py-6 px-10 font-black text-emerald-400 uppercase tracking-widest text-[10px]">Hardware SKU</th>
                                    <th className="py-6 px-10 font-black text-gray-400 uppercase tracking-widest text-[10px]">BRU/Year</th>
                                    <th className="py-6 px-10 font-black text-gray-400 uppercase tracking-widest text-[10px]">Physical Unit per BRU</th>
                                    <th className="py-6 px-10 font-black text-gray-400 uppercase tracking-widest text-[10px] text-right">CO₂e per BRU</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 font-medium">
                                <BruRow sku="Solar Sentinel" bru="2,400" unit="0.375 kWh generated" co2="~142g (EU Avg)" />
                                <BruRow sku="Smart Bokashi Kit" bru="650" unit="1.54 kg waste diverted" co2="~1.72kg" />
                                <BruRow sku="Pro Bioreactor" bru="8,000" unit="Tonne-scale output" co2="~139kg" />
                                <BruRow sku="Soil Sequestration" bru="TBD" unit="ΔSOC t/ha/yr" co2="Pending Audit" />
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-8 flex items-start gap-4 text-left max-w-3xl mx-auto">
                        <AlertCircle className="text-gray-600 flex-shrink-0" size={16} />
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                            <strong>Note:</strong> BRU emission equivalents are modelled projections using IPCC Tier 1 default parameters 
                            and IEA 2024 grid emission factors. They are not formally verified under Gold Standard or Verra. 
                            Updates follow independent audits.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── SECTION 6: The Roadmap ── */}
            <section className="py-24 bg-white px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Institutional Roadmap</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Path to Formal Registry Issuance</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-0">
                        <RoadmapStage 
                            stage="01" 
                            title="Current Modelling" 
                            subtitle="Stage 1 — Now"
                            items={[
                                "IPCC Tier 1 conservative defaults",
                                "ATECC608A tamper-proof foundation",
                                "Credits are informational only",
                                "No formal registry issuance"
                            ]}
                            active
                        />
                        <RoadmapStage 
                            stage="02" 
                            title="3rd-party Validation" 
                            subtitle="Stage 2 — Series A"
                            items={[
                                "Gold Standard GS-METH-Tool-SWDS",
                                "6 months continuous device data",
                                "Independent DOE sensor audit",
                                "Verra AMS-I.D for Solar displacement"
                            ]}
                        />
                        <RoadmapStage 
                            stage="03" 
                            title="Full Registry Issuance" 
                            subtitle="Stage 3 — Year 2"
                            items={[
                                "Gold Standard GS4GG issuance",
                                "Verra VCS for verified Solar credits",
                                "Verra VM0042 for Soil Carbon",
                                "ISCC Certification for feedstocks"
                            ]}
                            last
                        />
                    </div>

                    <div className="mt-16 bg-blue-50 border border-blue-200 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                        <div>
                            <BookOpen className="text-blue-600 mb-4" size={32} />
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Honesty in Verification</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Carbon credit certification is a multi-year process. We are not a carbon broker. 
                                Our goal is to provide the verified data infrastructure that makes third-party certification possible — 
                                and to be transparent at every stage about what is modelled vs. what is formally verified.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-12 border-t border-gray-100 text-center bg-gray-50 px-6">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[4px] mb-4">SCARAB Protocol Verification Methodology 2.1</p>
                <div className="flex justify-center gap-6 text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-2"><ShieldCheck size={12}/> IPCC 2006 Aligned</span>
                    <span className="flex items-center gap-2"><Wind size={12}/> IEA 2024 Data</span>
                    <span className="flex items-center gap-2"><Database size={12}/> H3 Grid Enabled</span>
                </div>
                <p className="text-xs text-gray-400 max-w-xl mx-auto italic">
                    {DISCLAIMER}
                </p>
            </footer>
        </div>
    );
}

/* ────────── Subcomputes ────────── */

function PathwayHeader({ num, title, subtitle, icon }) {
    return (
        <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
                <div className="text-2xl font-black text-gray-200">{num}</div>
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-1">{title}</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{subtitle}</p>
        </div>
    );
}

function EquationParam({ k, v }) {
    return (
        <div className="flex items-center gap-3 text-xs">
            <span className="font-mono font-bold text-gray-900">{k}:</span>
            <span className="text-gray-500">{v}</span>
        </div>
    );
}

function GridRow({ country, factor, avoidance }) {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="py-4 px-6 font-bold text-gray-900">{country}</td>
            <td className="py-4 px-6 text-gray-500">{factor}</td>
            <td className="py-4 px-6 text-right font-black text-blue-600">{avoidance}</td>
        </tr>
    );
}

function BruRow({ sku, bru, unit, co2 }) {
    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="py-8 px-10 font-black text-white">{sku}</td>
            <td className="py-8 px-10 text-emerald-400 font-mono font-bold">{bru}</td>
            <td className="py-8 px-10 text-gray-400">{unit}</td>
            <td className="py-8 px-10 text-right font-black text-white">{co2}</td>
        </tr>
    );
}

function RoadmapStage({ stage, title, subtitle, items, active, last }) {
    return (
        <div className={`p-10 border-l border-gray-100 min-h-[400px] flex flex-col ${last ? 'border-r' : ''} ${active ? 'bg-gray-50/50' : ''}`}>
            <div className="mb-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs mb-4 ${active ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {stage}
                </div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{subtitle}</h4>
                <h3 className="text-2xl font-black text-gray-900 leading-tight">{title}</h3>
            </div>
            <ul className="space-y-4 flex-1">
                {items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-500 leading-relaxed">
                        <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${active ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
