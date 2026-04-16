import { Factory, Laptop, Vault, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Node unit economics breakdown per $349 node sale
const allocations = [
    { label: 'Bill of Materials (BOM)', amount: '$155', pct: 44, color: 'bg-gray-600', desc: 'ESP32, ATECC608A secure element, sensors, solar kit, casing' },
    { label: 'Manufacturing & Assembly', amount: '$25', pct: 7, color: 'bg-gray-500', desc: 'Factory labor, QC testing, firmware flashing' },
    { label: 'Global Logistics', amount: '$30', pct: 9, color: 'bg-gray-500', desc: 'Shipping, customs, last-mile delivery' },
    { label: 'Customer Acquisition', amount: '$20', pct: 6, color: 'bg-gray-400', desc: 'Digital marketing and referral programme' },
    { label: 'R&D / Operations', amount: '$69', pct: 20, color: 'bg-beetle-electric', desc: 'Firmware R&D, server costs, team, legal compliance' },
    { label: 'Liquidity Backing Vault', amount: '$50', pct: 14, color: 'bg-beetle-gold', desc: 'Allocated as USDC treasury backing metric (non-guaranteed)' },
];

const flywheel = [
    { step: '01', label: 'Node Sold ($349)', desc: '$50 → USDC Vault', color: 'text-beetle-gold' },
    { step: '02', label: 'Device Produces Energy', desc: 'kWh data → validator', color: 'text-beetle-electric' },
    { step: '03', label: 'Rewards Accumulated', desc: 'No gas, ledger-based', color: 'text-green-400' },
    { step: '04', label: 'User Claims SCARAB', desc: '1 tx/week, pull model', color: 'text-purple-400' },
    { step: '05', label: 'Treasury Backing Updates', desc: 'More nodes → potentially stronger backing metric', color: 'text-yellow-400' },
];

export default function UseOfFunds() {
    return (
        <section className="py-20 bg-black border-t border-white/5">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-xs font-mono tracking-widest text-beetle-gold uppercase mb-4 block">Unit Economics</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                        Where every <span className="text-beetle-gold">$349</span> node goes
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Every hardware sale is a reinvestment event. 14% of each node's revenue
                        is locked as USDC, growing the token's treasury support ratio automatically.
                    </p>
                </div>

                {/* Allocation breakdown */}
                <div className="grid md:grid-cols-2 gap-12 mb-20 items-start">

                    <div className="space-y-4">
                        {allocations.map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                className="group"
                            >
                                <div className="flex justify-between mb-1 text-sm">
                                    <span className={`font-bold ${item.color === 'bg-beetle-gold' ? 'text-beetle-gold' : item.color === 'bg-beetle-electric' ? 'text-beetle-electric' : 'text-white'}`}>
                                        {item.label}
                                    </span>
                                    <span className="text-white font-mono">{item.amount}</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-1">
                                    <motion.div
                                        className={`h-full rounded-full ${item.color}`}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${item.pct}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: i * 0.07 }}
                                    />
                                </div>
                                <p className="text-gray-600 text-xs">{item.desc}</p>
                            </motion.div>
                        ))}

                        <div className="mt-6 p-4 bg-beetle-gold/10 border border-beetle-gold/20 rounded-2xl">
                            <p className="text-beetle-gold font-bold text-sm">Net Margin: $119 per node (34%)</p>
                            <p className="text-gray-400 text-xs mt-1">$50 secured in vault · $69 funds R&D and operations</p>
                        </div>
                    </div>

                    {/* 5-Year Treasury Backing Projection */}
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-beetle-gold/20 text-beetle-gold text-xs font-bold px-3 py-1 rounded-full">LIVE MODEL</div>
                        <h3 className="text-white font-bold text-lg mb-2">5-Year Treasury Model</h3>
                        <p className="text-gray-500 text-xs mb-6 font-mono">Backing Metric = V<sub>USDC</sub> ÷ S<sub>circ</sub></p>

                        <div className="space-y-3 font-mono text-sm">
                            <div className="grid grid-cols-4 text-gray-600 text-xs uppercase pb-2 border-b border-white/5">
                                <span>Year</span>
                                <span>Nodes</span>
                                <span>USDC Vault</span>
                                <span className="text-right">Backing</span>
                            </div>
                            {[
                                { year: 1, nodes: '2,000', usdc: '$100k', floor: '$0.0025' },
                                { year: 2, nodes: '8,000', usdc: '$500k', floor: '$0.0047' },
                                { year: 3, nodes: '25,000', usdc: '$1.75M', floor: '$0.0094' },
                                { year: 4, nodes: '70,000', usdc: '$5.25M', floor: '$0.0210' },
                                { year: 5, nodes: '150,000', usdc: '$12.75M', floor: '$0.0425' },
                            ].map(row => (
                                <div key={row.year} className={`grid grid-cols-4 py-2 rounded-lg px-2 ${row.year === 5 ? 'bg-beetle-gold/10 text-beetle-gold' : 'text-gray-400'}`}>
                                    <span>Y{row.year}</span>
                                    <span>{row.nodes}</span>
                                    <span>{row.usdc}</span>
                                    <span className="text-right font-bold">{row.floor}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-600 text-xs mt-4">Illustrative accounting metric only. Not a redemption right or guaranteed market price.</p>
                    </div>
                </div>

                {/* Flywheel */}
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-center text-white font-bold text-xl mb-8">The Revenue Flywheel</h3>
                    <div className="flex flex-wrap justify-center items-center gap-2">
                        {flywheel.map((step, i) => (
                            <div key={step.step} className="flex items-center gap-2">
                                <div className="text-center bg-[#0a1a0f] border border-white/10 rounded-2xl px-5 py-4 min-w-[130px]">
                                    <div className={`text-xs font-mono ${step.color} mb-1`}>{step.step}</div>
                                    <div className="text-white font-bold text-sm">{step.label}</div>
                                    <div className="text-gray-500 text-xs mt-1">{step.desc}</div>
                                </div>
                                {i < flywheel.length - 1 && (
                                    <ArrowRight size={16} className="text-gray-700 shrink-0" />
                                )}
                            </div>
                        ))}
                        {/* Loop arrow */}
                        <div className="text-gray-600 text-xs font-mono mt-2 w-full text-center">↩ Loop repeats with every new node sold</div>
                    </div>
                </div>

            </div>
        </section>
    );
}
