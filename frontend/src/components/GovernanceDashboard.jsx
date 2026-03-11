import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Vote, Users, FileText, CheckCircle, XCircle, Clock, ArrowRight, TrendingUp, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import { CONFIG } from '../config';

const ROLL_TOKEN_ADDRESS = CONFIG.ROLL_TOKEN_ADDRESS;

const ROLL_ABI = [
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getVotes", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "delegatee", "type": "address" }], "name": "delegate", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

const GovernanceDashboard = () => {
    const { address, isConnected } = useAccount();
    const [delegatee, setDelegatee] = useState('');
    const [proposalDescription, setProposalDescription] = useState('');

    // Read Balance & Voting Power
    const { data: votingPower } = useReadContract({
        address: ROLL_TOKEN_ADDRESS,
        abi: ROLL_ABI,
        functionName: 'getVotes',
        args: [address],
        query: { enabled: isConnected }
    });

    const { data: balance } = useReadContract({
        address: ROLL_TOKEN_ADDRESS,
        abi: ROLL_ABI,
        functionName: 'balanceOf',
        args: [address],
        query: { enabled: isConnected }
    });

    // Delegate Config
    const { writeContract: delegate, isPending: isDelegating } = useWriteContract();

    const handleDelegate = () => {
        if (!delegatee.startsWith('0x')) return;
        delegate({
            address: ROLL_TOKEN_ADDRESS,
            abi: ROLL_ABI,
            functionName: 'delegate',
            args: [delegatee]
        });
    }

    // Circulating Supply (Mock for now, would be from an API or contract in prod)
    const CIRCULATING_SUPPLY = 47300000;
    const share = balance ? (Number(formatEther(balance)) / CIRCULATING_SUPPLY) * 100 : 0;

    return (
        <div className="space-y-12">
            {/* Voting Power Calculator (Audit Requirement) */}
            <div className="grid md:grid-cols-3 gap-6">
                <StatCard
                    label="Your Voting Power"
                    value={votingPower ? Number(formatEther(votingPower)).toLocaleString() : '0'}
                    unit="Votes"
                    color="text-beetle-electric"
                    icon={<Vote size={20} />}
                />
                <StatCard
                    label="Total Circulating"
                    value={CIRCULATING_SUPPLY.toLocaleString()}
                    unit="SCARAB"
                    color="text-white"
                    icon={<Users size={20} />}
                />
                <StatCard
                    label="Your Protocol Share"
                    value={share.toFixed(4)}
                    unit="%"
                    color="text-beetle-gold"
                    icon={<Percent size={20} />}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Delegation Control */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="bg-black/40 border border-white/10 rounded-3xl p-8"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="text-beetle-electric" />
                        <h3 className="text-2xl font-black text-white">Delegation</h3>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Activation Status</p>
                        {votingPower > 0n ? (
                            <div className="flex items-center gap-2 text-beetle-green font-bold">
                                <CheckCircle size={16} /> Voting Power Active
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-yellow-500 font-bold">
                                <Clock size={16} /> Activation Required
                            </div>
                        )}
                        <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
                            To vote on proposals, you must first delegate your balance to an address (including your own).
                            This "wakes up" your voting power for snapshots.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Delegate Address (0x...)"
                                className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-beetle-electric outline-none"
                                value={delegatee}
                                onChange={(e) => setDelegatee(e.target.value)}
                            />
                            <button
                                onClick={handleDelegate}
                                disabled={isDelegating || !delegatee}
                                className="bg-beetle-electric text-black px-6 rounded-xl font-bold hover:bg-beetle-electric/90 disabled:opacity-50"
                            >
                                {isDelegating ? "..." : "Delegate"}
                            </button>
                        </div>
                        <button
                            onClick={() => setDelegatee(address)}
                            className="text-xs text-beetle-electric hover:underline"
                        >
                            Activate my own balance (Self-Delegate)
                        </button>
                    </div>
                </motion.div>

                {/* Active Proposals Placeholder */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="bg-black/40 border border-white/10 rounded-3xl p-8 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <FileText className="text-beetle-gold" />
                            <h3 className="text-2xl font-black text-white">The Open Queue</h3>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 border border-white/10 px-3 py-1 rounded-full uppercase">
                            No Active Votes
                        </span>
                    </div>

                    <div className="flex-1 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
                        <Clock className="text-gray-600 mb-4" size={40} />
                        <h4 className="text-white font-bold mb-2">Council is Adjourned</h4>
                        <p className="text-xs text-gray-500 max-w-[200px]">
                            There are currently no active proposals requiring stakeholder signature.
                        </p>
                    </div>

                    <button className="w-full mt-6 bg-white/5 border border-white/10 text-white/50 py-4 rounded-xl text-sm font-bold cursor-not-allowed">
                        Create Proposal (Requires 100k Votes)
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

function StatCard({ label, value, unit, color, icon }) {
    return (
        <div className="bg-black/60 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${color.replace('text-', 'bg-')} opacity-50`}></div>
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</span>
                <span className={`${color} opacity-40 group-hover:opacity-100 transition-opacity`}>{icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tighter">{value}</span>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{unit}</span>
            </div>
        </div>
    );
}

export default GovernanceDashboard;
