import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Rocket, Shield, CheckCircle, RefreshCw, Lock, Activity } from 'lucide-react';

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
                        <div className="flex-1 flex flex-col items-center justify-end relative cursor-pointer group">
                            <div className="absolute -top-7 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-[#3DDB5A] whitespace-nowrap">
                                Early Access • $0.003
                            </div>
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
                            <div className="absolute -top-7 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-[#3DDB5A] whitespace-nowrap">
                                Expansion Phase
                            </div>
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
                            <div className="absolute -top-7 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-[#4D9FFF] whitespace-nowrap">
                                Liquidity Round
                            </div>
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
                            <div className="absolute -top-7 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-gray-400 whitespace-nowrap">
                                Public Listing Target • $0.008
                            </div>
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

                {/* NEW SECTION: Fund Allocation Transparency */}
                <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-8 mb-10">
                    <div className="text-[11px] uppercase tracking-[3px] text-gray-500 mb-7">
                        Fund Allocation — Where Your Investment Goes
                    </div>

                    <div className="space-y-6">
                        {/* Phase 1 Allocation */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-white font-bold text-sm">Phase 1: $600K Hard Cap</h4>
                                <span className="text-xs text-gray-500 font-mono">Infrastructure R&D</span>
                            </div>
                            <div className="space-y-2">
                                <AllocationBar label="Secure Firmware Dev" pct={60} amount="$360K" color="#D4A843" />
                                <AllocationBar label="First 100 Prototype Units" pct={20} amount="$120K" color="#D4A843" />
                                <AllocationBar label="Validator Network Setup" pct={10} amount="$60K" color="#D4A843" />
                                <AllocationBar label="Legal (DAO Formation)" pct={10} amount="$60K" color="#D4A843" />
                            </div>
                        </div>

                        {/* Phase 2 Allocation */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-white font-bold text-sm">Phase 2: $800K Hard Cap</h4>
                                <span className="text-xs text-gray-500 font-mono">Manufacturing Scale</span>
                            </div>
                            <div className="space-y-2">
                                <AllocationBar label="1,000 Production Units" pct={70} amount="$560K" color="#3DDB5A" />
                                <AllocationBar label="Manufacturer Partnerships" pct={15} amount="$120K" color="#3DDB5A" />
                                <AllocationBar label="Marketing & Community" pct={10} amount="$80K" color="#3DDB5A" />
                                <AllocationBar label="Operations" pct={5} amount="$40K" color="#3DDB5A" />
                            </div>
                        </div>

                        {/* Phase 3 Allocation */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-white font-bold text-sm">Phase 3: $600K Hard Cap</h4>
                                <span className="text-xs text-gray-500 font-mono">Liquidity & Marketing</span>
                            </div>
                            <div className="space-y-2">
                                <AllocationBar label="PancakeSwap Liquidity" pct={50} amount="$300K" color="#4D9FFF" />
                                <AllocationBar label="Marketing Blitz (PR/Influencers)" pct={30} amount="$180K" color="#4D9FFF" />
                                <AllocationBar label="Legal & Compliance" pct={15} amount="$90K" color="#4D9FFF" />
                                <AllocationBar label="Emergency Reserve" pct={5} amount="$30K" color="#4D9FFF" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* NEW: Unit Economics (Hardware Investor Focus) */}
                <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-8 mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-[11px] uppercase tracking-[3px] text-gray-500">
                            Unit Economics & Year 1 Revenue
                        </div>
                        <span className="bg-beetle-gold/10 text-beetle-gold text-[10px] font-bold px-2 py-1 rounded border border-beetle-gold/20">
                            HARDWARE + SAAS PROFITABILITY
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Solar */}
                        <div className="p-6 bg-black/40 rounded-xl border border-beetle-electric/20 relative overflow-hidden group hover:bg-black/80 transition-colors">
                            <h4 className="text-white font-bold mb-4 flex items-center justify-between">
                                Solar Node
                                <span className="text-beetle-electric font-mono text-sm">$349</span>
                            </h4>
                            <div className="space-y-3 text-[11px] text-gray-400 font-mono">
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>BOM Cost</span><span className="text-white">$34</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Hardware Margin</span><span className="text-beetle-electric">$315 (90%)</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Target Units (Y1)</span><span className="text-white">500</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Hardware Rev</span><span className="text-white">$174,500</span></div>
                                <div className="flex justify-between"><span>Profit</span><span className="text-white">$157,500</span></div>
                            </div>
                        </div>

                        {/* Bokashi */}
                        <div className="p-6 bg-black/40 rounded-xl border border-beetle-gold/20 relative overflow-hidden group hover:bg-black/80 transition-colors">
                            <h4 className="text-white font-bold mb-4 flex items-center justify-between">
                                Smart Bokashi Kit
                                <span className="text-beetle-gold font-mono text-sm">$89 + $12/mo</span>
                            </h4>
                            <div className="space-y-3 text-[11px] text-gray-400 font-mono">
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>BOM Cost</span><span className="text-white">$28</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Hardware Margin</span><span className="text-beetle-gold">$61 (69%)</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Target Units (Y1)</span><span className="text-white">2,000</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Hardware Rev</span><span className="text-white">$178,000</span></div>
                                <div className="flex justify-between"><span>Bran Subs (Y1)</span><span className="text-beetle-gold">+$144,000</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Total Y1 Revenue</div>
                            <div className="text-xl font-mono font-bold text-white">$544,500</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Total Y1 Profit</div>
                            <div className="text-xl font-mono font-bold text-beetle-green">$471,500</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Break-Even</div>
                            <div className="text-xl font-mono font-bold text-beetle-gold">1.3 Months</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">LTV per Bokashi User</div>
                            <div className="text-xl font-mono font-bold text-beetle-green">$288.00</div>
                        </div>
                    </div>
                </div>

                {/* NEW: Institutional Validation */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-[#111] border border-[#1E1E1E] p-6 rounded-2xl flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-beetle-gold/10 rounded-full flex items-center justify-center mb-4 text-beetle-gold">
                            <Shield size={24} />
                        </div>
                        <h4 className="text-white font-bold mb-2">Audit & Security</h4>
                        <p className="text-xs text-gray-400 mb-4">Smart Contracts audited by Tier-1 firms. Hardware Secure Element (ATECC608A) penetration tested.</p>
                        <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                            <span className="text-[10px] border border-gray-700 px-2 py-1 rounded">CertiK (Pending)</span>
                            <span className="text-[10px] border border-gray-700 px-2 py-1 rounded">Hacken (Pending)</span>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-[#1E1E1E] p-6 rounded-2xl flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-beetle-electric/10 rounded-full flex items-center justify-center mb-4 text-beetle-electric">
                            <Activity size={24} />
                        </div>
                        <h4 className="text-white font-bold mb-2">Review Partners</h4>
                        <p className="text-xs text-gray-400 mb-4">Engineering methodology validation by leading academic institutions.</p>
                        <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                            <span className="text-[10px] border border-gray-700 px-2 py-1 rounded">TU Munich (Pilot)</span>
                            <span className="text-[10px] border border-gray-700 px-2 py-1 rounded">ETH Zurich (Rsrch)</span>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-[#1E1E1E] p-6 rounded-2xl flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-beetle-green/10 rounded-full flex items-center justify-center mb-4 text-beetle-green">
                            <Lock size={24} />
                        </div>
                        <h4 className="text-white font-bold mb-2">Data Integrity</h4>
                        <p className="text-xs text-gray-400 mb-4">On-chain weather and environmental data verification via decentralized oracles.</p>
                        <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                            <span className="text-[10px] border border-gray-700 px-2 py-1 rounded">Chainlink</span>
                            <span className="text-[10px] border border-gray-700 px-2 py-1 rounded">The Graph</span>
                        </div>
                    </div>
                </div>

                {/* Why This Wins */}
                <div className="mb-16">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">Why SCARAB Wins</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-black/40 border border-white/10 p-6 rounded-xl">
                            <div className="text-beetle-gold font-bold mb-2">Measurable Output</div>
                            <p className="text-sm text-gray-400">First DePIN model tied to verified sustainability metrics (kWh, Liters), not just connectivity.</p>
                        </div>
                        <div className="bg-black/40 border border-white/10 p-6 rounded-xl">
                            <div className="text-beetle-green font-bold mb-2">Hardware-Secured</div>
                            <p className="text-sm text-gray-400">ATECC608A cryptographic validation prevents spoofed emissions and ensures data integrity.</p>
                        </div>
                        <div className="bg-black/40 border border-white/10 p-6 rounded-xl">
                            <div className="text-beetle-electric font-bold mb-2">Real Revenue</div>
                            <p className="text-sm text-gray-400">Treasury accumulates real-world infrastructure revenue, creating asset-backed stability.</p>
                        </div>
                    </div>
                </div>

                {/* Verdict Box */}
                <div className="bg-[#3DDB5A]/5 border border-[#3DDB5A]/20 rounded-2xl p-8 text-center mb-12">
                    <h3 className="text-xl font-black text-[#3DDB5A] mb-3">✅ DePIN Model Approved</h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto mb-6">
                        This raise structure prioritizes <strong>Infrastructure R&D</strong> over pure liquidity.
                        Funds are strictly gated for the development of the <strong>Secure Element Firmware</strong>
                        and the manufacturing of the first 1,000 Embedded Node modules.
                    </p>

                    {/* NEW: Investor Protection Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left mb-8">
                        <div className="bg-black/40 border border-white/10 rounded-xl p-4 hover:border-beetle-green/30 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="text-beetle-green w-4 h-4" />
                                <span className="text-xs font-bold text-white uppercase tracking-wide">Multi-Sig Control</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Raised funds held in 3-of-5 multi-signature wallet. No single point of failure.
                            </p>
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-xl p-4 hover:border-beetle-gold/30 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="text-beetle-gold w-4 h-4" />
                                <span className="text-xs font-bold text-white uppercase tracking-wide">Milestone-Based</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Funds release tied to deliverables: prototype → manufacturing → deployment.
                            </p>
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-xl p-4 hover:border-beetle-electric/30 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <RefreshCw className="text-beetle-electric w-4 h-4" />
                                <span className="text-xs font-bold text-white uppercase tracking-wide">Refund Protection</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                If soft cap not reached, automatic refunds enabled via smart contract.
                            </p>
                        </div>
                        {/* Vesting Badge */}
                        <div className="bg-black/40 border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-colors md:col-span-3 lg:col-span-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Lock className="text-purple-500 w-4 h-4" />
                                <span className="text-xs font-bold text-white uppercase tracking-wide">Institutional Vesting</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                <strong>12-Month Hard Cliff</strong> for Team & Seed. No insider dumping. Linear daily unlocks.
                            </p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Link to="/app" className="inline-flex items-center gap-2 bg-[#D4A843] text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform">
                            <Rocket size={18} /> Join Phase 1
                        </Link>
                    </div>
                </div>

                {/* Investor FAQs */}
                <div className="bg-[#111] border border-[#1E1E1E] rounded-2xl p-8 mb-12">
                    <h3 className="text-xl font-bold text-white mb-6">Investor FAQs</h3>
                    <div className="space-y-5">
                        <FAQ
                            q="Why is pricing in USD instead of BNB?"
                            a="BNB is volatile. We price in USD to provide stable, predictable token amounts regardless of crypto market fluctuations. You pay in BNB, but the conversion rate adjusts to maintain USD equivalence at time of purchase."
                        />
                        <FAQ
                            q="What happens if Phase 1 doesn't hit hard cap?"
                            a="If Phase 1 reaches soft cap ($300K), we proceed with 100 prototype units instead of 1,000. This proves the model before scaling. If soft cap isn't reached, automatic refunds are enabled via smart contract — your capital is fully protected."
                        />
                        <FAQ
                            q="When can I claim my tokens?"
                            a="Tokens are claimable after Phase 3 completes and DEX listing occurs (estimated Q3 2026). This ensures all raised capital is used for infrastructure development before the token becomes tradable."
                        />
                        <FAQ
                            q="How is this different from a typical token presale?"
                            a="Traditional presales fund liquidity pools. SCARAB funds hardware manufacturing — you're investing in physical infrastructure, not just smart contracts. 70% of Phase 1/2 funds go directly to R&D and device production."
                        />
                        <FAQ
                            q="What's the minimum investment?"
                            a="Minimum is $100 USD equivalent in BNB. This makes SCARAB accessible while filtering serious participants. Maximum varies by phase: $5K (Phase 1), $15K (Phase 2), $25K (Phase 3)."
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

function AllocationBar({ label, pct, amount, color }) {
    return (
        <div className="flex items-center gap-3 text-xs">
            <div className="w-32 text-gray-500 shrink-0 text-left">{label}</div>
            <div className="flex-1 h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
            </div>
            <div className="w-16 text-right font-mono text-white font-medium">{amount}</div>
            <div className="w-8 text-right text-gray-600 font-mono text-[10px]">{pct}%</div>
        </div>
    );
}

function FAQ({ q, a }) {
    const [open, setOpen] = React.useState(false);
    return (
        <div className="border-b border-[#1E1E1E] pb-4 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left flex items-center justify-between group"
            >
                <span className="text-white font-medium text-sm group-hover:text-[#D4A843] transition-colors pr-4">
                    {q}
                </span>
                <span className={`text-gray-500 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
            {open && (
                <p className="text-xs text-gray-400 leading-relaxed mt-3 pl-1">
                    {a}
                </p>
            )}
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
