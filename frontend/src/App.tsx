import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/useAuthStore';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import MembersPage from './pages/members';
import FinancesPage from './pages/finances';
import CellsPage from './pages/cells';
import EventsPage from './pages/events';
import SettingsPage from './pages/settings';
import DashboardLayout from './layouts/dashboard-layout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" expand richColors />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout><DashboardPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/members" element={
            <ProtectedRoute>
              <DashboardLayout><MembersPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/cells" element={
            <ProtectedRoute>
              <DashboardLayout><CellsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute>
              <DashboardLayout><EventsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/finances" element={
            <ProtectedRoute>
              <DashboardLayout><FinancesPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardLayout><SettingsPage /></DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
