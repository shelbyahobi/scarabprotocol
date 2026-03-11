import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Shield, Globe, Cpu, RefreshCw, BarChart, CheckCircle, Gift, Lock, Wallet, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import Navbar from './Navbar';
import { CONFIG } from '../config';

const HARDWARE_PREORDER_ABI = [
    { "inputs": [{ "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "preorderBokashiHome", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "preorderBokashiPro", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "preorderSolar", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

const USDC_ABI = [
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }
];

export default function ProductsPage() {
    const { address, isConnected } = useAccount();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [preorderStep, setPreorderStep] = useState('shipping'); // 'shipping' | 'approve' | 'confirm'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({ name: '', address: '', email: '' });

    const { writeContractAsync } = useWriteContract();

    const openPreorderModal = (product) => {
        if (!isConnected) {
            alert("Connect wallet to access Phase 1 Hardware Preorders.");
            return;
        }
        setSelectedProduct(product);
        setPreorderStep('shipping');
    };

    const handlePreorderApprove = async () => {
        setIsSubmitting(true);
        try {
            const amount = parseUnits(selectedProduct.depositAmount.toString(), 6); // USDC 6 decimals
            await writeContractAsync({
                address: CONFIG.MOCK_USDC_ADDRESS,
                abi: USDC_ABI,
                functionName: 'approve',
                args: [CONFIG.HARDWARE_PREORDER_ADDRESS, amount],
            });
            setPreorderStep('confirm');
        } catch (error) {
            console.error("Approval failed", error);
            alert(`Approval failed: ${error.shortMessage || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreorderConfirm = async () => {
        setIsSubmitting(true);
        try {
            let fnCall = "preorderSolar";
            if (selectedProduct.id === 'bokashi_home') fnCall = "preorderBokashiHome";
            if (selectedProduct.id === 'bokashi_pro') fnCall = "preorderBokashiPro";

            await writeContractAsync({
                address: CONFIG.HARDWARE_PREORDER_ADDRESS,
                abi: HARDWARE_PREORDER_ABI,
                functionName: fnCall,
                args: [1n],
            });
            alert(`✅ Pre-order confirmed! Physical goods delivery to: ${shippingDetails.address}`);
            setSelectedProduct(null);
        } catch (error) {
            console.error("Preorder failed", error);
            alert(`Execution failed: ${error.shortMessage || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050B08] text-[#E8E8E8] font-sans selection:bg-beetle-electric selection:text-black">
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden bg-black/40 border-b border-white/5">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter"
                    >
                        Infrastructure <span className="text-beetle-gold">V1</span>
                    </motion.h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                        Phase 1 R&D hardware allocation. Zero-margin manufacturing for early protocol stakeholders.
                        <span className="text-white block mt-4 font-bold border border-beetle-gold/20 inline-block px-4 py-1 rounded-full text-sm bg-beetle-gold/10">
                            🛡️ Fully Refundable Deposits until Manufacturing Locks
                        </span>
                    </p>
                </div>
            </section>

            {/* Product 1: Solar Sentinel */}
            <section className="py-24 border-b border-white/5">
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
                                Secure a spot today to be among the <span className="text-white italic">First Generation Miners</span>.
                            </p>
                            <ul className="space-y-4 mb-10">
                                <FeatureItem text="ATECC608A Cryptographic Co-processor" />
                                <FeatureItem text="LoRaWAN Dual-Stack connectivity for Remote Sites" />
                                <FeatureItem text="Priority Batch Allocation (Guaranteed Delivery)" />
                                <FeatureItem text="100% USDT/USDC Deposit Managed by Multisig" />
                            </ul>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-black text-white font-mono">$349 <span className="text-sm text-gray-500 font-normal">MSRP</span></div>
                                <button
                                    onClick={() => openPreorderModal({ id: 'solar', name: 'Solar Sentinel V1', depositAmount: 100, depositCurrency: 'USDC' })}
                                    className="bg-beetle-electric text-black px-10 py-4 rounded-xl font-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                                >
                                    Pre-Order Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product 2: Bokashi Kit */}
            <section className="py-24 bg-[#0A0F0C] border-b border-white/5">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <span className="text-xs font-mono text-beetle-green uppercase tracking-widest mb-4 block">Regenerative Mining</span>
                            <h2 className="text-4xl font-black text-white mb-6">Smart Bokashi Pro</h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Advanced anaerobic fermentation tracking. Our industrial-grade extraction units enable large-scale soil regeneration while generating significant $SCARAB rewards for physical sequestration.
                            </p>
                            <ul className="space-y-4 mb-10">
                                <FeatureItem text="Precision Weight & Bio-gas Telemetry" />
                                <FeatureItem text="Early Stakeholder Exclusive Pricing" />
                                <FeatureItem text="Guaranteed Spot in Phase 1 Rollout" />
                                <FeatureItem text="Multisig-Protected Escrow Deposit" />
                            </ul>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-black text-white font-mono">$499 <span className="text-sm text-gray-500 font-normal">MSRP</span></div>
                                <button
                                    onClick={() => openPreorderModal({ id: 'bokashi_pro', name: 'Smart Bokashi Pro', depositAmount: 50, depositCurrency: 'USDC' })}
                                    className="bg-beetle-green text-black px-10 py-4 rounded-xl font-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                                >
                                    Pre-Order Now
                                </button>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 relative group">
                            <div className="absolute inset-0 bg-beetle-green/20 rounded-3xl blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="bg-black border border-beetle-green/30 rounded-3xl p-12 aspect-square flex items-center justify-center relative overflow-hidden">
                                <RefreshCw size={200} className="text-beetle-green opacity-20 absolute -bottom-10 -right-10 -rotate-12" />
                                <div className="text-center z-10">
                                    <Globe size={80} className="text-beetle-green mx-auto mb-6" />
                                    <h3 className="text-3xl font-black text-white">Smart Bokashi Pro</h3>
                                    <p className="text-beetle-green font-mono text-sm mt-2">Extraction Node V1</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Preorder Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedProduct(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0a1a0f] border border-beetle-gold/50 p-8 rounded-3xl max-w-lg w-full relative shadow-[0_0_100px_rgba(212,175,55,0.2)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>

                            <h3 className="text-3xl font-black text-white mb-2 tracking-tighter text-center">{selectedProduct.name} Pre-order</h3>

                            {/* Steps */}
                            <div className="flex justify-center gap-4 mb-10 text-[10px] font-black uppercase tracking-widest">
                                <span className={preorderStep === 'shipping' ? 'text-beetle-gold' : 'text-gray-600'}>1. Logistics</span>
                                <span className="text-white/10">/</span>
                                <span className={preorderStep === 'approve' ? 'text-beetle-gold' : 'text-gray-600'}>2. Approve</span>
                                <span className="text-white/10">/</span>
                                <span className={preorderStep === 'confirm' ? 'text-beetle-gold' : 'text-gray-600'}>3. Deposit</span>
                            </div>

                            {preorderStep === 'shipping' && (
                                <div className="space-y-4">
                                    <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
                                        Enter your delivery details. This allows our logistics team to calculate final duties and regional certifications.
                                    </p>
                                    <input type="text" placeholder="Full Name" className="bg-black/50 border border-white/10 rounded-xl p-4 text-white w-full" value={shippingDetails.name} onChange={e => setShippingDetails({ ...shippingDetails, name: e.target.value })} />
                                    <input type="email" placeholder="Email Address" className="bg-black/50 border border-white/10 rounded-xl p-4 text-white w-full" value={shippingDetails.email} onChange={e => setShippingDetails({ ...shippingDetails, email: e.target.value })} />
                                    <textarea placeholder="Physical Delivery Address (Site Location)" className="bg-black/50 border border-white/10 rounded-xl p-4 text-white w-full h-24" value={shippingDetails.address} onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })} />

                                    <button
                                        disabled={!shippingDetails.name || !shippingDetails.address}
                                        onClick={() => setPreorderStep('approve')}
                                        className="w-full bg-beetle-gold text-black font-black py-4 rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:grayscale mt-4 flex items-center justify-center gap-2"
                                    >
                                        Next: Setup Escrow <ArrowRight size={20} />
                                    </button>
                                </div>
                            )}

                            {preorderStep === 'approve' && (
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-beetle-gold/10 border border-beetle-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <Lock className="text-beetle-gold" size={40} />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-4">Allowance Required</h4>
                                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                        Grant the Scarab multisig-controlled contract permission to spend {selectedProduct.depositAmount} {selectedProduct.depositCurrency}.
                                        You are paying <span className="text-white font-bold italic">direct manufacturing cost</span>.
                                    </p>
                                    <button
                                        onClick={handlePreorderApprove}
                                        disabled={isSubmitting}
                                        className="w-full bg-beetle-gold text-black font-black py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                                    >
                                        {isSubmitting ? 'Verifying Wallet...' : `Approve ${selectedProduct.depositAmount} ${selectedProduct.depositCurrency}`}
                                    </button>
                                </div>
                            )}

                            {preorderStep === 'confirm' && (
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <ShieldCheck className="text-green-500" size={40} />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-4">Escrow Deposit Ready</h4>
                                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                        Your deposit will be held in the Hardware Escrow contract. You can claim a full refund until manufacturing begins (DAO verified lock).
                                    </p>
                                    <button
                                        onClick={handlePreorderConfirm}
                                        disabled={isSubmitting}
                                        className="w-full bg-beetle-green text-black font-black py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                                    >
                                        {isSubmitting ? 'Confirming Transaction...' : 'Confirm Pre-Order Deposit'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Verification Infrastructure */}
            <section className="py-24 bg-black border-t border-white/5">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-4xl font-black text-white mb-12">The DePIN Security Standard</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <SecurityPulse title="PoPA Protocol" desc="Proof of Physical Activity ensures rewards are only minted for real-world environmental displacement." />
                        <SecurityPulse title="HSM Signing" desc="Every node contains an industrial secure element, preventing 99% of spoofing attempts common in DePIN." />
                        <SecurityPulse title="Multisig Controlled" desc="All pre-order funds are held in a Gnosis Safe multisig (4/7) until manufacturing batches are locked." />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureItem({ text }) {
    return (
        <li className="flex items-center gap-3 text-gray-300">
            <CheckCircle className="text-beetle-gold font-bold" size={18} />
            <span className="text-sm font-medium">{text}</span>
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
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
