// Centralized Configuration with Fallbacks
// This ensures the app doesn't crash even if Vercel env vars are missing.

export const CONFIG = {
    PROJECT_ID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '3a8170812b534d0ff9d794f35a9cc25e',
    CHAIN_ID: parseInt(import.meta.env.VITE_CHAIN_ID || '97'),

    // RPC URLs
    RPC_URL_TESTNET: import.meta.env.VITE_RPC_URL || 'https://bsc-testnet-rpc.publicnode.com',
    RPC_URL_MAINNET: import.meta.env.VITE_RPC_URL_MAINNET || 'https://bsc-rpc.publicnode.com',

    // Contract Addresses (Fallbacks to the ones known from previous chats)
    ROLL_TOKEN_ADDRESS: import.meta.env.VITE_ROLL_TOKEN_ADDRESS || '0x3bc35632A0FdFd881A6342180Db2DBB4af8D832c',
    SEED_SALE_ADDRESS: import.meta.env.VITE_SEED_SALE_ADDRESS || '0xe728096AE39d68681E3292d27ecF6C909C9b8335',
    GOVERNOR_ADDRESS: import.meta.env.VITE_GOVERNOR_ADDRESS || '0xC15Ba632581DA4d347Ebb2235Ce44F4AB80e8dA9',
    TIMELOCK_ADDRESS: import.meta.env.VITE_TIMELOCK_ADDRESS || '0x79247eb866A4297800d984cf63A824A456C98305',
};

// Console warning if running on defaults in production (optional debugging helper)
if (!import.meta.env.VITE_SEED_SALE_ADDRESS) {
    console.warn("⚠️ Config: Using fallback SEED_SALE_ADDRESS. Check Vercel Env Vars.");
}
