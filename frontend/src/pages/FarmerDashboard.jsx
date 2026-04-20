import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Lock, Info, ShieldCheck, Activity } from 'lucide-react';

/**
 * SCARAB Protocol — Farmer Dashboard
 * 
 * Design principles:
 * 1. Blockchain invisible: no token addresses, gas fees, or
 *    technical jargon visible to farmer users.
 * 2. Fiat-first: all monetary values displayed in EUR/USD.
 * 3. ERC-4337 ready: wallet managed by smart contract account,
 *    no seed phrase required from user.
 * 4. Off-ramp ready: auto-withdraw architecture designed for
 *    MoonPay/Ramp integration at Series A.
 * 5. PWA optimised: works offline, installable on mobile.
 */
export default function FarmerDashboard() {
    const navigate = useNavigate();
    const [farmerData, setFarmerData] = useState(null);
    const [autoWithdraw, setAutoWithdraw] = useState(false);

    // TODO: Hardcoded conversion rate for now (1 SCARAB = 0.025 EUR)
    const SCARAB_TO_EUR_RATE = 0.025;
    
    // Mock Data
    const mockBalanceEUR = (45000 * SCARAB_TO_EUR_RATE).toFixed(2); // e.g. 1125.00
    const mockPendingPickups = [
        { id: '1', initial: 'S.', distance: '1.2', kg: '14.5' },
        { id: '2', initial: 'M.', distance: '3.4', kg: '9.0' },
        { id: '3', initial: 'J.', distance: '5.1', kg: '22.0' }
    ];

    // Mock Feeding Data for Chart
    const mockFeedingData = [
        { date: '04-01', delta: 4.2, type: 'waste_added' },
        { date: '04-01', delta: 0.5, type: 'bran_added' },
        { date: '04-03', delta: 3.8, type: 'waste_added' },
        { date: '04-03', delta: 0.4, type: 'bran_added' },
        { date: '04-05', delta: 0.02, type: 'inspection' },
        { date: '04-07', delta: 5.1, type: 'waste_added' },
        { date: '04-07', delta: 0.6, type: 'bran_added' },
        { date: '04-09', delta: 4.5, type: 'waste_added' },
        { date: '04-09', delta: 0.5, type: 'bran_added' },
        { date: '04-11', delta: 0.01, type: 'inspection' },
        { date: '04-13', delta: 3.2, type: 'waste_added' },
        { date: '04-13', delta: 0.4, type: 'bran_added' },
        { date: '04-15', delta: 4.9, type: 'waste_added' },
    ];

    const getBarColor = (type) => {
        if (type === 'waste_added') return '#1D9E75';
        if (type === 'bran_added') return '#FBBF24';
        return '#4B5563'; // grey for inspection
    };

    useEffect(() => {
        const session = localStorage.getItem('scarab_farmer_session');
        if (!session) {
            navigate('/onboard/farmer');
        } else {
            setFarmerData(JSON.parse(session));
        }
    }, [navigate]);

    const handleAcceptPickup = (id) => {
        // TODO: BokashiValidator handshake call — Phase 4 integration
        alert('Pickup accepted. (Handshake will be confirmed on-chain once validator is live.)');
    };

    if (!farmerData) return null;

    return (
        <div className="min-h-screen bg-[#050a05] text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6 mt-16">
                
                {/* Header Section */}
                <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black">Welcome back, {farmerData.firstName || 'Farmer'}</h1>
                        <p className="text-gray-400 mt-1">Your ecosystem summary</p>
                    </div>
                </div>

                {/* SECTION A — Summary metrics row (3 cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#0a1a0f] border border-white/10 rounded-2xl p-6" data-testid="metric-eur-card">
                        <div className="text-sm font-medium text-gray-400 mb-2">This month</div>
                        <div className="text-4xl font-black text-[#1D9E75]">€{mockBalanceEUR}</div>
                        <div className="text-xs text-green-500 font-bold mt-2 bg-green-500/10 inline-block px-2 py-1 rounded">
                            +12% vs last month
                        </div>
                    </div>
                    
                    <div className="bg-[#0a1a0f] border border-white/10 rounded-2xl p-6" data-testid="metric-waste-card">
                        <div className="text-sm font-medium text-gray-400 mb-2">Waste processed</div>
                        <div className="text-4xl font-black text-white">415 <span className="text-2xl text-gray-500">kg</span></div>
                        <div className="text-xs text-gray-400 font-bold mt-2 bg-white/5 inline-block px-2 py-1 rounded">
                            12 cycles completed
                        </div>
                    </div>
                    
                    <div className="bg-[#0a1a0f] border border-[#1D9E75]/20 rounded-2xl p-6" data-testid="metric-payout-card">
                        <div className="text-sm font-medium text-gray-400 mb-2">Next payout</div>
                        <div className="text-3xl font-black text-white mb-1">Friday</div>
                        <div className="text-xs text-[#1D9E75] font-bold">
                            Auto-withdraw: {autoWithdraw ? 'ON' : 'OFF'}
                        </div>
                    </div>
                </div>

                {/* SECTION B — Device status card */}
                <div className="bg-black border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden" data-testid="device-status-card">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#1D9E75]/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">Primary Composter</h3>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1D9E75]/20 text-[#1D9E75] border border-[#1D9E75]/30">Active</span>
                            </div>
                            <p className="text-sm text-gray-400 font-mono">ID: BOK-9942</p>
                        </div>
                        
                        <div className="flex-1 max-w-md w-full bg-[#0a1a0f] rounded-xl p-4 border border-white/5">
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span className="text-gray-300">Current Batch Progress</span>
                                <span className="text-[#1D9E75]">Day 9 of 15</span>
                            </div>
                            <div className="h-2 bg-black rounded-full overflow-hidden w-full mb-3">
                                <div className="h-full bg-[#1D9E75] rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <div className="text-xs text-gray-500">
                                <strong>+4.2 kg</strong> added today
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION C — Feeding Activity Chart [NEW] */}
                <div className="bg-[#0a1a0f] border border-white/10 rounded-2xl p-6 md:p-8" data-testid="feeding-activity-chart">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">Feeding Activity</h3>
                            <p className="text-xs text-gray-500">Waste vs. Bran additions (last 30 days)</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                                <div className="w-2 h-2 rounded-full bg-[#1D9E75]"></div> Waste
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                                <div className="w-2 h-2 rounded-full bg-[#FBBF24]"></div> Bran
                            </div>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockFeedingData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#555" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="#555" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false}
                                    unit="kg"
                                />
                                <Tooltip 
                                    contentStyle={{ background: '#0a1a0f', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    cursor={{ fill: '#ffffff05' }}
                                />
                                <Bar dataKey="delta" radius={[4, 4, 0, 0]}>
                                    {mockFeedingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getBarColor(entry.type)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* SECTION B2 — My Hub card [NEW] */}
                <div className="bg-[#0a1a0f] border border-white/10 rounded-2xl p-6" data-testid="my-hub-card">
                    <h3 className="text-lg font-bold text-white mb-4">My Hub</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Hub name</div>
                            <div className="text-white font-bold text-sm">Hub Marktplatz</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Distance</div>
                            <div className="text-white font-bold text-sm">2.4 km</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Fill level</div>
                            <div className="flex flex-col gap-1">
                                <div className="text-white font-bold text-sm">23%</div>
                                <div className="h-1.5 bg-black rounded-full overflow-hidden w-full">
                                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '23%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Est. collection</div>
                            <div className="text-white font-bold text-sm">~8 days</div>
                        </div>
                    </div>
                </div>

                {/* SECTION C — Pending pickups card */}
                <div className="bg-[#0a1a0f] border border-white/10 rounded-2xl p-6" data-testid="pending-pickups-card">
                    <h3 className="text-lg font-bold text-white mb-4">Nearby Pickups Available</h3>
                    <div className="space-y-3">
                        {mockPendingPickups.map((pickup) => (
                            <div key={pickup.id} className="flex items-center justify-between bg-black border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-gray-300">
                                        {pickup.initial}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{pickup.distance} km away</div>
                                        <div className="text-sm text-gray-400">Residential household</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="font-bold text-[#1D9E75]">{pickup.kg} kg</div>
                                        <div className="text-xs text-gray-500">Ready now</div>
                                    </div>
                                    <button 
                                        onClick={() => handleAcceptPickup(pickup.id)}
                                        className="bg-[#1D9E75] hover:bg-[#15805e] text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                                        data-testid={`accept-pickup-${pickup.id}`}
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION D — Payout History [NEW] */}
                <div className="bg-black border border-white/10 rounded-2xl p-6 md:p-8" data-testid="payout-history-card">
                    <h3 className="text-lg font-bold text-white mb-4">Payout History</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-2 pr-4 text-gray-500 font-bold">Date</th>
                                    <th className="text-left py-2 pr-4 text-gray-500 font-bold">Amount (EUR)</th>
                                    <th className="text-left py-2 pr-4 text-gray-500 font-bold">Waste (kg)</th>
                                    <th className="text-left py-2 text-gray-500 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={4} className="py-12 text-center">
                                        <div className="text-gray-600 text-sm leading-relaxed">
                                            Your first payout will appear here once your device submits verified data.
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SECTION E — Auto-withdraw toggle card */}
                <div className="bg-black border border-white/10 rounded-2xl p-6 md:p-8 flex items-start gap-4" data-testid="auto-withdraw-card">
                    <div className="pt-1">
                        <label className="relative inline-block w-12 h-6 cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={autoWithdraw}
                                onChange={() => setAutoWithdraw(!autoWithdraw)}
                                data-testid="auto-withdraw-toggle"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1D9E75]"></div>
                        </label>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-1">Automatically transfer earnings to your bank account</h4>
                        <p className="text-sm text-gray-400 mb-2">Processed every Friday. Minimum payout: €5.00</p>
                        <div className="text-xs font-mono text-gray-600">
                            Status: {autoWithdraw ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                </div>

                {/* SECTION F — Transparency Table [NEW] */}
                <div className="bg-[#050a05] border border-white/5 rounded-3xl p-6 md:p-10 mb-20" data-testid="transparency-table-card">
                    <div className="flex items-center gap-3 mb-8">
                        <ShieldCheck className="text-[#1D9E75]" size={24} />
                        <h3 className="text-xl font-black text-white">Data Collection Transparency</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-4 pr-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Sensor</th>
                                    <th className="py-4 pr-6 text-[10px] font-black uppercase tracking-widest text-gray-500">What it measures</th>
                                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">What happens to this data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr>
                                    <td className="py-5 pr-6 font-bold text-white">Reed switch (lid) + load cell</td>
                                    <td className="py-5 pr-6 text-gray-400 leading-relaxed">
                                        Lid open/close events, weight before and after each opening, duration open, ambient temperature at opening
                                    </td>
                                    <td className="py-5 text-gray-400 leading-relaxed">
                                        Stored as feeding sessions linked to your device. Used to calculate fermentation quality score and validate submission weight. Aggregate feeding patterns (anonymised) may be shared with agricultural research partners with your consent. You can view every session in your dashboard.
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-5 pr-6 font-bold text-white">ATECC608A Chip</td>
                                    <td className="py-5 pr-6 text-gray-400 leading-relaxed">
                                        Cryptographic signatures of telemetry data
                                    </td>
                                    <td className="py-5 text-gray-400 leading-relaxed">
                                        Ensures that the weight and temperature data came from your specific hardware. Prevents data tampering or spoofing.
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-5 pr-6 font-bold text-white">Environmental (API)</td>
                                    <td className="py-5 pr-6 text-gray-400 leading-relaxed">
                                        Regional temperature and humidity
                                    </td>
                                    <td className="py-5 text-gray-400 leading-relaxed">
                                        Cross-referenced with your device sensors to verify that the fermentation cycle matches local climate conditions.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 p-4 bg-white/5 rounded-xl flex items-start gap-4">
                        <Info className="text-gray-500 flex-shrink-0 mt-1" size={16} />
                        <p className="text-xs text-gray-500 leading-relaxed">
                            <strong>Privacy Shield:</strong> Your exact GPS coordinates and real-world identity are never stored in the telemetry feed. Only your city-level H3 spatial cell is recorded for logistics optimization.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

