import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
    Users, Tractor, Warehouse, Landmark, Building2, 
    Zap, RefreshCw, BarChart3, TrendingUp, Heart, 
    ArrowRight, Activity, Database, Flame, CircleCheckBig,
    Droplets, Wind, Shovel, Battery, Car, CloudLightning, ChevronDown
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { PHASE_1_SKUS, PHASE_2_SKUS, SKU_REGISTRY, BRU_EUR_RATE } from '../data/skuRegistry';

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
    
    // Calculate unique categories from all active and planned SKUs
    const uniqueCategories = new Set(SKU_REGISTRY.map(sku => sku.category)).size;

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans overflow-x-hidden">
            <Navbar />

            {/* ── SECTION 1: Hero ── */}
            <section className="pt-32 pb-20 border-b border-gray-100 bg-white px-6">
                <div className="container mx-auto max-w-5xl text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="text-[10px] font-black tracking-[4px] text-emerald-600 uppercase mb-4 block">
                            The Universal Verification Standard
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-[1.05]">
                            One cryptographic standard.<br/>
                            Every category of ecological output.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium mb-8">
                            SCARAB standardises hardware-attested verification across energy production, biological waste, food safety compliance, biodiversity, water, air, and industrial carbon capture. Every SKU speaks the same mathematical language. Every dataset burns SCARAB to access. The network grows stronger with every category added.
                        </p>
                        <p className="text-md font-bold text-gray-400 uppercase tracking-widest">
                            Phase 1: {PHASE_1_SKUS.length} active and pilot SKUs across {uniqueCategories} ecological categories. Phase 2: {PHASE_2_SKUS.length} planned vectors. No ceiling on categories — the protocol absorbs any verifiable ecological output.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── SECTION 2: Phase 1 SKUs ── */}
            <section className="py-24 bg-gray-50 border-b border-gray-100 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Active Infrastructure</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Phase 1 SKUs Currently Mining</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {PHASE_1_SKUS.map(sku => (
                            <SKUCard key={sku.id} sku={sku} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: BRU Explanation ── */}
            <section className="py-24 bg-white px-6">
                <div className="container mx-auto max-w-4xl">
                    <BRUExplanationPanel />
                </div>
            </section>

            {/* ── SECTION 4: Security Architecture ── */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Zero-Trust Firmware Execution</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">Our strongest technical differentiator: siloed silicon keys.</p>
                    </div>

                    <div className="relative py-12 flex justify-center">
                        <div className="flex flex-col gap-0 items-center w-full max-w-sm">
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
                        "This means a Solar Sentinel, a Bokashi Kit, an AgriSentinel Pro, and a UCO Collection Node all use the same verification oracle. One audit covers the entire network."
                    </div>
                </div>
            </section>

            {/* ── SECTION 5: Phase 2 Planned SKUs ── */}
            <section className="py-24 bg-gray-50 border-b border-gray-100 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Ecosystem Pipeline</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Future SKUs in Development</p>
                    </div>

                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                        {PHASE_2_SKUS.map(sku => (
                            <div key={sku.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-center">
                                <div className="text-3xl mb-3">{sku.icon}</div>
                                <h4 className="font-black text-gray-900 mb-1">{sku.name}</h4>
                                <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">{sku.category}</div>
                                <div className="text-sm font-bold text-gray-900 mb-1">€{sku.price_eur}</div>
                                <div className="text-xs text-emerald-600 font-bold">{sku.statusLabel}</div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                        <p className="text-gray-500 font-bold mb-3">Building hardware in one of these categories?</p>
                        <a href="mailto:protocol@scarabprotocol.org" className="text-emerald-600 font-black flex items-center justify-center gap-2 hover:underline">
                            Apply to integrate your device into the SCARAB verification standard <ArrowRight size={14}/>
                        </a>
                    </div>
                </div>
            </section>

            {/* ── SECTION 6: Data Marketplace ── */}
            <section className="py-24 bg-white px-6">
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
                                {PHASE_1_SKUS.map(sku => (
                                    <MarketplaceRow 
                                        key={sku.id}
                                        stream={sku.category} 
                                        buyer={sku.data_buyers.join(', ')} 
                                        access="Per device / month" 
                                        burn={`${sku.scarab_burn_per_month} SCARAB`} 
                                    />
                                ))}
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
            <footer className="py-20 border-t border-gray-100 text-center bg-gray-50 px-6">
                <div className="container mx-auto">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">SCARAB Protocol Ecosystem v3.0</p>
                    <p className="mt-2 text-xs text-gray-500">© {new Date().getFullYear()} SCARAB UG (Haftungsbeschränkt). Germany.</p>
                </div>
            </footer>
        </div>
    );
}

/* ────────── Subcomputes ────────── */

function SKUCard({ sku }) {
    const statusColor = sku.status === 'active' ? 'emerald' : sku.status === 'pilot' ? 'amber' : 'gray';

    return (
        <div id={sku.id} className="bg-white border border-gray-200 rounded-[2.5rem] p-8 hover:border-emerald-500/40 transition-all shadow-sm flex flex-col h-full scroll-mt-24">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="text-4xl">{sku.icon}</div>
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">{sku.category}</div>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">{sku.name}</h3>
                    </div>
                </div>
            </div>
            
            <div className="mb-6 flex gap-2 items-center text-xs font-bold">
                <span className={`bg-${statusColor}-100 text-${statusColor}-700 px-3 py-1 rounded-full uppercase tracking-wider`}>
                    {sku.statusLabel}
                </span>
                <span className="text-gray-900 font-black text-lg ml-auto">€{sku.price_eur}</span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{sku.description}</p>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-sm">
                <div className="font-black text-gray-900">{sku.bru_year.toLocaleString()} BRU/year</div>
                {sku.bru_unit_value && <div className="text-gray-500 text-xs">1 BRU = {sku.bru_unit_value} {sku.bru_unit}</div>}
                {sku.fiat_reward_rate_eur && (
                    <div className="text-emerald-600 font-bold mt-2">
                        Earns €{sku.fiat_reward_rate_eur} {sku.fiat_reward_unit}
                    </div>
                )}
            </div>

            <div className="space-y-4 text-xs">
                <div>
                    <h4 className="font-black uppercase tracking-widest text-gray-400 mb-2">Compliance</h4>
                    <div className="flex flex-wrap gap-2">
                        {sku.compliance.map(c => <span key={c} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{c}</span>)}
                    </div>
                </div>
                <div>
                    <h4 className="font-black uppercase tracking-widest text-gray-400 mb-2">Data sold to:</h4>
                    <div className="flex flex-wrap gap-2">
                        {sku.data_buyers.map(b => <span key={b} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-medium">{b}</span>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

function BRUExplanationPanel() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-gray-900 text-white rounded-3xl overflow-hidden shadow-lg">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
            >
                <div>
                    <h3 className="text-2xl font-black mb-1">What is a BRU?</h3>
                    <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Biological Regeneration Unit</p>
                </div>
                <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={24} className="text-gray-400" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8"
                    >
                        <p className="text-gray-400 leading-relaxed mb-6">
                            BRU (Biological Regeneration Unit) is the universal unit of verified ecological output across all SCARAB devices. It converts different types of ecological work into a common measure. The current modelled rate is <strong className="text-emerald-400">€{BRU_EUR_RATE} per BRU</strong>. Multipliers (cluster, efficiency, activity, stake) can reach 9×.
                        </p>
                        
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
                            <div className="font-mono text-center text-lg font-bold">
                                Annual EUR = BRU/year × rate × multipliers
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-300">Worked Examples (Phase 1 SKUs)</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                {PHASE_1_SKUS.slice(0, 4).map(sku => (
                                    <div key={sku.id} className="bg-black/50 p-4 rounded-xl border border-white/5">
                                        <div className="font-bold mb-1">{sku.name}</div>
                                        <div className="text-gray-400 font-mono text-xs">
                                            {sku.bru_year.toLocaleString()} BRU × €{BRU_EUR_RATE} = <span className="text-emerald-400 font-bold">€{(sku.bru_year * BRU_EUR_RATE).toFixed(2)}/yr base</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
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
