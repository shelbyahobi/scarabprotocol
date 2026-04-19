import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Home, Book, Terminal, Cpu, Shield, Zap, Scale, Vault, Sprout, CheckCircle, Database, Lock, Pickaxe, MapPin, PieChart, Menu, X, ArrowUpRight, Sun, Recycle } from 'lucide-react';
import Navbar from './Navbar';

export default function Documentation() {
    const { section } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const activeTab = section || 'overview';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    const CATEGORIES = [
        {
            name: 'Getting Started',
            items: [
                { id: 'overview', icon: <Book size={18} />, label: 'Platform Overview' },
                { id: 'quick-start', icon: <Terminal size={18} />, label: 'Quick Start Guide' },
                { id: 'faq', icon: <Pickaxe size={18} />, label: 'Common Questions' }
            ]
        },
        {
            name: 'Core Engineering',
            items: [
                { id: 'architecture', icon: <Database size={18} />, label: 'Protocol Architecture' },
                { id: 'mining', icon: <Cpu size={18} />, label: 'Hardware Specs' },
                { id: 'ops-security', icon: <Lock size={18} />, label: 'Operational Security' },
                { id: 'risks', icon: <Shield size={18} />, label: 'Risk & Countermeasures' }
            ]
        },
        {
            name: 'Protocol Economics',
            items: [
                { id: 'tokenomics', icon: <PieChart size={18} />, label: 'Tokenomics Strategy' },
                { id: 'emissions', icon: <Zap size={18} />, label: 'Monetary Policy' },
                { id: 'governance', icon: <Scale size={18} />, label: 'Governance Mechanics' },
                { id: 'treasury', icon: <Vault size={18} />, label: 'Treasury Strategy' }
            ]
        },
        {
            name: 'Science & Data',
            items: [
                { id: 'carbon-methodology', icon: <Sprout size={18} />, label: 'Carbon Methodology' },
                { id: 'soil', icon: <MapPin size={18} />, label: 'Soil-as-a-Service' },
                { id: 'transparency', icon: <CheckCircle size={18} />, label: 'Verification & Transparency' }
            ]
        }
    ];

    const ALL_ITEMS = CATEGORIES.flatMap(cat => cat.items);
    const filteredItems = searchQuery
        ? ALL_ITEMS.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : null;

    const currentItem = ALL_ITEMS.find(i => i.id === activeTab) || ALL_ITEMS[0];
    const currentCategory = CATEGORIES.find(cat => cat.items.some(i => i.id === activeTab))?.name || 'Documentation';

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">SCARAB Protocol Overview</h2>
                        <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl mb-6 text-center shadow-[0_0_20px_rgba(74,222,128,0.1)]">
                            <div className="text-green-400 font-bold text-xl mb-2">Proof of Productive Asset (PoPA)</div>
                            <div className="text-sm font-normal text-green-500/80">Tokens are minted strictly upon cryptographic cryptographic verification of physical ecological output. Absolutely no passive/speculative minting operates on this network.</div>
                        </div>
                        <p className="text-lg">SCARAB is an institutional-grade Decentralized Physical Infrastructure Network (DePIN) reversing the $8 Trillion climate finance gap. We manufacture and deploy physical IoT hardware that cryptographically verifies carbon sequestration and clean energy production, converting ecological labor into liquid, verified digital assets.</p>
                        
                        <h3 className="text-xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">The Triple Infrastructure Strategy</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-beetle-electric/50 transition-colors">
                                <div className="text-beetle-electric font-bold mb-3 flex items-center gap-2"><Sun size={20} /> Solar Sentinel</div>
                                <p className="text-xs text-gray-400 mb-3">Residential & Commercial PV monitoring. Attaches to existing panels to verify kWh generation via ATECC608A signatures.</p>
                                <div className="text-[10px] font-mono text-gray-500 bg-black/50 px-2 py-1 rounded inline-block">Hardware Price: $349</div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-beetle-gold/50 transition-colors">
                                <div className="text-beetle-gold font-bold mb-3 flex items-center gap-2"><Sprout size={20} /> Smart Bokashi Kit</div>
                                <p className="text-xs text-gray-400 mb-3">Residential organic waste processor mitigating methane emissions. Verifies weight diversion and fermentation temperature.</p>
                                <div className="text-[10px] font-mono text-gray-500 bg-black/50 px-2 py-1 rounded inline-block">Hardware Price: $289 + $12/mo</div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-colors">
                                <div className="text-purple-400 font-bold mb-3 flex items-center gap-2"><MapPin size={20} /> Pro Bioreactor</div>
                                <p className="text-xs text-gray-400 mb-3">Industrial B2B Soil-as-a-Service node. Capable of digesting tons of organic matter for institutional farming.</p>
                                <div className="text-[10px] font-mono text-gray-500 bg-black/50 px-2 py-1 rounded inline-block">Hardware Price: $4,995</div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'quick-start':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Quick Start Roadmap</h2>
                        <p>Joining the SCARAB network requires securing physical hardware and cryptographic provision.</p>
                        <div className="space-y-4">
                            {[
                                { step: 1, title: 'Acquire SCARAB Infrastructure Allocation', text: 'To operate a node, users must secure hardware. During the current Seed Phase, acquiring SCARAB tokens guarantees prioritized hardware fulfillment.' },
                                { step: 2, title: 'Hardware Delivery & Installation', text: 'Hardware is shipped globally. Embedded GPS latches the device to the initial activation timezone to prevent shipment spoofing.' },
                                { step: 3, title: 'Activate Node (Burn Event)', text: 'Pairing the device to your Web3 Wallet requires executing the network activation function, burning 50 SCARAB indefinitely.' },
                                { step: 4, title: 'Automated ROI Emission', text: 'Nodes run autonomously. The decentralized SQS fan-out architecture cross-validates telemetry, driving daily exponential-decay SCARAB rewards straight to your wallet.' }
                            ].map(s => (
                                <div key={s.step} className="flex gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="w-12 h-12 rounded-full bg-black border border-beetle-green text-beetle-green flex items-center justify-center font-black shrink-0 text-xl">{s.step}</div>
                                    <div><h4 className="text-white font-bold text-lg mb-2">{s.title}</h4><p className="text-sm text-gray-400">{s.text}</p></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'faq':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <FAQItem question="Is SCARAB a Security under the Howey Test?" answer="No. SCARAB operates completely on Consumptive Utility. To earn the token, users perform active, physical labor (composting/maintaining hardware). The token is consumed (burned) to activate hardware and for B2B corporations to license ecological data APIs. This strictly differentiates it from passive financial securities." />
                            <FAQItem question="Why does geographic clustering matter?" answer="A core anti-fraud mechanism. 100 sensors in Austin can cryptographically peer-validate a local storm event. 1 scattered sensor in Tokyo cannot be trusted by Carbon registries. The protocol grants up to 2x APY multipliers for nodes deploying in Target Clusters." />
                            <FAQItem question="Can the token supply be inflated?" answer="No. The 1 Billion token hard cap is immutable. The Genesis smart contract enforces an exponential decay curve over 40 years, completely removing manual inflation powers from the team." />
                            <FAQItem question="What stops someone from faking the telemetry?" answer="Every device utilizes an ATECC608A secure element chip. Private keys never leave the silicon, making it physically impossible to spoof the elliptic-curve cryptographic signatures representing the telemetry." />
                        </div>
                    </motion.div>
                );
            case 'architecture':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-6">Protocol Architecture</h2>
                        
                        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-black border border-zinc-700 flex items-center justify-center text-white font-bold">L1</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Physical Hardware Endpoints</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">The bedrock of truth. Microcontrollers (ESP32) pull raw sensor data (HX711 load cells, DS18B20 thermistors). Instantly, this data is routed through the ATECC608A Secure Element, generating an irreversible ECDSA cryptographic signature.</p>
                                </div>
                            </div>
                            
                            <div className="w-px h-8 bg-zinc-700 ml-6"></div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-black border border-beetle-electric flex items-center justify-center text-beetle-electric font-bold">L2</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Decentralized SQS Fan-Out Validation</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">The SQS fan-out relay intercepts the signed payload before it hits the chain. It verifies the signature against the registered public key, cross-checks GPS metadata against known weather/satellite APIs, and calculates geographic consensus amongst clustered nodes.</p>
                                </div>
                            </div>

                            <div className="w-px h-8 bg-zinc-700 ml-6"></div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-black border border-beetle-green flex items-center justify-center text-beetle-green font-bold">L3</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Smart Contract Settlement (UUPS)</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">The verified physical truth is submitted to `EmissionController.sol`. Mathematical modifiers (Time Decay, Clustering Bonuses, Stake Boosts) are calculated, and the resulting SCARAB is autonomously minted to the owner's EVM wallet.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'mining':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Hardware Specifications</h2>
                        <p className="text-lg">SCARAB leverages three primary SDK tiers, manufactured under stringent anti-tamper guidelines to ensure the legitimacy of the network's ecological claim.</p>
                        
                        <div className="space-y-6">
                            <div className="p-8 bg-white/5 border border-beetle-electric/30 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-beetle-electric/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <h3 className="text-2xl font-bold text-white mb-1">Solar Sentinel V1</h3>
                                <div className="text-beetle-electric font-mono text-sm mb-4 border-b border-white/10 pb-4">Base Output: 2,400 BRU / Year</div>
                                <ul className="list-disc list-inside text-sm text-gray-400 space-y-2">
                                    <li><strong className="text-gray-200">MCU:</strong> ESP32-S3 WROOM-1</li>
                                    <li><strong className="text-gray-200">Cryptography:</strong> Microchip ATECC608A</li>
                                    <li><strong className="text-gray-200">Sensor:</strong> INA226 Bi-Directional Current/Power Monitor (±0.1% accuracy)</li>
                                    <li><strong className="text-gray-200">Comms:</strong> Wi-Fi / Optional LoRaWAN attachment</li>
                                </ul>
                            </div>

                            <div className="p-8 bg-white/5 border border-beetle-gold/30 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-beetle-gold/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <h3 className="text-2xl font-bold text-white mb-1">Smart Bokashi Kit</h3>
                                <div className="text-beetle-gold font-mono text-sm mb-4 border-b border-white/10 pb-4">Base Output: 650 BRU / Year</div>
                                <ul className="list-disc list-inside text-sm text-gray-400 space-y-2">
                                    <li><strong className="text-gray-200">Weight Diversion:</strong> HX711 Load Cell Array via Baseplate</li>
                                    <li><strong className="text-gray-200">Biological Tracking:</strong> DS18B20 internal thermodynamic sensors for fermentation validation</li>
                                    <li><strong className="text-gray-200">Anti-Counterfeit:</strong> Proprietary SD-card cryptographic subscriptions for Bokashi Bran validity</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'ops-security':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Operational Security & Defenses</h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-[#050A05] border border-red-500/30 p-6 rounded-2xl">
                                <div className="flex items-center gap-3 mb-4 text-red-400">
                                    <Shield size={24} /> <h3 className="font-bold text-lg text-white">Zero Trust Hardware</h3>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">SCARAB employs an air-gapped HSM Root CA strategy. Devices are provisioned at the factory level and debug ports (JTAG) are irreversibly blown. Even if an attacker physically dismantles a device, the private keys residing in the ATECC608A cannot be extracted to simulate fake volume.</p>
                            </div>

                            <div className="bg-[#050A05] border border-blue-500/30 p-6 rounded-2xl">
                                <div className="flex items-center gap-3 mb-4 text-blue-400">
                                    <Cpu size={24} /> <h3 className="font-bold text-lg text-white">Quantum Resistance</h3>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">Shor's algorithm poses a terminal threat to ECDSA within 10-15 years. SCARAB's UUPS proxy architecture allows our Smart Contracts to upgrade to NIST Post-Quantum standards (CRYSTALS-Dilithium) seamlessly, alongside Over-The-Air (OTA) hardware firmware flashing.</p>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'tokenomics':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Institutional Tokenomics</h2>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold text-xl text-white mb-4">Genesis Allocation</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Seed Sale (Locked)', value: '8.0%', sub: '12mo cliff + 24mo vesting', color: 'bg-beetle-gold' },
                                        { label: 'IDO Public', value: '4.0%', sub: 'TGE Unlocked', color: 'bg-white' },
                                        { label: 'Regen Math Pool', value: '30.0%', sub: '40-Year Decay Curve', color: 'bg-beetle-green' },
                                        { label: 'DEX Liquidity', value: '25.0%', sub: 'Locked 12mo Unicrypt', color: 'bg-blue-400' },
                                        { label: 'DAO Treasury', value: '16.0%', sub: 'Multi-sig + Governance', color: 'bg-purple-400' },
                                        { label: 'Marketing/Adv', value: '10.0%', sub: 'Timelocked', color: 'bg-orange-400' },
                                        { label: 'Core Team', value: '7.0%', sub: '12mo cliff + 24mo vesting', color: 'bg-red-400' }
                                    ].map(i => (
                                        <div key={i.label} className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center text-sm">
                                            <div>
                                                <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${i.color}`} /> <span className="font-bold text-gray-200">{i.label}</span></div>
                                                <div className="text-[10px] text-gray-500 ml-4 mt-0.5">{i.sub}</div>
                                            </div>
                                            <div className="font-mono text-white">{i.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-xl text-white mb-4">Deflationary Sinks (The Burn Engine)</h3>
                                <p className="text-sm text-gray-400 mb-6">The token maintains scarcity and consumptive utility via three massive deflationary pressure points:</p>
                                
                                <div className="space-y-4">
                                    <div className="bg-red-900/10 border-l-2 border-red-500 p-4">
                                        <div className="font-bold text-white text-sm mb-1">Corporate Data Market</div>
                                        <p className="text-xs text-gray-400">ESG Firms purchase biological data APIs using SCARAB. 100% of these tokens are routed to address zero and destroyed permanently.</p>
                                    </div>
                                    <div className="bg-red-900/10 border-l-2 border-red-500 p-4">
                                        <div className="font-bold text-white text-sm mb-1">Activation Fee</div>
                                        <p className="text-xs text-gray-400">Every new IoT device connecting to the SCARAB network must burn a 50 SCARAB activation fee, matching network density directly to supply reduction.</p>
                                    </div>
                                    <div className="bg-red-900/10 border-l-2 border-red-500 p-4">
                                        <div className="font-bold text-white text-sm mb-1">Hardware & Subscription Discounts</div>
                                        <p className="text-xs text-gray-400">Paying for smart compost subscriptions using SCARAB yields 10% discounts. Portions of those payments are removed from circulation.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'emissions':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Monetary Policy & Mathematics</h2>
                        <p className="text-lg">The Regeneration Pool utilizes a highly predictable, time-based exponential decay schedule modeled after the universe's most robust thermodynamic properties. This ensures absolute transparency for institutional VC modeling.</p>

                        <div className="bg-black/80 px-8 py-10 rounded-3xl border border-white/5 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-beetle-green/5 via-transparent to-transparent"></div>
                            <div className="relative z-10 text-3xl md:text-5xl font-mono text-beetle-green font-black tracking-widest filter drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                                E(t) = D₀ × e^(-λt)
                            </div>
                            <div className="text-gray-500 text-sm mt-4 font-mono tracking-widest block">
                                D₀ = Initial Daily Mint | λ = 0.00020518
                            </div>
                        </div>


                        <h3 className="text-xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">Waste Stream Base Multipliers</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Bokashi</div>
                                <div className="text-xl font-black text-white">1.0x</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-beetle-gold/30">
                                <div className="text-xs text-beetle-gold/80 uppercase font-bold mb-1">UCO (SAF Feedstock)</div>
                                <div className="text-xl font-black text-beetle-gold">2.5x</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Restaurant Fat</div>
                                <div className="text-xl font-black text-white">1.8x</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Grease Trap</div>
                                <div className="text-xl font-black text-white">0.8x</div>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">Clustering & Activity Boosts</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h4 className="font-bold text-beetle-gold mb-2 text-lg">Geographic Cluster Bonus (Up to +100%)</h4>
                                <p className="text-sm text-gray-400">Nodes that activate in dense "Target Clusters" (e.g. 50+ nodes in a metro area) earn up to a 2.0x multiplier, as their data creates cross-validated, high-value institutional sensor webs.</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h4 className="font-bold text-beetle-electric mb-2 text-lg">Voluntary SLA Staking (Up to +100%)</h4>
                                <p className="text-sm text-gray-400">Users who physically lock SCARAB collateral alongside their operational node earn boosted emission ratios, heavily rewarding long-term operators with skin in the game.</p>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'governance':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">DAO Governance Logistics</h2>
                        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl">
                            <h3 className="font-bold text-white text-xl mb-4">Wyoming LLC Framework</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                SCARAB Protocol operates under a specialized WRU-compliant Wyoming DAO LLC legal wrapper. This provides the protocol core-contributors and token holders with limited liability protections while maintaining fully decentralized on-chain voting execution via Snapshot and Governor contracts.
                            </p>
                            
                            <h4 className="font-bold text-white mb-3">Immutable Votable Parameters</h4>
                            <ul className="grid grid-cols-2 gap-3 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-beetle-green"/> Treasury Allocation Grants</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-beetle-green"/> Hardware Whitelist Additions</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-beetle-green"/> Burn Threshold Tuning</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-beetle-green"/> B2B Data Pricing Tiers</li>
                            </ul>
                        </div>
                    </motion.div>
                );
            case 'treasury':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Treasury Strategy Flow</h2>
                        <p className="text-gray-400 text-lg">Hardware revenue is mathematically routed via smart contracts, preventing centralized point-of-failure or embezzlement routes.</p>
                        
                        <div className="relative p-8 border border-white/10 rounded-2xl bg-[#090b09] overflow-hidden mt-8">
                            <div className="absolute top-0 right-0 p-4 font-mono text-[100px] font-black text-white/5 leading-none select-none">40/30/20</div>
                            <div className="flex flex-col gap-6 relative z-10">
                                <div>
                                    <div className="text-2xl font-black text-white">40% <span className="text-base font-normal text-gray-500">Hardware & Supply Chain Escrow</span></div>
                                    <div className="h-2 w-full bg-white/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-blue-500 w-[40%]"></div></div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">30% <span className="text-base font-normal text-gray-500">R&D and Protocol Engineering</span></div>
                                    <div className="h-2 w-full bg-white/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-beetle-green w-[30%]"></div></div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">20% <span className="text-base font-normal text-gray-500">Buy & Burn Vault (Deflation)</span></div>
                                    <div className="h-2 w-full bg-white/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-red-500 w-[20%]"></div></div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white">10% <span className="text-base font-normal text-gray-500">Liquidity Provisioning</span></div>
                                    <div className="h-2 w-full bg-white/10 rounded-full mt-2 overflow-hidden"><div className="h-full bg-beetle-gold w-[10%]"></div></div>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-white mt-12 mb-4 border-b border-white/10 pb-2">Stand-alone ESG Revenue: Logistics Efficiency</h3>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            SCARAB's Hub Node network creates a secondary, entirely distinct revenue stream independent of the token model. By intercepting residential organic waste drops at local hubs, SCARAB prevents 50 separate car trips in favor of 1 bulk Electric Vehicle trip to the farm.
                        </p>
                        <div className="bg-[#050A05] border border-beetle-green/20 rounded-2xl p-6 font-mono text-xs text-gray-400 space-y-2">
                            <div><span className="text-gray-500">WITHOUT HUB:</span> 50 car trips × 4km = 200 km × 180g = 36 kg CO2/week</div>
                            <div><span className="text-gray-500">WITH HUB:</span> 1 EV trip = 0 kg CO2 tailpipe emissions</div>
                            <div className="text-beetle-green pt-2 border-t border-white/10 mt-2">NET AVOIDED: 1,872 kg CO2 per Hub per Year</div>
                        </div>
                        <p className="text-sm text-gray-400 mt-6 leading-relaxed">
                            At scale (e.g. 1,000 Hubs), this equates to 1,872 tonnes of completely verifiable avoided logistics emissions—valued at ~€159,000 annually via the EU ETS carbon credit market (€85/tonne). These funds flow directly into the DAO treasury. <strong className="text-white">(Modelled scenario, not guaranteed).</strong>
                        </p>
                    </motion.div>
                );
            case 'carbon-methodology':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Carbon Sequestration Methodology</h2>
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <h4 className="font-bold text-white mb-4 text-xl">The Avoided Methane Standard</h4>
                            <p className="text-sm text-gray-400 mb-6 leading-relaxed">Unlike traditional reforestation credits (which suffer from double-counting and forest fires), SCARAB protocol measures metric avoidance natively at the source. By tracking organic waste diverted from municipal landfills into localized anaerobic fermentation (Bokashi), we mathematically guarantee non-emittable methane capture.</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-black/50 rounded-xl border border-white/5">
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Standard</div>
                                    <div className="text-white font-mono">IPCC Landfill Decay Model</div>
                                </div>
                                <div className="p-4 bg-black/50 rounded-xl border border-white/5">
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Verification Data</div>
                                    <div className="text-white font-mono">GPS, Weight, Thermodynamics</div>
                                </div>
                            </div>

                            <h4 className="font-bold text-white mb-2 mt-8 text-lg">ISCC Certification & SAF Feedstock</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Used Cooking Oil (UCO) generates the highest APY yield (2.5x base). This is because UCO is a highly sought-after commodity feedstock for Sustainable Aviation Fuel (SAF). SCARAB Hub Nodes natively validate UCO via algorithmic density and conductivity checks, preparing our network for formal institutional ISCC verification to sell natively to ESG airline buyers.
                            </p>
                        </div>
                    </motion.div>
                );
            case 'soil':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">SaaS 2.0: Soil-as-a-Service</h2>
                        <p className="text-lg">The SCARAB Protocol serves as the logistical routing highway uniting urban consumers and rural industrial farming through the `ScarabSoilTransfer.sol` contract.</p>
                        <div className="grid md:grid-cols-3 gap-6 mt-8">
                            <HandshakeStep icon={<MapPin size={24} />} title="1. Geographic Routing" description="Urban Bokashi nodes fill to capacity. The protocol notifies local 'Sink Nodes' (Pro biocomposters)." />
                            <HandshakeStep icon={<Database size={24} />} title="2. The Cryptographic Handshake" description="Farmer collects pre-fermented biology. App cryptographically signs the transfer between user and sink." />
                            <HandshakeStep icon={<CheckCircle size={24} />} title="3. Tripartite Settlement" description="Protocol validates transfer, executing SCARAB rewards to the User, the Farmer, and the logistics driver simultaneously." />
                        </div>
                    </motion.div>
                );
            case 'transparency':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Enterprise Data & Transparency</h2>
                        <p className="text-lg">Institutional Carbon Credit Registries (e.g. Verra, Gold Standard) demand mathematically provable data. DePIN networks cannot rely on trust.</p>
                        
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mt-6">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#0A1A0F] border-b border-beetle-green/20">
                                    <tr><th className="p-4 text-beetle-green">Data Type</th><th className="p-4 text-beetle-green">Verification Method</th><th className="p-4 text-beetle-green">Availability</th></tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr className="hover:bg-white/5"><td className="p-4 font-bold text-white">Cryptographic Signatures</td><td className="p-4 text-gray-400">ATECC608A Chip Native</td><td className="p-4 font-mono text-xs">Real-time RPC</td></tr>
                                    <tr className="hover:bg-white/5"><td className="p-4 font-bold text-white">Geospatial Anomalies</td><td className="p-4 text-gray-400">MapBox Triangulation + Peer Sensors</td><td className="p-4 font-mono text-xs">DataMarket API</td></tr>
                                    <tr className="hover:bg-white/5"><td className="p-4 font-bold text-white">Thermodynamic Bounds</td><td className="p-4 text-gray-400">DS18B20 Hard-coded Limits</td><td className="p-4 font-mono text-xs">IPFS Snapshot (24h)</td></tr>
                                    <tr className="hover:bg-white/5"><td className="p-4 font-bold text-white">Emission Distribution</td><td className="p-4 text-gray-400">Smart Contract Explorer</td><td className="p-4 font-mono text-xs">BSCScan</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className="text-2xl font-black text-white mt-12 mb-4 border-b border-white/10 pb-2">Technical Architecture Pipeline</h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Below is the definitive data-flow mapping physical world validation to smart contract execution.
                        </p>
                        <div className="bg-black border border-white/10 rounded-2xl p-6 overflow-x-auto text-xs text-beetle-green font-mono whitespace-pre font-bold">
{` [Edge Hardware]        [Cloud Relay]          [Oracles]            [On-Chain Exec]      [Deflation Engine]

 +-------------+      +---------------+      +--------------+      +----------------+      +--------------+
 | ESP32-S3    |      | AWS SQS Queue |      | SCARAB Node. |      | HubValidator   |      | Liquidity-   |
 | ATECC608A   | ===> | / Telemetry   | ===> | js Relayer   | ===> | .sol (Escrow)  | ===> | BackingVault |
 | I2C Sensors |      | Buffer        |      | (Validates   |      | (Phase 1 & 2)  |      | .sol         |
 +-------------+      +---------------+      | Signatures)  |      +----------------+      +--------------+
                                             +--------------+                                      ||
                                                                                                   \\/
                                                                                            +---------------+
                                                                                            | PancakeSwap   |
                                                                                            | Buy & Burn    |
                                                                                            +---------------+`}
                        </div>
                    </motion.div>
                );
            case 'risks':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <h2 className="text-3xl font-black text-white mb-4">Attack Vectors & Countermeasures</h2>
                        <div className="space-y-6">
                            <FraudProtection method="Sybil Attack (Fake Nodes)" description="To spin up 1,000 fake AWS server nodes, an attacker must burn 50 SCARAB per node (50,000 SCARAB). Because they lack the hardware ATECC608A cryptographic identity chips, the SQS relay immediately rejects their spoofed telemetry, permanently isolating and destroying their capital investment." />
                            <FraudProtection method="Quantum Computing Decryption" description="Protocol is UUPS upgradeable and explicitly mapped to migrate to NIST's 2024 Post-Quantum standard (CRYSTALS-Dilithium) allowing hardware Edge-OTA updates well before the million-qubit threshold threatens ECDSA." />
                            <FraudProtection method="Sensor Spoofing" description="If an attacker physically bypasses a sensor (e.g. heating a thermometer with a lighter to fake fermentation), Geographic Clustering algorithms compare it against peer nodes and standard physical thermodynamic duration curves, flagging manual manipulation anomalies." />
                        </div>

                        <h3 className="text-2xl font-black text-white mt-12 mb-4 border-b border-warning/10 pb-2">Open Risks (Series A Transparency)</h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            We believe in absolute transparency with institutional backers. The following risk vectors are actively being engineered against in the current sprint lifecycle:
                        </p>
                        <div className="space-y-4">
                            <div className="bg-red-900/10 border-l-2 border-red-500 p-4">
                                <div className="font-bold text-white text-sm mb-1">API3 Oracle Gap (UCO Spot Pricing)</div>
                                <p className="text-xs text-gray-400">Chainlink currently lacks an EU-specific Used Cooking Oil (UCO) commodity data feed. The `LiquidityBackingVault` fundamentally relies on these price floors. We are actively developing a custom external adapter for API3 Airnodes to bridge this exact deficiency.</p>
                            </div>
                            <div className="bg-orange-900/10 border-l-2 border-orange-500 p-4">
                                <div className="font-bold text-white text-sm mb-1">ISCC Certification Timeline</div>
                                <p className="text-xs text-gray-400">Selling UCO directly as Sustainable Aviation Fuel (SAF) feedstock requires formal institutional ISCC verification. While our hardware validations meet the criteria, the bureaucratic pilot approval process represents a 6-9 month external timing dependency.</p>
                            </div>
                            <div className="bg-yellow-900/10 border-l-2 border-yellow-500 p-4">
                                <div className="font-bold text-white text-sm mb-1">Regulatory Jurisdiction / DAO Liability</div>
                                <p className="text-xs text-gray-400">The protocol operates under a Wyoming DAO LLC legal wrapper. However, physical hardware deployment in the EU creates conflicting multi-jurisdiction liabilities. A finalized corporate restructuring is TBD pending Series A lead counsel review.</p>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return (
                    <div className="py-20 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Section Under Migration</h2>
                        <p className="text-gray-500">The content for <code>{activeTab}</code> is currently being validated for institutional grade standards.</p>
                        <button onClick={() => navigate('/docs/overview')} className="mt-8 text-beetle-green flex items-center gap-2 mx-auto"><Home size={16} /> Back to Overview</button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#050A05] text-[#E8E8E8] font-sans flex flex-col overflow-x-hidden">
            <Navbar isLanding={false} />

            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="w-14 h-14 bg-beetle-green text-black rounded-full shadow-2xl flex items-center justify-center border-4 border-black active:scale-95 transition-transform"
                >
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            <div className="flex-1 flex pt-20 overflow-hidden relative">
                {/* Left Sidebar (Sticky) */}
                <aside className={`
                    fixed lg:sticky top-20 bottom-0 left-0 z-40 w-72 bg-[#050A05] border-r border-white/5 p-6 overflow-y-auto transition-transform duration-300
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="relative mb-8">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-beetle-green outline-none transition-all"
                        />
                        {searchQuery && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-[#0A1A0F] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                                {filteredItems?.length ? filteredItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => { navigate(`/docs/${item.id}`); setSearchQuery(''); setIsSidebarOpen(false); }}
                                        className="w-full px-4 py-3 text-left text-sm hover:bg-white/10 flex items-center gap-3 transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <span className="text-gray-500">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </button>
                                )) : <div className="px-4 py-3 text-xs text-gray-500">No results found</div>}
                            </div>
                        )}
                    </div>

                    <nav className="space-y-8">
                        {CATEGORIES.map((cat, idx) => (
                            <div key={idx}>
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 mb-4 px-3 flex items-center justify-between">
                                    {cat.name}
                                </h4>
                                <div className="space-y-1">
                                    {cat.items.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => { navigate(`/docs/${item.id}`); setIsSidebarOpen(false); }}
                                            className={`
                                                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                                                ${activeTab === item.id
                                                    ? 'bg-beetle-green/10 text-beetle-green shadow-[inset_0_0_10px_rgba(74,222,128,0.05)]'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                            `}
                                        >
                                            <span className={activeTab === item.id ? 'text-beetle-green' : 'text-gray-500'}>
                                                {item.icon}
                                            </span>
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 bg-[#050A05] relative overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
                            <Link to="/" className="hover:text-white flex items-center gap-1"><Home size={12} /> Home</Link>
                            <ChevronRight size={12} className="shrink-0" />
                            <span className="capitalize">{currentCategory}</span>
                            <ChevronRight size={12} className="shrink-0" />
                            <span className="text-beetle-green font-bold">{currentItem.label}</span>
                        </div>

                        <div className="relative min-h-[60vh]">
                            {renderContent()}
                        </div>

                        {/* Page Footer Navigation */}
                        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                            <button
                                onClick={() => {
                                    const idx = ALL_ITEMS.findIndex(i => i.id === activeTab);
                                    if (idx > 0) navigate(`/docs/${ALL_ITEMS[idx - 1].id}`);
                                }}
                                className="w-full sm:w-auto px-4 py-2 text-gray-500 hover:text-white flex items-center justify-center gap-2 group transition-colors border border-transparent hover:border-white/10 rounded-lg"
                            >
                                <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                                Previous Section
                            </button>
                            <button
                                onClick={() => {
                                    const idx = ALL_ITEMS.findIndex(i => i.id === activeTab);
                                    if (idx < ALL_ITEMS.length - 1) navigate(`/docs/${ALL_ITEMS[idx + 1].id}`);
                                }}
                                className="w-full sm:w-auto px-4 py-2 bg-beetle-green/10 text-beetle-green hover:bg-beetle-green/20 flex items-center justify-center gap-2 group transition-all border border-beetle-green/20 rounded-lg"
                            >
                                Next Section
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar: TOC (Desktop Only) */}
                <aside className="hidden xl:block w-72 bg-[#050A05] sticky top-20 h-[calc(100vh-80px)] p-8 border-l border-white/5">
                    <h5 className="text-[10px] uppercase tracking-widest font-black text-gray-500 mb-6 px-1">
                        In this section
                    </h5>
                    <nav className="space-y-4 text-xs">
                        <a href="#" className="block text-beetle-green font-bold border-l-2 border-beetle-green pl-4">Introduction</a>
                        <a href="#" className="block text-gray-500 hover:text-gray-300 pl-4 border-l-2 border-transparent transition-all">Deep Dive Metrics</a>
                        <a href="#" className="block text-gray-500 hover:text-gray-300 pl-4 border-l-2 border-transparent transition-all">Security Controls</a>
                        <div className="mt-12 pt-8 border-t border-white/5">
                            <a href="#" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
                                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                View on GitHub
                            </a>
                        </div>
                    </nav>
                </aside>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors bg-white/5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
                <span className="font-bold text-white text-sm">{question}</span>
                <ChevronRight className={`text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} size={16} />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-sm text-gray-400 border-t border-white/5 pt-4 bg-black/20">
                    {answer}
                </div>
            )}
        </div>
    );
}

function HandshakeStep({ icon, title, description }) {
    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative group hover:border-beetle-green/40 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-black rounded-xl border border-white/10 flex items-center justify-center text-beetle-green mb-4 group-hover:scale-110 transition-all">
                {icon}
            </div>
            <h4 className="text-white font-bold mb-2 text-sm">{title}</h4>
            <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
        </div>
    );
}

function RewardCard({ amount, recipient, description, color }) {
    const bgMap = {
        'beetle-gold': 'from-[#D4AF37]/5',
        'beetle-green': 'from-[#4ADE80]/5',
        'beetle-electric': 'from-[#22D3EE]/5'
    };

    return (
        <div className={`text-center p-6 rounded-2xl border border-white/5 bg-gradient-to-b ${bgMap[color] || 'from-white/5'} to-transparent`}>
            <div className={`text-3xl font-black text-${color} mb-3 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                {amount}
            </div>
            <div className="text-white font-bold mb-2 uppercase tracking-wide text-sm">{recipient}</div>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    );
}

function FraudProtection({ method, description }) {
    return (
        <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:border-red-500/20 transition-colors">
            <div className="mt-1 shrink-0"><Shield size={18} className="text-red-400/60" /></div>
            <div>
                <div className="text-white font-bold text-sm mb-1">{method}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{description}</div>
            </div>
        </div>
    );
}
