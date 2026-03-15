import React, { createContext, useContext, useState } from 'react';

export interface ScenarioConfig {
  id: string;
  name: string;
  wellboreDepth: number;
  lateralCount: number;
  lateralLength: number;
  thermalConductivity: number;
  heatExtractionRate: number;
}

interface ComparisonContextType {
  comparisonMode: boolean;
  setComparisonMode: (enabled: boolean) => void;
  scenario1: ScenarioConfig;
  setScenario1: (config: ScenarioConfig) => void;
  scenario2: ScenarioConfig;
  setScenario2: (config: ScenarioConfig) => void;
  syncTime: boolean;
  setSyncTime: (sync: boolean) => void;
  savedScenarios: ScenarioConfig[];
  saveScenario: (config: ScenarioConfig) => void;
  deleteScenario: (id: string) => void;
  loadScenario: (id: string, target: 'scenario1' | 'scenario2') => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparisonMode, setComparisonMode] = useState(false);
  const [syncTime, setSyncTime] = useState(true);

  const defaultScenario1: ScenarioConfig = {
    id: 'default-1',
    name: 'Scenario 1 - Conservative',
    wellboreDepth: 2000,
    lateralCount: 3,
    lateralLength: 500,
    thermalConductivity: 2.5,
    heatExtractionRate: 50000,
  };

  const defaultScenario2: ScenarioConfig = {
    id: 'default-2',
    name: 'Scenario 2 - Aggressive',
    wellboreDepth: 3000,
    lateralCount: 5,
    lateralLength: 700,
    thermalConductivity: 2.5,
    heatExtractionRate: 100000,
  };

  const [scenario1, setScenario1] = useState<ScenarioConfig>(defaultScenario1);
  const [scenario2, setScenario2] = useState<ScenarioConfig>(defaultScenario2);

  const [savedScenarios, setSavedScenarios] = useState<ScenarioConfig[]>([
    defaultScenario1,
    defaultScenario2,
  ]);

  const saveScenario = (config: ScenarioConfig) => {
    const existingIndex = savedScenarios.findIndex((s) => s.id === config.id);
    if (existingIndex >= 0) {
      const updated = [...savedScenarios];
      updated[existingIndex] = config;
      setSavedScenarios(updated);
    } else {
      setSavedScenarios([...savedScenarios, config]);
    }
  };

  const deleteScenario = (id: string) => {
    setSavedScenarios(savedScenarios.filter((s) => s.id !== id));
  };

  const loadScenario = (id: string, target: 'scenario1' | 'scenario2') => {
    const scenario = savedScenarios.find((s) => s.id === id);
    if (scenario) {
      if (target === 'scenario1') {
        setScenario1(scenario);
      } else {
        setScenario2(scenario);
      }
    }
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonMode,
        setComparisonMode,
        scenario1,
        setScenario1,
        scenario2,
        setScenario2,
        syncTime,
        setSyncTime,
        savedScenarios,
        saveScenario,
        deleteScenario,
        loadScenario,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
};
