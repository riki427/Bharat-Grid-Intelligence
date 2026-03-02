import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { TelemetryData } from '@/hooks/useTelemetry';

const MAHARASHTRA_TOPO = '/maharashtra-topo.json';

const healthColor = {
  healthy: 'hsl(145, 70%, 45%)',
  warning: 'hsl(38, 95%, 55%)',
  critical: 'hsl(0, 80%, 55%)',
};

// Simulated substation locations within Maharashtra
const substationLocations: Record<string, [number, number]> = {
  'Substation Alpha': [73.8, 19.1],
  'Substation Beta': [75.3, 19.9],
  'Substation Gamma': [76.5, 20.5],
  'Substation Delta': [78.0, 19.3],
  'Substation Epsilon': [74.6, 18.5],
  'Substation Zeta': [77.2, 21.1],
};

// Simulated feeder connections
const feederConnections: [string, string][] = [
  ['Substation Alpha', 'Substation Beta'],
  ['Substation Beta', 'Substation Gamma'],
  ['Substation Gamma', 'Substation Delta'],
  ['Substation Alpha', 'Substation Epsilon'],
  ['Substation Delta', 'Substation Zeta'],
  ['Substation Gamma', 'Substation Zeta'],
];

interface StateMapProps {
  substationData: TelemetryData[];
  stateId: string;
}

export function StateGridMap({ substationData }: StateMapProps) {
  const [tooltip, setTooltip] = useState<{ name: string; data: TelemetryData; x: number; y: number } | null>(null);

  const dataMap = useMemo(() => {
    const map: Record<string, TelemetryData> = {};
    substationData.forEach(d => { map[d.name] = d; });
    return map;
  }, [substationData]);

  return (
    <div className="scada-panel relative">
      <h3 className="text-sm font-semibold text-foreground mb-2">State Grid — Substations & Feeders</h3>
      <div className="relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 5000, center: [76, 19.5] }}
          width={600}
          height={500}
          style={{ width: '100%', height: 'auto', maxHeight: '420px' }}
        >
          <ZoomableGroup center={[76, 19.5]} zoom={1}>
            <Geographies geography={MAHARASHTRA_TOPO}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(222, 30%, 10%)"
                    stroke="hsl(222, 30%, 20%)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: 'hsl(222, 30%, 14%)', outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Feeder connections */}
            {feederConnections.map(([from, to], i) => {
              const fromPos = substationLocations[from];
              const toPos = substationLocations[to];
              if (!fromPos || !toPos) return null;
              const fromData = dataMap[from];
              const toData = dataMap[to];
              const lineHealth = fromData?.health === 'critical' || toData?.health === 'critical' ? 'critical' :
                fromData?.health === 'warning' || toData?.health === 'warning' ? 'warning' : 'healthy';
              return (
                <line
                  key={`feed-${i}`}
                  x1={0} y1={0} x2={0} y2={0}
                  style={{ display: 'none' }}
                />
              );
            })}

            {/* Feeder lines as Markers with lines between them */}
            {feederConnections.map(([from, to], i) => {
              const fromPos = substationLocations[from];
              const toPos = substationLocations[to];
              if (!fromPos || !toPos) return null;
              const fromData = dataMap[from];
              const toData = dataMap[to];
              const lineHealth = fromData?.health === 'critical' || toData?.health === 'critical' ? 'critical' :
                fromData?.health === 'warning' || toData?.health === 'warning' ? 'warning' : 'healthy';
              return (
                <Marker key={`line-${i}`} coordinates={fromPos}>
                  <line
                    x1={0} y1={0}
                    x2={(toPos[0] - fromPos[0]) * 130}
                    y2={(fromPos[1] - toPos[1]) * 130}
                    stroke={healthColor[lineHealth]}
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                    opacity={0.5}
                  />
                </Marker>
              );
            })}

            {/* Substation markers */}
            {substationData.map(sub => {
              const coords = substationLocations[sub.name];
              if (!coords) return null;
              return (
                <Marker key={sub.id} coordinates={coords}>
                  <circle
                    r={6}
                    fill={healthColor[sub.health]}
                    opacity={0.3}
                  />
                  <circle
                    r={3}
                    fill={healthColor[sub.health]}
                    className={sub.health === 'critical' ? 'animate-pulse-subtle' : ''}
                    style={{ filter: `drop-shadow(0 0 4px ${healthColor[sub.health]})`, cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      const rect = (e.target as SVGElement).closest('svg')?.getBoundingClientRect();
                      setTooltip({
                        name: sub.name,
                        data: sub,
                        x: e.clientX - (rect?.left || 0),
                        y: e.clientY - (rect?.top || 0),
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                  <text
                    y={-10}
                    textAnchor="middle"
                    style={{ fontSize: '5px', fill: 'hsl(215, 15%, 50%)', fontFamily: 'JetBrains Mono' }}
                  >
                    {sub.name.replace('Substation ', '')}
                  </text>
                  <text
                    y={14}
                    textAnchor="middle"
                    style={{ fontSize: '4px', fill: healthColor[sub.health], fontFamily: 'JetBrains Mono' }}
                  >
                    {sub.load.toFixed(0)}MW
                  </text>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {tooltip && (
          <div
            className="absolute pointer-events-none z-10 bg-card border border-border rounded-lg p-2 shadow-lg"
            style={{ left: tooltip.x + 10, top: tooltip.y - 70 }}
          >
            <p className="text-xs font-semibold text-foreground">{tooltip.name}</p>
            <div className="text-[10px] font-mono text-muted-foreground space-y-0.5 mt-1">
              <p>Load: <span className="text-primary">{tooltip.data.load.toFixed(1)} / {tooltip.data.capacity.toFixed(0)} MW</span></p>
              <p>Voltage: <span className="text-foreground">{tooltip.data.voltage.toFixed(1)} V</span></p>
              <p>Freq: <span className="text-foreground">{tooltip.data.frequency.toFixed(2)} Hz</span></p>
              <p>Temp: <span className={tooltip.data.temperature > 70 ? 'text-warning' : 'text-foreground'}>{tooltip.data.temperature.toFixed(1)}°C</span></p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-2 text-[10px] font-mono text-muted-foreground justify-center">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Healthy</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Warning</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-critical" /> Critical</span>
        <span className="flex items-center gap-1">--- Feeder Lines</span>
      </div>
    </div>
  );
}
