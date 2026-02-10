import { useState } from 'react';
import { motion } from 'framer-motion';

const WalletRow = ({ label, address, delay }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors"
        >
            <div className="flex flex-col mb-2 md:mb-0">
                <span className="text-beetle-gold font-bold text-sm uppercase tracking-wider">{label}</span>
                <span className="text-xs text-gray-500">Verified & Trackable</span>
            </div>
            <div className="flex items-center gap-3 bg-black/50 px-4 py-2 rounded-lg border border-white/5 font-mono text-sm text-gray-300 break-all">
                {address.slice(0, 6)}...{address.slice(-4)}
                <button
                    onClick={copyToClipboard}
                    className="ml-2 text-beetle-accent hover:text-white transition-colors text-xs uppercase"
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
                <a
                    href={`https://testnet.bscscan.com/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white transition-colors"
                >
                    Scan ↗
                </a>
            </div>
        </motion.div>
    );
};

export default function Transparency() {
    return (
        <section className="py-20 bg-black/50 backdrop-blur-sm border-t border-white/5 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-beetle-green/5 rounded-full blur-[100px] animate-pulse"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Built to Last. <span className="text-beetle-gold">Rolled to Perfection.</span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Most tokens are built on hype; $ROLL is built on labor. Nature’s hardest worker, the Dung Beetle, doesn't wait for luck—it takes what others discard and rolls it into a masterpiece.
                        We’ve replaced empty promises with hard-coded stability, ensuring the community has a fortress, not a tent.
                    </p>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-beetle-gold/10 rounded-full blur-3xl"></div>

                    <h3 className="text-2xl font-bold text-white mb-6">Community & Docs</h3>

                    <div className="space-y-4">
                        <a href="#" className="block group">
                            <div className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/5 group-hover:border-beetle-gold/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📢</span>
                                    <span className="text-white font-bold group-hover:text-beetle-gold transition-colors">Telegram Channel</span>
                                </div>
                                <span className="text-gray-500 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </a>

                        <a href="#" className="block group">
                            <div className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/5 group-hover:border-beetle-gold/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📄</span>
                                    <span className="text-white font-bold group-hover:text-beetle-gold transition-colors">Technical Blueprint</span>
                                </div>
                                <span className="text-gray-500 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </a>

                        <a href="#" className="block group">
                            <div className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-white/5 group-hover:border-beetle-gold/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🛍️</span>
                                    <span className="text-white font-bold group-hover:text-beetle-gold transition-colors">Future Shop Preview</span>
                                </div>
                                <span className="text-gray-500 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
