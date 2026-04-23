import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Leaf, Droplet, Thermometer, Wind, AlertTriangle, Download, Sun, Activity, Wrench, Sprout } from 'lucide-react';
import { CONFIG } from '../config';

const MOCK_DEVICE_ID = 'AS-PRO-9942';

// Simulated data
const mockIndexData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    pai: Math.floor(40 + Math.random() * 40),
    carbon: (Math.random() * 2 - 1).toFixed(2),
    tempUnder: 22 + Math.random() * 5,
    tempAmbient: 24 + Math.random() * 8
}));

export default function FarmDashboard() {
    const sessionRaw = localStorage.getItem('scarab_farmer_session');
    const session = sessionRaw ? JSON.parse(sessionRaw) : null;
    const [soilingData, setSoilingData] = useState({ soilingLossPct: 3.2, annualEurLoss: 124, daysSinceLastClean: 14 });
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(true);

    if (!session) {
        return <Navigate to="/onboard/farmer" replace />;
    }

    useEffect(() => {
        // Fetch recommendations (mocking the Claude API call for now to avoid actual API costs,
        // but structured as requested)
        setTimeout(() => {
            setRecommendations([
                {
                    icon: '🔧',
                    headline: 'Panelreinigung empfohlen',
                    explanation: 'Der optische Verschmutzungssensor zeigt 3.2% Leistungsverlust. Die geschätzten jährlichen Einbußen übersteigen die Reinigungskosten.',
                    action: 'Module in Reihe 3-5 reinigen',
                    expected_outcome: 'Wiederherstellung von 100% Modulleistung und Vermeidung von 124€ Verlust.'
                },
                {
                    icon: '💧',
                    headline: 'Bodenfeuchtigkeit kritisch',
                    explanation: 'Die Bodenfeuchtigkeit in Parzelle B ist in den letzten 48 Stunden um 15% gefallen. Der aktuelle LAI (Leaf Area Index) deutet auf beginnenden Trockenstress hin.',
                    action: 'Tropfbewässerung für 2h aktivieren',
                    expected_outcome: 'Stabilisierung des LAI und Vermeidung von Ertragseinbußen.'
                },
                {
                    icon: '🐝',
                    headline: 'Niedrige Bestäuberaktivität',
                    explanation: 'Der Pollinator Activity Index (PAI) ist 3 Tage in Folge unter 40 gefallen.',
                    action: 'Kürzlich verwendete Pflanzenschutzmittel prüfen',
                    expected_outcome: 'Schutz der lokalen Insektenpopulation und Sicherstellung der Bestäubung.'
                }
            ]);
            setLoadingRecs(false);
        }, 1000);
    }, []);

    const logCleaning = async () => {
        try {
            await fetch(`${CONFIG.API_BASE_URL}/api/farm/cleaning-log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ device_id: MOCK_DEVICE_ID })
            });
            setSoilingData({ ...soilingData, soilingLossPct: 0.1, annualEurLoss: 4, daysSinceLastClean: 0 });
            alert("Reinigung erfolgreich erfasst!");
        } catch (e) {
            console.error(e);
        }
    };

    const downloadComplianceReport = async () => {
        window.open(`${CONFIG.API_BASE_URL}/api/farm/compliance-report/${MOCK_DEVICE_ID}`, '_blank');
    };

    const latestPai = mockIndexData[mockIndexData.length - 1].pai;
    const paiColor = latestPai > 60 ? '#10b981' : latestPai > 30 ? '#f59e0b' : '#ef4444';

    return (
        <div className="min-h-screen bg-[#050a05] text-white pt-20 pb-24">
            <div className="container mx-auto px-4 max-w-7xl space-y-6">
                
                {/* 2A. Header Strip */}
                <div className="flex flex-wrap items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-4 md:p-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">{session.firstName}'s Farm</h1>
                        <div className="text-gray-400 text-sm flex gap-3 mt-1">
                            <span>Installation: 12.5 ha</span>
                            <span className="text-beetle-gold">• AgriSentinel Pro</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-gray-500">Last Sync</span>
                            <span className="text-gray-300">Just now</span>
                        </div>
                        <div className="flex gap-1 h-4 items-end" title="LoRa Signal: Excellent">
                            <div className="w-1.5 h-1/4 bg-green-500 rounded-sm"></div>
                            <div className="w-1.5 h-2/4 bg-green-500 rounded-sm"></div>
                            <div className="w-1.5 h-3/4 bg-green-500 rounded-sm"></div>
                            <div className="w-1.5 h-full bg-green-500 rounded-sm"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column (Main Dash) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* 2C. DIN 91434 Compliance Score */}
                        <div className="bg-black/60 border border-beetle-gold/30 rounded-2xl p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-50"></div>
                            <h2 className="text-xl font-bold mb-2">DIN 91434 Compliance Score</h2>
                            <p className="text-gray-400 text-sm mb-6">Current yield potential vs. open-field reference</p>
                            
                            <div className="flex justify-center items-center mb-6">
                                {/* Simplified Gauge for now */}
                                <div className="relative w-48 h-48 rounded-full border-8 border-green-500/20 flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle cx="96" cy="96" r="88" fill="none" stroke="#10b981" strokeWidth="16" strokeDasharray="552" strokeDashoffset="110" className="transition-all duration-1000" />
                                    </svg>
                                    <div className="text-center z-10">
                                        <span className="text-5xl font-black text-green-400">82%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">Based on 30-day average Leaf Area Index reading. This is a continuous estimate — not a legal declaration.</p>
                            
                            <button onClick={downloadComplianceReport} className="bg-beetle-gold/10 text-beetle-gold hover:bg-beetle-gold hover:text-black border border-beetle-gold/50 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mx-auto">
                                <Download size={18} /> Download compliance report (PDF)
                            </button>
                        </div>

                        {/* 2B. Four Index Cards */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* PAI */}
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold flex items-center gap-2"><Activity size={16} className="text-blue-400"/> Pollinator Activity (PAI)</h3>
                                    <span className="text-2xl font-black" style={{ color: paiColor }}>{latestPai}</span>
                                </div>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={mockIndexData}>
                                            <Line type="monotone" dataKey="pai" stroke={paiColor} strokeWidth={2} dot={false} />
                                            <ReferenceLine y={30} stroke="red" strokeDasharray="3 3" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* SHS */}
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold flex items-center gap-2"><Sprout size={16} className="text-green-400"/> Soil Health Score</h3>
                                    <div className="text-yellow-400 text-lg">★★★★☆</div>
                                </div>
                                <div className="space-y-3 mt-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Moisture Stability</span><span>85%</span></div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-400 w-[85%]"></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">pH Stability</span><span>92%</span></div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-purple-400 w-[92%]"></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">NPK Balance</span><span>78%</span></div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-green-400 w-[78%]"></div></div>
                                    </div>
                                </div>
                            </div>

                            {/* CFB */}
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold flex items-center gap-2"><Leaf size={16} className="text-emerald-400"/> Carbon Flux Balance</h3>
                                </div>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={mockIndexData.slice(-10)}>
                                            <Bar dataKey="carbon" fill="#10b981" radius={[2, 2, 0, 0]} />
                                            <ReferenceLine y={0} stroke="#666" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-xs text-gray-400 mt-2 text-center">Net sequestration: <span className="text-emerald-400 font-bold">1,240 kg CO₂</span> to date</div>
                            </div>

                            {/* MRI */}
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold flex items-center gap-2"><Thermometer size={16} className="text-red-400"/> Microclimate Resilience</h3>
                                </div>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={mockIndexData}>
                                            <Area type="monotone" dataKey="tempAmbient" stroke="#666" fill="transparent" />
                                            <Area type="monotone" dataKey="tempUnder" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="text-xs text-gray-400 mt-2 text-center">Heat protection: <span className="text-blue-400 font-bold">-2.5°C cooler</span> than open field</div>
                            </div>
                        </div>

                        {/* 2F. Biodiversity Timeline */}
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                            <h3 className="font-bold mb-4">Ecosystem Event Timeline (30 Days)</h3>
                            <div className="relative border-l-2 border-white/10 ml-3 space-y-6">
                                <div className="relative pl-6">
                                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1"></div>
                                    <p className="text-xs text-gray-500">2 days ago</p>
                                    <p className="text-sm">Active heat stress mitigation confirmed (>5°C diff)</p>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1"></div>
                                    <p className="text-xs text-gray-500">14 days ago</p>
                                    <p className="text-sm">Soil moisture stable after irrigation event</p>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[7px] top-1"></div>
                                    <p className="text-xs text-gray-500">28 days ago</p>
                                    <p className="text-sm">Pollinator stress event detected (PAI dropped >20%)</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* 2D. Panel Soiling Monitor */}
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                            <h3 className="font-bold flex items-center gap-2 mb-6"><Sun size={18} className="text-yellow-400"/> Panel Soiling Monitor</h3>
                            
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl font-black text-red-400">{soilingData.soilingLossPct}%</span>
                                <span className="text-sm text-gray-400 mb-1">efficiency loss</span>
                            </div>
                            
                            <div className="bg-red-900/20 border border-red-500/20 p-3 rounded-xl mb-6">
                                <span className="text-xs text-red-300 block">Est. Annual Economic Impact</span>
                                <span className="text-lg font-bold text-red-400">-€{soilingData.annualEurLoss}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                                <span>Days since clean:</span>
                                <span className="font-bold text-white">{soilingData.daysSinceLastClean} days</span>
                            </div>

                            <button onClick={logCleaning} className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2">
                                <Wrench size={16} /> Log cleaning event
                            </button>
                        </div>

                        {/* 2E. Recommendations Feed */}
                        <div className="bg-[#0a0f0a] border border-green-900/30 rounded-2xl p-6">
                            <h3 className="font-bold flex items-center gap-2 mb-4"><Leaf size={18} className="text-green-400"/> Agronomic Insights</h3>
                            
                            {loadingRecs ? (
                                <div className="text-center py-8 text-gray-500 animate-pulse">Analyzing sensor data...</div>
                            ) : (
                                <div className="space-y-4">
                                    {recommendations.map((rec, i) => (
                                        <div key={i} className="bg-black/50 border border-white/5 p-4 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <span className="text-xl">{rec.icon}</span>
                                                <div>
                                                    <h4 className="font-bold text-sm mb-1 text-white">{rec.headline}</h4>
                                                    <p className="text-xs text-gray-400 mb-3">{rec.explanation}</p>
                                                    <div className="bg-white/5 rounded p-2 text-xs mb-3">
                                                        <span className="text-gray-500 block mb-1">Expected Outcome:</span>
                                                        <span className="text-gray-300">{rec.expected_outcome}</span>
                                                    </div>
                                                    <button className="text-xs font-bold text-beetle-gold hover:text-white transition-colors">
                                                        Action: {rec.action} →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
