import React, { useState } from 'react';

export default function UCORewardCalculator() {
    const [volume, setVolume] = useState(12);
    const [oilType, setOilType] = useState('Mixed');

    const A_RATE = parseFloat(import.meta.env.VITE_UCO_RATE_GRADE_A_EUR_L || '0.28');

    const reward = (volume * A_RATE).toFixed(2);

    return (
        <div className="bg-black/50 border border-white/10 rounded-2xl p-6 max-w-md mx-auto my-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-beetle-gold via-yellow-400 to-beetle-green opacity-50"></div>
            <h3 className="text-xl font-bold mb-6 text-center text-white">Reward Estimator</h3>
            
            <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2 flex justify-between">
                    <span>Volume (Litres)</span>
                    <span className="text-white font-bold">{volume} L</span>
                </label>
                <input 
                    type="range" 
                    min="1" 
                    max="25" 
                    step="0.5"
                    value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-beetle-gold h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Primary Oil Type</label>
                <select 
                    value={oilType}
                    onChange={(e) => setOilType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 focus:border-beetle-gold outline-none"
                >
                    <option>Sunflower</option>
                    <option>Rapeseed</option>
                    <option>Palm</option>
                    <option>Mixed</option>
                    <option>Unsure</option>
                </select>
            </div>

            <div className="bg-white/5 border border-beetle-gold/30 rounded-xl p-4 text-center mt-6">
                <div className="text-sm text-gray-400 mb-1">Estimated Reward</div>
                <div className="text-4xl font-black text-beetle-gold">€{reward}</div>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
                * Actual rate confirmed after quality check at the kiosk. Base rate shown is Grade A (€{A_RATE.toFixed(2)}/L).
            </p>
        </div>
    );
}
