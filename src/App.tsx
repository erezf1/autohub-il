import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Capacitor } from '@capacitor/core';

// Auth Providers from both versions
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { PrivateAuthProvider } from "@/contexts/PrivateAuthContext";

// Route components and hooks from both versions
// NOTE: Ensure MobileRoutes.tsx and AdminRoutes.tsx exist from your refactoring
import { AdminRoutes } from "./AdminRoutes";
import { MobileRoutes } from "./MobileRoutes";
import { PrivateRoutes } from "./PrivateRoutes";
import { useSubdomainRedirect } from "@/hooks/useSubdomainRedirect";

// Landing Page
import LandingPage from "./pages/LandingPage";

// Private User Pages
import PrivateDashboard from "./pages/private/PrivateDashboard";
import PrivateLogin from "./pages/private/PrivateLogin";
import { PrivateWelcomeScreen } from "./pages/private/PrivateWelcomeScreen";
import { PrivateRegisterScreen } from "./pages/private/PrivateRegisterScreen";
import PrivateOTPVerificationScreen from "./pages/private/PrivateOTPVerificationScreen";

const queryClient = new QueryClient();

/**
 * This component handles the initial redirection logic for native platforms.
 * It must be a child of <BrowserRouter> to use navigation hooks.
 */
const NativeRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (Capacitor.isNativePlatform() && location.pathname === '/') {
      navigate('/mobile/welcome', { replace: true });
    }
  }, [navigate, location.pathname]);

  return null;
};

/**
 * This component handles the subdomain redirection logic from the remote branch.
 */
const SubdomainRedirectHandler = ({ children }: { children: React.ReactNode }) => {
  useSubdomainRedirect();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminAuthProvider>
        <PrivateAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SubdomainRedirectHandler>
                <NativeRedirect />
                <Routes>
                  {/* Landing Page */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Public route for private user login */}
                  <Route path="/private" element={<PrivateWelcomeScreen />} />
                  <Route path="/private/login" element={<PrivateLogin />} />
                  <Route path="/private/register" element={<PrivateRegisterScreen />} />
                  <Route path="/private/otp" element={<PrivateOTPVerificationScreen />} />
                  <Route path="/admin/*" element={<AdminRoutes />} />

                  {/* All Private routes are nested under a single protected element */}
                  <Route element={<PrivateRoutes />}>
                    {/* Add your private routes here. The path is relative to the root. */}
                    <Route path="/private/dashboard" element={<PrivateDashboard />} />
                  </Route>

                  {/* All Mobile routes are nested under the /mobile path */}
                  <Route path="/mobile/*" element={<MobileRoutes />} />
                </Routes>
              </SubdomainRedirectHandler>
            </BrowserRouter>
          </TooltipProvider>
        </PrivateAuthProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
