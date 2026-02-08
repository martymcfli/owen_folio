import React, { useState, useCallback } from 'react';
import { HeatFlowVisualization } from '@/components/HeatFlowVisualization';
import { AdvancedSettings } from '@/components/AdvancedSettings';
import { DrawdownChart } from '@/components/DrawdownChart';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function Home() {
  const [currentTime, setCurrentTime] = useState<number>(365 * 24 * 3600);
  const [heatExtractionRate, setHeatExtractionRate] = useState<number>(50000);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [thermalDrawdown, setThermalDrawdown] = useState<number>(0);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1);
  const [wellboreDepth, setWellboreDepth] = useState<number>(2000);
  const [lateralCount, setLateralCount] = useState<number>(3);
  const [lateralLength, setLateralLength] = useState<number>(500);
  const [thermalConductivity, setThermalConductivity] = useState<number>(2.5);

  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const maxTime = 50 * 365 * 24 * 3600;
        const newTime = prev + 86400 * animationSpeed;
        return newTime > maxTime ? maxTime : newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed]);

  const handleReset = useCallback(() => {
    setCurrentTime(365 * 24 * 3600);
    setIsPlaying(false);
  }, []);

  const formatTime = (seconds: number): string => {
    const years = Math.floor(seconds / (365 * 24 * 3600));
    const days = Math.floor((seconds % (365 * 24 * 3600)) / (24 * 3600));
    return `${years}y ${days}d`;
  };

  const formatDrawdown = (value: number): string => {
    return value.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-full">
          <h1 className="text-3xl font-bold font-mono text-accent">Heat Flow Visualization Tool</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Simulating conduction-only heat extraction from multi-lateral closed-loop geothermal wells
          </p>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-background relative">
          <HeatFlowVisualization
            simulationTime={currentTime}
            heatExtractionRate={heatExtractionRate}
            onDrawdownChange={setThermalDrawdown}
          />

          <div className="absolute top-4 left-4 bg-card/80 backdrop-blur border border-border rounded-lg p-4 text-sm font-mono">
            <div className="text-accent font-bold">Simulation Time</div>
            <div className="text-lg text-foreground">{formatTime(currentTime)}</div>
            <div className="text-muted-foreground text-xs mt-2">
              {Math.floor(currentTime / (365 * 24 * 3600))} years
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-card/80 backdrop-blur border border-border rounded-lg p-4 text-sm font-mono">
            <div className="text-accent font-bold">Thermal Drawdown</div>
            <div className="text-lg text-foreground">{formatDrawdown(thermalDrawdown)}°C</div>
            <div className="text-muted-foreground text-xs mt-2">
              Temperature reduction
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 bg-card/80 backdrop-blur border border-border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant={isPlaying ? 'default' : 'outline'}
                onClick={() => setIsPlaying(!isPlaying)}
                className="gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Play
                  </>
                )}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>

              <div className="flex-1">
                <Slider
                  value={[currentTime]}
                  onValueChange={(value) => setCurrentTime(value[0])}
                  min={0}
                  max={50 * 365 * 24 * 3600}
                  step={86400}
                  className="w-full"
                />
              </div>

              <div className="text-xs text-muted-foreground font-mono">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 bg-card border-l border-border overflow-y-auto flex flex-col">
          <div className="flex-1 p-6 space-y-6">
            <div>
              <label className="block text-sm font-mono font-bold text-accent mb-3">
                Heat Extraction Rate
              </label>
              <div className="space-y-3">
                <Slider
                  value={[heatExtractionRate]}
                  onValueChange={(value) => setHeatExtractionRate(value[0])}
                  min={10000}
                  max={200000}
                  step={5000}
                  className="w-full"
                />
                <div className="text-sm font-mono text-foreground bg-secondary rounded px-3 py-2">
                  {(heatExtractionRate / 1000).toFixed(0)} kW
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Power extracted from the well system
              </p>
            </div>

            <div>
              <label className="block text-sm font-mono font-bold text-accent mb-3">
                Animation Speed
              </label>
              <div className="space-y-3">
                <Slider
                  value={[animationSpeed]}
                  onValueChange={(value) => setAnimationSpeed(value[0])}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-sm font-mono text-foreground bg-secondary rounded px-3 py-2">
                  {animationSpeed.toFixed(1)}x
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Speed of time progression
              </p>
            </div>

            <DrawdownChart
              currentTime={currentTime}
              thermalDrawdown={thermalDrawdown}
            />

            <div className="bg-secondary rounded-lg p-4 border border-border">
              <h3 className="text-sm font-mono font-bold text-accent mb-3">Simulation Stats</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Time:</span>
                  <span className="text-foreground font-mono">{formatTime(currentTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thermal Drawdown:</span>
                  <span className="text-foreground font-mono">{formatDrawdown(thermalDrawdown)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heat Rate:</span>
                  <span className="text-foreground font-mono">{(heatExtractionRate / 1000).toFixed(0)} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wellbore Depth:</span>
                  <span className="text-foreground font-mono">{wellboreDepth} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Laterals:</span>
                  <span className="text-foreground font-mono">{lateralCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary rounded-lg p-4 border border-border">
              <h3 className="text-sm font-mono font-bold text-accent mb-2">About</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This tool visualizes heat extraction from a multi-lateral closed-loop geothermal well using line source theory. 
                The 3D visualization shows the temperature field evolution over time, with thermal drawdown indicating system performance degradation.
              </p>
            </div>

            <AdvancedSettings
              wellboreDepth={wellboreDepth}
              onWellboreDepthChange={setWellboreDepth}
              lateralCount={lateralCount}
              onLateralCountChange={setLateralCount}
              lateralLength={lateralLength}
              onLateralLengthChange={setLateralLength}
              thermalConductivity={thermalConductivity}
              onThermalConductivityChange={setThermalConductivity}
            />
          </div>

          <div className="border-t border-border p-4 text-xs text-muted-foreground text-center">
            <p>Drag to rotate • Scroll to zoom</p>
          </div>
        </div>
      </div>
    </div>
  );
}
