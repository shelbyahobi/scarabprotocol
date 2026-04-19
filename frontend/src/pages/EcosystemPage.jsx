import React from 'react';
import { motion } from 'framer-motion';
import { 
    Users, Tractor, Warehouse, Landmark, Building2, 
    Zap, RefreshCw, BarChart3, TrendingUp, Heart, 
    ArrowRight, Activity, Database, Flame, CircleCheckBig
} from 'lucide-react';
import Navbar from '../components/Navbar';

/*
 * SCARAB Protocol — Stakeholder Ecosystem Page
 * Explains network effects, burn mechanism, and stakeholder value.
 */

export default function EcosystemPage() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] text-[#1a1a1a] font-sans overflow-x-hidden">
            <Navbar />

            {/* Hero / Vision */}
            <section className="pt-32 pb-20 border-b border-gray-100 bg-white">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                        <span className="text-xs font-black tracking-[5px] text-emerald-600 uppercase mb-4 block">
                            Collective Value Creation
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
                            The more people join, the stronger the <span className="text-emerald-600">network</span>.
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            SCARAB is a shared infrastructure layer. Every new household, farmer, and district increases the statistical confidence and value of the whole ecosystem.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Flywheel Section (Visual) */}
            <section className="py-24 bg-gray-50 border-b border-gray-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black mb-4">The SCARAB Value Flywheel</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">A self-sustaining loop of physical verification and token scarcity.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 py-12 px-6 bg-white border border-gray-200 rounded-[3rem] shadow-sm overflow-hidden relative">
                         {/* Subtle bg lines */}
                         <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                            <Activity className="absolute top-10 left-10" size={300} />
                         </div>

                        <FlywheelStep 
                             icon={<Users className="text-blue-500" />} 
                             title="Households Submit" 
                             desc="Data points generated" 
                        />
                         <ArrowRight className="hidden md:block text-gray-200" size={32} />
                        <FlywheelStep 
                             icon={<Tractor className="text-emerald-500" />} 
                             title="Farmers Collect" 
                             desc="Efficiency ratios rise" 
                        />
                         <ArrowRight className="hidden md:block text-gray-200" size={32} />
                        <FlywheelStep 
                             icon={<Warehouse className="text-amber-500" />} 
                             title="Hubs Aggregate" 
                             desc="Batch verification" 
                        />
                         <ArrowRight className="hidden md:block text-gray-200" size={32} />
                        <FlywheelStep 
                             icon={<Landmark className="text-purple-500" />} 
                             title="Municipalities Validate" 
                             desc="Legitimacy created" 
                        />
                         <ArrowRight className="hidden md:block text-gray-200" size={32} />
                        <FlywheelStep 
                             icon={<Flame className="text-red-500" />} 
                             title="SCARAB Burned" 
                             desc="Value floor rises" 
                        />
                    </div>
                </div>
            </section>

            {/* Spoke Layout: Stakeholder Cards */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        {/* Spoke 1: Households */}
                        <StakeholderCard 
                             icon={<Heart size={32} />} 
                             title="Households / Bio Consumers" 
                             sub="The Foundation"
                             join="Submit Bokashi or UCO waste. Clean their footprint."
                             get="EUR rewards (fiat mode) or SCARAB tokens (growth mode)."
                             network="Every household adds a verified data point, increasing regional confidence which drives corporate data interest."
                             color="bg-blue-50 border-blue-100 text-blue-900 icon-blue"
                        />

                        {/* Spoke 2: Farmers */}
                        <StakeholderCard 
                             icon={<Tractor size={32} />} 
                             title="Collection Farmers" 
                             sub="The Proof"
                             join="Register as a collection farmer. Use existing logistics."
                             get="40% of the submission value per collected batch."
                             network="Denser clusters = shorter travel distances = higher efficiency ratios = higher multiplier rewards."
                             color="bg-emerald-50 border-emerald-100 text-emerald-900 icon-emerald"
                        />

                        {/* Spoke 3: Hubs */}
                        <StakeholderCard 
                             icon={<Warehouse size={32} />} 
                             title="Hub Operators" 
                             sub="The Anchor"
                             join="Host a Hub node (commercial address, 50 SCARAB stake)."
                             get="10% of handoffs + Solar Sentinel (BRU) rewards."
                             network="More Hubs = smaller radii = faster cycle times = better fill rate data = higher municipal confidence."
                             color="bg-amber-50 border-amber-100 text-amber-900 icon-amber"
                        />

                        {/* Spoke 4: Municipalities */}
                        <StakeholderCard 
                             icon={<Landmark size={32} />} 
                             title="Municipalities" 
                             sub="The Regulator"
                             join="Designate drop-off points, communicate to residents."
                             get="Verified waste data, CO₂ certificates, resident tools."
                             network="Municipal adoption legitimises the data for corporate buyers, unlocking the burn mechanism at scale."
                             color="bg-purple-50 border-purple-100 text-purple-900 icon-purple"
                        />

                        {/* Spoke 5: Corporate Partners */}
                        <StakeholderCard 
                             icon={<Building2 size={32} />} 
                             title="Corporate / Industrial" 
                             sub="The Purchaser"
                             join="Burn SCARAB to access verified provenance data."
                             get="Verified UCO for SAF, Bokashi for fertiliser data."
                             network="Corporate demand creates sustained buy-and-burn pressure, raising the token floor for everyone."
                             color="bg-red-50 border-red-100 text-red-900 icon-red"
                        />

                        {/* Spoke 6: Protocol Core */}
                        <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-10 text-white flex flex-col justify-center">
                             <div className="w-16 h-16 bg-[#1D9E75] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-600/20">
                                 <RefreshCw size={32} />
                             </div>
                             <h3 className="text-2xl font-black mb-4 tracking-tighter">SCARAB Protocol</h3>
                             <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                 The neutral, hardware-attested reconciliation layer. We don't own the data or the waste — we own the proof of the lifecycle.
                             </p>
                             <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#1D9E75]">
                                 <TrendingUp size={16} /> Deflationary Growth
                             </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Trust Footer */}
            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <Database className="mx-auto text-emerald-600 mb-8" size={64} />
                    <h2 className="text-3xl font-black mb-6">The Real World Infrastructure Coin</h2>
                    <p className="text-lg text-gray-500 leading-relaxed mb-10">
                        Unlike speculative assets, SCARAB value is tethered to the physical cost of waste management and the legal necessity for sustainability data.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <TrustBadge text="Hardware Verified" />
                        <TrustBadge text="EU GDPR Compliant" />
                        <TrustBadge text="IPCC Tier 1 Aligned" />
                    </div>
                </div>
            </section>

            {/* Standard Footer */}
            <footer className="py-12 border-t border-gray-100 text-center bg-white">
                <p className="text-[11px] font-black text-gray-300 uppercase tracking-[4px]">Ecosystem Architecture 1.0</p>
                <p className="mt-2 text-xs text-gray-400">© {new Date().getFullYear()} SCARAB Protocol.</p>
            </footer>
        </div>
    );
}

/* ────────── Subcomputes ────────── */

function FlywheelStep({ icon, title, desc }) {
    return (
        <div className="text-center group">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all">
                {icon}
            </div>
            <h4 className="text-sm font-black text-gray-900 mb-1">{title}</h4>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{desc}</p>
        </div>
    );
}

function StakeholderCard({ icon, title, sub, join, get, network, color }) {
    return (
        <div className={`${color} border rounded-[2.5rem] p-10 flex flex-col shadow-sm hover:shadow-md transition-shadow`}>
            <div className="mb-6">{icon}</div>
            <div className="mb-8">
                 <span className="text-[10px] font-black uppercase tracking-[3px] opacity-40 mb-2 block">{sub}</span>
                 <h3 className="text-2xl font-black tracking-tighter leading-tight">{title}</h3>
            </div>
            
            <div className="space-y-6 flex-1">
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-2">How to Join</h4>
                    <p className="text-sm font-bold leading-relaxed">{join}</p>
                </div>
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-2">Primary Value</h4>
                    <p className="text-sm font-black leading-relaxed">{get}</p>
                </div>
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest opacity-40 mb-2">Network Effect</h4>
                    <p className="text-xs font-medium leading-relaxed opacity-60 italic">{network}</p>
                </div>
            </div>
        </div>
    );
}

function TrustBadge({ text }) {
    return (
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-full text-xs font-black text-gray-700 shadow-sm">
            <CircleCheckBig className="text-emerald-600" size={16} />
            {text}
        </div>
    );
}
