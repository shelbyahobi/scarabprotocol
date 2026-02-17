import { motion, AnimatePresence } from 'framer-motion';

export default function BlueprintModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#0a1a0f] border border-beetle-gold/30 w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl relative font-sans"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-[#0a1a0f]/95 backdrop-blur border-b border-beetle-gold/10 p-6 flex justify-between items-center z-10">
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter">
                                ROLL <span className="text-beetle-gold">PROTOCOL</span>
                            </h2>
                            <p className="text-xs text-beetle-gold/70 font-mono tracking-widest uppercase mt-1">Technical Architecture & Ecosystem Blueprint</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 space-y-16">

                        {/* I. Executive Overview */}
                        <section>
                            <h3 className="text-2xl font-black text-white mb-6 border-l-4 border-beetle-gold pl-4">I. Executive Overview</h3>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                The <strong>ROLL Protocol ($ROLL)</strong> is a decentralized financial infrastructure designed to establish a sovereign <strong>Physical Identity</strong>. In an era of increasing systemic fragility, $ROLL provides a dual-purpose solution: a high-security cryptographic asset and a direct gateway to the Off-Grid Economy.
                            </p>
                            <p className="text-gray-300 leading-relaxed mt-4">
                                Unlike purely speculative tokens, $ROLL utilizes a proprietary <strong>Gated Utility Marketplace</strong> model. It functions as the "Proof of Work" for building real-world resilience—funding hardware, acquiring land, and securing essential resources for the colony.
                            </p>
                        </section>

                        {/* II. The Philosophy */}
                        <section>
                            <h3 className="text-2xl font-black text-white mb-6 border-l-4 border-beetle-gold pl-4">II. The Philosophy of Resilience (The Beetle Metaphor)</h3>
                            <p className="text-gray-300 mb-6">
                                In the natural world, the Beetle is a master of <strong>circular engineering</strong>. It does not wait for handouts; it builds its own world from available resources, rolling them into a perfectly spherical foundation (The Ball) to sustain its colony.
                            </p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                    <div className="text-beetle-gold font-black text-xl mb-2">The Foundation</div>
                                    <p className="text-sm text-gray-400">Our "un-ruggable" smart contract infrastructure.</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                    <div className="text-beetle-gold font-black text-xl mb-2">The Momentum</div>
                                    <p className="text-sm text-gray-400">The community-driven "Roll" toward independence.</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                    <div className="text-beetle-gold font-black text-xl mb-2">The Colony</div>
                                    <p className="text-sm text-gray-400">The ultimate goal of decentralized, off-grid living hubs.</p>
                                </div>
                            </div>
                        </section>

                        {/* III. Ecosystem Utility */}
                        <section>
                            <h3 className="text-2xl font-black text-white mb-6 border-l-4 border-beetle-gold pl-4">III. Ecosystem Utility: The Gated Marketplace</h3>
                            <p className="text-gray-300 mb-8">
                                The $ROLL token functions as a <strong>Tiered Access Key</strong> within our proprietary marketplace. By holding $ROLL, users unlock varying levels of the <strong>Colony Discount Protocol</strong>, reducing the cost of high-value off-grid hardware (Solar, Filtration, Starlink-integrated hubs).
                            </p>

                            {/* Pro Table */}
                            <div className="overflow-hidden rounded-xl border border-beetle-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-beetle-gold/10 border-b border-beetle-gold/20">
                                            <th className="p-4 text-beetle-gold font-black uppercase text-sm tracking-widest">Tier</th>
                                            <th className="p-4 text-beetle-gold font-black uppercase text-sm tracking-widest">Designation</th>
                                            <th className="p-4 text-beetle-gold font-black uppercase text-sm tracking-widest">Holding Requirement</th>
                                            <th className="p-4 text-beetle-gold font-black uppercase text-sm tracking-widest">Utility & Benefits</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr className="bg-black/40 hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-gray-400 font-mono">I</td>
                                            <td className="p-4 text-white font-bold">Scout</td>
                                            <td className="p-4 text-beetle-blue font-mono">100,000 $ROLL</td>
                                            <td className="p-4 text-gray-300 text-sm">Base access to the Off-Grid Shop + 5% Global Discount.</td>
                                        </tr>
                                        <tr className="bg-black/40 hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-gray-400 font-mono">II</td>
                                            <td className="p-4 text-white font-bold">Guardian</td>
                                            <td className="p-4 text-beetle-blue font-mono">1,000,000 $ROLL</td>
                                            <td className="p-4 text-gray-300 text-sm">Priority Shipping + 15% Discount on Solar & Water Systems.</td>
                                        </tr>
                                        <tr className="bg-black/40 hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-beetle-gold font-mono font-bold">III</td>
                                            <td className="p-4 text-beetle-gold font-bold">Elder</td>
                                            <td className="p-4 text-beetle-gold font-mono font-bold">5,000,000 $ROLL</td>
                                            <td className="p-4 text-white font-bold text-sm shadow-glow">25% Discount + Governance Rights on Colony Land Acquisitions.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* IV. Security */}
                        <section>
                            <h3 className="text-2xl font-black text-white mb-6 border-l-4 border-beetle-gold pl-4">IV. Security & Transparency Protocol</h3>
                            <p className="text-gray-300 mb-6">To ensure institutional-grade safety for our community, the ROLL Protocol implements a <strong>Multi-Layer Security Shield</strong>:</p>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded bg-beetle-green/20 flex items-center justify-center text-beetle-green font-bold text-sm border border-beetle-green/30 mt-1">1</div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">The 48-Hour Transparency Timelock</h4>
                                        <p className="text-gray-400 text-sm mt-1">All administrative functions (such as blacklisting malicious bots or updating wallet addresses) are subject to a hard-coded 2-day delay. This ensures that the community has a 48-hour "public warning" before any significant changes are executed.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded bg-beetle-green/20 flex items-center justify-center text-beetle-green font-bold text-sm border border-beetle-green/30 mt-1">2</div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Reentrancy Guard & Audit Compliance</h4>
                                        <p className="text-gray-400 text-sm mt-1">The smart contract includes a dedicated ReentrancyGuard (OpenZeppelin standard) to block complex drainage exploits. Our logic has been stress-tested against the most common DeFi attack vectors.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded bg-beetle-green/20 flex items-center justify-center text-beetle-green font-bold text-sm border border-beetle-green/30 mt-1">3</div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Strategic Decentralization</h4>
                                        <ul className="text-gray-400 text-sm mt-1 list-disc list-inside">
                                            <li><strong>Ownership Transition:</strong> Moved to Gnosis Safe Multi-Sig or Renounced upon launch.</li>
                                            <li><strong>Liquidity Integrity:</strong> 100% of initial liquidity is locked for a minimum of 1 year.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* V. Tokenomics */}
                        <section>
                            <h3 className="text-2xl font-black text-white mb-6 border-l-4 border-beetle-gold pl-4">V. Tokenomics: The "Cycle of Growth"</h3>
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-8 text-center">
                                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">The $ROLL economy is designed to be self-sustaining, with every transaction contributing to the physical expansion of the project.</p>

                                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-red-500 mb-2">5%</div>
                                        <div className="text-sm font-bold text-white uppercase tracking-wider">Ecosystem Tax</div>
                                        <div className="text-xs text-gray-500">(Sells Only)</div>
                                    </div>
                                    <div className="w-px bg-white/10 h-16 hidden md:block"></div>
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-beetle-blue mb-2">3%</div>
                                        <div className="text-sm font-bold text-white uppercase tracking-wider">Marketing</div>
                                        <div className="text-xs text-gray-500">Global Outreach</div>
                                    </div>
                                    <div className="w-px bg-white/10 h-16 hidden md:block"></div>
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-beetle-green mb-2">2%</div>
                                        <div className="text-sm font-bold text-white uppercase tracking-wider">RWA Fund</div>
                                        <div className="text-xs text-gray-500">Physical Assets</div>
                                    </div>
                                    <div className="w-px bg-white/10 h-16 hidden md:block"></div>
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-beetle-gold mb-2">0%</div>
                                        <div className="text-sm font-bold text-white uppercase tracking-wider">Buy Tax</div>
                                        <div className="text-xs text-gray-500">Rapid Growth</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* VI. Roadmap */}
                        <section>
                            <h3 className="text-2xl font-black text-white mb-6 border-l-4 border-beetle-gold pl-4">VI. Roadmap: The Great Roll</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="font-mono text-beetle-gold font-bold whitespace-nowrap">Phase 1</div>
                                    <div>
                                        <h4 className="text-white font-bold">The Burrowing</h4>
                                        <p className="text-gray-400 text-sm">Strategic deployment, Vercel-to-Professional Domain migration, and Seed Sale launch.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="font-mono text-gray-500 font-bold whitespace-nowrap">Phase 2</div>
                                    <div>
                                        <h4 className="text-white font-bold">The First Roll</h4>
                                        <p className="text-gray-400 text-sm">DEX Launch, 1-Year Liquidity Lock, and first Marketplace Beta release.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="font-mono text-gray-500 font-bold whitespace-nowrap">Phase 3</div>
                                    <div>
                                        <h4 className="text-white font-bold">The Colony Expansion</h4>
                                        <p className="text-gray-400 text-sm">Onboarding major solar and eco-tech partners. Tiered Dashboard goes live.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Footer CTA */}
                    <div className="p-6 bg-black/40 border-t border-white/5 text-center">
                        <div className="mb-4">
                            <span className="text-gray-500 text-sm uppercase tracking-widest mr-2">Verified Contract:</span>
                            <code className="text-beetle-gold bg-beetle-gold/10 px-2 py-1 rounded text-sm cursor-pointer hover:bg-beetle-gold/20 transition-colors"
                                onClick={() => navigator.clipboard.writeText(import.meta.env.VITE_ROLL_TOKEN_ADDRESS)}>
                                0x4D9c...8c9f 📋
                                {import.meta.env.VITE_ROLL_TOKEN_ADDRESS} 📋
                            </code>
                        </div>
                        <a
                            href="https://github.com/shelbyahobi/roll-token-official-"
                            target="_blank"
                            className="inline-flex items-center gap-2 text-white hover:text-beetle-gold transition-colors font-bold text-sm"
                        >
                            View Source Code on GitHub →
                        </a>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
