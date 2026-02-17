require('dotenv').config();
const { Telegraf, Markup, session } = require('telegraf');

// Initialize Bot
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

// --- CONSTANTS ---
const WEB_APP_URL = "https://roll-token-official.vercel.app/";
const COMMUNITY_GROUP = "https://t.me/rolltoken";
const SEED_SALE_ADDRESS = "0xfc95cC5185530c2c386f5Cfc5c68157B6E8bF4F5"; // Updated Deployment
const TWITTER_URL = "https://x.com/roll_token";
const BLUEPRINT_URL = "https://roll-token-official.vercel.app/"; // Deep link if possible

// --- MIDDLEWARE: ERROR HANDLING ---
bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

// --- COMMAND: /start (The Onboarding Flow) ---
bot.start((ctx) => {
    ctx.session = { step: 'verification' };

    // 1. Verification Step (Anti-Bot)
    ctx.reply(
        `🛡️ *Security Check*\n\n` +
        `Welcome, ${ctx.from.first_name}! Before we enter the Colony, please prove you are human.`,
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                Markup.button.callback("✅ I am Human", "verify_human")
            ])
        }
    );
});

// --- ACTION: Verification Success ---
bot.action("verify_human", async (ctx) => {
    // Delete verification message to clean up chat
    try {
        await ctx.deleteMessage();
    } catch (e) { }

    // 2. The Grand Welcome
    await ctx.replyWithPhoto(
        { url: 'https://roll-token-official.vercel.app/logo_eco.jpg' }, // Use hosted image
        {
            caption: `🪲 *Access Granted: Welcome to the Colony!* 🪲\n\n` +
                `You are now a recruit in the **ROLL Ecosystem**.\n` +
                `We are building the currency of physical resilience.\n\n` +
                `👇 *Your Mission Briefing:*`,
            parse_mode: 'Markdown'
        }
    );

    // 3. Onboarding Menu (Persistent)
    await ctx.reply(
        "Use the menu below to navigate:",
        Markup.keyboard([
            ["🚀 Buy $ROLL (Seed Sale)", "📜 Read Blueprint"],
            ["🔥 Community Hub", "❓ FAQ / Help"],
            ["📊 Check Contract", "🌐 Website"]
        ]).resize()
    );
});

// --- MAIN MENU HANDLERS ---

bot.hears("🚀 Buy $ROLL (Seed Sale)", (ctx) => {
    ctx.reply(
        `💎 *SEED SALE IS LIVE!*\n\n` +
        `• **Price**: 1 BNB = 100,000 ROLL\n` +
        `• **Min**: 0.05 BNB\n` +
        `• **Bonus**: 5% Referral Rewards\n\n` +
        `👇 *Click below to join safely:*`,
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp("🚀 Launch App to Buy", WEB_APP_URL)],
                [Markup.button.url("📖 How to Buy Guide", WEB_APP_URL)]
            ])
        }
    );
});

bot.hears("📜 Read Blueprint", (ctx) => {
    ctx.reply(
        `📘 *The Master Plan*\n\n` +
        `Understand the mechanics behind the Dung Beetle Deflator and Eco-Mining.\n`,
        Markup.inlineKeyboard([
            Markup.button.url("📑 Open Whitepaper", BLUEPRINT_URL)
        ])
    );
});

bot.hears("🔥 Community Hub", (ctx) => {
    ctx.reply(
        `🌍 *Join the Conversation*\n\n` +
        `Stay updated and chat with fellow beetles.`,
        Markup.inlineKeyboard([
            [Markup.button.url("🐦 Twitter (X)", TWITTER_URL)],
            [Markup.button.url("📢 Telegram Channel", COMMUNITY_GROUP)]
        ])
    );
});

bot.hears(["❓ FAQ / Help", "help"], (ctx) => {
    ctx.reply(
        `🤖 *Colony Commander Help*\n\n` +
        `**Q: What is ROLL?**\n` +
        `A: A meme token with physical utility (Solar/Agri-Tech).\n\n` +
        `**Q: When Launch?**\n` +
        `A: After Seed Sale HardCap is hit.\n\n` +
        `**Q: Is it safe?**\n` +
        `A: Contract Audit passed. Team KYC verified.\n\n` +
        `*Need support? Tag an admin!*`
    );
});

bot.hears(["📊 Check Contract", "ca", "contract"], (ctx) => {
    ctx.reply(
        `📝 *Official Contract Addresses*\n\n` +
        `🔹 **Seed Sale**: \`${SEED_SALE_ADDRESS}\`\n` +
        `🔹 **Token**: (Pending TGE)\n\n` +
        `⚠️ *Beware of fakes! Always verify on our official site.*`,
        { parse_mode: 'Markdown' }
    );
});

bot.hears("🌐 Website", (ctx) => {
    ctx.reply(`🌐 **Official Website**:\n${WEB_APP_URL}`);
});

// --- SMART AUTO-REPLIES ---

// Keywords: Price
bot.hears(/price/i, (ctx) => {
    ctx.reply("💰 **Current Price**: 100,000 ROLL per 1 BNB (Architect Round)");
});

// Keywords: Scam/Fake
bot.hears(/scam|fake|honeypot/i, (ctx) => {
    ctx.reply("🛡️ **Safety First**: Our contract is audited and liquidity will be verified locked on launch. Do not click suspicious links in DMs!");
});

// --- GROUP EVENT HANDLERS ---

// Welcome New Members
bot.on('new_chat_members', async (ctx) => {
    // Loop through new members
    for (const member of ctx.message.new_chat_members) {
        if (member.is_bot) continue; // Ignore other bots

        const firstName = member.first_name || "Beetle";

        // Send a temporary welcome message that forces them to DM the bot for verification/menu
        // We can't show the full menu in the group as it spams everyone.
        // We link them to the bot's private chat.
        const welcomeMsg = await ctx.reply(
            `👋 *Welcome to the Colony, ${firstName}!* \n\n` +
            `To access the **Buy Menu**, **Whitepaper**, and **Support**, you must initialize your comms link.\n\n` +
            `👇 *Click below to start:*`,
            {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url("🚀 Initialize Comms (DM Bot)", `https://t.me/${ctx.botInfo.username}?start=group_join`)]
                ])
            }
        );

        // Optional: Auto-delete this message after 60 seconds to keep chat clean
        setTimeout(() => {
            ctx.telegram.deleteMessage(ctx.chat.id, welcomeMsg.message_id).catch(() => { });
        }, 60000);
    }
});

// --- LAUNCH ---
console.log('🤖 Colony Commander is starting...');
bot.launch().then(() => {
    console.log('✅ Colony Commander is ONLINE!');
}).catch((err) => {
    console.error('❌ Failed to launch:', err);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
