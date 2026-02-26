import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, ConnectButton } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

import { wagmiConfig } from './wagmi';
import { CONFIG } from './config';

import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Ticker from './components/Ticker';
import Hero from './components/Hero';
import SeedSale from './components/SeedSale';
import Transparency from './components/Transparency';
import BlueprintModal from './components/BlueprintModal';
import ColonyDashboard from './components/ColonyDashboard';
import AssetClasses from './components/AssetClasses';
import Roadmap from './components/Roadmap';
import MyAllocations from './components/MyAllocations';
import PhysicalUtility from './components/PhysicalUtility';
import Tokenomics from './components/Tokenomics';
import UseOfFunds from './components/UseOfFunds';
import TransparencyDashboard from './components/TransparencyDashboard';
import InvestorRoadmap from './components/InvestorRoadmap';
import EcoMiningExplainer from './components/EcoMiningExplainer';
import SoilAsAService from './components/SoilAsAService';
import StrategyPage from './components/StrategyPage';
import StrategyPreview from './components/StrategyPreview';
import { Rocket, ArrowLeft, Shield, BookOpen, Globe, ShieldCheck, ExternalLink } from 'lucide-react';
import { lazy, Suspense } from 'react';

const Documentation = lazy(() => import('./components/Documentation'));

const queryClient = new QueryClient();




function LandingPage({ onOpenBlueprint }) {
    return (
        <>
            <Navbar onOpenBlueprint={onOpenBlueprint} isLanding={true} />
            <main className="pt-20">
                <Hero onOpenBlueprint={onOpenBlueprint} />

                {/* 1.5 TRANSPARENCY DASHBOARD (Layer 2) - NEW */}
                <TransparencyDashboard />

                {/* 1. THE VISION (Why) */}
                <PhysicalUtility />

                {/* 1.5 THE SOIL-AS-A-SERVICE LOOP (Drop-off mechanic) - NEW */}
                <SoilAsAService />

                {/* 1.7 THE MECHANISM (How Eco-Mining Works) - NEW */}
                <EcoMiningExplainer />

                {/* 2. THE DATA (Tokenomics) */}
                <Tokenomics />

                {/* 3. THE TRUST (Use of Funds) */}
                <UseOfFunds />

                {/* 3.5 THE STRATEGY (Phases) - NEW */}
                <StrategyPreview />

                {/* 4. THE MECHANICS (How to Buy - Teaser) */}
                <div className="container mx-auto px-4 py-24">
                    <div className="grid md:grid-cols-2 gap-12 bg-black/40 border border-white/10 rounded-3xl p-12 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-beetle-gold/10 rounded-full blur-[80px]"></div>

                        <div>
                            <h3 className="text-3xl font-black text-white mb-6">Seed Sale Mechanics</h3>
                            <ul className="space-y-6 text-gray-400">
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-beetle-electric/20 flex items-center justify-center text-beetle-electric font-bold">1</div>
                                    <div>
                                        <strong className="text-white block">Soft Cap Protection</strong>
                                        If the minimum goal isn't met, the smart contract automatically enables 100% refunds. Verified by audit.
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-beetle-electric/20 flex items-center justify-center text-beetle-electric font-bold">2</div>
                                    <div>
                                        <strong className="text-white block">Instant Allocation</strong>
                                        Tokens are reserved immediately. Connect via the App to see your "Reserved Balance" update in real-time.
                                    </div>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <Link to="/app" className="inline-flex items-center gap-2 text-beetle-gold font-bold hover:gap-4 transition-all">
                                    Go to Launchpad <Rocket size={16} />
                                </Link>
                            </div>
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
                                Read the full technical documentation. From the "Sacred Scarab" deflator mechanism to the "Ecoloop" physical hardware network.
                            </p>
                            <div className="flex gap-4 flex-wrap">
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

                {/* 2. Colony Dashboard (Merged: Marketplace, Hive, Governance) */}
                <ColonyDashboard />
            </main>
        </div>
    );
}

function InvestorsPage() {
    return (
        <div className="min-h-screen bg-[#050a05] text-white">
            <div className="fixed top-0 left-0 w-full z-50 bg-[#0a1a0f] border-b border-white/5 shadow-xl">
                <Ticker />
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold">Back to Home</span>
                    </Link>
                    <span className="text-green-400 font-black tracking-tighter text-lg">$SCARAB <span className="text-white font-normal text-sm">Investor Overview</span></span>
                </div>
            </div>
            <main className="pt-36">
                <InvestorRoadmap />
            </main>
            <Footer />
        </div>
    );
}

function ProofOfReservesPage() {
    return (
        <div className="min-h-screen bg-[#050a05] text-white">
            <div className="fixed top-0 left-0 w-full z-50 bg-[#0a1a0f] border-b border-white/5 shadow-xl">
                <Ticker />
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold">Back to Home</span>
                    </Link>
                    <span className="text-beetle-gold font-black tracking-tighter text-lg">$SCARAB <span className="text-white font-normal text-sm">Proof of Reserves</span></span>
                </div>
            </div>
            <main className="pt-36 container mx-auto px-4 pb-24 space-y-8">
                <div className="text-center py-12">
                    <span className="text-xs font-mono tracking-widest text-beetle-gold uppercase mb-4 block">Verified On-Chain</span>
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Liquidity Backing <span className="text-beetle-gold">Vault</span></h1>
                    <p className="text-gray-400 max-w-xl mx-auto">Every metric below is publicly verifiable on BscScan. SCARAB does not make promises — it makes proofs.</p>
                </div>
                <TransparencyDashboard />
                <UseOfFunds />
            </main>
            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <footer className="py-12 border-t border-white/5 bg-black/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-3xl font-black text-beetle-gold mb-4 tracking-tighter">$SCARAB Protocol</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Proof of Physical Activity. Real-world assets backing every token.
                    Run by the community, for the planet.
                </p>
                <div className="flex justify-center flex-wrap gap-6 mb-8">
                    <a href="https://x.com/scarab_protocol" target="_blank" className="text-gray-400 hover:text-beetle-gold transition-colors">Twitter (X)</a>
                    <a href="https://t.me/ScarabCommunity" target="_blank" className="text-gray-400 hover:text-beetle-gold transition-colors">Telegram</a>
                    <Link to="/transparency" className="text-gray-400 hover:text-beetle-gold transition-colors">Proof of Reserves</Link>
                    <Link to="/investors" className="text-gray-400 hover:text-green-400 transition-colors">Investors</Link>
                    <a href={`https://testnet.bscscan.com/address/${CONFIG.ROLL_TOKEN_ADDRESS}`} target="_blank" className="text-gray-400 hover:text-beetle-gold transition-colors">Contract (Verified)</a>
                </div>
                <p className="text-gray-700 text-xs">© 2026 SCARAB Protocol · DePIN Infrastructure · <span className="text-gray-600">Not financial advice</span></p>
            </div>
        </footer>
    );
}

function App() {
    const [showBlueprint, setShowBlueprint] = useState(false);

    return (
        <ErrorBoundary>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider theme={darkTheme({
                        accentColor: '#D4AF37', // Beetle Gold
                        accentColorForeground: 'black',
                        borderRadius: 'large',
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })}>
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
                                        <Route path="/strategy" element={<StrategyPage />} />
                                        <Route path="/transparency" element={<ProofOfReservesPage />} />
                                        <Route path="/investors" element={<InvestorsPage />} />
                                        <Route path="/docs" element={
                                            <Suspense fallback={<div className="min-h-screen bg-[#050A05] flex items-center justify-center text-green-400">Loading Docs...</div>}>
                                                <Documentation />
                                            </Suspense>
                                        } />
                                        <Route path="*" element={<Navigate to="/" replace />} />
                                    </Routes>
                                </div>
                            </div>
                        </Router>
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </ErrorBoundary>
    )
}

export default App
