import React from 'react';
import { motion } from 'framer-motion';
import { Users, Tractor, Warehouse, Landmark, Building2, ArrowRight, CheckCircle2, Sun, Droplet } from 'lucide-react';
import Navbar from '../components/Navbar';
import { SKU_REGISTRY } from '../data/skuRegistry';

const panels = [
  {
    id: 'household',
    title: 'Household / Bio Consumer',
    headline: 'Turn your kitchen waste into money. No complexity.',
    points: [
      'Submit 10kg Bokashi → receive €0.80 within 48 hours to your IBAN (Base rate — increases with municipal partnership. Modelled scenario.)',
      'Your waste never enters the contaminated Biomüll bin — your building\'s contamination rate drops',
      'Annual tax export: download a PDF showing your CO₂ avoidance for your Steuerberater'
    ],
    cta: 'Join the waitlist',
    link: '/onboard/farmer',
    color: 'teal',
    borderColor: 'border-teal-500',
    icon: <Users className="text-teal-500" size={32} />
  },
  {
    id: 'farmer',
    title: 'Collection Farmer',
    headline: 'A collection route that pays you, not the other way around.',
    points: [
      'Accept pickup requests within your defined radius — you set the boundary',
      'Earn 40% of every verified submission you collect — automatically, on-chain',
      'Cluster efficiency bonus: the denser your zone, the shorter your routes, the higher your multiplier',
      'Sell your aggregated soil amendment data to agricultural research partners — additional SCARAB per quarter'
    ],
    cta: 'Register as a farmer',
    link: '/onboard/farmer?type=farmer',
    color: 'green',
    borderColor: 'border-green-500',
    icon: <Tractor className="text-green-500" size={32} />
  },
  {
    id: 'hub',
    title: 'Hub Operator',
    headline: 'Host a Hub. Earn from every handshake that passes through it.',
    points: [
      '10% of every waste handshake processed at your Hub — passive income from network activity',
      'Solar Sentinel at your Hub location powers the hardware off-grid — no electricity cost',
      'Your Hub\'s fill-rate data is sold to municipalities — you share in that data revenue',
      'Stake 50 SCARAB to activate — returned if you exit the network cleanly'
    ],
    cta: 'Apply as Hub operator',
    link: '/onboard/node',
    color: 'amber',
    borderColor: 'border-amber-500',
    icon: <Warehouse className="text-amber-500" size={32} />
  },
  {
    id: 'municipality',
    title: 'Municipality',
    headline: 'Verified waste diversion data. No new infrastructure. No enforcement needed.',
    points: [
      'Real-time district heatmap — know which buildings are diverting waste before your next CSRD report',
      'Biomüll contamination decreases proportionally to SCARAB adoption in your district — measurable, reportable',
      'Three resident incentive models: direct EUR rebate, Abfallgebühr discount, or community reward pool',
      'Pilot phase: no cost. Post-pilot: €200–500/month, converted to SCARAB and burned'
    ],
    cta: 'Apply for Stuttgart pilot',
    link: '/municipalities',
    color: 'blue',
    borderColor: 'border-blue-500',
    icon: <Landmark className="text-blue-500" size={32} />
  },
  {
    id: 'corporate',
    title: 'Corporate / ESG Buyer',
    headline: 'Hardware-attested provenance data. The only kind that passes a CSRD audit.',
    points: [
      'Verified UCO feedstock chain of custody — ATECC608A signed, oracle-validated, BSC-recorded',
      'Access device-level data by burning SCARAB — every purchase reduces token supply permanently',
      'ISCC certification pathway for SAF feedstock provenance — the documentation your compliance team needs',
      'API access to live verified waste stream data for Scope 3 reporting'
    ],
    cta: 'Request data room',
    link: 'mailto:investors@scarabprotocol.org',
    color: 'purple',
    borderColor: 'border-purple-500',
    icon: <Building2 className="text-purple-500" size={32} />
  },
  {
    id: 'agrivoltaic',
    title: 'Agrivoltaic Operator',
    headline: 'Prove your installation is food-safe. Automatically.',
    points: [
      'Continuous DIN SPEC 91434 compliance score — no manual declarations',
      'Panel soiling monitor: know exactly when to clean and what it costs you not to',
      'Pollinator and biodiversity index: the data your NGO partners and insurers need',
      'Download a cryptographically-signed compliance PDF for your Landwirtschaftsamt inspector'
    ],
    cta: 'See AgriSentinel',
    link: '/agrisentinel',
    color: 'yellow',
    borderColor: 'border-yellow-500',
    icon: <Sun className="text-yellow-500" size={32} />
  },
  {
    id: 'saf_buyer',
    title: 'SAF / Biodiesel Buyer',
    headline: 'ISCC-grade UCO provenance. Hardware-attested, not self-reported.',
    points: [
      'Every litre of UCO in our network is signed at collection by a tamper-proof hardware chip',
      'Full chain of custody: household kitchen → kiosk → processor → your facility — on-chain',
      'Access device-level provenance by burning SCARAB — each purchase reduces token supply',
      'EU RED II and ISCC certification pathway — the documentation your compliance team needs'
    ],
    cta: 'Request data room',
    link: 'mailto:investors@scarabprotocol.org',
    color: 'amber',
    borderColor: 'border-amber-600',
    icon: <Droplet className="text-amber-600" size={32} />
  }
];

export default function WhySCARABPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-16 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              One Protocol. <br />
              <span className="text-emerald-500">Every Stakeholder. One Protocol.</span>
            </h1>
            <p className="text-xl text-gray-400">
              SCARAB isn't just a waste protocol. It's a shared incentive layer for the entire circular economy lifecycle.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {panels.map((panel, idx) => (
              <motion.div
                key={panel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col bg-white/5 border-l-4 ${panel.borderColor} p-8 rounded-tr-3xl rounded-br-3xl hover:bg-white/10 transition-colors group h-full`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    {panel.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                    {panel.title}
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-6 group-hover:text-white transition-colors leading-tight">
                  {panel.headline}
                </h2>

                <ul className="space-y-4 mb-8 flex-grow">
                  {panel.points.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
                      <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${panel.borderColor.replace('border-', 'text-')}`} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={panel.link}
                  className="mt-auto inline-flex items-center gap-2 font-black text-sm uppercase tracking-wider group-hover:gap-4 transition-all"
                >
                  <span className={panel.borderColor.replace('border-', 'text-')}>{panel.cta}</span>
                  <ArrowRight size={16} className={panel.borderColor.replace('border-', 'text-')} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-gray-500 text-xs font-black uppercase tracking-widest">
          SCARAB Protocol v{new Date().getFullYear()} — Building Infrastructure for the Circular Economy.
        </p>
      </footer>
    </div>
  );
}
