import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdvancedSettingsProps {
  wellboreDepth: number;
  onWellboreDepthChange: (value: number) => void;
  lateralCount: number;
  onLateralCountChange: (value: number) => void;
  lateralLength: number;
  onLateralLengthChange: (value: number) => void;
  thermalConductivity: number;
  onThermalConductivityChange: (value: number) => void;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  wellboreDepth,
  onWellboreDepthChange,
  lateralCount,
  onLateralCountChange,
  lateralLength,
  onLateralLengthChange,
  thermalConductivity,
  onThermalConductivityChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-border pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-sm font-mono font-bold text-accent hover:text-accent/80 transition-colors"
      >
        <span>Advanced Settings</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Wellbore Depth */}
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-2">
              Wellbore Depth
            </label>
            <div className="space-y-2">
              <Slider
                value={[wellboreDepth]}
                onValueChange={(value) => onWellboreDepthChange(value[0])}
                min={1000}
                max={5000}
                step={100}
                className="w-full"
              />
              <div className="text-xs font-mono text-foreground bg-secondary rounded px-2 py-1">
                {wellboreDepth} m
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
                value={[lateralCount]}
                onValueChange={(value) => onLateralCountChange(value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="text-xs font-mono text-foreground bg-secondary rounded px-2 py-1">
                {lateralCount} laterals
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
                value={[lateralLength]}
                onValueChange={(value) => onLateralLengthChange(value[0])}
                min={100}
                max={1000}
                step={50}
                className="w-full"
              />
              <div className="text-xs font-mono text-foreground bg-secondary rounded px-2 py-1">
                {lateralLength} m
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
                value={[thermalConductivity]}
                onValueChange={(value) => onThermalConductivityChange(value[0])}
                min={1}
                max={5}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs font-mono text-foreground bg-secondary rounded px-2 py-1">
                {thermalConductivity.toFixed(1)} W/(m·K)
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-secondary/50 rounded p-2 text-xs text-muted-foreground">
            <p>
              These parameters affect the heat transfer simulation. Increasing wellbore depth or lateral length increases the heat exchange surface area.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
