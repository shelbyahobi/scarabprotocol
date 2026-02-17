import { createConfig, http } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const wagmiConfig = getDefaultConfig({
    appName: '$ROLL Dung Beetle',
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    chains: [bsc, bscTestnet],
    transports: {
        [bsc.id]: http(import.meta.env.VITE_RPC_URL_MAINNET || 'https://bsc-dataseed.binance.org'),
        [bscTestnet.id]: http(import.meta.env.VITE_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545'),
    },
    // ssr: false, // Uncomment if moving to Next.js
});

export const chains = [bsc, bscTestnet];
