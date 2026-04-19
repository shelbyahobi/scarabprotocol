import React, { useState } from 'react';
import Navbar from '../components/Navbar';

/**
 * DesignReviewPage — Internal tool for design feedback.
 * Gated by ADMIN_SECRET header in the backend call.
 * This page itself should ideally be route-guarded/password-protected in production.
 */

export default function DesignReviewPage() {
    const [pageSection, setPageSection] = useState('');
    const [adminSecret, setAdminSecret] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleReview = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult('');

        try {
            const res = await fetch('/api/internal/design-review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': adminSecret
                },
                body: JSON.stringify({ pageSection })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Review failed');
            
            setResult(data.suggestion);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050B08] text-white">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                    <h1 className="text-2xl font-black mb-2">Design Critic <span className="text-emerald-400">Claude</span></h1>
                    <p className="text-gray-400 text-sm mb-8">Internal tool for professional design feedback on municipal assets.</p>

                    <form onSubmit={handleReview} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Internal Auth</label>
                            <input 
                                type="password" 
                                value={adminSecret}
                                onChange={(e) => setAdminSecret(e.target.value)}
                                placeholder="Enter ADMIN_SECRET"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Page Section / Context</label>
                            <textarea 
                                value={pageSection}
                                onChange={(e) => setPageSection(e.target.value)}
                                placeholder="e.g. Hero section for Stuttgart pilot, focus on trust for procurement officers..."
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none h-32"
                                required
                            />
                            <p className="text-[10px] text-gray-600 mt-2 italic">Be concrete about the audience and goal.</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all disabled:opacity-50"
                        >
                            {loading ? 'Consulting Claude...' : 'Generate Design Feedback →'}
                        </button>
                    </form>

                    {result && (
                        <div className="mt-10 pt-10 border-t border-white/10">
                            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Claude's Recommendation</h3>
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {result}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
