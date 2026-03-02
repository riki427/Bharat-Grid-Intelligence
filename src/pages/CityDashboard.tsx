import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { AlertPanel } from '@/components/AlertPanel';
import { TelemetryTable } from '@/components/TelemetryTable';
import { LiveChart } from '@/components/LiveChart';
import { CityGridMap } from '@/components/CityGridMap';
import { useTelemetry } from '@/hooks/useTelemetry';
import { Zap, Thermometer, Gauge, Activity } from 'lucide-react';

export default function CityDashboard() {
  const { id } = useParams();
  const { data, alerts, history, acknowledgeAlert, resolveAlert } = useTelemetry('city');

  const totalLoad = data.reduce((s, d) => s + d.load, 0);
  const healthyCount = data.filter(d => d.health === 'healthy').length;
  const avgVoltage = data.reduce((s, d) => s + d.voltage, 0) / data.length;
  const avgFreq = data.reduce((s, d) => s + d.frequency, 0) / data.length;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-lg font-semibold text-foreground">City Distribution: {id?.toUpperCase()}</h2>
          <span className="text-xs font-mono text-muted-foreground">/ Local Feeder Network</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="District Load" value={totalLoad.toFixed(0)} unit="MW" icon={<Zap className="w-4 h-4" />} />
          <StatCard label="Healthy Feeders" value={`${healthyCount}/${data.length}`}
            icon={<Activity className="w-4 h-4" />}
            variant={healthyCount === data.length ? 'success' : healthyCount > data.length / 2 ? 'warning' : 'critical'} />
          <StatCard label="Avg Voltage" value={avgVoltage.toFixed(1)} unit="V" icon={<Gauge className="w-4 h-4" />}
            variant={avgVoltage < 220 ? 'critical' : 'default'} />
          <StatCard label="Frequency" value={avgFreq.toFixed(2)} unit="Hz" icon={<Thermometer className="w-4 h-4" />}
            variant={Math.abs(avgFreq - 50) > 0.1 ? 'warning' : 'success'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <CityGridMap feederData={data} />
          </div>
          <AlertPanel alerts={alerts} onAcknowledge={acknowledgeAlert} onResolve={resolveAlert} />
        </div>

        <LiveChart data={history} title={`${id?.toUpperCase()} — Feeder Telemetry`} />
        <TelemetryTable data={data} label="Feeder Status" />
      </div>
    </DashboardLayout>
  );
}
