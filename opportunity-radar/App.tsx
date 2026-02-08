import React, { useState, useCallback } from 'react';
import { Radar, Search, Activity, Cpu, Globe, Zap, ExternalLink, AlertCircle } from 'lucide-react';
import { scanMarketOpportunities } from './services/geminiService';
import { MarketOpportunity, AnalysisStatus, GroundingSource } from './types';
import { OpportunityCard } from './components/OpportunityCard';
import { ScannerOverlay } from './components/ScannerOverlay';
import { ImpactChart } from './components/Visualizations';

const SUGGESTED_QUERIES = [
  { label: "AI & Automation", icon: <Cpu size={16} /> },
  { label: "Renewable Energy", icon: <Zap size={16} /> },
  { label: "FinTech Regulations", icon: <Activity size={16} /> },
  { label: "Global Supply Chain", icon: <Globe size={16} /> },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setStatus(AnalysisStatus.SCANNING);
    setError(null);
    setOpportunities([]);
    setSources([]);

    try {
      // Simulate scanning delay for UX (Scanning -> Analyzing)
      setTimeout(() => setStatus(AnalysisStatus.ANALYZING), 1500);

      const result = await scanMarketOpportunities(searchQuery);
      setOpportunities(result.opportunities);
      setSources(result.groundingSources || []);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (err: any) {
      setError(err.message || "Failed to scan market data.");
      setStatus(AnalysisStatus.ERROR);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleScan(query);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-lg shadow-lg shadow-cyan-500/20">
              <Radar className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Opportunity<span className="text-cyan-400">Radar</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Real-time Career Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === AnalysisStatus.SCANNING || status === AnalysisStatus.ANALYZING ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${status === AnalysisStatus.SCANNING || status === AnalysisStatus.ANALYZING ? 'bg-cyan-500' : 'bg-slate-700'}`}></span>
            </span>
            <span className="text-xs font-medium text-slate-400">
              {status === AnalysisStatus.IDLE ? 'System Ready' : 
               status === AnalysisStatus.COMPLETE ? 'Live Data' : 
               'Scanning Nodes...'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Search Section */}
        <section className="mb-12 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Predict your next career move.
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Our AI scans breaking geopolitical and industry news to hypothesize 
            emerging job openings before they are posted.
          </p>
          
          <div className="relative group max-w-xl mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-slate-900 rounded-lg p-1.5 shadow-2xl">
              <Search className="ml-3 text-slate-500" size={20} />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Scan for news (e.g., 'Semiconductors in Texas', 'European Tech Regulation')"
                className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder:text-slate-600"
              />
              <button 
                onClick={() => handleScan(query)}
                disabled={status === AnalysisStatus.SCANNING || status === AnalysisStatus.ANALYZING}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-all disabled:opacity-50"
              >
                Scan
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q.label}
                onClick={() => {
                  setQuery(q.label);
                  handleScan(q.label);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
              >
                {q.icon}
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {(status === AnalysisStatus.SCANNING || status === AnalysisStatus.ANALYZING) && (
          <div className="max-w-4xl mx-auto text-center py-20">
            <div className="relative inline-block w-24 h-24 mb-6">
               <ScannerOverlay />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="text-slate-700 animate-pulse" size={48} />
               </div>
            </div>
            <h3 className="text-xl font-semibold text-white animate-pulse">
              {status === AnalysisStatus.SCANNING ? 'Scanning Global News Wires...' : 'Synthesizing Market Hypothesis...'}
            </h3>
            <p className="text-slate-500 mt-2">Accessing real-time search grounding...</p>
          </div>
        )}

        {/* Error State */}
        {status === AnalysisStatus.ERROR && (
          <div className="max-w-2xl mx-auto bg-red-950/20 border border-red-900/50 p-6 rounded-xl flex items-start space-x-4">
            <AlertCircle className="text-red-500 shrink-0" size={24} />
            <div>
              <h3 className="text-red-400 font-semibold mb-1">Scan Failed</h3>
              <p className="text-red-300/80 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {status === AnalysisStatus.COMPLETE && opportunities.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Metrics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <ImpactChart data={opportunities} />
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">News Sources</h3>
                  <ul className="space-y-3">
                    {sources.map((source, idx) => (
                      <li key={idx} className="flex items-start group">
                        <ExternalLink size={12} className="mt-0.5 mr-2 text-cyan-500 shrink-0" />
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-slate-300 hover:text-cyan-400 transition-colors line-clamp-1 break-all"
                        >
                          {source.title || source.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-600">
                  Verified via Google Search Grounding
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp, idx) => (
                <OpportunityCard key={idx} data={opp} delay={idx * 150} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Initial Instructions */}
        {status === AnalysisStatus.COMPLETE && opportunities.length === 0 && (
          <div className="text-center py-20">
             <p className="text-slate-500">No specific opportunities found for this query. Try a broader industry term.</p>
          </div>
        )}

      </main>
    </div>
  );
}