import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, BarChart3, FileText, Shield, Server, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function MunicipalitiesPage() {
    const [formData, setFormData] = useState({
        city_name: '', contact_name: '', role: '', email: '', district_population: ''
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
            // Error handled silently; submitting state reset below
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1a1a1a] font-sans">
            <Navbar />

            {/* Hero — No crypto language */}
            <section className="relative pt-32 pb-20 bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-xs font-bold tracking-[4px] text-emerald-600 uppercase mb-4 block">
                            For Municipal Authorities
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                            Verified waste collection data
                            <br />for your city — <span className="text-emerald-600">zero integration cost</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Real-time, hardware-verified reporting on organic waste collection across your district.
                            No new infrastructure required. No software integration needed.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* How SCARAB tracks waste: 5-step full cycle */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-black text-gray-900 mb-4 text-center">End-to-End Waste Tracking</h2>
                    <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
                        SCARAB tracks the complete chain — from a resident's collection bin to the processing facility.
                    </p>

                    <div className="space-y-0">
                        <CycleStep
                            num={1}
                            icon="◉"
                            title="Household activates"
                            desc="Resident registers their Bokashi bin or cooking oil container. Device GPS records activation location."
                        />
                        <CycleStep
                            num={2}
                            icon="⬡"
                            title="Waste is verified at source"
                            desc="Smart hardware weighs and timestamps each deposit. Data is cryptographically signed — no manual entry, no fraud."
                        />
                        <CycleStep
                            num={3}
                            icon="▶"
                            title="Farmer collects"
                            desc="A registered collection farmer picks up within a defined radius. We record: collection timestamp, distance travelled (activation point → Hub), and chain of custody handoff."
                        />
                        <CycleStep
                            num={4}
                            icon="▣"
                            title="Hub aggregates"
                            desc="Hub node records: time to fill (days), total weight, waste origin cluster. You see fill rate curves — how long it takes your district's waste to complete a cycle."
                        />
                        <CycleStep
                            num={5}
                            icon="◈"
                            title="Processing facility receives"
                            desc="Verified batch reaches the processing facility. CO₂ avoidance is calculated. Your district receives a digitally-signed impact certificate."
                            isLast
                        />
                    </div>
                </div>
            </section>

            {/* Metric cards */}
            <section className="py-16 bg-gray-50 border-y border-gray-200">
                <div className="container mx-auto px-6 max-w-5xl">
                    <h2 className="text-2xl font-black text-gray-900 mb-10 text-center">What We Track</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            value="4.2 km"
                            label="Average collection distance"
                            sub="Only local farmers, no long-haul transport"
                        />
                        <MetricCard
                            value="11 days"
                            label="Average Hub fill time"
                            sub="Real-time fill curve visible in your dashboard"
                        />
                        <MetricCard
                            value="4"
                            label="Chain of custody events per batch"
                            sub="Verified handoffs — activation, pickup, hub, processing"
                        />
                        <MetricCard
                            value="~180 kg"
                            label="CO₂ avoided per tonne"
                            sub="Modelled scenario, not guaranteed"
                        />
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-8 italic leading-relaxed">
                        All figures shown are modelled pilot projections. Live data will populate once the Stuttgart pilot cluster is active.
                    </p>
                </div>
            </section>

            {/* Closed Loop Guarantee */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-2xl font-black text-gray-900 mb-4 text-center">
                        Closed Loop Guarantee
                    </h2>
                    <p className="text-gray-500 text-center mb-10">
                        We track waste from your district's doorstep to the processing facility — and nowhere else.
                    </p>
                    <div className="space-y-4">
                        <TrustPoint text="Collection distance is capped at a configurable radius from the activation point — you set the boundary per municipality." />
                        <TrustPoint text="Hub locations are within your district boundary or agreed adjacent zones — no cross-boundary movement without a signed handoff event." />
                        <TrustPoint text="No waste leaves the defined supply chain without a verified handoff event on record." />
                    </div>
                    <div className="mt-10 text-center">
                        <a
                            href="/methodology"
                            className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm"
                        >
                            Download our data methodology →
                        </a>
                    </div>
                </div>
            </section>

            {/* What You Get */}
            <section className="py-24 bg-gray-50 border-y border-gray-200">
                <div className="container mx-auto px-6 max-w-5xl">
                    <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">What Your District Receives</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <FeatureCard title="Real-Time Collection Map" desc="Geographic heatmap of waste collection activity across your registered districts, updated hourly." />
                        <FeatureCard title="Monthly PDF Reports" desc="Exportable compliance reports documenting collection volumes, participation trends, and weight-verified totals." />
                        <FeatureCard title="CO₂ Avoidance Certificates" desc="Modelled carbon offset documentation aligned with ISCC methodology standards (certification roadmap in progress)." />
                        <FeatureCard title="API Access" desc="RESTful JSON API to feed verified collection data directly into your existing municipal waste management software." />
                    </div>
                </div>
            </section>

            {/* Data Sovereignty */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <Shield className="mx-auto text-emerald-600 mb-6" size={48} />
                    <h2 className="text-3xl font-black text-gray-900 mb-6">Your Data, Your Jurisdiction</h2>
                    <p className="text-lg text-gray-500 leading-relaxed mb-8">
                        Your district's data is scoped exclusively to your jurisdiction.
                        No other municipality can access your data. <strong className="text-gray-900">No data leaves the European Union.</strong>
                    </p>
                    <div className="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-3 rounded-xl text-sm font-bold">
                        <Server size={18} />
                        Processed on EU-based infrastructure (Hetzner Cloud, Frankfurt DE)
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-16 bg-gray-50 border-y border-gray-200">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <h2 className="text-2xl font-black text-gray-900 mb-4">Pricing</h2>
                    <p className="text-gray-500 text-lg mb-2">
                        <strong className="text-gray-900">Pilot phase: no cost.</strong> We are selecting three German cities for our initial rollout.
                    </p>
                    <p className="text-gray-400 text-sm">Post-pilot: usage-based API pricing scaled to district population. No upfront contracts.</p>
                </div>
            </section>

            {/* Apply Form */}
            <section id="apply" className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-xl">
                    {submitted ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
                            <CheckCircle className="mx-auto text-emerald-600" size={64} />
                            <h2 className="text-3xl font-black text-gray-900">Application Received</h2>
                            <p className="text-gray-500">A member of our EU operations team will contact you within 5 business days.</p>
                            <Link to="/" className="text-emerald-600 hover:underline text-sm">Return to homepage</Link>
                        </motion.div>
                    ) : (
                        <>
                            <h2 className="text-3xl font-black text-gray-900 mb-2 text-center">Apply for the Stuttgart Pilot</h2>
                            <p className="text-gray-400 text-center mb-8">Limited to German municipalities during the pilot phase.</p>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Field label="City / District Name" value={formData.city_name} onChange={v => setFormData({...formData, city_name: v})} required />
                                <Field label="Contact Name" value={formData.contact_name} onChange={v => setFormData({...formData, contact_name: v})} required />
                                <Field label="Your Role" value={formData.role} onChange={v => setFormData({...formData, role: v})} placeholder="e.g. Head of Waste Management" />
                                <Field label="Email Address" value={formData.email} onChange={v => setFormData({...formData, email: v})} type="email" required />
                                <Field label="District Population (approx.)" value={formData.district_population} onChange={v => setFormData({...formData, district_population: v})} placeholder="e.g. 120,000" />
                                <button type="submit" disabled={submitting} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-colors text-lg">
                                    {submitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                                <p className="text-xs text-gray-400 text-center">
                                    Operated by SCARAB UG (Germany, registration in progress). Your data is processed in the EU.
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-gray-100 border-t border-gray-200 text-center text-xs text-gray-400">
                <p>Protocol: SCARAB DAO LLC (Wyoming) · European Operations: SCARAB UG (Germany, registration in progress)</p>
                <p className="mt-1">© {new Date().getFullYear()} SCARAB Protocol. All rights reserved.</p>
            </footer>
        </div>
    );
}

function CycleStep({ num, icon, title, desc, isLast = false }) {
    return (
        <div className="flex gap-6 pb-0">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 font-black text-sm flex-shrink-0">
                    {num}
                </div>
                {!isLast && <div className="w-0.5 flex-1 bg-emerald-100 my-1 mx-auto" style={{ minHeight: 32 }}></div>}
            </div>
            <div className={`pb-8 ${isLast ? '' : ''}`}>
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">{icon} Step {num}</div>
                <h3 className="text-lg font-black text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function MetricCard({ value, label, sub }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl font-black text-emerald-700 mb-2">{value}</div>
            <div className="text-sm font-bold text-gray-900 mb-1">{label}</div>
            <div className="text-xs text-gray-400 leading-relaxed">{sub}</div>
        </div>
    );
}

function TrustPoint({ text }) {
    return (
        <div className="flex gap-4 bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="w-5 h-5 rounded-full bg-emerald-600 flex-shrink-0 mt-0.5 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
        </div>
    );
}

function FeatureCard({ title, desc }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function Field({ label, value, onChange, type = 'text', placeholder = '', required = false }) {
    return (
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            <input
                type={type}
                required={required}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}
