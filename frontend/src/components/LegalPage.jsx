import { useState } from 'react';
import { motion } from 'framer-motion';
import { LEGAL_DOCS } from '../data/legal';
import Navbar from './Navbar';
import { ArrowRight, FileText, Shield, HardDrive, ShoppingCart, Users, Coins } from 'lucide-react';
import { NavLink, Route, Routes, Navigate, useParams } from 'react-router-dom';

const LEGAL_NAV_ITEMS = [
    { id: 'tos', icon: FileText, label: 'Terms of Service' },
    { id: 'privacy', icon: Shield, label: 'Privacy Policy' },
    { id: 'hardware', icon: HardDrive, label: 'Hardware Agreement' },
    { id: 'refund', icon: ShoppingCart, label: 'Refund Policy' },
    { id: 'partnership', icon: Users, label: 'Partnership Agreement' },
    { id: 'token', icon: Coins, label: 'Token Sale (SAFT)' },
];

function LegalDocumentViewer() {
    const { documentId } = useParams();
    const doc = LEGAL_DOCS[documentId];

    if (!doc) {
        return <Navigate to="/legal/tos" replace />;
    }

    return (
        <motion.div
            key={documentId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#050A05] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
            <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{doc.title}</h1>
                <div className="hidden md:flex flex-col text-right">
                    <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">Last Updated</span>
                    <span className="text-sm text-beetle-gold font-bold">{doc.lastUpdated}</span>
                </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-h1:text-4xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:text-beetle-electric prose-p:text-gray-400 prose-p:leading-relaxed prose-li:text-gray-400 prose-strong:text-white prose-a:text-beetle-gold hover:prose-a:text-white transition-colors">
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(doc.content) }} />
            </div>
            
            <div className="mt-16 pt-8 border-t border-white/5 md:hidden flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">Updated:</span>
                <span className="text-sm text-beetle-gold font-bold">{doc.lastUpdated}</span>
            </div>
        </motion.div>
    );
}

// Simple markdown formatter tailored for our legal docs
function formatMarkdown(text) {
    let formatted = text;
    // Remove the topmost H1 as we render it in the React component header
    formatted = formatted.replace(/^#\s(.*?)$/m, '');
    // Headers
    formatted = formatted.replace(/##\s(.*?)$/gm, '<h2>$1</h2>');
    formatted = formatted.replace(/###\s(.*?)$/gm, '<h3>$1</h3>');
    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet points
    formatted = formatted.replace(/^- (.*?)$/gm, '<li>$1</li>');
    // Wrap lists in ul
    formatted = formatted.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul class="my-6 space-y-2">$1</ul>');
    // Paragraphs (anything not a tag, separated by double newline)
    formatted = formatted.split('\n\n').map(p => {
        if (!p.startsWith('<') && p.trim()) {
            return `<p>${p}</p>`;
        }
        return p;
    }).join('\n\n');

    return formatted;
}

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-black text-[#E8E8E8] font-sans selection:bg-beetle-gold selection:text-black">
            <Navbar isLanding={false} />

            <div className="pt-32 pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header */}
                    <div className="mb-16">
                        <span className="text-beetle-gold text-xs font-bold uppercase tracking-[0.4em] mb-4 block font-mono">
                            Protocol Governance
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                            Legal Infrastructure
                        </h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar Navigation */}
                        <div className="lg:w-1/4 shrink-0">
                            <div className="sticky top-32 flex flex-col gap-2">
                                {LEGAL_NAV_ITEMS.map((item) => (
                                    <NavLink
                                        key={item.id}
                                        to={`/legal/${item.id}`}
                                        className={({ isActive }) => `
                                            flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold text-sm
                                            ${isActive 
                                                ? 'bg-beetle-gold/10 text-beetle-gold border border-beetle-gold/20' 
                                                : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'}
                                        `}
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="lg:w-3/4">
                            <Routes>
                                <Route path="/" element={<Navigate to="/legal/tos" replace />} />
                                <Route path="/:documentId" element={<LegalDocumentViewer />} />
                            </Routes>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
