import React, { useRef, useState } from 'react';
import { Upload, Music, Zap, Disc, Cpu } from 'lucide-react';

interface Props {
  onUpload: (file: File, genre: string, vibe: string) => void;
  isLoading: boolean;
}

export const UploadScreen: React.FC<Props> = ({ onUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [genre, setGenre] = useState('');
  const [vibe, setVibe] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    if (f.type.startsWith('audio/')) {
      setFile(f);
    } else {
      alert("Please upload a valid audio file (MP3/WAV)");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 relative z-10">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-studio-accent/10 border border-studio-accent/20 rounded-full mb-4">
           <Cpu size={12} className="text-studio-accent" />
           <span className="text-[10px] font-mono text-studio-accent uppercase tracking-widest">Neural Audio Core Online</span>
        </div>
        <h1 className="text-6xl font-black text-white tracking-tighter mb-2">
          MASTER<span className="text-studio-accent">MIND</span>
        </h1>
        <p className="text-studio-text opacity-60 font-mono text-sm tracking-[0.3em] uppercase">
          Autonomous Audio Architect
        </p>
      </div>

      <div className="bg-[#1c1c1f]/80 backdrop-blur-md border border-studio-border/50 rounded-2xl p-1 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-studio-accent/5 to-transparent pointer-events-none"></div>
        
        <div className="bg-[#121214] rounded-xl p-8 relative z-10 border border-white/5">
            {!file ? (
            <div 
                className={`relative border-2 border-dashed rounded-lg p-16 text-center transition-all duration-300 cursor-pointer group/drop
                ${dragActive ? 'border-studio-accent bg-studio-accent/5 scale-[1.02]' : 'border-studio-border hover:border-studio-text/30 hover:bg-white/5'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input 
                ref={inputRef}
                type="file" 
                className="hidden" 
                accept="audio/*"
                onChange={handleChange}
                />
                <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-[#1a1a1e] flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover/drop:shadow-[0_0_30px_rgba(255,149,0,0.2)] transition-shadow">
                    <Upload className="text-studio-text group-hover/drop:text-studio-accent transition-colors" size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Upload Source Audio</h3>
                    <p className="text-xs font-mono text-studio-text opacity-50 uppercase tracking-wider">Supports WAV / MP3 / AIFF</p>
                </div>
                </div>
            </div>
            ) : (
            <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-4 p-4 bg-[#0a0a0c] rounded-lg border border-studio-accent/20 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-studio-accent"></div>
                <div className="w-12 h-12 bg-studio-accent/10 rounded flex items-center justify-center text-studio-accent">
                    <Music size={24} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white font-bold truncate text-lg">{file.name}</p>
                    <p className="text-xs font-mono text-studio-text opacity-50">{(file.size / 1024 / 1024).toFixed(2)} MB • READY FOR ANALYSIS</p>
                </div>
                <button 
                    onClick={() => setFile(null)}
                    className="text-xs text-studio-text hover:text-white uppercase font-bold hover:underline"
                >
                    Cancel
                </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                <div className="group/input">
                    <label className="block text-[10px] font-mono text-studio-accent uppercase mb-2 ml-1">Genre</label>
                    <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="e.g. Techno, Trap, Pop"
                    className="w-full bg-[#0a0a0c] border border-studio-border text-white p-4 rounded-lg focus:outline-none focus:border-studio-accent focus:ring-1 focus:ring-studio-accent transition-all font-sans text-sm placeholder:text-white/20"
                    />
                </div>
                <div className="group/input">
                    <label className="block text-[10px] font-mono text-studio-accent uppercase mb-2 ml-1">Sonic Target</label>
                    <input
                    type="text"
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    placeholder="e.g. Aggressive, Wide, Warm"
                    className="w-full bg-[#0a0a0c] border border-studio-border text-white p-4 rounded-lg focus:outline-none focus:border-studio-accent focus:ring-1 focus:ring-studio-accent transition-all font-sans text-sm placeholder:text-white/20"
                    />
                </div>
                </div>

                <button
                onClick={() => onUpload(file, genre, vibe)}
                disabled={!genre || !vibe || isLoading}
                className={`w-full py-5 rounded-lg font-black uppercase tracking-[0.2em] text-sm transition-all relative overflow-hidden
                    ${isLoading || !genre || !vibe
                    ? 'bg-studio-panel border border-studio-border text-studio-text opacity-50 cursor-not-allowed'
                    : 'bg-studio-accent text-black hover:bg-studio-accent/90 shadow-[0_0_40px_rgba(255,149,0,0.3)] hover:shadow-[0_0_60px_rgba(255,149,0,0.5)] transform hover:-translate-y-1'
                    }`}
                >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Constructing Signal Chain...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-3 relative z-10">
                    <Disc size={18} /> Initiate Mastering Sequence
                    </span>
                )}
                </button>
            </div>
            )}
        </div>
      </div>
      
      <div className="text-center mt-12">
          <p className="text-[10px] font-mono text-studio-text opacity-30 tracking-widest">
            SYSTEM VERSION 2.5 • LATENCY 0MS • NEURAL LINK ACTIVE
          </p>
      </div>
    </div>
  );
};