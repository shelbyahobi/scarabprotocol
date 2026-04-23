import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X, Rocket, LineChart, Target, Users, Leaf, BookOpen, Building2, FlaskConical, Activity, Droplet, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ScarabLogo from './ScarabLogo';

/**
 * Dual-context Navbar
 * 
 * Context A — Public/Institutional (shown on /, /municipalities, /methodology, /docs, /status):
 *   [Logo] | How It Works · For Cities · Methodology · Docs | [Apply for Pilot →]
 *   — No "Connect Wallet", no "DAO", no crypto language.
 *
 * Context B — App/Protocol (all other routes):
 *   [Logo] | SKUs · Investors · Research · DAO | [Connect Wallet] [Launch App →]
 *
 * Max height: 64px. Mobile: full-screen overlay (not dropdown).
 */

const PUBLIC_ROUTES = ['/', '/municipalities', '/why-scarab', '/ecosystem', '/methodology', '/docs', '/status', '/blueprint'];

function isPublicRoute(pathname) {
    return PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/docs/');
}

export default function Navbar({ onOpenBlueprint }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isPublic = isPublicRoute(location.pathname);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'h-16' : 'h-16'}`}
                style={{ height: 64 }}
            >
                <div className={`mx-auto max-w-7xl h-full flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${
                    scrolled
                        ? 'bg-[#050B08]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl'
                        : 'bg-transparent'
                }`}>

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 group cursor-pointer flex-shrink-0"
                        onClick={() => window.scrollTo(0, 0)}
                    >
                        <ScarabLogo variant="wordmark" size={32} className="group-hover:opacity-80 transition-opacity" />
                    </Link>

                    {/* ── Desktop Nav ── */}
                    {isPublic ? (
                        /* Context A — Public */
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                            <NavLink to="/how-it-works" label="How It Works" current={location.pathname} />
                            <NavLink to="/why-scarab" label="Why SCARAB" current={location.pathname} />
                            <div className="relative group">
                                <button className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white transition-colors h-16" style={{ letterSpacing: '0.01em' }}>
                                    Products <ChevronDown size={14} />
                                </button>
                                <div className="absolute top-[60px] left-0 w-60 bg-[#050B08] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
                                    <DropdownLink to="/app" label="Solar Sentinel" />
                                    <DropdownLink to="/app" label="Smart Bokashi Kit" />
                                    <DropdownLink to="/app" label="Pro Bioreactor" />
                                    <DropdownLink to="/uco" label="UCO Collection Node" />
                                    <DropdownLink to="/agrisentinel" label="AgriSentinel Family →" />
                                </div>
                            </div>
                            <NavLink to="/municipalities" label="For Cities" current={location.pathname} />
                            <NavLink to="/ecosystem" label="Ecosystem" current={location.pathname} />
                            <NavLink to="/methodology" label="Methodology" current={location.pathname} />
                        </div>
                    ) : (
                        /* Context B — App/Protocol */
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                            <NavLink to="/app" label="SKUs" current={location.pathname} />
                            <NavLink to="/investors" label="Investors" current={location.pathname} />
                            <NavLink to="/research" label="Research" current={location.pathname} />
                            <NavLink to="/dao" label="DAO" current={location.pathname} />
                        </div>
                    )}

                    {/* ── Desktop CTA ── */}
                    {isPublic ? (
                        <div className="hidden md:flex items-center">
                            <Link
                                to="/municipalities#apply"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-full text-sm transition-colors"
                            >
                                Apply for Pilot →
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
                            <button
                                onClick={() => navigate('/app')}
                                className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-beetle-electric transition-colors flex items-center gap-2"
                            >
                                Launch App <Rocket size={14} />
                            </button>
                        </div>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-white p-2 -mr-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* ── Mobile Full-Screen Overlay ── */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[#050B08]/98 backdrop-blur-2xl flex flex-col pt-20 px-6 pb-8">
                    {/* Close button */}
                    <button
                        className="absolute top-5 right-4 text-white p-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <X size={28} />
                    </button>

                    <div className="flex flex-col gap-2 flex-1">
                        {isPublic ? (
                            /* Public mobile links */
                            <>
                                <MobileNavLink to="/how-it-works" label="How It Works" icon={<FlaskConical size={22} className="text-emerald-400" />} close={() => setMobileMenuOpen(false)} />
                                <MobileNavLink to="/why-scarab" label="Why SCARAB" icon={<Target size={22} className="text-emerald-400" />} close={() => setMobileMenuOpen(false)} />
                                <div className="px-4 py-2">
                                    <div className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Products</div>
                                    <div className="flex flex-col gap-2 pl-4 border-l border-white/10">
                                        <MobileNavLink to="/app" label="Solar Sentinel" close={() => setMobileMenuOpen(false)} />
                                        <MobileNavLink to="/app" label="Smart Bokashi Kit" close={() => setMobileMenuOpen(false)} />
                                        <MobileNavLink to="/app" label="Pro Bioreactor" close={() => setMobileMenuOpen(false)} />
                                        <MobileNavLink to="/uco" label="UCO Collection Node" close={() => setMobileMenuOpen(false)} />
                                        <MobileNavLink to="/agrisentinel" label="AgriSentinel Family →" close={() => setMobileMenuOpen(false)} />
                                    </div>
                                </div>
                                <MobileNavLink to="/municipalities" label="For Cities" icon={<Building2 size={22} className="text-emerald-400" />} close={() => setMobileMenuOpen(false)} />
                                <MobileNavLink to="/ecosystem" label="Ecosystem" icon={<Activity size={22} className="text-emerald-400" />} close={() => setMobileMenuOpen(false)} />
                                <MobileNavLink to="/methodology" label="Methodology" icon={<Leaf size={22} className="text-emerald-400" />} close={() => setMobileMenuOpen(false)} />
                            </>
                        ) : (
                            /* App mobile links */
                            <>
                                <MobileNavLink to="/app" label="SKUs" icon={<Rocket size={22} className="text-beetle-electric" />} close={() => setMobileMenuOpen(false)} />
                                <MobileNavLink to="/investors" label="Investors" icon={<LineChart size={22} className="text-green-400" />} close={() => setMobileMenuOpen(false)} />
                                <MobileNavLink to="/research" label="Research" icon={<Target size={22} className="text-purple-400" />} close={() => setMobileMenuOpen(false)} />
                                <MobileNavLink to="/dao" label="DAO" icon={<Users size={22} className="text-gray-400" />} close={() => setMobileMenuOpen(false)} />
                            </>
                        )}
                    </div>

                    {/* CTA at bottom */}
                    <div className="border-t border-white/10 pt-6">
                        {isPublic ? (
                            <Link
                                to="/municipalities#apply"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full bg-emerald-600 text-white font-black text-center py-4 rounded-2xl text-lg"
                            >
                                Apply for Pilot →
                            </Link>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-center">
                                    <ConnectButton showBalance={false} />
                                </div>
                                <button
                                    onClick={() => { navigate('/app'); setMobileMenuOpen(false); }}
                                    className="bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2"
                                >
                                    Launch App <Rocket size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

function NavLink({ to, label, current }) {
    const isActive = current === to || (to !== '/' && current.startsWith(to.split('#')[0]));
    return (
        <Link
            to={to}
            style={{ letterSpacing: '0.01em' }}
            className={`transition-colors ${isActive ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
        >
            {label}
        </Link>
    );
}

function MobileNavLink({ to, label, icon, close }) {
    return (
        <Link
            to={to}
            onClick={close}
            className="flex items-center gap-4 text-xl font-bold text-gray-200 hover:text-white p-4 rounded-2xl hover:bg-white/5 transition-colors"
        >
            {icon && icon}
            {label}
        </Link>
    );
}

function DropdownLink({ to, label }) {
    return (
        <Link
            to={to}
            className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
            {label}
        </Link>
    );
}
