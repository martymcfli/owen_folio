import React from 'react';
import { MarketOpportunity } from '../types';
import { Briefcase, MapPin, TrendingUp, Lightbulb, Building2 } from 'lucide-react';

interface Props {
  data: MarketOpportunity;
  delay: number;
}

export const OpportunityCard: React.FC<Props> = ({ data, delay }) => {
  const scoreColor = data.impactScore > 80 ? 'text-emerald-400' : data.impactScore > 50 ? 'text-yellow-400' : 'text-slate-400';
  const scoreBg = data.impactScore > 80 ? 'bg-emerald-400/10' : data.impactScore > 50 ? 'bg-yellow-400/10' : 'bg-slate-400/10';

  return (
    <div 
      className="relative bg-slate-850 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <Building2 size={14} />
            <span>{data.companyName || 'Industry News'}</span>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-bold ${scoreColor} ${scoreBg}`}>
          <TrendingUp size={12} />
          <span>Impact: {data.impactScore}/100</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-cyan-400 transition-colors">
        {data.headline}
      </h3>
      
      {data.location && (
        <div className="flex items-center text-slate-400 text-sm mb-4">
          <MapPin size={14} className="mr-1" />
          {data.location}
        </div>
      )}

      <p className="text-slate-300 text-sm mb-6 leading-relaxed border-l-2 border-slate-600 pl-3">
        {data.summary}
      </p>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs text-slate-500 uppercase font-bold mb-2 flex items-center">
            <Briefcase size={12} className="mr-1.5" />
            Predicted Openings
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.predictedRoles.map((role, idx) => (
              <span key={idx} className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded border border-slate-700">
                {role}
              </span>
            ))}
          </div>
        </div>

        <div>
            <h4 className="text-xs text-slate-500 uppercase font-bold mb-2">Analysis</h4>
            <p className="text-sm text-slate-400 italic">"{data.reasoning}"</p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <h4 className="text-blue-400 text-xs uppercase font-bold mb-1 flex items-center">
              <Lightbulb size={12} className="mr-1.5" />
              Strategic Project Idea
            </h4>
            <p className="text-sm text-blue-100 font-medium leading-relaxed">
              {data.projectIdea}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};