import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/common/Toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from '@/contexts/AuthContext';
import RequireAuth from '@/components/common/RequireAuth';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import Dashboard from "./pages/superadmin/Dashboard";
import Events from "./pages/superadmin/Events";
import EventAdmins from "./pages/superadmin/EventAdmins";
import Users from "./pages/superadmin/Users";
import Settings from "./pages/superadmin/Settings";
import Banner from "./pages/superadmin/Banner";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ToastProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Superadmin routes (protected) */}
              <Route
                path="/superadmin"
                element={
                  <RequireAuth>
                    <AppLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="events" element={<Events />} />
                <Route path="event-admins" element={<EventAdmins />} />
                <Route path="users" element={<Users />} />
                <Route path="banner" element={<Banner />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Event Admin routes (protected - same layout, different pages) */}
              <Route
                path="/eventadmin"
                element={
                  <RequireAuth>
                    <AppLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<div className="text-2xl font-bold">Event Admin Dashboard (Coming Soon)</div>} />
                <Route path="events" element={<div className="text-2xl font-bold">Event Admin Events (Coming Soon)</div>} />
                <Route path="orders" element={<div className="text-2xl font-bold">Event Admin Orders (Coming Soon)</div>} />
                <Route path="tickets" element={<div className="text-2xl font-bold">Event Admin Tickets (Coming Soon)</div>} />
                <Route path="scan-staff" element={<div className="text-2xl font-bold">Event Admin Scan Staff (Coming Soon)</div>} />
                <Route path="settings" element={<div className="text-2xl font-bold">Event Admin Settings (Coming Soon)</div>} />
              </Route>

              {/* Login route */}
              <Route path="/login" element={<Login />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ToastProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
