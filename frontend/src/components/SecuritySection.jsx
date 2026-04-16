import React from 'react';
import { ShieldCheck, Lock, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecuritySection() {
    return (
        <section className="py-24 bg-gradient-to-b from-black to-[#050a05] border-t border-white/5">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <span className="text-xs font-mono tracking-widest text-beetle-gold uppercase mb-4 block">V2 Architecture</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Institutional <span className="text-beetle-gold">Security</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Our decentralized physical infrastructure is protected by bank-grade cryptography and transparent on-chain governance.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* ATECC608A Integration */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0 }}
                        className="bg-black border border-white/10 rounded-3xl p-8 hover:border-beetle-gold/30 transition-colors"
                    >
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck size={28} className="text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">ATECC608A Integration</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Every hardware node contains a dedicated ATECC608A secure element that signs every telemetry payload at the source for absolute origin integrity.
                        </p>
                    </motion.div>

                    {/* Replay Protection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-black border border-white/10 rounded-3xl p-8 hover:border-beetle-electric/30 transition-colors"
                    >
                        <div className="w-14 h-14 bg-beetle-electric/10 rounded-2xl flex items-center justify-center mb-6">
                            <Lock size={28} className="text-beetle-electric" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Replay Protection</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Our protocol uses nonce-based replay protection to ensure that no historical data can be re-submitted or spoofed by attackers.
                        </p>
                    </motion.div>

                    {/* 30-Day Timelock */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-black border border-white/10 rounded-3xl p-8 hover:border-red-500/30 transition-colors"
                    >
                        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                            <Clock size={28} className="text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">30-Day Timelock</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            All changes to revenue routing and treasury distribution are protected by a 30-day on-chain timelock, providing a massive safety window for the community.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
