import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, CheckCircle, AlertTriangle, Star, Info, ArrowRight, Package,
    Shield, Clock, X, Loader, Rocket, Globe, Cpu, RefreshCw,
    BarChart, Gift, Lock, Wallet, ShieldCheck
} from 'lucide-react';
import Navbar from './Navbar';
import { CONFIG } from '../config';

// ABIs
const HARDWARE_PREORDER_ABI = [
    { "inputs": [{ "internalType": "string", "name": "productId", "type": "string" }], "name": "getPreorderProgress", "outputs": [{ "internalType": "uint256", "name": "current", "type": "uint256" }, { "internalType": "uint256", "name": "threshold", "type": "uint256" }, { "internalType": "bool", "name": "started", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "preorderBokashiHome", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "preorderBokashiPro", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "preorderSolar", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

const ERC20_ABI = [
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }
];

export default function ProductsPage() {
    const { address, isConnected } = useAccount();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [preorderStep, setPreorderStep] = useState('none'); // 'none' | 'shipping' | 'approve' | 'confirm'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({ name: '', address: '', email: '' });
    const [agreedToTerms, setAgreedToTerms] = useState(false);

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

    const isHolder = scarabBalance ? BigInt(scarabBalance) >= 1000n * 10n ** 18n : false;

    const { writeContractAsync } = useWriteContract();

    // Hardware Data
    const products = [
        {
            id: 'solar',
            name: "Solar Sentinel Node (v1)",
            description: "The pillar of decentralized energy. Measures, signs, and rewards energy production at the source.",
            depositAmount: 50,
            depositCurrency: "USDC",
            retailPrice: 349,
            image: "☀️",
            features: ["ATECC608A Cryptography", "Real-time Power Telemetry", "DAO Governance Rights"],
            milestone: { current: 42, target: 100, label: "Batch 01" }
        },
        {
            id: 'bokashi_home',
            name: "Home Bioreactor",
            description: "Consumer-grade smart Bokashi bin. Cryptographically verifies official SCARAB bran to unlock token emissions.",
            depositAmount: 50,
            depositCurrency: "USDC",
            retailPrice: 289,
            image: "♻️",
            features: ["NFC/SD Card Bran Auth", "Weight & Temp Telemetry", "Stainless Steel Dual-Bucket"],
            milestone: { current: 12, target: 50, label: "Beta Tester Batch" }
        },
        {
            id: 'bokashi_pro',
            name: "Pro Bioreactor",
            description: "High-precision commercial waste transformation. 200L capacity with industrial validation for Canteens/Restaurants.",
            depositAmount: 500,
            depositCurrency: "USDC",
            retailPrice: 4995,
            image: "🏭",
            features: ["Cellular (LTE) Backhaul", "4x Industrial Load Cells", "Motorized Auger Mixing"],
            milestone: { current: 4, target: 20, label: "Institutional Pilot" }
        }
    ];

    const openPreorderModal = (product) => {
        if (!isConnected) {
            alert("Connect wallet to access Phase 1 Hardware Preorders.");
            return;
        }
        setSelectedProduct(product);
        setPreorderStep('shipping');
        setAgreedToTerms(false); // Reset terms agreement
    };

    const handlePreorderApprove = async () => {
        setIsSubmitting(true);
        try {
            const amount = parseUnits(selectedProduct.depositAmount.toString(), 18); // USDC mock uses 18
            const txHash = await writeContractAsync({
                address: CONFIG.MOCK_USDC_ADDRESS || '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', // Fallback to BUSD testnet
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [CONFIG.HARDWARE_PREORDER_ADDRESS, amount],
            });
            console.log("Approval tx:", txHash);
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

            const txHash = await writeContractAsync({
                address: CONFIG.HARDWARE_PREORDER_ADDRESS,
                abi: HARDWARE_PREORDER_ABI,
                functionName: fnCall,
                args: [1n],
            });
            console.log("Pre-order tx:", txHash);
            alert("Success! Pre-order deposit confirmed. You will receive an email for physical logistics updates.");
            setPreorderStep('none');
        } catch (error) {
            console.error("Preorder failed", error);
            alert(`Preorder failed: ${error.shortMessage || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050B08] text-white font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-40 pb-20 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-beetle-electric/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="text-beetle-electric font-black uppercase tracking-[0.3em] text-xs mb-4 block">Manufacturing Phase 1</span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                        The Infrastructure <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-beetle-electric to-beetle-gold">of the Resistance.</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-12">
                        Own the hardware. Secure the network. Earn the future. Phase 1 R&D hardware is produced in limited batches for protocol contributors.
                    </p>
                </div>
            </section>

            {/* Product Grid */}
            <section className="pb-32 container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {products.map(product => (
                        <div key={product.id} className="bg-black/40 border border-white/10 rounded-[2.5rem] p-8 md:p-12 hover:border-beetle-electric/30 transition-all group relative">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Left: Info */}
                                <div className="flex-1 space-y-6">
                                    <h3 className="text-3xl font-black">{product.name}</h3>
                                    <p className="text-gray-400 leading-relaxed text-sm">{product.description}</p>

                                    <div className="space-y-3">
                                        {product.features.map((f, i) => <FeatureItem key={i} text={f} />)}
                                    </div>

                                    {/* Milestone Tracker */}
                                    <div className="pt-6">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                                            <span>{product.milestone.label}</span>
                                            <span className="text-beetle-electric">{Math.round((product.milestone.current / product.milestone.target) * 100)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="h-full bg-beetle-electric shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                                                style={{ width: `${(product.milestone.current / product.milestone.target) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 pt-4">
                                        <div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase">Deposit Required</div>
                                            <div className="text-2xl font-black text-white font-mono">${product.depositAmount} <span className="text-xs">{product.depositCurrency}</span></div>
                                        </div>
                                        <div className="h-10 w-[1px] bg-white/10"></div>
                                        <div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase">Est. MSRP</div>
                                            <div className="text-2xl font-black text-gray-500 line-through decoration-red-900/50 decoration-2">${product.retailPrice}</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => openPreorderModal(product)}
                                        className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-beetle-electric hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                                    >
                                        Initiate Pre-Order <ArrowRight size={18} />
                                    </button>
                                </div>

                                {/* Right: Visual */}
                                <div className="w-full md:w-32 h-40 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-6xl shadow-inner">
                                    {product.image}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Accountability Layer */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <LegalDisclaimers />
                </div>
            </section>

            {/* Modal Flow */}
            <AnimatePresence>
                {preorderStep !== 'none' && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                            onClick={() => setPreorderStep('none')}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0A1A0F] border border-white/10 rounded-[3rem] p-8 md:p-12 max-w-xl w-full relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                        >
                            <button onClick={() => setPreorderStep('none')} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>

                            {preorderStep === 'shipping' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-3xl font-black text-white mb-2">Shipping Profile</h3>
                                        <p className="text-gray-400 text-sm italic">Physical logistics data is encrypted and handled off-chain.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Receiver Name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-beetle-electric outline-none transition-all"
                                            value={shippingDetails.name}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                                        />
                                        <input
                                            type="email"
                                            placeholder="Recovery Email"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-beetle-electric outline-none transition-all"
                                            value={shippingDetails.email}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                                        />
                                        <textarea
                                            placeholder="Full Shipping Address (Global)"
                                            rows={3}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-beetle-electric outline-none transition-all"
                                            value={shippingDetails.address}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                                        />
                                        
                                        {/* Legal Checkbox */}
                                        <div className="flex items-start gap-3 mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                                            <input
                                                type="checkbox"
                                                id="terms-checkbox"
                                                className="mt-1 w-5 h-5 bg-black border border-white/30 rounded focus:ring-beetle-electric focus:ring-2 focus:ring-offset-2 focus:ring-offset-black accent-beetle-electric transition-all cursor-pointer"
                                                checked={agreedToTerms}
                                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            />
                                            <label htmlFor="terms-checkbox" className="text-sm text-gray-400 leading-relaxed cursor-pointer select-none">
                                                I have read and agree to the <a href="/legal/hardware" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-beetle-electric transition-colors underline">Hardware Purchase Agreement</a> and <a href="/legal/tos" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-beetle-electric transition-colors underline">Terms of Service</a>. I understand this is a non-refundable deposit once manufacturing begins.
                                            </label>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setPreorderStep('approve')}
                                        disabled={!shippingDetails.address || !shippingDetails.name || !agreedToTerms}
                                        className="w-full bg-beetle-electric text-black font-black py-4 rounded-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        Continue to Wallet Approval
                                    </button>
                                </div>
                            )}

                            {preorderStep === 'approve' && (
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-beetle-gold/10 border border-beetle-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <Wallet className="text-beetle-gold" size={40} />
                                    </div>
                                    <h4 className="text-2xl font-black text-white mb-4">Currency Authorization</h4>
                                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                        You are authorizing the Scarab Hardware Escrow to hold your ${selectedProduct.depositAmount} deposit.
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
