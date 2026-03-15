import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ContentEngine } from './components/ContentEngine';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'engine' | 'analytics'>('dashboard');

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'engine' && <ContentEngine />}
      
      {/* Analytics view reuses Dashboard for demo purposes, but in a real app would be deeper drill-downs */}
      {activeTab === 'analytics' && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <span className="text-2xl">🚧</span>
             </div>
             <h2 className="text-2xl font-bold text-white">Deep Analytics Module</h2>
             <p className="text-gray-400 max-w-md">
                This module connects to real-time social listening APIs and media monitoring tools to provide granular sentiment analysis over time.
             </p>
             <button 
                onClick={() => setActiveTab('dashboard')}
                className="mt-4 px-6 py-2 bg-chime-green text-[#1C1E23] font-bold rounded hover:bg-opacity-90"
             >
                Return to Dashboard
             </button>
        </div>
      )}
    </Layout>
  );
}

export default App;