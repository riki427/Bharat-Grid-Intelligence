import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';
import { TelemetryData } from '@/hooks/useTelemetry';

const INDIA_TOPO = '/india-topo.json';
const PROJECTION_CONFIG = {
  scale: 1200,
  center: [82, 22] as [number, number],
};

// Map state names from TopoJSON to our telemetry IDs
const STATE_ID_MAP: Record<string, string> = {
  'Maharashtra': 'MH', 'Uttar Pradesh': 'UP', 'Tamil Nadu': 'TN',
  'Karnataka': 'KA', 'Gujarat': 'GJ', 'Rajasthan': 'RJ',
  'West Bengal': 'WB', 'Madhya Pradesh': 'MP', 'Andhra Pradesh': 'AP',
  'Telangana': 'TG', 'NCT of Delhi': 'DL', 'Delhi': 'DL',
  'Kerala': 'KL', 'Punjab': 'PB', 'Haryana': 'HR',
  'Bihar': 'BR', 'Odisha': 'OR', 'Jharkhand': 'JH',
  'Chhattisgarh': 'CG', 'Assam': 'AS', 'Goa': 'GA',
};

const healthFill = {
  healthy: 'hsl(145, 70%, 35%)',
  warning: 'hsl(38, 95%, 40%)',
  critical: 'hsl(0, 80%, 40%)',
};

const healthFillHover = {
  healthy: 'hsl(145, 70%, 50%)',
  warning: 'hsl(38, 95%, 55%)',
  critical: 'hsl(0, 80%, 55%)',
};

interface IndiaMapProps {
  stateData: TelemetryData[];
}

export function IndiaGridMap({ stateData }: IndiaMapProps) {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{ name: string; data: TelemetryData | null; x: number; y: number } | null>(null);

  const stateHealthMap = useMemo(() => {
    const map: Record<string, TelemetryData> = {};
    stateData.forEach(d => { map[d.id] = d; });
    return map;
  }, [stateData]);

  // Group districts by state for coloring
  const getStateColor = (geo: any, hover = false) => {
    const stateName = geo.properties.st_nm;
    const stateId = STATE_ID_MAP[stateName];
    const data = stateId ? stateHealthMap[stateId] : null;
    if (!data) return hover ? 'hsl(222, 30%, 18%)' : 'hsl(222, 30%, 12%)';
    return hover ? healthFillHover[data.health] : healthFill[data.health];
  };

  return (
    <div className="scada-panel relative">
      <h3 className="text-sm font-semibold text-foreground mb-2">National Grid Health — India</h3>
      <div className="relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={PROJECTION_CONFIG}
          width={600}
          height={600}
          style={{ width: '100%', height: 'auto', maxHeight: '500px' }}
        >
          <ZoomableGroup center={[82, 22]} zoom={1}>
            <Geographies geography={INDIA_TOPO}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = geo.properties.st_nm;
                  const stateId = STATE_ID_MAP[stateName];
                  const data = stateId ? stateHealthMap[stateId] : null;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getStateColor(geo)}
                      stroke="hsl(222, 30%, 20%)"
                      strokeWidth={0.3}
                      style={{
                        default: { outline: 'none', cursor: stateId ? 'pointer' : 'default' },
                        hover: {
                          fill: getStateColor(geo, true),
                          outline: 'none',
                          cursor: stateId ? 'pointer' : 'default',
                          filter: data ? `drop-shadow(0 0 4px ${healthFillHover[data.health]})` : 'none',
                        },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={(e) => {
                        if (stateId && data) {
                          const rect = (e.target as SVGElement).closest('svg')?.getBoundingClientRect();
                          setTooltip({
                            name: stateName,
                            data,
                            x: e.clientX - (rect?.left || 0),
                            y: e.clientY - (rect?.top || 0),
                          });
                        }
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => {
                        if (stateId) navigate(`/state/${stateId}`);
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && tooltip.data && (
          <div
            className="absolute pointer-events-none z-10 bg-card border border-border rounded-lg p-2 shadow-lg"
            style={{ left: tooltip.x + 10, top: tooltip.y - 60 }}
          >
            <p className="text-xs font-semibold text-foreground">{tooltip.name}</p>
            <div className="text-[10px] font-mono text-muted-foreground space-y-0.5 mt-1">
              <p>Load: <span className="text-primary">{tooltip.data.load.toFixed(1)} MW</span></p>
              <p>Voltage: <span className="text-foreground">{tooltip.data.voltage.toFixed(1)} V</span></p>
              <p>Temp: <span className={tooltip.data.temperature > 70 ? 'text-warning' : 'text-foreground'}>{tooltip.data.temperature.toFixed(1)}°C</span></p>
            </div>
            <p className="text-[9px] text-primary mt-1">Click to view state →</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-2 text-[10px] font-mono text-muted-foreground justify-center">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Healthy</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Warning</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-critical" /> Critical</span>
        <span className="text-primary/50">Click state to drill down</span>
      </div>
    </div>
  );
}
