import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DrawdownDataPoint {
  time: number;
  drawdown: number;
  timeLabel: string;
}

interface DrawdownChartProps {
  currentTime: number;
  thermalDrawdown: number;
  onDataUpdate?: (data: DrawdownDataPoint[]) => void;
}

export const DrawdownChart: React.FC<DrawdownChartProps> = ({
  currentTime,
  thermalDrawdown,
}) => {
  const [data, setData] = React.useState<DrawdownDataPoint[]>([]);

  React.useEffect(() => {
    setData((prevData) => {
      const years = Math.floor(currentTime / (365 * 24 * 3600));
      const timeLabel = `${years}y`;

      const existingPoint = prevData.find((p) => p.time === years);
      if (existingPoint) {
        return prevData.map((p) =>
          p.time === years ? { ...p, drawdown: thermalDrawdown } : p
        );
      }

      return [...prevData, { time: years, drawdown: thermalDrawdown, timeLabel }];
    });
  }, [currentTime, thermalDrawdown]);

  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      drawdown: parseFloat(d.drawdown.toFixed(2)),
    }));
  }, [data]);

  return (
    <div className="w-full h-64 bg-secondary rounded-lg p-4 border border-border">
      <h3 className="text-sm font-mono font-bold text-accent mb-3">Thermal Drawdown History</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
            <XAxis
              dataKey="timeLabel"
              stroke="#808080"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#808080"
              style={{ fontSize: '12px' }}
              label={{ value: '°C', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333333',
                borderRadius: '4px',
              }}
              labelStyle={{ color: '#e0e0e0' }}
              formatter={(value: number) => [value.toFixed(2), 'Drawdown']}
            />
            <Line
              type="monotone"
              dataKey="drawdown"
              stroke="#00d9ff"
              dot={{ fill: '#00d9ff', r: 4 }}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
          Data will appear as simulation progresses
        </div>
      )}
    </div>
  );
};
