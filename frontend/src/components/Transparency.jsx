import { motion } from 'framer-motion';
import { Shield, Search, Lock, FileCode, CheckCircle, ExternalLink } from 'lucide-react';
import { CONFIG } from '../config';

export default function Transparency() {
    return (
        <section className="py-24 bg-black/40 border-t border-white/5 relative overflow-hidden">

            <div className="container mx-auto px-4 relative z-10">

                <div className="grid md:grid-cols-2 gap-12 items-center mb-24 cursor-pointer hover:scale-[1.02] transition-transform duration-500">
                    <div className="order-2 md:order-1">
                        <img src="/circular_economy.png" alt="Circular Economy" className="rounded-3xl border border-beetle-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.1)] w-full" />
                    </div>
                    <div className="order-1 md:order-2">
                        <h3 className="text-3xl font-black text-white mb-4">The <span className="text-beetle-electric">Circular Economy</span></h3>
                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                            Every trade feeds the colony. A <span className="text-white font-bold">5% Tax</span> funds the acquisition of high-utility RWA (Real World Assets) like Solar Generators and Water filters.
                        </p>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            These assets are then offered to holders at steep discounts, creating a self-sustaining loop of value that exists <strong>independently of market speculation.</strong>
                        </p>
                    </div>
                </div>

                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                        Immutable <span className="text-beetle-gold">Security</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-12">
                        We don't trust. We verify. The ROLL Protocol is hardened by cryptographic guarantees.
                    </p>

                    <div className="max-w-4xl mx-auto mb-16 cursor-pointer hover:scale-[1.02] transition-transform duration-500">
                        <img src="/security_shield.png" alt="Security Shield Timeline" className="rounded-3xl border border-beetle-electric/20 shadow-[0_0_50px_rgba(0,240,255,0.1)] w-full" />
                        <p className="text-center text-gray-500 mt-4 text-sm font-mono">Figure 1: The 48-Hour Governance Timelock Protocol</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    {/* Feature 1 */}
                    <div className="bg-[#0a1a0f]/40 border border-white/5 p-8 rounded-3xl hover:border-beetle-gold/30 transition-all group">
                        <div className="w-14 h-14 bg-beetle-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Clock size={32} className="text-beetle-gold" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">48-Hour Timelock</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Administrative actions are delayed by 2 days. You will always know what's changing before it happens.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-[#0a1a0f]/40 border border-white/5 p-8 rounded-3xl hover:border-beetle-electric/30 transition-all group">
                        <div className="w-14 h-14 bg-beetle-electric/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Lock size={32} className="text-beetle-electric" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Liquidity Locked</h3>
                        <p className="text-gray-400 leading-relaxed">
                            100% of initial liquidity is locked for 1 Year via a decentralized locker. No rug pulls, only rolling.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-[#0a1a0f]/40 border border-white/5 p-8 rounded-3xl hover:border-green-500/30 transition-all group">
                        <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Shield size={32} className="text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Reentrancy Guard</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Standard OpenZeppelin security modules prevent drainage exploits and complex attack vectors.
                        </p>
                    </div>

                </div>

                {/* Bottom Stats / Links */}
                <div className="mt-20 flex flex-wrap justify-center gap-4">
                    <a href="#" className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 transition-all">
                        <Users size={20} className="text-gray-400" />
                        <span className="text-white font-bold">Community Owndership</span>
                    </a>
                    <a href={`https://testnet.bscscan.com/address/${CONFIG.ROLL_TOKEN_ADDRESS}`} target="_blank" className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 transition-all">
                        <CheckCircle size={20} className="text-beetle-gold" />
                        <span className="text-white font-bold">Verified Contract</span>
                    </a>
                </div>

            </div>
        </section>
    );
}
