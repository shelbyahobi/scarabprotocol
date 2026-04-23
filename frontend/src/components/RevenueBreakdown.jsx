import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const revenueData = [
  { year: 'Y1', hardware: 230000, subscription: 50000, municipal_api: 0, corporate_data: 25000, uco_supply_chain: 8000 },
  { year: 'Y2', hardware: 720000, subscription: 280000, municipal_api: 180000, corporate_data: 120000, uco_supply_chain: 95000 },
  { year: 'Y3', hardware: 1400000, subscription: 890000, municipal_api: 720000, corporate_data: 690000, uco_supply_chain: 380000 },
  { year: 'Y4', hardware: 2100000, subscription: 1900000, municipal_api: 2100000, corporate_data: 1800000, uco_supply_chain: 920000 },
  { year: 'Y5', hardware: 2800000, subscription: 3200000, municipal_api: 5100000, corporate_data: 5000000, uco_supply_chain: 2100000 },
];

const formatCurrency = (value) => 
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

export default function RevenueBreakdown() {
  const [showPercentage, setShowPercentage] = useState(false);

  const processedData = revenueData.map(item => {
    const total = item.hardware + item.subscription + item.municipal_api + item.corporate_data + item.uco_supply_chain;
    if (showPercentage) {
      return {
        year: item.year,
        hardware: (item.hardware / total) * 100,
        subscription: (item.subscription / total) * 100,
        municipal_api: (item.municipal_api / total) * 100,
        corporate_data: (item.corporate_data / total) * 100,
        uco_supply_chain: (item.uco_supply_chain / total) * 100,
        rawTotal: total
      };
    }
    return { ...item, rawTotal: total };
  });

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-black mb-1">Revenue Breakdown</h3>
          <p className="text-sm text-gray-500 uppercase tracking-widest font-black">Projected Growth Y1—Y5</p>
        </div>
        
        <div className="inline-flex bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setShowPercentage(false)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!showPercentage ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Absolute (€)
          </button>
          <button
            onClick={() => setShowPercentage(true)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${showPercentage ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Percentage (%)
          </button>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="#555" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#555" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => showPercentage ? `${val}%` : val > 1000000 ? `${(val/1000000).toFixed(1)}M` : val}
            />
            <Tooltip
              contentStyle={{ background: '#0a1a0f', border: '1px solid #ffffff20', borderRadius: '16px' }}
              itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
              formatter={(value, name) => [
                showPercentage ? `${value.toFixed(1)}%` : formatCurrency(value),
                name.replace(/_/g, ' ').toUpperCase()
              ]}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              wrapperStyle={{ paddingBottom: '30px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '1px' }}
            />
            <Bar dataKey="hardware" name="Hardware Sale" stackId="a" fill="#1D9E75" radius={[0, 0, 0, 0]} />
            <Bar dataKey="subscription" name="Subscription" stackId="a" fill="#FBBF24" radius={[0, 0, 0, 0]} />
            <Bar dataKey="municipal_api" name="Municipal API" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="corporate_data" name="Corporate Data" stackId="a" fill="#8B5CF6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="uco_supply_chain" name="UCO Supply Chain" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-8">
        <div>
          <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Estimated Y5 Total</span>
          <span className="text-xl font-black text-white">{formatCurrency(18200000)}</span>
        </div>
        <div>
          <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Growth Factor</span>
          <span className="text-xl font-black text-emerald-500">58.1x</span>
        </div>
        <div className="col-span-2">
          <p className="text-[11px] text-gray-400 italic leading-relaxed">
            * Model assumes 3 pilot cities in Y1-Y2, scaling to 45 districts by Y5. 
            Corporate data revenue includes ISCC-verified feedstock provenance as the primary driver.
          </p>
        </div>
      </div>
    </div>
  );
}
