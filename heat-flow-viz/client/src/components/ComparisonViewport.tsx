import React, { useState } from 'react';
import { HeatFlowVisualization } from '@/components/HeatFlowVisualization';
import { useComparison } from '@/contexts/ComparisonContext';

interface ComparisonViewportProps {
  currentTime: number;
  animationSpeed: number;
}

export const ComparisonViewport: React.FC<ComparisonViewportProps> = ({
  currentTime,
  animationSpeed,
}) => {
  const { scenario1, scenario2, syncTime } = useComparison();
  const [drawdown1, setDrawdown1] = useState<number>(0);
  const [drawdown2, setDrawdown2] = useState<number>(0);

  // If sync time is enabled, use the same time for both. Otherwise, they can drift.
  const time1 = currentTime;
  const time2 = syncTime ? currentTime : currentTime;

  const formatTime = (seconds: number): string => {
    const years = Math.floor(seconds / (365 * 24 * 3600));
    const days = Math.floor((seconds % (365 * 24 * 3600)) / (24 * 3600));
    return `${years}y ${days}d`;
  };

  const formatDrawdown = (value: number): string => {
    return value.toFixed(2);
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Scenario 1 */}
      <div className="relative bg-background rounded-lg overflow-hidden border border-blue-900/50">
        <div className="absolute inset-0">
          <HeatFlowVisualization
            simulationTime={time1}
            heatExtractionRate={scenario1.heatExtractionRate}
            onDrawdownChange={setDrawdown1}
          />
        </div>

        {/* Scenario 1 Labels */}
        <div className="absolute top-4 left-4 bg-card/80 backdrop-blur border border-blue-900/50 rounded-lg p-3 text-xs font-mono z-10">
          <div className="text-blue-400 font-bold">{scenario1.name}</div>
          <div className="text-foreground text-xs mt-1">
            {scenario1.lateralCount}L × {scenario1.lateralLength}m
          </div>
          <div className="text-foreground text-xs">
            {(scenario1.heatExtractionRate / 1000).toFixed(0)} kW
          </div>
        </div>

        <div className="absolute top-4 right-4 bg-card/80 backdrop-blur border border-blue-900/50 rounded-lg p-3 text-xs font-mono z-10">
          <div className="text-blue-400 font-bold">Time</div>
          <div className="text-foreground text-sm">{formatTime(time1)}</div>
        </div>

        <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur border border-blue-900/50 rounded-lg p-3 text-xs font-mono z-10">
          <div className="text-blue-400 font-bold">Drawdown</div>
          <div className="text-foreground text-sm">{formatDrawdown(drawdown1)}°C</div>
        </div>
      </div>

      {/* Scenario 2 */}
      <div className="relative bg-background rounded-lg overflow-hidden border border-orange-900/50">
        <div className="absolute inset-0">
          <HeatFlowVisualization
            simulationTime={time2}
            heatExtractionRate={scenario2.heatExtractionRate}
            onDrawdownChange={setDrawdown2}
          />
        </div>

        {/* Scenario 2 Labels */}
        <div className="absolute top-4 left-4 bg-card/80 backdrop-blur border border-orange-900/50 rounded-lg p-3 text-xs font-mono z-10">
          <div className="text-orange-400 font-bold">{scenario2.name}</div>
          <div className="text-foreground text-xs mt-1">
            {scenario2.lateralCount}L × {scenario2.lateralLength}m
          </div>
          <div className="text-foreground text-xs">
            {(scenario2.heatExtractionRate / 1000).toFixed(0)} kW
          </div>
        </div>

        <div className="absolute top-4 right-4 bg-card/80 backdrop-blur border border-orange-900/50 rounded-lg p-3 text-xs font-mono z-10">
          <div className="text-orange-400 font-bold">Time</div>
          <div className="text-foreground text-sm">{formatTime(time2)}</div>
        </div>

        <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur border border-orange-900/50 rounded-lg p-3 text-xs font-mono z-10">
          <div className="text-orange-400 font-bold">Drawdown</div>
          <div className="text-foreground text-sm">{formatDrawdown(drawdown2)}°C</div>
        </div>
      </div>

      {/* Comparison Summary */}
      <div className="absolute bottom-4 left-4 right-4 bg-card/80 backdrop-blur border border-border rounded-lg p-4 z-20">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-muted-foreground mb-1">Drawdown Diff</div>
            <div className={`font-mono font-bold ${drawdown1 > drawdown2 ? 'text-red-400' : 'text-green-400'}`}>
              {formatDrawdown(Math.abs(drawdown1 - drawdown2))}°C
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Better Performance</div>
            <div className="font-mono font-bold text-accent">
              {drawdown1 < drawdown2 ? 'Scenario 1' : drawdown2 < drawdown1 ? 'Scenario 2' : 'Equal'}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Efficiency Ratio</div>
            <div className="font-mono font-bold text-accent">
              {(scenario1.heatExtractionRate / scenario2.heatExtractionRate).toFixed(2)}x
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
