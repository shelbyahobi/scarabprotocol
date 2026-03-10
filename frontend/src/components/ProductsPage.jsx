import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Zap, Shield, Globe, Cpu, RefreshCw, BarChart, CheckCircle } from 'lucide-react';
import Navbar from './Navbar';

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-[#050B08] text-[#E8E8E8] font-sans selection:bg-beetle-electric selection:text-black">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter"
                    >
                        The <span className="text-beetle-electric">Hardware Layer</span>
                    </motion.h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        High-fidelity environmental sensors and regenerative infrastructure secured by cryptographic hardware.
                    </p>
                </div>
            </section>

            {/* Product 1: Solar Sentinel */}
            <section className="py-24 border-t border-white/5">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-beetle-electric/20 rounded-3xl blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="bg-black border border-beetle-electric/30 rounded-3xl p-12 aspect-square flex items-center justify-center relative overflow-hidden">
                                <Rocket size={200} className="text-beetle-electric opacity-20 absolute -bottom-10 -right-10 rotate-12" />
                                <div className="text-center z-10">
                                    <Zap size={80} className="text-beetle-electric mx-auto mb-6" />
                                    <h3 className="text-3xl font-black text-white">Solar Sentinel V1</h3>
                                    <p className="text-beetle-electric font-mono text-sm mt-2">Embedded DePIN Module</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-mono text-beetle-electric uppercase tracking-widest mb-4 block">Core Node Class</span>
                            <h2 className="text-4xl font-black text-white mb-6">Real-Time Solar Nowcasting</h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Much more than a smart meter. The Solar Sentinel utilizes advanced irradiance sensors and edge computing to verify 15-minute generation windows for energy traders.
                                Every packet is signed by an ATECC608A Secure Element.
                            </p>
                            <ul className="space-y-4 mb-10">
                                <FeatureItem text="Integrated Pyranometer (±3% Accuracy)" />
                                <FeatureItem text="ATECC608A Cryptographic Co-processor" />
                                <FeatureItem text="WiFi / LoRaWAN Dual-Stack Connectivity" />
                                <FeatureItem text="High-Efficiency Power Over Ethernet (PoE)" />
                            </ul>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-black text-white font-mono">$349 <span className="text-sm text-gray-500 font-normal">MSRP</span></div>
                                <button className="bg-beetle-electric text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all">Pre-Order Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product 2: Bokashi Kit */}
            <section className="py-24 bg-[#0A0F0C] border-y border-white/5">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <span className="text-xs font-mono text-beetle-green uppercase tracking-widest mb-4 block">Regenerative Mining</span>
                            <h2 className="text-4xl font-black text-white mb-6">Smart Bokashi Composting</h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Transform kitchen waste into high-quality soil amendment while earning $SCARAB. Our smart bucket tracks lid openings,
                                fill levels, and fermentation quality via integrated bio-gas and weight sensors.
                            </p>
                            <ul className="space-y-4 mb-10">
                                <FeatureItem text="Precision Weight & Gaseous Sensors" />
                                <FeatureItem text="QR-Linked Bran Verification System" />
                                <FeatureItem text="Methane Mitigation Tracking (Verified BRU)" />
                                <FeatureItem text="Local Fertility Handshake Integration" />
                            </ul>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-black text-white font-mono">$89 <span className="text-sm text-gray-500 font-normal">Starter Kit</span></div>
                                <button className="bg-beetle-green text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all">Join Waitlist</button>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 relative group">
                            <div className="absolute inset-0 bg-beetle-green/20 rounded-3xl blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="bg-black border border-beetle-green/30 rounded-3xl p-12 aspect-square flex items-center justify-center relative overflow-hidden">
                                <RefreshCw size={200} className="text-beetle-green opacity-20 absolute -bottom-10 -right-10 -rotate-12" />
                                <div className="text-center z-10">
                                    <Globe size={80} className="text-beetle-green mx-auto mb-6" />
                                    <h3 className="text-3xl font-black text-white">Smart Bokashi V1</h3>
                                    <p className="text-beetle-green font-mono text-sm mt-2">Home Extraction Unit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Verification Infrastructure */}
            <section className="py-24 bg-black">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-4xl font-black text-white mb-12">The DePIN Security Standard</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <SecurityPulse title="PoPA Protocol" desc="Proof of Physical Activity ensures rewards are only minted for real-world environmental displacement." />
                        <SecurityPulse title="HSM Signing" desc="Every node contains an industrial secure element, preventing 99% of spoofing attempts common in DePIN." />
                        <SecurityPulse title="Circuit Breakers" desc="Programmable production caps at the smart contract level prevent oracle attack inflation." />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureItem({ text }) {
    return (
        <li className="flex items-center gap-3 text-gray-300">
            <CheckCircle className="text-beetle-electric" size={18} />
            <span>{text}</span>
        </li>
    );
}

function SecurityPulse({ title, desc }) {
    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="w-10 h-10 bg-beetle-electric/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-beetle-electric" size={20} />
            </div>
            <h4 className="text-white font-bold mb-2">{title}</h4>
            <p className="text-gray-500 text-sm">{desc}</p>
        </div>
    );
}
