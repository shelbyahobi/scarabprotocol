import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LegalPage from './components/LegalPage';
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
import ValueProposition from './components/ValueProposition';
import HowItWorks from './components/HowItWorks';
import SoilAsAServiceTeaser from './components/SoilAsAServiceTeaser';
import SimplifiedTokenomics from './components/SimplifiedTokenomics';
import InvestorsPage from './components/InvestorsPage';
import Marketplace from './components/Marketplace';
import ProductsPage from './components/ProductsPage';
import DAOPage from './components/DAOPage';
import QuantumResistance from './components/QuantumResistance';
import HardwareEcosystem from './components/HardwareEcosystem';
import AcademicResearch from './components/AcademicResearch';
import { Rocket, ArrowLeft, Shield, BookOpen, Globe, ShieldCheck, ExternalLink, Lock, Users } from 'lucide-react';

const Documentation = lazy(() => import('./components/Documentation'));

const queryClient = new QueryClient();

function LandingPage() {
    return (
        <>
            <Navbar isLanding={true} />
            <main className="pt-20">
                {/* 1. HERO */}
                <Hero />

                {/* 2. VALUE PROPOSITION (New) */}
                <ValueProposition />

                {/* 3. THE TWO PILLARS (Hardware) */}
                <PhysicalUtility />

                {/* 4. HOW IT WORKS (New 4-Step Flow) */}
                <HowItWorks />

                {/* 5. SOIL-AS-A-SERVICE TEASER (Shortened) */}
                <SoilAsAServiceTeaser />

                {/* 6. TRUST & SECURITY (Moved up) */}
                <div className="container mx-auto px-4 py-24 border-t border-white/5 bg-black">
                    <Transparency />
                </div>

                {/* 7. QUANTUM RESISTANCE (New) */}
                <QuantumResistance />

                {/* 8. TOKENOMICS (Simplified) */}
                <SimplifiedTokenomics />

                {/* 8. ROADMAP */}
                <div className="container mx-auto px-4 py-24 border-t border-white/5 bg-black">
                    <Roadmap />
                </div>

                {/* 9. FINAL CALL TO ACTION */}
                <section className="py-24 bg-gradient-to-b from-black to-[#0a1a0f] border-t border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto bg-black border border-beetle-gold/30 rounded-3xl p-8 md:p-14 text-center shadow-[0_0_50px_rgba(212,175,55,0.1)] relative">
                            {/* Urgency Badge */}
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-900/50 border border-red-500/50 text-red-400 font-bold px-4 py-1.5 rounded-full text-sm whitespace-nowrap hidden sm:block">
                                ⏰ Phase 1 limited to MVP R&D hardware allocation
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                                Join the <span className="text-beetle-gold">Phase 1 Seed Sale</span>
                            </h2>
                            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                                Secure early infrastructure allocation: <strong className="text-white">8M SCARAB per $100</strong>.<br className="hidden sm:block" />
                                <span className="text-beetle-gold font-bold">Funding R&D</span> and institutional scaling.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                                <Link
                                    to="/app"
                                    className="bg-beetle-gold text-black font-black px-8 py-4 rounded-xl hover:bg-white hover:scale-105 transition-all text-lg flex items-center justify-center gap-2"
                                >
                                    Invest Now <Rocket size={20} />
                                </Link>
                                <Link
                                    to="/docs"
                                    className="bg-black border-2 border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:border-white hover:bg-white/5 transition-all text-lg flex items-center justify-center gap-2"
                                >
                                    Read Technical Docs <BookOpen size={20} />
                                </Link>
                            </div>

                            {/* Trust Signals */}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 font-medium border-t border-white/10 pt-8 mt-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-green-400" />
                                    Verified BSC Contract
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-green-400" />
                                    Liquidity Locked 12mo
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-green-400" />
                                    1,200+ Waitlist
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

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

                {/* Brand Safety Warning */}
                <div className="mt-8 mb-6 inline-block bg-red-900/10 border border-red-500/20 rounded-lg p-4 max-w-lg mx-auto transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-center gap-2 text-red-500 font-bold mb-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Security Alert: Protect Your Assets
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Official Scarab Protocol Contract: <br />
                        <span className="text-beetle-gold font-mono text-xs break-all selection:bg-beetle-gold selection:text-black block mt-1 mb-2">
                            {CONFIG.ROLL_TOKEN_ADDRESS || '0x...'}
                        </span>
                        Admin/Team will <strong className="text-white">never</strong> DM you first. Beware of fake $SCARAB tokens masquerading as the real protocol.
                    </p>
                </div>

                <p className="text-gray-700 text-xs">© 2026 SCARAB Protocol · DePIN Infrastructure · <span className="text-gray-600">Not financial advice</span></p>
            </div>
        </footer>
    );
}

function App() {
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
                                {/* Global Background */}
                                <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#050a05] via-[#0a1a0f] to-black pointer-events-none"></div>
                                <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-beetle-green/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <Routes>
                                        <Route path="/" element={<LandingPage />} />
                                        <Route path="/app" element={<DAppPage />} />
                                        <Route path="/products" element={<ProductsPage />} />
                                        <Route path="/marketplace" element={<Marketplace />} />
                                        <Route path="/ecosystem" element={<HardwareEcosystem />} />
                                        <Route path="/research" element={<AcademicResearch />} />
                                        <Route path="/dao" element={<DAOPage />} />
                                        <Route path="/investors" element={<InvestorsPage />} />
                                        <Route path="/transparency" element={<ProofOfReservesPage />} />
                                        <Route path="/docs" element={
                                            <Suspense fallback={<div className="min-h-screen bg-[#050A05] flex items-center justify-center text-green-400">Loading Docs...</div>}>
                                                <Documentation />
                                            </Suspense>
                                        } />
                                        <Route path="/docs/:section" element={
                                            <Suspense fallback={<div className="min-h-screen bg-[#050A05] flex items-center justify-center text-green-400">Loading Docs...</div>}>
                                                <Documentation />
                                            </Suspense>
                                        } />

                                        {/* Redirects */}
                                        <Route path="/blueprint" element={<Navigate to="/docs" replace />} />
                                        <Route path="/strategy" element={<Navigate to="/investors" replace />} />
                                        <Route path="/roadmap" element={<Navigate to="/investors#roadmap" replace />} />
                                        {/* Legal */}
                                        <Route path="/legal/*" element={<LegalPage />} />
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
