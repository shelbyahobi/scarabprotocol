import React, { useState } from 'react';
import { CONFIG } from '../config';
import { Leaf, Droplet, Shield, Zap, RefreshCw } from 'lucide-react';

export default function RewardCalculator({ onModeSelect }) {
    const [wasteType, setWasteType] = useState('bokashi'); // 'bokashi', 'uco', 'combined'
    const [quantityBokashi, setQuantityBokashi] = useState(10);
    const [quantityUCO, setQuantityUCO] = useState(0);

    const [showTokenAsFiat, setShowTokenAsFiat] = useState(false);

    // Dynamic Constants (From Config)
    const EUR_RATE_BOKASHI = CONFIG.FIAT_RATE_BOKASHI;
    const EUR_RATE_UCO = CONFIG.FIAT_RATE_UCO;

    // Current Simulated Environment Rates
    // 100 BRU/kg for Bokashi, up to 1x multiplier = 100 SCARAB at T=0. Let's say ~124 SCARAB per kg currently.
    const SCARAB_RATE_BOKASHI = 124; 
    // 250 BRU/L for UCO, 2.5x multiplier = 250 SCARAB at T=0. Let's say ~310 SCARAB per litre currently.
    const SCARAB_RATE_UCO = 310;
    const MOCK_SCARAB_PRICE_EUR = 0.0035;

    // Mode A Math (Fiat)
    const calcFiat = () => {
        let total = 0;
        if (wasteType === 'bokashi' || wasteType === 'combined') total += quantityBokashi * EUR_RATE_BOKASHI;
        if (wasteType === 'uco' || wasteType === 'combined') total += quantityUCO * EUR_RATE_UCO;
        return total.toFixed(2);
    };

    // Mode B Math (Tokens)
    const calcTokens = () => {
        let total = 0;
        if (wasteType === 'bokashi' || wasteType === 'combined') total += quantityBokashi * SCARAB_RATE_BOKASHI;
        if (wasteType === 'uco' || wasteType === 'combined') total += quantityUCO * SCARAB_RATE_UCO;
        return total;
    };

    return (
        <div className="bg-[#050A05] border border-white/10 rounded-3xl p-6 text-white w-full max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-2xl font-black mb-1">Yield Predictor</h2>
            <p className="text-sm text-gray-400 mb-6 border-b border-white/10 pb-4">Configure your estimated waste volumes to model potential network payouts.</p>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Inputs Column */}
                <div className="space-y-6 md:col-span-1 border-r border-white/5 pr-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Waste Stream</label>
                        <select 
                            className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-beetle-green outline-none"
                            value={wasteType}
                            onChange={(e) => setWasteType(e.target.value)}
                        >
                            <option value="bokashi">Bokashi Ferment (Organic)</option>
                            <option value="uco">Used Cooking Oil (SAF)</option>
                            <option value="combined">Combined Streams</option>
                        </select>
                    </div>

                    {(wasteType === 'bokashi' || wasteType === 'combined') && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex justify-between mb-2">
                                <span>Bokashi (kg)</span>
                                <span className="text-white">{quantityBokashi} kg</span>
                            </label>
                            <input type="range" min="1" max="100" value={quantityBokashi} onChange={(e) => setQuantityBokashi(Number(e.target.value))} className="w-full accent-beetle-green" />
                        </div>
                    )}

                    {(wasteType === 'uco' || wasteType === 'combined') && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex justify-between mb-2">
                                <span>Used Cooking Oil (Litres)</span>
                                <span className="text-beetle-gold">{quantityUCO} L</span>
                            </label>
                            <input type="range" min="1" max="50" value={quantityUCO} onChange={(e) => setQuantityUCO(Number(e.target.value))} className="w-full accent-beetle-gold" />
                        </div>
                    )}
                </div>

                {/* Outputs Panel */}
                <div className="md:col-span-2 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4 h-full">

                        {/* Mode A: Fiat Stable */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/50 transition-colors group">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center gap-1">
                                        <Shield size={12} /> Mode A: Predictable
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black text-white mt-4">€{calcFiat()} EUR</h3>
                                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                                    SCARAB Protocol absorbs all token price risk. You receive a fixed EUR rate locked at submission time, paid in EURC stablecoins.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/5">
                                <ul className="text-[10px] text-gray-500 space-y-1 mb-4">
                                    <li>• 10kg Bokashi → €{(10 * EUR_RATE_BOKASHI).toFixed(2)}</li>
                                    <li>• 25kg Bokashi → €{(25 * EUR_RATE_BOKASHI).toFixed(2)}</li>
                                </ul>
                                <button 
                                    onClick={() => onModeSelect && onModeSelect('A')}
                                    className="w-full py-2 bg-blue-500/10 text-blue-400 font-bold text-xs rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-all"
                                >
                                    Select Predictable Mode
                                </button>
                            </div>
                        </div>

                        {/* Mode B: Token Risk */}
                        <div className="bg-white/5 border border-beetle-green/20 rounded-2xl p-5 flex flex-col justify-between hover:border-beetle-green transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-beetle-green/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="bg-beetle-green/20 text-beetle-green text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center gap-1">
                                        <Zap size={12} /> Mode B: Growth Potential
                                    </div>
                                    <button 
                                        onClick={() => setShowTokenAsFiat(!showTokenAsFiat)}
                                        className="text-gray-500 hover:text-white"
                                        title="Toggle Fiat Estimate"
                                    >
                                        <RefreshCw size={14} />
                                    </button>
                                </div>
                                
                                {showTokenAsFiat ? (
                                    <div className="mt-4">
                                        <h3 className="text-3xl font-black text-white">~€{(calcTokens() * MOCK_SCARAB_PRICE_EUR).toFixed(2)}</h3>
                                        <div className="text-[10px] text-gray-500 mt-1">Estimated spot value at current DEX pricing</div>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <h3 className="text-3xl font-black text-beetle-green">{calcTokens().toLocaleString()}</h3>
                                        <div className="text-[10px] text-gray-500 mt-1">SCARAB at current emission schedule</div>
                                    </div>
                                )}

                                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                                    You receive raw network protocol emissions. Early participants receive more tokens. Emission algorithm halves every 18 months via mathematically modelled decay.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                                <button 
                                    onClick={() => onModeSelect && onModeSelect('B')}
                                    className="w-full py-2 bg-beetle-green/10 text-beetle-green font-bold text-xs rounded-lg group-hover:bg-beetle-green group-hover:text-black transition-all"
                                >
                                    Select Growth Mode
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
            <div className="text-center mt-6 text-[10px] text-gray-600 uppercase tracking-widest">
                All yields are modeled scenarios. Not guaranteed financial returns.
            </div>
        </div>
    );
}
