import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';

export default function StrategyPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8] font-sans relative overflow-x-hidden selection:bg-[#D4A843] selection:text-black">
            {/* Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-40 z-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`
            }}></div>

            <div className="max-w-[1100px] mx-auto px-6 py-10 relative z-10">
                {/* Navigation */}
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-12 transition-colors">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-5xl block mb-4 animate-bounce">🪲</span>
                    <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter bg-gradient-to-br from-[#D4A843] via-white to-[#3DDB5A] bg-clip-text text-transparent">
                        3-Phase DePIN Launch
                    </h1>
                    <p className="text-gray-500 uppercase tracking-[3px] text-sm">Strategic Infrastructure Raise · RWA Backed</p>
                </div>

                <div className="text-center text-xs text-gray-500 font-mono mb-10 p-2 bg-white/5 rounded-lg inline-block mx-auto w-full">
                    Target Raise: $2.0M USD · Funding R&D for Embedded DePIN Hardware
                </div>

                {/* Price Ladder */}
                <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-8 mb-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4A843] via-[#3DDB5A] to-[#4D9FFF]"></div>
                    <div className="text-[11px] uppercase tracking-[3px] text-gray-500 mb-7">Price Ladder — Value Escalation</div>

                    <div className="flex items-end gap-2 h-[200px] pb-10 relative border-b border-[#1E1E1E]">
                        {/* Phase 1 Bar */}
                        <div className="flex-1 flex flex-col items-center justify-end relative cursor-pointer group">
                            <div className="absolute -top-7 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-[#3DDB5A] whitespace-nowrap">Lowest Entry</div>
                            <div className="w-full h-[60px] bg-gradient-to-b from-[#D4A843] to-[#7A5A0F] rounded-t-md group-hover:brightness-125 transition-all flex justify-center pt-2">
                                <span className="font-mono text-[10px] font-medium text-black/80">8M/$100</span>
                            </div>
                            <span className="absolute -bottom-9 text-[11px] font-bold text-center">
                                <span className="text-[#D4A843]">Phase 1</span><br />
                                <span className="text-gray-500 font-normal">$0.0000125</span>
                            </span>
                        </div>

                        {/* Phase 2 Bar */}
                        <div className="flex-1 flex flex-col items-center justify-end relative cursor-pointer group">
                            <div className="w-full h-[100px] bg-gradient-to-b from-[#3DDB5A] to-[#1A6B2A] rounded-t-md group-hover:brightness-125 transition-all flex justify-center pt-2">
                                <span className="font-mono text-[10px] font-medium text-black/80">6M/$100</span>
                            </div>
                            <span className="absolute -bottom-9 text-[11px] font-bold text-center">
                                <span className="text-[#3DDB5A]">Phase 2</span><br />
                                <span className="text-gray-500 font-normal">$0.0000166</span>
                            </span>
                        </div>

                        {/* Phase 3 Bar */}
                        <div className="flex-1 flex flex-col items-center justify-end relative cursor-pointer group">
                            <div className="w-full h-[140px] bg-gradient-to-b from-[#4D9FFF] to-[#1A4080] rounded-t-md group-hover:brightness-125 transition-all flex justify-center pt-2">
                                <span className="font-mono text-[10px] font-medium text-black/80">4.5M/$100</span>
                            </div>
                            <span className="absolute -bottom-9 text-[11px] font-bold text-center">
                                <span className="text-[#4D9FFF]">Phase 3</span><br />
                                <span className="text-gray-500 font-normal">$0.0000222</span>
                            </span>
                        </div>

                        {/* Launch Bar */}
                        <div className="flex-1 flex flex-col items-center justify-end relative cursor-pointer group">
                            <div className="w-full h-[180px] bg-gradient-to-b from-white to-gray-500 rounded-t-md group-hover:brightness-125 transition-all flex justify-center pt-2">
                                <span className="font-mono text-[10px] font-medium text-black/80">3M/$100</span>
                            </div>
                            <span className="absolute -bottom-9 text-[11px] font-bold text-center">
                                <span className="text-white">DEX Launch</span><br />
                                <span className="text-gray-500 font-normal">$0.0000333</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Phase Cards Grid */}
                <div className="grid md:grid-cols-3 gap-4 mb-10">
                    {/* Phase 1 */}
                    <div className="bg-[#111] border border-[#1E1E1E] border-t-[3px] border-t-[#D4A843] rounded-2xl p-6 hover:-translate-y-1 hover:border-[#D4A843] transition-all cursor-pointer group">
                        <div className="text-[10px] tracking-[3px] text-gray-500 mb-2 uppercase">Phase 01</div>
                        <div className="text-xl font-black text-[#D4A843] mb-5 group-hover:scale-105 transition-transform origin-left">Infrastructure Seed</div>

                        <div className="space-y-3">
                            <Stat label="Goal" value="Prototype R&D" />
                            <Stat label="Soft Cap" value="$300,000" color="#D4A843" />
                            <Stat label="Hard Cap" value="$600,000" />
                            <Stat label="Allocation" value="5% of Supply" />
                            <Stat label="Max Wallet" value="$5,000" />
                        </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="bg-[#111] border border-[#1E1E1E] border-t-[3px] border-t-[#3DDB5A] rounded-2xl p-6 hover:-translate-y-1 hover:border-[#3DDB5A] transition-all cursor-pointer group">
                        <div className="text-[10px] tracking-[3px] text-gray-500 mb-2 uppercase">Phase 02</div>
                        <div className="text-xl font-black text-[#3DDB5A] mb-5 group-hover:scale-105 transition-transform origin-left">Hardware Production</div>

                        <div className="space-y-3">
                            <Stat label="Goal" value="Batch Mfg" />
                            <Stat label="Soft Cap" value="$400,000" color="#3DDB5A" />
                            <Stat label="Hard Cap" value="$800,000" />
                            <Stat label="Allocation" value="10% of Supply" />
                            <Stat label="Max Wallet" value="$15,000" />
                        </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="bg-[#111] border border-[#1E1E1E] border-t-[3px] border-t-[#4D9FFF] rounded-2xl p-6 hover:-translate-y-1 hover:border-[#4D9FFF] transition-all cursor-pointer group">
                        <div className="text-[10px] tracking-[3px] text-gray-500 mb-2 uppercase">Phase 03</div>
                        <div className="text-xl font-black text-[#4D9FFF] mb-5 group-hover:scale-105 transition-transform origin-left">Liquidity & Launch</div>

                        <div className="space-y-3">
                            <Stat label="Goal" value="Global Mktg" />
                            <Stat label="Soft Cap" value="$250,000" color="#4D9FFF" />
                            <Stat label="Hard Cap" value="$600,000" />
                            <Stat label="Allocation" value="15% of Supply" />
                            <Stat label="Max Wallet" value="$25,000" />
                        </div>
                    </div>
                </div>

                {/* Cumulative Funding */}
                <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-8 mb-10">
                    <div className="text-[11px] uppercase tracking-[3px] text-gray-500 mb-7">Cumulative Raise — Hard Cap Targets</div>
                    <div className="space-y-4">
                        <FundingRow label="After Phase 1" pct="30%" color="#D4A843" value="$600,000" />
                        <FundingRow label="After Phase 2" pct="70%" color="linear-gradient(90deg, #D4A843, #3DDB5A)" value="$1,400,000" />
                        <FundingRow label="After Phase 3" pct="100%" color="linear-gradient(90deg, #D4A843, #3DDB5A, #4D9FFF)" value="$2,000,000" />
                    </div>
                </div>

                {/* Verdict Box */}
                <div className="bg-[#3DDB5A]/5 border border-[#3DDB5A]/20 rounded-2xl p-8 text-center mb-12">
                    <h3 className="text-xl font-black text-[#3DDB5A] mb-3">✅ DePIN Model Approved</h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        This raise structure prioritizes <strong>Infrastructure R&D</strong> over pure liquidity.
                        Funds are strictly gated for the development of the <strong>Secure Element Firmware</strong> and the manufacturing of the first 1,000 Embedded Node modules.
                    </p>
                    <div className="mt-6">
                        <Link to="/app" className="inline-flex items-center gap-2 bg-[#D4A843] text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform">
                            <Rocket size={18} /> Join Phase 1
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

function Stat({ label, value, color }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-[#1E1E1E] text-[13px] last:border-0">
            <span className="text-gray-500">{label}</span>
            <span className="font-mono font-medium" style={{ color: color || '#E8E8E8' }}>{value}</span>
        </div>
    );
}

function FundingRow({ label, pct, color, value }) {
    return (
        <div className="grid grid-cols-[140px_1fr_auto] gap-4 items-center text-[13px]">
            <span className="text-gray-500">{label}</span>
            <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: pct, background: color }}></div>
            </div>
            <span className="font-mono text-white whitespace-nowrap">{value}</span>
        </div>
    );
}
