import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, ShieldCheck, FileText, Anchor } from 'lucide-react';

export default function HubOnboard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        orgName: '',
        contactName: '',
        email: '',
        location: '',
        hasCityPartnership: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleStake = (e) => {
        e.preventDefault();
        alert("Simulating 50 SCARAB staking for Hub Node activation...");
        // In a real flow, this redirects to a Web3 wallet connection or a checkout.
        setStep(3);
    };

    return (
        <div className="min-h-screen bg-[#050a05] text-white flex flex-col pt-16 p-4">
            <Link to="/" className="fixed top-6 left-6 text-gray-500 hover:text-white flex items-center gap-2">
                <ArrowLeft size={16} /> Back
            </Link>

            <div className="max-w-4xl mx-auto w-full grid md:grid-cols-2 gap-12 mt-12">
                
                {/* Left panel: Info */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">Host a Hub Node.</h1>
                        <p className="text-xl text-gray-400">Anchor the DePIN network in your city.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1"><Anchor size={24} className="text-beetle-green" /></div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Infrastructure Anchor</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">Hub Nodes validate Bokashi and UCO drop-offs using ATECC608A signatures and optical sensors, replacing 50 individual collection trips with one verifiable bulk route.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1"><ShieldCheck size={24} className="text-beetle-gold" /></div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Institutional Economics</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">Hub Operators earn a 10% instant commission on all drops, while SCARAB sells the Logistics Efficiency Ratio to corporate buyers as ESG Scope 3 credits.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1"><FileText size={24} className="text-purple-400" /></div>
                            <div>
                                <h3 className="font-bold text-white text-lg">City Partnerships</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">European operators can secure municipal locations at zero cost by offering cities access to our verified Scope 3 dashboard.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel: Form */}
                <div className="bg-[#0a1a0f] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    {/* Progress */}
                    <div className="flex gap-2 mb-8">
                        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-beetle-green' : 'bg-gray-800'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-beetle-green' : 'bg-gray-800'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-beetle-green' : 'bg-gray-800'}`}></div>
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-6">Operator Registration</h2>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Organization Name</label>
                                <input type="text" required className="w-full bg-black border border-white/20 rounded-xl p-3 text-white focus:border-beetle-green outline-none" 
                                    value={formData.orgName} onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Name</label>
                                    <input type="text" required className="w-full bg-black border border-white/20 rounded-xl p-3 text-white focus:border-beetle-green outline-none" 
                                        value={formData.contactName} onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                                    <input type="email" required className="w-full bg-black border border-white/20 rounded-xl p-3 text-white focus:border-beetle-green outline-none" 
                                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Proposed Deployment City</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input type="text" required placeholder="e.g. Berlin, Germany" className="w-full bg-black border border-white/20 rounded-xl p-3 pl-10 text-white focus:border-beetle-green outline-none" 
                                        value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    />
                                </div>
                            </div>

                            <label className="flex items-start gap-3 p-4 bg-black/50 border border-white/10 rounded-xl cursor-pointer hover:border-white/30 transition-colors mt-2">
                                <input type="checkbox" className="mt-1" checked={formData.hasCityPartnership} onChange={(e) => setFormData({...formData, hasCityPartnership: e.target.checked})} />
                                <div>
                                    <div className="text-sm font-bold text-white">We have an existing municipal partnership</div>
                                    <div className="text-xs text-gray-500">Expedites hardware allocation priority.</div>
                                </div>
                            </label>

                            <button type="submit" className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl hover:bg-gray-200 transition-colors mt-4">
                                Continue
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Secure Your Hardware</h2>
                            <p className="text-sm text-gray-400">To maintain network integrity, Hub Nodes require a physical staking activation fee. This prevents Sybil attacks on our Logistics Efficiency metrics.</p>

                            <div className="bg-black border border-beetle-green/30 rounded-xl p-6">
                                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Required Stake</div>
                                <div className="text-4xl font-black text-beetle-green">50 SCARAB</div>
                                <p className="text-xs text-gray-500 mt-2">Will be deposited to the `EmissionController.sol` to unlock your unique ATECC608A keypair.</p>
                            </div>

                            <button onClick={handleStake} className="w-full bg-beetle-green text-black font-bold text-lg py-4 rounded-xl hover:bg-green-400 transition-colors">
                                Stake SCARAB & Generate Keys
                            </button>
                            <button onClick={() => setStep(1)} className="w-full text-gray-500 text-sm hover:text-white mt-4 transition-colors">
                                Go Back
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 text-center py-8">
                            <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Application Received</h2>
                            <p className="text-sm text-gray-400">Your staking transaction is confirmed. Our infrastructure team will contact you within 48 hours to coordinate physical delivery and municipal integration for the hardware.</p>
                            
                            <div className="bg-black border border-white/10 rounded-xl p-4 inline-block font-mono text-sm text-gray-300">
                                Ref: HUB-DEPLOY-{Math.floor(Math.random() * 10000)}
                            </div>

                            <button onClick={() => navigate('/')} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors mt-4">
                                Return to Home
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
