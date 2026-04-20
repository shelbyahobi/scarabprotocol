import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
    Users, Tractor, Warehouse, Landmark, Building2, 
    Zap, RefreshCw, BarChart3, TrendingUp, Heart, 
    ArrowRight, Activity, Database, Flame, CircleCheckBig,
    Droplets, Wind, Shovel, Battery, Car, CloudLightning
} from 'lucide-react';
import Navbar from '../components/Navbar';

/**
 * SCARAB Protocol — Ecosystem Page Rebuild v2.5
 * Audiences: Farmers, Municipalities, Impact Investors
 */

const FLYWHEEL_STEPS = [
    { text: "New SKU added to network", icon: <Zap size={18}/> },
    { text: "New verified data stream created", icon: <Database size={18}/> },
    { text: "New corporate buyer category unlocks", icon: <Building2 size={18}/> },
    { text: "More SCARAB burned to access data", icon: <Flame size={18}/> },
    { text: "Token supply decreases", icon: <TrendingUp size={18}/> },
    { text: "All existing holders benefit", icon: <Heart size={18}/> },
    { text: "More farmers/operators join", icon: <Users size={18}/> },
    { text: "Denser network → better quality", icon: <Activity size={18}/> },
    { text: "More municipalities adopt", icon: <Landmark size={18}/> }
];

export default function EcosystemPage() {
    const location = useLocation();
    
    // Context detection
    const searchParams = new URLSearchParams(location.search);
    const isMunicipalCtx = searchParams.get('ctx') === 'municipal' || document.referrer.includes('municipalities');

    const heroSubheadline = isMunicipalCtx 
        ? "Every SCARAB device — whether it monitors solar panels, Bokashi fermentation, or water usage — uses the same tamper-proof verification method. A city that trusts our waste data automatically trusts our water data. One standard. Infinite applications."
        : "SCARAB standardises ATECC608A cryptographic attestation across all ecological output categories. Every new SKU added to the network strengthens the verification layer for all existing SKUs — and creates a new data stream that corporations access by burning SCARAB.";

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans overflow-x-hidden">
            <Navbar />

            {/* ── SECTION 2A: Hero ── */}
            <section className="pt-32 pb-20 border-b border-gray-100 bg-white px-6">
                <div className="container mx-auto max-w-5xl text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="text-[10px] font-black tracking-[4px] text-emerald-600 uppercase mb-4 block">
                            The Universal Verification Standard
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-[1.05]">
                            One cryptographic standard.<br/>
                            Every ecological output.<br/>
                            <span className="text-emerald-600">Infinitely scalable.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
                            {heroSubheadline}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── SECTION 2B: The Flywheel ── */}
            <section className="py-24 bg-gray-50 border-b border-gray-100 overflow-hidden px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">The Flywheel Story</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Why more SKUs = more value for everyone</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Animated Flywheel SVG/CSS */}
                        <div className="relative aspect-square max-w-md mx-auto flex items-center justify-center">
                            <motion.div 
                                animate={{ rotate: 360 }} 
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-[60px] border-emerald-500/5 rounded-full"
                            />
                            <div className="relative z-10 w-full flex flex-col items-center gap-2">
                                {FLYWHEEL_STEPS.slice(0, 5).map((step, i) => (
                                    <React.Fragment key={i}>
                                        <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-3 text-xs font-bold text-gray-600">
                                            {step.icon} {step.text}
                                        </div>
                                        {i < 4 && <div className="h-4 w-px bg-emerald-200" />}
                                    </React.Fragment>
                                ))}
                                <div className="mt-4 animate-bounce text-emerald-600">
                                    <RefreshCw size={24} />
                                </div>
                            </div>
                            
                            {/* Drifting Background Icons */}
                            <DriftingIcon icon={<CloudLightning />} top="10%" left="10%" delay={1} />
                            <DriftingIcon icon={<Droplets />} top="10%" right="15%" delay={3} />
                            <DriftingIcon icon={<Car />} bottom="15%" left="20%" delay={5} />
                        </div>

                        <div className="space-y-12">
                            <FlywheelPoint 
                                title="Cross-Validation Synergy"
                                text="An AquaSentinel joining your cluster improves your Bokashi data's credibility — water usage patterns cross-validate fermentation activity."
                            />
                            <FlywheelPoint 
                                title="Burning Scarcity Mechanism"
                                text="Every new data category creates a new corporate buyer. Every corporate buyer burns SCARAB. Every burn raises the floor for farmers and operators already in the network."
                            />
                            <FlywheelPoint 
                                title="Localized Network Density"
                                text="You don't need to own every SKU type. Your Bokashi bucket benefits from every AirNode that joins your district. Denser networks attract higher municipal adoption."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 2C: Phase 1 SKUs ── */}
            <section className="py-24 bg-white px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Active Infrastructure</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Phase 1 SKUs Currently Mining</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <SKUCard 
                            name="Solar Sentinel V1"
                            category="Renewable Energy"
                            bru="2,400 BRU/year"
                            who="Energy utilities, ESG funds, Renewable Energy Certificate registries"
                            proves="kWh generated per device, irradiance-adjusted, ECDSA-signed at source"
                            burn="10 SCARAB per month per device licensed"
                            icon={<Zap className="text-amber-500" size={32} />}
                        />
                        <SKUCard 
                            name="Smart Bokashi Kit"
                            category="Organic Waste"
                            bru="650 BRU/year"
                            who="Agricultural research institutions, municipalities, SAF feedstock brokers"
                            proves="kg of organic waste diverted, fermentation quality score, chain of custody to Hub"
                            burn="5 SCARAB per month per H3 cluster licensed"
                            icon={<Shovel className="text-emerald-500" size={32} />}
                        />
                        <SKUCard 
                            name="Pro Bioreactor"
                            category="Industrial Waste"
                            bru="8,000 BRU/year"
                            who="Industrial composting operators, soil amendment manufacturers, carbon registries"
                            proves="Tonne-scale waste processing, soil output volume, CO₂ sequestration methodology"
                            burn="50 SCARAB per month per facility licensed"
                            icon={<Warehouse className="text-blue-500" size={32} />}
                        />
                    </div>
                </div>
            </section>

            {/* ── SECTION 2D: Security Architecture ── */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Zero-Trust Firmware Execution</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">Our strongest technical differentiator: siloed silicon keys.</p>
                    </div>

                    <div className="relative py-12">
                        <div className="flex flex-col gap-0 items-center">
                            <ArchitectureLayer 
                                title="SILICON LAYER"
                                point1="ATECC608A Secure Element"
                                point2="Private key generated on-chip (Never extractable)"
                                point3="Factory provisioned, not internet"
                                color="border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                            />
                            <ArchitectureArrow text="ECDSA P-256 signature" color="text-emerald-500/40" />
                            <ArchitectureLayer 
                                title="LOGIC LAYER"
                                point1="ESP32-S3 Firmware"
                                point2="Signs telemetry payload using Silicon key"
                                point3="Cannot spoof — chip won't sign fake data"
                                color="border-blue-500/30 bg-blue-500/5 text-blue-400"
                            />
                            <ArchitectureArrow text="Verified submission" color="text-blue-500/40" />
                            <ArchitectureLayer 
                                title="PROTOCOL LAYER"
                                point1="Oracle Worker (Off-chain Node)"
                                point2="verifySignature() — rejects invalid pubkeys"
                                point3="On-chain: immutable hash + aggregate"
                                color="border-purple-500/30 bg-purple-500/5 text-purple-400"
                            />
                        </div>
                    </div>

                    <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-8 text-center italic text-gray-400 text-sm leading-relaxed">
                        "A Solar Sentinel and a Bokashi Kit communicate in the exact same mathematical language. When a municipality trusts one SCARAB device, they implicitly trust the entire network's verification methodology."
                    </div>
                </div>
            </section>

            {/* ── SECTION 2E: Phase 2 Pipeline ── */}
            <section className="py-24 bg-white border-b border-gray-100 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Ecosystem Pipeline</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Future SKUs in Development</p>
                    </div>

                    <div className="overflow-x-auto border border-gray-100 rounded-3xl">
                        <table className="w-full text-sm text-left border-collapse bg-white">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="py-5 px-8 font-black text-gray-400 uppercase tracking-widest text-[9px]">SKU</th>
                                    <th className="py-5 px-8 font-black text-gray-400 uppercase tracking-widest text-[9px]">Category</th>
                                    <th className="py-5 px-8 font-black text-gray-400 uppercase tracking-widest text-[9px]">Who buys the data</th>
                                    <th className="py-5 px-8 font-black text-gray-400 uppercase tracking-widest text-[9px] text-right">Target Pilot</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-medium">
                                <PipelineRow name="AquaSentinel" cat="Water Conservation" buyer="Water utilities, insurance, drought funds" date="Q4 2026" />
                                <PipelineRow name="AirNode" cat="Urban Air Quality" buyer="City planning, health insurers" date="Q1 2027" />
                                <PipelineRow name="SoilSentinel" cat="Regen Carbon" buyer="Carbon registries, ag land funds" date="Q2 2027" />
                                <PipelineRow name="PowerVault Monitor" cat="Battery Efficiency" buyer="Grid operators, EV fleet managers" date="Q2 2027" />
                                <PipelineRow name="ChargeNode" cat="Renewable EV Charging" buyer="Charge networks, fleet ESG reporting" date="Q3 2027" />
                                <PipelineRow name="CarbonVault" cat="Industrial CO₂" buyer="Industrial emitters, compliance buyers" date="Q4 2027" />
                                <tr>
                                    <td colSpan={4} className="py-8 px-8 text-center bg-gray-50/50">
                                        <p className="text-gray-500 font-bold mb-3">Building in one of these categories?</p>
                                        <a href="mailto:protocol@scarabprotocol.org" className="text-emerald-600 font-black flex items-center justify-center gap-2 hover:underline">
                                            Apply to integrate your hardware <ArrowRight size={14}/>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── SECTION 2F: Data Marketplace ── */}
            <section className="py-24 bg-gray-50 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Data Marketplace Pricing</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Every data stream has a buyer. Every buyer burns SCARAB.</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="py-5 px-8 font-black text-gray-700 uppercase tracking-widest text-[9px]">Data Stream</th>
                                    <th className="py-5 px-8 font-black text-gray-700 uppercase tracking-widest text-[9px]">Buyer Type</th>
                                    <th className="py-5 px-8 font-black text-gray-700 uppercase tracking-widest text-[9px]">Access Model</th>
                                    <th className="py-5 px-8 font-black text-emerald-600 uppercase tracking-widest text-[9px] text-right">SCARAB Burned</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-medium">
                                <MarketplaceRow stream="Solar kWh (device-level)" buyer="Utilities, REC registries" access="Per device / month" burn="10 SCARAB" />
                                <MarketplaceRow stream="Bokashi kg (cluster-level)" buyer="Municipalities, Agri-Research" access="Per H3 cluster / month" burn="5 SCARAB" />
                                <MarketplaceRow stream="UCO provenance (batch-level)" buyer="SAF manufacturers, ISCC" access="Per batch verified" burn="25 SCARAB" />
                                <MarketplaceRow stream="Bioreactor output (facility)" buyer="Industrial composters" access="Per facility / month" burn="50 SCARAB" />
                                <MarketplaceRow stream="AQI readings (district)" buyer="City planning, insurers" access="Per district / month" burn="15 SCARAB" />
                                <tr className="bg-emerald-600 text-white font-bold">
                                    <td className="py-6 px-8">Multi-stream bundle</td>
                                    <td className="py-6 px-8">ESG funds, impact investors</td>
                                    <td className="py-6 px-8">Custom Enterprise</td>
                                    <td className="py-6 px-8 text-right">Custom Burn Schedule</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-8 flex justify-center gap-6 text-[10px] text-gray-400 font-black uppercase tracking-[3px]">
                        <span>Verified On-Chain</span>
                        <span>•</span>
                        <span>Direct Burn mechanism</span>
                        <span>•</span>
                        <span>Zero Re-minting</span>
                    </div>
                </div>
            </section>

            {/* Standard Footer */}
            <footer className="py-20 border-t border-gray-100 text-center bg-white px-6">
                <div className="container mx-auto">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[4px]">SCARAB Protocol Ecosystem v2.5</p>
                    <p className="mt-2 text-xs text-gray-400">© {new Date().getFullYear()} SCARAB UG (Haftungsbeschränkt). Germany.</p>
                </div>
            </footer>
        </div>
    );
}

/* ────────── Subcomputes ────────── */

function FlywheelPoint({ title, text }) {
    return (
        <div className="space-y-2">
            <h4 className="text-xl font-black text-gray-900 tracking-tight">{title}</h4>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base">{text}</p>
        </div>
    );
}

function DriftingIcon({ icon, top, left, right, bottom, delay }) {
    return (
        <motion.div 
            animate={{ 
                y: [0, -15, 0],
                opacity: [0.1, 0.4, 0.1]
            }} 
            transition={{ duration: 6, repeat: Infinity, delay }}
            className="absolute text-emerald-600/30 pointer-events-none"
            style={{ top, left, right, bottom }}
        >
            {React.cloneElement(icon, { size: 32 })}
        </motion.div>
    );
}

function SKUCard({ name, category, bru, who, proves, burn, icon }) {
    return (
        <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 hover:border-emerald-500/40 transition-all group flex flex-col h-full shadow-sm">
            <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">Actively Mining</span>
                    <div className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">{bru}</div>
                </div>
            </div>
            
            <div className="mb-8">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] mb-1">{category}</div>
                <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">{name}</h3>
            </div>

            <div className="space-y-6 flex-1 text-sm border-t border-gray-50 pt-6">
                <div>
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Who buys this data</h4>
                    <p className="font-bold text-gray-700 leading-tight">{who}</p>
                </div>
                <div>
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">What it proves</h4>
                    <p className="text-gray-500 leading-relaxed">{proves}</p>
                </div>
                <div className="pt-4 border-t border-gray-50">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">Corporate Burn</h4>
                    <p className="font-black text-gray-900">{burn}</p>
                </div>
            </div>
        </div>
    );
}

function ArchitectureLayer({ title, point1, point2, point3, color }) {
    return (
        <div className={`${color} border w-full max-w-sm rounded-2xl p-6 shadow-sm relative z-20`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-black tracking-widest text-xs">{title}</h3>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
            </div>
            <ul className="space-y-2">
                <li className="flex items-center gap-3 text-[11px] font-bold">
                    <CircleCheckBig size={14} className="opacity-40" /> {point1}
                </li>
                <li className="flex items-center gap-3 text-[11px] font-bold">
                    <CircleCheckBig size={14} className="opacity-40" /> {point2}
                </li>
                <li className="flex items-center gap-3 text-[11px] font-bold">
                    <CircleCheckBig size={14} className="opacity-40" /> {point3}
                </li>
            </ul>
        </div>
    );
}

function ArchitectureArrow({ text, color }) {
    return (
        <div className="flex flex-col items-center py-2 h-16 relative z-10">
            <div className="w-px bg-current h-full" />
            <div className={`absolute top-1/2 -translate-y-1/2 left-4 text-[9px] font-black uppercase tracking-widest ${color}`}>
                {text}
            </div>
        </div>
    );
}

function PipelineRow({ name, cat, buyer, date }) {
    return (
        <tr className="hover:bg-gray-50 transition-colors group">
            <td className="py-5 px-8 font-black text-gray-900">{name}</td>
            <td className="py-5 px-8 text-gray-400 font-bold uppercase tracking-widest text-[9px]">{cat}</td>
            <td className="py-5 px-8 text-gray-600 text-xs font-medium">{buyer}</td>
            <td className="py-5 px-8 text-right font-black text-gray-900 text-xs">{date}</td>
        </tr>
    );
}

function MarketplaceRow({ stream, buyer, access, burn }) {
    return (
        <tr className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
            <td className="py-5 px-8 font-black text-gray-900 text-xs">{stream}</td>
            <td className="py-5 px-8 text-gray-400 text-xs">{buyer}</td>
            <td className="py-5 px-8 text-gray-400 font-bold uppercase tracking-widest text-[8px]">{access}</td>
            <td className="py-5 px-8 text-right font-black text-emerald-600 text-xs">{burn}</td>
        </tr>
    );
}
