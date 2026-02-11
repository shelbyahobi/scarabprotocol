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
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Rocket, ArrowLeft } from 'lucide-react';

// --- PAGE COMPONENTS ---

function LandingPage({ onOpenBlueprint }) {
    return (
        <>
            <Navbar onOpenBlueprint={onOpenBlueprint} isLanding={true} />
            <main className="pt-32">
                <Hero onOpenBlueprint={onOpenBlueprint} />
                <div className="container mx-auto px-4 py-20 space-y-24">
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
            <div className="fixed top-0 left-0 w-full z-50 bg-[#0a1a0f] border-b border-white/5">
                <Ticker />
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={18} /> Back to Home
                    </Link>
                    <div className="flex gap-4 items-center">
                        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
                    </div>
                </div>
            </div>

            <main className="pt-32 container mx-auto px-4 pb-24 space-y-12">
                <div className="p-6 bg-beetle-electric/5 border border-beetle-electric/20 rounded-2xl flex items-center gap-4 animate-pulse">
                    <Rocket className="text-beetle-electric" />
                    <span className="font-bold text-beetle-electric">Seed Sale is LIVE: Determine your Colony Status.</span>
                </div>

                <SeedSale />
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
