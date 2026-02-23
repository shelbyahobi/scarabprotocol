import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Scroll, Copy, Database, Layers, RefreshCw } from 'lucide-react';
import { CONFIG } from '../config';
import { useState } from 'react';
import ScarabLogo from './ScarabLogo';

export default function BlueprintModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [copied, setCopied] = useState(false);
    const contractAddress = CONFIG.ROLL_TOKEN_ADDRESS;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(contractAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

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
                        <div className="flex items-center gap-4">
                            <ScarabLogo variant="mark" size={44} />
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tighter">
                                    SCARAB <span className="text-beetle-gold">PROTOCOL</span>
                                </h2>
                                <p className="text-xs text-beetle-gold/70 font-mono tracking-widest uppercase mt-0.5">Technical Architecture & Ecosystem Blueprint</p>
                            </div>
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
                                The <strong>SCARAB Protocol</strong> is a decentralized physical infrastructure network (DePIN) designed to regenerate the planet. We finance, deploy, and verify <strong>Productive Real World Assets</strong>—from solar arrays to waste-to-energy systems.
                            </p>
                            <div className="bg-beetle-gold/10 border border-beetle-gold/20 p-4 rounded-lg mt-4">
                                <h4 className="text-beetle-gold font-bold text-sm uppercase tracking-widest mb-2">Primary Primitive: Proof-of-Productive-Asset (PoPA)</h4>
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    A cryptographic attestation that a physical infrastructure unit produced measurable economic output within a defined time window. <strong>SCARAB tokens are minted as coordination incentives tied to verified physical production, not as claims on future cash flow.</strong>
                                </p>
                            </div>
                        </section>

                        {/* II. The Philosophy */}
                        <section>
                            <h3 className="text-2xl font-black text-white mb-6 border-l-4 border-beetle-gold pl-4">II. The Philosophy: Regeneration Reimagined</h3>
                            <p className="text-gray-300 mb-6">
                                The ancient Scarab turned waste into life. Modern SCARAB nodes turn waste (biomass) and sun (solar) into value. We utilize <strong>Circular Engineering</strong> to create a self-sustaining economy.
                            </p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                    <div className="text-beetle-gold font-black text-xl mb-2">The Seed</div>
                                    <p className="text-sm text-gray-400">Capital is deployed strictly for Hardware R&D and Manufacturing.</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                    <div className="text-beetle-gold font-black text-xl mb-2">The Hardware</div>
                                    <p className="text-sm text-gray-400">Embedded Nodes with Secure Elements (ATECC608A) verify output.</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                    <div className="text-beetle-gold font-black text-xl mb-2">The Colony</div>
                                    <p className="text-sm text-gray-400">A decentralized network of productive assets owned by the community.</p>
                                </div>
                            </div>
                        </section>

                        {/* III. Ecosystem Utility */}
                        <section>
                            <h3 className="text-2xl font-black text-white mb-6 border-l-4 border-beetle-gold pl-4">III. Ecosystem Utility: Asset-Backed Access</h3>
                            <p className="text-gray-300 mb-8">
                                The SCARAB token is not just currency; it is a <strong>Right to Produce</strong>. Holders gain governance over the treasury and exclusive access to hardware at wholesale prices.
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
                            <p className="text-gray-300 mb-6">To ensure institutional-grade safety for our community, the SCARAB Protocol implements a <strong>Multi-Layer Security Shield</strong>:</p>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded bg-beetle-green/20 flex items-center justify-center text-beetle-green font-bold text-sm border border-beetle-green/30 mt-1">1</div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Anti-Manipulation Safeguards</h4>
                                        <ul className="text-gray-400 text-sm mt-1 space-y-1 list-disc list-inside">
                                            <li><strong>Max Reward Caps:</strong> Hard-coded limits per device type prevent firmware spoofing.</li>
                                            <li><strong>Geographic Anomaly Detection:</strong> GPS/IP cross-referencing to prevent "server farm" simulations.</li>
                                            <li><strong>Weather Oracle Verification:</strong> Solar output validated against Chainlink local weather data.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded bg-beetle-green/20 flex items-center justify-center text-beetle-green font-bold text-sm border border-beetle-green/30 mt-1">2</div>
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
                                            <li>
                                                <div className="flex items-center gap-2">
                                                    <strong>Contract Address:</strong>
                                                    <a href={`https://testnet.bscscan.com/address/${CONFIG.ROLL_TOKEN_ADDRESS}`} target="_blank" className="text-gray-400 hover:text-beetle-gold transition-colors">
                                                        <ExternalLink size={20} />
                                                    </a>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* V. Tokenomics */}
                        <section>
                            <h3 className="text-2xl font-black text-white mb-6 border-l-4 border-beetle-gold pl-4">V. Tokenomics: Utility-First Distribution</h3>
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-8 text-center">
                                <p className="text-gray-300 mb-4 max-w-2xl mx-auto">1 Billion Fixed Supply. Asset-backed. No Inflation.</p>
                                <p className="text-xs text-gray-500 mb-8 italic max-w-lg mx-auto">
                                    DISCLAIMER: SCARAB rewards are protocol-level coordination incentives for infrastructure deployment. They are <strong>NOT dividends, profit-sharing, or guaranteed yield</strong>.
                                </p>

                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-2xl font-black text-beetle-gold mb-1">30%</div>
                                        <div className="text-xs font-bold text-white uppercase">R&D / Mfg</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-2xl font-black text-beetle-green mb-1">30%</div>
                                        <div className="text-xs font-bold text-white uppercase">Mining Pool</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-2xl font-black text-beetle-electric mb-1">25%</div>
                                        <div className="text-xs font-bold text-white uppercase">Liquidity</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-2xl font-black text-purple-500 mb-1">10%</div>
                                        <div className="text-xs font-bold text-white uppercase">Marketing</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-2xl font-black text-gray-500 mb-1">5%</div>
                                        <div className="text-xs font-bold text-white uppercase">Team</div>
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
