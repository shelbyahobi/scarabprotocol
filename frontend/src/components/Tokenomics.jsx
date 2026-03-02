import { PieChart, TrendingUp, Users, Shield, Zap, Vault, Scale, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function Tokenomics() {
    // Data for the chart
    // Data for the chart matching Blueprint
    const data = [
        { label: "Seed Sale (R&D)", value: 30, color: "bg-beetle-gold", desc: "Funding Hardware R&D & Mfg" },
        { label: "Regeneration Pool", value: 30, color: "bg-beetle-green", desc: "Mining Rewards for verified output" },
        { label: "Liquidity Pool", value: 25, color: "bg-beetle-electric", desc: "Locked for 12 Months" },
        { label: "Marketing & Scale", value: 10, color: "bg-purple-500", desc: "Global Expansion" },
        { label: "Team (Vested)", value: 5, color: "bg-gray-600", desc: "24-Month Linear Vesting" },
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-[#050a05]">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                        Token<span className="text-beetle-electric">omics</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        1 Billion Fixed Supply. No Inflation Design.
                        <br />
                        <span className="text-beetle-gold">Utility-First Distribution.</span>
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* CHART SECTION */}
                    <div className="relative flex justify-center">
                        {/* CSS Conic Gradient based on new percentages:
                            30% = 108deg
                            30% = 108deg
                            25% = 90deg
                            10% = 36deg
                            5%  = 18deg
                        */}
                        <div className="w-80 h-80 rounded-full relative shadow-[0_0_50px_rgba(0,240,255,0.1)] hover:scale-105 transition-transform duration-500 ease-out" style={{
                            background: `conic-gradient(
                                #D4A843 0deg 108deg,
                                #3DDB5A 108deg 216deg,
                                #4D9FFF 216deg 306deg,
                                #A855F7 306deg 342deg,
                                #4B5563 342deg 360deg
                            )`
                        }}>
                            <div className="absolute inset-4 bg-[#050a05] rounded-full flex flex-col items-center justify-center z-10">
                                <span className="text-5xl font-black text-white">1B</span>
                                <span className="text-sm text-gray-500 uppercase tracking-widest font-bold mt-2">Fixed Supply</span>
                            </div>
                        </div>
                    </div>

                    {/* DETAILS SECTION */}
                    <div>
                        <div className="space-y-4 mb-10">
                            {data.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_8px_currentColor]`}></div>
                                        <div>
                                            <div className="text-white font-bold">{item.label}</div>
                                            <div className="text-xs text-gray-500">{item.desc}</div>
                                        </div>
                                    </div>
                                    <div className="font-mono text-beetle-gold font-bold">{item.value}%</div>
                                </div>
                            ))}
                        </div>

                        {/* TAX STRUCTURE */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Zap className="text-beetle-electric" size={18} /> Transaction Economics
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-center">
                                    <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">Buy Tax</div>
                                    <div className="text-3xl font-black text-beetle-green">0%</div>
                                    <div className="text-[10px] text-gray-500 mt-1">Frictionless Entry</div>
                                </div>
                                <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-center">
                                    <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">Sell Tax</div>
                                    <div className="text-3xl font-black text-red-400">5%</div>
                                    <div className="text-[10px] text-gray-500 mt-1">3% Mktg / 2% Hardware</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ENDGAME STRATEGY */}
                <div className="mt-8 bg-beetle-gold/5 rounded-2xl p-6 border border-beetle-gold/10">
                    <h3 className="text-beetle-gold font-bold mb-2 flex items-center gap-2">
                        <TrendingUp size={18} /> The Endgame: Revenue-Led Sustainability
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        By Year 8+, SCARAB transitions from "Emission-Led Growth" to "Revenue-Led Sustainability".
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-black/40 p-2 rounded border border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase">Phase 1</div>
                            <div className="text-white font-bold text-sm">Subsidy</div>
                        </div>
                        <div className="bg-black/40 p-2 rounded border border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase">Phase 2</div>
                            <div className="text-white font-bold text-sm">Burn</div>
                        </div>
                        <div className="bg-black/40 p-2 rounded border border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase">Phase 3</div>
                            <div className="text-beetle-green font-bold text-sm">Deflation</div>
                        </div>
                    </div>
                </div>

                {/* THE NODE SCALING FLYWHEEL - NEW */}
                <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-beetle-green/10 rounded-full blur-[80px]"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-beetle-green/10 border border-beetle-green/30 rounded-xl flex items-center justify-center">
                                <Scale className="text-beetle-green w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white">The Scaling Flywheel</h3>
                                <p className="text-gray-400">Yield Compression vs. Value Appreciation</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                    <ArrowDownRight className="text-red-400" size={18} /> 1. Yield Compression
                                </h4>
                                <p className="text-gray-400 text-sm mb-4">
                                    The protocol emits a <strong className="text-white">fixed</strong> daily overall pool of SCARAB. As we add <strong>different types of nodes</strong> (Solar, Bokashi, Biogas), they all share this exact same fixed pool. If 1,000 new Solar nodes join, the daily quantity of SCARAB earned by existing Bokashi nodes decreases. Early adopters earn the highest token quantities.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                    <ArrowUpRight className="text-beetle-gold" size={18} /> 2. Value Appreciation
                                </h4>
                                <p className="text-gray-400 text-sm mb-4">
                                    While individual token <em>quantity</em> drops, token <em>value</em> rises. 10,000 nodes of varying types generate 100x more real-world revenue (hardware sales, energy, compost) than 100 nodes. All that revenue flows directly into the Liquidity Vault, driving the <strong className="text-beetle-gold">Treasury Support Ratio</strong> upward. You earn fewer tokens, but each token represents significantly more underlying value.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-5 rounded-xl mt-4">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                <strong className="text-beetle-electric font-bold">The DePIN Meta:</strong> Earning 5 SCARAB when the protocol is backed by $10,000,000 in Real-World Assets is mathematically far more lucrative than earning up to 50 SCARAB when it is backed by $0. As the network expands, the shared pool compresses yields, but aggressively skyrockets the token value.
                            </p>
                        </div>
                    </div>
                </div>

                {/* BOKASHI ROI EXAMPLE */}
                <div className="mt-8 bg-[#0a1a0f] border border-green-500/20 rounded-2xl p-8 relative overflow-hidden">
                    <h3 className="text-2xl font-black text-white mb-2">The Ecosystem Subscription (Network Value)</h3>
                    <p className="text-gray-400 mb-6">
                        To earn SCARAB from an active Bokashi Node, users must maintain an active <strong>$9 USDT/month</strong> hardware supply subscription (for the fermentation Bran bags) and physically scan the unique QR code on each bag to unlock the smart contract minting cycle. Here is how the Vault Floor mathematically supports the ecosystem over time:
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                            <div className="text-3xl font-black text-white">100</div>
                            <div className="text-sm text-gray-500 mt-1">SCARAB / Month<br />(Example Compressed Yield)</div>
                        </div>
                        <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                            <div className="text-3xl font-black text-red-400">$9</div>
                            <div className="text-sm text-gray-500 mt-1">Monthly Subscription Cost<br />(Bokashi Bran)</div>
                        </div>
                        <div className="bg-black/40 p-6 rounded-xl border border-green-500/20 relative shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                            <div className="text-3xl font-black text-green-400">$0.09</div>
                            <div className="text-sm text-gray-500 mt-1">Required Support Ratio<br />to Break Even</div>
                        </div>
                    </div>

                    <div className="mt-6 text-sm text-gray-400 leading-relaxed border-t border-white/10 pt-6">
                        <strong className="text-white">The Math:</strong> When the SCARAB Treasury Support Ratio reaches $0.09 (backed entirely by hard cash in the Vault), burning 100 tokens nets $9.00—completely covering the subscription cost forever. Any market speculation above the $0.09 baseline is additional value. Because the Vault continuously rises as thousands of cross-sector nodes are sold, early adopters lock in massive token reserves before the yield compresses.
                    </div>
                </div>

                {/* USDC FLOOR PRICE FORMULA */}
                <div className="mt-6 bg-black/40 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                        <Vault size={18} className="text-beetle-gold" /> Token Baseline Treasury Mechanism
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Unlike speculative tokens, SCARAB has a growing mathematical baseline backed by hardware sales revenue.
                        <strong className="text-beetle-gold"> $50 USDC</strong> from every node sale is locked in the Liquidity Backing Vault.
                    </p>
                    <div className="bg-[#0a1a0f] border border-beetle-gold/20 rounded-xl p-4 mb-4 text-center font-mono">
                        <div className="text-lg">
                            <span className="text-beetle-gold font-bold">P</span>
                            <span className="text-beetle-gold/60 text-xs align-sub">floor</span>
                            <span className="text-white mx-3">=</span>
                            <span className="text-green-400 font-bold">V</span>
                            <span className="text-green-400/60 text-xs align-sub">USDC</span>
                            <span className="text-white mx-3">÷</span>
                            <span className="text-beetle-electric font-bold">S</span>
                            <span className="text-beetle-electric/60 text-xs align-sub">circ</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-2">USDC in Backing Vault ÷ Circulating Supply</p>
                    </div>
                    <div className="grid grid-cols-3 text-xs font-mono gap-0">
                        <div className="py-1 text-center border-b border-white/5 text-[10px] text-gray-500 uppercase">Year</div>
                        <div className="py-1 text-center border-b border-white/5 text-[10px] text-gray-500 uppercase">USDC Vault</div>
                        <div className="py-1 text-center border-b border-white/5 text-[10px] text-gray-500 uppercase">Floor</div>
                        <div className="py-1.5 text-center text-gray-400">Y1</div><div className="py-1.5 text-center text-gray-400">$100K</div><div className="py-1.5 text-center text-white font-bold">$0.0025</div>
                        <div className="py-1.5 text-center text-gray-400">Y2</div><div className="py-1.5 text-center text-gray-400">$500K</div><div className="py-1.5 text-center text-white font-bold">$0.0047</div>
                        <div className="py-1.5 text-center text-gray-400">Y3</div><div className="py-1.5 text-center text-gray-400">$1.75M</div><div className="py-1.5 text-center text-white font-bold">$0.0094</div>
                        <div className="py-1.5 text-center text-beetle-gold">Y5</div><div className="py-1.5 text-center text-beetle-gold">$12.75M</div><div className="py-1.5 text-center text-beetle-gold font-bold">$0.0425</div>
                    </div>
                    <p className="text-gray-600 text-[10px] mt-3 text-center">Worst-case floor. Market price typically 5–10× higher due to utility demand.</p>
                </div>

            </div>
        </section>
    );
}
