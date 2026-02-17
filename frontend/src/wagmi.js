import { http } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Ensure we always have a string for Project ID
const rawProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
const projectId = (rawProjectId && rawProjectId.length > 0)
    ? rawProjectId
    : '3a8170812b534d0ff9d794f35a9cc25e'; // Fallback

export const wagmiConfig = getDefaultConfig({
    appName: '$ROLL Dung Beetle',
    projectId: projectId,
    chains: [bsc, bscTestnet],
    transports: {
        [bsc.id]: http('https://bsc-rpc.publicnode.com'), // More stable public RPC
        [bscTestnet.id]: http('https://bsc-testnet-rpc.publicnode.com'), // More stable testnet RPC
    },
    ssr: false,
});

export const chains = [bsc, bscTestnet];
