import React from 'react';
import { Settings, PenTool } from 'lucide-react';

interface Props {
  prompt: string;
  setPrompt: (v: string) => void;
  style: string;
  setStyle: (v: string) => void;
  woodType: string;
  setWoodType: (v: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const STYLES = ["Traditional English", "Japanese (Minka)", "Normandy/French", "American Barn", "Modern Hybrid", "Gothic Revival"];
const WOODS = ["White Oak", "Douglas Fir", "Eastern White Pine", "Hemlock", "Reclaimed Barn Wood"];

export const DesignControls: React.FC<Props> = ({
  prompt, setPrompt, style, setStyle, woodType, setWoodType, onGenerate, isGenerating
}) => {
  return (
    <div className="bg-slate-900 border-r border-slate-800 p-6 flex flex-col h-full overflow-y-auto w-full md:w-80 shrink-0">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
          <PenTool className="text-cyan-500" />
          TimberGen
        </h2>
        <p className="text-xs text-slate-500 uppercase tracking-widest">Architectural AI Suite</p>
      </div>

      <div className="space-y-6 grow">
        <div>
          <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Architectural Style</label>
          <select 
            value={style} 
            onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
          >
            {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Primary Material</label>
          <select 
            value={woodType} 
            onChange={(e) => setWoodType(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
          >
            {WOODS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Vision Description</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your dream structure... e.g., 'A cozy cabin with a loft and large cathedral windows overlooking a lake.'"
            className="w-full h-32 bg-slate-800 border border-slate-700 rounded p-3 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none resize-none"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt}
          className={`w-full py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-all
            ${isGenerating 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-blue-900/20'
            }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <Settings className="animate-spin" size={16} /> Processing...
            </span>
          ) : 'Generate Schematics'}
        </button>
      </div>
    </div>
  );
};