import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Home, Book, Terminal, Cpu, Shield, Zap, Scale, Vault, Sprout, CheckCircle, Database, Lock, Pickaxe, MapPin, PieChart, Menu, X, ArrowUpRight, Sun, Recycle } from 'lucide-react';
import Navbar from './Navbar';

export default function Documentation() {
    const { section } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const activeTab = section || 'overview';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    const CATEGORIES = [
        {
            name: 'Getting Started',
            items: [
                { id: 'overview', icon: <Book size={18} />, label: 'Platform Overview' },
                { id: 'quick-start', icon: <Terminal size={18} />, label: 'Quick Start Guide' },
                { id: 'faq', icon: <Pickaxe size={18} />, label: 'Common Questions' }
            ]
        },
        {
            name: 'Core Engineering',
            items: [
                { id: 'architecture', icon: <Database size={18} />, label: 'Protocol Architecture' },
                { id: 'mining', icon: <Cpu size={18} />, label: 'Hardware Specs' },
                { id: 'ops-security', icon: <Lock size={18} />, label: 'Operational Security' },
                { id: 'risks', icon: <Shield size={18} />, label: 'Risk & Countermeasures' }
            ]
        },
        {
            name: 'Protocol Economics',
            items: [
                { id: 'tokenomics', icon: <PieChart size={18} />, label: 'Tokenomics Strategy' },
                { id: 'emissions', icon: <Zap size={18} />, label: 'Monetary Policy' },
                { id: 'governance', icon: <Scale size={18} />, label: 'Governance Mechanics' },
                { id: 'treasury', icon: <Vault size={18} />, label: 'Treasury Strategy' }
            ]
        },
        {
            name: 'Science & Data',
            items: [
                { id: 'carbon-methodology', icon: <Sprout size={18} />, label: 'Carbon Methodology' },
                { id: 'soil', icon: <MapPin size={18} />, label: 'Soil-as-a-Service' },
                { id: 'transparency', icon: <CheckCircle size={18} />, label: 'Verification & Transparency' }
            ]
        }
    ];

    const ALL_ITEMS = CATEGORIES.flatMap(cat => cat.items);
    const filteredItems = searchQuery
        ? ALL_ITEMS.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : null;

    const currentItem = ALL_ITEMS.find(i => i.id === activeTab) || ALL_ITEMS[0];
    const currentCategory = CATEGORIES.find(cat => cat.items.some(i => i.id === activeTab))?.name || 'Documentation';

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">SCARAB Protocol Overview</h2>
                        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl mb-6 text-green-400 font-bold text-lg text-center">
                            SCARAB is a production-gated minting protocol.
                            <div className="text-sm font-normal text-green-500/80 mt-1">Tokens are minted ONLY when verified physical ecological output occurs.</div>
                        </div>
                        <p>SCARAB is a Regenerative Infrastructure Platform (DePIN) designed to incentivize real-world ecological action. We deploy cryptographic hardware nodes to seamlessly measure, verify, and mathematically reward planetary regeneration.</p>
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <div className="text-beetle-electric font-bold mb-2 flex items-center gap-2"><Sun size={18} /> Solar Sentinel</div>
                                <p className="text-sm">Capture solar energy production as verified RWA data.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <div className="text-beetle-gold font-bold mb-2 flex items-center gap-2"><Sprout size={18} /> Bokashi Kit</div>
                                <p className="text-sm">Verify carbon sequestration via organic waste diversion.</p>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'quick-start':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Quick Start Guide</h2>
                        <div className="space-y-4">
                            {[
                                { step: 1, title: 'Connect Wallet', text: 'Use a BSC-compatible wallet at /app.' },
                                { step: 2, title: 'Acquire $SCARAB', text: 'Join the seed sale to fund your infrastructure.' },
                                { step: 3, title: 'Activate Node', text: 'Register your hardware serial via the dashboard.' }
                            ].map(s => (
                                <div key={s.step} className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="w-10 h-10 rounded-full bg-beetle-green text-black flex items-center justify-center font-black shrink-0">{s.step}</div>
                                    <div><h4 className="text-white font-bold">{s.title}</h4><p className="text-sm">{s.text}</p></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'faq':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Common Questions</h2>
                        <div className="space-y-4">
                            <FAQItem question="Is the supply truly fixed?" answer="Yes, 1 Billion hard cap enforced by protocol logic." />
                            <FAQItem question="Can I mine without hardware?" answer="No, SCARAB is a DePIN protocol requiring physical verification." />
                            <FAQItem question="What is a BRU?" answer="Base Regenerative Unit - the standard measure of ecological output." />
                        </div>
                    </motion.div>
                );
            case 'architecture':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Protocol Architecture</h2>
                        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl space-y-4">
                            <h3 className="text-xl font-bold text-beetle-green">Layered Trust Model</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <div className="font-bold text-white mb-1">L1: Physical Security</div>
                                    <p className="text-sm">ATECC608A Secure Elements create immutable hardware identities.</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <div className="font-bold text-white mb-1">L2: Data Validation</div>
                                    <p className="text-sm">Decentralized Oracles (AVS) verify telemetry before minting.</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <div className="font-bold text-white mb-1">L3: Settlement Layer</div>
                                    <p className="text-sm">UUPS Proxy contracts handle token distribution and treasury.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'mining':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Hardware Specs</h2>
                        <div className="grid gap-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <h3 className="text-xl font-bold text-beetle-electric mb-2">Solar Sentinel</h3>
                                <p className="text-sm mb-4">ESP32-S3 + INA226 + ATECC608A. Precision: ±0.1%.</p>
                                <div className="text-xs font-mono text-gray-500">Tier: Infrastructure (2400 BRU/Yr)</div>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <h3 className="text-xl font-bold text-beetle-gold mb-2">Smart Bokashi Kit</h3>
                                <p className="text-sm mb-4">HX711 (Wait) + DS18B20 (Temp) + ATECC608A.</p>
                                <div className="text-xs font-mono text-gray-500">Tier: Residential (650 BRU/Yr)</div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'ops-security':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Operational Security</h2>
                        <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl">
                            <h3 className="font-bold text-white mb-2">Root of Trust</h3>
                            <p className="text-sm">We use air-gapped HSMs for the Root CA. Device certificates are signed during factory provisioning and debug ports are permanently disabled.</p>
                        </div>
                    </motion.div>
                );
            case 'tokenomics':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Tokenomics Strategy</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { label: 'Seed Sale', value: '30%', color: 'bg-beetle-gold' },
                                { label: 'Regen Pool', value: '30%', color: 'bg-beetle-green' },
                                { label: 'Liquidity', value: '25%', color: 'bg-beetle-electric' },
                                { label: 'DAO/Scale', value: '15%', color: 'bg-purple-500' }
                            ].map(i => (
                                <div key={i.label} className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                                    <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${i.color}`} /> {i.label}</div>
                                    <div className="font-black text-white">{i.value}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'emissions':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Monetary Policy</h2>
                        <div className="bg-black/40 p-8 rounded-2xl border border-white/10 text-center">
                            <div className="text-2xl font-mono text-beetle-green mb-4">E(t) = D₀ * e^(-λt)</div>
                            <p className="text-sm">Daily emissions follow an exponential decay curve, ensuring a 70+ year reward horizon while rewarding early adopters.</p>
                        </div>
                    </motion.div>
                );
            case 'governance':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Governance Mechanics</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h4 className="font-bold text-white mb-2 underline">Votable Params</h4>
                                <ul className="text-xs space-y-2 text-gray-400">
                                    <li>• Emission Lambda (±10%/Q)</li>
                                    <li>• Hardware Whitelist</li>
                                    <li>• Treasury Distributions</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'treasury':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Treasury Strategy</h2>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-sm">Vault funds are locked via Timelocks and require a 3-of-5 multi-sig signature alongside a passsed DAO vote for any withdrawal &gt; 50k USD.</p>
                        </div>
                    </motion.div>
                );
            case 'carbon-methodology':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Carbon Methodology</h2>
                        <div className="bg-[#0a1a0f] p-8 rounded-2xl border border-beetle-green/20">
                            <h4 className="font-bold text-white mb-4 text-center text-lg">Avoided Methane Mechanism</h4>
                            <p className="text-sm mb-4">We calculate Co2-eq avoidance based on weight diversion (HX711) and temperature validation (DS18B20) consistent with IPCC landfill coefficients.</p>
                        </div>
                    </motion.div>
                );
            case 'soil':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Soil-as-a-Service</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <HandshakeStep icon={<MapPin />} title="Locate Sink" description="Find verified farm drop-offs." />
                            <HandshakeStep icon={<Database />} title="Log Input" description="Cryptographic weight verification." />
                            <HandshakeStep icon={<CheckCircle />} title="Settlement" description="Three-way reward distribution." />
                        </div>
                    </motion.div>
                );
            case 'transparency':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Verification & Transparency</h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr><th className="p-4">Report</th><th className="p-4">Frequency</th><th className="p-4">Access</th></tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="p-4 font-bold text-beetle-electric">Emission Audits</td><td className="p-4">Real-Time</td><td className="p-4">On-Chain</td></tr>
                                    <tr><td className="p-4 font-bold text-white">Hardware Logs</td><td className="p-4">24h</td><td className="p-4">IPFS</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                );
            case 'risks':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Risk & Countermeasures</h2>
                        <div className="space-y-4">
                            <FraudProtection method="ATECC608A Hardware Tampering" description="Private keys never leave the silicon. Physical enclosures have tamper-evident seals." />
                            <FraudProtection method="Oracle Collusion" description="Transitioning to decentralized AVS nodes to distribute trust across the network." />
                        </div>
                    </motion.div>
                );
            default:
                return (
                    <div className="py-20 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Section Under Migration</h2>
                        <p className="text-gray-500">The content for <code>{activeTab}</code> is currently being validated for institutional grade standards.</p>
                        <button onClick={() => navigate('/docs/overview')} className="mt-8 text-beetle-green flex items-center gap-2 mx-auto"><Home size={16} /> Back to Overview</button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#050A05] text-[#E8E8E8] font-sans flex flex-col overflow-x-hidden">
            <Navbar isLanding={false} />

            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="w-14 h-14 bg-beetle-green text-black rounded-full shadow-2xl flex items-center justify-center border-4 border-black active:scale-95 transition-transform"
                >
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            <div className="flex-1 flex pt-20 overflow-hidden relative">
                {/* Left Sidebar (Sticky) */}
                <aside className={`
                    fixed lg:sticky top-20 bottom-0 left-0 z-40 w-72 bg-[#050A05] border-r border-white/5 p-6 overflow-y-auto transition-transform duration-300
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="relative mb-8">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-beetle-green outline-none transition-all"
                        />
                        {searchQuery && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-[#0A1A0F] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                                {filteredItems?.length ? filteredItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => { navigate(`/docs/${item.id}`); setSearchQuery(''); setIsSidebarOpen(false); }}
                                        className="w-full px-4 py-3 text-left text-sm hover:bg-white/10 flex items-center gap-3 transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <span className="text-gray-500">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </button>
                                )) : <div className="px-4 py-3 text-xs text-gray-500">No results found</div>}
                            </div>
                        )}
                    </div>

                    <nav className="space-y-8">
                        {CATEGORIES.map((cat, idx) => (
                            <div key={idx}>
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 mb-4 px-3 flex items-center justify-between">
                                    {cat.name}
                                </h4>
                                <div className="space-y-1">
                                    {cat.items.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => { navigate(`/docs/${item.id}`); setIsSidebarOpen(false); }}
                                            className={`
                                                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                                                ${activeTab === item.id
                                                    ? 'bg-beetle-green/10 text-beetle-green shadow-[inset_0_0_10px_rgba(74,222,128,0.05)]'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                            `}
                                        >
                                            <span className={activeTab === item.id ? 'text-beetle-green' : 'text-gray-500'}>
                                                {item.icon}
                                            </span>
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 bg-[#050A05] relative overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
                            <Link to="/" className="hover:text-white flex items-center gap-1"><Home size={12} /> Home</Link>
                            <ChevronRight size={12} className="shrink-0" />
                            <span className="capitalize">{currentCategory}</span>
                            <ChevronRight size={12} className="shrink-0" />
                            <span className="text-beetle-green font-bold">{currentItem.label}</span>
                        </div>

                        <div className="relative min-h-[60vh]">
                            {renderContent()}
                        </div>

                        {/* Page Footer Navigation */}
                        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                            <button
                                onClick={() => {
                                    const idx = ALL_ITEMS.findIndex(i => i.id === activeTab);
                                    if (idx > 0) navigate(`/docs/${ALL_ITEMS[idx - 1].id}`);
                                }}
                                className="w-full sm:w-auto px-4 py-2 text-gray-500 hover:text-white flex items-center justify-center gap-2 group transition-colors border border-transparent hover:border-white/10 rounded-lg"
                            >
                                <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                                Previous Section
                            </button>
                            <button
                                onClick={() => {
                                    const idx = ALL_ITEMS.findIndex(i => i.id === activeTab);
                                    if (idx < ALL_ITEMS.length - 1) navigate(`/docs/${ALL_ITEMS[idx + 1].id}`);
                                }}
                                className="w-full sm:w-auto px-4 py-2 bg-beetle-green/10 text-beetle-green hover:bg-beetle-green/20 flex items-center justify-center gap-2 group transition-all border border-beetle-green/20 rounded-lg"
                            >
                                Next Section
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar: TOC (Desktop Only) */}
                <aside className="hidden xl:block w-72 bg-[#050A05] sticky top-20 h-[calc(100vh-80px)] p-8 border-l border-white/5">
                    <h5 className="text-[10px] uppercase tracking-widest font-black text-gray-500 mb-6 px-1">
                        In this section
                    </h5>
                    <nav className="space-y-4 text-xs">
                        <a href="#" className="block text-beetle-green font-bold border-l-2 border-beetle-green pl-4">Introduction</a>
                        <a href="#" className="block text-gray-500 hover:text-gray-300 pl-4 border-l-2 border-transparent transition-all">Deep Dive Metrics</a>
                        <a href="#" className="block text-gray-500 hover:text-gray-300 pl-4 border-l-2 border-transparent transition-all">Security Controls</a>
                        <div className="mt-12 pt-8 border-t border-white/5">
                            <a href="#" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
                                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                View on GitHub
                            </a>
                        </div>
                    </nav>
                </aside>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors bg-white/5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
                <span className="font-bold text-white text-sm">{question}</span>
                <ChevronRight className={`text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} size={16} />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-sm text-gray-400 border-t border-white/5 pt-4 bg-black/20">
                    {answer}
                </div>
            )}
        </div>
    );
}

function HandshakeStep({ icon, title, description }) {
    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative group hover:border-beetle-green/40 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-black rounded-xl border border-white/10 flex items-center justify-center text-beetle-green mb-4 group-hover:scale-110 transition-all">
                {icon}
            </div>
            <h4 className="text-white font-bold mb-2 text-sm">{title}</h4>
            <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
        </div>
    );
}

function RewardCard({ amount, recipient, description, color }) {
    const bgMap = {
        'beetle-gold': 'from-[#D4AF37]/5',
        'beetle-green': 'from-[#4ADE80]/5',
        'beetle-electric': 'from-[#22D3EE]/5'
    };

    return (
        <div className={`text-center p-6 rounded-2xl border border-white/5 bg-gradient-to-b ${bgMap[color] || 'from-white/5'} to-transparent`}>
            <div className={`text-3xl font-black text-${color} mb-3 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                {amount}
            </div>
            <div className="text-white font-bold mb-2 uppercase tracking-wide text-sm">{recipient}</div>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    );
}

function FraudProtection({ method, description }) {
    return (
        <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:border-red-500/20 transition-colors">
            <div className="mt-1 shrink-0"><Shield size={18} className="text-red-400/60" /></div>
            <div>
                <div className="text-white font-bold text-sm mb-1">{method}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{description}</div>
            </div>
        </div>
    );
}
