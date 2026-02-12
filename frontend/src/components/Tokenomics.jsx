import { PieChart, TrendingUp, Users, Shield, Zap } from 'lucide-react';

export default function Tokenomics() {
    // Data for the chart
    const data = [
        { label: "Community / Fair Launch", value: 50, color: "bg-beetle-electric", desc: "Decentralized ownership" },
        { label: "Eco-Mining Rewards", value: 30, color: "bg-beetle-green", desc: "Physical Proof of Work" },
        { label: "Marketing & Partnerships", value: 10, color: "bg-beetle-gold", desc: "Global Awareness" },
        { label: "Team (Vested 24 Mo)", value: 10, color: "bg-gray-600", desc: "Long-term Alignment" },
    ];

    // CSS Conic Gradient for the Pie
    // 50% = 180deg
    // 30% = 108deg -> Starts at 180, Ends at 288
    // 10% = 36deg -> Starts at 288, Ends at 324
    // 10% = 36deg -> Starts at 324, Ends at 360
    const pieStyle = {
        background: `conic-gradient(
            #00f0ff 0deg 180deg, 
            #2ecc71 180deg 288deg, 
            #d4af37 288deg 324deg, 
            #4b5563 324deg 360deg
        )`
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-beetle-electric/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                        Token<span className="text-beetle-electric">omics</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Designed for scarcity and utility. 1,000,000,000 ROLL fixed supply, fueling the Ecoloop Network.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Visual Chart */}
                    <div className="relative flex justify-center">
                        <div className="w-80 h-80 rounded-full relative shadow-[0_0_50px_rgba(0,240,255,0.2)] hover:scale-105 transition-transform duration-500 ease-out" style={pieStyle}>
                            {/* Inner Circle for Donut Effect */}
                            <div className="absolute inset-4 bg-[#050a05] rounded-full flex flex-col items-center justify-center z-10">
                                <span className="text-4xl font-black text-white">1B</span>
                                <span className="text-sm text-gray-500 uppercase tracking-widest font-bold">Total Supply</span>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <div className="absolute top-0 right-0 animate-bounce delay-100 bg-black/80 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
                            <span className="text-beetle-electric font-bold">Deflationary</span>
                        </div>
                        <div className="absolute bottom-10 left-0 animate-bounce delay-300 bg-black/80 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
                            <span className="text-beetle-gold font-bold">No Minting</span>
                        </div>
                    </div>

                    {/* Legend / Details */}
                    <div className="space-y-6">
                        {data.map((item, index) => (
                            <div key={index} className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-beetle-electric/30 rounded-xl p-4 transition-all cursor-default">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${item.color} shadow-[0_0_10px_currentColor]`}></div>
                                        <h4 className="font-bold text-white text-lg">{item.label}</h4>
                                    </div>
                                    <span className="font-mono font-bold text-gray-300">{item.value}%</span>
                                </div>
                                <p className="text-sm text-gray-500 pl-7 group-hover:text-gray-300 transition-colors">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
