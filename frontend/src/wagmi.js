import { createConfig, http } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
    console.warn("VITE_WALLET_CONNECT_PROJECT_ID not found, using fallback.");
}

export const wagmiConfig = getDefaultConfig({
    appName: '$ROLL Dung Beetle',
    projectId: projectId || '3a8170812b534d0ff9d794f35a9cc25e',
    chains: [bsc, bscTestnet],
    transports: {
        [bsc.id]: http(import.meta.env.VITE_RPC_URL_MAINNET || 'https://bsc-dataseed.binance.org'),
        [bscTestnet.id]: http(import.meta.env.VITE_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545'),
    },
    ssr: false,
});

export const chains = [bsc, bscTestnet];
