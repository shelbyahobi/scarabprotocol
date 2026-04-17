require('dotenv').config();

/**
 * Validates the presence of required environment variables.
 * Crashes the Node process with a descriptive error if any are missing.
 * Prevents downstream failures in production.
 */
function validateEnv() {
    console.log("🚦 Starting SCARAB Protocol environment validation...");

    const requiredVars = [
        'AWS_REGION',
        'SQS_QUEUE_URL',
        'REDIS_URL',
        'OPENWEATHER_API_KEY',
        'BSC_TESTNET_RPC',
        'ORACLE_PRIVATE_KEY',
        'BSC_BATCH_CONTRACT',
        'BSC_BATCH_ABI_JSON',
        'ADMIN_SECRET'
    ];

    const missingVars = [];

    for (const envVar of requiredVars) {
        if (!process.env[envVar]) {
            missingVars.push(envVar);
        }
    }

    if (missingVars.length > 0) {
        console.error("❌ CRITICAL BOOT FAILURE: Missing Required Environment Variables");
        console.error("---------------------------------------------------------------");
        console.error("The following environment variables must be defined in your .env");
        console.error("file or runtime environment before this server can start:");
        console.error("");
        missingVars.forEach(v => console.error(`  - ${v}`));
        console.error("");
        console.error("Please supply them and restart the application.");
        console.error("---------------------------------------------------------------");
        process.exit(1);
    }

    console.log("✅ Environment validation passed.");
}

module.exports = { validateEnv };
