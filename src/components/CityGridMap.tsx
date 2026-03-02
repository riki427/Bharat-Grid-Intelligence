import { useState, useMemo } from 'react';
import { TelemetryData } from '@/hooks/useTelemetry';

const healthColor = {
  healthy: 'hsl(145, 70%, 45%)',
  warning: 'hsl(38, 95%, 55%)',
  critical: 'hsl(0, 80%, 55%)',
};

// City feeder layout - simulated positions in a grid-like city network
const feederPositions: Record<string, { x: number; y: number }> = {
  'Feeder F-01': { x: 120, y: 80 },
  'Feeder F-02': { x: 280, y: 70 },
  'Feeder F-03': { x: 420, y: 110 },
  'Feeder F-04': { x: 100, y: 220 },
  'Feeder F-05': { x: 260, y: 200 },
  'Feeder F-06': { x: 400, y: 250 },
  'Feeder F-07': { x: 180, y: 340 },
  'Feeder F-08': { x: 350, y: 360 },
};

const feederLinks: [string, string][] = [
  ['Feeder F-01', 'Feeder F-02'],
  ['Feeder F-02', 'Feeder F-03'],
  ['Feeder F-01', 'Feeder F-04'],
  ['Feeder F-04', 'Feeder F-05'],
  ['Feeder F-02', 'Feeder F-05'],
  ['Feeder F-05', 'Feeder F-06'],
  ['Feeder F-03', 'Feeder F-06'],
  ['Feeder F-04', 'Feeder F-07'],
  ['Feeder F-05', 'Feeder F-07'],
  ['Feeder F-05', 'Feeder F-08'],
  ['Feeder F-06', 'Feeder F-08'],
  ['Feeder F-07', 'Feeder F-08'],
];

// Road-like blocks for city background
const cityBlocks = [
  { x: 50, y: 30, w: 180, h: 120 },
  { x: 240, y: 20, w: 140, h: 100 },
  { x: 390, y: 50, w: 120, h: 130 },
  { x: 60, y: 170, w: 160, h: 120 },
  { x: 230, y: 150, w: 130, h: 110 },
  { x: 370, y: 200, w: 140, h: 120 },
  { x: 120, y: 310, w: 140, h: 90 },
  { x: 280, y: 310, w: 150, h: 100 },
];

interface CityMapProps {
  feederData: TelemetryData[];
}

export function CityGridMap({ feederData }: CityMapProps) {
  const [hoveredFeeder, setHoveredFeeder] = useState<string | null>(null);

  const dataMap = useMemo(() => {
    const map: Record<string, TelemetryData> = {};
    feederData.forEach(d => { map[d.name] = d; });
    return map;
  }, [feederData]);

  const hoveredData = hoveredFeeder ? dataMap[hoveredFeeder] : null;

  return (
    <div className="scada-panel relative">
      <h3 className="text-sm font-semibold text-foreground mb-2">City Feeder Network</h3>
      <svg viewBox="0 0 520 440" className="w-full max-h-[400px]">
        {/* Background grid */}
        {Array.from({ length: 27 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 17} x2="520" y2={i * 17} stroke="hsl(222, 30%, 10%)" strokeWidth={0.3} />
        ))}
        {Array.from({ length: 31 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 17} y1="0" x2={i * 17} y2="440" stroke="hsl(222, 30%, 10%)" strokeWidth={0.3} />
        ))}

        {/* City blocks */}
        {cityBlocks.map((block, i) => (
          <rect
            key={`block-${i}`}
            x={block.x} y={block.y}
            width={block.w} height={block.h}
            rx={4}
            fill="hsl(222, 30%, 8%)"
            stroke="hsl(222, 30%, 14%)"
            strokeWidth={0.5}
          />
        ))}

        {/* Feeder connection lines */}
        {feederLinks.map(([from, to], i) => {
          const p1 = feederPositions[from];
          const p2 = feederPositions[to];
          if (!p1 || !p2) return null;
          const d1 = dataMap[from];
          const d2 = dataMap[to];
          const lineHealth = d1?.health === 'critical' || d2?.health === 'critical' ? 'critical' :
            d1?.health === 'warning' || d2?.health === 'warning' ? 'warning' : 'healthy';
          const isHovered = hoveredFeeder === from || hoveredFeeder === to;
          return (
            <line
              key={`link-${i}`}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={healthColor[lineHealth]}
              strokeWidth={isHovered ? 2 : 1}
              strokeDasharray={isHovered ? 'none' : '6 3'}
              opacity={isHovered ? 0.8 : 0.3}
            />
          );
        })}

        {/* Feeder nodes */}
        {feederData.map(feeder => {
          const pos = feederPositions[feeder.name];
          if (!pos) return null;
          const isHovered = hoveredFeeder === feeder.name;
          return (
            <g
              key={feeder.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredFeeder(feeder.name)}
              onMouseLeave={() => setHoveredFeeder(null)}
            >
              {/* Glow circle */}
              <circle
                cx={pos.x} cy={pos.y} r={isHovered ? 22 : 16}
                fill={healthColor[feeder.health]}
                opacity={isHovered ? 0.15 : 0.08}
              />
              {/* Inner circle */}
              <circle
                cx={pos.x} cy={pos.y} r={isHovered ? 8 : 6}
                fill={healthColor[feeder.health]}
                className={feeder.health === 'critical' ? 'animate-pulse-subtle' : ''}
                style={{ filter: `drop-shadow(0 0 ${isHovered ? 8 : 4}px ${healthColor[feeder.health]})` }}
              />
              {/* Transformer icon */}
              <rect
                x={pos.x - 3} y={pos.y - 3} width={6} height={6}
                fill="none"
                stroke={isHovered ? 'hsl(200, 20%, 90%)' : healthColor[feeder.health]}
                strokeWidth={0.8}
                rx={1}
              />
              {/* Label */}
              <text
                x={pos.x} y={pos.y - 14}
                textAnchor="middle"
                style={{
                  fontSize: isHovered ? '9px' : '7px',
                  fill: isHovered ? 'hsl(200, 20%, 90%)' : 'hsl(215, 15%, 50%)',
                  fontFamily: 'JetBrains Mono',
                  fontWeight: isHovered ? 600 : 400,
                }}
              >
                {feeder.name}
              </text>
              {/* Load value */}
              <text
                x={pos.x} y={pos.y + 22}
                textAnchor="middle"
                style={{
                  fontSize: '7px',
                  fill: healthColor[feeder.health],
                  fontFamily: 'JetBrains Mono',
                }}
              >
                {feeder.load.toFixed(0)}MW / {feeder.voltage.toFixed(0)}V
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover detail panel */}
      {hoveredData && (
        <div className="absolute bottom-12 right-4 bg-card border border-border rounded-lg p-3 shadow-lg z-10">
          <p className="text-xs font-semibold text-foreground">{hoveredData.name}</p>
          <div className="text-[10px] font-mono text-muted-foreground space-y-0.5 mt-1 grid grid-cols-2 gap-x-4">
            <p>Load: <span className="text-primary">{hoveredData.load.toFixed(1)} MW</span></p>
            <p>Cap: <span className="text-foreground">{hoveredData.capacity.toFixed(0)} MW</span></p>
            <p>Voltage: <span className="text-foreground">{hoveredData.voltage.toFixed(1)} V</span></p>
            <p>Freq: <span className="text-foreground">{hoveredData.frequency.toFixed(2)} Hz</span></p>
            <p>Temp: <span className={hoveredData.temperature > 70 ? 'text-warning' : 'text-foreground'}>{hoveredData.temperature.toFixed(1)}°C</span></p>
            <p>Health: <span className={`text-${hoveredData.health === 'healthy' ? 'success' : hoveredData.health}`}>{hoveredData.health.toUpperCase()}</span></p>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-2 text-[10px] font-mono text-muted-foreground justify-center">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Healthy</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Warning</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-critical" /> Critical</span>
        <span className="flex items-center gap-1">--- Feeder Lines</span>
      </div>
    </div>
  );
}
