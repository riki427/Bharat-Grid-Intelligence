import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { AlertPanel } from '@/components/AlertPanel';
import { TelemetryTable } from '@/components/TelemetryTable';
import { LiveChart } from '@/components/LiveChart';
import { IndiaGridMap } from '@/components/IndiaGridMap';
import { useTelemetry } from '@/hooks/useTelemetry';
import { Zap, Thermometer, Gauge, Activity } from 'lucide-react';

export default function NationalDashboard() {
  const { data, alerts, history, acknowledgeAlert, resolveAlert } = useTelemetry('national');

  const totalLoad = data.reduce((s, d) => s + d.load, 0);
  const totalCapacity = data.reduce((s, d) => s + d.capacity, 0);
  const avgVoltage = data.reduce((s, d) => s + d.voltage, 0) / data.length;
  const avgFreq = data.reduce((s, d) => s + d.frequency, 0) / data.length;
  const criticalCount = data.filter(d => d.health === 'critical').length;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Load" value={totalLoad.toFixed(0)} unit="MW" icon={<Zap className="w-4 h-4" />}
            variant={totalLoad / totalCapacity > 0.85 ? 'warning' : 'default'} />
          <StatCard label="Avg Voltage" value={avgVoltage.toFixed(1)} unit="V" icon={<Gauge className="w-4 h-4" />}
            variant={avgVoltage < 220 ? 'critical' : 'default'} />
          <StatCard label="Grid Frequency" value={avgFreq.toFixed(2)} unit="Hz" icon={<Activity className="w-4 h-4" />}
            variant={Math.abs(avgFreq - 50) > 0.1 ? 'warning' : 'success'} />
          <StatCard label="Critical States" value={criticalCount} icon={<Thermometer className="w-4 h-4" />}
            variant={criticalCount > 0 ? 'critical' : 'success'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <IndiaGridMap stateData={data} />
          </div>
          <AlertPanel alerts={alerts} onAcknowledge={acknowledgeAlert} onResolve={resolveAlert} />
        </div>

        <LiveChart data={history} title="National Grid Telemetry — Live" />
        <TelemetryTable data={data} label="State-wise Grid Status" />
      </div>
    </DashboardLayout>
  );
}
