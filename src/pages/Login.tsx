import { useAuthStore, UserRole } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Zap, Globe, MapPin, Building2 } from 'lucide-react';

const roles: { role: UserRole; label: string; desc: string; icon: typeof Globe; path: string }[] = [
  { role: 'national', label: 'NLDC Operator', desc: 'National Load Dispatch Centre — Monitor all-India grid', icon: Globe, path: '/national' },
  { role: 'state', label: 'RLDC Operator', desc: 'Regional Load Dispatch — Monitor state grid & substations', icon: MapPin, path: '/state/MH' },
  { role: 'city', label: 'City Operator', desc: 'City Distribution — Monitor local feeders & transformers', icon: Building2, path: '/city/MH-MUM' },
];

export default function Login() {
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleLogin = (role: UserRole, path: string) => {
    login(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center scada-glow">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-wide">
              Bharat Grid Intelligence
            </h1>
          </div>
          <p className="text-sm text-muted-foreground font-mono">SCADA Monitoring System v2.0</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider text-center mb-4">Select Access Level</p>
          {roles.map(({ role, label, desc, icon: Icon, path }) => (
            <button
              key={role}
              onClick={() => handleLogin(role, path)}
              className="w-full scada-panel hover:border-primary/50 transition-all duration-200 text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-8 font-mono">
          Role-based access control • Strict level isolation • Encrypted sessions
        </p>
      </div>
    </div>
  );
}
