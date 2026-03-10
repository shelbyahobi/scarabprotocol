// Centralized Configuration with Fallbacks
// This ensures the app doesn't crash even if Vercel env vars are missing.

export const CONFIG = {
    PROJECT_ID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '3a8170812b534d0ff9d794f35a9cc25e',
    CHAIN_ID: parseInt(import.meta.env.VITE_CHAIN_ID || '97'),

    // RPC URLs (Optimized for Speed)
    RPC_URL_TESTNET: import.meta.env.VITE_RPC_URL || 'https://bsc-testnet.public.blastapi.io',
    RPC_URL_MAINNET: import.meta.env.VITE_RPC_URL_MAINNET || 'https://bsc-rpc.publicnode.com',

    // Contract Addresses (Fallbacks to the ones known from previous chats)
    ROLL_TOKEN_ADDRESS: import.meta.env.VITE_ROLL_TOKEN_ADDRESS || '0x9A5AAA7663A829e3d9F9Dd9E39E746b67f3F8CBA', // SCARAB Token
    SEED_SALE_ADDRESS: import.meta.env.VITE_SEED_SALE_ADDRESS || '0xA9Cbd585263b36e9236C49cBb7254DFE055c0083', // Phase 1 Sale
    GOVERNOR_ADDRESS: import.meta.env.VITE_GOVERNOR_ADDRESS || '0xC15Ba632581DA4d347Ebb2235Ce44F4AB80e8dA9',
    TIMELOCK_ADDRESS: import.meta.env.VITE_TIMELOCK_ADDRESS || '0x79247eb866A4297800d984cf63A824A456C98305',

    // DePIN Suite — deployed to BSC Testnet 2026-02-22
    TREASURY_VAULT_ADDRESS: import.meta.env.VITE_TREASURY_VAULT_ADDRESS || '0x929716d3360182fee990fB101e5BC6Db6aeFBD4A',
    EMISSION_CONTROLLER_ADDRESS: import.meta.env.VITE_EMISSION_CONTROLLER_ADDRESS || '0x335c5fa723e66bb5237E61Adf3f39C25eE1a023A',
    DEVICE_REGISTRY_ADDRESS: import.meta.env.VITE_DEVICE_REGISTRY_ADDRESS || '0x0756c8B801eFDf8E3dAa0093126c766d896e3492',
    PRODUCTION_VALIDATOR_ADDRESS: import.meta.env.VITE_PRODUCTION_VALIDATOR_ADDRESS || '0x7a6f82930B686f381282abc160bbcB117A3253b0',
    TEAM_VESTING_ADDRESS: import.meta.env.VITE_TEAM_VESTING_ADDRESS || '0x319923184a105Db69dbcB309A971AE22657FC9d6',
    MARKETING_TIMELOCK_ADDRESS: import.meta.env.VITE_MARKETING_TIMELOCK_ADDRESS || '0x60300bc99eedF706aC724A162b49235698aB40d4',
    HARDWARE_PREORDER_ADDRESS: import.meta.env.VITE_HARDWARE_PREORDER_ADDRESS || '0x438682F8C88B97CAc9dC219e2eEDCC44040aBeF2',
    MOCK_USDC_ADDRESS: import.meta.env.VITE_MOCK_USDC_ADDRESS || '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
};

// Console warning if running on defaults in production (optional debugging helper)
if (!import.meta.env.VITE_SEED_SALE_ADDRESS) {
    console.warn("⚠️ Config: Using fallback SEED_SALE_ADDRESS. Check Vercel Env Vars.");
}
