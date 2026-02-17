import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X, ExternalLink, FileText, Rocket, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ onOpenBlueprint, isLanding }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 w-full z-40 bg-[#0a1a0f]/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300 mt-8"> {/* mt-8 to account for ticker */}
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="flex items-center gap-2">
                        {/* Logo Placeholder - User can replace with scarab.png later */}
                        <div className="w-10 h-10 bg-beetle-gold rounded-full flex items-center justify-center font-black text-black">
                            S
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white">
                            $SCARAB
                        </span>
                    </div>
                </Link>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex gap-6 text-sm font-bold text-gray-400">
                        <a href="https://t.me/ScarabCommunity" target="_blank" className="flex items-center gap-2 hover:text-beetle-electric transition-colors">
                            <ExternalLink size={14} /> Telegram
                        </a>
                        <a href="https://x.com/scarab_protocol" target="_blank" className="flex items-center gap-2 hover:text-beetle-electric transition-colors">
                            <ExternalLink size={14} /> Twitter
                        </a>
                        <button onClick={onOpenBlueprint} className="flex items-center gap-2 hover:text-beetle-gold transition-colors">
                            <FileText size={14} /> Blueprint
                        </button>
                        <Link to="/strategy" className="flex items-center gap-2 hover:text-beetle-gold transition-colors">
                            <TrendingUp size={14} /> Strategy
                        </Link>
                    </div>

                    <div className="h-6 w-px bg-white/10"></div>

                    {/* Only show Connect Button on App pages, or here if we want persistent connection. Standard: Keep it. */}
                    <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />

                    <button
                        onClick={() => navigate('/app')}
                        className="bg-beetle-electric/10 text-beetle-electric border border-beetle-electric/50 px-6 py-2 rounded-lg font-bold hover:bg-beetle-electric hover:text-black transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center gap-2"
                    >
                        <Rocket size={18} />
                        LAUNCH APP
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-beetle-gold/20 p-6 flex flex-col gap-6 backdrop-blur-xl">
                    <a href="https://t.me/ScarabCommunity" className="text-gray-300 hover:text-beetle-electric">Telegram</a>
                    <a href="https://x.com/scarab_protocol" className="text-gray-300 hover:text-beetle-electric">Twitter</a>
                    <button onClick={() => { onOpenBlueprint(); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-beetle-gold text-left">Blueprint</button>
                    <div className="flex flex-col gap-4 mt-4 border-t border-white/10 pt-6">
                        <ConnectButton />
                        <button
                            onClick={() => { navigate('/app'); setMobileMenuOpen(false); }}
                            className="bg-beetle-electric text-black font-black py-3 rounded-lg"
                        >
                            LAUNCH APP
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
