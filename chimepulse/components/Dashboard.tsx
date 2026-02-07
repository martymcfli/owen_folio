
import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Users, Zap, Radar, MessageSquare, TrendingUp, Share2, Bot, Sparkles, Info } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartRadar } from 'recharts';
import { getMarketContext } from '../services/geminiService';
import { MarketContext } from '../types';
import { AnalystChat } from './AnalystChat';

const mockTrendData = [
  { name: 'Mon', reach: 4000, resonance: 2400 },
  { name: 'Tue', reach: 3000, resonance: 1398 },
  { name: 'Wed', reach: 2000, resonance: 9800 },
  { name: 'Thu', reach: 2780, resonance: 3908 },
  { name: 'Fri', reach: 1890, resonance: 4800 },
  { name: 'Sat', reach: 2390, resonance: 3800 },
  { name: 'Sun', reach: 3490, resonance: 4300 },
];

const mockRadarData = [
  { subject: 'Trust', A: 120, B: 110, fullMark: 150 },
  { subject: 'Innovation', A: 98, B: 130, fullMark: 150 },
  { subject: 'Support', A: 86, B: 130, fullMark: 150 },
  { subject: 'Fees', A: 99, B: 100, fullMark: 150 },
  { subject: 'Speed', A: 85, B: 90, fullMark: 150 },
  { subject: 'App', A: 65, B: 85, fullMark: 150 },
];

export const Dashboard: React.FC = () => {
    const [context, setContext] = useState<MarketContext | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatContext, setChatContext] = useState<string | undefined>(undefined);

    useEffect(() => {
        getMarketContext().then(setContext);
    }, []);

    const handleChartClick = (data: any) => {
        if (data && data.activePayload) {
            const item = data.activePayload[0].payload;
            setChatContext(`Data Point: ${item.name} | Reach: ${item.reach} | Resonance: ${item.resonance}`);
            setIsChatOpen(true);
        }
    };

    const handleRadarClick = () => {
         setChatContext("Competitor Matrix Comparison: Chime vs Market Average");
         setIsChatOpen(true);
    };

    return (
        <div className="space-y-6 relative">
            <AnalystChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} initialContext={chatContext} />
            
            <div className="flex items-end justify-between mb-2">
                <div>
                    <h2 className="text-3xl font-light text-white tracking-tight">Executive <span className="font-bold text-chime-green">Overview</span></h2>
                    <p className="text-gray-400 text-sm mt-1">Real-time narrative tracking & reputational velocity</p>
                </div>
                <div className="flex gap-3 items-center">
                    {/* Highly visible AI Analyst Button */}
                    <button 
                        onClick={() => { setChatContext("General Executive Overview Analysis"); setIsChatOpen(true); }}
                        className="relative group overflow-hidden px-6 py-2.5 rounded-full bg-chime-green text-black text-sm font-bold hover:shadow-[0_0_30px_rgba(61,220,151,0.5)] transition-all flex items-center gap-2 ring-4 ring-chime-green/10"
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <Bot size={18} className="group-hover:animate-bounce" />
                        <span className="relative z-10">AI ANALYST CORE</span>
                        <Sparkles size={14} className="animate-pulse" />
                    </button>
                    
                    <div className="hidden sm:flex gap-2">
                        <span className="px-3 py-2 rounded-lg bg-chime-deep border border-chime-green/30 text-[10px] text-chime-green font-mono uppercase font-bold tracking-tighter">
                            Q3 OKR: +15% RES
                        </span>
                        <span className="px-3 py-2 rounded-lg bg-chime-deep border border-chime-green/30 text-[10px] text-chime-green font-mono uppercase font-bold tracking-tighter">
                             MARKET: BULLISH
                        </span>
                    </div>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 h-auto lg:h-[600px]">
                
                {/* Main Graph (Span 2) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 glass-panel rounded-2xl p-6 relative flex flex-col group transition-all hover:border-chime-green/30">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="flex items-center gap-2 font-medium text-white">
                            <TrendingUp size={18} className="text-chime-green" />
                            Narrative Resonance Velocity
                        </h3>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-chime-green animate-ping"></span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Real-time Intel</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-[250px] cursor-pointer">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockTrendData} onClick={handleChartClick}>
                                <defs>
                                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3DDC97" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#3DDC97" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" tick={{fill: '#888', fontSize: 12}} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#06231E', border: '1px solid #1C3A35', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="reach" stroke="#3DDC97" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" activeDot={{ r: 6, onClick: handleChartClick }}/>
                                <Area type="monotone" dataKey="resonance" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRes)" activeDot={{ r: 6, onClick: handleChartClick }}/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-end">
                         {/* Corrected: Added missing Info icon import from lucide-react */}
                         <span className="text-[10px] text-gray-500 uppercase tracking-widest italic flex items-center gap-1">
                             <Info size={10} /> Tip: Click data nodes for AI assessment
                         </span>
                    </div>
                </div>

                {/* Radar Chart (Competitor Analysis) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col group transition-all hover:border-purple-400/30 cursor-pointer" onClick={handleRadarClick}>
                    <div className="flex justify-between items-start">
                        <h3 className="flex items-center gap-2 font-medium text-white mb-2">
                            <Radar size={18} className="text-purple-400" />
                            Competitor Matrix
                        </h3>
                        <div className="p-1 rounded-md bg-purple-400/10 text-purple-400">
                             <Bot size={14} className="group-hover:rotate-12 transition-transform" />
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mb-4 uppercase tracking-wider font-bold">Chime (Green) vs. Industry Avg (Purple)</p>
                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockRadarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                                <RechartRadar name="Chime" dataKey="A" stroke="#3DDC97" strokeWidth={2} fill="#3DDC97" fillOpacity={0.3} />
                                <RechartRadar name="Market" dataKey="B" stroke="#A855F7" strokeWidth={2} fill="#A855F7" fillOpacity={0.1} />
                                <Tooltip contentStyle={{ backgroundColor: '#06231E', border: 'none' }} itemStyle={{ color: '#fff' }}/>
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* KPI Stack */}
                <div className="col-span-1 lg:col-span-1 grid grid-rows-3 gap-4">
                    <KPICard 
                        label="Share of Voice" 
                        value="34.2%" 
                        trend="+2.1%" 
                        icon={<Share2 size={16} className="text-blue-400" />} 
                        onClick={() => { setChatContext("Share of Voice Metrics: 34.2%"); setIsChatOpen(true); }}
                    />
                    <KPICard 
                        label="Brand Sentiment" 
                        value="8.4/10" 
                        trend="+0.3" 
                        icon={<Zap size={16} className="text-yellow-400" />} 
                        onClick={() => { setChatContext("Brand Sentiment Analysis: 8.4 out of 10"); setIsChatOpen(true); }}
                    />
                    <KPICard 
                        label="Crisis Probability" 
                        value="Low" 
                        trend="Stable" 
                        isInverse
                        icon={<MessageSquare size={16} className="text-chime-green" />} 
                        onClick={() => { setChatContext("Crisis Probability Assessment: Stable/Low Risk"); setIsChatOpen(true); }}
                    />
                </div>
            </div>

            {/* Bottom Row: AI Insights & News */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel rounded-2xl p-6 md:col-span-2 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Users size={120} />
                     </div>
                     <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <Bot size={20} className="text-chime-green" /> Strategic AI Observations
                     </h3>
                     <div className="space-y-4">
                        <InsightRow 
                            text="Correlational spike detected: 'No Fees' messaging resonates 40% higher when paired with 'Inflation' news cycle."
                            confidence={98}
                        />
                        <InsightRow 
                            text="Audience Shift: Gen Z engagement on LinkedIn surpassing Twitter for 'Career Growth' content."
                            confidence={85}
                        />
                     </div>
                </div>

                <div className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-chime-green/10 to-transparent border-chime-green/20">
                    <h3 className="text-xs font-bold text-chime-green uppercase tracking-widest mb-4">Active Narrative Campaigns</h3>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2 group cursor-pointer hover:bg-white/5 p-1 rounded transition">
                            <span className="text-white font-medium group-hover:text-chime-green">Summer '26 SpotMe</span>
                            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20 animate-pulse">LIVE</span>
                        </li>
                        <li className="flex justify-between items-center text-sm border-b border-white/5 pb-2 group cursor-pointer hover:bg-white/5 p-1 rounded transition">
                            <span className="text-white font-medium group-hover:text-yellow-400">IPO Roadshow Prep</span>
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20">DRAFT</span>
                        </li>
                        <li className="flex justify-between items-center text-sm group cursor-pointer hover:bg-white/5 p-1 rounded transition">
                            <span className="text-white font-medium group-hover:text-blue-400">Credit Builder V4</span>
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">REVIEW</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ label, value, trend, icon, isInverse, onClick }: any) => (
    <div onClick={onClick} className="glass-panel rounded-xl p-5 flex flex-col justify-center relative overflow-hidden hover:bg-white/5 transition duration-300 group cursor-pointer border-transparent hover:border-white/20">
        <div className="absolute right-0 top-0 w-16 h-16 bg-white/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
        <div className="flex justify-between items-start mb-1 relative z-10">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">{label}</span>
            <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-chime-green/10 transition-colors">
                {icon}
            </div>
        </div>
        <div className="flex items-end gap-3 relative z-10 mt-2">
            <span className="text-2xl font-bold text-white font-mono group-hover:text-chime-green transition-colors">{value}</span>
            <span className={`text-[10px] mb-1 font-bold ${isInverse ? 'text-gray-400' : 'text-chime-green'}`}>{trend}</span>
        </div>
    </div>
);

const InsightRow = ({ text, confidence }: { text: string, confidence: number }) => (
    <div className="flex gap-4 items-start group cursor-pointer p-2 rounded-lg hover:bg-white/5 transition">
        <div className="w-10 h-10 rounded-lg bg-chime-deep flex items-center justify-center shrink-0 border border-white/10 group-hover:border-chime-green/50 transition shadow-[0_0_10px_rgba(0,0,0,0.3)]">
            <span className="text-xs font-bold text-chime-green">{confidence}%</span>
        </div>
        <div className="flex-1">
            <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition">{text}</p>
        </div>
    </div>
);
