import React from 'react';

export const ScannerOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-xl border border-primary-500/30">
      <div className="absolute inset-0 bg-primary-500/5 mix-blend-overlay"></div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan shadow-[0_0_15px_2px_rgba(34,211,238,0.5)] opacity-50"></div>
      <div className="absolute top-2 right-2 flex space-x-1">
        <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
        <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-75"></div>
        <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  );
};