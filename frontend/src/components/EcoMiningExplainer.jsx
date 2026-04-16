import { motion } from 'framer-motion';

import { Zap, Server, Database, ArrowRight, Recycle, Sun, Wifi, Shield, Lock, Activity } from 'lucide-react';

export default function EcoMiningExplainer() {
    const steps = [
        {
            icon: <Recycle size={32} className="text-green-400" />,
            title: "1. The Hardware",
            desc: "Partners (Solar, Hydro, Filters) embed the SCARAB Secure Node into their devices at the factory.",
            color: "border-green-500/30 bg-green-900/10"
        },
        {
            icon: <Shield size={32} className="text-beetle-gold" />,
            title: "2. The Signature",
            desc: "The ATECC608A Secure Element cryptographically signs production data locally on the device.",
            color: "border-beetle-gold/30 bg-yellow-900/10"
        },
        {
            icon: <Server size={32} className="text-beetle-electric" />,
            title: "3. The Verification",
            desc: "Our SQS fan-out architecture verifies the signature validity before passing it on-chain.",
            color: "border-beetle-electric/30 bg-blue-900/10"
        },
        {
            icon: <Zap size={32} className="text-white bg-beetle-gold rounded-full p-1 text-black" />,
            title: "4. The Reward",
            desc: "Smart Contracts release SCARAB tokens from the Regeneration Pool proportional to the verified 'Sustainability Yield'.",
            color: "border-white/20 bg-white/5"
        }
    ];

    return (
        <section className="py-24 bg-[#050a05] relative overflow-hidden">
            {/* Background Tech Mesh */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">

                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-beetle-green/10 border border-beetle-green/30 text-beetle-green text-sm font-bold mb-6">
                        <Sun size={14} /> The 30% Eco-Mining Allocation
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Proof of <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-beetle-gold">Sustainability</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        We don't manufacture everything. We <strong className="text-white">empower</strong> everything.
                        <br />
                        Our "Embedded Nodes" turn any sustainable hardware into a revenue-generating asset.
                        <span className="block mt-2 text-beetle-gold">
                            Real World Assets (RWA) + DePIN Infrastructure.
                        </span>
                    </p>
                </div>

                {/* The Process Flow */}
                <div className="grid md:grid-cols-4 gap-6 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-green-500/20 via-beetle-gold/20 to-beetle-electric/20 z-0"></div>

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className={`relative z-10 flex flex-col items-center text-center`}
                        >
                            <div className={`w-24 h-24 rounded-2xl border ${step.color} backdrop-blur-md flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.3)]`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed px-2">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Hardware Teaser */}
                <div className="mt-24 bg-gradient-to-r from-beetle-gold/10 to-transparent border border-beetle-gold/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h3 className="text-3xl font-black text-white mb-4">The <span className="text-beetle-gold">Secure Element</span></h3>
                        <p className="text-gray-400 mb-6 text-lg">
                            To ensure institutional-grade integrity, we use the <strong>ATECC608A</strong> cryptographic chip.
                            This prevents data spoofing and ensures that every token minted corresponds to real environmental work.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-3 text-gray-300">
                                <Lock size={18} className="text-beetle-gold" /> Hardware-level Private Key Storage
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Activity size={18} className="text-beetle-electric" /> Anti-Tamper Output Verification
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Wifi size={18} className="text-white" /> Low-Bandwidth IoT Connectivity
                            </li>
                        </ul>
                    </div>
                    <div className="flex-1 relative">
                        {/* Placeholder for Hardware Image */}
                        <div className="relative z-10 bg-black border border-white/10 rounded-2xl p-6 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500">
                            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-beetle-gold/5 animate-pulse"></div>
                                {/* Abstract Chip Visual */}
                                <div className="w-32 h-32 border-2 border-beetle-gold rounded-md flex items-center justify-center relative">
                                    <div className="absolute top-0 left-0 w-2 h-2 bg-beetle-gold"></div>
                                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-beetle-gold"></div>
                                    <Zap size={48} className="text-beetle-gold animate-pulse" />
                                    <div className="absolute -bottom-8 text-xs font-mono text-beetle-gold">ATECC608A</div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="font-mono text-beetle-gold font-bold">SCARAB Embedded V1</span>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">R&D Active</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
