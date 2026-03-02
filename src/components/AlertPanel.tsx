import { AlertData } from '@/hooks/useTelemetry';
import { AlertTriangle, CheckCircle, Bell } from 'lucide-react';

interface AlertPanelProps {
  alerts: AlertData[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

const severityIcon = {
  warning: <AlertTriangle className="w-3.5 h-3.5 text-warning" />,
  critical: <AlertTriangle className="w-3.5 h-3.5 text-critical" />,
};

const statusColors = {
  created: 'border-l-critical',
  acknowledged: 'border-l-warning',
  resolved: 'border-l-success',
};

export function AlertPanel({ alerts, onAcknowledge, onResolve }: AlertPanelProps) {
  const activeAlerts = alerts.filter(a => a.status !== 'resolved');
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;

  return (
    <div className="scada-panel h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Alerts</h3>
        </div>
        {criticalCount > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-critical/20 text-critical">
            {criticalCount} critical
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto space-y-1.5 max-h-[400px]">
        {activeAlerts.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
            <CheckCircle className="w-4 h-4 mr-2 text-success" />
            All systems nominal
          </div>
        ) : (
          activeAlerts.slice(0, 15).map(alert => (
            <div
              key={alert.id}
              className={`border-l-2 ${statusColors[alert.status]} bg-muted/50 rounded-r px-3 py-2`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  {severityIcon[alert.severity]}
                  <div className="min-w-0">
                    <p className="text-xs text-foreground truncate">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {alert.status === 'created' && (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-warning/20 text-warning hover:bg-warning/30 transition-colors"
                    >
                      ACK
                    </button>
                  )}
                  {alert.status !== 'resolved' && (
                    <button
                      onClick={() => onResolve(alert.id)}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-success/20 text-success hover:bg-success/30 transition-colors"
                    >
                      RSV
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
