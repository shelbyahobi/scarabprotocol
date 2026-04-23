import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Cpu, Cloud, Sprout, Building, ChevronDown, ChevronUp } from 'lucide-react';

const SKUS = [
    {
        tier: 'AgriSentinel Lite',
        price: '€149',
        target: 'For small research pilots and hobbyist setups.',
        icon: Cpu,
        sensors: ['Soil Moisture', 'Temperature', 'Humidity'],
        dataOutputs: ['Basic Microclimate', 'Irrigation Alerts', 'Daily Sync'],
        decision: 'Optimises basic water usage.',
        sku: 'AS-LITE-001'
    },
    {
        tier: 'AgriSentinel Pro',
        price: '€349',
        target: 'For commercial agrivoltaic installations requiring regulatory compliance.',
        icon: Cloud,
        sensors: ['Optical Soiling', 'Leaf Area Index (LAI)', 'Soil NPK', 'Soil Moisture', 'Microclimate'],
        dataOutputs: ['DIN 91434 Compliance Score', 'Panel Soiling Loss %', 'Continuous LAI Tracking'],
        decision: 'Enables verified yield compliance and cleaning optimisation.',
        sku: 'AS-PRO-001',
        recommended: true
    },
    {
        tier: 'AgriSentinel Biodiversity',
        price: '€599',
        target: 'For premium ESG reporting and biodiversity tracking.',
        icon: Sprout,
        sensors: ['Acoustic Pollinator Monitor', 'Carbon Flux (CO2)', 'All Pro Sensors'],
        dataOutputs: ['Pollinator Activity Index', 'Carbon Flux Balance', 'Ecosystem Health Timeline'],
        decision: 'Unlocks green financing and biodiversity credits.',
        sku: 'AS-BIO-001'
    },
    {
        tier: 'AgriSentinel Industrial',
        price: '€2,495',
        target: 'For utility-scale developers (>50ha) with SCADA integration.',
        icon: Building,
        sensors: ['Redundant Sensor Array', 'Modbus/RS485 Output', 'DGP Support'],
        dataOutputs: ['Grid-Integrated Telemetry', 'Actuator Control', 'Predictive Maintenance'],
        decision: 'Integrates crop and energy models at utility scale.',
        sku: 'AS-IND-001'
    }
];

export default function AgriSentinelPage() {
    const [viewMode, setViewMode] = useState('all'); // 'all' | 'wizard'
    const [wizardStep, setWizardStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [expandedSku, setExpandedSku] = useState(null);

    const WIZARD_QUESTIONS = [
        {
            q: 'How large is your agrivoltaic installation?',
            options: ['<1ha', '1–5ha', '5–20ha', '>20ha']
        },
        {
            q: 'What is your primary goal?',
            options: ['Reduce water use', 'Prove regulatory compliance', 'Track biodiversity', 'Maximise energy efficiency']
        },
        {
            q: 'Do you need carbon credit documentation?',
            options: ['Yes, Gold Standard', 'Yes, national scheme', 'Not yet', 'No']
        }
    ];

    const handleAnswer = (opt) => {
        setAnswers(prev => ({ ...prev, [wizardStep]: opt }));
        if (wizardStep < WIZARD_QUESTIONS.length - 1) {
            setWizardStep(prev => prev + 1);
        } else {
            setViewMode('result');
        }
    };

    const getRecommendation = () => {
        if (answers[2]?.includes('Yes') || answers[1] === 'Track biodiversity') return 'AgriSentinel Biodiversity';
        if (answers[0] === '>20ha') return 'AgriSentinel Industrial';
        if (answers[1] === 'Prove regulatory compliance') return 'AgriSentinel Pro';
        if (answers[0] === '<1ha') return 'AgriSentinel Lite';
        return 'AgriSentinel Pro'; // Default
    };

    const recommendedTier = viewMode === 'result' ? getRecommendation() : null;

    return (
        <div className="min-h-screen bg-[#050a05] text-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">AgriSentinel Hardware</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        The industry standard for under-panel telemetry. Choose the right sensor suite for your agrivoltaic installation.
                    </p>
                </div>

                <div className="flex justify-center gap-4 mb-12">
                    <button 
                        onClick={() => { setViewMode('all'); setWizardStep(0); }}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${viewMode === 'all' ? 'bg-beetle-gold text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        Show all tiers
                    </button>
                    <button 
                        onClick={() => setViewMode('wizard')}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${viewMode !== 'all' ? 'bg-beetle-gold text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        Help me choose
                    </button>
                </div>

                {viewMode === 'wizard' && (
                    <div className="max-w-xl mx-auto bg-black/40 border border-white/10 rounded-2xl p-8 mb-12">
                        <div className="text-sm text-beetle-gold font-mono mb-4">Question {wizardStep + 1} of 3</div>
                        <h3 className="text-2xl font-bold mb-6">{WIZARD_QUESTIONS[wizardStep].q}</h3>
                        <div className="flex flex-col gap-3">
                            {WIZARD_QUESTIONS[wizardStep].options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer(opt)}
                                    className="p-4 border border-white/10 rounded-xl text-left hover:border-beetle-gold hover:bg-beetle-gold/5 transition-all font-medium"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {(viewMode === 'all' || viewMode === 'result') && (
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        {SKUS.map((sku) => {
                            const isRecommended = recommendedTier === sku.tier;
                            const isExpanded = expandedSku === sku.sku;
                            const Icon = sku.icon;
                            
                            return (
                                <div key={sku.sku} className={`relative bg-black/40 border rounded-2xl p-6 transition-all ${isRecommended ? 'border-beetle-gold shadow-[0_0_30px_rgba(212,175,55,0.15)] scale-[1.02]' : 'border-white/10 hover:border-white/30'}`}>
                                    {isRecommended && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-beetle-gold text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
                                            Recommended for you
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between items-start mb-4 mt-2">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <Icon className={isRecommended ? 'text-beetle-gold' : 'text-gray-400'} />
                                                <h3 className="text-2xl font-bold">{sku.tier}</h3>
                                            </div>
                                            <p className="text-gray-400 text-sm mt-2">{sku.target}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black">{sku.price}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 mt-6">
                                        <div>
                                            <div 
                                                className="flex justify-between items-center cursor-pointer md:cursor-default mb-2"
                                                onClick={() => setExpandedSku(isExpanded ? null : sku.sku)}
                                            >
                                                <span className="font-bold text-gray-300">Sensor Suite</span>
                                                <span className="md:hidden">
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </span>
                                            </div>
                                            <ul className={`text-sm text-gray-400 space-y-1 ${!isExpanded && 'hidden md:block'}`}>
                                                {sku.sensors.map(s => <li key={s} className="flex items-center gap-2"><Check size={12} className="text-green-500" /> {s}</li>)}
                                            </ul>
                                        </div>

                                        <div>
                                            <span className="font-bold text-gray-300 mb-2 block">Key Data Outputs</span>
                                            <ul className="text-sm text-gray-400 space-y-1">
                                                {sku.dataOutputs.map(o => <li key={o} className="flex items-center gap-2"><Check size={12} className="text-beetle-gold" /> {o}</li>)}
                                            </ul>
                                        </div>

                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                            <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">The "So What"</span>
                                            <p className="text-sm font-medium text-white">{sku.decision}</p>
                                        </div>

                                        <Link
                                            to="/app"
                                            className={`block w-full text-center py-3 rounded-xl font-bold transition-all ${isRecommended ? 'bg-beetle-gold text-black hover:bg-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                                        >
                                            View in Shop
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
