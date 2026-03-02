import { Zap, TrendingUp, Leaf } from 'lucide-react';

const ValueProp = ({ icon, title, description }) => (
    <div className="bg-black/50 border border-white/10 rounded-2xl p-8 hover:border-beetle-gold/50 transition-colors">
        <div className="w-14 h-14 bg-beetle-gold/10 rounded-xl flex items-center justify-center text-beetle-gold mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
);

export default function ValueProposition() {
    return (
        <section className="py-24 bg-black relative border-t border-white/5">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                        The Infrastructure Layer for the <br className="hidden md:block" />
                        <span className="text-beetle-gold">Regenerative Economy</span>
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed mb-16 max-w-3xl mx-auto">
                        SCARAB turns sustainability hardware into revenue-generating assets.
                        Install a solar panel, run a composting system, or purify water — earn
                        cryptographic rewards for <strong className="text-beetle-gold">verified environmental work</strong>.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <ValueProp
                            icon={<Zap size={28} />}
                            title="Hardware Owners"
                            description="Turn your solar panel, bokashi bucket, or water filter into a passive income stream through verifiable output."
                        />
                        <ValueProp
                            icon={<TrendingUp size={28} />}
                            title="Early Investors"
                            description="Utility token with a mathematically supported treasury ratio that rises with every new hardware deployment."
                        />
                        <ValueProp
                            icon={<Leaf size={28} />}
                            title="Climate Funds"
                            description="Directly invest in verifiable, measurable, and hyper-local sustainability infrastructure at massive scale."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
