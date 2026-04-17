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
            console.error('Submission error:', err);
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

            {/* How It Works */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <Step num="1" title="Residents submit waste" desc="Households deposit organic waste at local collection points equipped with smart weighing hardware." icon={<MapPin />} />
                        <Step num="2" title="Hardware verifies data" desc="Each deposit is automatically weighed, categorised, and time-stamped by tamper-evident sensors." icon={<BarChart3 />} />
                        <Step num="3" title="You receive a live dashboard" desc="Your district gets a real-time overview of collection volumes, participation rates, and environmental impact." icon={<FileText />} />
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

function Step({ num, title, desc, icon }) {
    return (
        <div className="text-center">
            <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
                {icon}
            </div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Step {num}</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
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
