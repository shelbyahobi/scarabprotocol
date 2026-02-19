import { motion } from 'framer-motion';
import { Zap, Droplets, Sprout, Recycle, ShieldCheck, Activity, Scale, Info } from 'lucide-react';

export default function AssetClasses() {
    const classes = [
        {
            id: 'energy',
            title: "Energy Class",
            subtitle: "Proof of Clean Power",
            icon: <Zap className="w-8 h-8 text-beetle-gold" />,
            color: "border-beetle-gold/30 bg-beetle-gold/5",
            metric: "kWh Produced",
            examples: ["Solar", "Wind", "Biogas", "Batteries"]
        },
        {
            id: 'water',
            title: "Water Class",
            subtitle: "Proof of Security",
            icon: <Droplets className="w-8 h-8 text-blue-400" />,
            color: "border-blue-500/30 bg-blue-900/10",
            metric: "Liters Potable/Recycled",
            examples: ["Purification", "Greywater", "Desalination"]
        },
        {
            id: 'agri',
            title: "Agriculture Class",
            subtitle: "Proof of Efficiency",
            icon: <Sprout className="w-8 h-8 text-green-400" />,
            color: "border-green-500/30 bg-green-900/10",
            metric: "Kg Yield / Liter Water",
            examples: ["Hydroponics", "Soil Regen", "Vertical Farms"]
        },
        {
            id: 'waste',
            title: "Waste Class",
            subtitle: "Proof of Recovery",
            icon: <Recycle className="w-8 h-8 text-orange-400" />,
            color: "border-orange-500/30 bg-orange-900/10",
            metric: "Kg Processed / Upcycled",
            examples: ["Smart Compost", "Plastic Extrusion"]
        },
        {
            id: 'conservation',
            title: "Conservation Class",
            subtitle: "Proof of Savings",
            icon: <ShieldCheck className="w-8 h-8 text-teal-400" />,
            color: "border-teal-500/30 bg-teal-900/10",
            metric: "Liters/kWh Saved",
            examples: ["Leak Detection", "Smart Optimization"]
        }
    ];

    return (
        <section className="py-24 bg-[#080808] relative overflow-hidden">
             {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-beetle-green/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-beetle-gold font-bold uppercase tracking-widest text-sm mb-2 block">
                        The DePIN Ecosystem
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Supported <span className="text-white">Asset Classes</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        We don't just reward hardware; we reward <strong>measurable impact</strong>.
                        SCARAB validates five core categories of sustainable production.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {classes.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`rounded-2xl border ${item.color} p-6 relative group hover:-translate-y-2 transition-transform duration-300`}
                        >
                            <div className="mb-4 bg-black/40 w-16 h-16 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
                                {item.icon}
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-4 font-bold">{item.subtitle}</p>
                            
                            <div className="space-y-3">
                                <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Activity size={14} className="text-beetle-electric" />
                                        <span className="text-xs text-gray-500">Mining Metric</span>
                                    </div>
                                    <div className="text-white font-mono text-sm font-bold">{item.metric}</div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {item.examples.map((ex, idx) => (
                                        <span key={idx} className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded border border-white/5">
                                            {ex}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                {/* Hardware Context */}
                <div className="mt-16 text-center">
                   <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm text-gray-400">
                        <Scale size={16} className="text-beetle-green" />
                        <span>All assets validated by <strong>SCARAB Secure Nodes</strong> (ATECC608A)</span>
                   </div>
                </div>
            </div>
        </section>
    );
}
