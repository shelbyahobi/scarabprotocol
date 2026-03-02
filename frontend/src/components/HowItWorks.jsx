import { Package, Zap, Shield, Coins } from 'lucide-react';

const FlowStep = ({ number, title, description, icon }) => (
    <div className="text-center relative">
        <div className="w-20 h-20 mx-auto bg-[#0a1a0f] border-2 border-beetle-electric/30 rounded-2xl flex items-center justify-center text-beetle-electric mb-6 relative z-10">
            {icon}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-beetle-gold text-black rounded-full flex items-center justify-center font-black text-sm">
                {number}
            </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm max-w-[200px] mx-auto">{description}</p>
    </div>
);

export default function HowItWorks() {
    return (
        <section className="py-24 bg-gradient-to-b from-black to-[#0a1a0f] relative border-t border-white/5">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-beetle-electric font-bold uppercase tracking-widest text-sm mb-4 block">The Mechanism</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white">
                        Proof of <span className="text-beetle-electric">Productive Asset</span>
                    </h2>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Visual Flow connecting lines (hidden on mobile) */}
                    <div className="relative">
                        <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-beetle-electric/30 to-transparent z-0"></div>

                        <div className="grid md:grid-cols-4 gap-12 md:gap-4 mb-20">
                            <FlowStep
                                number="1"
                                title="Buy Hardware"
                                description="Solar Node ($349) or Smart Bokashi Kit ($89)"
                                icon={<Package size={32} />}
                            />
                            <FlowStep
                                number="2"
                                title="Produce Output"
                                description="Generate clean kWh, ferment organic waste, or purify water."
                                icon={<Zap size={32} />}
                            />
                            <FlowStep
                                number="3"
                                title="Verify Production"
                                description="ATECC608A secure element cryptographically signs data."
                                icon={<Shield size={32} />}
                            />
                            <FlowStep
                                number="4"
                                title="Earn SCARAB"
                                description="Rewards scale dynamically based on your verified BRU output."
                                icon={<Coins size={32} />}
                            />
                        </div>
                    </div>

                    {/* Key Differentiator Summary */}
                    <div className="bg-beetle-green/5 border border-beetle-green/20 rounded-2xl p-8 text-center max-w-3xl mx-auto transform transition-transform hover:scale-105">
                        <p className="text-gray-300 leading-relaxed text-lg">
                            <strong className="text-white">Zero speculative mining.</strong> Rewards are only
                            minted when hardware cryptographically proves real-world physical production. This
                            is <strong className="text-beetle-gold">sustainable infrastructure</strong> built on cryptographic truth.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
