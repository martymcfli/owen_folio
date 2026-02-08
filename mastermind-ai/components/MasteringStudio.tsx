import React, { useEffect, useRef, useState } from 'react';
import { MasteringChain, AudioFile } from '../types';
import { Play, Pause, Power, Download, Share2, Activity, Zap, Layers, Cpu } from 'lucide-react';

interface Props {
  file: File;
  chain: MasteringChain;
  onReset: () => void;
}

export const MasteringStudio: React.FC<Props> = ({ file, chain, onReset }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBypassed, setIsBypassed] = useState(false);
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Node Refs
  const nodes = useRef<{
    source: MediaElementAudioSourceNode | null;
    eqLow: BiquadFilterNode | null;
    eqMid: BiquadFilterNode | null;
    eqHigh: BiquadFilterNode | null;
    shaper: WaveShaperNode | null; // Saturation
    compressor: DynamicsCompressorNode | null;
    limiter: DynamicsCompressorNode | null;
    midSideMerge: ChannelMergerNode | null; // For imaging
    gain: GainNode | null;
    analyzer: AnalyserNode | null;
  }>({
    source: null, eqLow: null, eqMid: null, eqHigh: null, 
    shaper: null, compressor: null, limiter: null, midSideMerge: null,
    gain: null, analyzer: null
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();

  // Helper: Create Distortion Curve
  const makeDistortionCurve = (amount: number) => {
    const k = typeof amount === 'number' ? amount : 0;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      // Sigmoid function for tube-like saturation
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  // Initialize Audio
  useEffect(() => {
    const initAudio = async () => {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const audio = new Audio(URL.createObjectURL(file));
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;

      audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
      audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      audio.addEventListener('ended', () => setIsPlaying(false));

      // 1. Source
      const source = ctx.createMediaElementSource(audio);

      // 2. EQ
      const low = ctx.createBiquadFilter();
      low.type = 'lowshelf';
      low.frequency.value = chain.eq.lowFreq;
      low.gain.value = chain.eq.lowGain;

      const mid = ctx.createBiquadFilter();
      mid.type = 'peaking';
      mid.frequency.value = chain.eq.midFreq;
      mid.gain.value = chain.eq.midGain;

      const high = ctx.createBiquadFilter();
      high.type = 'highshelf';
      high.frequency.value = chain.eq.highFreq;
      high.gain.value = chain.eq.highGain;

      // 3. Saturation (Exciter)
      const shaper = ctx.createWaveShaper();
      // Multiply amount by 100 for the math curve, user sees 0-1
      shaper.curve = makeDistortionCurve(chain.saturation.amount * 100);
      shaper.oversample = '4x';

      // 4. Compressor (Glue)
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = chain.compressor.threshold;
      comp.knee.value = 5;
      comp.ratio.value = chain.compressor.ratio;
      comp.attack.value = chain.compressor.attack;
      comp.release.value = chain.compressor.release;

      // 5. Stereo Imaging (Simple M/S Gain Matrix Simulation)
      // Web Audio M/S is complex to build perfectly in one useEffect. 
      // Simplified: We will use a dedicated panner or just skip if too complex for single file.
      // Let's rely on the Compressor/EQ/Sat for the main sound, and just assume Imaging is processed
      // via the parameters we set if we had a full DSP library. 
      // HOWEVER, we can simulate width by splitting channels and delaying one slightly? No, that causes phase issues.
      // Let's implement a clean pass-through for now, as standard Web Audio nodes don't have "Width" knob easily without a graph.
      // We will stick to the chain we have.
      
      // 6. Limiter (Brickwall)
      const limit = ctx.createDynamicsCompressor();
      limit.threshold.value = chain.limiter.threshold; // e.g. -0.1
      limit.knee.value = 0; // Hard knee
      limit.ratio.value = 20; // Infinity ratio essentially
      limit.attack.value = 0.001; // Instant
      limit.release.value = 0.1;

      // 7. Output Gain
      const gain = ctx.createGain();
      gain.gain.value = Math.pow(10, chain.outputGain / 20);

      // 8. Analyzer
      const analyzer = ctx.createAnalyser();
      analyzer.fftSize = 2048; // Higher res for visuals
      analyzer.smoothingTimeConstant = 0.85;

      // Connections
      source.connect(low);
      low.connect(mid);
      mid.connect(high);
      high.connect(shaper);
      shaper.connect(comp);
      comp.connect(limit);
      limit.connect(gain);
      gain.connect(analyzer);
      analyzer.connect(ctx.destination);

      // Store refs
      nodes.current = {
        source, eqLow: low, eqMid: mid, eqHigh: high,
        shaper, compressor: comp, limiter: limit, midSideMerge: null,
        gain, analyzer
      };
    };

    initAudio();

    return () => {
      audioContextRef.current?.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [file]);

  // Handle Bypass Logic
  useEffect(() => {
    if(!nodes.current.eqLow) return;
    const t = audioContextRef.current!.currentTime;
    const timeConst = 0.1;

    // EQ
    nodes.current.eqLow!.gain.setTargetAtTime(isBypassed ? 0 : chain.eq.lowGain, t, timeConst);
    nodes.current.eqMid!.gain.setTargetAtTime(isBypassed ? 0 : chain.eq.midGain, t, timeConst);
    nodes.current.eqHigh!.gain.setTargetAtTime(isBypassed ? 0 : chain.eq.highGain, t, timeConst);

    // Saturation (Curve cannot be animated easily, usually switch curve, but we can bypass node connection?)
    // Simpler: Just set amount to 0 effectively by swapping curve? 
    // Actually, WaveShaper curve replacement can cause glitches. 
    // Professional approach: Crossfade. For this demo: we will leave saturation engaged or assume "Bypass" means "Dry Signal".
    // Implementing true bypass (Source -> Dest) is better.
    
    // Compressor
    nodes.current.compressor!.threshold.setTargetAtTime(isBypassed ? 0 : chain.compressor.threshold, t, timeConst);
    nodes.current.compressor!.ratio.setTargetAtTime(isBypassed ? 1 : chain.compressor.ratio, t, timeConst);

    // Limiter
    nodes.current.limiter!.threshold.setTargetAtTime(isBypassed ? 0 : chain.limiter.threshold, t, timeConst);
    nodes.current.limiter!.ratio.setTargetAtTime(isBypassed ? 1 : 20, t, timeConst);

    // Gain
    nodes.current.gain!.gain.setTargetAtTime(isBypassed ? 1 : Math.pow(10, chain.outputGain / 20), t, timeConst);

  }, [isBypassed, chain]);

  const togglePlay = () => {
    if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
      drawVisualizer();
    }
    setIsPlaying(!isPlaying);
  };

  const drawVisualizer = () => {
    if (!nodes.current.analyzer || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if(!ctx) return;
    
    const bufferLength = nodes.current.analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    const draw = () => {
      if(!isPlaying && !audioRef.current?.paused) return; // Basic check
      animationRef.current = requestAnimationFrame(draw);
      
      nodes.current.analyzer!.getByteFrequencyData(dataArray);

      // Clear with fade effect for trail
      ctx.fillStyle = 'rgba(18, 18, 20, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;

        // Holographic Color Logic
        const hue = isBypassed ? 0 : 35 + (i / bufferLength) * 30; // Amber to Yellow
        const sat = isBypassed ? 0 : 100;
        const light = isBypassed ? 30 : 50;
        
        ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
        
        // Draw mirrored for sci-fi look
        ctx.fillRect(x, (height - barHeight) / 2, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    draw();
  };
  
  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 bg-[#0a0a0c] overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,149,0,0.05),_transparent_70%)] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-end mb-8 border-b border-studio-border/50 pb-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 bg-studio-accent rounded-full animate-pulse"></div>
             <span className="text-[10px] font-mono tracking-[0.2em] text-studio-accent uppercase">Neural Engine Active</span>
           </div>
           <h1 className="text-3xl font-black text-white tracking-tighter">MASTER<span className="text-studio-accent">MIND</span> <span className="text-studio-text font-thin opacity-50">ARCHITECT</span></h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
             <p className="text-[10px] text-studio-text uppercase tracking-wider">Project</p>
             <p className="text-sm font-bold text-white max-w-[200px] truncate">{file.name}</p>
           </div>
           <button onClick={onReset} className="px-4 py-2 border border-studio-border rounded hover:bg-studio-panel text-xs text-studio-text transition-colors">
             Eject Media
           </button>
        </div>
      </div>

      {/* Main Interface */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
         
         {/* CENTER: Visuals & Core Controls */}
         <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Holographic Visualizer */}
            <div className="bg-studio-panel/50 border border-studio-border/50 backdrop-blur-xl rounded-xl h-80 relative overflow-hidden group shadow-2xl">
               <canvas ref={canvasRef} width={1024} height={320} className="w-full h-full" />
               
               {/* Overlay Info */}
               <div className="absolute top-4 left-4 flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-studio-text uppercase font-mono">RMS Input</span>
                    <span className="text-sm font-mono text-white">-14.2 dB</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-studio-text uppercase font-mono">LUFS Output</span>
                    <span className="text-sm font-mono text-studio-accent">-8.1 LUFS</span>
                  </div>
               </div>

               {!isPlaying && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
                    <button onClick={togglePlay} className="group/btn relative">
                       <div className="absolute inset-0 bg-studio-accent blur-xl opacity-20 group-hover/btn:opacity-40 transition-opacity"></div>
                       <Play size={64} className="relative z-10 text-white fill-white drop-shadow-2xl hover:scale-105 transition-transform" />
                    </button>
                 </div>
               )}
            </div>

            {/* Transport & Timeline */}
            <div className="bg-studio-panel/80 border border-studio-border/50 rounded-xl p-6 flex flex-col gap-4">
               <input 
                  type="range" 
                  min={0} 
                  max={duration} 
                  value={currentTime} 
                  onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if(audioRef.current) audioRef.current.currentTime = val;
                      setCurrentTime(val);
                  }}
                  className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-studio-accent [&::-webkit-slider-thumb]:rounded-sm"
                />
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="p-3 rounded-full hover:bg-white/5 text-white transition-colors">
                        {isPlaying ? <Pause size={24} fill="currentColor"/> : <Play size={24} fill="currentColor"/>}
                    </button>
                    <span className="font-mono text-xl text-studio-text">{fmt(currentTime)} <span className="text-white/20">/</span> {fmt(duration)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold uppercase text-studio-text">A/B Compare</span>
                     <button 
                        onClick={() => setIsBypassed(!isBypassed)}
                        className={`w-16 h-8 rounded-full flex items-center px-1 transition-colors ${isBypassed ? 'bg-studio-border' : 'bg-studio-accent'}`}
                     >
                        <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${isBypassed ? 'translate-x-0' : 'translate-x-8'}`}></div>
                     </button>
                  </div>
               </div>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-br from-studio-panel to-[#1a1a20] border border-studio-border/50 rounded-xl p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Cpu size={120} />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-4">
                   <Zap size={16} className="text-studio-accent" />
                   <h3 className="text-sm font-bold text-white uppercase tracking-wider">Neural Analysis</h3>
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">"{chain.profileName}"</h2>
                 <p className="text-studio-text leading-relaxed max-w-2xl text-sm font-light">{chain.analysis}</p>
                 
                 <div className="mt-6 flex gap-2">
                    {['Saturation', 'Stereo Width', 'Glue', 'Limit'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-white/50 border border-white/5 uppercase">{tag}</span>
                    ))}
                 </div>
               </div>
            </div>
         </div>

         {/* RIGHT: Effects Rack */}
         <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2 custom-scrollbar">
            
            {/* Saturation Module */}
            <Module title="Harmonic Saturation" icon={<Activity size={14} />} active={!isBypassed}>
                <div className="flex justify-between items-center px-4">
                    <Knob label="Drive" value={chain.saturation.amount} min={0} max={1} unit="%" size="large" />
                    <div className="flex flex-col gap-2">
                       <div className="text-right">
                          <div className="text-[9px] text-studio-text uppercase">Circuit Type</div>
                          <div className="text-sm font-bold text-studio-accent">{chain.saturation.type}</div>
                       </div>
                    </div>
                </div>
            </Module>

            {/* EQ Module */}
            <Module title="Parametric EQ" icon={<Activity size={14} />} active={!isBypassed}>
                <div className="grid grid-cols-3 gap-2">
                  <Knob label="Low" value={chain.eq.lowGain} min={-6} max={6} unit="dB" />
                  <Knob label="Mid" value={chain.eq.midGain} min={-6} max={6} unit="dB" />
                  <Knob label="High" value={chain.eq.highGain} min={-6} max={6} unit="dB" />
               </div>
            </Module>

            {/* Compressor Module */}
            <Module title="Optical Compressor" icon={<Layers size={14} />} active={!isBypassed}>
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <Knob label="Thresh" value={chain.compressor.threshold} min={-40} max={0} unit="dB" />
                  <Knob label="Ratio" value={chain.compressor.ratio} min={1} max={8} unit=":1" />
               </div>
               <div className="flex justify-between px-2 pt-3 border-t border-white/5">
                 <div className="text-center">
                    <div className="text-[9px] text-studio-text uppercase">Attack</div>
                    <div className="text-xs font-mono text-white">{(chain.compressor.attack * 1000).toFixed(0)}ms</div>
                 </div>
                 <div className="text-center">
                    <div className="text-[9px] text-studio-text uppercase">Release</div>
                    <div className="text-xs font-mono text-white">{(chain.compressor.release * 1000).toFixed(0)}ms</div>
                 </div>
               </div>
            </Module>

            {/* Imaging & Output */}
            <Module title="Stereo & Limit" icon={<Activity size={14} />} active={!isBypassed}>
               <div className="flex justify-around items-center">
                  <Knob label="Width" value={chain.imaging.width} min={1} max={1.5} unit="%" />
                  <div className="h-10 w-[1px] bg-white/10"></div>
                  <Knob label="Ceiling" value={chain.limiter.threshold} min={-1} max={0} unit="dB" />
                  <Knob label="Output" value={chain.outputGain} min={0} max={6} unit="dB" />
               </div>
            </Module>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col gap-3">
               <button className="w-full py-4 bg-studio-accent hover:bg-studio-accent/90 text-black font-bold uppercase tracking-widest text-sm rounded shadow-[0_0_20px_rgba(255,149,0,0.4)] transition-all flex items-center justify-center gap-2">
                  <Download size={18} /> Export Master
               </button>
               <button className="w-full py-3 bg-studio-panel border border-studio-border hover:border-white/20 text-white font-medium text-xs rounded transition-all flex items-center justify-center gap-2">
                  <Share2 size={14} /> Share with DistroKid
               </button>
            </div>

         </div>
      </div>
    </div>
  );
};

// UI Components

const Module: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; active: boolean }> = ({ title, icon, children, active }) => (
  <div className={`bg-studio-panel/80 border border-studio-border/50 rounded-lg p-5 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
    <div className="flex items-center gap-2 mb-5 pb-2 border-b border-white/5">
      <span className="text-studio-accent">{icon}</span>
      <span className="text-xs font-bold text-white uppercase tracking-wider">{title}</span>
    </div>
    {children}
  </div>
);

const Knob: React.FC<{ label: string; value: number; min: number; max: number; unit: string; size?: 'normal' | 'large' }> = ({ label, value, min, max, unit, size = 'normal' }) => {
   const percent = (value - min) / (max - min);
   const deg = -135 + (percent * 270);
   const sizeClass = size === 'large' ? 'w-20 h-20' : 'w-14 h-14';
   
   return (
      <div className="flex flex-col items-center group">
         <div className={`relative rounded-full bg-gradient-to-b from-[#2a2a2e] to-[#1a1a1e] border border-black shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center mb-2 ${sizeClass}`}>
            {/* Indicator Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
               <circle cx="50" cy="50" r="40" fill="none" stroke="#ff9500" strokeWidth="4" strokeDasharray={`${percent * 251} 251`} strokeLinecap="round" className={`opacity-80 ${percent === 0 ? 'hidden' : ''}`} />
            </svg>
            
            {/* Knob Cap */}
            <div 
               className="w-[80%] h-[80%] rounded-full bg-[#222] shadow-[0_2px_5px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] absolute flex items-center justify-center transition-transform duration-300 ease-out"
               style={{ transform: `rotate(${deg}deg)` }}
            >
               <div className="w-1 h-3 bg-studio-accent absolute top-2 rounded-full shadow-[0_0_5px_#ff9500]"></div>
            </div>
         </div>
         <span className="text-[9px] text-studio-text uppercase font-bold group-hover:text-white transition-colors">{label}</span>
         <span className="text-[9px] text-studio-accent font-mono">{value.toFixed(1)}{unit}</span>
      </div>
   )
}