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
        { url: 'https://roll-token-official.vercel.app/logo_eco.jpg' }, // Consider updating URL to a new SCARAB image in the future
        {
            caption: `🌍 *Access Granted: Welcome to the Ecosystem!* 🌍\n\n` +
                `You are now a part of **SCARAB Protocol**.\n` +
                `We are building a decentralized hardware network measuring Proof of Physical Work to back real-world value.\n\n` +
                `👇 *Your Mission Briefing:*`,
            parse_mode: 'Markdown'
        }
    );

    // 3. Onboarding Menu (Persistent)
    await ctx.reply(
        "Use the menu below to navigate the protocol:",
        Markup.keyboard([
            ["🚀 Buy $SCARAB (Seed Sale)", "📜 Read Blueprint"],
            ["🔥 Community Hub", "❓ FAQ / Help"],
            ["📊 Check Contract", "🌐 Website"]
        ]).resize()
    );
});

// --- MAIN MENU HANDLERS ---

bot.hears("🚀 Buy $SCARAB (Seed Sale)", (ctx) => {
    ctx.reply(
        `💎 *SEED SALE IS LIVE!*\n\n` +
        `• **Price**: 1 BNB = 100,000 SCARAB\n` +
        `• **Min**: 0.05 BNB\n` +
        `• **Bonus**: 5% Referral Rewards\n\n` +
        `👇 *Click below to access the secure Launchpad:*`,
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp("🚀 Launch DApp", WEB_APP_URL)],
                [Markup.button.url("📖 How to Join Guide", WEB_APP_URL)]
            ])
        }
    );
});

bot.hears("📜 Read Blueprint", (ctx) => {
    ctx.reply(
        `📘 *The Architecture Blueprint*\n\n` +
        `Dive into the mechanics behind our DePIN architecture, solar yield integration, and the Proof of Physical Work consensus.\n`,
        Markup.inlineKeyboard([
            Markup.button.url("📑 Read DePIN Manifesto", BLUEPRINT_URL)
        ])
    );
});

bot.hears("🔥 Community Hub", (ctx) => {
    ctx.reply(
        `🌍 *The Decentralized Grid*\n\n` +
        `Stay engaged with core contributors, node operators, and the community.`,
        Markup.inlineKeyboard([
            [Markup.button.url("🐦 Twitter (X)", TWITTER_URL)],
            [Markup.button.url("📢 Telegram Channel", COMMUNITY_GROUP)]
        ])
    );
});

bot.hears(["❓ FAQ / Help", "help"], (ctx) => {
    ctx.reply(
        `🤖 *SCARAB Protocol Command*\n\n` +
        `**Q: What is SCARAB?**\n` +
        `A: A DePIN (Decentralized Physical Infrastructure Network) optimizing environmental hardware like solar panels to generate verified, yielding data.\n\n` +
        `**Q: When is the Mainnet Launch?**\n` +
        `A: Following the completion of the hardware integration tests and the Seed Sale hardcap.\n\n` +
        `**Q: Is it safe?**\n` +
        `A: Yes. All contracts are audited and hardware uses ATECC608A cryptographic chips.\n\n` +
        `*Need engineering support? Tag an admin in the main channel!*`
    );
});

bot.hears(["📊 Check Contract", "ca", "contract"], (ctx) => {
    ctx.reply(
        `📝 *Official Protocol Contracts*\n\n` +
        `🔹 **Seed Sale Vault**: \`${SEED_SALE_ADDRESS}\`\n` +
        `🔹 **Token ($SCARAB)**: (Pending TGE)\n\n` +
        `⚠️ *Never send funds to random addresses! Always verify via the official dashboard.*`,
        { parse_mode: 'Markdown' }
    );
});

bot.hears("🌐 Website", (ctx) => {
    ctx.reply(`🌐 **Official SCARAB Application**:\n${WEB_APP_URL}`);
});

// --- SMART AUTO-REPLIES ---

// Keywords: Price
bot.hears(/price/i, (ctx) => {
    ctx.reply("💰 **Current Seed Price**: 100,000 SCARAB per 1 BNB. Subject to DAO adjustment post-launch.");
});

// Keywords: Scam/Fake
bot.hears(/scam|fake|honeypot/i, (ctx) => {
    ctx.reply("🛡️ **Protocol Security**: SCARAB contracts undergo rigorous audits. Hardware attestations prevent data spoofing. Always ensure you are on our official domains.");
});

// --- GROUP EVENT HANDLERS ---

// Welcome New Members
bot.on('new_chat_members', async (ctx) => {
    for (const member of ctx.message.new_chat_members) {
        if (member.is_bot) continue;

        const firstName = member.first_name || "Operator";

        const welcomeMsg = await ctx.reply(
            `👋 *Welcome to the SCARAB Protocol, ${firstName}!* \n\n` +
            `To access the **Launchpad DApp**, **DePIN Manifesto**, and **Hardware Specs**, please verify your connection below.\n\n` +
            `👇 *Click to Initialize:*`,
            {
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url("🚀 Initialize Comms (DM Bot)", `https://t.me/${ctx.botInfo.username}?start=group_join`)]
                ])
            }
        );

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
