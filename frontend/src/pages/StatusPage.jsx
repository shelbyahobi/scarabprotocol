import React, { useState, useEffect } from 'react';
import { Network, Server, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../config';

export default function StatusPage() {
    const [contracts, setContracts] = useState(null);

    useEffect(() => {
        // Attempt to load deployment addresses from testnet.json
        // Falls back to CONFIG constants if file doesn't exist
        fetch('/deployments/testnet.json')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    setContracts(data);
                } else {
                    // Fallback to known config addresses
                    setContracts({
                        ScarabToken: CONFIG.SCARAB_TOKEN_ADDRESS,
                        DeviceRegistry: CONFIG.DEVICE_REGISTRY_ADDRESS,
                        EmissionController: CONFIG.EMISSION_CONTROLLER_ADDRESS,
                        ProductionValidator: CONFIG.PRODUCTION_VALIDATOR_ADDRESS,
                        TreasuryVault: CONFIG.TREASURY_VAULT_ADDRESS,
                        SeedSale: CONFIG.SEED_SALE_ADDRESS
                    });
                }
            })
            .catch(() => {
                setContracts({
                    ScarabToken: CONFIG.SCARAB_TOKEN_ADDRESS,
                    DeviceRegistry: CONFIG.DEVICE_REGISTRY_ADDRESS,
                    EmissionController: CONFIG.EMISSION_CONTROLLER_ADDRESS
                });
            });
    }, []);

    return (
        <div className="min-h-screen bg-[#050B08] text-white p-8 pt-24 font-sans max-w-4xl mx-auto">
            <Link to="/" className="text-gray-500 hover:text-white mb-8 inline-block">&larr; Back to Home</Link>
            
            <div className="mb-12">
                <h1 className="text-4xl font-black mb-2">SCARAB Network Status</h1>
                <p className="text-gray-400">Current operational state of protocol infrastructure.</p>
            </div>

            <div className="grid gap-6">
                
                {/* Contract Addresses */}
                {contracts && (
                    <div className="bg-black border border-beetle-green/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <ExternalLink className="text-beetle-green" />
                            <h2 className="text-xl font-bold">Deployed Contracts (BSC Testnet)</h2>
                        </div>
                        <div className="space-y-3">
                            {Object.entries(contracts).map(([name, address]) => (
                                <div key={name} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                    <span className="text-sm font-bold text-gray-300">{name}</span>
                                    <a 
                                        href={`https://testnet.bscscan.com/address/${address}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs font-mono text-beetle-green hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        {typeof address === 'string' ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A'}
                                        <ExternalLink size={10} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Protocol Tier */}
                <div className="bg-black border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <Network className="text-white" />
                        <h2 className="text-xl font-bold">On-Chain Protocol</h2>
                    </div>
                    <div className="space-y-4">
                        <StatusRow label="BSC Testnet Deployment" status="Operational" color="text-beetle-green" dot="bg-beetle-green" />
                        <StatusRow label="Smart Contract Security Review" status="In Progress" color="text-yellow-500" dot="bg-yellow-500 animate-pulse" />
                        <StatusRow label="BSC Mainnet (Q3 2026 Target)" status="Pending Audit" color="text-gray-500" dot="bg-gray-500" />
                    </div>
                </div>

                {/* Infrastructure Tier */}
                <div className="bg-black border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <Server className="text-white" />
                        <h2 className="text-xl font-bold">Relay Infrastructure</h2>
                    </div>
                    <div className="space-y-4">
                        <StatusRow label="Oracle Worker Node" status="Operational" color="text-beetle-green" dot="bg-beetle-green" />
                        <StatusRow label="Hetzner Cloud (Frankfurt)" status="Operational" color="text-beetle-green" dot="bg-beetle-green" />
                        <StatusRow label="Redis Persistence Layer" status="Operational" color="text-beetle-green" dot="bg-beetle-green" />
                        <StatusRow label="API3 External Adapter (UCO Price)" status="Development" color="text-blue-500" dot="bg-blue-500" />
                    </div>
                </div>

                {/* Third Party */}
                <div className="bg-black border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <ShieldCheck className="text-white" />
                        <h2 className="text-xl font-bold">External Dependencies</h2>
                    </div>
                    <div className="space-y-4">
                        <StatusRow label="PancakeSwap V3 Pool Router" status="Operational (Testnet)" color="text-beetle-green" dot="bg-beetle-green" />
                        <StatusRow label="ESG Registry Data Pipeline" status="Development" color="text-blue-500" dot="bg-blue-500" />
                        <StatusRow label="ISCC Certification Verification" status="Pilot Review" color="text-orange-500" dot="bg-orange-500" />
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-gray-600">
                Protocol: SCARAB DAO LLC (Wyoming) · EU Ops: SCARAB UG (Germany)
            </div>
            <div className="mt-2 text-center text-xs text-gray-600 font-mono flex items-center justify-center gap-2">
                <Clock size={12} /> Last updated: {new Date().toISOString()}
            </div>
        </div>
    );
}

function StatusRow({ label, status, color, dot }) {
    return (
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/5">
            <span className="font-bold text-gray-300">{label}</span>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dot}`}></div>
                <span className={`text-sm font-bold ${color}`}>{status}</span>
            </div>
        </div>
    );
}
