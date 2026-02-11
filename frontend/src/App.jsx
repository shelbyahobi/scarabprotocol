import { useState } from 'react';
import Navbar from './components/Navbar';
import Ticker from './components/Ticker';
import Hero from './components/Hero';
import SeedSale from './components/SeedSale';
import Transparency from './components/Transparency';
import BlueprintModal from './components/BlueprintModal';
import ColonyDashboard from './components/ColonyDashboard';
import Roadmap from './components/Roadmap';

function App() {
    const [showBlueprint, setShowBlueprint] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-beetle-gold selection:text-black relative overflow-hidden flex flex-col">

            <BlueprintModal isOpen={showBlueprint} onClose={() => setShowBlueprint(false)} />

            {/* --- Ambient Background Effects --- */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#050a05] via-[#0a1a0f] to-black pointer-events-none"></div>

            {/* Animated Glow Orbs */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-beetle-green/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-beetle-gold/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none"></div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col">
                <div className="fixed top-0 left-0 w-full z-50">
                    <Ticker />
                    <Navbar onOpenBlueprint={() => setShowBlueprint(true)} />
                </div>

                {/* --- Main Content --- */}
                <main className="pt-32">
                    <Hero onOpenBlueprint={() => setShowBlueprint(true)} />

                    <div className="container mx-auto px-4 py-20 space-y-24">
                        <SeedSale />
                        <ColonyDashboard />
                        <Roadmap />
                        <Transparency />
                    </div>
                </main>

                {/* --- Footer --- */}
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
                            <a href="#" className="text-gray-400 hover:text-beetle-gold transition-colors">Etherscan</a>
                        </div>
                        <p className="text-gray-700 text-sm">&copy; 2026 ROLL Token. Organic Commerce.</p>
                    </div>
                </footer>

            </div>
        </div>
    )
}

export default App
