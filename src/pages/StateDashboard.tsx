import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { AlertPanel } from '@/components/AlertPanel';
import { TelemetryTable } from '@/components/TelemetryTable';
import { LiveChart } from '@/components/LiveChart';
import { StateGridMap } from '@/components/StateGridMap';
import { useTelemetry } from '@/hooks/useTelemetry';
import { Zap, Thermometer, Gauge, Activity } from 'lucide-react';

export default function StateDashboard() {
  const { id } = useParams();
  const { data, alerts, history, acknowledgeAlert, resolveAlert } = useTelemetry('state');

  const totalLoad = data.reduce((s, d) => s + d.load, 0);
  const totalCapacity = data.reduce((s, d) => s + d.capacity, 0);
  const avgVoltage = data.reduce((s, d) => s + d.voltage, 0) / data.length;
  const maxTemp = Math.max(...data.map(d => d.temperature));

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-lg font-semibold text-foreground">State Grid: {id?.toUpperCase()}</h2>
          <span className="text-xs font-mono text-muted-foreground">/ DISCOM Region</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Regional Load" value={totalLoad.toFixed(0)} unit="MW" icon={<Zap className="w-4 h-4" />}
            variant={totalLoad / totalCapacity > 0.85 ? 'warning' : 'default'} />
          <StatCard label="Avg Voltage" value={avgVoltage.toFixed(1)} unit="V" icon={<Gauge className="w-4 h-4" />}
            variant={avgVoltage < 220 ? 'critical' : 'default'} />
          <StatCard label="Substations" value={data.length} icon={<Activity className="w-4 h-4" />} />
          <StatCard label="Max Temp" value={maxTemp.toFixed(1)} unit="°C" icon={<Thermometer className="w-4 h-4" />}
            variant={maxTemp > 80 ? 'critical' : maxTemp > 65 ? 'warning' : 'success'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <StateGridMap substationData={data} stateId={id || 'MH'} />
          </div>
          <AlertPanel alerts={alerts} onAcknowledge={acknowledgeAlert} onResolve={resolveAlert} />
        </div>

        <LiveChart data={history} title={`${id?.toUpperCase()} — Substation Telemetry`} />
        <TelemetryTable data={data} label="Substation Status" />
      </div>
    </DashboardLayout>
  );
}
