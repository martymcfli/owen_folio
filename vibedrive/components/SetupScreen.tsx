import React, { useState } from 'react';
import { MapPin, Music, Navigation, Loader2, Disc, Radio, Check } from 'lucide-react';

interface Props {
  origin: string;
  setOrigin: (v: string) => void;
  destination: string;
  setDestination: (v: string) => void;
  vibe: string;
  setVibe: (v: string) => void;
  musicService: string;
  setMusicService: (v: string) => void;
  onStart: () => void;
  isLoading: boolean;
  setLocationCoords: (coords: { lat: number; lng: number } | undefined) => void;
}

export const SetupScreen: React.FC<Props> = ({
  origin, setOrigin, destination, setDestination, vibe, setVibe, 
  musicService, setMusicService, onStart, isLoading, setLocationCoords
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [isConnectingService, setIsConnectingService] = useState<string | null>(null);

  const handleCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOrigin("Current Location");
          setLocationCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not fetch location. Please enter manually.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  };

  const handleServiceConnect = (service: string) => {
    if (musicService === service) {
        setMusicService('');
        return;
    }
    setIsConnectingService(service);
    // Simulate API connection delay
    setTimeout(() => {
      setMusicService(service);
      setIsConnectingService(null);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-white to-neon-purple mb-2">
          VibeDrive
        </h1>
        <p className="text-slate-400 text-sm tracking-widest uppercase mb-4">
          Navigation × Soundtrack Sync
        </p>
        <p className="text-slate-500 text-xs italic font-medium">
          "When the soundtrack is perfectly timed, life becomes a movie."
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-8 space-y-6 shadow-2xl shadow-neon-purple/10">
        
        {/* Service Selection */}
        <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-500 uppercase ml-1">Connect Music Account</label>
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => handleServiceConnect('Spotify')}
                    className={`relative overflow-hidden group flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-300
                    ${musicService === 'Spotify' 
                        ? 'bg-[#1DB954]/20 border-[#1DB954] text-[#1DB954]' 
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-[#1DB954]/50 hover:text-[#1DB954]'}`}
                >
                    {isConnectingService === 'Spotify' ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>
                            {musicService === 'Spotify' && <div className="absolute top-1 right-1"><Check size={12} /></div>}
                            <Disc size={18} />
                            <span className="font-semibold text-sm">Spotify</span>
                        </>
                    )}
                </button>

                <button 
                    onClick={() => handleServiceConnect('Apple Music')}
                    className={`relative overflow-hidden group flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-300
                    ${musicService === 'Apple Music' 
                        ? 'bg-[#FA243C]/20 border-[#FA243C] text-[#FA243C]' 
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-[#FA243C]/50 hover:text-[#FA243C]'}`}
                >
                    {isConnectingService === 'Apple Music' ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>
                            {musicService === 'Apple Music' && <div className="absolute top-1 right-1"><Check size={12} /></div>}
                            <Music size={18} />
                            <span className="font-semibold text-sm">Music</span>
                        </>
                    )}
                </button>
            </div>
        </div>

        <hr className="border-slate-800" />

        {/* Route Inputs */}
        <div className="space-y-4 relative">
          {/* Connecting Line */}
          <div className="absolute left-3.5 top-10 bottom-10 w-0.5 bg-gradient-to-b from-neon-cyan to-neon-purple opacity-30"></div>

          <div className="relative group">
            <div className="absolute left-3 top-3.5 w-2 h-2 rounded-full bg-neon-cyan ring-4 ring-cyan-500/20"></div>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Start Location"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan transition-colors"
            />
            <button 
                onClick={handleCurrentLocation}
                className="absolute right-2 top-2 p-1.5 text-slate-500 hover:text-neon-cyan hover:bg-cyan-500/10 rounded-lg transition-colors"
                title="Use Current Location"
            >
                {isLocating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
            </button>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-3.5 w-2 h-2 rounded-full bg-neon-purple ring-4 ring-purple-500/20"></div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-neon-purple transition-colors"
            />
          </div>
        </div>

        {/* Vibe Input */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Soundtrack Vibe</label>
          <div className="relative">
            <Radio className="absolute left-3 top-3 text-slate-500" size={18} />
            <input
              type="text"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="e.g. Sunset Drive, 90s Hip Hop, Cinematic"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onStart}
          disabled={isLoading || !origin || !destination || !vibe}
          className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all shadow-lg
            ${isLoading || !origin || !destination || !vibe
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90 text-white shadow-neon-purple/25'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" /> Syncing Route...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Navigation size={20} fill="currentColor" /> Start Drive
            </span>
          )}
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-slate-600">
        <p>Powered by Gemini 2.5 Flash & Google Maps</p>
      </div>
    </div>
  );
};