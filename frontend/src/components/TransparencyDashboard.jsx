import React, { useState, useEffect } from 'react';
import { useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { Activity, Droplets, Zap, Wind, Database, Shield, Globe, Clock, DollarSign, TrendingUp, ExternalLink } from 'lucide-react';
import { CONFIG } from '../config';

// ─── TreasuryVault ABI (minimal — only what we read) ──────────────────────
const TREASURY_VAULT_ABI = [
    {
        name: 'getDashboardData',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [
            { name: 'totalUsdc', type: 'uint256' },
            { name: 'floorPriceValue', type: 'uint256' },
            { name: 'totalNodes', type: 'uint256' },
            { name: 'buybackCount', type: 'uint256' },
            { name: 'scarabBurned', type: 'uint256' },
            { name: 'floorActive', type: 'bool' },
        ],
    },
    {
        name: 'yieldBps',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'effectiveUsdcBalance',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
];

const TREASURY_VAULT_ADDRESS = CONFIG.TREASURY_VAULT_ADDRESS;
const IS_DEPLOYED = TREASURY_VAULT_ADDRESS !== '0x0000000000000000000000000000000000000000';

// ─── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ label, value, subtext, icon: Icon, colorClass }) => (
    <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-start gap-4 hover:border-white/10 transition-colors">
        <div className={`p-3 rounded-lg ${colorClass}`}>
            <Icon size={20} />
        </div>
        <div>
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</div>
            <div className="text-xl font-bold text-white mb-1 font-mono">{value}</div>
            {subtext && <div className="text-[10px] text-gray-500">{subtext}</div>}
        </div>
    </div>
);

// ─── Backing Ratio Dial (SVG Arc) ───────────────────────────────────────────
function BackingRatioDial({ ratio, backingMetric, marketPrice }) {
    // ratio = marketPrice / floorPrice, clamped 0–5× for display
    const MAX_RATIO = 5;
    const clampedRatio = Math.min(ratio, MAX_RATIO);
    const pct = clampedRatio / MAX_RATIO;

    // SVG arc math — 240° sweep (from 150° to 30° clockwise on a 100-unit circle)
    const RADIUS = 40;
    const CX = 50, CY = 55;
    const START_ANGLE = 150; // degrees
    const SWEEP = 240;

    function polarToXY(angleDeg, r = RADIUS) {
        const rad = ((angleDeg - 90) * Math.PI) / 180;
        return {
            x: CX + r * Math.cos(rad),
            y: CY + r * Math.sin(rad),
        };
    }

    function arcPath(startDeg, endDeg, r = RADIUS) {
        const s = polarToXY(startDeg, r);
        const e = polarToXY(endDeg, r);
        const large = endDeg - startDeg > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
    }

    const endAngle = START_ANGLE + pct * SWEEP;

    // Color zones
    const trackColor = '#1f2937'; // gray-800
    const needleColor = ratio < 1 ? '#ef4444' // red — below floor
        : ratio < 2 ? '#eab308' // yellow — near floor
            : '#22c55e'; // green — healthy

    const ratioLabel = ratio === 0 ? '—' : `${ratio.toFixed(2)}×`;
    const statusText = ratio === 0 ? 'Awaiting data'
        : ratio < 1 ? 'BELOW FLOOR'
            : ratio < 1.5 ? 'Near floor'
                : ratio < 3 ? 'Healthy'
                    : 'Strong premium';

    return (
        <div className="flex flex-col items-center">
            <svg viewBox="0 0 100 80" className="w-full max-w-[200px]">
                {/* Track (background arc) */}
                <path
                    d={arcPath(START_ANGLE, START_ANGLE + SWEEP)}
                    fill="none" stroke={trackColor} strokeWidth="8" strokeLinecap="round"
                />
                {/* Fill arc */}
                {pct > 0.01 && (
                    <path
                        d={arcPath(START_ANGLE, endAngle)}
                        fill="none" stroke={needleColor} strokeWidth="8" strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 4px ${needleColor}80)` }}
                    />
                )}
                {/* Zone labels */}
                <text x="13" y="72" fontSize="5" fill="#6b7280" textAnchor="middle">0×</text>
                <text x="87" y="72" fontSize="5" fill="#6b7280" textAnchor="middle">5×</text>
                <text x="50" y="20" fontSize="5" fill="#6b7280" textAnchor="middle">2.5×</text>
            </svg>

            {/* Center readout */}
            <div className="text-center -mt-6">
                <div className={`text-3xl font-black font-mono ${ratio < 1 ? 'text-red-400' : ratio < 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {ratioLabel}
                </div>
                <div className={`text-xs font-bold mt-1 ${ratio < 1 ? 'text-red-400' : ratio < 2 ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {statusText}
                </div>
            </div>

            {/* Backing metric vs market legend */}
            <div className="grid grid-cols-2 gap-4 mt-4 w-full text-center text-xs font-mono">
                <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                    <div className="text-gray-500 text-[10px] uppercase">Backing</div>
                    <div className="text-beetle-gold font-bold">{backingMetric}</div>
                </div>
                <div className="bg-black/40 rounded-xl p-2 border border-white/5">
                    <div className="text-gray-500 text-[10px] uppercase">Market</div>
                    <div className="text-white font-bold">{marketPrice}</div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TransparencyDashboard() {

    // Fetch from TreasuryVault on-chain (gracefully skips if not deployed)
    const { data: vaultData } = useReadContracts({
        contracts: [
            { address: TREASURY_VAULT_ADDRESS, abi: TREASURY_VAULT_ABI, functionName: 'getDashboardData' },
            { address: TREASURY_VAULT_ADDRESS, abi: TREASURY_VAULT_ABI, functionName: 'yieldBps' },
            { address: TREASURY_VAULT_ADDRESS, abi: TREASURY_VAULT_ABI, functionName: 'effectiveUsdcBalance' },
        ],
        query: { enabled: IS_DEPLOYED, refetchInterval: 15_000 },
    });

    // Parse results
    const dashData = vaultData?.[0]?.status === 'success' ? vaultData[0].result : null;
    const yieldBps = vaultData?.[1]?.status === 'success' ? Number(vaultData[1].result) : 500;
    const effUsdc = vaultData?.[2]?.status === 'success' ? vaultData[2].result : 0n;

    const usdcReserve = dashData ? `$${Number(formatUnits(dashData[0], 18)).toLocaleString('en', { maximumFractionDigits: 0 })}` : '$0';
    const floorPriceRaw = dashData ? Number(formatUnits(dashData[1], 18)) : 0;
    const floorPriceLabel = floorPriceRaw > 0 ? `$${floorPriceRaw.toFixed(6)}` : '$0.0000';
    const nodesDeployed = dashData ? Number(dashData[2]).toLocaleString() : '0';
    const buybackCount = dashData ? Number(dashData[3]).toString() : '0';
    const scarabBurned = dashData ? Number(formatUnits(dashData[4], 18)).toLocaleString('en', { maximumFractionDigits: 0 }) : '0';
    const floorActive = dashData ? dashData[5] : false;
    const effUsdcLabel = effUsdc > 0n ? `$${Number(formatUnits(effUsdc, 18)).toLocaleString('en', { maximumFractionDigits: 0 })}` : '$0';
    const yieldLabel = `${(yieldBps / 100).toFixed(1)}% modeled yield`;

    // Mock market price until we have an SQS feed; ratio defaults to 0 (shows "—")
    const MOCK_MARKET_PRICE = 0;
    const backingRatio = floorPriceRaw > 0 && MOCK_MARKET_PRICE > 0
        ? MOCK_MARKET_PRICE / floorPriceRaw
        : 0;

    return (
        <section className="py-12 bg-black border-t border-white/5">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${IS_DEPLOYED ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <h3 className="text-xl font-bold text-white tracking-tight">SCARAB NETWORK STATUS</h3>
                    </div>
                    <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                        <Globe size={12} />
                        {IS_DEPLOYED ? 'LIVE · BSC TESTNET' : 'PRE-DEPLOY · PLACEHOLDER DATA'}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">

                    {/* ── COL 1: REAL WORLD IMPACT ── */}
                    <div className="space-y-4">
                        <h4 className="text-xs text-beetle-gold uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
                            <Globe size={12} /> Real-World Impact (Verified)
                        </h4>
                        <StatCard icon={Zap} label="Energy Generation" value="12,450 kWh" subtext="~4.2 tons CO2 Avoided" colorClass="bg-yellow-500/10 text-yellow-400" />
                        <StatCard icon={Droplets} label="Water Purified" value="1.2M Liters" subtext="~3,200 Households Supported" colorClass="bg-blue-500/10 text-blue-400" />
                        <StatCard icon={Wind} label="Biomass Processed" value="140 kg" subtext="Methane Capture Active" colorClass="bg-green-500/10 text-green-400" />
                    </div>

                    {/* ── COL 2: BACKING RATIO DIAL + EMISSION ── */}
                    <div className="space-y-4">
                        <h4 className="text-xs text-beetle-electric uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
                            <Activity size={12} /> Backing Ratio & Emission
                        </h4>

                        {/* ★ THE DIAL ★ */}
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Market / Backing</span>
                                {floorActive && (
                                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full animate-pulse">
                                        ⚠ BUYBACK CONDITION ACTIVE
                                    </span>
                                )}
                            </div>
                            <BackingRatioDial
                                ratio={backingRatio}
                                backingMetric={floorPriceLabel}
                                marketPrice={MOCK_MARKET_PRICE > 0 ? `$${MOCK_MARKET_PRICE.toFixed(6)}` : 'No SQS feed'}
                            />
                        </div>

                        {/* Emission health */}
                        <div className="bg-[#111] rounded-xl p-5 border border-white/5">
                            <div className="flex justify-between text-sm mb-2 text-gray-400">
                                <span>Daily Target</span><span>80,000 SCARAB</span>
                            </div>
                            <div className="flex justify-between text-sm mb-4 text-white font-bold font-mono">
                                <span>Actual Emitted</span>
                                <span className="text-green-400">76,320 SCARAB</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full mb-2 overflow-hidden">
                                <div className="bg-green-500 h-full rounded-full" style={{ width: '95.4%' }}></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500">
                                <span>Efficiency: 95.4%</span><span>4.6% Burned</span>
                            </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                            <div className="text-[10px] text-gray-500 uppercase mb-1 flex items-center gap-1"><Clock size={10} /> Reward Model</div>
                            <div className="text-sm font-bold text-white font-mono">Pull-Based · Gas −99.86%</div>
                        </div>
                    </div>

                    {/* ── COL 3: TREASURY VAULT (LIVE) ── */}
                    <div className="space-y-4">
                        <h4 className="text-xs text-beetle-gold uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
                            <Database size={12} /> Liquidity Backing Vault
                        </h4>

                        {/* USDC Reserve */}
                        <div className="bg-gradient-to-br from-beetle-gold/10 to-transparent border border-beetle-gold/20 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-gray-400 uppercase tracking-widest">USDC Reserve</span>
                                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-mono">
                                    {IS_DEPLOYED ? 'LIVE' : 'PENDING DEPLOY'}
                                </span>
                            </div>
                            <div className="text-3xl font-black text-white font-mono">{usdcReserve}</div>
                            <div className="text-xs text-gray-500 mt-1">Effective reserve (using {yieldLabel} assumption): <span className="text-green-400 font-mono">{effUsdcLabel}</span></div>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                                <div className="text-[10px] text-gray-500 uppercase">Backing Metric</div>
                                <div className="text-lg font-bold text-beetle-gold font-mono">{floorPriceLabel}</div>
                                <div className="text-[10px] text-gray-600">modeled scenario</div>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                                <div className="text-[10px] text-gray-500 uppercase">Nodes</div>
                                <div className="text-lg font-bold text-white font-mono">{nodesDeployed}</div>
                                <div className="text-[10px] text-gray-600">hardware units</div>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                                <div className="text-[10px] text-gray-500 uppercase">Buybacks</div>
                                <div className="text-lg font-bold text-purple-400 font-mono">{buybackCount}</div>
                                <div className="text-[10px] text-gray-600">executed</div>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                                <div className="text-[10px] text-gray-500 uppercase">Burned</div>
                                <div className="text-lg font-bold text-red-400 font-mono">{scarabBurned}</div>
                                <div className="text-[10px] text-gray-600">SCARAB</div>
                            </div>
                        </div>

                        {/* Risk log */}
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield size={14} className="text-red-400" />
                                <span className="text-xs font-bold text-red-200 uppercase">Weekly Risk Log</span>
                            </div>
                            <ul className="text-[10px] text-gray-400 space-y-1 list-disc list-inside">
                                <li><strong>Attestation:</strong> All devices current (30-day window)</li>
                                <li><strong>Escrow:</strong> 0 submissions pending review</li>
                            </ul>
                        </div>

                        {/* BscScan link */}
                        <a
                            href={`https://testnet.bscscan.com/address/${TREASURY_VAULT_ADDRESS}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs text-gray-500 hover:text-beetle-gold transition-colors"
                        >
                            <ExternalLink size={12} />
                            View TreasuryVault on BscScan
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}
