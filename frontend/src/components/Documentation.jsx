import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Pickaxe, Sprout, UserPlus, ChevronRight, CheckCircle, Zap, Shield, Database, Sun, Recycle } from 'lucide-react';
import Navbar from './Navbar';

export default function Documentation() {
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    const TABS = [
        { id: 'overview', icon: <BookOpen size={18} />, label: 'Platform Overview' },
        { id: 'architecture', icon: <Database size={18} />, label: 'Protocol Architecture' },
        { id: 'mining', icon: <Pickaxe size={18} />, label: 'How to Mine SCARAB' },
        { id: 'emissions', icon: <Zap size={18} />, label: 'Emission & Monetary Policy' },
        { id: 'soil', icon: <Sprout size={18} />, label: 'The Farmer & Closed Loop' },
        { id: 'onboarding', icon: <UserPlus size={18} />, label: 'Onboarding Process' },
        { id: 'utility', icon: <Recycle size={18} />, label: 'SCARAB Token Utility' },
        { id: 'treasury', icon: <Database size={18} />, label: 'Treasury Strategy' },
        { id: 'governance', icon: <Shield size={18} />, label: 'Governance Mechanics' },
        { id: 'transparency', icon: <CheckCircle size={18} />, label: 'Transparency & Reporting' },
        { id: 'risks', icon: <Shield size={18} />, label: 'Risk & Security Disclosure' },
        { id: 'roadmap', icon: <ChevronRight size={18} />, label: 'Roadmap & Milestones' },
        { id: 'team', icon: <UserPlus size={18} />, label: 'Team & Contributors' },
        { id: 'faq', icon: <BookOpen size={18} />, label: 'FAQ (Skeptics Guide)' },
        { id: 'legal', icon: <BookOpen size={18} />, label: 'Legal & Compliance' }
    ];

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
                            <h2 className="text-3xl font-black text-white mb-4">How to Mine SCARAB</h2>
                            <p className="mb-4">
                                "Eco-Mining" requires active participation. You are providing tangible value to the network, and the decentralized Oracle distributes SCARAB proportional to the verified data.
                            </p>
                            <div className="mb-4 text-sm bg-beetle-gold/10 border border-beetle-gold/30 p-4 rounded-xl text-beetle-gold/80">
                                <strong className="text-beetle-gold block mb-1">Dynamic Halving Cycles</strong>
                                To protect against inflation and exponentially reward early adopters, the SCARAB hardware emissions algorithm mathematically halves the payout rate every 50,000 successful network verifications.
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="border border-beetle-electric/20 bg-beetle-electric/5 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Sun className="text-beetle-electric" /> Solar Node Mining (1.0x Base Reward)</h3>
                                <p className="mb-4 text-sm">Hardware cost: $349. Users plug the SCARAB Node directly between their solar inverter and the grid. Assumes an average of 1 kWh/day output.</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Reward calculation: Up to 8 SCARAB per Verified kWh generated.</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Expected Returns: ~2,920 SCARAB / Year.</li>
                                </ul>
                            </div>

                            <div className="border border-beetle-gold/20 bg-beetle-gold/5 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Recycle className="text-beetle-gold" /> Smart Bokashi Mining (Up to 50 SCARAB / Cycle)</h3>
                                <p className="mb-4 text-sm">Hardware cost: $89 + $12/mo Bran Subscription.</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> <span className="font-bold text-white">Why up to 50 SCARAB per cycle?</span> Rewards dual-impact verification. (1) Avoids methane emissions vs landfills. (2) Sequesters carbon into the soil.</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Requirements: Maintain 35-42°C temp profile, 800+ ppm gas production, and verifiable 8-15% weight loss over a 14-day cycle.</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Expected Returns: ~1,200 SCARAB / Year. Cost offset: $144/year subscription vs 1,200 SCARAB (valued organically) + Free high-grade compost.</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'soil':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Soil-as-a-Service & The Closed Loop</h2>
                            <p className="mb-4">
                                A critical issue for urban composters is disposing of the final fermented product. SCARAB's architecture treats local Farmers as "Verified Sink Nodes", creating an economic loop between the city and the farm.
                            </p>
                        </div>

                        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">The Fertility Handshake</h3>
                            <ol className="space-y-6 relative border-l border-green-500/20 ml-3 pl-6">
                                <li className="relative">
                                    <div className="absolute -left-8 w-4 h-4 rounded-full bg-green-500 ring-4 ring-black"></div>
                                    <h4 className="font-bold text-white mb-1">1. User Initiates Drop-Off</h4>
                                    <p className="text-sm">After a 14-day fermentation cycle, the urban user locates a verified Farm or "Community Hub" via the SCARAB Regen-Map and physically transports the bucket.</p>
                                </li>
                                <li className="relative">
                                    <div className="absolute -left-8 w-4 h-4 rounded-full bg-green-500 ring-4 ring-black"></div>
                                    <h4 className="font-bold text-white mb-1">2. Farmer Scanning & Verification</h4>
                                    <p className="text-sm">The Farmer scans the urban user's cryptographic QR code (acting as a digitally signed receipt of nutrient transfer). The Farmer instantly receives high-quality fertilizer for free.</p>
                                </li>
                                <li className="relative">
                                    <div className="absolute -left-8 w-4 h-4 rounded-full bg-green-500 ring-4 ring-black"></div>
                                    <h4 className="font-bold text-white mb-1">3. Protocol Rewards (The 3-Way Split)</h4>
                                    <p className="text-sm">The Smart Contract issues a verified 3-way distribution: <br /></p>
                                    <ul className="mt-2 space-y-1 text-sm">
                                        <li><strong className="text-white">15 SCARAB (User):</strong> Closure Bonus for correct ecological behavior.</li>
                                        <li><strong className="text-white">7 SCARAB (Farmer):</strong> Processing Fee. <em>Note: Farmers must actively stake 100 SCARAB to become a Verified Sink Hub to deter bad actors.</em></li>
                                        <li><strong className="text-white">3 SCARAB (Solar Node):</strong> Validation Fee issued to the local Solar Node that cryptographically signed the Proof of Physical Presence.</li>
                                    </ul>
                                </li>
                            </ol>
                        </div>
                    </motion.div>
                );
            case 'onboarding':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Onboarding Process</h2>
                            <p className="mb-4">
                                SCARAB removes web3 friction from the physical experience. The process is designed to be as simple as ordering an appliance online.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 border border-white/10 rounded-2xl bg-white/5">
                                <h4 className="text-lg font-bold text-white mb-2">Step 1: Obtain Hardware</h4>
                                <p className="text-sm">Purchase a Solar Node or Smart Bokashi Kit from the SCARAB online store. The hardware ships with the embedded cryptographic chip pre-configured.</p>
                            </div>

                            <div className="p-5 border border-white/10 rounded-2xl bg-white/5">
                                <h4 className="text-lg font-bold text-white mb-2">Step 2: Smartphone App Activation (No Seed Phrases)</h4>
                                <p className="text-sm">Download the SCARAB mobile companion app. You log in using a social account (Google/Apple) via Account Abstraction. A secure smart contract wallet is instantly deployed for you in the background.</p>
                            </div>

                            <div className="p-5 border border-beetle-gold/20 rounded-2xl bg-beetle-gold/5">
                                <h4 className="text-lg font-bold text-beetle-gold mb-2">Step 3: The Bran Subscription & QR Cryptography</h4>
                                <p className="text-sm">For Bokashi users, a $12/month active subscription ensures steady delivery of organic inoculant bran. <strong className="text-white">To start a mining cycle</strong>, you must scan the single-use QR code printed on the physical bran bag using the SCARAB app. This mathematically guarantees physical interaction and prevents simulated data.</p>
                            </div>

                            <div className="p-5 border border-green-500/20 rounded-2xl bg-green-500/5">
                                <h4 className="text-lg font-bold text-green-400 mb-2">Step 4: Earn & Manage</h4>
                                <p className="text-sm">Once the cycle finishes and the verification oracle confirms the conditions via the device sensors, SCARAB tokens are allocated directly to your smart wallet for claiming.</p>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'architecture':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Protocol Architecture</h2>
                            <p className="mb-6">SCARAB is not a product; it is a multi-layered cryptographic protocol designed to guarantee zero-trust physical data verification.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-3 text-beetle-gold">Layer 1: Physical Infrastructure</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                                    <li><strong className="text-white">Solar Nodes:</strong> Edge computing devices passing through inverter telemetry.</li>
                                    <li><strong className="text-white">Bokashi Kits:</strong> Sensor-equipped fermentation units monitoring temperature, gas, and mass.</li>
                                    <li><strong className="text-white">Future Extensions:</strong> Water purification sensors, biogas digester telemetry.</li>
                                </ul>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-3 text-beetle-gold">Layer 2: Embedded Secure Element</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                                    <li><strong className="text-white">ATECC608A Chip:</strong> Factory-provisioned cryptographic coprocessor.</li>
                                    <li><strong className="text-white">Device Keypair:</strong> Private keys are physically locked inside the hardware and cannot be extracted.</li>
                                    <li><strong className="text-white">Anti-Tamper:</strong> Any deviation in hardware casing immediately invalidates the node's hash signature.</li>
                                </ul>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-3 text-beetle-electric">Layer 3: Data Validation Layer</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                                    <li><strong className="text-white">Oracle Mechanism:</strong> Off-chain aggregators verify the ECDSA signatures against the `DeviceRegistry.sol` whitelist.</li>
                                    <li><strong className="text-white">Signed Telemetry:</strong> Every payload (e.g., `10 kWh produced`) is signed by the hardware private key.</li>
                                    <li><strong className="text-white">IPFS Logging:</strong> Raw sensor data is hashed and stored on IPFS for decentralized audibility.</li>
                                </ul>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-3 text-beetle-green">Layer 4: Smart Contract Layer</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm ml-2 mb-6">
                                    <li><strong className="text-white">Emission Controller:</strong> Calculates token generation strictly bound to verified telemetry.</li>
                                    <li><strong className="text-white">Decay Mechanism:</strong> Immutable `e^(-λt)` lambda decay curve controlling macro inflation.</li>
                                    <li><strong className="text-white">Efficiency Cap:</strong> Programmatic limits preventing overproduction from exploiting the treasury.</li>
                                </ul>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xs">
                                    <h4 className="font-bold text-gray-400 mb-2 font-sans uppercase">Official Mainnet Contracts (Pending Final Deployment)</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
                                        <div className="truncate">SCARABToken:<br /><a href="#" className="text-beetle-gold hover:underline">0xMAINNET_ADDRESS_HERE</a></div>
                                        <div className="truncate">EmissionController:<br /><a href="#" className="text-beetle-gold hover:underline">0xMAINNET_ADDRESS_HERE</a></div>
                                        <div className="truncate">DeviceRegistry:<br /><a href="#" className="text-beetle-gold hover:underline">0xMAINNET_ADDRESS_HERE</a></div>
                                        <div className="truncate">TeamVesting:<br /><a href="#" className="text-beetle-gold hover:underline">0xMAINNET_ADDRESS_HERE</a></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-3 text-beetle-green">Layer 5: Governance & Treasury</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                                    <li><strong className="text-white">DAO Treasury:</strong> On-chain vault controlled by token-holder voting.</li>
                                    <li><strong className="text-white">Parameter Bounds:</strong> Hardcoded safety limits (e.g., emissions cannot be voted up more than 10% per cycle).</li>
                                    <li><strong className="text-white">Timelock:</strong> 48-Hour delay on all treasury/marketing expenditures for absolute transparency.</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'emissions':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Emission & Monetary Policy</h2>
                            <p className="mb-4">
                                SCARAB has a fixed maximum supply of 1,000,000,000 tokens. The <code>SCARABToken.sol</code> contract has no <code>mint()</code> function accessible post-deployment. The only emission mechanism is the Regeneration Pool (300M tokens) which unlocks via <code>EmissionController.sol</code> according to the <code>e^(-λt)</code> decay formula over approximately 77 years at current device density.
                            </p>
                        </div>
                        <div className="bg-black/40 border border-white/10 p-8 rounded-2xl font-mono text-sm leading-8 text-gray-300 overflow-x-auto text-nowrap">
                            <span className="text-beetle-gold">Emission Formula:</span> <br />
                            <span className="text-white">R(t) = (B * e^(-λt)) * MIN(1, (V_t / T_t))</span><br /><br />
                            <strong>B</strong> = Base Emission Rate (Starts at 80,000 SCARAB/day)<br />
                            <strong>λ</strong> = Decay Factor (0.0019 or ~19 basis points / halves yearly)<br />
                            <strong>V_t</strong> = Verified Network Output (e.g., total kWh generated)<br />
                            <strong>T_t</strong> = Target Output (Active Devices * Target kWh)<br />
                        </div>
                        <h3 className="text-xl font-bold text-white mt-8 mb-4">Network Scenarios & Hard Caps</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-xl">
                                <h4 className="text-red-400 font-bold mb-2">1. Underperforming Network</h4>
                                <p className="text-sm">Network generates 8,000 kWh vs 10,000 kWh target (0.8x ratio).</p>
                                <hr className="border-red-500/20 my-3" />
                                <p className="text-sm font-bold text-white">Result: 64,000 SCARAB emitted.</p>
                                <p className="text-xs text-gray-500 mt-1">Inflation slows down automatically to match utility.</p>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/30 p-5 rounded-xl">
                                <h4 className="text-green-400 font-bold mb-2">2. On-Target Network</h4>
                                <p className="text-sm">Network generates exactly 10,000 kWh vs 10,000 kWh target (1.0x ratio).</p>
                                <hr className="border-green-500/20 my-3" />
                                <p className="text-sm font-bold text-white">Result: 80,000 SCARAB emitted.</p>
                                <p className="text-xs text-gray-500 mt-1">Maximum intended emission.</p>
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/30 p-5 rounded-xl">
                                <h4 className="text-blue-400 font-bold mb-2">3. Overperforming Network</h4>
                                <p className="text-sm">Network generates 15,000 kWh vs 10,000 kWh target (1.5x ratio).</p>
                                <hr className="border-blue-500/20 my-3" />
                                <p className="text-sm font-bold text-white">Result: 80,000 SCARAB emitted.</p>
                                <p className="text-xs text-blue-300 mt-1">CAP APPLIED. Overperformance does NOT cause excess inflation. Supply is protected.</p>
                            </div>
                        </div>

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
            case 'utility':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">SCARAB Token Utility</h2>
                            <p className="mb-6">The SCARAB token is the utilitarian lifeblood of the protocol, driving governance, infrastructure access, and internal network economies.</p>
                            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-8">
                                <p className="text-red-400 font-bold text-sm text-center">LEGAL DISCLAIMER: SCARAB DOES NOT REPRESENT EQUITY, PROFIT SHARE, OR A GUARANTEED RETURN ON INVESTMENT. IT IS A UTILITY & GOVERNANCE TOKEN.</p>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="font-bold text-white mb-2 text-lg">🏛️ Protocol Governance</h3>
                                <p className="text-sm">Holders vote on critical protocol parameters including emission decay rates, hardware whitelists, and treasury grants.</p>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="font-bold text-white mb-2 text-lg">🛒 Hardware Discounts</h3>
                                <p className="text-sm">SCARAB can be used to purchase future Solar Nodes and Bokashi kits at a significant discount directly through the SCARAB web-store.</p>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="font-bold text-white mb-2 text-lg">🚀 Priority Access</h3>
                                <p className="text-sm">Due to silicon supply limits on the ATECC608A chips, hardware batches are limited. Top SCARAB holders receive priority queue access for new inventory.</p>
                            </div>
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <h3 className="font-bold text-white mb-2 text-lg">🌾 Sink Node Staking</h3>
                                <p className="text-sm">In Phase 2, Farmers ("Sink Nodes") must stake a minimum amount of SCARAB to receive the "Processing Fee" subsidy, creating a sink that deters malicious actors.</p>
                            </div>
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
            case 'roadmap':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Roadmap & Milestones</h2>
                            <p className="mb-6">Measurable execution targets over the next 18 months.</p>
                        </div>
                        <div className="space-y-6 border-l-2 border-beetle-green/30 ml-4 pl-6 relative">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-beetle-green shadow-[0_0_10px_#08EBA4]"></div>
                                <h3 className="font-black text-white text-xl">Phase 1: Foundation (Q1-Q2)</h3>
                                <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                                    <li>Smart contract audits completely finalized.</li>
                                    <li>Mainnet BSC Deployment.</li>
                                    <li>First 1,000 SCARAB Solar Nodes deployed in targeted grids.</li>
                                    <li>Live Transparency Dashboard activated.</li>
                                </ul>
                            </div>
                            <div className="relative mt-8">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white/20 border-2 border-white/50"></div>
                                <h3 className="font-black text-white text-xl">Phase 2: Decentralization & Liquidity (Q3-Q4)</h3>
                                <ul className="list-disc list-inside mt-2 text-sm space-y-1 text-gray-400">
                                    <li>Initial DEX Liquidity: ~$300K on PancakeSwap (Locked min. 12 months).</li>
                                    <li>CEX Listings Target: Gate.io, MEXC, KuCoin.</li>
                                    <li>Polygon / Arbitrum cross-chain data availability bridge.</li>
                                    <li>DAO Parameter Voting enabled for token holders.</li>
                                </ul>
                            </div>
                            <div className="relative mt-8">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white/20 border-2 border-white/50"></div>
                                <h3 className="font-black text-white text-xl">Phase 3: Decentralization (Year 2)</h3>
                                <ul className="list-disc list-inside mt-2 text-sm space-y-1 text-gray-400">
                                    <li>Oracle decentralization via EigenLayer AVS.</li>
                                    <li>Introduction of Water Purification tracking modules.</li>
                                    <li>Targeting 50,000 active nodes globally.</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'team':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Core Team & Contributors</h2>
                            <p className="mb-6">SCARAB is built by a dedicated team of hardware engineers, smart contract developers, and ecological scientists committed to building an institutional-grade DePIN.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-beetle-green/20 border border-beetle-green/50 rounded-full flex items-center justify-center text-3xl">👤</div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">Shelby Ahobi</h3>
                                        <p className="text-beetle-gold text-sm">Founder & Protocol Architect</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">Leading the vision for SCARAB. Extensive background in blockchain systems and decentralized physical infrastructure design. Focused on cryptoeconomic security and verifiable edge computing.</p>
                                <div className="flex gap-4 text-gray-500">
                                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter</a>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/5 border-dashed p-6 rounded-2xl flex flex-col items-center justify-center text-center min-h-[220px]">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-3"><UserPlus size={20} /></div>
                                <p className="text-sm text-gray-400">Core Contributor Bios<br />Pending Final Legal Review for Mainnet.</p>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'faq':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-gray-300 leading-relaxed">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">FAQ (Skeptics Guide)</h2>
                            <p className="mb-6">Addressing the most critical questions head-on.</p>
                        </div>
                        <div className="space-y-4">
                            <details className="bg-black/40 border border-white/10 p-5 rounded-xl group cursor-pointer">
                                <summary className="font-bold text-white flex justify-between items-center outline-none">
                                    How is SCARAB different from Helium/Render/Filecoin?
                                    <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="mt-4 text-sm text-gray-400 space-y-2">
                                    <p><strong>Helium:</strong> Wireless coverage (no environmental impact).</p>
                                    <p><strong>Render:</strong> GPU compute (energy-intensive).</p>
                                    <p><strong>Filecoin:</strong> Data storage (no physical output).</p>
                                    <p><strong>SCARAB:</strong> Measurable sustainability (kWh, Liters, kg verified on-chain).</p>
                                    <p className="mt-2 pt-2 border-t border-white/5"><strong className="text-beetle-gold">Our moat:</strong> Hardware-level cryptographic verification via ATECC608A. Competitors rely on self-reporting or centralized validation.</p>
                                </div>
                            </details>
                            <details className="bg-black/40 border border-white/10 p-5 rounded-xl group cursor-pointer">
                                <summary className="font-bold text-white flex justify-between items-center outline-none">
                                    How is this different from Helium's emission model?
                                    <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                                </summary>
                                <p className="mt-4 text-sm text-gray-400">Helium rewarded users for simply providing an RF signal, regardless of whether anyone used it, leading to inflation without utility. SCARAB only emits tokens when a mathematically verified ecological action occurs (e.g., 10 kWh pushed to grid). No demand/action = No emission.</p>
                            </details>
                            <details className="bg-black/40 border border-white/10 p-5 rounded-xl group cursor-pointer">
                                <summary className="font-bold text-white flex justify-between items-center outline-none">
                                    Can someone fake production with a Raspberry Pi?
                                    <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                                </summary>
                                <p className="mt-4 text-sm text-gray-400">No. Every SCARAB node is embedded with an ATECC608A cryptographic secure element. The payload requires an ECDSA signature generated by this chip. The private key never leaves the chip. Unless they physically steal the chip and rig custom wiring to fake the sensors (which our anomaly detection flags), software spoofing is mathematically impossible.</p>
                            </details>
                            <details className="bg-black/40 border border-white/10 p-5 rounded-xl group cursor-pointer">
                                <summary className="font-bold text-white flex justify-between items-center outline-none">
                                    What happens when the emissions decay?
                                    <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                                </summary>
                                <p className="mt-4 text-sm text-gray-400">As base block rewards halve over the years, the network transitions to a transaction-fee economy. Third-party carbon credit buyers and ecological analysts will pay fees in SCARAB to access the verified data stream, subsidizing the nodes entirely through organic demand.</p>
                            </details>
                            <details className="bg-black/40 border border-white/10 p-5 rounded-xl group cursor-pointer">
                                <summary className="font-bold text-white flex justify-between items-center outline-none">
                                    Why build on BSC Testnet/Mainnet instead of Ethereum?
                                    <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                                </summary>
                                <p className="mt-4 text-sm text-gray-400">IoT telemetry generates high-frequency data matrices. Executing proof verification logic on Ethereum L1 is cost-prohibitive. BSC offers the EVM compatibility required for our complex hardware-registry smart contracts while keeping gas fees sub-cent for end-users claiming rewards.</p>
                            </details>
                        </div>
                    </motion.div>
                );
            case 'legal':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-gray-400 text-sm leading-relaxed p-6 bg-black/60 rounded-2xl border border-white/5">
                        <h2 className="text-2xl font-black text-white mb-6">Legal & Compliance</h2>

                        <p className="uppercase font-bold text-white mt-4 border-t border-white/10 pt-4">Securities Law Compliance (Howey Test Analysis)</p>
                        <p className="mb-2">SCARAB is designed strictly as a utility token under the Howey Test framework:</p>
                        <ul className="list-none space-y-2 mb-4 bg-black/40 p-4 rounded-xl border border-white/5">
                            <li><span className="text-red-400">❌</span> <strong className="text-gray-300">Investment of money:</strong> Users purchase hardware (a physical product with real-world utility), not financial securities.</li>
                            <li><span className="text-red-400">❌</span> <strong className="text-gray-300">Common enterprise:</strong> It is a decentralized network of independent node operators, not a company pooling profits.</li>
                            <li><span className="text-red-400">❌</span> <strong className="text-gray-300">Expectation of profits:</strong> Rewards are not passive; they require the active, ongoing operation and physical maintenance of devices.</li>
                            <li><span className="text-red-400">❌</span> <strong className="text-gray-300">Efforts of others:</strong> Users deploy and maintain their own hardware to earn compensation.</li>
                        </ul>
                        <p className="mb-4"><strong>Conclusion:</strong> SCARAB rewards are "work-based compensation" analogous to physical mining, not passive investment returns. <em className="text-gray-500">Disclaimer: This framework is provided for informational purposes only. Consult qualified counsel.</em></p>

                        <p className="uppercase font-bold text-white mt-4 border-t border-white/10 pt-4">1. Token Classification</p>
                        <p className="mb-4">The SCARAB Token ($ROLL) functions solely as a cryptographic utility and governance token within the SCARAB network. It is designed to coordinate decentralized physical infrastructure networks (DePIN) by verifying hardware data logic. It is not intended to be, and should not be construed as, an investment, equity, share, or security in any jurisdiction.</p>

                        <p className="uppercase font-bold text-white">2. No Expectation of Profit</p>
                        <p className="mb-4">Users participating in the SCARAB ecosystem (i.e., operating a Node) do so to participate in verifiable ecological regeneration and data provision. There is absolutely no promise, guarantee, or expectation of financial profit, capital appreciation, or passive income from the purchase or operation of SCARAB hardware or tokens.</p>

                        <p className="uppercase font-bold text-white">3. Hardware Liability & Data Compliance</p>
                        <p className="mb-4">SCARAB hardware nodes pass CE and FCC requirements under standard IoT telemetry classifications. All telemetry generated by users is strictly environmental (kWh, temperature, mass) and anonymized via cryptographic hashing to ensure complete compliance with global privacy standards including GDPR and CCPA. No personally identifiable information (PII) is stored on-chain.</p>

                        <p className="uppercase font-bold text-white mt-8 border-t border-white/10 pt-4">Jurisdiction</p>
                        <p>The SCARAB Foundation protocol is coordinated by a decentralized association. Further entity structuring for hardware liability protection is ongoing within favorable Web3 jurisdictions.</p>
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
                    <div className="sticky top-32 space-y-1">
                        <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-3 mt-4">Core Concepts</div>
                        {TABS.slice(0, 4).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-beetle-green/20 text-green-400 border border-beetle-green/30 shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={activeTab === tab.id ? 'text-green-400' : 'text-gray-500'}>{tab.icon}</span>
                                    {tab.label}
                                </div>
                            </button>
                        ))}

                        <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-3 mt-6">Hardware & Ecosystem</div>
                        {TABS.slice(4, 6).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-beetle-gold/20 text-beetle-gold border border-beetle-gold/30 shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={activeTab === tab.id ? 'text-beetle-gold' : 'text-gray-500'}>{tab.icon}</span>
                                    {tab.label}
                                </div>
                            </button>
                        ))}

                        <div className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-3 mt-6">Institutional Intelligence</div>
                        {TABS.slice(6).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={activeTab === tab.id ? 'text-white' : 'text-gray-500'}>{tab.icon}</span>
                                    {tab.label}
                                </div>
                            </button>
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
