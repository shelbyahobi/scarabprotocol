import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, BarChart3, Users, DollarSign, Rocket, PieChart, ArrowRight, Download, Calendar, FileCheck, Lock, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import RevenueBreakdown from '../components/RevenueBreakdown';

export default function InstitutionalSummaryPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      <Navbar />

      <main className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Headline Section */}
          <header className="mb-20">
            <span className="text-xs font-mono tracking-[4px] text-emerald-500 uppercase mb-6 block">Institutional Summary · Phase 1</span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              SCARAB Protocol: <br />
              <span className="text-emerald-500">Regenerative DePIN Infrastructure</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed">
              Verifiable circular economy data secured by hardware attestation. 
              Scaling from EU pilot cities to a global shared incentive layer.
            </p>
          </header>

          {/* Headline Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-y border-white/5 py-12">
            <div>
              <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2">Raise Objective</div>
              <div className="text-3xl md:text-4xl font-black text-emerald-500">$2.0M</div>
            </div>
            <div>
              <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2">Valuation (Seed)</div>
              <div className="text-3xl md:text-4xl font-black text-white">$12M</div>
            </div>
            <div>
              <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2">Y5 Revenue (Est)</div>
              <div className="text-3xl md:text-4xl font-black text-white">€16.1M</div>
            </div>
            <div>
              <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2">Target Nodes Y2</div>
              <div className="text-3xl md:text-4xl font-black text-white">1,000</div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <section className="mb-32">
            <h2 className="text-3xl font-black mb-12 tracking-tight">Projected Revenue Breakdown</h2>
            <RevenueBreakdown />
          </section>

          {/* Market Sizing Funnel */}
          <section className="mb-32">
            <h2 className="text-3xl font-black mb-16 tracking-tight text-center">Market Access Funnel</h2>
            <div className="space-y-4 max-w-xl mx-auto mb-16">
              <div className="bg-emerald-900/10 border border-emerald-500/20 p-10 rounded-t-[4rem] text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">TAM (Total Addressable)</span>
                <div className="text-4xl font-black">€56B</div>
              </div>
              <div className="bg-blue-900/10 border border-blue-500/20 p-8 w-[92%] mx-auto text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 block">SAM (Serviceable Addressable)</span>
                <div className="text-3xl font-black">€1.2B</div>
              </div>
              <div className="bg-amber-900/10 border border-amber-500/20 p-6 w-[84%] mx-auto rounded-b-3xl text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2 block">SOM (Serviceable Obtainable)</span>
                <div className="text-2xl font-black">€4.8M</div>
              </div>
            </div>
          </section>

          {/* Stakeholder Value Recap */}
          <section className="mb-32">
            <h2 className="text-3xl font-black mb-12 tracking-tight">The Flywheel: Multi-Stakeholder Value</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RecapPanel title="Households" color="teal" points={['€2.40 per 10kg waste', 'Bypass Biomüll bin complexity']} />
              <RecapPanel title="Farmers" color="green" points={['40% collection commission', 'On-chain route optimization']} />
              <RecapPanel title="Hub Operators" color="amber" points={['10% handshake commission', 'Solar Sentinel powered']} />
              <RecapPanel title="Municipalities" color="blue" points={['Direct CSRD data firehose', 'Enforcement-free diversion']} />
              <RecapPanel title="ESG Buyers" color="purple" points={['Hardware-attested Scope 3 data', 'ISCC feedstock provenance']} />
            </div>
            <div className="mt-8 text-center">
              <a href="/why-scarab" className="text-emerald-500 font-bold hover:underline inline-flex items-center gap-2">
                Explore full value architecture <ArrowRight size={16} />
              </a>
            </div>
          </section>

          {/* Risk Mitigation Table */}
          <section className="mb-32">
            <h2 className="text-3xl font-black mb-12 tracking-tight">Strategic Risk Mitigation</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <RiskItem title="Hardware Quality" risk="Low fermentation yield" action="Lid-open sensors + SCD41 CO2 validation via oracle." />
              <RiskItem title="Regulatory" risk="Token status in EU" action="EUR fiat payouts for EU pilots; MiCA-native positioning." />
              <RiskItem title="Manufacturing" risk="Supply chain delay" action="Standard Bosch/ST components; multiple assembler pipeline." />
              <RiskItem title="Adoption" risk="User friction" action="Zero-crypto UX; direct IBAN transfers via Hub settlement." />
            </div>
          </section>

          {/* Investment Terms */}
          <section className="mb-32 bg-white/5 border border-white/10 rounded-[3rem] p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
            <h2 className="text-3xl font-black mb-12 tracking-tight">Seed Round Terms</h2>
            <table className="w-full text-left">
              <tbody className="divide-y divide-white/5">
                <TermRow label="Asset Type" value="SAFT (Simple Agreement for Future Tokens)" />
                <TermRow label="Total Round" value="$600,000 (Infra Seed)" />
                <TermRow label="Allocation" value="50,000,000 SCARAB (5%)" />
                <TermRow label="Token Price" value="$0.012 (Implied)" />
                <TermRow label="Vesting" value="12M Cliff + 24M Linear Monthly" />
                <TermRow label="Min Ticket" value="$50,000" />
              </tbody>
            </table>
          </section>

          {/* Final Call to Action */}
          <section className="text-center bg-emerald-950/20 border border-emerald-500/30 rounded-[3rem] p-16">
            <h2 className="text-4xl font-black mb-6 tracking-tight">Request Institutional Access</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
              Full P&L models, legal entity jurisdiction mappings (DE/US/CH), and hardware BOMs are available in our technical data room.
            </p>
            <a 
              href="mailto:investors@scarabprotocol.org?subject=Data%20Room%20Access%20Request" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-2xl font-black text-2xl transition-all shadow-2xl shadow-emerald-500/20 inline-block"
            >
              Request Data Room →
            </a>
          </section>
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-gray-500 text-xs font-black uppercase tracking-widest">
          Institutional Summary · v{new Date().toISOString().split('T')[0]} · SCARAB UG (Registration Pending)
        </p>
      </footer>
    </div>
  );
}

function RecapPanel({ title, color, points }) {
  const colorMap = {
    teal: 'border-teal-500 text-teal-500',
    green: 'border-green-500 text-green-500',
    amber: 'border-amber-500 text-amber-500',
    blue: 'border-blue-500 text-blue-500',
    purple: 'border-purple-500 text-purple-500'
  };
  return (
    <div className={`p-6 bg-white/5 border-l-2 ${colorMap[color].split(' ')[0]} rounded-tr-xl rounded-br-xl`}>
      <h4 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-4">{title}</h4>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="text-[13px] flex items-start gap-2 leading-tight">
            <CheckCircle2 size={14} className={colorMap[color].split(' ')[1]} />
            <span className="text-gray-300">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskItem({ title, risk, action }) {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <div className="text-xs mb-3 font-mono">
        <span className="text-red-500 uppercase tracking-tighter">Risk:</span> <span className="text-gray-400">{risk}</span>
      </div>
      <div className="text-xs font-mono">
        <span className="text-emerald-500 uppercase tracking-tighter">Mitigation:</span> <span className="text-gray-300">{action}</span>
      </div>
    </div>
  );
}

function TermRow({ label, value }) {
  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
      <td className="py-6 font-bold text-gray-500 text-sm uppercase tracking-widest">{label}</td>
      <td className="py-6 text-right font-black text-lg text-white group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{value}</td>
    </tr>
  );
}
