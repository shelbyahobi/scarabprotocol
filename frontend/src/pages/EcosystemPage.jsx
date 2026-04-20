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
 * SCARAB Protocol — Ecosystem Page Rebuild v2
 * Focus: universal verification standard, flywheel economics, SKU pipeline.
 */

export default function EcosystemPage() {
    const location = useLocation();
    
    // Context detection: ?ctx=municipal or referrer based
    const searchParams = new URLSearchParams(location.search);
    const isMunicipalCtx = searchParams.get('ctx') === 'municipal';

    const heroSubheadline = isMunicipalCtx 
        ? "Every SCARAB device — whether it monitors solar panels, Bokashi fermentation, or water usage — uses the same tamper-proof verification method. A city that trusts our waste data automatically trusts our water data. One standard. Infinite applications."
        : "SCARAB standardises ATECC608A cryptographic attestation across all ecological output categories. Every new SKU added to the network strengthens the verification layer for all existing SKUs — and creates a new data stream that corporations access by burning SCARAB.";

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#1a1a1a] font-sans overflow-x-hidden">
            <Navbar />

            {/* ── SECTION 2A: Hero ── */}
            <section className="pt-32 pb-20 border-b border-gray-100 bg-white">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="text-[10px] font-black tracking-[4px] text-emerald-600 uppercase mb-4 block">
                            Cross-SKU Verification Layer
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
            <section className="py-24 bg-gray-50 border-b border-gray-100 overflow-hidden">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Why More SKUs = More Value</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">The more SKUs in the network, the more valuable every single device becomes.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Animated Flywheel Graphic */}
                        <div className="relative aspect-square flex items-center justify-center">
                            <motion.div 
                                animate={{ rotate: 360 }} 
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-[40px] border-emerald-500/5 rounded-full"
                            />
                            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-4">
                                <FlywheelNode text="New SKU Added" delay={0} icon={<Zap size={18}/>} />
                                <div className="h-4 w-px bg-emerald-200"></div>
                                <FlywheelNode text="Verified Data Stream" delay={0.1} icon={<Database size={18}/>} />
                                <div className="h-4 w-px bg-emerald-200"></div>
                                <FlywheelNode text="Corporate Buyers Unlock" delay={0.2} icon={<Building2 size={18}/>}/>
                                <div className="h-4 w-px bg-emerald-200 text-emerald-600">↓</div>
                                <FlywheelNode text="SCARAB Burned" delay={0.3} color="bg-emerald-600 text-white" icon={<Flame size={18}/>}/>
                                <div className="h-4 w-px bg-emerald-200"></div>
                                <FlywheelNode text="Token Supply Decreases" delay={0.4} icon={<TrendingUp size={18}/>}/>
                                <div className="h-4 w-px bg-emerald-200"></div>
                                <FlywheelNode text="Everyone Benefits" delay={0.5} icon={<Heart size={18}/>}/>
                            </div>
                            
                            {/* Orbital icons */}
                            <OrbitalIcon icon={<Tractor />} top="10%" left="15%" delay={2} />
                            <OrbitalIcon icon={<Droplets />} top="10%" right="15%" delay={5} />
                            <OrbitalIcon icon={<Wind />} bottom="15%" left="10%" delay={8} />
                            <OrbitalIcon icon={<Car />} bottom="10%" right="15%" delay={12} />
                        </div>

                        <div className="space-y-8">
                            <BenefitItem 
                                title="Cross-Validation Synergy" 
                                text="An AquaSentinel joining your cluster improves your Bokashi data's credibility — water usage patterns cross-validate fermentation activity." 
                            />
                            <BenefitItem 
                                title="Burning Scarcity Mechanism" 
                                text="Every new data category creates a new corporate buyer. Every corporate buyer burns SCARAB. Every burn raises the floor for farmers and operators already in the network." 
                            />
                            <BenefitItem 
                                title="Localized Network Density" 
                                text="You don't need to own every SKU type. Your Bokashi bucket benefits from every AirNode that joins your district." 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 2C: Phase 1 SKUs ── */}
            <section className="py-24 bg-white border-b border-gray-100 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Active Infrastructure</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Phase 1 SKUs Currently Mining</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <SKUCard 
                            name="Solar Sentinel V1"
                            category="Renewable Energy"
                            bru="650 BRU/year"
                            status="Actively Mining"
                            buys="Energy utilities, ESG funds, Renewable Energy Certificate registries"
                            proves="kWh generated per device, irradiance-adjusted, ECDSA-signed at source"
                            burn="Burns 10 SCARAB per month per device licensed"
                            icon={<Zap className="text-amber-500" size={32} />}
                        />
                        <SKUCard 
                            name="Smart Bokashi Kit"
                            category="Organic Waste"
                            bru="120 BRU/year"
                            status="Actively Mining"
                            buys="Agricultural research institutions, municipalities (waste planning), SAF feedstock brokers (UCO variant)"
                            proves="kg of organic waste diverted from landfill, fermentation quality score, chain of custody to Hub"
                            burn="Burns 5 SCARAB per month per H3 cluster licensed"
                            icon={<Shovel className="text-emerald-500" size={32} />}
                        />
                        <SKUCard 
                            name="Pro Bioreactor"
                            category="Industrial Waste"
                            bru="4,500 BRU/year"
                            status="Actively Mining"
                            buys="Industrial composting operators, soil amendment manufacturers, carbon registries"
                            proves="Tonne-scale waste processing, soil output volume, CO₂ sequestration (ISCC methodology)"
                            burn="Burns 50 SCARAB per month per facility licensed"
                            icon={<Warehouse className="text-blue-500" size={32} />}
                        />
                    </div>
                </div>
            </section>

            {/* ── SECTION 2D: Security Architecture ── */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black mb-4">Silicon-to-Chain Security</h2>
                        <p className="text-gray-400 text-lg">A unified cryptographic language for all ecological data.</p>
                    </div>

                    {/* Three-Layer Diagram (SVG) */}
                    <div className="relative py-12">
                        <div className="flex flex-col gap-0">
                            <LayerBlock 
                                title="SILICON LAYER"
                                items={["ATECC608A Secure Element", "Private key generated on-chip", "Never extractable — ever", "Factory provisioned, not internet"]}
                                color="border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                            />
                            <div className="flex justify-center -my-1 h-12 relative z-10">
                                <div className="w-px bg-emerald-500/20 h-full flex items-center justify-center">
                                    <ArrowRight size={16} className="rotate-90 text-emerald-500" />
                                </div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-mono text-emerald-500/50 uppercase tracking-widest hidden md:block">
                                    ECDSA P-256 signature
                                </div>
                            </div>
                            <LayerBlock 
                                title="LOGIC LAYER"
                                items={["ESP32-S3 Firmware", "Signs telemetry payload", "Transmits via LoRa → SQS", "Cannot spoof — chip won't sign data it didn't generate"]}
                                color="border-blue-500/30 bg-blue-500/5 text-blue-400"
                            />
                            <div className="flex justify-center -my-1 h-12 relative z-10">
                                <div className="w-px bg-blue-500/20 h-full flex items-center justify-center">
                                    <ArrowRight size={16} className="rotate-90 text-blue-500" />
                                </div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-mono text-blue-500/50 uppercase tracking-widest hidden md:block">
                                    Verified submission
                                </div>
                            </div>
                            <LayerBlock 
                                title="PROTOCOL LAYER"
                                items={["Oracle Worker", "verifySignature() — rejects invalid pubkeys", "On-chain: hash + aggregate only", "Cryptographically immutable ledger"]}
                                color="border-purple-500/30 bg-purple-500/5 text-purple-400"
                            />
                        </div>
                    </div>

                    <p className="mt-12 text-center text-gray-400 text-sm leading-relaxed max-w-3xl mx-auto italic">
                        "A Solar Sentinel and a Bokashi Kit communicate in the exact same mathematical language. When a municipality trusts one SCARAB device, they implicitly trust the entire network's verification methodology."
                    </p>
                </div>
            </section>

            {/* ── SECTION 2E: Phase 2 Pipeline ── */}
            <section className="py-24 bg-white border-b border-gray-100 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Pipeline Protocol</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Future SKUs in Development</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="py-4 pr-6 font-black text-gray-900 uppercase tracking-widest text-[10px]">SKU</th>
                                    <th className="py-4 pr-6 font-black text-gray-900 uppercase tracking-widest text-[10px]">Category</th>
                                    <th className="py-4 pr-6 font-black text-gray-900 uppercase tracking-widest text-[10px]">Who buys the data</th>
                                    <th className="py-4 font-black text-gray-900 uppercase tracking-widest text-[10px] text-right">Target Pilot</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <PipelineRow name="AquaSentinel" cat="Water" buyer="Water utilities, insurance, drought-risk funds" pilot="Q4 2026" />
                                <PipelineRow name="AirNode" cat="AQI / Air Quality" buyer="City planning, health insurers, real estate" pilot="Q1 2027" />
                                <PipelineRow name="SoilSentinel" cat="Regen Carbon" buyer="Carbon registries, ag land funds" pilot="Q2 2027" />
                                <PipelineRow name="PowerVault" cat="Battery efficiency" buyer="Grid operators, EV fleet managers" pilot="Q2 2027" />
                                <PipelineRow name="ChargeNode" cat="EV Charging" buyer="Charge networks, fleet ESG reporting" pilot="Q3 2027" />
                                <PipelineRow name="CarbonVault" cat="Industrial CO₂" buyer="Industrial emitters, compliance buyers" pilot="Q4 2027" />
                                <tr>
                                    <td colSpan={4} className="py-8">
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
                                            <p className="text-emerald-800 font-bold mb-3">Building in one of these categories?</p>
                                            <a href="mailto:protocol@scarabprotocol.org" className="text-emerald-600 font-black flex items-center justify-center gap-2 hover:underline">
                                                Apply to integrate your hardware <ArrowRight size={14}/>
                                            </a>
                                        </div>
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
                        <h2 className="text-3xl font-black text-gray-900 mb-4">The Data Marketplace</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Every data stream has a buyer. Every buyer burns SCARAB.</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="py-5 px-8 font-black text-gray-700 uppercase tracking-[2px] text-[10px]">Data Stream</th>
                                    <th className="py-5 px-8 font-black text-gray-700 uppercase tracking-[2px] text-[10px]">Buyer Type</th>
                                    <th className="py-5 px-8 font-black text-gray-700 uppercase tracking-[2px] text-[10px]">Access Model</th>
                                    <th className="py-5 px-8 font-black text-emerald-600 uppercase tracking-[2px] text-[10px] text-right">SCARAB Burned</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-medium">
                                <MarketplaceRow stream="Solar kWh (device-level)" buyer="Utilities, REC registries" access="Per device / mo" burn="10 SCARAB" />
                                <MarketplaceRow stream="Bokashi kg (cluster-level)" buyer="Municipalities, Agri-Research" access="Per H3 cluster / mo" burn="5 SCARAB" />
                                <MarketplaceRow stream="UCO provenance (batch)" buyer="SAF manufacturers, ISCC" access="Per batch verified" burn="25 SCARAB" />
                                <MarketplaceRow stream="Bioreactor output (facility)" buyer="Indo-composters, Carbon" access="Per facility / mo" burn="50 SCARAB" />
                                <MarketplaceRow stream="AQI readings (district)" buyer="City planning, Health insurers" access="Per district / mo" burn="15 SCARAB" />
                                <tr className="bg-emerald-600 text-white font-bold">
                                    <td className="py-5 px-8">Multi-stream bundle</td>
                                    <td className="py-5 px-8">ESG funds, Impact investors</td>
                                    <td className="py-5 px-8">Custom Enterprise</td>
                                    <td className="py-5 px-8 text-right">Custom Burn Schedule</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-8 text-center text-[11px] text-gray-400 font-bold uppercase tracking-[2px]">
                        All SCARAB burned for data access is permanently removed from circulation. No team allocation. No re-minting.
                    </p>
                </div>
            </section>

            {/* Standard Footer */}
            <footer className="py-20 border-t border-gray-100 text-center bg-white">
                <div className="container mx-auto px-6">
                    <p className="text-[11px] font-black text-gray-300 uppercase tracking-[4px]">SCARAB Protocol Ecosystem v2.0</p>
                    <p className="mt-2 text-xs text-gray-400">© {new Date().getFullYear()} SCARAB UG (Haftungsbeschränkt). Germany.</p>
                </div>
            </footer>
        </div>
    );
}

/* ────────── Subcomputes ────────── */

function FlywheelNode({ text, delay, color = "bg-white text-gray-700", icon }) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            className={`px-6 py-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 font-bold text-sm ${color}`}
        >
            {icon}
            {text}
        </motion.div>
    );
}

function OrbitalIcon({ icon, top, left, right, bottom, delay }) {
    return (
        <motion.div 
            animate={{ 
                y: [0, -10, 0],
                opacity: [0.3, 0.6, 0.3]
            }} 
            transition={{ duration: 4, repeat: Infinity, delay }}
            className="absolute text-emerald-600/20 pointer-events-none"
            style={{ top, left, right, bottom }}
        >
            {React.cloneElement(icon, { size: 40 })}
        </motion.div>
    );
}

function BenefitItem({ title, text }) {
    return (
        <div className="space-y-2">
            <h4 className="text-lg font-black text-gray-900">{title}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
        </div>
    );
}

function SKUCard({ name, category, bru, status, buys, proves, burn, icon }) {
    return (
        <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 hover:border-emerald-500 transition-colors group h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">{status}</span>
                    <span className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[2px]">{bru}</span>
                </div>
            </div>
            
            <div className="mb-8">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">{category}</span>
                <h3 className="text-2xl font-black text-gray-900 leading-tight">{name}</h3>
            </div>

            <div className="space-y-6 flex-1 text-sm">
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Who buys this data</h4>
                    <p className="font-bold text-gray-700 leading-relaxed">{buys}</p>
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">What it proves</h4>
                    <p className="text-gray-500 leading-relaxed">{proves}</p>
                </div>
                <div className="pt-4 border-t border-gray-50">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Corporate Burn</h4>
                    <p className="font-black text-gray-900">{burn}</p>
                </div>
            </div>
        </div>
    );
}

function LayerBlock({ title, items, color }) {
    return (
        <div className={`${color} border rounded-2xl p-6 shadow-sm relative z-20`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-black tracking-widest text-sm underline underline-offset-4 decoration-current/30">{title}</h3>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
            </div>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-bold leading-relaxed">
                        <CircleCheckBig size={12} className="opacity-40" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function PipelineRow({ name, cat, buyer, pilot }) {
    return (
        <tr className="hover:bg-gray-50/50 transition-colors group">
            <td className="py-5 pr-6 font-black text-gray-900 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-emerald-500 transition-colors"></div>
                {name}
            </td>
            <td className="py-5 pr-6 text-gray-400 font-bold uppercase tracking-widest text-[10px]">{cat}</td>
            <td className="py-5 pr-6 text-gray-600 text-xs font-medium">{buyer}</td>
            <td className="py-5 font-black text-gray-900 text-right text-xs">{pilot}</td>
        </tr>
    );
}

function MarketplaceRow({ stream, buyer, access, burn }) {
    return (
        <tr className="hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0 text-xs">
            <td className="py-5 px-8 font-black text-gray-900">{stream}</td>
            <td className="py-5 px-8 text-gray-500">{buyer}</td>
            <td className="py-5 px-8 text-gray-400 font-bold uppercase tracking-widest text-[9px]">{access}</td>
            <td className="py-5 px-8 text-right font-black text-emerald-600">{burn}</td>
        </tr>
    );
}
