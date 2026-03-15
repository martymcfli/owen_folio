import React from 'react';
import { useComparison } from '@/contexts/ComparisonContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Copy, Zap } from 'lucide-react';

export const ComparisonModeToggle: React.FC = () => {
  const { comparisonMode, setComparisonMode, syncTime, setSyncTime, scenario1, scenario2 } =
    useComparison();

  const handleDuplicate = () => {
    // Duplicate scenario1 to scenario2
    setComparisonMode(true);
  };

  return (
    <div className="border-t border-border pt-4">
      <div className="space-y-4">
        {/* Main Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <Label htmlFor="comparison-mode" className="text-sm font-mono font-bold text-accent">
              Comparison Mode
            </Label>
          </div>
          <Switch
            id="comparison-mode"
            checked={comparisonMode}
            onCheckedChange={setComparisonMode}
          />
        </div>

        {comparisonMode && (
          <>
            {/* Sync Time Toggle */}
            <div className="flex items-center justify-between pl-6">
              <Label htmlFor="sync-time" className="text-xs font-mono text-muted-foreground">
                Sync Time
              </Label>
              <Switch id="sync-time" checked={syncTime} onCheckedChange={setSyncTime} />
            </div>

            {/* Scenario Info */}
            <div className="pl-6 space-y-2 text-xs">
              <div className="bg-secondary rounded p-2">
                <div className="text-accent font-mono font-bold mb-1">Scenario 1</div>
                <div className="text-muted-foreground">{scenario1.name}</div>
                <div className="text-foreground text-xs mt-1">
                  {scenario1.lateralCount} laterals × {scenario1.lateralLength}m @ {(scenario1.heatExtractionRate / 1000).toFixed(0)} kW
                </div>
              </div>

              <div className="bg-secondary rounded p-2">
                <div className="text-accent font-mono font-bold mb-1">Scenario 2</div>
                <div className="text-muted-foreground">{scenario2.name}</div>
                <div className="text-foreground text-xs mt-1">
                  {scenario2.lateralCount} laterals × {scenario2.lateralLength}m @ {(scenario2.heatExtractionRate / 1000).toFixed(0)} kW
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pl-6 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDuplicate}
                className="gap-2 text-xs"
              >
                <Copy className="w-3 h-3" />
                Duplicate S1→S2
              </Button>
            </div>

            {/* Info */}
            <div className="pl-6 bg-secondary/50 rounded p-2 text-xs text-muted-foreground">
              <p>
                Compare two wellbore configurations side-by-side. Enable "Sync Time" to advance both
                scenarios together.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
