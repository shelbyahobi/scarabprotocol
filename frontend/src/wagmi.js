import { http } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { CONFIG } from './config';

export const wagmiConfig = getDefaultConfig({
    appName: '$ROLL Dung Beetle',
    projectId: CONFIG.PROJECT_ID,
    chains: [bsc, bscTestnet],
    transports: {
        [bsc.id]: http(CONFIG.RPC_URL_MAINNET),
        [bscTestnet.id]: http(CONFIG.RPC_URL_TESTNET),
    },
    ssr: false,
});

export const chains = [bsc, bscTestnet];
