import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MarketOpportunity } from '../types';

interface Props {
  data: MarketOpportunity[];
}

export const ImpactChart: React.FC<Props> = ({ data }) => {
  // Transform data for chart
  const chartData = data.map((item, index) => ({
    name: item.companyName || `Story ${index + 1}`,
    score: item.impactScore,
    headline: item.headline
  }));

  return (
    <div className="h-64 w-full bg-slate-850/50 rounded-xl border border-slate-800 p-4">
      <h3 className="text-sm text-slate-400 font-semibold mb-4 uppercase tracking-wider">Hiring Impact Velocity</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#1e293b' }}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.score > 75 ? '#34d399' : '#3b82f6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};