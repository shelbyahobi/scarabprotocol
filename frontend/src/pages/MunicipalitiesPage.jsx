import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    CheckCircle, Shield, BarChart3, Users, Zap, RefreshCw, 
    Trash2, ClipboardCheck, ArrowRight, LayoutDashboard, 
    Lock, Eye, Database, Globe2, Sun, HeartCircle, 
    PackageSearch, Info, Languages, MapPin
} from 'lucide-react';
import Navbar from '../components/Navbar';

/*
 * SCARAB Protocol — Municipal Page Rebuild
 * Institutional focus: transparency, hardware lifecycle (Pfand), resident incentives.
 */

export default function MunicipalitiesPage() {
    const [formData, setFormData] = useState({
        city_name: '',
        contact_name: '',
        role: '',
        email: '',
        district_population: '',
        preferred_location_type: 'Recycling depot',
        drop_off_sites_count: 3,
        incentives_interest: 'Tell me more',
        contact_language: 'German'
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/municipality/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) setSubmitted(true);
        } catch (err) {
            // Silently handle submission errors for the demo
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1a1a1a] font-sans">
            <Navbar />

            {/* 1A. Hero — Partner With Us */}
            <section className="relative pt-32 pb-24 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <span className="text-xs font-bold tracking-[4px] text-emerald-600 uppercase mb-4 block">
                                Partners In Municipal Infrastructure
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                                Partner with us. Your district <span className="text-emerald-600">provides the network</span>. We provide the verification.
                            </h1>
                            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                                SCARAB asks for three things from a pilot municipality. In return, your district gains verified waste data, CO₂ certificates, and a new incentive layer for residents.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-200">
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">?</span>
                                What we ask from you
                            </h3>
                            <ul className="space-y-6">
                                <WhatItem icon={<MapPin className="text-emerald-600" size={20} />} text="Designate 2–5 drop-off points (existing locations — parking bays, recycling depots, community centres)" />
                                <WhatItem icon={<Users className="text-emerald-600" size={20} />} text="Communicate the programme to residents (one letter or app notification)" />
                                <WhatItem icon={<ClipboardCheck className="text-emerald-600" size={20} />} text="Sign a GDPR Data Processing Agreement" />
                            </ul>
                        </div>
                        <div className="p-8 md:p-12 bg-white">
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">✓</span>
                                What you get back
                            </h3>
                            <ul className="space-y-6">
                                <WhatItem icon={<LayoutDashboard className="text-emerald-600" size={20} />} text="Real-time dashboard of waste diversion by district — see participation by H3 cell heatmap." />
                                <WhatItem icon={<ClipboardCheck className="text-emerald-600" size={20} />} text="Monthly PDF compliance reports for Kreislaufwirtschaftsgesetz." />
                                <WhatItem icon={<Globe2 className="text-emerald-600" size={20} />} text="CO₂ avoidance certificates (ISCC methodology, certification in progress)." />
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400 font-bold tracking-wide italic">
                            No new infrastructure. No software integration. No upfront cost during the pilot phase.
                        </p>
                    </div>
                </div>
            </section>

            {/* 1B. Hardware Lifecycle — Pfand Model */}
            <section className="py-24 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Zero maintenance burden.</h2>
                        <p className="text-gray-500 text-lg">Broken hardware is replaced automatically via our Pfand-style replacement model.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <StepCard 
                            num="1" 
                            title="Issue" 
                            icon={<PackageSearch size={28} />}
                            desc="Resident collects a SCARAB-branded smart bucket. QR code activation links it to their account."
                        />
                        <StepCard 
                            num="2" 
                            title="Use" 
                            icon={<Trash2 size={28} />}
                            desc="Sensor logs weight, timestamp and location (H3 cell). Data cryptographically signed on-chip."
                        />
                        <StepCard 
                            num="3" 
                            title="Return & Replace" 
                            icon={<RefreshCw size={28} />}
                            desc="Return bucket to drop-off. Hub scans, deactivates old chip, and issues a fresh bucket instantly."
                        />
                        <StepCard 
                            num="4" 
                            title="Broken Sensor" 
                            icon={<Info size={28} />}
                            desc="Staff trigger DeviceRegistry.deactivate(). New device is issued. Account retains all historical data."
                        />
                    </div>

                    <div className="mt-16 bg-emerald-50 border border-emerald-200 rounded-2xl p-8 flex items-start gap-6">
                        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-emerald-900 mb-2">Pfand Mechanic Advantage</h4>
                            <p className="text-emerald-800 leading-relaxed">
                                The municipality never handles hardware maintenance. Drop-off staff follow a simple **3-step scan-and-swap procedure** that takes under 2 minutes. The old chip's signatures are permanently rejected by the oracle upon deactivation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1C. What SCARAB Collects — Full Transparency */}
            <section className="py-24 bg-gray-50 border-b border-gray-100 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Focus on Transparency</h2>
                        <p className="text-gray-500">Here is exactly what we collect, what we don't, and who can access it.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-widest text-gray-900">What we collect</th>
                                    <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-widest text-red-600">What we do NOT collect</th>
                                    <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-widest text-emerald-600">Who can access it</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                <Trow collect="Weight of deposit (kg)" noCollect="Exact GPS coordinates" access="Public aggregate: anyone" />
                                <Trow collect="Timestamp of deposit" noCollect="Resident name or identity" access="District data: your municipality only" />
                                <Trow collect="H3 spatial cell (≈10km² area)" noCollect="Photos or biometric data" access="Corporate partners (burn required)" />
                                <Trow collect="Waste category (Bokashi / UCO)" noCollect="Bank or payment details" access="Raw telemetry: enterprise API only" />
                                <Trow collect="Pseudonymous hardware hash (Device ID)" noCollect="Any data outside your district" access="SCARAB Governance (limited)" />
                                <Trow collect="Logistics efficiency (Cell-to-cell distance)" noCollect="In-home household details" access="Auditors (ISCC / Gold Standard)" />
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-10 flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-2xl text-xs text-gray-400 font-medium">
                        <Lock size={16} className="mt-0.5 flex-shrink-0" />
                        <p className="leading-relaxed">
                            <strong>GDPR Compliance:</strong> All data is processed on Hetzner Cloud infrastructure in Frankfurt, Germany. A standard EU Data Processing Agreement is signed before any data access is granted. Residents are identified only by a pseudonymous device ID — never by name or address.
                        </p>
                    </div>
                </div>
            </section>

            {/* 1D. Data Pricing */}
            <section className="py-24 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Model of Open Access</h2>
                        <p className="text-gray-500 text-lg">How data access is priced — and where the value goes.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <PriceCard 
                             title="Free — Public Aggregate"
                             price="€0"
                             desc="Total devices active, total waste processed (kg), total CO₂ avoided. Updated hourly. No registration required. Embeddable widget for your city website."
                             tag="Community"
                        />
                        <PriceCard 
                             title="Municipal Dashboard"
                             price="€200–500/mo"
                             desc="District-scoped device data, participation rates, fill curves, monthly PDF reports. Subscription fee is converted to SCARAB and burned to strengthen the token floor."
                             tag="Most Popular"
                             pilotFree
                        />
                        <PriceCard 
                             title="Corporate Feedstock Provenance"
                             price="SCARAB Burn"
                             desc="Verified data for SAF buyers, ESG funds, and UCO processors. Access requires burning a defined amount of SCARAB per API call. Drives token scarcity."
                             tag="Enterprise"
                        />
                        <PriceCard 
                             title="Industrial Integration"
                             price="Custom"
                             desc="Real-time telemetry feed for industrial waste management integrations. Priority support and custom API endpoints."
                             tag="Custom"
                        />
                    </div>

                    <div className="mt-12 text-center max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-xl">
                        <p className="text-sm leading-relaxed opacity-90">
                            When municipalities and corporations pay for data, that **value flows directly to SCARAB holders and active miners through token scarcity** — not to a central company. The more cities that join, the stronger the network becomes for every participant.
                        </p>
                    </div>
                </div>
            </section>

            {/* 1E. Solar Node Integration */}
            <section className="py-24 bg-emerald-900 text-white overflow-hidden relative">
                <Sun className="absolute top-[-40px] right-[-40px] text-white/5" size={400} />
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black mb-6">Off-Grid Hub Intelligence</h2>
                        <p className="text-emerald-100/70 text-lg">Solar nodes at Hub locations do more than generate energy — they provide a physical anchor for verification.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold flex items-center gap-3">
                                <CheckCircle className="text-emerald-400" size={20} />
                                Off-grid Hub Operation
                            </h4>
                            <p className="text-emerald-100/60 leading-relaxed text-sm">
                                Solar Sentinel units power Hub hardware without grid connection — no electricity cost for the host location, no dependency on municipal energy contracts.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold flex items-center gap-3">
                                <CheckCircle className="text-emerald-400" size={20} />
                                Irradiance Cross-Validation
                            </h4>
                            <p className="text-emerald-100/60 leading-relaxed text-sm">
                                Solar data from Hubs cross-validates Bokashi fermentation activity (which is temperature-dependent). This adds a second independent verification layer, making your district's CO₂ certificates legally defensible.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1F. Resident Incentive Layer */}
            <section className="py-24 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 mb-6">Resident Incentives</h2>
                        <p className="text-gray-500 text-lg">Your residents have a reason to participate — and you retain full control of the incentive structure.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <IncentiveModel 
                             label="Model A"
                             title="Direct EUR Reward"
                             desc="Residents receive euro payments per kg of verified waste submitted. SCARAB Protocol handles settlement. Municipality pays nothing — the farmer fee covers it."
                        />
                        <IncentiveModel 
                             label="Model B"
                             title="Abfallgebühr Discount"
                             desc="Municipality offers a discount on the annual waste fee for participating households. SCARAB provides verified participation proof to justify the discount."
                        />
                        <IncentiveModel 
                             label="Model C"
                             title="Community Pool"
                             desc="Households collectively earn towards a district-level reward (e.g. community garden fund). SCARAB provides the tonnage proof; you decide the reward."
                        />
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            All three models use the same verified data. The incentive design is yours — we provide the proof.
                        </p>
                    </div>
                </div>
            </section>

            {/* 1G. Bokashi Loop / Bran Drop-off */}
            <section className="py-24 bg-gray-50 px-6">
                <div className="container mx-auto max-w-4xl bg-white border border-gray-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6">
                           <RefreshCw size={14} /> Closed Loop
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight">Closing the Loop with Bokashi Bran Integration.</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Hardware swaps and bran distribution happen in the same visit. Municipalities stock bran (supplied by SCARAB) at drop-off points. Returning fermented waste triggers a bran allocation in the app.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-xs font-bold text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">1. Ferment for 2–4 weeks</div>
                            <div className="text-xs font-bold text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">2. Swap bucket at Hub</div>
                            <div className="text-xs font-bold text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">3. Collect fresh Bran</div>
                            <div className="text-xs font-bold text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">4. Repeat the cycle</div>
                        </div>
                    </div>
                    <div className="w-full md:w-64 aspect-square bg-emerald-50 rounded-full border-[1.5rem] border-white shadow-inner flex items-center justify-center overflow-hidden">
                         <div className="text-center">
                             <PackageSearch className="text-emerald-600 mb-2 mx-auto" size={48} />
                             <span className="text-[10px] uppercase tracking-widest font-black text-emerald-700">Hub Distribution</span>
                         </div>
                    </div>
                </div>
            </section>

            {/* 1H. Apply Form */}
            <section id="apply" className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-2xl">
                    {submitted ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
                            <CheckCircle className="mx-auto text-emerald-600" size={64} />
                            <h2 className="text-4xl font-black text-gray-900">Application Received</h2>
                            <p className="text-gray-500">Your municipal operations contact will reach out within 2 business days.</p>
                            <Link to="/" className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-2">
                               Return Home <ArrowRight size={16} />
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Launch in Stuttgart.</h2>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Pilot slots for German municipalities are limited.</p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-200">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Field label="City / District" value={formData.city_name} onChange={v => setFormData({...formData, city_name: v})} required />
                                    <Field label="Staff Member Name" value={formData.contact_name} onChange={v => setFormData({...formData, contact_name: v})} required />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Field label="Contact Email" value={formData.email} onChange={v => setFormData({...formData, email: v})} type="email" required />
                                    <Field label="Role in Municipality" value={formData.role} onChange={v => setFormData({...formData, role: v})} />
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                   <SelectField 
                                     label="Pilot Location Type" 
                                     value={formData.preferred_location_type}
                                     onChange={v => setFormData({...formData, preferred_location_type: v})}
                                     options={['Town hall', 'Recycling depot', 'Community centre', 'Supermarket carpark', 'Other']}
                                   />
                                   <Field 
                                     label="Approx. Drop-off Sites" 
                                     value={formData.drop_off_sites_count}
                                     type="number"
                                     onChange={v => setFormData({...formData, drop_off_sites_count: v})}
                                   />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                   <SelectField 
                                     label="Incentive Strategy" 
                                     value={formData.incentives_interest}
                                     onChange={v => setFormData({...formData, incentives_interest: v})}
                                     options={['Model A (Euro)', 'Model B (Fee Discount)', 'Model C (Community)', 'Tell me more']}
                                   />
                                   <SelectField 
                                     label="Preferred Language" 
                                     value={formData.contact_language}
                                     onChange={v => setFormData({...formData, contact_language: v})}
                                     options={['German', 'English']}
                                   />
                                </div>

                                <button type="submit" disabled={submitting} className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-700 transition-all text-lg shadow-lg shadow-emerald-600/20 active:scale-95">
                                    {submitting ? 'Submitting...' : 'Apply for Pilot Cluster'}
                                </button>
                                <p className="text-[11px] text-gray-400 text-center leading-relaxed italic">
                                    Operated by SCARAB UG (Germany, DE-HRB). Your data is processed in Frankfurt on Hetzner Cloud. Signing this form does not constitute a legally binding contract.
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 bg-white border-t border-gray-100 text-center">
                <div className="container mx-auto px-6 max-w-5xl">
                    <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mb-2 font-mono">SCARAB PROTOCOL INFRASTRUCTURE</p>
                    <p className="text-xs text-gray-400">© {new Date().getFullYear()} SCARAB UG (Haftungsbeschränkt). Registergericht Stuttgart.</p>
                </div>
            </footer>
        </div>
    );
}

/* ────────── Subcomputes ────────── */

function WhatItem({ icon, text }) {
    return (
        <li className="flex gap-4 items-start">
            <div className="mt-1">{icon}</div>
            <p className="text-sm font-bold text-gray-700 leading-relaxed">{text}</p>
        </li>
    );
}

function StepCard({ num, title, desc, icon }) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 relative">
            <div className="absolute top-4 right-6 text-2xl font-black text-emerald-600/20">0{num}</div>
            <div className="mb-6 text-emerald-600">{icon}</div>
            <h4 className="text-xl font-black text-gray-900 mb-3 tracking-tight">{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function Trow({ collect, noCollect, access }) {
    return (
        <tr>
            <td className="px-8 py-4 font-bold text-gray-800">{collect}</td>
            <td className="px-8 py-4 font-bold text-gray-300 select-none">{noCollect}</td>
            <td className="px-8 py-4 font-mono text-[11px] text-emerald-600 font-black">{access}</td>
        </tr>
    );
}

function PriceCard({ title, price, desc, tag, pilotFree = false }) {
    return (
        <div className="bg-white border border-gray-200 rounded-[2rem] p-8 flex flex-col hover:border-emerald-500 transition-colors group">
            <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1D9E75] bg-emerald-50 px-3 py-1 rounded-full">{tag}</span>
                {pilotFree && <span className="text-[10px] font-black uppercase tracking-widest text-white bg-emerald-600 px-3 py-1 rounded-full animate-pulse">Pilot: Free</span>}
            </div>
            <h3 className="text-xl font-black mb-1">{title}</h3>
            <div className="text-2xl font-black text-gray-900 mb-4">{price}</div>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">{desc}</p>
        </div>
    );
}

function IncentiveModel({ label, title, desc }) {
    return (
        <div className="p-8 bg-white border border-gray-200 rounded-3xl shadow-sm">
            <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4">{label}</div>
            <h4 className="text-xl font-black text-gray-900 mb-4">{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function Field({ label, value, onChange, type = 'text', required = false }) {
    return (
        <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{label} {required && "*"}</label>
            <input
                type={type}
                required={required}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:border-emerald-500 outline-none transition-colors"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options }) {
    return (
        <div>
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</label>
            <select
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:border-emerald-500 outline-none transition-colors appearance-none"
                value={value}
                onChange={e => onChange(e.target.value)}
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}
