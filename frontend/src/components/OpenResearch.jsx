import React, { useState } from 'react';
import { ChevronDown, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
    {
        q: "Does decentralised fermentation (Bokashi) scale better than centralized biogas for dense urban districts?",
        a: "By displacing diesel-heavy logistics with hyper-local fermentation, we hypothesise a significantly lower net carbon footprint per kg of waste. The Stuttgart pilot will provide the comparative datasets needed to validate this against traditional Biotonne collections."
    },
    {
        q: "Can hyper-local soil amendment production measurably restore urban green-space vitality?",
        a: "We are tracking the application of Pro Bioreactor output on pilot urban test plots, measuring soil microbial diversity, water retention capacity, and plant stress indices over a 24-month period."
    },
    {
        q: "What is the true correlation between agrivoltaic panel shading and sub-panel soil moisture retention in EU climates?",
        a: "Using the continuous telemetry from the AgriSentinel hardware, we are cross-referencing sub-panel microclimates against exposed control plots to quantify exact water savings during peak summer months."
    }
];

export default function OpenResearch() {
    const [openIdx, setOpenIdx] = useState(null);

    return (
        <section className="py-24 bg-[#FDFDFD] border-t border-gray-100 px-6">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-2xl mb-6">
                        <GraduationCap className="text-emerald-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Open Academic Research Questions</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                        In partnership with Universität Hohenheim & pilot municipalities.
                    </p>
                </div>

                <div className="space-y-4">
                    {QUESTIONS.map((item, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div 
                                key={idx} 
                                className={`border rounded-2xl overflow-hidden transition-colors ${isOpen ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                            >
                                <button
                                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                                >
                                    <span className="font-bold text-gray-900 leading-tight pr-4">{item.q}</span>
                                    <ChevronDown 
                                        className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} 
                                        size={20} 
                                    />
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-6 pt-2 text-gray-600 text-sm leading-relaxed border-t border-emerald-100/50">
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
