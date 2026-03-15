import React, { useState } from 'react';
import { ScenarioConfig, useComparison } from '@/contexts/ComparisonContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, Save, RotateCcw } from 'lucide-react';

interface ScenarioEditorProps {
  scenario: ScenarioConfig;
  target: 'scenario1' | 'scenario2';
  onUpdate: (config: ScenarioConfig) => void;
}

export const ScenarioEditor: React.FC<ScenarioEditorProps> = ({ scenario, target, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { saveScenario } = useComparison();

  const handleNameChange = (name: string) => {
    onUpdate({ ...scenario, name });
  };

  const handleDepthChange = (depth: number) => {
    onUpdate({ ...scenario, wellboreDepth: depth });
  };

  const handleLateralCountChange = (count: number) => {
    onUpdate({ ...scenario, lateralCount: count });
  };

  const handleLateralLengthChange = (length: number) => {
    onUpdate({ ...scenario, lateralLength: length });
  };

  const handleConductivityChange = (conductivity: number) => {
    onUpdate({ ...scenario, thermalConductivity: conductivity });
  };

  const handleHeatRateChange = (rate: number) => {
    onUpdate({ ...scenario, heatExtractionRate: rate });
  };

  const handleSave = () => {
    saveScenario(scenario);
  };

  const scenarioLabel = target === 'scenario1' ? 'Scenario 1' : 'Scenario 2';
  const bgColor = target === 'scenario1' ? 'bg-blue-950/20' : 'bg-orange-950/20';
  const borderColor = target === 'scenario1' ? 'border-blue-900/50' : 'border-orange-900/50';
  const accentColor = target === 'scenario1' ? 'text-blue-400' : 'text-orange-400';

  return (
    <div className={`border ${borderColor} rounded-lg p-4 ${bgColor}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-3"
      >
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${target === 'scenario1' ? 'bg-blue-400' : 'bg-orange-400'}`} />
          <span className={`text-sm font-mono font-bold ${accentColor}`}>{scenarioLabel}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {/* Scenario Name */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-2">Name</label>
            <Input
              value={scenario.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="text-xs"
              placeholder="Scenario name"
            />
          </div>

          {/* Wellbore Depth */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-2">
              Wellbore Depth
            </label>
            <div className="space-y-2">
              <Slider
                value={[scenario.wellboreDepth]}
                onValueChange={(value) => handleDepthChange(value[0])}
                min={1000}
                max={5000}
                step={100}
                className="w-full"
              />
              <div className="text-xs font-mono text-foreground bg-secondary rounded px-2 py-1">
                {scenario.wellboreDepth} m
              </div>
            </div>
          </div>

          {/* Number of Laterals */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-2">
              Number of Laterals
            </label>
            <div className="space-y-2">
              <Slider
                value={[scenario.lateralCount]}
                onValueChange={(value) => handleLateralCountChange(value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="text-xs font-mono text-foreground bg-secondary rounded px-2 py-1">
                {scenario.lateralCount} laterals
              </div>
            </div>
          </div>

          {/* Lateral Length */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-2">
              Lateral Length
            </label>
            <div className="space-y-2">
              <Slider
                value={[scenario.lateralLength]}
                onValueChange={(value) => handleLateralLengthChange(value[0])}
                min={100}
                max={1000}
                step={50}
                className="w-full"
              />
              <div className="text-xs font-mono text-foreground bg-secondary rounded px-2 py-1">
                {scenario.lateralLength} m
              </div>
            </div>
          </div>

          {/* Thermal Conductivity */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-2">
              Rock Thermal Conductivity
            </label>
            <div className="space-y-2">
              <Slider
                value={[scenario.thermalConductivity]}
                onValueChange={(value) => handleConductivityChange(value[0])}
                min={1}
                max={5}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs font-mono text-foreground bg-secondary rounded px-2 py-1">
                {scenario.thermalConductivity.toFixed(1)} W/(m·K)
              </div>
            </div>
          </div>

          {/* Heat Extraction Rate */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-2">
              Heat Extraction Rate
            </label>
            <div className="space-y-2">
              <Slider
                value={[scenario.heatExtractionRate]}
                onValueChange={(value) => handleHeatRateChange(value[0])}
                min={10000}
                max={200000}
                step={5000}
                className="w-full"
              />
              <div className="text-xs font-mono text-foreground bg-secondary rounded px-2 py-1">
                {(scenario.heatExtractionRate / 1000).toFixed(0)} kW
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSave}
              className="gap-2 text-xs flex-1"
            >
              <Save className="w-3 h-3" />
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
