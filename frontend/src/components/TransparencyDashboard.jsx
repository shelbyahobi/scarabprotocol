import React, { useState, useEffect } from 'react';
import { Activity, Droplets, Zap, Wind, Database, Shield, Globe, Clock, DollarSign } from 'lucide-react';

const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
    <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-start gap-4 hover:border-white/10 transition-colors">
        <div className={`p-3 rounded-lg bg-${color}/10 text-${color}`}>
            <Icon size={20} />
        </div>
        <div>
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</div>
            <div className="text-xl font-bold text-white mb-1 font-mono">{value}</div>
            {subtext && <div className="text-[10px] text-gray-500">{subtext}</div>}
        </div>
    </div>
);

export default function TransparencyDashboard() {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 11);
            tomorrow.setHours(0, 0, 0, 0);
            const diff = tomorrow - now;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            setTimeLeft(`${days}d ${hours}h`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-12 bg-black border-t border-white/5">
            <div className="container mx-auto px-4">

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <h3 className="text-xl font-bold text-white tracking-tight">SCARAB NETWORK STATUS</h3>
                    </div>
                    <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                        <Globe size={12} />
                        LIVE DATA (BSC MAINNET)
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">

                    <div className="space-y-4">
                        <h4 className="text-xs text-beetle-gold uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
                            <Zap size={12} /> Production (24h)
                        </h4>
                        <StatCard
                            icon={Zap}
                            label="Energy Generated"
                            value="12,450 kWh"
                            subtext="~4.2 tons CO2 offset"
                            color="beetle-gold"
                        />
                        <StatCard
                            icon={Droplets}
                            label="Water Purified"
                            value="3,200 L"
                            subtext="Community Water Projects"
                            color="beetle-electric"
                        />
                        <StatCard
                            icon={Wind}
                            label="Biogas Produced"
                            value="140 kg"
                            subtext="Organic Waste Processing"
                            color="beetle-green"
                        />
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs text-beetle-electric uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
                            <Activity size={12} /> Network Emission
                        </h4>
                        <div className="bg-[#111] rounded-xl p-5 border border-white/5">
                            <div className="flex justify-between text-sm mb-2 text-gray-400">
                                <span>Daily Target</span>
                                <span>80,000 SCARAB</span>
                            </div>
                            <div className="flex justify-between text-sm mb-4 text-white font-bold font-mono">
                                <span>Actual Minted</span>
                                <span className="text-beetle-green">76,320 SCARAB</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full mb-2 overflow-hidden">
                                <div className="bg-beetle-green h-full rounded-full" style={{ width: '95.4%' }}></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500">
                                <span>Efficiency Ratio: 95.4%</span>
                                <span>4.6% Burned</span>
                            </div>
                        </div>

                        <StatCard
                            icon={Clock}
                            label="Emission Decay"
                            value="83.4%"
                            subtext={`Next Adjustment: ${timeLeft}`}
                            color="gray-400"
                        />
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs text-green-500 uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
                            <Database size={12} /> Treasury Health
                        </h4>
                        <StatCard
                            icon={DollarSign}
                            label="Reserve Balance"
                            value="$450,230"
                            subtext="USDC (Multi-Sig)"
                            color="green-500"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                                <div className="text-[10px] text-gray-500 uppercase">Runway</div>
                                <div className="text-lg font-bold text-white font-mono">18.2 Mo</div>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                                <div className="text-[10px] text-gray-500 uppercase">Revenue</div>
                                <div className="text-lg font-bold text-beetle-gold font-mono">+$98.4k</div>
                            </div>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center gap-3">
                            <Shield size={16} className="text-blue-400" />
                            <div className="text-[10px] text-blue-200">
                                <strong>Safety:</strong> 100% of Treasury requires 3-of-5 Signatures.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
