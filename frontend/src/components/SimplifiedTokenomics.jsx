import { Link } from 'react-router-dom';

const AllocationItem = ({ label, amount, description }) => (
    <div className="flex flex-col mb-4">
        <div className="flex justify-between items-baseline mb-1">
            <h4 className="font-bold text-white text-lg">{label}</h4>
            <span className="text-beetle-gold font-mono font-bold text-lg">{amount}</span>
        </div>
        <p className="text-sm text-gray-400">{description}</p>
    </div>
);

const FloorProjection = ({ year, nodes, vault, floor }) => (
    <div className="bg-[#0a1a0f] border border-beetle-gold/20 rounded-xl p-4 flex flex-col items-center justify-center">
        <div className="font-bold text-green-400 mb-1">{year}</div>
        <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">{nodes} Nodes</div>
        <div className="text-white font-mono mt-2 mb-1">{vault} Vault</div>
        <div className="text-xl font-black text-beetle-gold font-mono">{floor}</div>
    </div>
);

export default function SimplifiedTokenomics() {
    return (
        <section className="py-24 bg-gradient-to-b from-[#0a1a0f] to-black relative">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-beetle-gold font-bold uppercase tracking-widest text-sm mb-4 block">The Treasury</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white">
                        Asset-Backed <span className="text-beetle-gold">Tokenomics</span>
                    </h2>
                    <p className="text-center text-gray-400 max-w-2xl mx-auto mt-6 text-lg">
                        Unlike speculative tokens, SCARAB features a mathematically supported treasury ratio backed by
                        hardware sales revenue. As more devices sell, the baseline rises.
                    </p>
                </div>

                {/* Allocations and Pie Chart Text */}
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="bg-black/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                        <div className="absolute inset-0 bg-beetle-gold/5 opacity-50"></div>
                        {/* We can use a simple visual representation or just rely on the text list for the "Simplified" view. */}
                        <div className="w-64 h-64 rounded-full border-[16px] border-[#0a1a0f] relative flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                            {/* CSS-based pseudo pie chart representation - very simple */}
                            <div className="absolute w-full h-full rounded-full border-[16px] border-beetle-gold" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0)' }}></div>
                            <div className="absolute w-full h-full rounded-full border-[16px] border-beetle-electric opacity-80" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 100%)' }}></div>
                            <div className="absolute w-full h-full rounded-full border-[16px] border-green-500 opacity-60" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0)' }}></div>

                            <div className="text-center z-10">
                                <div className="text-3xl font-black text-white">1B</div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total Supply</div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <AllocationItem
                            label="Seed Sale (30%)"
                            amount="300M"
                            description="Funds hardware R&D and manufacturing"
                        />
                        <AllocationItem
                            label="Regeneration Pool (30%)"
                            amount="300M"
                            description="Mining rewards for verified output (40-year emission decay)"
                        />
                        <AllocationItem
                            label="Liquidity (25%)"
                            amount="250M"
                            description="DEX liquidity locked 12 months"
                        />
                        <AllocationItem
                            label="Marketing (10%)"
                            amount="100M"
                            description="24-month vesting with 48h DAO timelock"
                        />
                        <AllocationItem
                            label="Team (5%)"
                            amount="50M"
                            description="12-month cliff + 24-month linear vesting"
                        />
                    </div>
                </div>

                {/* Floor Price Mechanism - Simplified */}
                <div className="max-w-4xl mx-auto bg-black/40 rounded-3xl p-8 md:p-12 border border-beetle-gold/30 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-beetle-gold to-transparent opacity-50"></div>

                    <h3 className="text-2xl font-bold text-white text-center mb-4">
                        Treasury Support Ratio
                    </h3>
                    <p className="text-gray-300 text-center mb-10 max-w-2xl mx-auto">
                        $50 from every single $349 hardware purchase is locked natively as USDC in the Treasury Vault.
                        <br /><br />
                        <code className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-beetle-gold block">Floor Price = USDC Reserve ÷ Circulating Supply</code>
                    </p>

                    {/* Simplified Projection Table using our new components */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                        <FloorProjection year="YEAR 1" nodes="2,000" vault="$100K" floor="$0.0025" />
                        <FloorProjection year="YEAR 2" nodes="8,000" vault="$500K" floor="$0.0047" />
                        <FloorProjection year="YEAR 3" nodes="25,000" vault="$1.75M" floor="$0.0094" />
                        <FloorProjection year="YEAR 5" nodes="150,000" vault="$12.75M" floor="$0.0425" />
                    </div>

                    <p className="text-sm text-gray-500 text-center mt-8 italic">
                        * Note: This represents the mathematical support limit. The actual market value is historically modeled at 5-10× higher due to real utility demand scaling against decreasing emissions.
                    </p>
                </div>

                <div className="text-center mt-12">
                    <Link
                        to="/docs#tokenomics"
                        className="inline-flex items-center gap-2 text-beetle-electric hover:text-white transition-colors font-bold text-lg"
                    >
                        Read the full Institutional Tokenomics Thesis →
                    </Link>
                </div>
            </div>
        </section>
    );
}
