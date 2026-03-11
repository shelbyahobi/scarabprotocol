import React from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Users, ArrowRight, Wallet } from 'lucide-react';
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
        (contractData[0]?.result && BigInt(contractData[0].result) > 0n) ||
        (contractData[1]?.result && BigInt(contractData[1].result) > 0n)
    );

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-[#050B08] text-white">
                <Navbar />
                <div className="container mx-auto px-4 pt-48 text-center max-w-2xl">
                    <div className="w-20 h-20 bg-beetle-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-beetle-gold/20">
                        <Wallet className="text-beetle-gold" size={40} />
                    </div>
                    <h1 className="text-5xl font-black mb-6 tracking-tighter">DAO <span className="text-beetle-gold">Governance</span></h1>
                    <p className="text-gray-400 text-xl mb-10 leading-relaxed">
                        Access to the Scarab Protocol DAO is gated to stakeholders. Please connect your wallet to verify your governance rights.
                    </p>
                    <div className="inline-block p-1 bg-gradient-to-r from-beetle-gold/50 to-transparent rounded-2xl">
                        <div className="bg-black/80 backdrop-blur-xl px-8 py-6 rounded-xl border border-white/5">
                            <p className="text-sm text-gray-400 mb-4">Minimum requirement to view Proposals:</p>
                            <div className="flex items-center gap-2 justify-center text-white font-bold">
                                <ShieldCheck size={18} className="text-green-400" />
                                1 SCARAB or Seed Sale Allocation
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050B08] flex items-center justify-center text-beetle-gold font-bold">
                Verifying Governance Rights...
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-[#050B08] text-white">
                <Navbar />
                <div className="container mx-auto px-4 pt-48 text-center max-w-2xl text-white">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 text-red-500">
                        <Lock size={40} />
                    </div>
                    <h1 className="text-5xl font-black mb-6 tracking-tighter">Access <span className="text-red-500">Denied</span></h1>
                    <p className="text-gray-400 text-xl mb-12 leading-relaxed">
                        Your connected wallet does not hold $SCARAB tokens nor a Seed Sale allocation. Membership in the DAO is reserved for protocol stakeholders.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/app" className="bg-beetle-gold text-black font-black px-8 py-4 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                            Secure Seed Allocation <ArrowRight size={20} />
                        </Link>
                        <Link to="/products" className="bg-white/5 border border-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
                            View Hardware
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050B08] text-white">
            <Navbar />
            <div className="container mx-auto px-4 pt-32 pb-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/10 pb-8">
                    <div>
                        <span className="text-xs font-mono text-beetle-gold uppercase tracking-widest mb-4 block">Stakeholder Portal</span>
                        <h1 className="text-5xl font-black text-white tracking-tighter">The <span className="text-beetle-gold">Council</span></h1>
                        <p className="text-gray-400 mt-2">Verified address: <span className="font-mono text-beetle-gold">{address?.slice(0, 6)}...{address?.slice(-4)}</span></p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg flex items-center gap-2 text-green-400 font-bold text-sm">
                        <ShieldCheck size={16} /> Governance Rights Verified
                    </div>
                </div>

                <GovernanceDashboard />
            </div>
        </div>
    );
}
