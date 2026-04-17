import React from 'react';
import { Network, Server, ShieldCheck, Clock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StatusPage() {
    return (
        <div className="min-h-screen bg-[#050B08] text-white p-8 pt-24 font-sans max-w-4xl mx-auto">
            <Link to="/" className="text-gray-500 hover:text-white mb-8 inline-block">&larr; Back to Home</Link>
            
            <div className="mb-12">
                <h1 className="text-4xl font-black mb-2">SCARAB Network Status</h1>
                <p className="text-gray-400">Current operational state of protocol infrastructure.</p>
            </div>

            <div className="grid gap-6">
                
                {/* Protocol Tier */}
                <div className="bg-black border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <Network className="text-white" />
                        <h2 className="text-xl font-bold">On-Chain Protocol</h2>
                    </div>

                    <div className="space-y-4">
                        <StatusRow label="BSC Testnet Deployment" status="Operational" color="text-beetle-green" dot="bg-beetle-green" />
                        <StatusRow label="Smart Contract Security Review" status="In Progress" color="text-yellow-500" dot="bg-yellow-500 animate-pulse" />
                        <StatusRow label="BSC Mainnet (Q3 2025 Target)" status="Pending Audit" color="text-gray-500" dot="bg-gray-500" />
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
                        <StatusRow label="AWS SQS Telemetry Queue" status="Operational" color="text-beetle-green" dot="bg-beetle-green" />
                        <StatusRow label="Hardware Authentication Edge" status="Operational" color="text-beetle-green" dot="bg-beetle-green" />
                        <StatusRow label="API3 External Adapter (UCO Price)" status="Development" color="text-blue-500" dot="bg-blue-500" />
                    </div>
                </div>

                {/* Third Party / Logistics */}
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

            <div className="mt-12 text-center text-xs text-gray-600 font-mono flex items-center justify-center gap-2">
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
