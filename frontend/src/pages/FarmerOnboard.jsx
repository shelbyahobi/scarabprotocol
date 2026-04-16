import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SCARAB Protocol — Farmer Onboarding
 * 
 * 3-step PWA-optimised onboarding flow.
 */
export default function FarmerOnboard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        country: '',
        phone: ''
    });
    const [deviceId, setDeviceId] = useState('');
    const navigate = useNavigate();

    const handleAccountSubmit = (e) => {
        e.preventDefault();
        // Save to localStorage for now
        localStorage.setItem('scarab_farmer_session', JSON.stringify(formData));
        // TODO: Replace with ERC-4337 account abstraction
        setStep(2);
    };

    const handleDeviceActivate = (e) => {
        e.preventDefault();
        // TODO: Call DeviceRegistry.activateDevice() with magic link wallet
        setStep(3);
    };

    const handleFinish = () => {
        navigate('/dashboard/farmer');
    };

    return (
        <div className="min-h-screen bg-[#050a05] text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#0a1a0f] border border-white/10 rounded-2xl p-8 space-y-8">
                
                {/* Progress Indicator */}
                <div className="flex justify-between items-center mb-8">
                    <div className={`text-sm font-bold ${step >= 1 ? 'text-[#1D9E75]' : 'text-gray-600'}`}>Step 1</div>
                    <div className={`h-px flex-1 mx-4 ${step >= 2 ? 'bg-[#1D9E75]' : 'bg-gray-800'}`}></div>
                    <div className={`text-sm font-bold ${step >= 2 ? 'text-[#1D9E75]' : 'text-gray-600'}`}>Step 2</div>
                    <div className={`h-px flex-1 mx-4 ${step >= 3 ? 'bg-[#1D9E75]' : 'bg-gray-800'}`}></div>
                    <div className={`text-sm font-bold ${step >= 3 ? 'text-[#1D9E75]' : 'text-gray-600'}`}>Step 3</div>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
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
                                    data-testid="farmer-firstname-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email address</label>
                                <input 
                                    type="email" required
                                    className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#1D9E75] outline-none transition-colors"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    data-testid="farmer-email-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                                <select 
                                    required
                                    className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#1D9E75] outline-none transition-colors"
                                    value={formData.country}
                                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                                    data-testid="farmer-country-input"
                                >
                                    <option value="">Select country...</option>
                                    <option value="DE">Germany</option>
                                    <option value="CH">Switzerland</option>
                                    <option value="AT">Austria</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone (optional)</label>
                                <input 
                                    type="tel"
                                    className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#1D9E75] outline-none transition-colors"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    data-testid="farmer-phone-input"
                                />
                            </div>
                            
                            <button 
                                type="submit"
                                className="w-full bg-[#1D9E75] text-white font-bold py-4 rounded-xl hover:bg-[#15805e] transition-colors mt-6"
                                data-testid="farmer-continue-btn"
                            >
                                Continue
                            </button>
                            <p className="text-xs text-center text-gray-500 mt-4">
                                No crypto wallet required. We handle the technical setup automatically.
                            </p>
                        </form>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
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
                                    className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#1D9E75] outline-none transition-colors font-mono"
                                    value={deviceId}
                                    onChange={(e) => setDeviceId(e.target.value)}
                                    placeholder="e.g. BOK-9942"
                                    data-testid="farmer-device-input"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-[#1D9E75] text-white font-bold py-4 rounded-xl hover:bg-[#15805e] transition-colors mt-2"
                                data-testid="farmer-activate-btn"
                            >
                                Activate Device
                            </button>
                        </form>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className="space-y-8 text-center pb-4">
                        <div className="flex justify-center mb-6 mt-4">
                            <div className="w-24 h-24 rounded-full border-4 border-[#1D9E75] flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(29,158,117,0.3)]">
                                {/* Pure CSS checkmark */}
                                <div className="w-8 h-12 border-b-4 border-r-4 border-[#1D9E75] transform rotate-45 -translate-y-2 translate-x-0.5" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-black text-white mb-2">Your node is active</h2>
                            <p className="text-gray-400">Rewards will appear in your dashboard within 24 hours.</p>
                        </div>
                        
                        <div className="bg-black border border-[#1D9E75]/30 rounded-xl p-6">
                            <p className="text-sm font-medium text-gray-400 mb-1">This month's earnings</p>
                            <p className="text-5xl font-black text-white">€0.00</p>
                        </div>

                        <button 
                            onClick={handleFinish}
                            className="w-full bg-[#1D9E75] text-white font-bold py-4 rounded-xl hover:bg-[#15805e] transition-colors"
                            data-testid="farmer-dashboard-btn"
                        >
                            Go to my dashboard
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
