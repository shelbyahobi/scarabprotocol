import { http } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { CONFIG } from './config';

export const wagmiConfig = getDefaultConfig({
    appName: '$SCARAB Protocol',
    projectId: CONFIG.PROJECT_ID || '8259b6fe9bceabaffbaafb1aaefea062', // Reown/WalletConnect ID
    chains: [bsc, bscTestnet],
    transports: {
        [bsc.id]: http(CONFIG.RPC_URL_MAINNET, {
            batch: true,
            retryCount: 3,
        }),
        [bscTestnet.id]: http(CONFIG.RPC_URL_TESTNET, {
            batch: true,
            retryCount: 3,
            timeout: 10_000, // Optimize timeouts
        }),
    },
    syncConnectedChain: true, // Keep chain aligned with MetaMask instantly
    ssr: false,
});

export const chains = [bsc, bscTestnet];
