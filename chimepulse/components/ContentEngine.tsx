import React, { useState } from 'react';
import { Sparkles, Play, Share2, CheckCircle, Smartphone, Globe, Monitor, RefreshCw, X, Video, Wand2, Loader2 } from 'lucide-react';
import { generateEditorialCampaign, enhancePrompt, generateCampaignVideo } from '../services/geminiService';
import { ContentVariant, Channel } from '../types';

export const ContentEngine: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [variants, setVariants] = useState<ContentVariant[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<ContentVariant | null>(null);
    const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
    
    // Strategic Parameters State
    const [config, setConfig] = useState({
        competitorData: true,
        toneEmpathetic: true,
        legalCheck: false,
        videoAsset: true
    });

    // Video State
    const [videoGenerating, setVideoGenerating] = useState(false);
    const [videoError, setVideoError] = useState<string | null>(null);

    const toggleConfig = (key: keyof typeof config) => {
        setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        setVariants([]); 
        setSelectedVariant(null);
        
        try {
            const data = await generateEditorialCampaign(topic);
            setVariants(data);
            if (data.length > 0) setSelectedVariant(data[0]);
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEnhance = async () => {
        if (!topic) return;
        setIsEnhancing(true);
        try {
            const enhanced = await enhancePrompt(topic);
            setTopic(enhanced);
        } catch (e) {
            console.error(e);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleVideoGeneration = async () => {
        if (!selectedVariant) return;
        
        // Key Check for Veo
        // We assume the user has clicked the button which triggers the check.
        // We must proceed after openSelectKey as per guidelines, assuming success.
        const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
        if (!hasKey) {
            await (window as any).aistudio?.openSelectKey();
        }

        setVideoGenerating(true);
        setVideoError(null);

        try {
            const uri = await generateCampaignVideo(selectedVariant.headline);
            if (uri) {
                // Update the variant with the new video URI
                const updated = { ...selectedVariant, videoUri: uri };
                setSelectedVariant(updated);
                // Update in list
                setVariants(prev => prev.map(v => v.id === updated.id ? updated : v));
            }
        } catch (e: any) {
            console.error(e);
            setVideoError("Video generation failed. Please try again or check API limits.");
        } finally {
            setVideoGenerating(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">
            {/* Input & Context Column */}
            <div className="w-[350px] flex flex-col gap-4 shrink-0">
                <div className="glass-panel rounded-2xl p-6 flex flex-col h-full">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                        <Sparkles size={16} className="text-chime-green" />
                        Story Studio
                    </h3>
                    
                    <div className="relative mb-2">
                        <textarea 
                            className="w-full h-40 bg-chime-deep/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-chime-green/50 resize-none transition-colors"
                            placeholder="Describe the strategic narrative, product launch, or crisis response..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                         <button 
                            onClick={handleEnhance}
                            disabled={isEnhancing || !topic}
                            className="absolute bottom-3 right-3 p-1.5 bg-white/10 rounded-lg text-xs text-chime-green hover:bg-white/20 flex items-center gap-1 transition-colors border border-white/5"
                            title="AI Enhance Prompt"
                        >
                            {isEnhancing ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
                            {isEnhancing ? 'Optimizing...' : 'Enhance'}
                        </button>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm tracking-wide transition-all uppercase mb-4
                            ${isGenerating 
                                ? 'bg-gray-800 text-gray-500' 
                                : 'bg-chime-green text-black hover:bg-[#32b57d] shadow-[0_0_20px_rgba(61,220,151,0.3)]'}`}
                    >
                        {isGenerating ? <Loader2 className="animate-spin" /> : 'Generate Narratives'}
                    </button>

                    <div className="mt-4 flex-1">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Strategic Parameters</h4>
                        <div className="space-y-3">
                            <ParameterToggle 
                                label="Include Competitor Data" 
                                active={config.competitorData} 
                                onToggle={() => toggleConfig('competitorData')}
                            />
                            <ParameterToggle 
                                label="Tone: Empathetic" 
                                active={config.toneEmpathetic} 
                                onToggle={() => toggleConfig('toneEmpathetic')}
                            />
                            <ParameterToggle 
                                label="Legal Compliance Check" 
                                active={config.legalCheck} 
                                onToggle={() => toggleConfig('legalCheck')}
                            />
                            <ParameterToggle 
                                label="Sora/Veo Video Asset" 
                                active={config.videoAsset} 
                                onToggle={() => toggleConfig('videoAsset')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col relative">
                {!selectedVariant && !isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-0">
                        <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center mb-6 animate-pulse">
                            <Monitor size={32} className="opacity-50" />
                        </div>
                        <p className="font-mono text-sm">AWAITING NARRATIVE INPUT</p>
                    </div>
                )}

                {selectedVariant && (
                    <>
                        {/* Channel Tabs */}
                        <div className="h-16 border-b border-white/5 flex items-center px-6 gap-2 bg-black/20">
                            {variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                                        ${selectedVariant.id === variant.id 
                                            ? 'bg-chime-green/10 text-chime-green border border-chime-green/20' 
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    {variant.channel}
                                </button>
                            ))}
                            <div className="flex-1" />
                            <div className="flex bg-black/40 rounded-lg p-1">
                                <button onClick={() => setViewMode('mobile')} className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><Smartphone size={16}/></button>
                                <button onClick={() => setViewMode('desktop')} className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><Monitor size={16}/></button>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Visual Preview */}
                            <div className="flex-1 bg-[#040404] relative flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black">
                                <div className={`transition-all duration-500 ease-in-out relative shadow-2xl flex flex-col ${viewMode === 'mobile' ? 'w-[375px] h-[700px] rounded-[40px] border-[8px] border-[#1C1C1C] bg-white text-black overflow-hidden' : 'w-[800px] h-[500px] rounded-lg border border-gray-700 bg-white text-black overflow-hidden'}`}>
                                    {/* Mockup Header */}
                                    <div className="h-14 bg-gray-50 border-b flex items-center px-4 justify-between shrink-0">
                                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                    </div>
                                    {/* Content */}
                                    <div className="p-6 overflow-y-auto flex-1">
                                        <h1 className="text-xl font-bold mb-4">{selectedVariant.headline}</h1>
                                        {selectedVariant.body.split('\n').map((line, i) => (
                                            <p key={i} className="mb-4 text-sm leading-relaxed text-gray-800">{line}</p>
                                        ))}

                                        {/* Video/Media Container */}
                                        {config.videoAsset && (
                                            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 min-h-[200px] flex items-center justify-center relative group">
                                                {selectedVariant.videoUri ? (
                                                    <video 
                                                        src={selectedVariant.videoUri} 
                                                        controls 
                                                        autoPlay 
                                                        loop 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-center p-4">
                                                        {videoGenerating ? (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Loader2 className="animate-spin text-chime-green" size={24} />
                                                                <p className="text-xs text-gray-500">Generating Veo Video Asset...</p>
                                                                <p className="text-[10px] text-gray-400">This can take up to 60s</p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Video className="text-gray-300" size={32} />
                                                                <p className="text-xs text-gray-400">[Video Placeholder]</p>
                                                                <button 
                                                                    onClick={handleVideoGeneration}
                                                                    className="mt-2 px-4 py-2 bg-black text-white text-xs rounded-full flex items-center gap-2 hover:bg-gray-800 transition"
                                                                >
                                                                    <Sparkles size={12} />
                                                                    Generate with Veo
                                                                </button>
                                                                <p className="text-[9px] text-gray-400 mt-1 max-w-[150px]">Requires Google Cloud API Key (Cost Applies)</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {videoError && <p className="text-red-500 text-xs mt-2 text-center">{videoError}</p>}
                                    </div>
                                    
                                    {/* Reflection overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                                </div>
                            </div>

                            {/* Sidebar Analysis */}
                            <div className="w-80 border-l border-white/5 bg-black/20 p-6 overflow-y-auto">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Prediction Model</h4>
                                
                                <div className="space-y-6">
                                    <MetricBar label="Reach Probability" value={selectedVariant.metrics.reach / 1000} max={100} unit="K" />
                                    <MetricBar label="Resonance Score" value={selectedVariant.metrics.resonance} max={100} color="bg-blue-500" />
                                    <MetricBar label="Reputation Lift" value={selectedVariant.metrics.reputationImpact + 50} max={100} color="bg-purple-500" />
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Persona Feedback</h4>
                                    <div className="space-y-4">
                                        {selectedVariant.feedback.map((fb, i) => (
                                            <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold text-white">{fb.persona}</span>
                                                    <div className={`w-2 h-2 rounded-full ${fb.sentiment === 'Positive' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                </div>
                                                <p className="text-xs text-gray-400 italic leading-snug">"{fb.critique}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const ParameterToggle = ({ label, active, onToggle }: { label: string, active: boolean, onToggle: () => void }) => (
    <div onClick={onToggle} className="flex items-center justify-between group cursor-pointer select-none py-1">
        <span className={`text-sm transition-colors ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{label}</span>
        <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-chime-green/20' : 'bg-gray-700'}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${active ? 'bg-chime-green left-4.5' : 'bg-gray-500 left-0.5'}`}></div>
        </div>
    </div>
);

const MetricBar = ({ label, value, max, unit, color = 'bg-chime-green' }: any) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">{label}</span>
            <span className="text-white font-mono">{Math.round(value)}{unit}</span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${(value / max) * 100}%` }}></div>
        </div>
    </div>
);
