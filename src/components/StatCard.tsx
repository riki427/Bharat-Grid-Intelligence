import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  variant?: 'default' | 'success' | 'warning' | 'critical';
}

const variantClasses = {
  default: 'border-border',
  success: 'border-success/30 scada-glow-success',
  warning: 'border-warning/30 scada-glow-warning',
  critical: 'border-critical/30 scada-glow-critical',
};

const valueClasses = {
  default: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  critical: 'text-critical',
};

export function StatCard({ label, value, unit, icon, variant = 'default' }: StatCardProps) {
  return (
    <div className={`scada-panel ${variantClasses[variant]} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`telemetry-value ${valueClasses[variant]}`}>{typeof value === 'number' ? value.toFixed(1) : value}</span>
        {unit && <span className="text-xs text-muted-foreground font-mono">{unit}</span>}
      </div>
    </div>
  );
}
