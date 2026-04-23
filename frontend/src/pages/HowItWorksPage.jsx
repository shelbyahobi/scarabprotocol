import React from 'react';
import { Home, Lock, Handshake, Factory, FlaskConical, Flame, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { SKU_REGISTRY } from '../data/skuRegistry'; // Imported as requested

const STAGES = [
    {
        icon: <Home size={24} />,
        title: "Household generates waste",
        desc: "A household uses cooking oil, generates kitchen scraps, or installs a solar panel. Each SCARAB device activates with a 50 SCARAB burn — registering the device on-chain and locking its GPS cell. The private key is generated inside the ATECC608A chip. It never leaves the hardware."
    },
    {
        icon: <Lock size={24} />,
        title: "Hardware verifies at source",
        desc: "Every submission is signed by the device chip before it leaves the hardware. Weight, temperature, gas composition, light, soiling — all measured and signed. The oracle rejects any submission whose signature doesn't match the registered public key. No manual entry. No fraud."
    },
    {
        icon: <Handshake size={24} />,
        title: "Collection and handshake",
        desc: "A collection farmer accepts a pickup request within their cluster radius. When they arrive, both devices scan QR codes — triggering a MicroHandshake on-chain. The farmer receives 40% of the submission value. The Hub operator receives 10%. Both parties' BRU rewards are calculated at the moment of the handshake."
    },
    {
        icon: <Factory size={24} />,
        title: "Hub aggregates",
        desc: "Hub nodes aggregate verified batches from multiple household devices. The Hub records fill rate curves, chain-of-custody timestamps, and total weight. When the Hub reaches processing capacity, the BulkHandshake triggers — logging the transfer to the processing facility on-chain and calculating the Logistics Efficiency Ratio (CO₂ avoided by bulk transport vs individual trips)."
    },
    {
        icon: <FlaskConical size={24} />,
        title: "Processing and valorisation",
        desc: "Verified Bokashi reaches farm soil. Verified UCO reaches biodiesel processing or SAF feedstock buyers. Verified kWh reaches the grid. Each stream has a corporate buyer who pays for access to the provenance data — burning SCARAB in the process."
    },
    {
        icon: <Flame size={24} />,
        title: "Data creates value, burns SCARAB",
        desc: "Municipalities pay API subscriptions for district waste data. Corporations burn SCARAB to access device-level UCO provenance for ISCC audits. ESG funds burn SCARAB for agrivoltaic compliance records. Every data purchase reduces SCARAB supply permanently. The more the network grows, the more data is bought, the more SCARAB is burned, the stronger the protocol becomes for every participant."
    }
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar />
            
            <div className="pt-32 pb-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-20 text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                            The Complete <span className="text-emerald-500">Circular Economy Cycle</span>
                        </h1>
                        <p className="text-xl text-gray-400">
                            From household waste generation to corporate data acquisition.
                            Hardware-attested and cryptographically secured at every stage.
                        </p>
                    </header>

                    {/* Horizontal Flow Desktop / Vertical Flow Mobile */}
                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[39px] md:left-0 md:top-[39px] top-0 bottom-0 md:bottom-auto w-1 md:w-full md:h-1 bg-gray-800 z-0"></div>
                        
                        <div className="flex flex-col md:flex-row gap-8 md:gap-4 relative z-10">
                            {STAGES.map((stage, idx) => (
                                <div key={idx} className="flex-1 flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-4">
                                    <div className="w-20 h-20 shrink-0 bg-gray-900 border-2 border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                        {stage.icon}
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-black font-black text-xs rounded-full flex items-center justify-center">
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <div className="md:text-center pt-2 md:pt-0">
                                        <h3 className="text-lg font-bold text-white mb-2 leading-tight">{stage.title}</h3>
                                        <p className="text-xs text-gray-400 leading-relaxed">{stage.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Flywheel Diagram */}
                    <div className="mt-32 max-w-4xl mx-auto text-center">
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12">
                            <h3 className="text-2xl font-black text-white mb-10">The SCARAB flywheel — network effects in a DePIN protocol</h3>
                            
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-bold text-emerald-400">
                                <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">More devices</div>
                                <ArrowRight size={20} className="text-gray-600 rotate-90 md:rotate-0" />
                                <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">More verified data</div>
                                <ArrowRight size={20} className="text-gray-600 rotate-90 md:rotate-0" />
                                <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">More corporate buyers</div>
                                <ArrowRight size={20} className="text-gray-600 rotate-90 md:rotate-0" />
                                <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">More SCARAB burned</div>
                                <ArrowRight size={20} className="text-gray-600 rotate-90 md:rotate-0" />
                                <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">Higher token floor</div>
                                <ArrowRight size={20} className="text-gray-600 rotate-90 md:rotate-0" />
                                <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">Better rewards</div>
                                <ArrowRight size={20} className="text-gray-600 rotate-90 md:rotate-0" />
                                <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">More devices</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
