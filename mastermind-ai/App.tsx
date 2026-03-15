import React, { useState, useEffect } from 'react';
import { UploadScreen } from './components/UploadScreen';
import { MasteringStudio } from './components/MasteringStudio';
import { generateMasteringChain } from './services/geminiService';
import { MasteringChain, DefaultChain, AudioFile } from './types';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [hasKey, setHasKey] = useState(false);
  const [view, setView] = useState<'UPLOAD' | 'STUDIO'>('UPLOAD');
  const [isLoading, setIsLoading] = useState(false);
  
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [activeChain, setActiveChain] = useState<MasteringChain>(DefaultChain);

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

  const handleUpload = async (file: File, genre: string, vibe: string) => {
    setIsLoading(true);
    try {
      // 1. Generate Chain Params from AI
      const chain = await generateMasteringChain(file.name, genre, vibe);
      setActiveFile(file);
      setActiveChain(chain);
      setView('STUDIO');
    } catch (err) {
      console.error(err);
      alert("AI Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setView('UPLOAD');
    setActiveFile(null);
    setActiveChain(DefaultChain);
  };

  if (!hasKey) {
     return <div className="h-screen bg-[#121214] flex items-center justify-center text-[#e1e1e6] font-mono">INITIALIZING SYSTEM...</div>;
  }

  return (
    <div className="min-h-screen bg-studio-bg text-studio-text font-sans selection:bg-studio-accent/30">
      
      {view === 'UPLOAD' && (
        <UploadScreen onUpload={handleUpload} isLoading={isLoading} />
      )}

      {view === 'STUDIO' && activeFile && (
        <MasteringStudio 
          file={activeFile} 
          chain={activeChain} 
          onReset={handleReset} 
        />
      )}

    </div>
  );
}