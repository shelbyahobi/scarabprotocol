import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Pickaxe, Sprout, UserPlus, ChevronRight, CheckCircle, Zap, Shield, Database, Sun, Recycle } from 'lucide-react';
import Navbar from './Navbar';

export default function Documentation() {
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    const TABS = [
        { id: 'overview', icon: <BookOpen size={18} />, label: 'Platform Overview' },
        { id: 'mining', icon: <Pickaxe size={18} />, label: 'How to Mine SCARAB' },
        { id: 'soil', icon: <Sprout size={18} />, label: 'The Farmer & Closed Loop' },
        { id: 'onboarding', icon: <UserPlus size={18} />, label: 'Onboarding Process' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">SCARAB Protocol Overview</h2>
                            <p className="mb-4">
                                SCARAB is a Regenerative Infrastructure Platform (DePIN) designed to incentivize real-world ecological action.
                                We deploy cryptographic hardware nodes to seamlessly measure, verify, and mathematically reward planetary regeneration.
                            </p>
                            <p>
                                Rather than relying on centralized entities to define "sustainability", SCARAB places secure hardware (the ATECC608A chip)
                                directly into the hands of citizens and farmers, turning everyday actions into verifiable, yield-generating Real World Assets (RWA).
                            </p>
                        </div>

                        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">The Dual-Pillar Ecosystem</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-beetle-electric"><Sun size={20} /> <span className="font-bold">Solar Nodes</span></div>
                                    <p className="text-sm">Targeting homeowners. Measurable energy output translates into SCARAB rewards while stabilizing local grids.</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-beetle-gold"><Recycle size={20} /> <span className="font-bold">Bokashi Kits</span></div>
                                    <p className="text-sm">Targeting urban apartments. Transforming organic waste into high-grade pre-compost, avoiding massive methane emissions.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'mining':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">How to Mine SCARAB</h2>
                            <p className="mb-4">
                                "Eco-Mining" requires active participation. You are providing tangible value to the network, and the decentralized Oracle distributes SCARAB proportional to the verified data.
                            </p>
                            <div className="mb-4 text-sm bg-beetle-gold/10 border border-beetle-gold/30 p-4 rounded-xl text-beetle-gold/80">
                                <strong className="text-beetle-gold block mb-1">Dynamic Halving Cycles</strong>
                                To protect against inflation and exponentially reward early adopters, the SCARAB hardware emissions algorithm mathematically halves the payout rate every 50,000 successful network verifications.
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="border border-beetle-electric/20 bg-beetle-electric/5 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Sun className="text-beetle-electric" /> Solar Node Mining (1.0x Base Reward)</h3>
                                <p className="mb-4 text-sm">Hardware cost: $349. Users plug the SCARAB Node directly between their solar inverter and the grid. The ATECC608A chip hashes the live production data.</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Reward calculation: Base emission rate * Verified kWh generated.</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Expected Returns: ~2,900 SCARAB / Year.</li>
                                </ul>
                            </div>

                            <div className="border border-beetle-gold/20 bg-beetle-gold/5 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Recycle className="text-beetle-gold" /> Smart Bokashi Mining (1.6x Multiplier)</h3>
                                <p className="mb-4 text-sm">Hardware cost: $89 + $9/mo Bran Subscription. To accurately price the extreme planetary impact, Bokashi nodes enjoy a 1.6x global reward multiplier.</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> <span className="font-bold text-white">Why 1.6x?</span> Dual-impact verification. (1) Avoids methane emissions vs landfills. (2) Sequesters carbon into the soil.</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Requirements: Maintain 35-42°C temp profile, 800+ ppm gas production, and verifiable 8-15% weight loss over a 14-day cycle.</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Expected Returns: ~4,800 SCARAB / Year.</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'soil':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Soil-as-a-Service & The Closed Loop</h2>
                            <p className="mb-4">
                                A critical issue for urban composters is disposing of the final fermented product. SCARAB's architecture treats local Farmers as "Verified Sink Nodes", creating an economic loop between the city and the farm.
                            </p>
                        </div>

                        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">The Fertility Handshake</h3>
                            <ol className="space-y-6 relative border-l border-green-500/20 ml-3 pl-6">
                                <li className="relative">
                                    <div className="absolute -left-8 w-4 h-4 rounded-full bg-green-500 ring-4 ring-black"></div>
                                    <h4 className="font-bold text-white mb-1">1. User Initiates Drop-Off</h4>
                                    <p className="text-sm">After a 14-day fermentation cycle, the urban user locates a verified Farm or "Community Hub" via the SCARAB Regen-Map and physically transports the bucket.</p>
                                </li>
                                <li className="relative">
                                    <div className="absolute -left-8 w-4 h-4 rounded-full bg-green-500 ring-4 ring-black"></div>
                                    <h4 className="font-bold text-white mb-1">2. Farmer Scanning & Verification</h4>
                                    <p className="text-sm">The Farmer scans the urban user's cryptographic QR code (acting as a digitally signed receipt of nutrient transfer). The Farmer instantly receives high-quality fertilizer for free.</p>
                                </li>
                                <li className="relative">
                                    <div className="absolute -left-8 w-4 h-4 rounded-full bg-green-500 ring-4 ring-black"></div>
                                    <h4 className="font-bold text-white mb-1">3. Protocol Rewards (The 3-Way Split)</h4>
                                    <p className="text-sm">The Smart Contract issues a verified 3-way distribution: <br /></p>
                                    <ul className="mt-2 space-y-1 text-sm">
                                        <li><strong className="text-white">15 SCARAB (User):</strong> Closure Bonus for correct ecological behavior.</li>
                                        <li><strong className="text-white">7 SCARAB (Farmer):</strong> Processing Fee. <em>Note: Farmers must actively stake 100 SCARAB to become a Verified Sink Hub to deter bad actors.</em></li>
                                        <li><strong className="text-white">3 SCARAB (Solar Node):</strong> Validation Fee issued to the local Solar Node that cryptographically signed the Proof of Physical Presence.</li>
                                    </ul>
                                </li>
                            </ol>
                        </div>
                    </motion.div>
                );
            case 'onboarding':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Onboarding Process</h2>
                            <p className="mb-4">
                                SCARAB removes web3 friction from the physical experience. The process is designed to be as simple as ordering an appliance online.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 border border-white/10 rounded-2xl bg-white/5">
                                <h4 className="text-lg font-bold text-white mb-2">Step 1: Obtain Hardware</h4>
                                <p className="text-sm">Purchase a Solar Node or Smart Bokashi Kit from the SCARAB online store. The hardware ships with the embedded cryptographic chip pre-configured.</p>
                            </div>

                            <div className="p-5 border border-white/10 rounded-2xl bg-white/5">
                                <h4 className="text-lg font-bold text-white mb-2">Step 2: Smartphone App Activation (No Seed Phrases)</h4>
                                <p className="text-sm">Download the SCARAB mobile companion app. You log in using a social account (Google/Apple) via Account Abstraction. A secure smart contract wallet is instantly deployed for you in the background.</p>
                            </div>

                            <div className="p-5 border border-beetle-gold/20 rounded-2xl bg-beetle-gold/5">
                                <h4 className="text-lg font-bold text-beetle-gold mb-2">Step 3: The Bran Subscription & QR Cryptography</h4>
                                <p className="text-sm">For Bokashi users, a $9/month active subscription ensures steady delivery of organic inoculant bran. <strong className="text-white">To start a mining cycle</strong>, you must scan the single-use QR code printed on the physical bran bag bag using the SCARAB app. This mathematically guarantees physical interaction and prevents simulated data.</p>
                            </div>

                            <div className="p-5 border border-green-500/20 rounded-2xl bg-green-500/5">
                                <h4 className="text-lg font-bold text-green-400 mb-2">Step 4: Earn & Manage</h4>
                                <p className="text-sm">Once the cycle finishes and the verification oracle confirms the conditions via the device sensors, SCARAB tokens are allocated directly to your smart wallet for claiming.</p>
                            </div>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#050A05]">
            <Navbar isLanding={false} />

            <div className="pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="md:w-64 shrink-0">
                    <div className="sticky top-32 space-y-2">
                        <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 ml-3">Documentation</div>
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-beetle-green/20 text-green-400 border border-beetle-green/30 shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={activeTab === tab.id ? 'text-green-400' : 'text-gray-500'}>{tab.icon}</span>
                                    {tab.label}
                                </div>
                                {activeTab === tab.id && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-[#0A110C] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[60vh]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="relative z-10">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}
