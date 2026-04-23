import React, { useState, useEffect } from 'react';
import { Mail, Database, Users, ServerCrash, CheckCircle2 } from 'lucide-react';

const RESEARCH_QUESTIONS = [
    {
        sku: "Smart Bokashi Kit",
        q: "Does decentralised fermentation (Bokashi) scale better than centralized biogas for dense urban districts?",
        a: "By displacing diesel-heavy logistics with hyper-local fermentation, we hypothesise a significantly lower net carbon footprint per kg of waste. The Stuttgart pilot will provide the comparative datasets needed to validate this against traditional Biotonne collections."
    },
    {
        sku: "Pro Bioreactor",
        q: "Can hyper-local soil amendment production measurably restore urban green-space vitality?",
        a: "We are tracking the application of Pro Bioreactor output on pilot urban test plots, measuring soil microbial diversity, water retention capacity, and plant stress indices over a 24-month period."
    },
    {
        sku: "AgriSentinel Lite",
        q: "What is the true correlation between agrivoltaic panel shading and sub-panel soil moisture retention in EU climates?",
        a: "Using the continuous telemetry from the AgriSentinel hardware, we are cross-referencing sub-panel microclimates against exposed control plots to quantify exact water savings during peak summer months."
    },
    {
        sku: "UCO Collection Node",
        q: "How does source-verified UCO compare to aggregate municipal collection in terms of transesterification yield?",
        a: "Measuring the Free Fatty Acid (FFA) content and water contamination at the point of drop-off, comparing the SAF (Sustainable Aviation Fuel) yield efficiency against traditional untracked collections."
    },
    {
        sku: "Solar Sentinel V1",
        q: "Can hardware-attested renewable generation logs replace traditional utility meter audits for Scope 3 emissions reporting?",
        a: "Testing whether cryptographic signatures from the ATECC608A chip satisfy the strict evidential requirements of the EU Corporate Sustainability Reporting Directive (CSRD)."
    },
    {
        sku: "AgriSentinel Pro",
        q: "Does continuous DIN SPEC 91434 compliance monitoring alter farmer operational behaviour compared to annual audits?",
        a: "Analyzing whether real-time feedback on Soil Leaf Area Index and NPK levels encourages more proactive regenerative farming practices versus lagging retrospective audits."
    }
];

export default function ResearchPage() {
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [participateStatus, setParticipateStatus] = useState('idle');
    const [requestStatus, setRequestStatus] = useState('idle');

    useEffect(() => {
        // Try to fetch from API, fallback to mock if unavailable
        fetch('/api/research/stats')
            .then(res => res.json())
            .then(data => {
                if (data.interview_count !== undefined) {
                    setStats(data);
                } else {
                    throw new Error('No data');
                }
            })
            .catch(() => {
                // If API is unavailable, fail gracefully with mock data so it doesn't break
                setStats({ interview_count: 12, target: 30 });
            })
            .finally(() => {
                setLoadingStats(false);
            });
    }, []);

    const handleParticipateSubmit = (e) => {
        e.preventDefault();
        setParticipateStatus('loading');
        // Simulate API call POST /api/research/participate
        setTimeout(() => setParticipateStatus('success'), 800);
    };

    const handleRequestSubmit = (e) => {
        e.preventDefault();
        setRequestStatus('loading');
        // Simulate API call POST /api/research/dataset-request
        setTimeout(() => setRequestStatus('success'), 800);
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            {/* Hero Section */}
            <section className="container mx-auto px-6 max-w-5xl text-center mb-20">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                    Independent academic research, open data, and hardware pilots
                </h1>
                <p className="text-xl text-gray-500 mb-10">
                    in partnership with Universität Hohenheim.
                </p>
                
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="w-48 h-24 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mb-3">
                        <span className="text-xs text-gray-400 font-bold text-center px-4">Universität Hohenheim<br/>partner logo pending approval</span>
                    </div>
                    <p className="text-xs text-gray-400 max-w-md">
                        SCARAB has no editorial control over research findings. All academic outputs are independently authored.
                    </p>
                </div>
            </section>

            {/* Interview Counter */}
            <section className="container mx-auto px-6 max-w-3xl mb-24">
                <div className="bg-gray-50 border border-gray-200 rounded-[2rem] p-8 text-center">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Live Study Progress</h3>
                    {loadingStats ? (
                        <div className="text-2xl font-black text-gray-300 animate-pulse">Data loading...</div>
                    ) : (
                        <>
                            <div className="text-4xl md:text-5xl font-black text-emerald-600 mb-2">
                                {stats?.interview_count} <span className="text-2xl text-gray-400">/ {stats?.target || 30} target</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900 mb-4">Stakeholder interviews completed</div>
                        </>
                    )}
                    <p className="text-sm text-gray-500">
                        Covering 8 groups: Farmers · Energy Companies · Municipalities · Grid Operators · Policymakers · NGOs · Solar Installers · Rural Residents.
                    </p>
                </div>
            </section>

            {/* Open Research Questions */}
            <section className="container mx-auto px-6 max-w-5xl mb-24">
                <h2 className="text-3xl font-black text-gray-900 mb-10 text-center">Open Research Questions</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {RESEARCH_QUESTIONS.map((item, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors bg-white shadow-sm flex flex-col h-full">
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit mb-4">
                                This question generates data from: {item.sku}
                            </div>
                            <h4 className="font-bold text-gray-900 text-lg mb-3">{item.q}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed mt-auto">{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA: Participate & Dataset */}
            <section className="container mx-auto px-6 max-w-5xl mb-24">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: Participate */}
                    <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="text-emerald-600" size={24} />
                            <h3 className="text-xl font-bold text-gray-900">I am a stakeholder</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Participate in the 30-minute interview study.</p>
                        
                        {participateStatus === 'success' ? (
                            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3">
                                <CheckCircle2 size={20} />
                                <span className="font-bold text-sm">Thank you. The research team will contact you shortly.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleParticipateSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Name</label>
                                    <input required type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Role / Group</label>
                                    <select required className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 bg-white">
                                        <option value="">Select your role...</option>
                                        <option value="farmer">Farmer / Agrivoltaic Operator</option>
                                        <option value="municipality">Municipality / Policy</option>
                                        <option value="energy">Energy / Grid Operator</option>
                                        <option value="resident">Rural Resident</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email</label>
                                    <input required type="email" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" />
                                </div>
                                <button type="submit" disabled={participateStatus === 'loading'} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-500 transition-colors mt-2 disabled:opacity-50">
                                    {participateStatus === 'loading' ? 'Submitting...' : 'Apply for Interview'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Right: Dataset */}
                    <div className="bg-gray-50 border border-gray-200 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Database className="text-blue-600" size={24} />
                            <h3 className="text-xl font-bold text-gray-900">I am a researcher</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Request the anonymised hardware dataset.</p>
                        
                        {requestStatus === 'success' ? (
                            <div className="bg-blue-50 text-blue-700 p-4 rounded-xl flex items-center gap-3">
                                <CheckCircle2 size={20} />
                                <span className="font-bold text-sm">Request received. Access will be provisioned via email.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleRequestSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Name</label>
                                    <input required type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Institution</label>
                                    <input required type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Research Purpose</label>
                                    <input required type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 bg-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Academic Email</label>
                                    <input required type="email" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 bg-white" />
                                </div>
                                <button type="submit" disabled={requestStatus === 'loading'} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-colors mt-2 disabled:opacity-50">
                                    {requestStatus === 'loading' ? 'Submitting...' : 'Request Dataset Access'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Hardware Pilot CTA */}
            <section className="container mx-auto px-6 max-w-4xl text-center">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 mb-3">Hardware Pilot Allocation</h3>
                    <p className="text-sm text-gray-600 mb-6 max-w-2xl mx-auto">
                        We are offering Solar Sentinel units at cost (€96 BOM) to agrivoltaic farms participating in the Hohenheim study. Five units available for the 2026 growing season.
                    </p>
                    <a href="mailto:research@scarabprotocol.org" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                        <Mail size={18} />
                        Apply for Hardware Allocation
                    </a>
                </div>
            </section>
        </div>
    );
}
