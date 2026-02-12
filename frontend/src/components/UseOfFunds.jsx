import { Factory, Laptop, Users, Wallet } from 'lucide-react';

export default function UseOfFunds() {
    return (
        <section className="py-20 bg-black border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                            Where does the <span className="text-beetle-gold">500 BNB</span> go?
                        </h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            We aren't burning cash on hype. We are building a factory.
                            The Seed Round is strictly allocated to the manufacturing of the first 50 <strong>BeetleBox</strong> units.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <Factory className="text-beetle-green shrink-0" size={24} />
                                <div>
                                    <h4 className="text-white font-bold text-lg">60% Hardware Manufacturing</h4>
                                    <p className="text-gray-500 text-sm">Raw materials, sensors (ESP32), and assembly of the "Scarab" prototypes.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Laptop className="text-beetle-electric shrink-0" size={24} />
                                <div>
                                    <h4 className="text-white font-bold text-lg">20% R&D & Software</h4>
                                    <p className="text-gray-500 text-sm">Developing the "Hydro Brain" oracle and smart contract auditing.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Wallet className="text-beetle-gold shrink-0" size={24} />
                                <div>
                                    <h4 className="text-white font-bold text-lg">20% Liquidity Injection</h4>
                                    <p className="text-gray-500 text-sm">Locked forever in the DEX pool to ensure healthy trading.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Card */}
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 relative">
                        <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">TRANSPARENCY</div>
                        <h3 className="text-white font-bold mb-6">Capital Allocation</h3>

                        {/* Bars */}
                        <div className="space-y-4 font-mono text-sm">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-400">Hardware (High Priority)</span>
                                    <span className="text-white">300 BNB</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-beetle-green w-[60%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-400">Development</span>
                                    <span className="text-white">100 BNB</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-beetle-electric w-[20%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-400">Liquidity (Locked)</span>
                                    <span className="text-white">100 BNB</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-beetle-gold w-[20%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
