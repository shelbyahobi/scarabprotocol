import { useState } from 'react';
import { ShoppingBag, Server, CheckCircle, Wifi, Sun, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';

export default function HardwareMarketplace() {
    const { isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' or 'mynodes'

    // Mock Data for "BeetleBox" Pre-Order
    const products = [
        {
            id: 1,
            name: "BeetleBox v1 (Scarab)",
            price: "2,500 ROLL",
            retailPrice: "$450 USD",
            image: "/hero.png",
            features: ["Solar MPPT", "LoRaWAN Gateway", "Bio-Waste Sensor"],
            stock: "Pre-Order Q3"
        },
        {
            id: 2,
            name: "Hydro-Bit Sensor",
            price: "500 ROLL",
            retailPrice: "$99 USD",
            image: "/logo_eco.jpg",
            features: ["Water Flow Meter", "Purity Sensor", "WiFi Connect"],
            stock: "In Design"
        }
    ];

    const myNodes = [
        // Empty state for now
    ];

    return (
        <section className="bg-[#0a1a0f] border border-white/5 rounded-2xl overflow-hidden mb-12">

            {/* Header */}
            <div className="bg-black/40 p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Server className="text-beetle-gold" /> Hardware & IoT
                    </h3>
                    <p className="text-sm text-gray-500">Acquire the gear to mine the 30% Eco-Allocation.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('marketplace')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'marketplace' ? 'bg-beetle-gold text-black' : 'bg-white/5 text-gray-400'}`}
                    >
                        Marketplace
                    </button>
                    <button
                        onClick={() => setActiveTab('mynodes')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'mynodes' ? 'bg-beetle-gold text-black' : 'bg-white/5 text-gray-400'}`}
                    >
                        My Nodes
                    </button>
                </div>
            </div>

            <div className="p-8">
                {activeTab === 'marketplace' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="bg-black/40 border border-white/10 rounded-xl overflow-hidden group hover:border-beetle-gold/50 transition-all">
                                <div className="aspect-square bg-gray-900 relative overflow-hidden flex items-center justify-center p-6">
                                    <div className="absolute top-2 right-2 bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">
                                        Seed Holder Priority
                                    </div>
                                    <img src={product.image} alt={product.name} className="w-full object-contain group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="p-6">
                                    <h4 className="text-lg font-bold text-white mb-1">{product.name}</h4>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-beetle-gold font-mono font-bold">{product.price}</span>
                                        <span className="text-gray-500 text-sm line-through decoration-red-500">{product.retailPrice}</span>
                                    </div>
                                    <ul className="space-y-2 mb-6 text-sm text-gray-400">
                                        {product.features.map((feat, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle size={14} className="text-beetle-electric" /> {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <button disabled className="w-full bg-white/10 text-gray-300 font-bold py-3 rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                                        <ShoppingBag size={16} /> {product.stock}
                                    </button>
                                    <p className="text-center text-[10px] text-gray-500 mt-2">Connects to Ecoloop Network</p>
                                </div>
                            </div>
                        ))}

                        {/* Call to Action Card */}
                        <div className="bg-gradient-to-br from-beetle-gold/10 to-transparent border border-beetle-gold/30 rounded-xl p-6 flex flex-col justify-center items-center text-center">
                            <AlertCircle size={48} className="text-beetle-gold mb-4" />
                            <h4 className="text-xl font-bold text-white mb-2">Why Buy?</h4>
                            <p className="text-gray-400 text-sm mb-6">
                                Only Verified Hardware can mine the 30% Eco-Allocation.
                                Seed holders get first access to Batch 1.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'mynodes' && (
                    <div className="text-center py-20 bg-black/20 rounded-xl border border-dashed border-white/10">
                        <Server size={48} className="text-gray-600 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-white mb-2">No Active Nodes</h4>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            You haven't connected any BeetleBox hardware yet.
                            Acquire a node from the Marketplace to start generating Proof of Physical Work.
                        </p>
                        <button onClick={() => setActiveTab('marketplace')} className="text-beetle-gold font-bold hover:underline">
                            Browse Hardware
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
