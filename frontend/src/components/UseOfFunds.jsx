import { Factory, Laptop, Users, Wallet } from 'lucide-react';

export default function UseOfFunds() {
    return (
        <section className="py-20 bg-black border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                            Where does the <span className="text-beetle-gold">$2,000,000</span> go?
                        </h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            We aren't just selling boxes. We are building the <strong>Embedded Sustainability Layer</strong> for the entire physical world.
                            The Seed Capital fuels the R&D of the secure firmware that powers the DePIN network.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <Laptop className="text-beetle-electric shrink-0" size={24} />
                                <div>
                                    <h4 className="text-white font-bold text-lg">40% R&D & Embedded Firmware</h4>
                                    <p className="text-gray-500 text-sm">Developing the "Secure Element" integration (ATECC608A) for partner hardware.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Factory className="text-beetle-green shrink-0" size={24} />
                                <div>
                                    <h4 className="text-white font-bold text-lg">30% Hardware Inventory</h4>
                                    <p className="text-gray-500 text-sm">Manufacturing the initial batch of 1,000 "Scarab Node" modules for global distribution.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Wallet className="text-beetle-gold shrink-0" size={24} />
                                <div>
                                    <h4 className="text-white font-bold text-lg">30% Liquidity & Legal</h4>
                                    <p className="text-gray-500 text-sm">DEX Liquidity injection and international DePIN regulatory compliance.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Card */}
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 relative">
                        <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">TRANSPARENCY</div>
                        <h3 className="text-white font-bold mb-6">Capital Allocation (Hard Cap)</h3>

                        {/* Bars */}
                        <div className="space-y-4 font-mono text-sm">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-400">R&D / Firmware</span>
                                    <span className="text-white">$800k</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-beetle-electric w-[40%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-400">Hardware Inventory</span>
                                    <span className="text-white">$600k</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-beetle-green w-[30%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-400">Liquidity / Legal</span>
                                    <span className="text-white">$600k</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-beetle-gold w-[30%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
