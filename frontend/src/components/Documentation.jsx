import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Pickaxe, Sprout, UserPlus, ChevronRight, CheckCircle, Zap, Shield, Database, Sun, Recycle, MapPin, Scan, Coins, PieChart, TrendingUp, TrendingDown, Vault, Scale, ArrowDownRight, ArrowUpRight, BarChart3, Lock } from 'lucide-react';
import Navbar from './Navbar';

export default function Documentation() {
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    const CATEGORIES = [
        {
            name: 'Core Engineering',
            items: [
                { id: 'overview', icon: <BookOpen size={18} />, label: 'Platform Overview' },
                { id: 'architecture', icon: <Database size={18} />, label: 'Protocol Architecture' },
                { id: 'mining', icon: <Pickaxe size={18} />, label: 'Hardware Specs' },
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
            name: 'Regenerative Science',
            items: [
                { id: 'carbon-methodology', icon: <Sprout size={18} />, label: 'Carbon Methodology' },
                { id: 'soil', icon: <MapPin size={18} />, label: 'Soil-as-a-Service' },
                { id: 'transparency', icon: <CheckCircle size={18} />, label: 'Verification & Transparency' }
            ]
        }
    ];

    const ALL_TABS = CATEGORIES.flatMap(cat => cat.items);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">SCARAB Protocol Overview</h2>
                            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl mb-6 text-green-400 font-bold text-lg text-center">
                                SCARAB is a production-gated minting protocol.<br />
                                <span className="text-sm font-normal text-green-500/80">Tokens are minted ONLY when verified physical ecological output occurs.</span>
                            </div>
                            <p className="mb-4">
                                SCARAB is a Regenerative Infrastructure Platform (DePIN) designed to incentivize real-world ecological action.
                                We deploy cryptographic hardware nodes to seamlessly measure, verify, and mathematically reward planetary regeneration.
                            </p>
                            <p>
                                Rather than relying on centralized entities to define "sustainability", SCARAB places secure hardware (the ATECC608A chip)
                                directly into the hands of citizens and farmers, turning everyday actions into verifiable, yield-generating Real World Assets (RWA).
                            </p>
                        </div>

                        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">The Dual-Pillar Ecosystem</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-beetle-electric"><Sun size={20} /> <span className="font-bold">Solar Nodes</span></div>
                                    <p className="text-sm">Targeting homeowners. Measurable energy output translates into SCARAB rewards while stabilizing local grids.</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-beetle-gold"><Recycle size={20} /> <span className="font-bold">Bokashi Kits</span></div>
                                    <p className="text-sm">Targeting urban apartments. Transforming organic waste into high-grade pre-compost, avoiding massive methane emissions.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'mining':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Hardware Specifications</h2>
                            <p className="mb-6 text-gray-400">Institutional-grade hardware designed for high-fidelity ecological data capture.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Sun size={48} /></div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 text-beetle-electric"><Zap size={20} /> Solar Sentinel Node</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs uppercase text-gray-500 font-bold mb-1">Compute & Auth</div>
                                            <div className="text-sm">ESP32-S3 @ 240MHz + ATECC608A Secure Element</div>
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase text-gray-500 font-bold mb-1">Sensing Array</div>
                                            <div className="text-sm">INA226 (High-Side Current/Power) | ±0.1% Precision</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs uppercase text-gray-500 font-bold mb-1">Capability</div>
                                            <div className="text-sm">2,400 BRU / Year (1kWh/day baseline)</div>
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase text-gray-500 font-bold mb-1">MSRP</div>
                                            <div className="text-sm text-beetle-electric font-bold">$349.00</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Recycle size={48} /></div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 text-beetle-gold"><Sprout size={20} /> Smart Bokashi Kit (Home)</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs uppercase text-gray-500 font-bold mb-1">Compute & Auth</div>
                                            <div className="text-sm">ESP32-C3 (RISC-V) + ATECC608A Secure Element</div>
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase text-gray-500 font-bold mb-1">Sensing Array</div>
                                            <div className="text-sm">HX711 (Load Cell 50kg) | MQ-135 (Gas) | DS18B20 (Temp)</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs uppercase text-gray-500 font-bold mb-1">Capability</div>
                                            <div className="text-sm">650 BRU / Year (Verified Carbon Sequestration)</div>
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase text-gray-500 font-bold mb-1">MSRP</div>
                                            <div className="text-sm text-beetle-gold font-bold">$89.00 + $12/mo Subscription</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'carbon-methodology':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Carbon Methodology (v0.1)</h2>
                            <p className="mb-6 text-gray-400">Scientific framework for quantifying avoided methane emissions and soil organic carbon (SOC) sequestration.</p>
                        </div>
                        <div className="bg-[#0a1a0f] border border-beetle-green/20 p-8 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-6">Avoided Methane Mechanism</h3>
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-4">
                                    <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                                        <div className="text-beetle-green font-bold mb-1">Baseline (MCF 1.0)</div>
                                        <p className="text-xs text-gray-500 font-mono">L₀ = MCF × DOC × DOC_f × F × 16/12</p>
                                        <p className="text-sm mt-2">Diverting food waste from anaerobic landfills avoids 1.9 kg CO₂-eq per kg of waste.</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                                        <div className="text-beetle-gold font-bold mb-1">SCARAB Offset (v0.1)</div>
                                        <p className="text-xs text-gray-500 font-mono">Net = Baseline - Leakage - Transport</p>
                                        <p className="text-sm mt-2">Applying a 20% uncertainty buffer to all calculated avoidance for institutional conservatism.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-white/5 pt-6">
                                <h4 className="font-bold text-white mb-4">Validation Hierarchy</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-sm"><CheckCircle size={14} className="inline text-beetle-green mr-2" /> Mass Verification (HX711)</div>
                                    <div className="text-sm"><CheckCircle size={14} className="inline text-beetle-green mr-2" /> Bio-Fingerprint (Temp Profile)</div>
                                    <div className="text-sm"><CheckCircle size={14} className="inline text-beetle-green mr-2" /> Presence Proof (Handshake)</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'soil':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <section className="py-12 bg-gradient-to-b from-black to-[#0a1a0f] rounded-3xl overflow-hidden border border-white/5 relative">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px]"></div>

                            <div className="container mx-auto px-6 relative z-10">

                                <div className="text-center mb-16">
                                    <span className="text-beetle-green font-bold uppercase tracking-[0.3em] text-sm">
                                        Soil-as-a-Service™
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-6 leading-tight">
                                        Closing the Urban–Rural<br />Nutrient Loop
                                    </h2>
                                    <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                                        SCARAB transforms urban organic waste into verified agricultural input
                                        through a cryptographically secured settlement mechanism.
                                    </p>
                                </div>

                                {/* The Fertility Handshake */}
                                <div className="max-w-4xl mx-auto mb-20">
                                    <h3 className="text-2xl font-bold text-white mb-10 text-center">
                                        The Fertility Handshake
                                    </h3>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <HandshakeStep
                                            icon={<MapPin />}
                                            title="1. Urban Regeneration"
                                            description="After completing fermentation, users locate a Verified Sink Node (Farm) via the Regen-Map. Physical proximity is established."
                                        />
                                        <HandshakeStep
                                            icon={<Scan />}
                                            title="2. Physical Settlement"
                                            description="Farmers scan a one-time cryptographic receipt confirming nutrient transfer. Weight sensors verify material quantity."
                                        />
                                        <HandshakeStep
                                            icon={<Coins />}
                                            title="3. Protocol Settlement"
                                            description="Three-way reward distribution: User (closure bonus), Farmer (processing fee), Validator Node (presence proof)."
                                        />
                                    </div>
                                </div>

                                {/* Reward Breakdown */}
                                <div className="bg-black/60 rounded-2xl p-8 border border-beetle-green/30 max-w-4xl mx-auto mb-20 shadow-[0_0_30px_rgba(74,222,128,0.05)]">
                                    <h3 className="text-xl font-bold text-white mb-8 text-center">
                                        Settlement Economics
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        <RewardCard
                                            amount="15 SCARAB"
                                            recipient="User"
                                            description="Closure Bonus for completing the ecological loop"
                                            color="beetle-gold"
                                        />
                                        <RewardCard
                                            amount="7 SCARAB"
                                            recipient="Farmer"
                                            description="Processing Fee + fertilizer acquisition"
                                            color="beetle-green"
                                        />
                                        <RewardCard
                                            amount="3 SCARAB"
                                            recipient="Validator"
                                            description="Physical presence verification reward"
                                            color="beetle-electric"
                                        />
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center">
                                        <p className="text-xs text-gray-500 font-medium">
                                            All rewards scale dynamically with total network efficiency to preserve monetary stability.
                                        </p>
                                    </div>
                                </div>

                                {/* Anti-Fraud */}
                                <div className="max-w-4xl mx-auto bg-red-500/5 border border-red-500/20 rounded-xl p-8 shadow-inner">
                                    <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                                        <Shield className="text-red-400" />
                                        Anti-Fraud Architecture (v2)
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
                                        <FraudProtection
                                            method="Weight Correlation Tolerance"
                                            description="User's final bucket weight must dynamically match farmer's received weight (±10% variance)."
                                        />
                                        <FraudProtection
                                            method="One-Time Nonce Cryptography"
                                            description="QR codes execute on a one-time nonce structure preventing remote replay attacks."
                                        />
                                        <FraudProtection
                                            method="Bluetooth Proximity (Incoming)"
                                            description="Validator nodes must be physically present (RSSI < -60 dBm) for final validation."
                                        />
                                        <FraudProtection
                                            method="Dynamic Staking (Incoming)"
                                            description="Farmers stake proportional to capacity (1 SCARAB per kg required)."
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </motion.div>
                );
            case 'architecture':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Protocol Architecture</h2>
                            <p className="mb-6 text-gray-400">SCARAB is a multi-layered cryptographic protocol engineered to enable cryptographically
                                verifiable physical production data. The architecture minimizes trust requirements through hardware-level
                                security, decentralized validation, and algorithmic emission control.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-3 text-beetle-gold">Layer 1: Physical Infrastructure</h3>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <div className="text-beetle-gold font-bold mb-2">Solar Sentinel</div>
                                        <ul className="text-xs space-y-1 text-gray-400">
                                            <li>MCU: ESP32-S3</li>
                                            <li>Sensor: INA226 (I2C)</li>
                                            <li>Sampling: 10s intervals</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <div className="text-beetle-gold font-bold mb-2">Bokashi Kit</div>
                                        <ul className="text-xs space-y-1 text-gray-400">
                                            <li>MCU: ESP32-C3</li>
                                            <li>Sensors: DS18B20, HX711, MQ-135</li>
                                            <li>Sampling: 5m intervals</li>
                                        </ul>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 italic">All devices operate on battery power with &lt;1W average consumption.</p>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-3 text-beetle-gold">Layer 2: Embedded Cryptographic Security</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm ml-2 mb-4">
                                    <li><strong className="text-white">ATECC608A Secure Element:</strong> ECC P-256 cryptographic coprocessor with hardware-protected unextractable private keys.</li>
                                    <li><strong className="text-white">Monotonic Counters:</strong> Increments on each signature to detect and flag replay or tampering attempts.</li>
                                    <li><strong className="text-white">Firmware Attestation:</strong> Telemetry payloads include firmware version hashes signed by the secure element.</li>
                                </ul>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-3 text-beetle-electric">Layer 3: Data Validation & Oracle Network</h3>
                                <p className="text-sm text-gray-400 mb-4">Currently transitioning from a Federated Oracle (Phase 1) to an EigenLayer AVS decentralized network (Targeted Q2 2027).</p>
                                <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                                    <li><strong className="text-white">Oracle Integrity:</strong> Whitelist verification against <code>DeviceRegistry.sol</code> via factory-signed certificate chains.</li>
                                    <li><strong className="text-white">Damage Ceiling:</strong> On-chain immutable global daily emission caps bound maximum loss from oracle collusion.</li>
                                    <li><strong className="text-white">Auditability:</strong> Raw telemetry hashed and pinned to IPFS for permanent independent verification.</li>
                                </ul>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-3 text-beetle-green">Layer 4: Smart Contract Layer</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm ml-2 mb-6">
                                    <li><strong className="text-white">Emission Controller:</strong> Calculates token generation using the official 40-year decay curve.</li>
                                    <li><strong className="text-white">Immutable Math:</strong> <code>λ = 0.00020518</code> Daily Decay | <code>D₀ = 61,554 SCARAB</code> Base.</li>
                                    <li><strong className="text-white">Efficiency Scaling:</strong> Rewards are scaled by the BRU (Base Regenerative Unit) capability of each hardware tier.</li>
                                </ul>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xs">
                                <h4 className="font-bold text-gray-400 mb-2 font-sans uppercase">Official Mainnet Contracts (Pending Final Deployment)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
                                    <div className="truncate">SCARABToken:<br /><a href="#" className="text-beetle-gold hover:underline">0xMAINNET_ADDRESS_HERE</a></div>
                                    <div className="truncate">EmissionController:<br /><a href="#" className="text-beetle-gold hover:underline">0xMAINNET_ADDRESS_HERE</a></div>
                                    <div className="truncate">DeviceRegistry:<br /><a href="#" className="text-beetle-gold hover:underline">0xMAINNET_ADDRESS_HERE</a></div>
                                    <div className="truncate">TreasuryVault:<br /><a href="#" className="text-beetle-gold hover:underline">0xMAINNET_ADDRESS_HERE</a></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-3 text-beetle-green">Layer 5: Transparency & Data Availability</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                                <li><strong className="text-white">Real-Time Dashboards:</strong> All emissions and device registrations logged via immutable events.</li>
                                <li><strong className="text-white">Bokashi Carbon Methodology v0.1:</strong> Diversion math based on IPCC landfill methane coefficients.</li>
                                <li><strong className="text-white">Public Audits:</strong> Open-source repositories for firmware and contract audits.</li>
                            </ul>
                        </div>
                    </motion.div >
                );
            case 'ops-security':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Operational Security: Root CA & Provisioning</h2>
                            <p className="mb-6 text-gray-400">SCARAB implements institutional-grade hardware security to ensure the integrity of the protocol's root of trust.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h4 className="text-beetle-gold font-bold mb-3 flex items-center gap-2"><Lock size={16} /> Offline Root CA</h4>
                                <p className="text-xs text-gray-500">Stored on air-gapped HSMs in secure physical vaults. Signs intermediate certs once every 2 years with M-of-N Shamir backups.</p>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h4 className="text-beetle-gold font-bold mb-3 flex items-center gap-2"><Shield size={16} /> Cloud KMS (L1)</h4>
                                <p className="text-xs text-gray-500">AWS/GCP HSMs restricted via hardware-authenticated IAM (YubiKeys). Signs individual device certificates during factory provisioning.</p>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h4 className="text-beetle-gold font-bold mb-3 flex items-center gap-2"><Database size={16} /> ATECC608A</h4>
                                <p className="text-xs text-gray-500">Embedded ECC P-256 coprocessor. Generates unique private keys internally that never leave the silicon.</p>
                            </div>
                        </div>
                        <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-3">Provisioning Workflow</h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
                                <li>Device generates internal ECC keypair during fabrication.</li>
                                <li>Provisioning station sends CSR to Intermediate CA.</li>
                                <li>Intermediate CA signs and pushes public key to DeviceRegistry.sol.</li>
                                <li>JTAG/SWD debug ports are physically blown to prevent firmware extraction.</li>
                            </ol>
                        </div>
                    </motion.div>
                );
            case 'tokenomics':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div className="mb-12">
                            <h2 className="text-3xl font-black text-white mb-4">
                                Asset-Backed Tokenomics
                            </h2>
                            <p className="text-gray-400 text-lg">
                                1 Billion Fixed Supply. No Inflation Design.<br />
                                <span className="text-beetle-gold">Utility-First Distribution.</span>
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
                            <div className="relative flex justify-center">
                                <div className="w-80 h-80 rounded-full relative shadow-[0_0_50px_rgba(0,240,255,0.1)] transition-transform duration-500 ease-out" style={{
                                    background: `conic-gradient(
                                        #D4A843 0deg 108deg,
                                        #3DDB5A 108deg 216deg,
                                        #4D9FFF 216deg 306deg,
                                        #A855F7 306deg 342deg,
                                        #4B5563 342deg 360deg
                                    )`
                                }}>
                                    <div className="absolute inset-4 bg-[#050a05] rounded-full flex flex-col items-center justify-center z-10">
                                        <span className="text-5xl font-black text-white">1B</span>
                                        <span className="text-sm text-gray-500 uppercase tracking-widest font-bold mt-2">Fixed Supply</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="space-y-4 mb-10">
                                    {[
                                        { label: "Seed Sale (R&D)", value: 30, color: "bg-beetle-gold", desc: "Funding Hardware R&D & Mfg" },
                                        { label: "Regeneration Pool", value: 30, color: "bg-beetle-green", desc: "Mining Rewards for verified output" },
                                        { label: "Liquidity Pool", value: 25, color: "bg-beetle-electric", desc: "Locked for 12 Months" },
                                        { label: "Marketing & Scale", value: 10, color: "bg-purple-500", desc: "Global Expansion" },
                                        { label: "Team (Vested)", value: 5, color: "bg-gray-600", desc: "24-Month Linear Vesting" },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_8px_currentColor]`}></div>
                                                <div>
                                                    <div className="text-white font-bold">{item.label}</div>
                                                    <div className="text-xs text-gray-500">{item.desc}</div>
                                                </div>
                                            </div>
                                            <div className="font-mono text-beetle-gold font-bold">{item.value}%</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <Zap className="text-beetle-electric" size={18} /> Transaction Economics
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-center">
                                            <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">Buy Tax</div>
                                            <div className="text-3xl font-black text-beetle-green">0%</div>
                                            <div className="text-[10px] text-gray-500 mt-1">Frictionless Entry</div>
                                        </div>
                                        <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-center">
                                            <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">Sell Tax</div>
                                            <div className="text-3xl font-black text-red-400">5%</div>
                                            <div className="text-[10px] text-gray-500 mt-1">3% Mktg / 2% Hardware</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-beetle-green/10 rounded-full blur-[80px]"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-beetle-green/10 border border-beetle-green/30 rounded-xl flex items-center justify-center">
                                        <Scale className="text-beetle-green w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white">The Scaling Flywheel</h3>
                                        <p className="text-gray-400">Yield Compression vs. Value Appreciation</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8 mb-6">
                                    <div>
                                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                            <ArrowDownRight className="text-red-400" size={18} /> 1. Yield Compression
                                        </h4>
                                        <p className="text-gray-400 text-sm">
                                            The protocol emits a <strong className="text-white">fixed</strong> daily overall pool of SCARAB. As we add <strong>different types of nodes</strong>, they all share this exact same fixed pool. If 1,000 new Solar nodes join, the daily quantity of SCARAB earned by existing Bokashi nodes decreases. Early adopters earn the highest token quantities.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                            <ArrowUpRight className="text-beetle-gold" size={18} /> 2. Value Appreciation
                                        </h4>
                                        <p className="text-gray-400 text-sm">
                                            While individual token <em>quantity</em> drops, token <em>value</em> rises. 10,000 nodes generate 100x more real-world revenue than 100 nodes. All that revenue flows directly into the Liquidity Vault, driving the <strong className="text-beetle-gold">Intrinsic Floor Price</strong> upward.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-[#0a1a0f] border border-green-500/20 rounded-2xl p-8 relative overflow-hidden">
                            <h3 className="text-2xl font-black text-white mb-2">The Ecosystem Subscription (ROI Example)</h3>
                            <p className="text-gray-400 mb-6">
                                To earn SCARAB from an active Bokashi Node, users must maintain an active <strong>$9 USDT/month</strong> hardware supply subscription. Here is how the Vault Floor mathematically guarantees profitability over time:
                            </p>
                            <div className="grid md:grid-cols-3 gap-6 text-center">
                                <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                                    <div className="text-3xl font-black text-white">100</div>
                                    <div className="text-sm text-gray-500 mt-1">SCARAB / Month<br />(Example Yield)</div>
                                </div>
                                <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                                    <div className="text-3xl font-black text-red-400">$9</div>
                                    <div className="text-sm text-gray-500 mt-1">Monthly Cost<br />(Bokashi Bran)</div>
                                </div>
                                <div className="bg-black/40 p-6 rounded-xl border border-green-500/20 relative shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                                    <div className="absolute top-0 right-0 bg-green-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">GUARANTEED ROI</div>
                                    <div className="text-3xl font-black text-green-400">$0.09</div>
                                    <div className="text-sm text-gray-500 mt-1">Required Floor Price<br />to Break Even</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'emissions':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <section id="emission-policy" className="mb-12">
                            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                                <TrendingDown className="text-beetle-green inline-block mr-2" />
                                Emission & Monetary Policy
                            </h2>

                            <div className="bg-beetle-gold/5 border border-beetle-gold/30 rounded-xl p-6 mb-6">
                                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <Lock size={18} className="text-beetle-gold" />
                                    Fixed Supply with Time-Based Decay
                                </h3>
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                    SCARAB has a <strong className="text-white">fixed maximum supply of 1,000,000,000 tokens</strong>.
                                    No additional tokens can be minted beyond this cap. The <code>SCARABToken.sol</code> contract
                                    has no administrative mint function post-deployment.
                                </p>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    The Regeneration Pool (300M tokens, 30% of supply) unlocks via <code>EmissionController.sol</code>
                                    according to an <strong className="text-white">exponential decay formula</strong> that
                                    mathematically guarantees long-term sustainability.
                                </p>
                            </div>

                            <div className="bg-black/40 border border-white/10 rounded-xl p-6 mb-6">
                                <h3 className="text-lg font-bold text-white mb-4">
                                    Decay Model: e^(-λt)
                                </h3>

                                <div className="space-y-4">
                                    <div className="bg-black/80 rounded-lg p-5 border border-white/5">
                                        <div className="text-sm font-bold text-white mb-4">
                                            Emission Pool Depletion Schedule:
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-[#111] rounded-lg p-4 border border-white/5">
                                                <div className="text-xs text-gray-500 mb-1">Year 1</div>
                                                <div className="text-2xl font-bold text-beetle-gold mb-1">~21.6M</div>
                                                <div className="text-xs text-gray-500">SCARAB Emitted</div>
                                            </div>
                                            <div className="bg-[#111] rounded-lg p-4 border border-white/5">
                                                <div className="text-xs text-gray-500 mb-1">Year 10</div>
                                                <div className="text-2xl font-bold text-amber-500 mb-1">~158.5M</div>
                                                <div className="text-xs text-gray-500">Cumulative Emitted (53%)</div>
                                            </div>
                                            <div className="bg-[#111] rounded-lg p-4 border border-white/5">
                                                <div className="text-xs text-gray-500 mb-1">Year 20</div>
                                                <div className="text-2xl font-bold text-orange-500 mb-1">~233.1M</div>
                                                <div className="text-xs text-gray-500">Cumulative Emitted (77%)</div>
                                            </div>
                                            <div className="bg-[#111] rounded-lg p-4 border border-white/5">
                                                <div className="text-xs text-gray-500 mb-1">Year 40</div>
                                                <div className="text-2xl font-bold text-red-500/80 mb-1">~285.3M</div>
                                                <div className="text-xs text-gray-500">Cumulative Emitted (95%)</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <CheckCircle size={18} className="text-green-400" />
                                    Long-Term Sustainability Proven
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    The exponential decay model ensures the 300M Regeneration Pool lasts <strong className="text-white">77+ years</strong> at current network density.
                                    As device count increases, the efficiency ratio naturally scales rewards to maintain sustainable emission rates.
                                </p>
                            </div>
                        </section>

                        <section id="emission-appendix" className="mb-12 mt-12 bg-black/30 p-8 rounded-2xl border border-white/5">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <BarChart3 size={20} className="text-gray-400" />
                                Appendix: Emission Simulation Scenarios
                            </h3>

                            <div className="bg-black/60 rounded-lg p-4 border border-white/5 mb-8 font-mono text-sm overflow-x-auto text-nowrap">
                                <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-sans">Formula Reference</div>
                                <code className="text-beetle-gold text-base block mb-2">
                                    Emission(t) = D₀ × e^(-λt)
                                </code>
                                <div className="text-xs text-gray-500 pt-2 border-t border-white/5">
                                    λ = 0.00020518 per day | D₀ = 61,554 SCARAB | Target: 95% emitted in 40 Years
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-black/40 rounded-xl p-6 border border-white/10">
                                    <h4 className="text-lg font-bold text-white mb-4">Scenario 1: 1,000 Solar + 2,000 Bokashi (Year 1)</h4>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div><div className="text-xs text-gray-600 mb-1 uppercase">Total BRU</div><div className="text-gray-300 font-mono">3.7M</div></div>
                                        <div><div className="text-xs text-gray-600 mb-1 uppercase">Year 1 Budget</div><div className="text-gray-300 font-mono">~21.6M SCARAB</div></div>
                                        <div><div className="text-xs text-gray-600 mb-1 uppercase">Solar Yield</div><div className="text-gray-300 font-mono">14,042 SCARAB/yr</div></div>
                                        <div><div className="text-xs text-gray-600 mb-1 uppercase">Bokashi Yield</div><div className="text-beetle-green font-mono">3,803 SCARAB/yr</div></div>
                                        <div className="col-span-2 lg:col-span-4 pt-3 border-t border-white/5">
                                            <div className="text-white flex items-center justify-between"><span className="text-xs text-gray-500 uppercase">Strategic Impact:</span> Bootstraps network. First movers heavily subsidized for real capex.</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-black/40 rounded-xl p-6 border border-white/10">
                                    <h4 className="text-lg font-bold text-white mb-4">Scenario 2: 25,000 Solar + 100,000 Bokashi (Year 4)</h4>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div><div className="text-xs text-gray-600 mb-1 uppercase">Total BRU</div><div className="text-gray-300 font-mono">125M</div></div>
                                        <div><div className="text-xs text-gray-600 mb-1 uppercase">Year 4 Budget</div><div className="text-gray-300 font-mono">~17.3M SCARAB</div></div>
                                        <div><div className="text-xs text-gray-600 mb-1 uppercase">Solar Yield</div><div className="text-gray-300 font-mono">332 SCARAB/yr</div></div>
                                        <div><div className="text-xs text-gray-600 mb-1 uppercase">Bokashi Yield</div><div className="text-amber-500 font-mono">90 SCARAB/yr</div></div>
                                        <div className="col-span-2 lg:col-span-4 pt-3 border-t border-white/5">
                                            <div className="text-white flex items-center justify-between"><span className="text-xs text-gray-500 uppercase">Strategic Impact:</span> "The Maturation Squeeze". Emission budget tightens proportionately.</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-black/40 rounded-xl p-6 border border-white/10">
                                    <h4 className="text-lg font-bold text-white mb-4">Scenario 3: 250,000 Solar + 1,000,000 Bokashi (Year 10)</h4>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div><div className="text-xs text-gray-600 mb-1 uppercase">Total BRU</div><div className="text-gray-300 font-mono">1.25 Billion</div></div>
                                        <div><div className="text-xs text-gray-600 mb-1 uppercase">Year 10 Budget</div><div className="text-gray-300 font-mono">~11.0M SCARAB</div></div>
                                        <div><div className="text-xs text-gray-600 mb-1 uppercase">Solar Yield</div><div className="text-gray-300 font-mono">21 SCARAB/yr</div></div>
                                        <div><div className="text-xs text-gray-600 mb-1 uppercase">Bokashi Yield</div><div className="text-red-500 font-mono">6 SCARAB/yr</div></div>
                                        <div className="col-span-2 lg:col-span-4 pt-3 border-t border-white/5">
                                            <div className="text-white flex items-center justify-between"><span className="text-xs text-gray-500 uppercase">Strategic Impact:</span> Late stage deflationary limit. Protocol relies entirely on Vault and Real-World SaaS Data Sales.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
                                <p className="text-blue-100/70 text-sm leading-relaxed">
                                    <strong className="text-blue-400">Institutional Defense:</strong> Because nodes are paid a <em>fluid proportion</em> of the daily decaying emission block—rather than a static nominal rate—the network becomes fundamentally inflation-proof. Exhaustion of the 300M Regen Pool is mathematically impossible before the 40-year hardware horizon.
                                </p>
                            </div>
                        </section>

                        <h3 className="text-xl font-bold text-white mt-8 mb-4">Vesting Contracts (Zero-Trust Security)</h3>
                        <div className="bg-black/40 border border-white/10 p-5 rounded-xl font-mono text-xs">
                            <p className="text-gray-300 mb-2"><strong className="text-white font-sans text-sm">Team Allocation (15% = 150M SCARAB):</strong></p>
                            <ul className="text-gray-400 space-y-1 ml-4 list-disc mb-4">
                                <li>Contract: <span className="text-beetle-gold">TeamVesting.sol</span></li>
                                <li>Cliff: 12 months (zero tokens claimable)</li>
                                <li>Vesting: 24 months linear after cliff</li>
                                <li>Beneficiary: 3-of-5 multi-sig (Safe wallet)</li>
                            </ul>
                            <p className="text-gray-300 mb-2"><strong className="text-white font-sans text-sm">Marketing Allocation (10% = 100M SCARAB):</strong></p>
                            <ul className="text-gray-400 space-y-1 ml-4 list-disc">
                                <li>Contract: <span className="text-beetle-gold">MarketingTimelock.sol</span></li>
                                <li>Execution: Actionable via 48-Hour Timelock + 3-of-5 Multi-sig</li>
                            </ul>
                        </div>
                    </motion.div>
                );
            case 'treasury':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Treasury Strategy</h2>
                            <p className="mb-6">Protocol longevity is built on disciplined capital allocation. SCARAB's treasury architecture ensures funding is solely directed toward manufacturing, R&D, and network resilience.</p>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl mb-8 border-l-4 border-l-green-400">
                            <h3 className="uppercase tracking-widest text-green-400 font-bold mb-2">Cryptographic Treasury Security</h3>
                            <p className="text-sm text-green-300/80 mb-4">Single-point withdrawal is mathematically impossible.</p>
                            <ul className="text-sm text-white text-left mx-auto space-y-3 mb-2 bg-black/40 p-4 rounded-lg">
                                <li className="flex gap-3 items-center"><CheckCircle size={16} className="text-green-500 shrink-0" /> Proposal creation (public on-chain)</li>
                                <li className="flex gap-3 items-center"><CheckCircle size={16} className="text-green-500 shrink-0" /> 48-hour community review period</li>
                                <li className="flex gap-3 items-center"><CheckCircle size={16} className="text-green-500 shrink-0" /> DAO vote (10% quorum required)</li>
                                <li className="flex gap-3 items-center"><CheckCircle size={16} className="text-green-500 shrink-0" /> 3-of-5 multi-sig execution requirement</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 border-b border-white/10">
                                <div>
                                    <strong className="text-white block font-lg">Hardware Manufacturing (35%)</strong>
                                    <span className="text-sm text-gray-500">Securing silicon supply chains, tooling, and injection molding for Nodes and Kits.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 border-b border-white/10">
                                <div>
                                    <strong className="text-white block font-lg">Protocol R&D (25%)</strong>
                                    <span className="text-sm text-gray-500">Firmware updates, smart contract architecture, and zero-knowledge proof integrations.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 border-b border-white/10">
                                <div>
                                    <strong className="text-white block font-lg">Liquidity Provisioning (20%)</strong>
                                    <span className="text-sm text-gray-500">DEX and CEX liquidity to ensure smooth entry and exit for network participants.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 border-b border-white/10">
                                <div>
                                    <strong className="text-white block font-lg">Security & Legal (10%)</strong>
                                    <span className="text-sm text-gray-500">Smart contract audits, hardware penetration testing, and regulatory compliance.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4">
                                <div>
                                    <strong className="text-white block font-lg">Reserve Buffer (10%)</strong>
                                    <span className="text-sm text-gray-500">Held in stablecoins to weather extreme macroeconomic downturns (Runway extension).</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'governance':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Governance Mechanics</h2>
                            <p className="mb-6">The core of the SCARAB DePIN is progressively decentralized logic. Immutable parameters protect the protocol from destruction, while flexible parameters allow adaptation.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="font-bold text-white mb-4 text-lg">Voting Rules</h3>
                                <ul className="space-y-3 text-sm">
                                    <li><strong className="text-white">Proposal Threshold:</strong> Must hold &gt; 1% of circulating supply to submit a binding CIP (Core Improvement Proposal).</li>
                                    <li><strong className="text-white">Quorum:</strong> Requires 10% of total circulating supply to participate for a vote to pass.</li>
                                    <li><strong className="text-white">Timelock:</strong> Passed proposals undergo an immutable 48-Hour delay before execution to allow the community to react/exit if desired.</li>
                                </ul>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="font-bold text-white mb-4 text-lg">Votable Parameters</h3>
                                <ul className="space-y-3 text-sm">
                                    <li><strong className="text-white">Emission Lambda:</strong> Can be adjusted ±10% per quarter.</li>
                                    <li><strong className="text-white">Hardware Whitelist:</strong> Approving or deprecating specific sensor firmware versions.</li>
                                    <li><strong className="text-white">Treasury Grants:</strong> Funding ecological initiatives or marketing campaigns.</li>
                                    <li><strong className="text-white">Emergency Pause:</strong> In the event of an oracle exploit, the Guardian multi-sig can pause emissions (Requires DAO vote to unpause).</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'transparency':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Transparency & Reporting</h2>
                            <p className="mb-6">A protocol is only as strong as its audibility. SCARAB commits to the highest standard of on-chain and off-chain reporting.</p>
                        </div>

                        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="p-4 text-white">Report / Metric</th>
                                        <th className="p-4 text-white">Frequency</th>
                                        <th className="p-4 text-white">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr>
                                        <td className="p-4 font-bold text-beetle-electric">Team Vesting Tracker</td>
                                        <td className="p-4">Real-Time</td>
                                        <td className="p-4">Protocol Vault (Dashboard)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-beetle-electric">Treasury Balances</td>
                                        <td className="p-4">Real-Time</td>
                                        <td className="p-4">Protocol Vault (Dashboard)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-white">Network Output Data (kWh/kg)</td>
                                        <td className="p-4">Real-Time</td>
                                        <td className="p-4">Hive Dashboard & IPFS</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-white">Smart Contract Audits</td>
                                        <td className="p-4">Pre-Launch & Major Upgrades</td>
                                        <td className="p-4">GitHub Repository</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-gray-300">Operations & Hardware Report</td>
                                        <td className="p-4">Quarterly</td>
                                        <td className="p-4">Medium / Discord</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                );
            case 'risks':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Risk & Security Disclosure</h2>
                            <p className="mb-6">Top-tier protocols openly disclose vulnerabilities and their mitigation strategies. Below are the primary risk vectors associated with the SCARAB network.</p>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8">
                            <h4 className="font-bold text-green-400 mb-3 text-lg flex items-center gap-2"><Shield size={20} /> Security Audits</h4>
                            <div className="space-y-3">
                                <a href="#" className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors p-3 bg-black/40 rounded-lg border border-white/5 hover:border-white/20">
                                    <CheckCircle size={18} className="text-green-500" />
                                    <span><strong>CertiK Audit Report</strong> (Pending Mainnet Deployment)</span>
                                </a>
                                <a href="#" className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors p-3 bg-black/40 rounded-lg border border-white/5 hover:border-white/20">
                                    <CheckCircle size={18} className="text-green-500" />
                                    <span><strong>Slither Static Analysis</strong> (Internal Review Completed)</span>
                                </a>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/5 border-l-4 border-red-500 p-6 rounded-r-xl">
                                <h3 className="font-bold text-white mb-2 text-lg">1. Hardware Tampering Risk</h3>
                                <p className="text-sm mb-2 text-gray-400">Risk: Bad actors attempt to bypass the ATECC608A chip to simulate fraudulent solar production or fake Bokashi weight loss.</p>
                                <p className="text-sm text-green-400 font-medium">Mitigation: Enclosures feature physical tamper-evident mechanisms. Data anomalies (e.g., solar production at midnight) are automatically flagged and blacklisted by the decentralized oracle system.</p>
                            </div>
                            <div className="bg-white/5 border-l-4 border-yellow-500 p-6 rounded-r-xl">
                                <h3 className="font-bold text-white mb-2 text-lg">2. Smart Contract Vulnerability</h3>
                                <p className="text-sm mb-2 text-gray-400">Risk: Exploits in the `EmissionController` or Token contract could allow unauthorized minting or treasury theft.</p>
                                <p className="text-sm text-green-400 font-medium">Mitigation: Phase 1 deployment limits the treasury via `allowance`. All contracts undergo rigorous third-party auditing prior to Mainnet launch. Reentrancy guards are enabled globally.</p>
                            </div>
                            <div className="bg-white/5 border-l-4 border-blue-500 p-6 rounded-r-xl">
                                <h3 className="font-bold text-white mb-2 text-lg">3. Oracle Centralization (Phase 1)</h3>
                                <p className="text-sm mb-2 text-gray-400">Risk: Initially, hardware signatures are verified by a federated oracle controlled by the core team, introducing a single point of failure.</p>
                                <p className="text-sm text-green-400 font-medium">Mitigation: Transitioning to a decentralized EigenLayer AVS (Actively Validated Service) in Phase 3 to decentralize data validation completely.</p>
                            </div>
                            <div className="bg-white/5 border-l-4 border-purple-500 p-6 rounded-r-xl">
                                <h3 className="font-bold text-white mb-2 text-lg">4. Regulatory Uncertainty</h3>
                                <p className="text-sm mb-2 text-gray-400">Risk: Shifting global frameworks regarding DePIN, RWAs, and utility token classifications could impact operations.</p>
                                <p className="text-sm text-green-400 font-medium">Mitigation: SCARAB explicitly structures as a production-gated utility token. No equity or profit share is offered. We maintain continuous dialogue with Web3 legal counsel in crypto-friendly jurisdictions.</p>
                            </div>
                            <div className="bg-white/5 border-l-4 border-gray-500 p-6 rounded-r-xl">
                                <h3 className="font-bold text-white mb-2 text-lg">5. Extreme Market Volatility</h3>
                                <p className="text-sm mb-2 text-gray-400">Risk: What if the SCARAB token price drops to $0.001 during a prolonged bear market?</p>
                                <p className="text-sm text-green-400 font-medium">Mitigation: The core protocol survives. Hardware provides innate physical utility (energy savings, free fertilizer). The DAO treasury is highly diversified. Token rewards become a bonus on top of organic utility, ensuring the network does not collapse if speculative interest wanes.</p>
                            </div>
                            <div className="bg-white/5 border-l-4 border-cyan-500 p-6 rounded-r-xl">
                                <h3 className="font-bold text-white mb-2 text-lg">6. Underlying Chain Failure</h3>
                                <p className="text-sm mb-2 text-gray-400">Risk: What if the primary blockchain (BSC) shuts down or experiences unrecoverable state failure?</p>
                                <p className="text-sm text-green-400 font-medium">Mitigation: Contracts are EVM-standardized. The protocol can be rapidly redeployed to Arbitrum or Polygon within 48 hours. During migration, physical device data is buffered locally by the hardware nodes to ensure no reward data is lost.</p>
                            </div>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#050A05]">
            <Navbar isLanding={false} />

            <div className="pt-32 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="md:w-72 shrink-0">
                    <div className="sticky top-32 space-y-4">
                        {CATEGORIES.map((category) => (
                            <div key={category.name}>
                                <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-3 mt-4">{category.name}</div>
                                <div className="space-y-1">
                                    {category.items.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                                ? 'bg-beetle-green/10 text-green-400 border border-beetle-green/20'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={activeTab === tab.id ? 'text-green-400' : 'text-gray-500'}>{tab.icon}</span>
                                                {tab.label}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-[#0A110C] border border-white/5 rounded-3xl p-8 md:p-14 shadow-2xl relative overflow-hidden min-h-[75vh]">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="relative z-10 max-w-4xl">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}

// Helper Components for SaaS Section
function HandshakeStep({ icon, title, description }) {
    return (
        <div className="bg-black/60 rounded-xl p-6 border border-white/5 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <div className="w-12 h-12 bg-beetle-green/10 border border-beetle-green/20 text-beetle-green shadow-inner rounded-xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h4 className="text-white font-bold mb-3">{title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

function RewardCard({ amount, recipient, description, color }) {
    // Determine gradient based on color prop
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
        <div className="flex items-start gap-3 p-4 rounded-lg bg-black/40 border border-white/5">
            <CheckCircle className="text-green-500 w-5 h-5 mt-0.5 shrink-0 opacity-80" />
            <div>
                <div className="text-white font-bold text-sm mb-1">{method}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{description}</div>
            </div>
        </div>
    );
}
