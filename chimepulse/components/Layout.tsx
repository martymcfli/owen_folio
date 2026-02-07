import React, { useState, useRef, useEffect } from 'react';
import { Activity, LayoutDashboard, Cpu, Network, Radio, Bell, Globe, Zap, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: 'dashboard' | 'engine' | 'analytics';
    onTabChange: (tab: 'dashboard' | 'engine' | 'analytics') => void;
}

interface Alert {
    id: string;
    type: 'warning' | 'info' | 'success';
    title: string;
    message: string;
    time: string;
    impact: 'High' | 'Med' | 'Low';
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
    const [isAlertsOpen, setIsAlertsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const alerts: Alert[] = [
        {
            id: '1',
            type: 'warning',
            title: 'Competitor Intelligence',
            message: 'Monzo testing "Credit-as-a-Service" API in sandbox. Overlap with Chime Pulse roadmap: 84%.',
            time: '2m ago',
            impact: 'High'
        },
        {
            id: '2',
            type: 'info',
            title: 'Sentiment Shift',
            message: 'Significant positivity spike (12%) in "Fee-Free" narrative among Gen-Z cohorts on TikTok.',
            time: '14m ago',
            impact: 'Med'
        },
        {
            id: '3',
            type: 'warning',
            title: 'Regulatory Alert',
            message: 'CFPB draft on open banking standards suggests mandatory data-sharing reciprocity by Q4.',
            time: '1h ago',
            impact: 'High'
        },
        {
            id: '4',
            type: 'success',
            title: 'Model Sync Complete',
            message: 'Narrative resonance prediction engine updated with latest Federal Reserve rate-cycle data.',
            time: '3h ago',
            impact: 'Low'
        }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsAlertsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex h-screen w-full bg-transparent overflow-hidden font-sans selection:bg-chime-green selection:text-black">
            {/* Minimalist Sidebar */}
            <aside className="w-20 lg:w-64 glass-panel border-r-0 border-r-white/5 flex flex-col z-20">
                <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-chime-border">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-chime-green rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-br from-chime-green to-teal-800 rounded-xl flex items-center justify-center text-black font-bold text-xl">
                            C
                        </div>
                    </div>
                    <div className="hidden lg:block ml-4">
                        <h1 className="font-bold text-lg tracking-tight text-white">PULSE</h1>
                        <p className="text-[10px] text-chime-green tracking-widest uppercase opacity-80">OS v4.2</p>
                    </div>
                </div>

                <nav className="flex-1 py-8 px-2 lg:px-4 space-y-2">
                    <NavItem 
                        icon={<LayoutDashboard size={22} />} 
                        label="Command Center" 
                        active={activeTab === 'dashboard'} 
                        onClick={() => onTabChange('dashboard')}
                    />
                    <NavItem 
                        icon={<Cpu size={22} />} 
                        label="Generative Core" 
                        active={activeTab === 'engine'} 
                        onClick={() => onTabChange('engine')}
                    />
                    <NavItem 
                        icon={<Network size={22} />} 
                        label="Deep Metrics" 
                        active={activeTab === 'analytics'} 
                        onClick={() => onTabChange('analytics')}
                    />
                </nav>

                <div className="p-4 border-t border-chime-border">
                    <div className="bg-chime-deep/50 rounded-xl p-4 border border-chime-border relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-chime-green blur-[50px] opacity-10 group-hover:opacity-20 transition"></div>
                        <p className="text-[10px] text-gray-400 uppercase font-mono mb-2">System Load</p>
                        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-chime-green h-full w-[72%] shadow-[0_0_10px_#3DDC97]"></div>
                        </div>
                        <div className="flex justify-between items-center mt-2 font-mono text-xs text-chime-green">
                            <span>ONLINE</span>
                            <span>24ms</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10">
                {/* HUD Header - Elevating z-index to 50 to ensure alerts stay on top of dashboard content */}
                <header className="h-16 border-b border-chime-border flex items-center justify-between px-8 bg-chime-deep/80 backdrop-blur-md relative z-50">
                    {/* Live Ticker */}
                    <div className="flex items-center gap-4 overflow-hidden mask-linear-gradient flex-1 max-w-2xl">
                        <div className="flex items-center gap-2 text-chime-green text-xs font-mono whitespace-nowrap px-3 py-1 bg-chime-green/10 rounded border border-chime-green/20">
                            <Activity size={12} />
                            LIVE FEED
                        </div>
                        <div className="flex gap-8 animate-marquee whitespace-nowrap text-xs text-gray-400 font-mono">
                            <span className="flex items-center gap-2"><span className="text-white">BTC</span> $94,230 <span className="text-green-400">▲ 1.2%</span></span>
                            <span className="flex items-center gap-2"><span className="text-white">CHIME_SENTIMENT</span> 88.4 <span className="text-green-400">▲ 0.5%</span></span>
                            <span className="flex items-center gap-2"><span className="text-white">IPO_MENTIONS</span> 1,204 <span className="text-red-400">▼ 2.1%</span></span>
                            <span className="flex items-center gap-2"><span className="text-white">COMPETITOR_ALERT</span> Monzo launches new premium tier...</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 relative">
                        <button className="relative text-gray-400 hover:text-white transition-colors">
                            <Globe size={20} />
                        </button>
                        
                        {/* Alerts Notification System */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                                className={`relative p-2 rounded-lg transition-all ${isAlertsOpen ? 'text-chime-green bg-chime-green/10 shadow-[0_0_15px_rgba(61,220,151,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Bell size={20} />
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-chime-green rounded-full shadow-[0_0_8px_#3DDC97] border-2 border-[#06231E]"></span>
                            </button>

                            {isAlertsOpen && (
                                <div className="absolute right-0 mt-4 w-96 glass-panel rounded-2xl shadow-2xl border border-chime-green/40 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 ring-1 ring-white/10">
                                    <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
                                        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Active System Alerts</h3>
                                        <span className="text-[10px] bg-chime-green/20 text-chime-green px-2 py-0.5 rounded border border-chime-green/30 font-bold">4 UNREAD</span>
                                    </div>
                                    <div className="max-h-[440px] overflow-y-auto bg-chime-deep/90">
                                        {alerts.map((alert) => (
                                            <div key={alert.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 p-2 rounded-lg ${
                                                        alert.type === 'warning' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' :
                                                        alert.type === 'success' ? 'bg-chime-green/20 text-chime-green border border-chime-green/20' :
                                                        'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                        {alert.type === 'warning' ? <AlertTriangle size={16} /> :
                                                         alert.type === 'success' ? <CheckCircle2 size={16} /> :
                                                         <Info size={16} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <h4 className="text-sm font-bold text-white group-hover:text-chime-green transition-colors">{alert.title}</h4>
                                                            <span className="text-[10px] text-gray-500 font-mono">{alert.time}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-400 leading-relaxed mb-2">{alert.message}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                                                alert.impact === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                                                alert.impact === 'Med' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                                                'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                                            }`}>
                                                                IMPACT: {alert.impact}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-4 bg-chime-green/10 text-[10px] font-bold text-chime-green hover:bg-chime-green hover:text-black transition uppercase tracking-widest flex items-center justify-center gap-2 border-t border-white/5">
                                        View Historical Intel <Activity size={12} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="h-8 w-[1px] bg-white/10"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-[10px] text-gray-400 font-mono tracking-tighter">DIR. STRATEGIC EDITORIAL</p>
                                <p className="text-sm font-bold text-white tracking-tight">Owen M.</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chime-green/30 to-black border border-chime-green/20 shadow-[0_0_10px_rgba(61,220,151,0.2)] flex items-center justify-center text-chime-green font-bold text-xs">
                                OM
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 relative">
                     {/* Decorative background grids */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(61,220,151,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(61,220,151,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
                    <div className="relative z-10 h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group
            ${active 
                ? 'text-white bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(61,220,151,0.1)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <div className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-chime-green' : ''}`}>
            {icon}
        </div>
        <span className="relative z-10 hidden lg:block">{label}</span>
        {active && <div className="absolute left-0 top-0 h-full w-1 bg-chime-green shadow-[0_0_10px_#3DDC97]"></div>}
    </button>
);