import { Link } from 'react-router-dom';

const RewardCard = ({ amount, recipient, description }) => (
    <div className="bg-black/50 border border-white/10 rounded-xl p-4 text-center pb-6">
        <div className="text-xl font-black text-beetle-gold mb-1">{amount}</div>
        <div className="text-white font-bold mb-1">{recipient}</div>
        <div className="text-xs text-gray-500 uppercase tracking-widest">{description}</div>
    </div>
);

export default function SoilAsAServiceTeaser() {
    return (
        <section className="py-24 bg-black relative border-t border-white/5">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <span className="text-beetle-green font-bold uppercase tracking-wide text-sm">
                        Soil-as-a-Service™
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mt-2 mb-6 tracking-tighter">
                        Closing the Urban-Rural <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-beetle-gold">Nutrient Loop</span>
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-10">
                        SCARAB transforms urban organic waste into a verified agricultural input.
                        After fermenting food scraps in a Smart Bokashi Kit for 15 days, users bring
                        the resulting pre-compost material to Verified Sink Nodes (local partner farms) who receive free, high-grade fertilizer.
                    </p>

                    {/* Simple 3-way split visual */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <RewardCard amount="15 SCARAB" recipient="Urban User" description="Closure Bonus" />
                        <RewardCard amount="7 SCARAB" recipient="Farmer Node" description="Processing Fee" />
                        <RewardCard amount="3 SCARAB" recipient="Validator" description="Presence Proof" />
                    </div>

                    <div className="text-center">
                        <Link
                            to="/docs#soil-as-a-service"
                            className="inline-flex items-center text-beetle-electric hover:text-white transition-colors font-bold text-lg"
                        >
                            Read full Soil-as-a-Service documentation →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
