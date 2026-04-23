import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { CONFIG } from '../config';
import { useDemoMode } from '../hooks/useDemoMode';
import { DEMO_NODE, DEMO_TRANSACTIONS } from '../data/demoSeedData';

const SCARAB_ABI = [
    "function balanceOf(address owner) view returns (uint256)"
];

const mockMultipliers = [
    { id: 'BOK-9942', type: 'Bokashi Node', efficiency: '1.05x', cluster: '1.20x', activity: '1.00x', total: '1.26x' },
    { id: 'SOL-1124', type: 'Solar Sentinel', efficiency: '0.95x', cluster: '1.00x', activity: '1.10x', total: '1.045x' }
];

export default function NodeDashboard() {
    const { address, isConnected } = useAccount();
    const isDemoMode = useDemoMode();
    const [scarabBalance, setScarabBalance] = useState(null);
    const [txHistory, setTxHistory] = useState([]);
    const [loadingTx, setLoadingTx] = useState(false);

    useEffect(() => {
        if (isDemoMode) {
            setScarabBalance(DEMO_NODE.scarab_balance.toString());
            setTxHistory(DEMO_TRANSACTIONS);
            return;
        }
        const fetchBalance = async () => {
            if (!address) return;
            try {
                // Connect via public RPC
                const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL_TESTNET);
                const contract = new ethers.Contract(CONFIG.SCARAB_TOKEN_ADDRESS, SCARAB_ABI, provider);
                const balance = await contract.balanceOf(address);
                setScarabBalance(ethers.formatUnits(balance, 18));
            } catch (err) {
                console.error("Failed to fetch balance:", err);
                setScarabBalance("0.00");
            }
        };

        const fetchTxHistory = async () => {
             if (!address) return;
             setLoadingTx(true);
             try {
                 const apiKey = import.meta.env.VITE_BSCSCAN_API_KEY || '';
                 const url = `https://api-testnet.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=5&sort=desc&apikey=${apiKey}`;
                 const response = await fetch(url);
                 const data = await response.json();
                 if (data.status === "1") {
                     setTxHistory(data.result);
                 } else {
                     setTxHistory([]);
                 }
             } catch (err) {
                 console.error("Failed to fetch tx history:", err);
                 setTxHistory([]);
             } finally {
                 setLoadingTx(false);
             }
        };

        if (isConnected && !isDemoMode) {
            fetchBalance();
            fetchTxHistory();
        }
    }, [address, isConnected, isDemoMode]);

    // Truncate address for header
    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    if (!isConnected && !isDemoMode) {
        return (
            <div className="min-h-screen bg-[#050a05] text-white flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Node Operator Access</h2>
                    <p className="text-gray-400 mb-6">Please connect your wallet to access the Node Dashboard.</p>
                </div>
            </div>
        );
    }

    const displayAddress = isDemoMode ? DEMO_NODE.wallet : address;

    return (
        <div className="min-h-screen bg-[#050a05] text-white p-4 md:p-8">
            {isDemoMode && (
                <div className="fixed top-0 left-0 w-full bg-amber-500 text-black text-center text-sm font-bold py-2 z-50">
                    Demo Mode — Simulated data for presentation purposes. No real transactions.
                </div>
            )}
            <div className={`max-w-6xl mx-auto space-y-8 ${isDemoMode ? 'mt-24' : 'mt-16'}`}>
                
                {/* SECTION A — Wallet header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <span className="bg-white/10 px-3 py-1 rounded-lg text-lg font-mono text-gray-300 border border-white/20">
                                {formatAddress(displayAddress)}
                            </span>
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">BSC Testnet</span>
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#1D9E75]/20 text-[#1D9E75] border border-[#1D9E75]/30">{isDemoMode ? DEMO_NODE.registered_devices : 2} Devices Registered</span>
                    </div>
                </div>

                {/* SECTION B — Metrics row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0a1a0f] border border-white/10 rounded-2xl p-6" data-testid="node-scarab-balance">
                        <div className="text-sm font-medium text-gray-400 mb-2">SCARAB Balance</div>
                        <div className="text-3xl font-black text-[#D4AF37]">
                            {scarabBalance === null ? <div className="h-9 w-24 bg-white/5 animate-pulse rounded"></div> : parseFloat(scarabBalance).toFixed(2)}
                        </div>
                    </div>
                    <div className="bg-[#0a1a0f] border border-white/10 rounded-2xl p-6" data-testid="node-bru-epoch">
                        <div className="text-sm font-medium text-gray-400 mb-2">BRU This Epoch</div>
                        <div className="text-3xl font-black text-white">{isDemoMode ? DEMO_NODE.bru_this_epoch.toLocaleString() : '41.5'}</div>
                    </div>
                    <div className="bg-[#0a1a0f] border border-white/10 rounded-2xl p-6" data-testid="node-staked">
                        <div className="text-sm font-medium text-gray-400 mb-2">Staked Amount</div>
                        <div className="text-3xl font-black text-white">{isDemoMode ? DEMO_NODE.staked_scarab.toLocaleString() : '10,000'} <span className="text-lg text-gray-500">SCARAB</span></div>
                    </div>
                    <div className="bg-black border border-[#1D9E75]/30 rounded-2xl p-6" data-testid="node-claimable">
                        <div className="text-sm font-medium text-gray-400 mb-2">Claimable Rewards</div>
                        <div className="text-3xl font-black text-[#1D9E75]">{isDemoMode ? DEMO_NODE.claimable_rewards_scarab.toLocaleString() : '1,250'} <span className="text-lg text-[#1D9E75]/50">SCARAB</span></div>
                        <button className="mt-3 text-xs bg-[#1D9E75] text-black font-bold px-4 py-1.5 rounded hover:bg-white transition-colors">Claim Now</button>
                    </div>
                </div>

                {/* SECTION C — Multiplier breakdown card */}
                <div className="bg-[#0a1a0f] border border-white/10 rounded-2xl p-6 overflow-hidden" data-testid="node-multipliers">
                    <h3 className="text-lg font-bold text-white mb-6">Multiplier Breakdown</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-sm">
                            <thead className="text-gray-500 border-b border-white/5">
                                <tr>
                                    <th className="pb-3 font-medium">Device ID</th>
                                    <th className="pb-3 font-medium">Type</th>
                                    <th className="pb-3 font-medium text-right">Efficiency</th>
                                    <th className="pb-3 font-medium text-right">Cluster</th>
                                    <th className="pb-3 font-medium text-right">Activity</th>
                                    <th className="pb-3 font-medium text-right text-white">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {/* TODO: Fetch exact multipliers from ProductionValidator */}
                                {mockMultipliers.map((dev) => (
                                    <tr key={dev.id}>
                                        <td className="py-4 text-[#D4AF37]">{dev.id}</td>
                                        <td className="py-4 text-gray-300">{dev.type}</td>
                                        <td className="py-4 text-right text-green-400">{dev.efficiency}</td>
                                        <td className="py-4 text-right text-green-400">{dev.cluster}</td>
                                        <td className="py-4 text-right text-gray-400">{dev.activity}</td>
                                        <td className="py-4 text-right font-bold text-white">{dev.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SECTION D — On-chain activity feed */}
                <div className="bg-[#0a1a0f] border border-white/10 rounded-2xl p-6" data-testid="node-tx-feed">
                    <h3 className="text-lg font-bold text-white mb-6">On-chain Activity Feed</h3>
                    {loadingTx ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-white/5 animate-pulse rounded-xl"></div>
                            ))}
                        </div>
                    ) : txHistory.length > 0 ? (
                        <div className="space-y-3">
                            {txHistory.map((tx, idx) => (
                                <div key={tx.hash || idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-black border border-white/5 rounded-xl p-4 gap-3">
                                    <div>
                                        <div className="font-bold text-gray-300 capitalize">
                                            {isDemoMode ? tx.type : (tx.functionName ? tx.functionName.split('(')[0] : 'Transfer')}
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono mt-1">
                                            {isDemoMode ? tx.age : new Date(tx.timeStamp * 1000).toLocaleString()}
                                        </div>
                                    </div>
                                    <a 
                                        href={isDemoMode ? '#' : `https://testnet.bscscan.com/tx/${tx.hash}`}
                                        target={isDemoMode ? '_self' : '_blank'} rel="noreferrer"
                                        className="text-sm font-mono text-[#D4AF37] hover:text-white transition-colors bg-[#D4AF37]/10 px-3 py-1.5 rounded border border-[#D4AF37]/20 text-center"
                                    >
                                        {formatAddress(tx.hash)}
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-xl">
                            No transactions found for this address.
                        </div>
                    )}
                </div>

                {/* SECTION E — Contract quick-links */}
                <div className="bg-black/50 border border-white/5 rounded-2xl p-6" data-testid="node-contract-links">
                    <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Protocol Contracts</h3>
                    <div className="flex flex-wrap gap-3">
                        <a href={`https://testnet.bscscan.com/address/${CONFIG.SCARAB_TOKEN_ADDRESS}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-mono text-gray-300 transition-colors">
                            ScarabToken
                        </a>
                        <a href={`https://testnet.bscscan.com/address/${CONFIG.DEVICE_REGISTRY_ADDRESS}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-mono text-gray-300 transition-colors">
                            DeviceRegistry
                        </a>
                        <a href={`https://testnet.bscscan.com/address/${CONFIG.PRODUCTION_VALIDATOR_ADDRESS}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-mono text-gray-300 transition-colors">
                            ProductionValidator
                        </a>
                        <a href={`https://testnet.bscscan.com/address/${CONFIG.EMISSION_CONTROLLER_ADDRESS}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-mono text-gray-300 transition-colors">
                            EmissionController
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
