import React from 'react';
import { useReadContract } from 'wagmi';
import { Lock, Clock, ShieldCheck } from 'lucide-react';
import { CONFIG } from '../config';

// Import ABIs
import TeamVestingArtifact from '../abis/TeamVesting.json';
import MarketingTimelockArtifact from '../abis/MarketingTimelock.json';

const TeamVestingABI = TeamVestingArtifact.abi || TeamVestingArtifact;
const MarketingTimelockABI = MarketingTimelockArtifact.abi || MarketingTimelockArtifact;

export default function VestingDashboard() {
    // Team vesting info
    const { data: teamInfo } = useReadContract({
        address: CONFIG.TEAM_VESTING_ADDRESS,
        abi: TeamVestingABI,
        functionName: 'getVestingInfo'
    });

    // Marketing available amount
    const { data: marketingAvailable } = useReadContract({
        address: CONFIG.MARKETING_TIMELOCK_ADDRESS,
        abi: MarketingTimelockABI,
        functionName: 'availableAmount'
    });

    // Helper formats
    const formatScarab = (amount) => {
        if (!amount) return '0';
        return (Number(amount) / 1e18).toLocaleString(undefined, { maximumFractionDigits: 0 });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Loading...';
        return new Date(Number(timestamp) * 1000).toLocaleDateString();
    };

    return (
        <div className="bg-black/60 rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden mt-12">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-beetle-green/5 rounded-full blur-3xl -z-10 mt-[-50px] mr-[-50px]"></div>

            <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="text-beetle-gold/80" size={32} />
                <h3 className="text-3xl font-orbitron font-bold text-white tracking-wide">
                    Institutional Vault
                </h3>
            </div>

            {/* Team Allocation */}
            <div className="mb-10">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                    <Lock className="text-beetle-gold" size={20} />
                    Team Allocation (5% = 50M SCARAB)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                        <span className="text-gray-400 block mb-2 font-medium">Currently Vested</span>
                        <span className="text-white font-mono font-bold text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                            {teamInfo ? formatScarab(teamInfo[2]) : '0'} SCARAB
                        </span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                        <span className="text-gray-400 block mb-2 font-medium">Claimed</span>
                        <span className="text-white font-mono font-bold text-xl">
                            {teamInfo ? formatScarab(teamInfo[3]) : '0'} SCARAB
                        </span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                        <span className="text-gray-400 block mb-2 font-medium">First Unlock (Cliff)</span>
                        <span className="text-white font-mono font-bold text-lg text-beetle-electric">
                            {teamInfo ? formatDate(teamInfo[0]) : 'Loading...'}
                        </span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                        <span className="text-gray-400 block mb-2 font-medium">Fully Vested</span>
                        <span className="text-white font-mono font-bold text-lg text-beetle-green">
                            {teamInfo ? formatDate(teamInfo[1]) : 'Loading...'}
                        </span>
                    </div>
                </div>
                <div className="mt-3 px-2 text-xs text-gray-500 font-mono">
                    Contract: <span className="text-white/50">{CONFIG.TEAM_VESTING_ADDRESS}</span>
                </div>
            </div>

            {/* Marketing Allocation */}
            <div className="mb-6">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                    <Clock className="text-beetle-electric" size={20} />
                    Marketing Timelock (10% = 100M SCARAB)
                </h4>
                <div className="bg-gradient-to-r from-white/5 to-transparent border border-white/10 border-l-beetle-electric rounded-xl p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <span className="text-gray-400 block mb-1 font-medium">
                                Currently Available (after vesting)
                            </span>
                            <span className="text-white font-mono font-bold text-2xl drop-shadow-[0_0_8px_rgba(8,235,164,0.3)]">
                                {marketingAvailable !== undefined ? formatScarab(marketingAvailable) : '0'} SCARAB
                            </span>
                        </div>
                        <div className="bg-black/50 text-xs text-gray-400 p-4 rounded-lg border border-white/5 max-w-sm">
                            <ul className="space-y-2 list-disc list-inside">
                                <li>All transfers require <strong className="text-white">3-of-5 Admin Multi-sig</strong></li>
                                <li>Subject to <strong className="text-beetle-electric text-shadow-electric">48-Hour Public Timelock</strong> prior to execution</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500 font-mono">
                        Contract: <span className="text-white/50">{CONFIG.MARKETING_TIMELOCK_ADDRESS}</span>
                    </div>
                </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-8 bg-black/40 border border-green-500/20 rounded-xl p-5 flex items-center justify-center gap-4 py-6">
                <ShieldCheck className="text-green-500 w-10 h-10 animate-pulse-slow" />
                <div>
                    <p className="text-green-400 font-bold text-lg leading-tight text-shadow-electric">
                        Institutional-Grade Trust Architecture
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Allocations mechanically enforced by immutable Code • Zero "trust us" required.
                    </p>
                </div>
            </div>
        </div>
    );
}
