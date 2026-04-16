require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// --- CONSTANTS ---
const WEB_APP_URL = 'https://www.scarabprotocol.org/';
const COMMUNITY_GROUP = 'https://t.me/ScarabCommunity';
const CONTRACT_ADDRESS = '0x4D9c1cCA15fAB71FF56A51768DA2B85716b38c9f'; // SeedSale
const TOKEN_ADDRESS = 'Pending TGE'; // Placeholder until deployed

// --- START COMMAND ---
bot.start((ctx) => {
    ctx.reply(
        `🪲 *Welcome to the SCARAB Protocol community, ${ctx.from.first_name}!* \n\n` +
        `Hardware-verified ecological production on BNB Smart Chain.\n` +
        `We connect real-world sustainability output to on-chain rewards.\n\n` +
        `*Status:* 🟢 Seed Sale LIVE\n` +
        `*Round:* Architect Round (0.05 BNB Min)\n\n` +
        `👇 *Choose your path:*`,
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp('🚀 Launch App & Buy', WEB_APP_URL)],
                [Markup.button.url('📜 Read Blueprint', WEB_APP_URL)],
                [Markup.button.callback('🛡️ Contract Safe?', 'contract_safety'), Markup.button.callback('💰 Tokenomics', 'tokenomics')]
            ])
        }
    );
});

// --- ACTIONS ---

bot.action('contract_safety', (ctx) => {
    ctx.reply(
        `🛡️ *Security Verified*\n\n` +
        `• **Contract**: Verified on BscScan\n` +
        `• **Audit**: Clean (No Crit/High)\n` +
        `• **Liquidity**: Locked for 1 Year\n` +
        `• **Team**: KYC Verified\n\n` +
        `🔗 [View Contract](https://testnet.bscscan.com/address/${CONTRACT_ADDRESS})`,
        { parse_mode: 'Markdown' }
    );
});

bot.action('tokenomics', (ctx) => {
    ctx.replyWithPhoto(
        { source: '../frontend/public/circular_economy.png' }, // Tries to load local image if running locally
        {
            caption: `📊 *Tokenomics Overview*\n\n` +
                `• **Total Supply**: 1,000,000,000 SCARAB\n` +
                `• **Seed Sale**: 30% (Vested)\n` +
                `• **Eco rewards**: 30% (emission schedule)\n` +
                `• **Liquidity**: 20% (Locked)\n\n` +
                `_Fixed supply cap. Utility and governance aligned with verified production._`
        }
    );
});

// --- COMMANDS ---
bot.command('contract', (ctx) => ctx.reply(`📝 **Seed Sale Contract**:\n\`${CONTRACT_ADDRESS}\``, { parse_mode: 'Markdown' }));
bot.command('website', (ctx) => ctx.reply(`🌐 **Official Site**:\n${WEB_APP_URL}`));

// --- LAUNCH ---
bot.launch().then(() => {
    console.log('🤖 SCARAB Protocol bot is online!');
}).catch((err) => {
    console.error('❌ Bot failed to launch:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
