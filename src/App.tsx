import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Capacitor } from '@capacitor/core';
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { AdminRoutes } from "@/routes/AdminRoutes";
import { MobileRoutes } from "@/routes/MobileRoutes";

// Landing Page
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

/**
 * This component handles the initial redirection logic for native platforms.
 * It must be a child of <BrowserRouter> to use navigation hooks.
 */
const NativeRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If the app is running on a native device (iOS/Android) and is at the root path...
    if (Capacitor.isNativePlatform() && location.pathname === '/') {
      // ...redirect to the mobile welcome screen. `replace: true` prevents the
      // user from navigating "back" to the blank landing page.
      navigate('/mobile/welcome', { replace: true });
    }
  }, [navigate, location.pathname]);

  return null; // This component does not render anything.
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Add the redirector component here */}
            <NativeRedirect />
            <Routes>
            {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* All Admin routes */}
              <AdminRoutes />
              
              {/* All Mobile routes */}
              <MobileRoutes />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;