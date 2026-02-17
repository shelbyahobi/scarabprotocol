import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Vote, Users, FileText, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ROLL_TOKEN_ADDRESS = import.meta.env.VITE_ROLL_TOKEN_ADDRESS;
const GOVERNOR_ADDRESS = import.meta.env.VITE_GOVERNOR_ADDRESS;

const ROLL_ABI = [
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "getVotes", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "delegatee", "type": "address" }], "name": "delegate", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

const GOVERNOR_ABI = [
    { "inputs": [{ "internalType": "address[]", "name": "targets", "type": "address[]" }, { "internalType": "uint256[]", "name": "values", "type": "uint256[]" }, { "internalType": "bytes[]", "name": "calldatas", "type": "bytes[]" }, { "internalType": "string", "name": "description", "type": "string" }], "name": "propose", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "proposalId", "type": "uint256" }, { "internalType": "uint8", "name": "support", "type": "uint8" }], "name": "castVote", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "proposalId", "type": "uint256" }], "name": "state", "outputs": [{ "internalType": "enum IGovernor.ProposalState", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }
];

const GovernanceDashboard = () => {
    const { address, isConnected } = useAccount();
    const [delegatee, setDelegatee] = useState('');
    const [proposalDescription, setProposalDescription] = useState('');

    // Read Voting Power
    const { data: votingPower } = useReadContract({
        address: ROLL_TOKEN_ADDRESS,
        abi: ROLL_ABI,
        functionName: 'getVotes',
        args: [address],
        query: {
            enabled: isConnected
        }
    });

    // Delegate Config
    const { writeContract: delegate, isPending: isDelegating } = useWriteContract();

    // Initial simple mockup for Proposal List (would need event indexing for real history)
    const [activeTab, setActiveTab] = useState('vote');

    const handleDelegate = () => {
        if (!delegatee.startsWith('0x')) return;
        delegate({
            address: ROLL_TOKEN_ADDRESS,
            abi: ROLL_ABI,
            functionName: 'delegate',
            args: [delegatee]
        });
    }

    return (
        <section className="py-20 bg-black text-white relative overflow-hidden" id="governance">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        DAO Governance
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        The Beetle Roll DAO allows token holders to steer the future of the ecosystem.
                        Delegate your voting power or create proposals to influence funding and development.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Voting Power & Delegation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Vote className="w-8 h-8 text-blue-400" />
                            <h3 className="text-2xl font-bold">Your Voice</h3>
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                            <p className="text-sm text-gray-400 mb-1">Current Voting Power</p>
                            <div className="text-3xl font-bold text-white">
                                {votingPower ? formatEther(votingPower) : '0'} <span className="text-blue-400 text-lg">Votes</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                1 ROLL = 1 Vote. You must delegate to yourself to vote.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-300">Delegate Votes via Address</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="0x..."
                                    className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    value={delegatee}
                                    onChange={(e) => setDelegatee(e.target.value)}
                                />
                                <button
                                    onClick={handleDelegate}
                                    disabled={!delegate || isDelegating || !delegatee}
                                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2"
                                >
                                    {isDelegating ? "Delegating..." : "Delegate"}
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    setDelegatee(address);
                                }}
                                className="text-xs text-blue-400 hover:text-blue-300 underline"
                            >
                                Delegate to myself (Activate my voting power)
                            </button>
                        </div>
                    </motion.div>

                    {/* Proposals */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-emerald-400" />
                                <h3 className="text-2xl font-bold">Active Proposals</h3>
                            </div>
                            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20">
                                Live
                            </span>
                        </div>

                        {/* Placeholder for no proposals */}
                        <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
                            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-gray-500" />
                            </div>
                            <h4 className="text-lg font-medium text-gray-300 mb-2">No Active Proposals</h4>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
                                The DAO is currently quiet. Be the first to start a discussion.
                            </p>

                            {/* Simple Proposal Form Mockup */}
                            <div className="mt-6 pt-6 border-t border-gray-800">
                                <h5 className="text-left text-sm font-medium text-gray-300 mb-3">Create Proposal (Requires 100k Votes)</h5>
                                <textarea
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 h-24 text-sm mb-3"
                                    placeholder="Proposal Description..."
                                    value={proposalDescription}
                                    onChange={(e) => setProposalDescription(e.target.value)}
                                />
                                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all">
                                    Submit Proposal (Simulated)
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default GovernanceDashboard;
