import { Recycle, Calculator, Truck, Database } from 'lucide-react';

export default function Ecoloop() {
    return (
        <section className="py-24 bg-gradient-to-b from-black via-[#0a1a0f] to-black relative overflow-hidden">

            {/* Grid Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <span className="text-beetle-green font-bold uppercase tracking-[0.2em] text-sm">Real World Assets (RWA)</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6 leading-tight">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-beetle-green to-beetle-electric">Ecoloop</span> Network
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Web3 meets heavy metal. We turn organic waste into verified energy credits.
                        Every token powers the development of the "Scarab" hardware network.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-4 px-4">
                    {/* Step 1 */}
                    <div className="bg-black/40 border border-beetle-green/20 rounded-2xl p-8 hover:border-beetle-green/50 transition-all group hover:-translate-y-2">
                        <div className="w-14 h-14 bg-beetle-green/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Truck className="text-beetle-green w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">1. Collection</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Organic waste is collected from local businesses and verified on-chain via GPS tracking.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-black/40 border border-beetle-green/20 rounded-2xl p-8 hover:border-beetle-electric/50 transition-all group hover:-translate-y-2">
                        <div className="w-14 h-14 bg-beetle-electric/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Recycle className="text-beetle-electric w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">2. Processing</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            The <strong>Embedded Node</strong> hardware processes waste into fertilizer and biogas. Real-world "Mining".
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-black/40 border border-beetle-green/20 rounded-2xl p-8 hover:border-beetle-gold/50 transition-all group hover:-translate-y-2">
                        <div className="w-14 h-14 bg-beetle-gold/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Database className="text-beetle-gold w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">3. Verification</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Sensors oracle the data to the blockchain. <span className="text-beetle-gold">Physical Proof of Work</span> mints rewards.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-black/40 border border-beetle-green/20 rounded-2xl p-8 hover:border-white/50 transition-all group hover:-translate-y-2">
                        <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Calculator className="text-white w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">4. Value Accrual</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Profits buy back $ROLL tokens. The more waste processed, the scarcer the token becomes.
                        </p>
                    </div>
                </div>

                {/* Hardware Teaser */}
                <div className="mt-24 text-center">
                    <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-beetle-green to-beetle-electric">
                        <div className="bg-black/90 rounded-xl px-8 py-4">
                            <span className="text-white font-mono font-bold tracking-widest">HARDWARE VER. 1.0 "SCARAB" LAUNCHING Q4 2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}
