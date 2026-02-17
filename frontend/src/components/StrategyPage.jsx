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
                        3-Phase Seed Sale Strategy
                    </h1>
                    <p className="text-gray-500 uppercase tracking-[3px] text-sm">SCARAB Token · BSC · Approved Parameters</p>
                </div>

                <div className="text-center text-xs text-gray-500 font-mono mb-10 p-2 bg-white/5 rounded-lg inline-block mx-auto w-full">
                    All EUR values calculated at 1 BNB = €520 · Values change with BNB price
                </div>

                {/* Price Ladder */}
                <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-8 mb-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4A843] via-[#3DDB5A] to-[#4D9FFF]"></div>
                    <div className="text-[11px] uppercase tracking-[3px] text-gray-500 mb-7">Price Ladder — FOMO Engine</div>

                    <div className="flex items-end gap-2 h-[200px] pb-10 relative border-b border-[#1E1E1E]">
                        {/* Phase 1 Bar */}
                        <div className="flex-1 flex flex-col items-center justify-end relative cursor-pointer group">
                            <div className="absolute -top-7 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-[#3DDB5A] whitespace-nowrap">+167% vs launch</div>
                            <div className="w-full h-[60px] bg-gradient-to-b from-[#D4A843] to-[#7A5A0F] rounded-t-md group-hover:brightness-125 transition-all flex justify-center pt-2">
                                <span className="font-mono text-[10px] font-medium text-black/80">8M/BNB</span>
                            </div>
                            <span className="absolute -bottom-9 text-[11px] font-bold text-center">
                                <span className="text-[#D4A843]">Phase 1</span><br />
                                <span className="text-gray-500 font-normal">€0.000065</span>
                            </span>
                        </div>

                        {/* Phase 2 Bar */}
                        <div className="flex-1 flex flex-col items-center justify-end relative cursor-pointer group">
                            <div className="absolute -top-7 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-[#3DDB5A] whitespace-nowrap">+100% vs launch</div>
                            <div className="w-full h-[100px] bg-gradient-to-b from-[#3DDB5A] to-[#1A6B2A] rounded-t-md group-hover:brightness-125 transition-all flex justify-center pt-2">
                                <span className="font-mono text-[10px] font-medium text-black/80">6M/BNB</span>
                            </div>
                            <span className="absolute -bottom-9 text-[11px] font-bold text-center">
                                <span className="text-[#3DDB5A]">Phase 2</span><br />
                                <span className="text-gray-500 font-normal">€0.0000867</span>
                            </span>
                        </div>

                        {/* Phase 3 Bar */}
                        <div className="flex-1 flex flex-col items-center justify-end relative cursor-pointer group">
                            <div className="absolute -top-7 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-[#3DDB5A] whitespace-nowrap">+50% vs launch</div>
                            <div className="w-full h-[140px] bg-gradient-to-b from-[#4D9FFF] to-[#1A4080] rounded-t-md group-hover:brightness-125 transition-all flex justify-center pt-2">
                                <span className="font-mono text-[10px] font-medium text-black/80">4.5M/BNB</span>
                            </div>
                            <span className="absolute -bottom-9 text-[11px] font-bold text-center">
                                <span className="text-[#4D9FFF]">Phase 3</span><br />
                                <span className="text-gray-500 font-normal">€0.0001156</span>
                            </span>
                        </div>

                        {/* Launch Bar */}
                        <div className="flex-1 flex flex-col items-center justify-end relative cursor-pointer group">
                            <div className="w-full h-[180px] bg-gradient-to-b from-white to-gray-500 rounded-t-md group-hover:brightness-125 transition-all flex justify-center pt-2">
                                <span className="font-mono text-[10px] font-medium text-black/80">3M/BNB</span>
                            </div>
                            <span className="absolute -bottom-9 text-[11px] font-bold text-center">
                                <span className="text-white">PancakeSwap</span><br />
                                <span className="text-gray-500 font-normal">€0.0001733</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Phase Cards Grid */}
                <div className="grid md:grid-cols-3 gap-4 mb-10">
                    {/* Phase 1 */}
                    <div className="bg-[#111] border border-[#1E1E1E] border-t-[3px] border-t-[#D4A843] rounded-2xl p-6 hover:-translate-y-1 hover:border-[#D4A843] transition-all cursor-pointer group">
                        <div className="text-[10px] tracking-[3px] text-gray-500 mb-2 uppercase">Phase 01</div>
                        <div className="text-xl font-black text-[#D4A843] mb-5 group-hover:scale-105 transition-transform origin-left">Founding Believers</div>

                        <div className="space-y-3">
                            <Stat label="SCARAB per BNB" value="8,000,000" color="#D4A843" />
                            <Stat label="Soft Cap" value="5 BNB (~€2,600)" />
                            <Stat label="Hard Cap" value="6.25 BNB (~€3,250)" />
                            <Stat label="Allocation" value="50M SCARAB (5%)" />
                            <Stat label="Max Wallet" value="1 BNB" />
                            <Stat label="Referral" value="7%" />
                            <Stat label="Duration" value="21 days" />
                        </div>
                        <div className="mt-5 inline-block px-3 py-1 rounded-full bg-[#D4A843]/15 text-[#D4A843] text-[11px] font-bold font-mono">
                            +167% ROI at launch
                        </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="bg-[#111] border border-[#1E1E1E] border-t-[3px] border-t-[#3DDB5A] rounded-2xl p-6 hover:-translate-y-1 hover:border-[#3DDB5A] transition-all cursor-pointer group">
                        <div className="text-[10px] tracking-[3px] text-gray-500 mb-2 uppercase">Phase 02</div>
                        <div className="text-xl font-black text-[#3DDB5A] mb-5 group-hover:scale-105 transition-transform origin-left">Community Builders</div>

                        <div className="space-y-3">
                            <Stat label="SCARAB per BNB" value="6,000,000" color="#3DDB5A" />
                            <Stat label="Soft Cap" value="10 BNB (~€5,200)" />
                            <Stat label="Hard Cap" value="16.67 BNB (~€8,667)" />
                            <Stat label="Allocation" value="100M SCARAB (10%)" />
                            <Stat label="Max Wallet" value="3 BNB" />
                            <Stat label="Referral" value="5%" />
                            <Stat label="Duration" value="30 days" />
                        </div>
                        <div className="mt-5 inline-block px-3 py-1 rounded-full bg-[#3DDB5A]/15 text-[#3DDB5A] text-[11px] font-bold font-mono">
                            +100% ROI at launch
                        </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="bg-[#111] border border-[#1E1E1E] border-t-[3px] border-t-[#4D9FFF] rounded-2xl p-6 hover:-translate-y-1 hover:border-[#4D9FFF] transition-all cursor-pointer group">
                        <div className="text-[10px] tracking-[3px] text-gray-500 mb-2 uppercase">Phase 03</div>
                        <div className="text-xl font-black text-[#4D9FFF] mb-5 group-hover:scale-105 transition-transform origin-left">Final Boarding</div>

                        <div className="space-y-3">
                            <Stat label="SCARAB per BNB" value="4,500,000" color="#4D9FFF" />
                            <Stat label="Soft Cap" value="15 BNB (~€7,800)" />
                            <Stat label="Hard Cap" value="33.33 BNB (~€17,333)" />
                            <Stat label="Allocation" value="150M SCARAB (15%)" />
                            <Stat label="Max Wallet" value="5 BNB" />
                            <Stat label="Referral" value="3%" />
                            <Stat label="Duration" value="30 days" />
                        </div>
                        <div className="mt-5 inline-block px-3 py-1 rounded-full bg-[#4D9FFF]/15 text-[#4D9FFF] text-[11px] font-bold font-mono">
                            +50% ROI at launch
                        </div>
                    </div>
                </div>

                {/* Cumulative Funding */}
                <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-8 mb-10">
                    <div className="text-[11px] uppercase tracking-[3px] text-gray-500 mb-7">Cumulative Raise — All Phases Hard Cap</div>
                    <div className="space-y-4">
                        <FundingRow label="After Phase 1" pct="11%" color="#D4A843" value="6.25 BNB ≈ €3,250" />
                        <FundingRow label="After Phase 2" pct="41%" color="linear-gradient(90deg, #D4A843, #3DDB5A)" value="22.92 BNB ≈ €11,917" />
                        <FundingRow label="All Phases" pct="100%" color="linear-gradient(90deg, #D4A843, #3DDB5A, #4D9FFF)" value="56.25 BNB ≈ €29,250" />
                    </div>
                </div>

                {/* Verdict Box */}
                <div className="bg-[#3DDB5A]/5 border border-[#3DDB5A]/20 rounded-2xl p-8 text-center mb-12">
                    <h3 className="text-xl font-black text-[#3DDB5A] mb-3">✅ Strategy Approved</h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Three separate contracts. Escalating price. Each phase builds social proof for the next.
                        Phase 1 soft cap of 5 BNB is achievable from your existing network + referrals.
                        Total potential raise: <strong className="text-[#3DDB5A]">56.25 BNB (~€29,250)</strong> — enough to fund the full 12-month roadmap.
                    </p>
                    <div className="mt-6">
                        <Link to="/app" className="inline-flex items-center gap-2 bg-[#D4A843] text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform">
                            <Rocket size={18} /> Enter Launchpad
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
