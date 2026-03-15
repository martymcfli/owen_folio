import React, { useState, useEffect } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { DriveMode } from './components/DriveMode';
import { generateTripPlaylist } from './services/geminiService';
import { GeneratedTrip } from './types';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [hasKey, setHasKey] = useState(false);
  const [mode, setMode] = useState<'SETUP' | 'DRIVE'>('SETUP');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vibe, setVibe] = useState('');
  const [musicService, setMusicService] = useState('');
  const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | undefined>(undefined);
  
  // Trip State
  const [tripData, setTripData] = useState<GeneratedTrip | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setHasKey(true);
      } else if (window.aistudio) {
        await window.aistudio.openSelectKey();
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleStartTrip = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const trip = await generateTripPlaylist(
        origin, 
        destination, 
        vibe, 
        musicService || "VibeDrive AI", 
        locationCoords
      );
      setTripData(trip);
      setMode('DRIVE');
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate trip. Ensure your API key has access to Gemini 2.5 Flash.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExitTrip = () => {
    setMode('SETUP');
    setTripData(null);
    // Optional: Keep inputs for quick modification
    // setOrigin('');
    // setDestination('');
    // setVibe('');
  };

  if (!hasKey) {
     return <div className="h-screen bg-slate-950 flex items-center justify-center text-slate-500">Initializing Secure Connection...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-neon-purple/30">
      
      {mode === 'SETUP' && (
        <div className="min-h-screen flex flex-col justify-center relative overflow-hidden">
          {/* Ambient Background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute -top-20 -left-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse"></div>
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-3xl"></div>
          </div>

          <SetupScreen 
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            vibe={vibe}
            setVibe={setVibe}
            musicService={musicService}
            setMusicService={setMusicService}
            setLocationCoords={setLocationCoords}
            onStart={handleStartTrip}
            isLoading={isLoading}
          />
          
          {error && (
            <div className="absolute bottom-10 left-0 right-0 flex justify-center">
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm backdrop-blur-md">
                <AlertCircle size={16} />
                {error}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'DRIVE' && tripData && (
        <DriveMode trip={tripData} onExit={handleExitTrip} />
      )}

    </div>
  );
}