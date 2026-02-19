import { PieChart, TrendingUp, Users, Shield, Zap } from 'lucide-react';

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
            </div>
        </section>
    );
}
