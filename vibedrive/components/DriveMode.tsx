import React, { useState, useEffect, useRef } from 'react';
import { GeneratedTrip, Track } from '../types';
import { Play, Pause, SkipForward, MapPin, Disc, CheckCircle } from 'lucide-react';

interface Props {
  trip: GeneratedTrip;
  onExit: () => void;
}

export const DriveMode: React.FC<Props> = ({ trip, onExit }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0); // Seconds into current song
  const [tripElapsed, setTripElapsed] = useState(0); // Seconds into total trip
  const [isArrived, setIsArrived] = useState(false);
  
  const tripDurationSeconds = useRef(trip.context.estimatedDurationMinutes * 60).current;
  const currentTrack = trip.playlist[currentTrackIndex];

  // Simulation Timer
  useEffect(() => {
    // Fixed: Changed from NodeJS.Timeout to any to avoid missing types in browser environment
    let interval: any;
    if (isPlaying && !isArrived) {
      interval = setInterval(() => {
        setTrackProgress(prev => {
          if (prev >= currentTrack.durationSeconds) {
            // Next song
            if (currentTrackIndex < trip.playlist.length - 1) {
              setCurrentTrackIndex(i => i + 1);
              return 0;
            } else {
              // End of playlist
              setIsArrived(true);
              setIsPlaying(false);
              return prev;
            }
          }
          return prev + 1;
        });

        setTripElapsed(prev => {
            if (prev >= tripDurationSeconds) {
                setIsArrived(true);
                setIsPlaying(false);
                return tripDurationSeconds;
            }
            return prev + 1;
        });

      }, 1000); // 1s real time = 1s sim time. For demo, we might speed this up, but real-time is requested.
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIndex, currentTrack, trip.playlist.length, isArrived, tripDurationSeconds]);

  // Start simulation automatically
  useEffect(() => {
    const timer = setTimeout(() => setIsPlaying(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const tripProgressPercent = Math.min((tripElapsed / tripDurationSeconds) * 100, 100);
  const remainingTripSeconds = Math.max(tripDurationSeconds - tripElapsed, 0);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-slate-950">
      
      {/* Background Visuals */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[100px] transition-all duration-1000 ${isPlaying ? 'scale-110 opacity-30' : 'scale-100 opacity-10'}`}></div>
        <div className={`absolute bottom-0 right-0 w-[400px] h-[400px] bg-neon-cyan/10 rounded-full blur-[80px] transition-all duration-1000 delay-300 ${isPlaying ? 'scale-125' : 'scale-100'}`}></div>
      </div>

      {/* Header / Trip Info */}
      <div className="relative z-10 p-6 flex justify-between items-start bg-gradient-to-b from-slate-950/90 to-transparent">
        <div>
          <div className="flex items-center gap-2 text-neon-cyan mb-1">
            <MapPin size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Navigating To</span>
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight">{trip.context.destinationDetails?.name || trip.context.destination}</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xs">{trip.context.destinationDetails?.summary}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-white tabular-nums">
             {Math.ceil(remainingTripSeconds / 60)}
          </div>
          <div className="text-xs text-slate-500 uppercase font-bold">Min Arrival</div>
        </div>
      </div>

      {/* Main Content - Player */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
        
        {/* Album Art / Visualizer */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-10 group">
           {/* Glow */}
           <div className={`absolute -inset-4 bg-gradient-to-tr from-neon-cyan to-neon-purple rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity ${isPlaying ? 'animate-pulse-slow' : ''}`}></div>
           
           {/* Disc */}
           <div className={`relative w-full h-full bg-slate-900 rounded-full border-8 border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-50"></div>
              <div className="w-1/3 h-1/3 bg-slate-950 rounded-full border border-slate-700 z-10 flex items-center justify-center">
                 <Disc className="text-slate-600" size={32} />
              </div>
           </div>
        </div>

        {/* Track Info */}
        <div className="text-center mb-8">
           <h3 className="text-2xl font-bold text-white mb-2">{currentTrack.title}</h3>
           <p className="text-neon-cyan text-lg">{currentTrack.artist}</p>
           <p className="text-xs text-slate-500 mt-2 italic">"{currentTrack.reasoning}"</p>
        </div>

        {/* Sync Progress Bar */}
        <div className="w-full max-w-xl space-y-2">
           <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>{formatTime(trackProgress)}</span>
              <span>{formatTime(currentTrack.durationSeconds)}</span>
           </div>
           
           <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
              {/* Song Progress */}
              <div 
                className="absolute top-0 left-0 h-full bg-white/20 transition-all duration-1000 ease-linear"
                style={{ width: `${(trackProgress / currentTrack.durationSeconds) * 100}%` }}
              ></div>
              
              {/* Trip Sync Marker (The "Ghost" bar) */}
              <div className="absolute top-0 left-0 w-1 h-full bg-neon-purple blur-[2px]"></div>
           </div>

           <div className="flex justify-between items-center text-[10px] text-slate-600 uppercase tracking-widest mt-4">
              <span>Playlist Sync</span>
              <span className={tripProgressPercent > 95 ? 'text-neon-purple' : 'text-slate-500'}>
                 {tripProgressPercent.toFixed(0)}% to Destination
              </span>
           </div>
           
           {/* Master Trip Progress */}
           <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden mt-1">
              <div 
                 className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-1000 ease-linear"
                 style={{ width: `${tripProgressPercent}%` }}
              ></div>
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 p-8 pb-12 flex justify-center items-center gap-8">
        <button 
          onClick={onExit}
          className="text-slate-500 hover:text-white transition-colors text-xs uppercase font-bold"
        >
          End Trip
        </button>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 rounded-full bg-white text-slate-950 flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/20"
        >
          {isArrived ? <CheckCircle size={32} /> : isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        
        <button 
          onClick={() => {
            if(currentTrackIndex < trip.playlist.length -1) {
              setCurrentTrackIndex(p => p+1);
              setTrackProgress(0);
            }
          }}
          className="text-white hover:text-neon-cyan transition-colors"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Arrival Overlay */}
      {isArrived && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-1000">
           <div className="text-center">
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple mb-4">
                ARRIVED
              </h2>
              <p className="text-white text-xl">Perfect Timing.</p>
              <button onClick={onExit} className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-bold transition-colors">
                New Trip
              </button>
           </div>
        </div>
      )}

    </div>
  );
};