import React, { useState, useEffect } from 'react';
import { generateTimberDesign } from './services/geminiService';
import { TimberDesignResult } from './types';
import { DesignControls } from './components/DesignControls';
import { BlueprintSpec } from './components/BlueprintSpec';
import { Layers, Maximize2, Key, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  const [hasKey, setHasKey] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Traditional English');
  const [woodType, setWoodType] = useState('White Oak');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<TimberDesignResult | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success to mitigate race condition where hasSelectedApiKey might lag
      setHasKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const data = await generateTimberDesign(prompt, style, woodType);
      setResult(data);
    } catch (error: any) {
      console.error(error);
      
      // If we get a permission denied or not found error, it implies the key is invalid or lacks access.
      if (error.toString().includes("403") || error.toString().includes("Requested entity was not found")) {
         alert("Access Denied: The selected API Key does not have permission for Gemini 3 Pro Image generation. Please select a valid paid key.");
         setHasKey(false); // Force re-selection
      } else {
         alert("Failed to generate design. Please try again. " + (error.message || error.toString()));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Auth Gate Screen
  if (!hasKey) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center mb-6">
            <div className="bg-cyan-500/10 p-4 rounded-full border border-cyan-500/20">
              <Key className="text-cyan-400" size={32} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white text-center mb-2">TimberGen Architect</h1>
          <p className="text-slate-400 text-center mb-8 text-sm leading-relaxed">
            To access the high-fidelity <strong>Gemini 3 Pro</strong> visualization engine, you must connect a Google Cloud API key with billing enabled.
          </p>

          <button
            onClick={handleConnectKey}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-900/20"
          >
            Connect API Key
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="mt-6 flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <ShieldCheck className="text-emerald-500 shrink-0" size={16} />
            <div className="text-xs text-slate-500">
              <p className="mb-1">Requires a paid project key for image generation capabilities.</p>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-500 hover:text-cyan-400 underline"
              >
                View billing documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* Sidebar Controls */}
      <DesignControls 
        prompt={prompt} 
        setPrompt={setPrompt}
        style={style}
        setStyle={setStyle}
        woodType={woodType}
        setWoodType={setWoodType}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative bg-[#0f172a]">
        
        {/* Header/Toolbar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full pointer-events-auto">
            <span className="text-xs font-mono text-cyan-400">GEMINI-3-PRO // INTEGRATED</span>
          </div>
          <button 
             onClick={handleConnectKey}
             className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
             title="Switch API Key"
          >
            <Key size={14} />
          </button>
        </div>

        {/* Empty State */}
        {!result && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 p-8">
            <Layers size={64} className="mb-4 opacity-50" />
            <h1 className="text-2xl font-bold text-slate-500 mb-2">Ready to Design</h1>
            <p className="max-w-md text-center text-sm">
              Enter your vision details in the panel to generate a high-fidelity timber frame visualization and engineering specification.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
            <div className="font-mono text-cyan-500 text-sm animate-pulse">RENDERING ARCHITECTURE...</div>
            <div className="font-mono text-slate-500 text-xs mt-2">CALCULATING LOADS & JOINERY</div>
          </div>
        )}

        {/* Results */}
        {result && !isGenerating && (
          <div className="flex flex-col min-h-full">
            {/* Visualizer Panel */}
            <div className="relative w-full h-[50vh] md:h-[60vh] bg-black">
              <img 
                src={result.imageUrl} 
                alt="Architectural Visualization" 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => window.open(result.imageUrl, '_blank')}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded backdrop-blur-sm border border-white/20 transition-colors"
                title="View Full Size"
              >
                <Maximize2 size={20} />
              </button>
            </div>

            {/* Specs Panel */}
            <div className="flex-1 bg-slate-950 border-t border-slate-800 p-6 md:p-8">
              <div className="max-w-5xl mx-auto">
                 <BlueprintSpec specs={result.specs} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}