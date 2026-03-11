import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { Zap, CheckCircle, AlertTriangle, Star, Info, ArrowRight, Package, Shield, Clock, X, Loader } from 'lucide-react';
import Navbar from './Navbar';
import { CONFIG } from '../config';

// ABIs
const HARDWARE_PREORDER_ABI = [
    { "inputs": [{ "internalType": "string", "name": "productId", "type": "string" }], "name": "getPreorderProgress", "outputs": [{ "internalType": "uint256", "name": "current", "type": "uint256" }, { "internalType": "uint256", "name": "threshold", "type": "uint256" }, { "internalType": "bool", "name": "started", "type": "bool" }], "stateMutability": "view", "type": "function" }
];

const ERC20_ABI = [
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

export default function ProductsPage() {
    const { address, isConnected } = useAccount();
    const [preorderStep, setPreorderStep] = useState(0); // 0=info, 1=logistics, 2=approval, 3=deposit
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Check holder status (≥1000 SCARAB)
    const { data: scarabBalance } = useReadContract({
        address: CONFIG.ROLL_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
        query: {
            enabled: isConnected && !!address
        }
    });

    const isHolder = scarabBalance && scarabBalance >= parseUnits('1000', 18);

    // Get preorder progress
    const { data: progressData } = useReadContract({
        address: CONFIG.HARDWARE_PREORDER_ADDRESS,
        abi: HARDWARE_PREORDER_ABI,
        functionName: 'getPreorderProgress',
        args: ['SOLAR_SENTINEL_V1'],
        query: {
            refetchInterval: 10000
        }
    });

    const [currentPreorders, threshold, manufacturingStarted] = progressData || [127n, 500n, false];

    return (
        <div className="min-h-screen bg-[#050B08] text-[#E8E8E8] font-sans selection:bg-beetle-electric selection:text-black">
            <Navbar isLanding={false} />

            <div className="pt-32 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-beetle-electric/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">

                    {/* Hero */}
                    <div className="text-center mb-20">
                        <span className="text-beetle-electric text-xs font-bold uppercase tracking-[0.4em] mb-4 block">
                            Core Node Class
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tighter">
                            Real-Time Solar<br /><span className="text-beetle-electric italic">Nowcasting</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            Much more than a smart meter. The Solar Sentinel utilizes advanced irradiance
                            sensors and edge computing to verify 15-minute generation windows for energy
                            traders. Every packet is signed by an <span className="text-white font-bold">ATECC608A Secure Element</span>.
                        </p>
                    </div>

                    {/* Product Grid */}
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">

                        {/* Left: Visual Block */}
                        <div className="bg-black/50 border border-white/10 rounded-[2.5rem] p-16 flex flex-col items-center justify-center relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-beetle-electric/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity"></div>

                            <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                                <div className="w-48 h-48 bg-black border border-beetle-electric/30 rounded-full flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(0,240,255,0.25)]">
                                    <Zap size={100} className="text-beetle-electric animate-pulse" />
                                </div>
                                <h2 className="text-4xl font-black text-white mb-3 text-center tracking-tight">
                                    Solar Sentinel V1
                                </h2>
                                <p className="text-beetle-electric text-sm font-mono text-center tracking-widest uppercase opacity-70">
                                    Embedded DePIN Module
                                </p>
                            </div>

                            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/10 rounded-tr-xl"></div>
                            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/10 rounded-bl-xl"></div>
                        </div>

                        {/* Right: Specs & CTA */}
                        <div className="space-y-8">

                            {/* Features Component */}
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 space-y-5">
                                <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                                    <Shield size={20} className="text-beetle-electric" /> Hardware Specs
                                </h3>
                                <FeatureItem text="Integrated Pyranometer (±3% Accuracy)" />
                                <FeatureItem text="ATECC608A Cryptographic Co-processor" />
                                <FeatureItem text="WiFi / LoRaWAN Dual-Stack Connectivity" />
                                <FeatureItem text="High-Efficiency Power Over Ethernet (PoE)" />
                            </div>

                            {/* Milestone Tracker */}
                            <div className="bg-[#0A1A0F]/80 border border-beetle-electric/30 rounded-[2rem] p-8 shadow-[0_0_40px_rgba(0,240,255,0.05)]">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <Package className="text-beetle-electric" size={20} />
                                        <span className="text-white font-black text-sm uppercase tracking-wider">Manufacturing Progress</span>
                                    </div>
                                    <span className="text-beetle-electric font-mono text-2xl font-black">
                                        {Number(currentPreorders)}/{Number(threshold)}
                                    </span>
                                </div>

                                <div className="w-full bg-black/60 rounded-full h-4 mb-3 p-1 border border-white/5">
                                    <div
                                        className="bg-gradient-to-r from-beetle-electric via-beetle-green to-beetle-gold h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                                        style={{ width: `${Math.min((Number(currentPreorders) / Number(threshold)) * 100, 100)}%` }}
                                    />
                                </div>

                                <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
                                    <span className="text-gray-500">Waitlist Active</span>
                                    {manufacturingStarted ? (
                                        <span className="text-beetle-gold animate-pulse">✓ Production Locked</span>
                                    ) : (
                                        <span className="text-beetle-electric">{Number(threshold) - Number(currentPreorders)} Units to Batch Lock</span>
                                    )}
                                </div>
                            </div>

                            {/* Pricing Card */}
                            <div className="bg-gradient-to-b from-white/10 to-black/40 border border-white/10 rounded-[2rem] p-10 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-beetle-electric/10 blur-[60px] rounded-full"></div>

                                <div className="flex items-baseline gap-4 mb-8">
                                    <span className="text-7xl font-black text-white tracking-tighter">$349</span>
                                    <span className="text-gray-500 text-sm font-black uppercase tracking-widest border-l border-white/10 pl-4 h-6 flex items-center">MSRP</span>
                                </div>

                                <div className="bg-black/60 border border-white/10 rounded-2xl p-6 mb-6">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Phase 1 Deposit Structure</p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Security Deposit (Now)</span>
                                            <span className="text-white font-black text-lg font-mono">$50.00 <span className="text-gray-500 text-xs">USDC</span></span>
                                        </div>
                                        <div className="flex justify-between text-sm opacity-60">
                                            <span className="text-gray-400">Balance Due at Ship</span>
                                            <span className="text-white font-bold font-mono">$299.00</span>
                                        </div>
                                    </div>
                                </div>

                                {isHolder && (
                                    <div className="bg-beetle-gold/10 border border-beetle-gold/40 rounded-2xl p-6 mb-8 relative group">
                                        <div className="absolute -top-3 right-4 bg-beetle-gold text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg">HOLDER ACTIVE</div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-beetle-gold/20 rounded-xl flex items-center justify-center border border-beetle-gold/30">
                                                <Star className="text-beetle-gold fill-beetle-gold" size={24} />
                                            </div>
                                            <div>
                                                <div className="text-beetle-gold font-black text-xl tracking-tight italic">Stakeholder Pricing</div>
                                                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">10% Rebate applied on-chain</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end border-t border-beetle-gold/10 pt-4 mt-2">
                                            <span className="text-gray-400 text-xs">Your Effective Price</span>
                                            <span className="text-3xl font-black text-white">$314 <span className="text-gray-500 text-xs">-10%</span></span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => {
                                        if (isConnected) setPreorderStep(1);
                                        else alert("Please connect your wallet to access pre-orders.");
                                    }}
                                    disabled={manufacturingStarted}
                                    className="w-full bg-beetle-electric hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] text-black font-black py-5 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4 text-lg active:scale-95"
                                >
                                    Pre-Order Now
                                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="mt-8 flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                        <Clock size={14} className="text-beetle-electric" />
                                        Est. Dispatch: <span className="text-white">Q3 2026</span>
                                    </div>
                                    <p className="text-[10px] text-gray-600 font-mono text-center">
                                        BATCH 01 · MVP R&D ALLOCATION · DEPIN COMPLIANT
                                    </p>
                                </div>
                            </div>

                            <LegalDisclaimers />

                        </div>
                    </div>

                </div>
            </div>

            {/* Preorder Modal Placeholder */}
            {preorderStep > 0 && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0A1A0F] border border-white/10 rounded-3xl max-w-lg w-full p-12 text-center">
                        <X className="absolute top-6 right-6 text-gray-500 cursor-pointer hover:text-white" onClick={() => setPreorderStep(0)} />
                        <Loader className="w-12 h-12 text-beetle-electric animate-spin mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-white mb-4">Initializing Secure Checkout</h3>
                        <p className="text-gray-400">Verifying on-chain logistics and stakeholder eligibility...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function FeatureItem({ text }) {
    return (
        <div className="flex items-center gap-4 text-gray-400 group">
            <div className="h-6 w-6 rounded-full bg-beetle-electric/5 border border-beetle-electric/20 flex items-center justify-center overflow-hidden">
                <CheckCircle className="text-beetle-electric transform group-hover:scale-110 transition-transform" size={14} />
            </div>
            <span className="text-sm font-medium group-hover:text-white transition-colors">{text}</span>
        </div>
    );
}

function LegalDisclaimers() {
    return (
        <div className="bg-red-500/5 border border-red-500/10 rounded-[2rem] p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <AlertTriangle size={80} className="text-red-500" />
            </div>
            <h4 className="text-red-400 font-black text-sm uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <AlertTriangle size={16} /> Regulatory & Risk Disclaimers
            </h4>
            <div className="space-y-5 text-[11px] leading-relaxed text-gray-500 font-medium">
                <div>
                    <span className="text-gray-300 font-bold uppercase block mb-1">Refund Policy</span>
                    Deposits are 100% refundable until the manufacturing batch is locked (threshold reached). Once batch manufacturing begins, all deposits are converted into binding production orders and are non-refundable.
                </div>
                <div>
                    <span className="text-gray-300 font-bold uppercase block mb-1">Shipping Risks</span>
                    Timeline estimates are subject to global semiconductor supply chain fluctuations. Final shipping duties and regional taxes will be calculated at time of fulfillment.
                </div>
                <div>
                    <span className="text-gray-300 font-bold uppercase block mb-1">Protocol Compliance</span>
                    Hardware ownership does not guarantee financial returns. Reward rates ($SCARAB) are governed by the DAO Emission Controller and are subject to network performance.
                </div>
            </div>
        </div>
    );
}

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
