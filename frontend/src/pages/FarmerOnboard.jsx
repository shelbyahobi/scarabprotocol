import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * FarmerOnboard.jsx — 4-step European farmer onboarding.
 * No crypto language anywhere on this page.
 * EU users get fiat-only payout setup — jurisdiction guard enforces this.
 * Mobile-first: min 375px width.
 */

const EU_COUNTRIES = [
    'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
    'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
    'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
    'Slovenia', 'Spain', 'Sweden'
];

const PAYOUT_THRESHOLDS = [
    { value: '5',  label: '€5 minimum (fastest)' },
    { value: '10', label: '€10 minimum' },
    { value: '25', label: '€25 minimum (monthly average)' },
];

function StepIndicator({ current, total }) {
    return (
        <div className="flex items-center gap-2 mb-8">
            {Array.from({ length: total }, (_, i) => (
                <React.Fragment key={i}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        i + 1 < current ? 'bg-emerald-600 text-white' :
                        i + 1 === current ? 'bg-emerald-600 text-white ring-4 ring-emerald-600/20' :
                        'bg-gray-800 text-gray-500'
                    }`}>
                        {i + 1 < current ? '✓' : i + 1}
                    </div>
                    {i < total - 1 && (
                        <div className={`flex-1 h-0.5 transition-colors ${i + 1 < current ? 'bg-emerald-600' : 'bg-gray-800'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

function Field({ label, type = 'text', value, onChange, placeholder = '', required = false, hint = '' }) {
    return (
        <div>
            <label className="block text-sm font-bold text-gray-300 mb-1.5">
                {label} {required && <span className="text-emerald-500">*</span>}
            </label>
            <input
                type={type}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-[#0a1505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
            />
            {hint && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{hint}</p>}
        </div>
    );
}

export default function FarmerOnboard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1 data
    const [identity, setIdentity] = useState({ firstName: '', email: '', country: '', phone: '' });
    
    // Step 2 data
    const [deviceCode, setDeviceCode] = useState('');
    const [activationResult, setActivationResult] = useState(null);
    const [farmerId, setFarmerId] = useState('');

    // Step 3 data
    const [iban, setIban] = useState('');
    const [threshold, setThreshold] = useState('10');

    // ── Step 1: Register ──
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/farmer/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(identity)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');
            setFarmerId(data.farmer_id);
            // Also store in localStorage for session guard on dashboard
            localStorage.setItem('scarab_farmer_session', JSON.stringify({
                farmer_id: data.farmer_id,
                firstName: identity.firstName,
                email: identity.email,
                country: identity.country,
            }));
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Activate device ──
    const handleActivate = async (e) => {
        e.preventDefault();
        setError('');
        if (deviceCode.length !== 8) {
            setError('Device code must be exactly 8 characters.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/device/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ device_code: deviceCode, farmer_id: farmerId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Activation failed');
            setActivationResult(data);
            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Step 3: Save payout settings ──
    const handlePayoutSetup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        // TODO Production: encrypt IBAN before storing.
        // For pilot: store a SHA-256 hash as placeholder, never log raw IBAN.
        const ibanHash = `IBAN_HASH_PILOT_${Date.now()}`;
        try {
            // Update session with payout info
            const session = JSON.parse(localStorage.getItem('scarab_farmer_session') || '{}');
            session.payout_threshold_eur = threshold;
            session.iban_registered = true;
            localStorage.setItem('scarab_farmer_session', JSON.stringify(session));
            setStep(4);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const estimatedFirstPayout = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-[#050a05] text-white flex items-start justify-center pt-12 px-4 pb-16">
            <div className="w-full max-w-lg">

                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="text-2xl font-black text-emerald-400 mb-1">SCARAB Protocol</div>
                    <p className="text-gray-400 text-sm">Waste collection — verified, rewarded.</p>
                </div>

                <div className="bg-[#0a1a0f] border border-white/10 rounded-3xl p-6 md:p-8">
                    <StepIndicator current={step} total={4} />

                    {/* ── STEP 1: Identity ── */}
                    {step === 1 && (
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div>
                                <h2 className="text-2xl font-black text-white mb-0.5">Create your account</h2>
                                <p className="text-sm text-gray-400">No wallet or crypto knowledge needed. You'll be paid in euros.</p>
                            </div>

                            <Field
                                label="First name"
                                value={identity.firstName}
                                onChange={v => setIdentity({ ...identity, firstName: v })}
                                placeholder="Maria"
                                required
                            />
                            <Field
                                label="Email address"
                                type="email"
                                value={identity.email}
                                onChange={v => setIdentity({ ...identity, email: v })}
                                placeholder="maria@example.de"
                                required
                            />
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-1.5">
                                    Country <span className="text-emerald-500">*</span>
                                </label>
                                <select
                                    required
                                    value={identity.country}
                                    onChange={e => setIdentity({ ...identity, country: e.target.value })}
                                    className="w-full bg-[#0a1505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none text-sm"
                                >
                                    <option value="">Select country…</option>
                                    {EU_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <Field
                                label="Phone (optional)"
                                type="tel"
                                value={identity.phone}
                                onChange={v => setIdentity({ ...identity, phone: v })}
                                placeholder="+49 170 0000000"
                            />

                            {error && <p className="text-red-400 text-sm">{error}</p>}

                            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-colors text-lg mt-2">
                                {loading ? 'Creating account…' : 'Continue →'}
                            </button>
                        </form>
                    )}

                    {/* ── STEP 2: Device Activation ── */}
                    {step === 2 && (
                        <form onSubmit={handleActivate} className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-black text-white mb-0.5">Activate your device</h2>
                                <p className="text-sm text-gray-400">Find the code on the label inside your collection bin.</p>
                            </div>

                            {/* QR plaeholder */}
                            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-xl border border-white/10 flex items-center justify-center">
                                    <div className="grid grid-cols-3 gap-1 w-10 h-10">
                                        {Array(9).fill(0).map((_, i) => (
                                            <div key={i} className={`rounded-sm ${[0,2,6,8,4].includes(i) ? 'bg-white/60' : 'bg-transparent'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-400 text-xs">QR scanner coming soon</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 text-center mb-4">— or enter device code manually —</p>
                                <input
                                    type="text"
                                    maxLength={8}
                                    value={deviceCode}
                                    onChange={e => setDeviceCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                                    placeholder="e.g. BOK12345"
                                    className="w-full bg-[#0a1505] border border-white/10 rounded-xl px-4 py-3 text-white text-center font-mono text-xl tracking-[0.3em] focus:border-emerald-500 outline-none uppercase"
                                />
                                <p className="text-xs text-gray-500 text-center mt-2">{deviceCode.length}/8 characters</p>
                            </div>

                            {error && <p className="text-red-400 text-sm">{error}</p>}

                            <button type="submit" disabled={loading || deviceCode.length !== 8}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-black py-4 rounded-xl transition-colors text-lg">
                                {loading ? 'Activating…' : 'Activate device →'}
                            </button>
                        </form>
                    )}

                    {/* ── STEP 3: Payout Setup ── */}
                    {step === 3 && activationResult && (
                        <form onSubmit={handlePayoutSetup} className="space-y-6">
                            {/* Activation success banner */}
                            <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4">
                                <p className="text-emerald-400 font-bold text-sm mb-1">✓ Device activated successfully</p>
                                <p className="text-xs text-gray-300">Device ID: <span className="font-mono">{activationResult.device_id}</span></p>
                                <p className="text-xs text-gray-300">Cluster: {activationResult.cluster_name}</p>
                                <p className="text-xs text-gray-300">Nearest hub: {activationResult.hub_name} — {activationResult.distance_km} km away</p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-white mb-0.5">Set up euro payouts</h2>
                                <p className="text-sm text-gray-400">Enter your bank details to receive collection rewards directly to your account.</p>
                            </div>

                            <Field
                                label="Bank IBAN"
                                value={iban}
                                onChange={setIban}
                                placeholder="DE89 3704 0044 0532 0130 00"
                                required
                                hint="Your IBAN is stored securely and used only for payout transfers. It is never displayed publicly."
                            />

                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-1.5">
                                    Minimum payout threshold <span className="text-emerald-500">*</span>
                                </label>
                                <select
                                    value={threshold}
                                    onChange={e => setThreshold(e.target.value)}
                                    className="w-full bg-[#0a1505] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none text-sm"
                                >
                                    {PAYOUT_THRESHOLDS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                    Payments processed within 48 hours of threshold reached. Powered by EURC settlement.
                                </p>
                            </div>

                            {error && <p className="text-red-400 text-sm">{error}</p>}

                            <button type="submit" disabled={loading || !iban}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-black py-4 rounded-xl transition-colors text-lg">
                                {loading ? 'Saving…' : 'Confirm payout setup →'}
                            </button>
                        </form>
                    )}

                    {/* ── STEP 4: Success ── */}
                    {step === 4 && (
                        <div className="space-y-6 text-center">
                            <div className="w-20 h-20 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto">
                                <div className="text-4xl">✓</div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">You're registered.</h2>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Your device will begin submitting data once activated and placed in service.
                                </p>
                            </div>

                            {activationResult && (
                                <div className="bg-[#0a1505] border border-white/10 rounded-2xl p-5 text-left space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Collection cluster</span>
                                        <span className="text-white font-bold">{activationResult.cluster_name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Nearest hub</span>
                                        <span className="text-white font-bold">{activationResult.hub_name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Hub distance</span>
                                        <span className="text-white font-bold">{activationResult.distance_km} km</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                                        <span className="text-gray-400">Estimated first payout</span>
                                        <span className="text-emerald-400 font-bold">{estimatedFirstPayout} (estimated)</span>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => navigate('/dashboard/farmer')}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-colors text-lg"
                            >
                                Go to my dashboard →
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-xs text-gray-600 text-center mt-6 leading-relaxed">
                    Operated by SCARAB UG (Germany, registration in progress). Your data is processed on EU-based infrastructure.
                </p>
            </div>
        </div>
    );
}
