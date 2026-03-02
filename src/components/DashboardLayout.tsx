import { ReactNode } from 'react';
import { useAuthStore, UserRole } from '@/stores/authStore';
import { Activity, LogOut, Shield, Zap, Radio } from 'lucide-react';

const levelLabels: Record<UserRole, string> = {
  national: 'NLDC — National Load Dispatch Centre',
  state: 'RLDC — Regional Load Dispatch Centre',
  city: 'SLDC — City Distribution Control',
};

const levelColors: Record<UserRole, string> = {
  national: 'text-primary',
  state: 'text-accent',
  city: 'text-success',
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { role, logout, userName } = useAuthStore();

  if (!role) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground tracking-wide">BGI</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <span className={`text-sm font-medium ${levelColors[role]}`}>
            {levelLabels[role]}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Radio className="w-3 h-3 text-success animate-pulse-subtle" />
            <span className="font-mono">LIVE</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="w-3 h-3" />
            <span className="font-mono">3s interval</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>{userName}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
}
