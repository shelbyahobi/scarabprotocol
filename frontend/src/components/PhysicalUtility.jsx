import { ShoppingBag, Users, Hammer, Globe } from 'lucide-react';

export default function PhysicalUtility() {
    return (
        <section className="py-24 bg-gradient-to-b from-black via-[#0a1a0f] to-black relative overflow-hidden">

            {/* Grid Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <span className="text-beetle-green font-bold uppercase tracking-[0.2em] text-sm">The Ecosystem</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6 leading-tight">
                        More Than A Token. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-beetle-green to-beetle-electric">A Survival Toolkit.</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        $ROLL is your passport to physical independence.
                        We use blockchain to fund, build, and discount the tools you need for the new world.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-4 px-4">
                    {/* Step 1 */}
                    <div className="bg-black/40 border border-beetle-green/20 rounded-2xl p-8 hover:border-beetle-green/50 transition-all group hover:-translate-y-2">
                        <div className="w-14 h-14 bg-beetle-green/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShoppingBag className="text-beetle-green w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">1. Real Discounts</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Hold $ROLL to unlock <strong>30-50% OFF</strong> verified off-grid gear (Solar, Water, Starlink).
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-black/40 border border-beetle-green/20 rounded-2xl p-8 hover:border-beetle-electric/50 transition-all group hover:-translate-y-2">
                        <div className="w-14 h-14 bg-beetle-electric/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Users className="text-beetle-electric w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">2. Access Control</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Your wallet is your key. Enter private Telegram channels and gated physical events.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-black/40 border border-beetle-green/20 rounded-2xl p-8 hover:border-beetle-gold/50 transition-all group hover:-translate-y-2">
                        <div className="w-14 h-14 bg-beetle-gold/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Hammer className="text-beetle-gold w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">3. Priority Launchpad</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            New physical projects (Land, Solar) raise their own capital. ROLL holders get <strong>Exclusive Priority Access</strong> to fund these real-world ventures.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-black/40 border border-beetle-green/20 rounded-2xl p-8 hover:border-white/50 transition-all group hover:-translate-y-2">
                        <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Globe className="text-white w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">4. Network State</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Propose new projects via the DAO. If the community votes "Yes", we build it together.
                        </p>
                    </div>
                </div>

                {/* MVP Teaser */}
                <div className="mt-24 text-center">
                    <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-beetle-green to-beetle-electric">
                        <div className="bg-black/90 rounded-xl px-8 py-4">
                            <span className="text-white font-mono font-bold tracking-widest">PARTNER MARKETPLACE LIVE IN APP</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
