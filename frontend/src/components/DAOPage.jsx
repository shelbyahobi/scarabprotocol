import React from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Users, ArrowRight, Wallet, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import GovernanceDashboard from './GovernanceDashboard';
import { CONFIG } from '../config';

const SEED_SALE_ABI = [
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "deposits", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

const ERC20_ABI = [
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

export default function DAOPage() {
    const { address, isConnected } = useAccount();

    const { data: contractData, isLoading } = useReadContracts({
        contracts: [
            {
                address: CONFIG.ROLL_TOKEN_ADDRESS,
                abi: ERC20_ABI,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                address: CONFIG.SEED_SALE_ADDRESS,
                abi: SEED_SALE_ABI,
                functionName: 'deposits',
                args: [address],
            }
        ],
        query: {
            enabled: isConnected && !!address
        }
    });

    const hasAccess = isConnected && contractData && (
        (contractData[0]?.result && BigInt(contractData[0].result) >= BigInt(1000 * 10 ** 18)) ||
        (contractData[1]?.result && BigInt(contractData[1].result) > 0n)
    );

    if (!isConnected) {
        return <ConnectWalletPrompt />;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050B08] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-beetle-electric border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-beetle-electric font-black uppercase tracking-widest text-xs">Authenticating...</span>
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-[#050B08] text-white">
                <Navbar />
                <div className="container mx-auto px-4 pt-48 text-center max-w-2xl">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                        <Lock size={44} />
                    </div>
                    <h1 className="text-6xl font-black mb-6 tracking-tighter">Access <span className="text-red-500">Restricted</span></h1>
                    <p className="text-gray-400 text-xl mb-12 leading-relaxed">
                        The Council is reserved for protocol stakeholders. To participate in governance,
                        you must hold at least <span className="text-white font-bold">1,000 SCARAB</span> or have an active seed sale allocation.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mb-12">
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Your Balance</div>
                            <div className="text-2xl font-black text-white">
                                {contractData?.[0]?.result ? (Number(contractData[0].result) / 10 ** 18).toLocaleString() : '0'} <span className="text-xs text-gray-500">SCARAB</span>
                            </div>
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Required</div>
                            <div className="text-2xl font-black text-beetle-gold">1,000 <span className="text-xs text-gray-500">SCARAB</span></div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 max-w-sm mx-auto">
                        <Link to="/app" className="bg-beetle-green text-black font-black px-8 py-4 rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                            Secure Seed Allocation <ArrowRight size={20} />
                        </Link>
                        <Link to="/marketplace" className="text-white/50 hover:text-white font-bold text-sm transition-colors">
                            Visit The Armory
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050B08] text-[#E8E8E8]">
            <Navbar isLanding={false} />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/5 pb-10">
                    <div>
                        <span className="text-beetle-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Stakeholder Portal</span>
                        <h1 className="text-7xl font-black text-white tracking-tighter">The <span className="text-beetle-gold italic font-black">Council</span></h1>
                        <p className="text-gray-400 mt-4 font-mono text-sm">
                            VERIFIED ADDRESS: <span className="text-beetle-gold">{address}</span>
                        </p>
                    </div>
                    <div className="bg-beetle-green/5 border border-beetle-green/20 px-6 py-3 rounded-2xl flex items-center gap-3 text-beetle-green font-black text-xs uppercase tracking-widest">
                        <ShieldCheck size={18} /> Governance Rights Active
                    </div>
                </div>

                <GovernanceDashboard />
            </div>
        </div>
    );
}

function ConnectWalletPrompt() {
    return (
        <div className="min-h-screen bg-[#050B08] flex items-center justify-center p-6">
            <Navbar />
            <div className="max-w-md w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 text-center">
                <div className="w-20 h-20 bg-beetle-electric/10 border border-beetle-electric/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
                    <Wallet size={40} className="text-beetle-electric" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Connect Wallet</h2>
                <p className="text-gray-400 mb-10 text-sm leading-relaxed">
                    To access governance features and verify protocol stewardship, please connect your Web3 wallet.
                </p>
                <div className="bg-beetle-electric/5 border border-beetle-electric/20 p-4 rounded-xl mb-4 text-[10px] text-beetle-electric font-black uppercase tracking-widest">
                    Stakeholder identity required
                </div>
            </div>
        </div>
    );
}
