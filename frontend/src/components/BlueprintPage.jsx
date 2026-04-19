import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import EmissionExplainer from './EmissionExplainer';
import { CONFIG } from '../config';

/*
 * BlueprintPage.jsx
 * VC-facing token mechanics page at /blueprint
 * Mobile-first: minimum 375px width.
 * No console.log in production.
 * All contract addresses from import.meta.env via CONFIG.
 */

const TOKEN_DISCLAIMER = `The LBV provides a calculable floor, not a guaranteed redemption right. SCARAB tokens are utility tokens, not securities.`;

const BURN_MECHANISMS = [
    {
        num: 1,
        title: 'Device activation',
        desc: '50 SCARAB burned per device registered on-chain.'
    },
    {
        num: 2,
        title: 'Data market queries',
        desc: '100% of query cost burned on purchase. No fee goes to the protocol treasury.'
    },
    {
        num: 3,
        title: 'Revenue buy+burn',
        desc: '10% of all hardware revenue → PancakeSwap market buy → permanent burn.'
    },
    {
        num: 4,
        title: 'UCO commodity sales',
        desc: '30% of bulk oil sale proceeds → market buy → burn. 70% held in LBV.'
    },
    {
        num: 5,
        title: 'Quality penalties',
        desc: 'Failed fraud detection slashes operator stake — slashed SCARAB is burned, not redistributed.'
    }
];

export default function BlueprintPage() {
    const lbvAddress = CONFIG.TREASURY_VAULT_ADDRESS;
    const bscScanBase = import.meta.env.VITE_BSC_MAINNET === 'true'
        ? 'https://bscscan.com'
        : 'https://testnet.bscscan.com';

    return (
        <div className="min-h-screen bg-[#050B08] text-white font-sans">
            <Navbar />

            {/* ── Header ── */}
            <section className="pt-32 pb-12 px-4 max-w-5xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-[4px] text-beetle-green block mb-4">
                    Token Architecture — Blueprint
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                    Where SCARAB token value comes from
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    A mechanistic breakdown of supply dynamics, burn streams, and the Liquidity
                    Backing Vault. No projections — only designed mechanisms.
                </p>
            </section>

            {/* ── SECTION: Emission Explainer ── */}
            <section className="py-12 px-4 max-w-5xl mx-auto">
                <h2 className="text-xl font-black text-white mb-8 border-b border-white/10 pb-3">
                    Supply Dynamics
                </h2>
                <EmissionExplainer />
            </section>

            {/* ── SECTION: Five Burn Mechanisms ── */}
            <section className="py-12 px-4 max-w-3xl mx-auto">
                <h2 className="text-xl font-black text-white mb-4 border-b border-white/10 pb-3">
                    Five Burn Mechanisms
                </h2>
                <ol className="mt-6 space-y-4">
                    {BURN_MECHANISMS.map((item) => (
                        <li key={item.num} className="flex gap-4">
                            <span className="text-beetle-green font-black text-lg min-w-[24px]">{item.num}.</span>
                            <div>
                                <span className="text-white font-bold">{item.title}: </span>
                                <span className="text-gray-400 text-sm">{item.desc}</span>
                            </div>
                        </li>
                    ))}
                </ol>
                <p className="mt-8 text-gray-300 text-sm leading-relaxed border-l-2 border-beetle-green pl-4">
                    Every time the network is used, SCARAB is permanently removed from circulation.
                    More usage = more scarcity.
                </p>
            </section>

            {/* ── SECTION: Liquidity Backing Vault ── */}
            <section className="py-12 px-4 max-w-3xl mx-auto">
                <h2 className="text-xl font-black text-white mb-4 border-b border-white/10 pb-3">
                    The Liquidity Backing Vault
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Revenue from bulk UCO oil sales is held in the{' '}
                    <code className="text-beetle-green font-mono text-xs bg-black/40 px-1 py-0.5 rounded">
                        LiquidityBackingVault
                    </code>{' '}
                    smart contract. 70% is held as backing. The price floor at any point equals
                    vault balance divided by circulating supply. This is publicly verifiable
                    on BSCScan at any time.
                </p>

                <a
                    href={`${bscScanBase}/address/${lbvAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-beetle-green font-bold text-sm hover:underline"
                >
                    View LBV contract →
                </a>

                <p className="text-xs text-gray-600 mt-6 leading-relaxed italic">
                    {TOKEN_DISCLAIMER}
                </p>
            </section>

            {/* ── Footer ── */}
            <footer className="mt-12 py-8 border-t border-white/5 text-center text-xs text-gray-600 px-4">
                <p>Protocol: SCARAB DAO LLC (Wyoming) · EU Ops: SCARAB UG (Germany)</p>
                <p className="mt-1">© {new Date().getFullYear()} SCARAB Protocol. All rights reserved.</p>
            </footer>
        </div>
    );
}
