import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
    [bsc, bscTestnet],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: '$ROLL Dung Beetle',
    projectId: '3a8170812b534d0ff9d794f35a9cc25e', // WalletConnect Demo ID
    chains
});

export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
});

export { chains };
