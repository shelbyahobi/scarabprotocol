import React from 'react';
import { motion } from 'framer-motion';
import { Users, Tractor, Warehouse, Landmark, Building2, ArrowRight, CheckCircle2, Sun, Droplet, TreePine } from 'lucide-react';
import Navbar from '../components/Navbar';

const TIER_1_B2B = [
  {
    id: 'municipality',
    title: 'Municipality',
    badge: 'Primary Revenue Partner',
    headline: 'Verified waste diversion data. No new infrastructure. No enforcement needed.',
    points: [
      'Real-time district heatmap — know which buildings are diverting waste before your next CSRD report',
      'Biomüll contamination decreases proportionally to SCARAB adoption in your district — measurable, reportable',
      'Three resident incentive models: direct EUR rebate, Abfallgebühr discount, or community reward pool'
    ],
    economicLoop: 'Your API subscription fee is converted to SCARAB and burned — making every city that joins the network deflationary for all token holders.',
    cta: 'Apply for Stuttgart pilot',
    link: '/municipalities',
    colorClasses: {
      badgeBg: 'bg-blue-500/10',
      badgeText: 'text-blue-400',
      badgeBorder: 'border-blue-500/20'
    },
    borderColor: 'border-blue-500',
    icon: <Landmark className="text-blue-400" size={32} />
  },
  {
    id: 'saf_buyer',
    title: 'Corporate / SAF Buyer',
    badge: 'Data Marketplace Customer',
    headline: 'ISCC-grade feedstock provenance. Hardware-attested, not self-reported.',
    points: [
      'Verified UCO feedstock chain of custody — ATECC608A signed, oracle-validated, BSC-recorded',
      'Full chain of custody: household kitchen → kiosk → processor → your facility — on-chain',
      'EU RED II and ISCC certification pathway — the documentation your compliance team needs'
    ],
    economicLoop: 'You access device-level provenance data by burning SCARAB — directly reducing the total token supply with every compliance report you generate.',
    cta: 'Request data room',
    link: 'mailto:investors@scarabprotocol.org',
    colorClasses: {
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-400',
      badgeBorder: 'border-amber-500/20'
    },
    borderColor: 'border-amber-500',
    icon: <Droplet className="text-amber-500" size={32} />
  }
];

const TIER_2_NETWORK = [
  {
    id: 'farmer',
    title: 'Collection Farmer',
    headline: 'A collection route that pays you, not the other way around.',
    points: [
      'Accept pickup requests within your defined radius — you set the boundary',
      'Earn 40% of every verified submission you collect — automatically, on-chain',
      'Cluster efficiency bonus: the denser your zone, the shorter your routes, the higher your multiplier'
    ],
    economicLoop: 'You perform the physical transport that creates the provenance data — earning a direct cut of the value generated for the SAF Buyer.',
    cta: 'Register as a farmer',
    link: '/onboard/farmer?type=farmer',
    color: 'green',
    borderColor: 'border-green-500',
    icon: <Tractor className="text-green-500" size={24} />
  },
  {
    id: 'hub',
    title: 'Hub Operator',
    headline: 'Host a Hub. Earn from every handshake.',
    points: [
      '10% of every waste handshake processed at your Hub — passive income',
      'Solar Sentinel at your Hub location powers the hardware off-grid',
      'Stake 50 SCARAB to activate — returned if you exit the network cleanly'
    ],
    economicLoop: 'You provide the physical aggregation infrastructure — capturing a percentage of the value flowing through your geographic node.',
    cta: 'Apply as Hub operator',
    link: '/onboard/node',
    color: 'amber',
    borderColor: 'border-amber-400',
    icon: <Warehouse className="text-amber-400" size={24} />
  },
  {
    id: 'agrivoltaic',
    title: 'Agrivoltaic Operator',
    headline: 'Prove your installation is food-safe.',
    points: [
      'Continuous DIN SPEC 91434 compliance score — no manual declarations',
      'Panel soiling monitor: know exactly when to clean and what it costs',
      'Pollinator and biodiversity index: data for your NGO partners'
    ],
    economicLoop: 'You produce verifiable ecological metrics that are monetised via green financing and carbon registries — expanding the protocol\'s asset base.',
    cta: 'See AgriSentinel',
    link: '/agrisentinel',
    color: 'yellow',
    borderColor: 'border-yellow-400',
    icon: <Sun className="text-yellow-400" size={24} />
  }
];

const TIER_3_FOUNDATION = [
  {
    id: 'household',
    title: 'Household / Bio Consumer',
    headline: 'Turn your kitchen waste into money.',
    points: [
      'Submit 10kg Bokashi → receive €0.80 within 48 hours to your IBAN (Base rate)',
      'Your waste never enters the contaminated Biomüll bin'
    ],
    economicLoop: 'Your verified waste feeds the municipal reports that corporations pay to access — you are the source of the data economy.',
    cta: 'Join the waitlist',
    link: '/onboard/farmer',
    color: 'teal',
    borderColor: 'border-teal-500',
    icon: <Users className="text-teal-500" size={20} />
  },
  {
    id: 'rural',
    title: 'Rural Resident / Community',
    headline: 'Localise your ecological impact.',
    points: [
      'Turn agricultural byproducts into traceable soil amendments',
      'Participate in local biodiversity tracking bounties'
    ],
    economicLoop: 'You provide the decentralized groundwork that expands network coverage into non-urban environments.',
    cta: 'Community Discord',
    link: '#',
    color: 'emerald',
    borderColor: 'border-emerald-500',
    icon: <TreePine className="text-emerald-500" size={20} />
  }
];

const Card = ({ panel, isFullWidth = false, isSmall = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`flex flex-col bg-zinc-900/40 border border-white/5 border-l-4 ${panel.borderColor} p-6 md:p-8 rounded-2xl hover:bg-zinc-800/60 transition-all group h-full`}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-black/50 rounded-xl border border-white/5">
            {panel.icon}
          </div>
          <span className="text-sm font-bold text-white">
            {panel.title}
          </span>
        </div>
        {panel.badge && (
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${panel.colorClasses.badgeBg} ${panel.colorClasses.badgeText} ${panel.colorClasses.badgeBorder}`}>
            {panel.badge}
          </span>
        )}
      </div>

      <h2 className={`${isSmall ? 'text-lg' : isFullWidth ? 'text-3xl' : 'text-xl'} font-bold mb-4 group-hover:text-white transition-colors leading-tight text-zinc-100`}>
        {panel.headline}
      </h2>

      <ul className="space-y-3 mb-6 flex-grow">
        {panel.points.map((point, pIdx) => (
          <li key={pIdx} className="flex items-start gap-3 text-sm text-zinc-400 leading-relaxed">
            <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${panel.borderColor.replace('border-', 'text-')}`} />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6 border-t border-white/5">
        <p className="text-xs text-zinc-500 italic mb-4 leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
          <strong className="text-zinc-300 not-italic mr-1">The Economic Loop:</strong> 
          {panel.economicLoop}
        </p>
        <a
          href={panel.link}
          className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all"
        >
          <span className={panel.borderColor.replace('border-', 'text-')}>{panel.cta}</span>
          <ArrowRight size={16} className={panel.borderColor.replace('border-', 'text-')} />
        </a>
      </div>
    </motion.div>
  );
};

export default function WhySCARABPage() {
  return (
    <div className="min-h-screen bg-[#050A05] text-white selection:bg-emerald-500/30">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-20 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              One Protocol. <br />
              <span className="text-emerald-500">Every Stakeholder.</span>
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              SCARAB monetises enterprise environmental compliance, and uses that revenue to subsidize the decentralized hardware network that generates the data.
            </p>
          </header>

          <div className="space-y-12">
            
            {/* TIER 1 - B2B */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-px bg-white/10 flex-1"></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Tier 1: Enterprise Revenue Partners</h3>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {TIER_1_B2B.map(panel => (
                  <Card key={panel.id} panel={panel} isFullWidth={true} />
                ))}
              </div>
            </div>

            {/* TIER 2 - NETWORK OPERATORS */}
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-px bg-white/10 flex-1"></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Tier 2: Decentralized Infrastructure Providers</h3>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TIER_2_NETWORK.map(panel => (
                  <Card key={panel.id} panel={panel} />
                ))}
              </div>
            </div>

            {/* TIER 3 - FOUNDATION */}
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-px bg-white/10 flex-1"></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Tier 3: The Data Source Foundation</h3>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {TIER_3_FOUNDATION.map(panel => (
                  <Card key={panel.id} panel={panel} isSmall={true} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-zinc-600 text-xs font-black uppercase tracking-widest">
          SCARAB Protocol v{new Date().getFullYear()} — Building Infrastructure for the Circular Economy.
        </p>
      </footer>
    </div>
  );
}
