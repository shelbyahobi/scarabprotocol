import { useState, useEffect } from 'react';
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { QrReader } from 'react-qr-reader';
import GovernanceDashboard from './GovernanceDashboard';
import VestingDashboard from './VestingDashboard';
import { Lock, ShieldCheck, Zap, ShoppingCart, ExternalLink, Copy, Users, Leaf, Vote, Server, Activity, Plus, Vault, Gift, Camera, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import { formatEther } from 'viem';
import { CONFIG } from '../config';

// ABI for balanceOf
const ERC20_ABI = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
];

// ABI for SeedSale contributions
const SEED_SALE_ABI = [
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "contributions", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "totalRaised", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

const EMISSION_CONTROLLER_ABI = [
    {
        "inputs": [],
        "name": "getCurrentEffectiveRate",
        "outputs": [
            { "internalType": "uint256", "name": "bokashiRate", "type": "uint256" },
            { "internalType": "uint256", "name": "solarRate", "type": "uint256" },
            { "internalType": "uint256", "name": "efficiencyPercent", "type": "uint256" },
            { "internalType": "uint256", "name": "activeDevices", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const SEED_SALE_ADDRESS = CONFIG.SEED_SALE_ADDRESS;
const TOKEN_ADDRESS = CONFIG.ROLL_TOKEN_ADDRESS;
const HARDWARE_PREORDER_ADDRESS = CONFIG.HARDWARE_PREORDER_ADDRESS;
const MOCK_USDC_ADDRESS = CONFIG.MOCK_USDC_ADDRESS;

const HARDWARE_PREORDER_ABI = [
    { "inputs": [{ "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "preorderBokashiHome", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "preorderBokashiPro", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "quantity", "type": "uint256" }], "name": "preorderSolar", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

const USDC_ABI = [
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }
];

export default function ColonyDashboard() {
    const { address, isConnected } = useAccount();
    const [tier, setTier] = useState('Guest'); // Guest, Scout, Guardian, Elder
    const [selectedProduct, setSelectedProduct] = useState(null); // For Modal
    const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace', 'hive', 'governance'
    const [userContribution, setUserContribution] = useState(0n);
    const [treasuryBalance, setTreasuryBalance] = useState("0");
    const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
    const [registrationStep, setRegistrationStep] = useState('approve'); // 'approve' | 'register'
    const [mockScanning, setMockScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [isScanningActive, setIsScanningActive] = useState(false);

    // Hardware Pre-order Flow State
    const [isPreorderModalOpen, setIsPreorderModalOpen] = useState(false);
    const [preorderStep, setPreorderStep] = useState('shipping'); // 'shipping' | 'approve' | 'confirm'
    const [shippingDetails, setShippingDetails] = useState({ name: '', address: '', city: '', postal: '', country: '', email: '' });


    // Mock Active Nodes for the Professional Mining UX
    const [mockNodes, setMockNodes] = useState([
        {
            id: 'BOK-RIG-001',
            type: 'Bokashi',
            status: 'Active',
            progress: 85, // 12/14 days
            subscriptionActive: true,
            metrics: {
                temp: 38.5,
                gas: 950,
                lidOpenings: 4,
                averageFillWeight: 4200,
            },
            yieldProbability: 100
        },
        {
            id: 'BOK-RIG-002',
            type: 'Bokashi',
            status: 'Completed',
            progress: 100,
            subscriptionActive: false, // Trigger revenue lock
            metrics: {
                temp: 39.0,
                gas: 810,
                lidOpenings: 18, // 80% penalty territory
                averageFillWeight: 3500,
            },
            yieldProbability: 80
        }
    ]);

    // Emission Metrics
    const [emissionRates, setEmissionRates] = useState({
        bokashi: "50.0",
        solar: "8.0",
        efficiency: "100",
        devices: "0"
    });

    // Batch Read for Efficiency & Reliability
    const { data: contractData } = useReadContracts({
        contracts: [
            {
                address: TOKEN_ADDRESS,
                abi: ERC20_ABI,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                address: SEED_SALE_ADDRESS,
                abi: SEED_SALE_ABI,
                functionName: 'contributions',
                args: [address],
            },
            {
                address: SEED_SALE_ADDRESS,
                abi: SEED_SALE_ABI,
                functionName: 'totalRaised',
            },
            {
                address: CONFIG.EMISSION_CONTROLLER_ADDRESS,
                abi: EMISSION_CONTROLLER_ABI,
                functionName: 'getCurrentEffectiveRate',
            }
        ],
        query: {
            enabled: isConnected && !!address,
            refetchInterval: 5000,
        }
    });

    useEffect(() => {
        if (!isConnected || !address) {
            setTier('Guest');
            return;
        }

        if (contractData && contractData[0]?.status === 'success') {
            const tokenBalance = contractData[0].result ? BigInt(contractData[0].result) : 0n;
            const seedDeposit = contractData[1]?.result ? BigInt(contractData[1].result) : 0n;
            const totalRaised = contractData[2]?.result ? BigInt(contractData[2].result) : 0n;

            setUserContribution(seedDeposit);
            setTreasuryBalance(parseFloat(formatEther(totalRaised)).toFixed(2));

            // Tier Logic
            const decimals = 10n ** 18n;

            // Priority 1: High Token Balance
            if (tokenBalance >= 5000000n * decimals) { // 5M SCARAB
                setTier('Elder');
            } else if (tokenBalance >= 1000000n * decimals) { // 1M SCARAB
                setTier('Guardian');
            }
            // Priority 2: Seed Contributor (Any Amount) or Token Holder
            else if (seedDeposit > 0n || tokenBalance > 0n) {
                setTier('Scout');
            }
            // Default: Guest
            else {
                setTier('Guest');
            }
        }

        // Handle Emission Metrics (index 3 may be present even if user is Guest)
        if (contractData && contractData[3]?.status === 'success' && contractData[3].result) {
            const [bRate, sRate, eff, devs] = contractData[3].result;
            setEmissionRates({
                bokashi: parseFloat(formatEther(bRate)).toFixed(1),
                solar: parseFloat(formatEther(sRate)).toFixed(1),
                efficiency: eff.toString(),
                devices: devs.toString()
            });
        }

    }, [contractData, isConnected, address]);

    const hardwareProducts = [
        {
            id: 'solar',
            name: "Solar Sentinel Node (v1)",
            deposit: "100 USDC",
            totalCost: "$349 USD",
            image: "☀️",
            features: ["ATECC608A Cryptography", "Inverter Telemetry Pipeline", "2,400 BRU/yr Base Ratio"],
            minTier: "Guest",
            maxSupply: 1000,
            preordered: 42
        },
        {
            id: 'bokashi_home',
            name: "Bokashi Home",
            deposit: "25 USDC",
            totalCost: "~$299 USD (Retail)",
            image: "♻️",
            features: ["Affordable Scaling", "Temp & Weight Telemetry", "0.90x Base BRU Cap"],
            minTier: "Guest",
            maxSupply: 1000,
            preordered: 154
        },
        {
            id: 'bokashi_pro',
            name: "Bokashi Pro",
            deposit: "50 USDC",
            totalCost: "~$499 USD (Retail)",
            image: "🔬",
            features: ["Institutional Precision", "CH4 & VOC Telemetry", "1.05x Potential BRU Bonus"],
            minTier: "Guest",
            maxSupply: 250,
            preordered: 42
        }
    ];

    const utilityProducts = [
        {
            id: 3,
            name: "Tactical Solar Kit (60W)",
            priceMember: "$600 (Equiv. SCARAB)",
            retailPrice: "$1,200",
            discount: "50% OFF",
            image: "/solar-kit-prototype.png",
            minTier: "Guardian",
            code: "SCARAB-SOLAR-2026",
            link: "https://example-solar-partner.com"
        },
        {
            id: 4,
            name: "Starlink Auto-Pay",
            priceMember: "Data Rebate",
            retailPrice: "$120/mo",
            discount: "Pay w/ ROLL",
            image: "/starlink-kit-prototype.png",
            minTier: "Elder",
            code: "ROLL-STARLINK-VIP",
            link: "https://starlink.com"
        }
    ];

    const handleBuy = (product) => {
        if (tier === 'Guest') return;
        setSelectedProduct(product);
    };

    const openPreorderModal = (product) => {
        setSelectedProduct(product);
        setIsPreorderModalOpen(true);
        setPreorderStep('shipping');
    };

    const closePreorderModal = () => {
        setIsPreorderModalOpen(false);
        setPreorderStep('shipping');
    };

    const handlePreorderApprove = async () => {
        setIsSubmitting(true);
        try {
            // Get deposit amount in USDC (6 decimals)
            const depositStr = selectedProduct.deposit.split(' ')[0]; // e.g. "25"
            // Note: Standard USDC uses 6 decimals. For MOCK_USDC if it's 18 we would parseUnits(..., 18).
            const amount = BigInt(parseInt(depositStr) * 10 ** 6);

            const txHash = await writeContractAsync({
                address: MOCK_USDC_ADDRESS,
                abi: USDC_ABI,
                functionName: 'approve',
                args: [HARDWARE_PREORDER_ADDRESS, amount],
            });
            console.log("Approval tx:", txHash);
            alert("Approval transaction sent! Waiting for confirmation...");
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
                address: HARDWARE_PREORDER_ADDRESS,
                abi: HARDWARE_PREORDER_ABI,
                functionName: fnCall,
                args: [1n], // quantity 1
            });
            console.log("Pre-order tx:", txHash);
            alert(`✅ Success! Your Hardware Pre-order is confirmed!\n\nTxHash: ${txHash}\nShipping physical goods to: ${shippingDetails.address}`);
            closePreorderModal();
        } catch (error) {
            console.error("Preorder failed", error);
            alert(`Preorder execution failed: ${error.shortMessage || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMockScan = () => {
        setMockScanning(true);
        setTimeout(() => {
            setMockScanning(false);
            setIsAddNodeModalOpen(false);
            alert("Testnet Mock: Device registered successfully! (In production this calls DeviceRegistry.sol via the registrar API).");
        }, 2000);
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { writeContractAsync } = useWriteContract();

    const openAddNodeModal = () => {
        setIsAddNodeModalOpen(true);
        setRegistrationStep('approve');
        setScanResult(null);
        setIsScanningActive(false);
    };

    const ACTIVATION_FEE = 50n * 10n ** 18n;
    const handleApproveFee = async () => {
        setIsSubmitting(true);
        try {
            const txHash = await writeContractAsync({
                address: TOKEN_ADDRESS,
                abi: [
                    {
                        "inputs": [
                            { "internalType": "address", "name": "spender", "type": "address" },
                            { "internalType": "uint256", "name": "amount", "type": "uint256" }
                        ],
                        "name": "approve",
                        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ],
                functionName: 'approve',
                args: [CONFIG.DEVICE_REGISTRY_ADDRESS, ACTIVATION_FEE],
            });
            console.log("Approval tx:", txHash);
            alert("Approval transaction sent! Waiting for confirmation...");
            setRegistrationStep('register');
        } catch (error) {
            console.error("Approval failed", error);
            alert(`Approval failed: ${error.shortMessage || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleScanResult = (result, error) => {
        if (result) {
            setIsScanningActive(false);
            setScanResult(result?.text);
            console.log("QR Data:", result?.text);
        }
        if (error && error.message) {
            // Ignore frequent 'No QR code found' errors from continuous scanning
            if (!error.message.includes('No QR code found')) {
                console.warn(error);
            }
        }
    };

    const processSignature = async () => {
        setIsSubmitting(true);
        try {
            // The QR code on the bag is expected to contain:
            // "SCARAB_BOKASHI_BRAN|v1.0|NONCE_STRING|SIGNATURE_HEX"
            // For the MVP, we assume the scanner just gets the signature or the user provides a signed nonce.
            // Under real conditions, parsing happens here. 
            // We use a mock nonce and signature for the hackathon/demo environment if format is simple.

            let branNonce = "bn_" + Math.random().toString(36).substring(2, 10);
            let signature = scanResult;

            // If the QR contains the full packed string, we split it
            if (scanResult.includes('|')) {
                const parts = scanResult.split('|');
                if (parts.length >= 4) {
                    branNonce = parts[2];
                    signature = parts[3];
                }
            }

            // Ensure signature has 0x prefix
            if (!signature.startsWith('0x')) {
                signature = '0x' + signature;
            }

            console.log("Submitting to Bokashi Validator:", { branNonce, signature });

            const txHash = await writeContractAsync({
                address: CONFIG.PRODUCTION_VALIDATOR_ADDRESS,
                abi: [
                    {
                        "inputs": [
                            { "internalType": "string", "name": "branNonce", "type": "string" },
                            { "internalType": "bytes", "name": "signature", "type": "bytes" }
                        ],
                        "name": "startCycle",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ],
                functionName: 'startCycle',
                args: [branNonce, signature],
            });

            alert(`✅ Transaction Submitted!\nHash: ${txHash}`);
            setIsAddNodeModalOpen(false);
            setScanResult(null);

        } catch (error) {
            console.error("Submission failed", error);
            alert(`❌ Error submitting cycle:\n${error.shortMessage || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="colony-dashboard" className="py-24 relative overflow-hidden bg-[#0c0c0c] border-t border-white/5">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-beetle-blue/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-white/10 pb-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                            Colony <span className="text-beetle-gold">Command Center</span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Manage your assets, hardware, and governance rights.
                        </p>
                    </div>

                    {/* Tier Status Badge */}
                    <div className="bg-[#111] border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tier === 'Guest' ? 'bg-red-500/20 text-red-500' : 'bg-beetle-green/20 text-beetle-green'}`}>
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Clearance Level</div>
                            <div className={`text-xl font-black ${tier === 'Guest' ? 'text-white' : 'text-beetle-electric'}`}>
                                {tier.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-12 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('marketplace')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'marketplace' ? 'bg-beetle-gold text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <ShoppingCart size={18} /> The Armory (Market)
                    </button>
                    <button
                        onClick={() => setActiveTab('hive')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'hive' ? 'bg-beetle-electric text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <Server size={18} /> The Hive (My Nodes)
                    </button>
                    <button
                        onClick={() => setActiveTab('governance')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'governance' ? 'bg-beetle-green text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <Vote size={18} /> The Council (DAO)
                    </button>
                    <button
                        onClick={() => setActiveTab('vault')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'vault' ? 'bg-slate-300 text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                        <Vault size={18} /> Protocol Vault
                    </button>
                </div>

                {/* ─── CLAIM REWARDS PANEL (Pull Model) ─── */}
                {isConnected && tier !== 'Guest' && (
                    <div className="mb-8 bg-gradient-to-r from-beetle-gold/10 to-transparent border border-beetle-gold/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-beetle-gold/20 rounded-xl flex items-center justify-center">
                                <Gift size={24} className="text-beetle-gold" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Pending Rewards (Pull Model)</div>
                                <div className="text-2xl font-black text-white font-mono">0 <span className="text-beetle-gold text-sm">SCARAB</span></div>
                                <div className="text-xs text-gray-500 mt-1">~0 SCARAB/day estimated · claim from EmissionController</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <button
                                className="px-8 py-3 bg-beetle-gold text-black font-black rounded-xl hover:brightness-110 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={true}
                                title="EmissionController not yet deployed to this network"
                            >
                                Claim SCARAB →
                            </button>
                            <span className="text-[10px] text-gray-600 font-mono">EmissionController: awaiting testnet deploy</span>
                        </div>
                    </div>
                )}

                {/* --- TAB: MARKETPLACE (Consolidated) --- */}
                {activeTab === 'marketplace' && (
                    <div className="space-y-16">
                        {/* Section 1: Hardware (Revenue Generating) */}
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Zap className="text-beetle-gold" /> Mining Hardware (Generates ROLL)
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hardwareProducts.map(product => {
                                    const isLocked = tier === 'Guest';
                                    return (
                                        <div key={product.id} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-beetle-gold/50 transition-all flex flex-col">
                                            <div className="aspect-video bg-gray-900 relative overflow-hidden flex items-center justify-center p-6">
                                                {product.image.startsWith('/') ? (
                                                    <img src={product.image} alt={product.name} className="h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform" />
                                                ) : (
                                                    <div className="text-6xl">{product.image}</div>
                                                )}
                                                {isLocked && (
                                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                                                        <Lock className="text-beetle-gold" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-lg font-bold text-white">{product.name}</h4>
                                                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">Priority</span>
                                                </div>
                                                <div className="flex items-baseline gap-2 mb-4">
                                                    <span className="text-beetle-gold font-mono font-bold text-xl">{product.deposit} Deposit</span>
                                                    <span className="text-gray-500 text-sm">/ {product.totalCost}</span>
                                                </div>
                                                <ul className="space-y-2 mb-6 text-sm text-gray-400 flex-1">
                                                    {product.features.map((f, i) => <li key={i} className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-beetle-electric mt-1.5" /> {f}</li>)}
                                                </ul>

                                                {/* Supply Progress Bar */}
                                                <div className="w-full bg-black/50 h-2 rounded-full mb-2 overflow-hidden border border-white/5">
                                                    <div
                                                        className="h-full bg-beetle-gold transition-all"
                                                        style={{ width: `${(product.preordered / product.maxSupply) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">
                                                    <span>Pre-ordered</span>
                                                    <span className="text-white">{product.preordered} / {product.maxSupply}</span>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        if (!isConnected) alert("Please connect wallet first");
                                                        else openPreorderModal(product);
                                                    }}
                                                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                                                >
                                                    Secure Refundable Reservation
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Section 2: Utility (Spending ROLL) */}
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Leaf className="text-green-400" /> Survival Gear (Spends ROLL)
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {utilityProducts.map(product => {
                                    const isLocked = tier === 'Guest';
                                    return (
                                        <div key={product.id} className="bg-[#0a1a0f]/40 border border-white/5 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all">
                                            <div className="p-6 flex justify-between items-start">
                                                <div className="text-4xl">{product.image}</div>
                                                <div className="text-right">
                                                    <div className="text-xl font-black text-white">{product.priceMember}</div>
                                                    <div className="text-sm text-gray-500 line-through">{product.retailPrice}</div>
                                                </div>
                                            </div>
                                            <div className="px-6 pb-6">
                                                <h4 className="font-bold text-white mb-1">{product.name}</h4>
                                                <div className="text-green-400 text-sm font-bold mb-4">{product.discount}</div>
                                                <button
                                                    onClick={() => !isLocked && handleBuy(product)}
                                                    disabled={isLocked}
                                                    className={`w-full font-bold py-3 rounded-lg transition-all ${isLocked ? 'bg-white/5 text-gray-500' : 'bg-green-600 text-black hover:bg-green-500'}`}
                                                >
                                                    {isLocked ? "Unlock Access" : "Claim Deal"}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: THE HIVE (Simulated Mining) --- */}
                {activeTab === 'hive' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-12 gap-8">
                        {/* Simulation Stats */}
                        <div className="md:col-span-8 bg-black/40 border border-white/10 rounded-3xl p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">My Mining Rigs</h3>
                                    <p className="text-gray-400 text-sm">Monitor live telemetry, optimize variables, and claim rewards.</p>
                                </div>
                                <button
                                    onClick={openAddNodeModal}
                                    className="bg-beetle-electric text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white transition-colors"
                                >
                                    <Plus size={18} /> Add Rig
                                </button>
                            </div>

                            {/* Active Miners - Professional Mining UI */}
                            <div className="space-y-6">
                                {mockNodes.map((node, i) => (
                                    <div key={i} className={`bg-[#0a1a0f] border ${node.metrics.lidOpenings > 14 ? 'border-yellow-500/30' : 'border-green-500/30'} rounded-2xl p-6 relative overflow-hidden shadow-lg`}>
                                        {/* Background gradient based on state */}
                                        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${node.metrics.lidOpenings > 14 ? 'bg-yellow-500/5' : 'bg-green-500/5'}`}></div>

                                        <div className="relative z-10">
                                            {/* Header */}
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center">
                                                        <Activity className={node.status === 'Active' ? 'text-beetle-electric animate-pulse' : 'text-gray-500'} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold font-mono tracking-wider">{node.id}</h4>
                                                        <div className="text-sm font-bold mt-1 inline-flex items-center gap-1">
                                                            <span className="text-gray-400">{node.type} Miner</span>
                                                            <span className="mx-2 text-white/20">•</span>
                                                            <span className={node.status === 'Active' ? 'text-blue-400' : 'text-green-400'}>{node.status}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Yield Probability */}
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Yield Estimate</div>
                                                    <div className={`text-2xl font-black font-mono ${node.yieldProbability === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                        {node.yieldProbability}%
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Industrial Telemetry Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                <div className="bg-black/50 border border-white/5 rounded-xl p-3">
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Peak Core Temp</div>
                                                    <div className="text-white font-mono">{node.metrics.temp}°C</div>
                                                </div>
                                                <div className="bg-black/50 border border-white/5 rounded-xl p-3">
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Anaerobic Gas</div>
                                                    <div className="text-white font-mono">{node.metrics.gas} PPM</div>
                                                </div>
                                                <div className={`bg-black/50 border rounded-xl p-3 ${node.metrics.lidOpenings > 14 ? 'border-yellow-500/50' : 'border-white/5'}`}>
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Lid Openings (O2)</div>
                                                    <div className={`font-mono ${node.metrics.lidOpenings > 14 ? 'text-yellow-400' : 'text-white'}`}>
                                                        {node.metrics.lidOpenings} / 14 max
                                                    </div>
                                                </div>
                                                <div className="bg-black/50 border border-white/5 rounded-xl p-3">
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Current Mass</div>
                                                    <div className="text-white font-mono">{(node.metrics.averageFillWeight / 1000).toFixed(1)} kg</div>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-black/50 h-2 rounded-full mb-2 overflow-hidden border border-white/5">
                                                <div
                                                    className={`h-full ${node.status === 'Active' ? 'bg-blue-500' : 'bg-green-500'} transition-all`}
                                                    style={{ width: `${node.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">
                                                <span>Cycle Start</span>
                                                <span>{node.progress}% Complete</span>
                                            </div>

                                            {/* Contextual Action Areas */}
                                            {node.status === 'Active' && node.metrics.lidOpenings <= 14 && (
                                                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 rounded-xl text-sm flex items-center gap-2">
                                                    <CheckCircle size={16} /> Optimal parameters maintained. Keep lid sealed to protect yield.
                                                </div>
                                            )}

                                            {node.metrics.lidOpenings > 14 && (
                                                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-3 rounded-xl text-sm flex items-center gap-2">
                                                    <AlertCircle size={16} /> Excessive Oxygen penalty active (-20% Yield). Stop opening the lid.
                                                </div>
                                            )}

                                            {node.status === 'Completed' && (
                                                <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between">
                                                    <div>
                                                        <div className="text-white font-bold">Cycle Ready for Settlement</div>
                                                        <p className="text-xs text-gray-500 mt-1">Generate your drop-off QR code for the Farmer Sink Node.</p>
                                                    </div>

                                                    {!node.subscriptionActive ? (
                                                        <button disabled className="bg-red-500/20 text-red-500 border border-red-500/50 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 opacity-80 cursor-not-allowed">
                                                            <Lock size={16} /> Sub Inactive
                                                        </button>
                                                    ) : (
                                                        <button className="bg-beetle-green text-black font-bold px-4 py-2 rounded-lg text-sm hover:brightness-110 transition-all">
                                                            Generate Fertility Handshake
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Subscription Lock Overlay (if completed & inactive) */}
                                            {node.status === 'Completed' && !node.subscriptionActive && (
                                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col justify-center items-center text-center p-6 border border-red-500/30 rounded-2xl">
                                                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                                        <Lock className="text-red-500" size={24} />
                                                    </div>
                                                    <h4 className="text-xl font-bold text-white mb-2">Bran Subscription Expired</h4>
                                                    <p className="text-sm text-gray-400 max-w-sm mb-6">
                                                        A valid SaaS Bran subscription is required to complete the Fertility Handshake and claim your {node.yieldProbability}% yield tokens.
                                                    </p>
                                                    <button className="bg-beetle-gold text-black font-bold px-6 py-3 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                                                        Renew Subscription ($12/mo)
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Network Stats - Updated with Dynamic Emission Widget */}
                        <div className="md:col-span-4 space-y-4">
                            <div className="bg-black/60 rounded-2xl p-6 border border-beetle-gold/30">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-4 flex items-center justify-between">
                                    Current Network Rate <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px]">LIVE</span>
                                </div>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-beetle-gold">
                                        {emissionRates.bokashi} <span className="text-sm">SCARAB</span>
                                    </span>
                                </div>
                                <div className="text-sm text-gray-400 mb-4 font-bold border-b border-white/10 pb-4">per bokashi cycle</div>

                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-2xl font-bold text-beetle-gold">
                                        {emissionRates.solar} <span className="text-sm">SCARAB</span>
                                    </span>
                                </div>
                                <div className="text-sm text-gray-400 pb-2">per kWh</div>

                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="flex justify-between items-center mb-2 text-sm">
                                        <span className="text-gray-500">Network Efficiency</span>
                                        <span className={`font-mono font-bold ${Number(emissionRates.efficiency) < 100 ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {emissionRates.efficiency}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Active Devices</span>
                                        <span className="text-white font-mono font-bold">
                                            {emissionRates.devices}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Lifetime Regen Stats Widget */}
                            <div className="bg-black/60 rounded-2xl p-6 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-4 flex items-center gap-2">
                                    <Globe size={16} className="text-green-400" />
                                    Global Lifetime Impact
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                        <span className="text-gray-400">CO₂-eq Diverted</span>
                                        <span className="text-white font-mono font-bold">14,290 kg</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                        <span className="text-gray-400">Organic Mass Repurposed</span>
                                        <span className="text-white font-mono font-bold">4.2 Tons</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Fertility Handshakes</span>
                                        <span className="text-white font-mono font-bold">3,104</span>
                                    </div>
                                </div>

                                <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
                                    These metrics reflect the cumulative verifiable physical output generated by the SCARAB network. Real World Assets permanently recorded on-chain.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- TAB: GOVERNANCE (DAO) --- */}
                {activeTab === 'governance' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
                        <GovernanceDashboard />
                    </motion.div>
                )}

                {/* --- TAB: PROTOCOL VAULT (Transparency) --- */}
                {activeTab === 'vault' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
                        <VestingDashboard />
                    </motion.div>
                )}

            </div>

            {/* Modal Reuse from Previous (Discount Code) */}
            <AnimatePresence>
                {selectedProduct && selectedProduct.code && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0a1a0f] border border-beetle-gold/50 p-8 rounded-2xl max-w-md w-full text-center relative shadow-[0_0_50px_rgba(212,175,55,0.2)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

                            <div className="w-16 h-16 bg-beetle-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Zap className="text-beetle-gold w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2">Access Granted</h3>
                            <p className="text-gray-400 mb-6">Use this code at checkout on our partner's site.</p>

                            <div className="bg-black/50 border border-white/10 p-4 rounded-xl flex items-center justify-between mb-6 group cursor-pointer"
                                onClick={() => navigator.clipboard.writeText(selectedProduct.code)}>
                                <code className="text-beetle-electric font-mono text-xl font-bold">{selectedProduct.code}</code>
                                <Copy className="text-gray-500 group-hover:text-white transition-colors w-5 h-5" />
                            </div>

                            <a href={selectedProduct.link} target="_blank" className="block w-full bg-beetle-gold text-black font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                                Go to Partner Store <ExternalLink size={18} />
                            </a>
                        </motion.div>
                    </div>
                )}

                {/* Hardware Preorder Modal */}
                {isPreorderModalOpen && selectedProduct && !selectedProduct.code && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closePreorderModal}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0a1a0f] border border-beetle-gold/50 p-8 rounded-2xl max-w-lg w-full relative shadow-[0_0_50px_rgba(212,175,55,0.2)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={closePreorderModal} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

                            <h3 className="text-2xl font-black text-white mb-2 tracking-tighter text-center">{selectedProduct.name} Pre-order</h3>

                            {/* Step Indicator */}
                            <div className="flex justify-center items-center gap-4 mb-8 text-sm">
                                <span className={preorderStep === 'shipping' ? 'text-beetle-gold font-bold' : 'text-gray-500'}>1. Shipping</span>
                                <span className="text-white/20">→</span>
                                <span className={preorderStep === 'approve' ? 'text-beetle-gold font-bold' : 'text-gray-500'}>2. Deposit</span>
                                <span className="text-white/20">→</span>
                                <span className={preorderStep === 'confirm' ? 'text-beetle-gold font-bold' : 'text-gray-500'}>3. Confirm</span>
                            </div>

                            {preorderStep === 'shipping' && (
                                <div className="space-y-4">
                                    <p className="text-gray-400 text-sm text-center mb-6">Enter your physical address for hardware delivery.</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="Full Name" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white w-full" value={shippingDetails.name} onChange={e => setShippingDetails({ ...shippingDetails, name: e.target.value })} />
                                        <input type="email" placeholder="Email" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white w-full" value={shippingDetails.email} onChange={e => setShippingDetails({ ...shippingDetails, email: e.target.value })} />
                                    </div>
                                    <input type="text" placeholder="Street Address" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white w-full" value={shippingDetails.address} onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })} />
                                    <div className="grid grid-cols-3 gap-4">
                                        <input type="text" placeholder="City" className="col-span-1 border border-white/10 bg-black/50 rounded-lg p-3 text-white w-full" value={shippingDetails.city} onChange={e => setShippingDetails({ ...shippingDetails, city: e.target.value })} />
                                        <input type="text" placeholder="State/Prov" className="col-span-1 border border-white/10 bg-black/50 rounded-lg p-3 text-white w-full" />
                                        <input type="text" placeholder="Postal / Zip" className="col-span-1 border border-white/10 bg-black/50 rounded-lg p-3 text-white w-full" value={shippingDetails.postal} onChange={e => setShippingDetails({ ...shippingDetails, postal: e.target.value })} />
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button
                                            onClick={() => setPreorderStep('approve')}
                                            disabled={!shippingDetails.name || !shippingDetails.address}
                                            className="bg-beetle-gold text-black font-bold py-3 px-6 rounded-xl hover:bg-white transition-all disabled:opacity-50"
                                        >
                                            Next: Approve Deposit →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {preorderStep === 'approve' && (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-beetle-gold/20 border border-beetle-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Lock className="text-beetle-gold w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-4">Escrow Deposit Approval</h4>
                                    <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                                        You are pre-ordering 1x {selectedProduct.name}. The protocol requires an ERC20 approval to escrow your {selectedProduct.deposit} USDC deposit securely on-chain.
                                    </p>

                                    <div className="bg-black/50 border border-white/10 p-4 rounded-xl flex justify-between items-center mb-6">
                                        <span className="text-gray-500 font-bold">Total Deposit:</span>
                                        <span className="text-white font-mono font-bold">{selectedProduct.deposit}</span>
                                    </div>

                                    <button
                                        onClick={handlePreorderApprove}
                                        disabled={isSubmitting}
                                        className="w-full bg-beetle-gold text-black font-bold py-3 px-6 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Approving in Wallet...' : `Approve ${selectedProduct.deposit}`}
                                    </button>
                                </div>
                            )}

                            {preorderStep === 'confirm' && (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="text-green-500 w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-4">Deposit Approved</h4>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Your USDC deposit is approved. Finalize the transaction to lock in your allocation. Deposits are fully refundable until manufacturing begins.
                                    </p>

                                    <button
                                        onClick={handlePreorderConfirm}
                                        disabled={isSubmitting}
                                        className="w-full bg-beetle-green text-black font-bold py-3 px-6 rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Confirming...' : 'Secure Reservation via Web3'}
                                    </button>
                                </div>
                            )}

                        </motion.div>
                    </div>
                )}

                {/* Add Device Modal (Testnet Mock) */}
                {isAddNodeModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddNodeModalOpen(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0c0c0c] border border-beetle-electric border-dashed p-8 rounded-2xl max-w-md w-full text-center relative shadow-[0_0_50px_rgba(34,211,238,0.1)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setIsAddNodeModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

                            {registrationStep === 'approve' && (
                                <>
                                    <div className="w-16 h-16 bg-beetle-gold/20 border border-beetle-gold/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                                        <Lock className="text-beetle-gold w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-2">Step 1: Protocol Activation Burn</h3>
                                    <p className="text-gray-400 mb-6 text-sm">To connect a node and start earning, you must burn a 50 SCARAB activation fee. This creates a permanent deflationary sink for the token.</p>

                                    <div className="bg-black/50 border border-white/5 p-4 rounded-xl flex flex-col mb-6 w-full text-left">
                                        <div className="flex justify-between items-center text-sm mb-2">
                                            <span className="text-gray-500">Activation Fee</span>
                                            <span className="text-white font-mono font-bold">50 SCARAB</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleApproveFee}
                                        disabled={isSubmitting}
                                        className="bg-beetle-gold w-full text-black font-bold py-3 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Approving...' : 'Approve 50 SCARAB Burn →'}
                                    </button>
                                </>
                            )}

                            {registrationStep === 'register' && (
                                <>
                                    <div className="w-16 h-16 bg-beetle-electric/10 border border-beetle-electric/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                                        <Activity className="text-beetle-electric w-8 h-8" />
                                    </div>

                                    <h3 className="text-xl font-black text-white mb-2">Step 2: Sync Hardware</h3>
                                    <p className="text-gray-400 mb-6 text-sm">Please power on your SCARAB Solar Node or Bokashi Kit and scan the factory QR code.</p>

                                    <div className="bg-black/50 border border-white/5 p-6 rounded-xl flex flex-col items-center justify-center mb-6 w-full">
                                        {scanResult ? (
                                            <div className="fade-in w-full text-center">
                                                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                                                    <CheckCircle size={32} />
                                                </div>
                                                <h4 className="text-xl font-bold text-white mb-2">Signature Verified</h4>
                                                <div className="bg-black/80 rounded p-3 mb-6 border border-white/10 font-mono text-xs text-green-400 break-all overflow-hidden h-16">
                                                    {scanResult}
                                                </div>
                                                <button
                                                    onClick={processSignature}
                                                    className="bg-beetle-electric w-full text-black font-bold py-3 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                                                >
                                                    Submit to Blockchain →
                                                </button>
                                                <button
                                                    onClick={() => setScanResult(null)}
                                                    className="text-gray-500 text-sm mt-4 hover:text-white"
                                                >
                                                    Scan Another Code
                                                </button>
                                            </div>
                                        ) : isScanningActive ? (
                                            <div className="w-full">
                                                <div className="relative mb-4 rounded-xl overflow-hidden border-2 border-beetle-electric shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                                                    <QrReader
                                                        onResult={handleScanResult}
                                                        constraints={{ facingMode: 'environment' }}
                                                        containerStyle={{ width: '100%' }}
                                                        videoStyle={{ objectFit: 'cover' }}
                                                    />
                                                    {/* Scanning reticle overlay */}
                                                    <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none"></div>
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <div className="w-48 h-48 border-2 border-beetle-electric/50 rounded-lg relative">
                                                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-beetle-electric"></div>
                                                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-beetle-electric"></div>
                                                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-beetle-electric"></div>
                                                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-beetle-electric"></div>
                                                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-beetle-electric/30 animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setIsScanningActive(false)}
                                                    className="text-gray-500 hover:text-white w-full py-2"
                                                >
                                                    Cancel Scan
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-32 h-32 bg-[#111] border border-white/10 p-2 rounded-2xl mb-6 relative flex items-center justify-center group cursor-pointer hover:border-beetle-electric/50 transition-all"
                                                    onClick={() => setIsScanningActive(true)}
                                                >
                                                    <Camera size={48} className="text-gray-600 group-hover:text-beetle-electric transition-colors" />
                                                    <div className="absolute inset-x-0 bottom-2 text-center text-xs text-gray-500 font-bold uppercase tracking-widest">
                                                        Tap to Scan
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-6">Position the QR code inside the frame.</p>

                                                <div className="flex w-full gap-2">
                                                    <button
                                                        onClick={() => setIsScanningActive(true)}
                                                        className="bg-beetle-electric flex-1 w-full text-black font-bold py-3 px-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg"
                                                    >
                                                        <Camera size={18} /> Start Camera
                                                    </button>
                                                    <button
                                                        onClick={handleMockScan}
                                                        className="bg-[#222] text-gray-400 font-bold py-3 px-4 rounded-xl hover:text-white hover:bg-[#333] transition-colors"
                                                        title="Simulate successful scan (for testing)"
                                                    >
                                                        Mock
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="text-xs text-gray-500 text-left bg-black/40 p-3 rounded-lg border border-white/5 line-clamp-3">
                                        <strong>Technical Info:</strong> The QR code contains an ECDSA signature from the SCARAB manufacturer. Scanning it triggers the DeviceRegistry contract to bind the physical hardware (via P-256 public key) to your wallet address: <code>{address?.substring(0, 8)}...</code>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section >
    );
}
