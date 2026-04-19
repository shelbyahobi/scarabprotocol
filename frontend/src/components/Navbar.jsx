import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X, ArrowUpRight, BookOpen, Rocket, LineChart, Target, Users, Landmark, Leaf } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ScarabLogo from './ScarabLogo';

export default function Navbar({ onOpenBlueprint, isLanding }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we are on the main landing page or subpages
    const isAppContent = location.pathname.includes('/app') || location.pathname.includes('/transparency') || location.pathname.includes('/investors') || location.pathname.includes('/strategy');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'} px-4 md:px-8`}>
            {/* Inner Capsule */}
            <div className={`mx-auto max-w-7xl flex justify-between items-center transition-all duration-300 ${scrolled ? 'bg-[#050B08]/80 backdrop-blur-xl border border-white/10 shadow-2xl py-3 px-6 rounded-2xl' : 'bg-transparent py-2 border border-transparent'}`}>

                {/* Left: Logo */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <ScarabLogo variant="wordmark" size={32} className="group-hover:opacity-80 transition-opacity" />
                    </Link>
                </div>

                {/* Center: Core Nav Items (Prominent) */}
                <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/5 rounded-full px-2 py-1.5 backdrop-blur-md">
                    <Link
                        to="/ecosystem"
                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${location.pathname === '/ecosystem' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                    >
                        <Rocket size={16} className="text-beetle-electric/70" />
                        SKUs
                    </Link>

                    <Link
                        to="/methodology"
                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${location.pathname === '/methodology' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                    >
                        <Leaf size={16} className="text-emerald-400/70" />
                        Methodology
                    </Link>

                    <Link
                        to="/investors"
                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${location.pathname === '/investors' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                    >
                        <LineChart size={16} className="text-green-400/70" />
                        Investors
                    </Link>

                    <Link
                        to="/docs"
                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${location.pathname === '/docs' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                    >
                        <BookOpen size={16} className="text-blue-400/70" />
                        Docs
                    </Link>

                    <Link
                        to="/research"
                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${location.pathname === '/research' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                    >
                        <Target size={16} className="text-purple-400/70" />
                        Research
                    </Link>

                    <Link
                        to="/dao"
                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${location.pathname === '/dao' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                    >
                        <Users size={16} className="text-gray-400/70" />
                        DAO
                    </Link>

                    <Link
                        to="/municipalities"
                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${location.pathname === '/municipalities' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                    >
                        <Landmark size={16} className="text-emerald-400/70" />
                        For Cities
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />

                    <button
                        onClick={() => navigate('/app')}
                        className="group bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-beetle-electric hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center gap-2"
                    >
                        Launch App
                        <Rocket size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-[#050B08]/95 border border-white/10 p-6 rounded-2xl flex flex-col gap-6 backdrop-blur-2xl shadow-2xl">
                    <div className="flex flex-col gap-2">
                        <Link to="/ecosystem" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-gray-200 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <Rocket size={20} className="text-beetle-electric" /> SKUs
                        </Link>
                        <Link to="/methodology" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-gray-200 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <Leaf size={20} className="text-emerald-400" /> Methodology
                        </Link>
                        <Link to="/investors" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-gray-200 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <LineChart size={20} className="text-green-400" /> Investors
                        </Link>
                        <Link to="/docs" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-gray-200 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <BookOpen size={20} className="text-blue-400" /> Docs
                        </Link>
                        <Link to="/research" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-gray-200 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <Target size={20} className="text-purple-400" /> Research
                        </Link>
                        <Link to="/dao" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-gray-200 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <Users size={20} className="text-gray-400" /> DAO
                        </Link>
                        <Link to="/municipalities" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-gray-200 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <Landmark size={20} className="text-emerald-400" /> For Cities
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                        <div className="flex justify-center">
                            <ConnectButton showBalance={false} />
                        </div>
                        <button
                            onClick={() => { navigate('/app'); setMobileMenuOpen(false); }}
                            className="bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-beetle-electric transition-colors"
                        >
                            Launch App <Rocket size={18} />
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
