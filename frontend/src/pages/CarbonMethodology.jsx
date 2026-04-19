import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

/*
 * CarbonMethodology.jsx
 * Academic-grade methodology page for:
 * - VCs, municipality sustainability officers, thesis reviewers, Gold Standard verifiers
 * Tone: scientific, precise, zero marketing language.
 * Mobile-first: tested at 375px minimum width.
 */

const DISCLAIMER = `Carbon avoidance estimates use IPCC 2006 Tier 1 default parameters. Credits are not yet formally verified under Gold Standard or Verra. These estimates are provided for informational purposes only.`;

export default function CarbonMethodology() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Navbar />

            {/* ─── SECTION 1: Hero ─── */}
            <section className="pt-32 pb-16 px-4 max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-black leading-tight text-gray-900 mb-4">
                    How SCARAB quantifies avoided greenhouse gas emissions
                </h1>
                <p className="text-base text-gray-500 leading-relaxed">
                    Based on IPCC 2006 Guidelines for National GHG Inventories,
                    Volume 5, Chapter 3 — First Order Decay model
                </p>
            </section>

            {/* ─── SECTION 2: Core Equation ─── */}
            <section className="py-12 px-4 max-w-3xl mx-auto">
                <h2 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-200 pb-3">
                    1. Core Equation
                </h2>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                    <pre className="font-mono text-sm md:text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
{`CO₂e avoided = MSW × MCF × DOC × DOCf × F × (16/12) × GWP₁₀₀`}
                    </pre>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="text-left py-3 pr-4 font-bold text-gray-700">Parameter</th>
                                <th className="text-left py-3 pr-4 font-bold text-gray-700">Value used</th>
                                <th className="text-left py-3 font-bold text-gray-700">Source</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ParamRow param="MSW" value="Measured (kg, ±2%)" source="ATECC608A-signed load cell" />
                            <ParamRow param="MCF" value="1.0" source="IPCC 2006 Vol.5 Ch.3 Table 3.1" />
                            <ParamRow param="DOC" value="0.12 tC/t" source="Conservative (IPCC default: 0.15)" />
                            <ParamRow param="DOCf" value="0.5" source="IPCC 2006 default" />
                            <ParamRow param="F" value="0.5" source="IPCC 2006 default" />
                            <ParamRow param="GWP₁₀₀" value="27.9" source="IPCC AR6 Table 7.SM.7 (biogenic)" />
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                    <p className="text-sm font-bold text-emerald-800">
                        Result: 1 tonne verified organic waste diverted = 1.116 tCO₂e avoided
                    </p>
                </div>
            </section>

            {/* ─── SECTION 3: Why Bokashi ─── */}
            <section className="py-12 px-4 max-w-3xl mx-auto">
                <h2 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-200 pb-3">
                    2. Why Bokashi Fermentation Specifically
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <h3 className="font-bold text-red-800 text-sm uppercase tracking-widest mb-4">
                            What happens in landfill
                        </h3>
                        <ul className="text-sm text-red-900 space-y-3 leading-relaxed">
                            <li>Anaerobic decomposition under compacted waste layers</li>
                            <li>Produces CH₄ (methane) as primary greenhouse gas</li>
                            <li>CH₄ = 27.9× more potent than CO₂ over 100 years (GWP₁₀₀)</li>
                            <li>Landfill gas composition: ~50% CH₄, ~50% CO₂</li>
                        </ul>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                        <h3 className="font-bold text-emerald-800 text-sm uppercase tracking-widest mb-4">
                            What happens in Bokashi
                        </h3>
                        <ul className="text-sm text-emerald-900 space-y-3 leading-relaxed">
                            <li>Lactic acid fermentation under anaerobic conditions</li>
                            <li>Produces CO₂ + lactic acid (no methane generation)</li>
                            <li>End product: nutrient-rich soil amendment</li>
                            <li>Carbon sequestered in agricultural soil</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ─── SECTION 4: Verification Chain ─── */}
            <section className="py-12 px-4 max-w-3xl mx-auto">
                <h2 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-200 pb-3">
                    3. Hardware Verification Chain
                </h2>

                <div className="space-y-0">
                    <VerificationStep
                        num={1}
                        title="Load cell measures weight (±50g accuracy)"
                        detail="Strain gauge sensor calibrated at factory. Tare weight subtracted automatically per container profile."
                    />
                    <VerificationStep
                        num={2}
                        title="Temperature + gas sensors confirm fermentation"
                        detail="DS18B20 temperature probe and SCD41 CO₂ sensor validate that lactic acid fermentation is occurring (not putrefaction)."
                    />
                    <VerificationStep
                        num={3}
                        title="ATECC608A signs telemetry cryptographically"
                        detail="Secure element generates ECDSA P-256 signature over SHA-256 hash of telemetry payload. Private key never leaves hardware."
                    />
                    <VerificationStep
                        num={4}
                        title="Oracle validates against peer devices"
                        detail="Cloud oracle cross-references weather data, regional baselines, and historical device output before accepting submission."
                    />
                    <VerificationStep
                        num={5}
                        title="On-chain record created — immutable, auditable"
                        detail="Device ID hash, energy, waste weight, H3 cell, and confidence score committed to BSC. Raw coordinates and identities never stored on-chain."
                    />
                </div>
            </section>

            {/* ─── SECTION 5: Worked Example ─── */}
            <section className="py-12 px-4 max-w-3xl mx-auto">
                <h2 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-200 pb-3">
                    4. Credit Calculation Example
                </h2>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>Scenario:</strong> A household completes one 15-day Bokashi cycle.
                    </p>
                    <div className="font-mono text-sm bg-white border border-gray-200 rounded-lg p-4 space-y-1">
                        <p>Weight deposited: 12.4 kg</p>
                        <p>Quality score: 87/100</p>
                        <p className="pt-2 border-t border-gray-100">CO₂e avoided: 12.4 × 0.001116 × 0.87 = <strong>0.01204 tCO₂e</strong></p>
                        <p>= <strong>12.04 kg CO₂e avoided</strong> per cycle</p>
                    </div>
                    <p className="text-sm text-gray-700">
                        At 18 cycles per year: <strong>216.7 kg CO₂e avoided annually</strong>
                    </p>
                </div>

                <p className="text-xs text-gray-400 mt-4 leading-relaxed italic">
                    {DISCLAIMER}
                </p>
            </section>

            {/* ─── SECTION 6: Timeline ─── */}
            <section className="py-12 px-4 max-w-3xl mx-auto">
                <h2 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-200 pb-3">
                    5. Path to Formal Verification
                </h2>

                <div className="flex flex-col md:flex-row gap-4">
                    <TimelineStep
                        label="Now"
                        title="IPCC Tier 1 methodology, hardware-attested data"
                        position="first"
                    />
                    <TimelineStep
                        label="Series A"
                        title="6 months continuous data, independent sensor audit"
                        position="middle"
                    />
                    <TimelineStep
                        label="Year 2"
                        title="Gold Standard GS4GG or Verra VCS formal verification"
                        position="last"
                    />
                </div>
            </section>

            {/* ─── SECTION 7: References ─── */}
            <section className="py-12 px-4 max-w-3xl mx-auto border-t border-gray-200">
                <h2 className="text-xl font-black text-gray-900 mb-6">
                    References
                </h2>

                <ol className="text-sm text-gray-600 space-y-4 list-decimal list-inside leading-relaxed">
                    <li>
                        IPCC (2006). <em>2006 IPCC Guidelines for National GHG Inventories.</em>{' '}
                        Volume 5: Waste. Chapter 3.
                    </li>
                    <li>
                        IPCC AR6 (2021). Table 7.SM.7: Global Warming Potential values.
                    </li>
                    <li>
                        Gold Standard (2022). <em>GS-METH-Tool-SWDS.</em>
                    </li>
                    <li>
                        Verra (2020). <em>VM0025 Methodology for Avoided Emissions.</em>
                    </li>
                </ol>
            </section>

            {/* ─── Footer ─── */}
            <footer className="py-8 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400 px-4">
                <p>Protocol: SCARAB DAO LLC (Wyoming) · European Operations: SCARAB UG (Germany, registration in progress)</p>
                <p className="mt-2 max-w-xl mx-auto italic">{DISCLAIMER}</p>
                <p className="mt-2">© {new Date().getFullYear()} SCARAB Protocol. All rights reserved.</p>
            </footer>
        </div>
    );
}

/* ─── Sub-components ─── */

function ParamRow({ param, value, source }) {
    return (
        <tr className="border-b border-gray-100">
            <td className="py-3 pr-4 font-mono font-bold text-gray-800">{param}</td>
            <td className="py-3 pr-4 text-gray-700">{value}</td>
            <td className="py-3 text-gray-500">{source}</td>
        </tr>
    );
}

function VerificationStep({ num, title, detail }) {
    return (
        <div className="flex gap-4 pb-6">
            {/* Vertical connector */}
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {num}
                </div>
                {num < 5 && <div className="w-px flex-1 bg-gray-200 mt-1"></div>}
            </div>
            <div className="pb-2">
                <p className="font-bold text-sm text-gray-900">{title}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{detail}</p>
            </div>
        </div>
    );
}

function TimelineStep({ label, title, position }) {
    return (
        <div className="flex-1 relative">
            {/* Connector line (hidden on mobile, shown on desktop) */}
            <div className="hidden md:block absolute top-3 left-0 right-0 h-px bg-gray-200" style={{
                left: position === 'first' ? '50%' : '0',
                right: position === 'last' ? '50%' : '0'
            }}></div>
            <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-6 h-6 rounded-full bg-emerald-600 mb-3 flex-shrink-0"></div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">{label}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{title}</p>
            </div>
        </div>
    );
}
