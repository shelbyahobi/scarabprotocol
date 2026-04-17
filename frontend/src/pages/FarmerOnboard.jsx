import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RewardCalculator from '../components/RewardCalculator';

export default function FarmerOnboard() {
    const [step, setStep] = useState(1);
    const [payoutMode, setPayoutMode] = useState(null); // 'A' or 'B'
    
    // Cluster waitlist states
    const [showClusterForm, setShowClusterForm] = useState(false);
    const [clusterData, setClusterData] = useState({ email: '', location: '', deviceType: 'Bokashi' });
    const [waitlistStatus, setWaitlistStatus] = useState(null); // null, 'loading', 'success'

    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        country: '',
        phone: ''
    });
    const [deviceId, setDeviceId] = useState('');
    const navigate = useNavigate();

    const handleModeSelect = (mode) => {
        setPayoutMode(mode);
        if (mode === 'A') {
            setStep(2); // Proceed to account creation
        } else {
            // Mode B -> Show cluster waitlist mapping
            setShowClusterForm(true);
        }
    };

    const handleClusterSubmit = async (e) => {
        e.preventDefault();
        setWaitlistStatus('loading');
        
        try {
            // Placeholder lat/lon since browser geoloc takes a while to mock efficiently
            const payload = {
                email: clusterData.email,
                lat: 52.5200, 
                lon: 13.4050,
                deviceType: clusterData.deviceType
            };
            
            const res = await fetch('/api/cluster-waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (data.status === 'queued') {
                setWaitlistStatus('success');
            }
        } catch (err) {
            console.error('Waitlist error', err);
            setWaitlistStatus('error');
        }
    };

    const handleAccountSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('scarab_farmer_session', JSON.stringify({ ...formData, payoutMode }));
        setStep(3);
    };

    const handleDeviceActivate = (e) => {
        e.preventDefault();
        setStep(4);
    };

    const handleFinish = () => {
        navigate('/dashboard/farmer');
    };

    return (
        <div className="min-h-screen bg-[#050a05] text-white flex flex-col items-center pt-24 p-4">
            
            {step === 1 && !showClusterForm && (
                <div className="space-y-8 w-full max-w-4xl animate-fade-in text-center">
                    <div>
                        <h1 className="text-4xl font-black mb-2">How do you want to be rewarded?</h1>
                        <p className="text-gray-400">Choose your payout model to continue onboarding.</p>
                    </div>
                    <RewardCalculator onModeSelect={handleModeSelect} />
                </div>
            )}

            {step === 1 && showClusterForm && (
                <div className="max-w-4xl w-full bg-[#0a1a0f] border border-beetle-green/30 rounded-2xl p-8 space-y-8 shadow-2xl animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-beetle-green/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="grid md:grid-cols-2 gap-12 relative z-10">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">You selected Growth Mode</h2>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                Receiving raw SCARAB token emissions means you share in the network's long-term utility value. 
                                To maximize your token yield, physical devices must be grouped into <strong className="text-beetle-green">Logistics Clusters</strong>.
                            </p>
                            
                            <div className="bg-black/50 border border-white/10 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-beetle-green animate-pulse"></div>
                                    <span className="text-sm font-bold text-white">Cluster Multipliers</span>
                                </div>
                                <p className="text-xs text-gray-400">
                                    Nodes active in dense target sectors earn up to a 2.0x token multiplier, as close-proximity data creates highly verified institutional sensor webs.
                                </p>
                            </div>

                            {/* Static SVG Map Placeholder */}
                            <div className="mt-6 aspect-video bg-black border border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden">
                                <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="100" cy="80" r="30" fill="#1D9E75" fillOpacity="0.1" stroke="#1D9E75" strokeWidth="2" strokeDasharray="4 4" />
                                    <circle cx="100" cy="80" r="4" fill="#1D9E75" />
                                    <text x="100" y="125" fill="#888" fontSize="10" textAnchor="middle" fontWeight="bold">BERLIN SECTOR A</text>

                                    <circle cx="280" cy="120" r="40" fill="#1D9E75" fillOpacity="0.05" stroke="#1D9E75" strokeWidth="1" strokeDasharray="2 2" />
                                    <circle cx="280" cy="120" r="4" fill="#1D9E75" />
                                    <text x="280" y="175" fill="#888" fontSize="10" textAnchor="middle" fontWeight="bold">MUNICH ALPHA</text>

                                     <circle cx="200" cy="50" r="25" fill="#1D9E75" fillOpacity="0.2" stroke="#1D9E75" strokeWidth="2" />
                                    <circle cx="200" cy="50" r="4" fill="#1D9E75" />
                                    <text x="200" y="90" fill="#1D9E75" fontSize="10" textAnchor="middle" fontWeight="bold">ACTIVE: ZURICH</text>
                                </svg>
                            </div>
                        </div>

                        <div>
                            {waitlistStatus === 'success' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-beetle-green/20 rounded-full flex items-center justify-center text-beetle-green text-3xl font-black mb-4">
                                        ✓
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Added to Waitlist</h3>
                                    <p className="text-gray-400 text-sm">We'll alert you the moment a cluster unlocks in your sector.</p>
                                    <button onClick={() => navigate('/')} className="mt-8 text-gray-500 hover:text-white text-sm">Return Home</button>
                                </div>
                            ) : (
                                <form onSubmit={handleClusterSubmit} className="space-y-4 bg-black p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-xl font-bold text-white mb-4">Join Cluster Waitlist</h3>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email</label>
                                        <input type="email" required className="w-full bg-[#050A05] border border-white/10 rounded-lg p-3 text-white focus:border-beetle-green outline-none" 
                                            value={clusterData.email} onChange={e => setClusterData({...clusterData, email: e.target.value})} />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">General Location (City)</label>
                                        <input type="text" required className="w-full bg-[#050A05] border border-white/10 rounded-lg p-3 text-white focus:border-beetle-green outline-none" 
                                            value={clusterData.location} onChange={e => setClusterData({...clusterData, location: e.target.value})} />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Primary Device</label>
                                        <select className="w-full bg-[#050A05] border border-white/10 rounded-lg p-3 text-white focus:border-beetle-green outline-none"
                                            value={clusterData.deviceType} onChange={e => setClusterData({...clusterData, deviceType: e.target.value})}>
                                            <option value="Bokashi">Smart Bokashi Kit</option>
                                            <option value="Hub">UCO Hub / Aggregator</option>
                                        </select>
                                    </div>

                                    <button type="submit" disabled={waitlistStatus === 'loading'} className="w-full bg-beetle-green text-black font-bold py-3 rounded-lg hover:bg-green-400 transition-colors mt-4">
                                        {waitlistStatus === 'loading' ? 'Joining...' : 'Queue for Hardware'}
                                    </button>
                                    <button type="button" onClick={() => setShowClusterForm(false)} className="w-full text-center text-gray-500 text-xs mt-4 hover:text-white">
                                        Cancel & choose Fiat Mode
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {(step === 2 || step === 3 || step === 4) && (
                <div className="max-w-md w-full bg-[#0a1a0f] border border-white/10 rounded-2xl p-8 space-y-8 animate-fade-in">
                    
                    {/* Progress Indicator */}
                    <div className="flex justify-between items-center mb-8">
                        <div className={`text-sm font-bold ${step >= 2 ? 'text-[#1D9E75]' : 'text-gray-600'}`}>Account</div>
                        <div className={`h-px flex-1 mx-4 ${step >= 3 ? 'bg-[#1D9E75]' : 'bg-gray-800'}`}></div>
                        <div className={`text-sm font-bold ${step >= 3 ? 'text-[#1D9E75]' : 'text-gray-600'}`}>Hardware</div>
                        <div className={`h-px flex-1 mx-4 ${step >= 4 ? 'bg-[#1D9E75]' : 'bg-gray-800'}`}></div>
                        <div className={`text-sm font-bold ${step >= 4 ? 'text-[#1D9E75]' : 'text-gray-600'}`}>Done</div>
                    </div>

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-white">Create your account</h2>
                            <form onSubmit={handleAccountSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">First name</label>
                                    <input 
                                        type="text" required
                                        className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#1D9E75] outline-none transition-colors"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email address</label>
                                    <input 
                                        type="email" required
                                        className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#1D9E75] outline-none transition-colors"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <button type="submit" className="w-full bg-[#1D9E75] text-white font-bold py-4 rounded-xl hover:bg-[#15805e] transition-colors mt-6">
                                    Continue
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-4">No crypto wallet required. We handle the technical setup automatically via Passkey Abstracted accounts.</p>
                            </form>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-white">Activate your device</h2>
                            
                            <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 flex items-center justify-center bg-black/50">
                                <p className="text-gray-400 text-center">Point camera at device QR code</p>
                            </div>

                            <form onSubmit={handleDeviceActivate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Or enter device ID manually</label>
                                    <input 
                                        type="text" required
                                        className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#1D9E75] outline-none transition-colors font-mono uppercase"
                                        value={deviceId}
                                        onChange={(e) => setDeviceId(e.target.value)}
                                        placeholder="e.g. BOK-9942"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-[#1D9E75] text-white font-bold py-4 rounded-xl hover:bg-[#15805e] transition-colors mt-2">
                                    Activate Device
                                </button>
                            </form>
                        </div>
                    )}

                    {/* STEP 4 */}
                    {step === 4 && (
                        <div className="space-y-8 text-center pb-4">
                            <div className="flex justify-center mb-6 mt-4">
                                <div className="w-24 h-24 rounded-full border-4 border-[#1D9E75] flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(29,158,117,0.3)]">
                                    <div className="w-8 h-12 border-b-4 border-r-4 border-[#1D9E75] transform rotate-45 -translate-y-2 translate-x-0.5" />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-black text-white mb-2">Your node is active</h2>
                                <p className="text-gray-400">Yield generation model: <span className="text-white font-bold">{payoutMode === 'A' ? 'Fiat (Predictable)' : 'Token (Growth)'}</span></p>
                            </div>

                            <button onClick={handleFinish} className="w-full bg-[#1D9E75] text-white font-bold py-4 rounded-xl hover:bg-[#15805e] transition-colors">
                                Go to my dashboard
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
