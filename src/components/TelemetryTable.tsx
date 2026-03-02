import { TelemetryData } from '@/hooks/useTelemetry';

interface TelemetryTableProps {
  data: TelemetryData[];
  label: string;
}

const healthDot = {
  healthy: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-critical animate-pulse-subtle',
};

export function TelemetryTable({ data, label }: TelemetryTableProps) {
  return (
    <div className="scada-panel">
      <h3 className="text-sm font-semibold text-foreground mb-3">{label}</h3>
      <div className="overflow-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-2 px-2">Status</th>
              <th className="text-left py-2 px-2">Name</th>
              <th className="text-right py-2 px-2">Load (MW)</th>
              <th className="text-right py-2 px-2">Capacity</th>
              <th className="text-right py-2 px-2">Voltage (V)</th>
              <th className="text-right py-2 px-2">Freq (Hz)</th>
              <th className="text-right py-2 px-2">Temp (°C)</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-2 px-2">
                  <div className={`status-dot ${healthDot[d.health]}`} />
                </td>
                <td className="py-2 px-2 text-foreground">{d.name}</td>
                <td className={`py-2 px-2 text-right ${d.load / d.capacity > 0.9 ? 'text-critical' : 'text-primary'}`}>
                  {d.load.toFixed(1)}
                </td>
                <td className="py-2 px-2 text-right text-muted-foreground">{d.capacity.toFixed(0)}</td>
                <td className={`py-2 px-2 text-right ${d.voltage < 220 ? 'text-warning' : 'text-foreground'}`}>
                  {d.voltage.toFixed(1)}
                </td>
                <td className={`py-2 px-2 text-right ${Math.abs(d.frequency - 50) > 0.1 ? 'text-warning' : 'text-foreground'}`}>
                  {d.frequency.toFixed(2)}
                </td>
                <td className={`py-2 px-2 text-right ${d.temperature > 80 ? 'text-critical' : d.temperature > 65 ? 'text-warning' : 'text-foreground'}`}>
                  {d.temperature.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
