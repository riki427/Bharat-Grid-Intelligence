import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import Index from "./pages/Index";
import NationalDashboard from "./pages/NationalDashboard";
import StateDashboard from "./pages/StateDashboard";
import CityDashboard from "./pages/CityDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ allowedRoles, children }: { allowedRoles: string[]; children: React.ReactNode }) {
  const role = useAuthStore(s => s.role);
  if (!role) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/national" element={<ProtectedRoute allowedRoles={['national']}><NationalDashboard /></ProtectedRoute>} />
          <Route path="/state/:id" element={<ProtectedRoute allowedRoles={['national', 'state']}><StateDashboard /></ProtectedRoute>} />
          <Route path="/city/:id" element={<ProtectedRoute allowedRoles={['national', 'state', 'city']}><CityDashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
