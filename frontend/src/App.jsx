import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Ticker from './components/Ticker';
import Hero from './components/Hero';
import SeedSale from './components/SeedSale';
import Transparency from './components/Transparency';
import BlueprintModal from './components/BlueprintModal';
import ColonyDashboard from './components/ColonyDashboard';
import Roadmap from './components/Roadmap';
import MyAllocations from './components/MyAllocations';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Rocket, ArrowLeft, Shield, BookOpen, Globe, ShieldCheck, ExternalLink } from 'lucide-react';

// --- PAGE COMPONENTS ---

function LandingPage({ onOpenBlueprint }) {
    return (
        <>
            <Navbar onOpenBlueprint={onOpenBlueprint} isLanding={true} />
            <main className="pt-32">
                <Hero onOpenBlueprint={onOpenBlueprint} />

                {/* NEW: Seed Mechanics & Whitepaper Preview */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-2 gap-12 mb-24">

                        {/* Mechanics */}
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="text-beetle-gold" size={28} />
                                <h3 className="text-2xl font-bold text-white">Seed Sale Mechanics</h3>
                            </div>
                            <ul className="space-y-4 text-gray-400">
                                <li className="flex gap-3">
                                    <span className="text-beetle-electric font-bold">01.</span>
                                    <span><strong>Soft Cap Protection:</strong> If the minimum goal isn't met, the smart contract automatically enables 100% refunds.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-beetle-electric font-bold">02.</span>
                                    <span><strong>Instant Allocation:</strong> Tokens are reserved immediately upon contribution. Claiming opens after the sale finalizes.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-beetle-electric font-bold">03.</span>
                                    <span><strong>DAO Governance:</strong> Seed contributors get "Scout" status, voting rights on the first physical land acquisition.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Whitepaper Glimpse */}
                        <div className="bg-[#0a1a0f] border border-beetle-electric/20 rounded-2xl p-8 relative overflow-hidden group hover:border-beetle-electric/50 transition-colors cursor-pointer" onClick={onOpenBlueprint}>
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                                <ExternalLink className="text-beetle-electric" />
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <BookOpen className="text-white" size={28} />
                                <h3 className="text-2xl font-bold text-white">The Blueprint</h3>
                            </div>
                            <p className="text-gray-400 mb-6">
                                Read the full technical documentation. From the "Dung Beetle" deflator mechanism to the "Ecoloop" physical hardware network.
                            </p>
                            <div className="flex gap-4">
                                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs text-gray-400">Tokenomics</span>
                                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs text-gray-400">Roadmap 2026</span>
                                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs text-gray-400">Legal</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-10 space-y-24">
                    <Transparency />
                    <Roadmap />
                </div>
            </main>
            <Footer />
        </>
    );
}

function DAppPage() {
    return (
        <div className="min-h-screen bg-[#050a05] text-white">
            <div className="fixed top-0 left-0 w-full z-50 bg-[#0a1a0f] border-b border-white/5 shadow-xl">
                <Ticker />
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold">Back to Home</span>
                    </Link>
                    <div className="flex gap-4 items-center">
                        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
                    </div>
                </div>
            </div>

            <main className="pt-36 container mx-auto px-4 pb-24 space-y-8">

                {/* 1. MY ALLOCATIONS DASHBOARD (New High-Fidelity Header) */}
                <MyAllocations />

                <div className="grid md:grid-cols-12 gap-8">
                    {/* Left: Seed Sale Widget */}
                    <div className="md:col-span-8">
                        <SeedSale />
                    </div>

                    {/* Right: Quick Stats / DAO Preview (Sidebar) */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                            <h4 className="flex items-center gap-2 font-bold text-white mb-4">
                                <Globe size={18} className="text-beetle-electric" /> Network Status
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Chain</span>
                                    <span className="text-white">BSC Testnet</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Round</span>
                                    <span className="text-beetle-gold">Seed (Private)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Access</span>
                                    <span className="text-green-500">Open</span>
                                </div>
                            </div>
                        </div>

                        {/* Audit / Trust Badge */}
                        <div className="bg-beetle-green/10 border border-beetle-green/30 rounded-2xl p-6 text-center">
                            <ShieldCheck className="w-12 h-12 text-beetle-green mx-auto mb-2" />
                            <div className="text-white font-bold">Contract Audited</div>
                            <div className="text-xs text-beetle-green mt-1">100% Secure & Verified</div>
                        </div>
                    </div>
                </div>

                {/* 2. Colony Dashboard (Gated Content) */}
                <ColonyDashboard />
            </main>
        </div>
    );
}

function Footer() {
    return (
        <footer className="py-12 border-t border-white/5 bg-black/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-3xl font-black text-beetle-gold mb-4 tracking-tighter">$ROLL</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    Bridging meme culture with real-world organic commerce.
                    Run by the community, for the community.
                </p>
                <div className="flex justify-center gap-8 mb-8">
                    <a href="https://x.com/roll_token" target="_blank" className="text-gray-400 hover:text-beetle-gold transition-colors">Twitter (X)</a>
                    <a href="https://t.me/rolltoken" target="_blank" className="text-gray-400 hover:text-beetle-gold transition-colors">Telegram</a>
                    <a href="https://testnet.bscscan.com/address/0x4D9c1cCA15fAB71FF56A51768DA2B85716b38c9f" target="_blank" className="text-gray-400 hover:text-beetle-gold transition-colors">Contract (Verified)</a>
                </div>
                <p className="text-gray-700 text-sm">&copy; 2026 ROLL Token. Organic Commerce.</p>
            </div>
        </footer>
    );
}

function App() {
    const [showBlueprint, setShowBlueprint] = useState(false);

    return (
        <Router>
            <div className="min-h-screen bg-black text-white font-sans selection:bg-beetle-gold selection:text-black relative overflow-hidden flex flex-col">
                <BlueprintModal isOpen={showBlueprint} onClose={() => setShowBlueprint(false)} />

                {/* Global Background */}
                <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#050a05] via-[#0a1a0f] to-black pointer-events-none"></div>
                <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-beetle-green/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10">
                    <Routes>
                        <Route path="/" element={<LandingPage onOpenBlueprint={() => setShowBlueprint(true)} />} />
                        <Route path="/app" element={<DAppPage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export default App
