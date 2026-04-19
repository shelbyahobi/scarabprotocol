import React from 'react';

/*
 * EmissionExplainer.jsx
 * Static (no client-side state) — safe for SSR/Vercel.
 * Used on: /blueprint and /docs pages.
 * Mobile-first: stacked on mobile (375px), side-by-side on md+.
 * No console.log statements.
 */

const TOKEN_DISCLAIMER = `Token price is not guaranteed. This describes the designed mechanism, not a prediction.`;

const NODE_TABLE = [
    { nodes: '760',    perNode: '81.0',  burned: '38,000' },
    { nodes: '3,050',  perNode: '20.2',  burned: '152,500' },
    { nodes: '9,250',  perNode: '6.7',   burned: '462,500' },
    { nodes: '72,250', perNode: '0.9',   burned: '3,612,500' },
];

export default function EmissionExplainer() {
    return (
        <div className="grid md:grid-cols-3 gap-6 w-full">

            {/* ── CARD 1: Fixed and shrinking supply ── */}
            <div className="bg-[#050B08] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                <div className="text-xs font-bold uppercase tracking-widest text-beetle-green">
                    Fixed and shrinking supply
                </div>
                <h3 className="text-white font-black text-xl leading-snug">
                    1 billion SCARAB. No new minting. Ever.
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    The emission schedule follows a 40-year exponential decay. In Year 1,
                    approximately 21.6 million SCARAB are emitted to node operators. In Year 10,
                    approximately 17.8 million. The total emission over 40 years equals exactly
                    400 million — 40% of supply. The remaining 600 million was distributed at genesis.
                </p>
                <div className="bg-black rounded-xl p-4 border border-white/5">
                    <pre className="font-mono text-xs text-beetle-green whitespace-pre-wrap leading-relaxed">
{`E(t) = 61,554 × e^(-0.00020518 × t)
[SCARAB/day]`}
                    </pre>
                </div>
            </div>

            {/* ── CARD 2: More nodes, lower per-node ── */}
            <div className="bg-[#050B08] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                <div className="text-xs font-bold uppercase tracking-widest text-beetle-electric">
                    More nodes, lower per-node emission — but higher value
                </div>
                <h3 className="text-white font-black text-xl leading-snug">
                    Early nodes earn more. All nodes benefit from growth.
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    As the network grows, the fixed daily emission is divided among more nodes.
                    A single node at 760 total nodes earns approximately 81 SCARAB/day.
                    The same node at 10,000 total nodes earns approximately 6 SCARAB/day.
                    However, every new node activation burns 50 SCARAB permanently.
                    At 10,000 nodes, 500,000 SCARAB have been permanently destroyed —
                    reducing circulating supply and increasing scarcity.
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-2 pr-3 text-gray-500 font-bold">Nodes</th>
                                <th className="text-left py-2 pr-3 text-gray-500 font-bold">Per-node/day</th>
                                <th className="text-left py-2 text-gray-500 font-bold">Total burned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {NODE_TABLE.map((row) => (
                                <tr key={row.nodes} className="border-b border-white/5">
                                    <td className="py-2 pr-3 font-mono text-white">{row.nodes}</td>
                                    <td className="py-2 pr-3 text-gray-300">{row.perNode}</td>
                                    <td className="py-2 text-gray-400">{row.burned} SCARAB</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── CARD 3: The Flywheel ── */}
            <div className="bg-[#050B08] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                <div className="text-xs font-bold uppercase tracking-widest text-beetle-gold">
                    The flywheel
                </div>
                <h3 className="text-white font-black text-xl leading-snug">
                    Growth burns tokens. Burns increase value.
                </h3>
                <ol className="text-gray-400 text-sm leading-relaxed space-y-3 list-decimal list-inside">
                    <li>Hardware sales generate revenue</li>
                    <li>10% of revenue buys SCARAB on PancakeSwap and burns it</li>
                    <li>UCO oil sales fund the Liquidity Backing Vault</li>
                    <li>LBV balance ÷ circulating supply = verifiable price floor</li>
                </ol>
                <div className="bg-black border border-white/5 rounded-xl p-4">
                    <p className="text-white text-sm font-bold leading-relaxed">
                        The network is designed so that adoption and token value reinforce
                        each other — not compete.
                    </p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed italic mt-auto">
                    {TOKEN_DISCLAIMER}
                </p>
            </div>

        </div>
    );
}
