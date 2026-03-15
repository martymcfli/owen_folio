import React from 'react';
import { TimberSpecs } from '../types';
import { Ruler, Hammer, FileText, DollarSign, Download } from 'lucide-react';

interface Props {
  specs: TimberSpecs;
}

export const BlueprintSpec: React.FC<Props> = ({ specs }) => {
  const downloadSpecs = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(specs, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "timber-frame-specs.json";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="bg-[#1e293b] border-2 border-[#334155] rounded-lg p-6 font-mono text-sm shadow-2xl relative overflow-hidden">
      {/* Blueprint Grid Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6 border-b-2 border-dashed border-slate-600 pb-4">
          <div>
            <h2 className="text-xl font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={20} /> Specification Sheet
            </h2>
            <p className="text-slate-400 mt-1">Ref: {specs.style.toUpperCase()}-{new Date().getFullYear()}</p>
          </div>
          <button onClick={downloadSpecs} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors text-xs font-bold uppercase">
            <Download size={14} /> Export JSON
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* General Info */}
          <div className="space-y-4">
            <h3 className="text-slate-200 font-bold uppercase border-b border-slate-600 pb-1 mb-3">Project Data</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                <div className="text-slate-500 text-xs uppercase mb-1">Style</div>
                <div className="text-blue-200 font-semibold">{specs.style}</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                <div className="text-slate-500 text-xs uppercase mb-1">Material</div>
                <div className="text-blue-200 font-semibold">{specs.recommendedWood}</div>
              </div>
              <div className="col-span-2 bg-slate-800/50 p-3 rounded border border-slate-700 flex items-center gap-3">
                <DollarSign className="text-green-500" size={16} />
                <div>
                  <div className="text-slate-500 text-xs uppercase">Est. Material Cost</div>
                  <div className="text-green-400 font-semibold">{specs.estimatedCost}</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
               <h3 className="text-slate-200 font-bold uppercase border-b border-slate-600 pb-1 mb-3">Engineering Notes</h3>
               <p className="text-slate-400 leading-relaxed text-xs italic bg-slate-900/50 p-4 rounded border-l-2 border-yellow-500">
                 {specs.engineeringNotes}
               </p>
            </div>
          </div>

          {/* BOM & Joinery */}
          <div className="space-y-6">
            <div>
              <h3 className="text-slate-200 font-bold uppercase border-b border-slate-600 pb-1 mb-3 flex items-center gap-2">
                <Ruler size={16} /> Structural Schedule
              </h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="pb-2">Component</th>
                    <th className="pb-2">Dims</th>
                    <th className="pb-2">Note</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {specs.structuralComponents.map((item, i) => (
                    <tr key={i} className="border-t border-slate-700/50">
                      <td className="py-2 font-semibold text-blue-300">{item.component}</td>
                      <td className="py-2">{item.dimensions}</td>
                      <td className="py-2 text-slate-500">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-slate-200 font-bold uppercase border-b border-slate-600 pb-1 mb-3 flex items-center gap-2">
                <Hammer size={16} /> Joinery Detail
              </h3>
              <div className="space-y-2">
                {specs.joineryDetails.map((joint, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-800/30 p-2 rounded border border-slate-700/50">
                    <div>
                      <span className="text-orange-300 font-bold">{joint.jointType}</span>
                      <span className="text-slate-500 mx-2">|</span>
                      <span className="text-slate-400">{joint.location}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${
                      joint.complexity === 'High' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                      joint.complexity === 'Medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                      'border-green-500/30 text-green-400 bg-green-500/10'
                    }`}>
                      {joint.complexity.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};