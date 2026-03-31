import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Cpu, Network, ArrowRight } from 'lucide-react';

export default function QuantumResistance() {
    return (
        <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black z-0"></div>
            <div className="absolute top-[10%] left-[-5%] w-[300px] h-[300px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-12 text-center md:text-left">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-6 uppercase tracking-widest"
                        >
                            <Cpu size={14} /> Future-Proof Architecture
                        </motion.div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                            Prepared for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Post-Quantum</span> Era
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Unlike traditional blockchains crippled by legacy cryptography, SCARAB Protocol is engineered dynamically to survive Shor's Algorithm and the inevitable quantum computing cryptographic threat.
                        </p>
                    </div>

                    {/* Threat & Defense Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* The Threat Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-red-500/20 rounded-2xl p-8 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <ShieldAlert className="w-10 h-10 text-red-400 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">The Vulnerability</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Most of Web3 relies on ECDSA (Elliptic Curve Cryptography) to secure wallets and hardware. Within 10-15 years, a million-qubit quantum computer could derive private keys from public keys entirely, rendering the global crypto industry vulnerable.
                            </p>
                        </motion.div>

                        {/* Our Defense Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-blue-500/20 rounded-2xl p-8 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <Network className="w-10 h-10 text-blue-400 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Our 100% Upgradeable Solution</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                SCARAB utilizes <strong className="text-white">UUPS Smart Contract Proxies</strong> enabling seamless migration of on-chain logic to NIST-approved Post-Quantum algorithms (e.g., CRYSTALS-Dilithium) without requiring consensus forks. Our hardware supports <strong className="text-white">OTA Firmware Flashing</strong>, bringing quantum resistance directly to the edge.
                            </p>
                        </motion.div>
                    </div>

                    {/* Migration Timeline */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-black border border-white/10 rounded-2xl p-8"
                    >
                        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            Migration Roadmap <ArrowRight className="w-4 h-4 text-gray-500" />
                        </h4>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                <div>
                                    <h5 className="text-sm font-bold text-gray-200">Phase 1: Safe Era (2026-2030)</h5>
                                    <p className="text-xs text-gray-500 mt-1">Quantum computing power remains insufficient. Continued use of gas-efficient ECDSA.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                <div>
                                    <h5 className="text-sm font-bold text-gray-200">Phase 2: Hybrid Transition (2030-2035)</h5>
                                    <p className="text-xs text-gray-500 mt-1">NIST Post-Quantum standards deployed to UUPS contracts. Hardware operates dual-signature telemetry.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 shrink-0"></div>
                                <div>
                                    <h5 className="text-sm font-bold text-gray-200">Phase 3: Quantum Limit (2035+)</h5>
                                    <p className="text-xs text-gray-500 mt-1">Full deprecation of ECDSA. Only quantum-safe algorithms accepted by the protocol.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
