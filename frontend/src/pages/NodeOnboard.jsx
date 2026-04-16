import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function NodeOnboard() {
    const { isConnected } = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (isConnected) {
            navigate('/dashboard/node');
        }
    }, [isConnected, navigate]);

    return (
        <div className="min-h-screen bg-[#050a05] text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#0a1a0f] border border-white/10 rounded-2xl p-8 space-y-8 text-center">
                <h2 className="text-3xl font-black text-white">Node Operator Access</h2>
                <p className="text-gray-400">Connect your Web3 wallet to manage your verified hardware fleet and view on-chain rewards.</p>
                
                <div className="flex justify-center mt-8">
                    <ConnectButton showBalance={false} chainStatus="icon" />
                </div>

                <div className="text-xs text-gray-500 mt-8 pt-6 border-t border-white/5">
                    Requires MetaMask, WalletConnect, or compatible injected provider.
                </div>
            </div>
        </div>
    );
}
