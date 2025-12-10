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
import { PrivateDashboardScreen } from "./pages/private/PrivateDashboardScreen";
import { PrivateLoginScreen } from "./pages/private/PrivateLoginScreen";
import { PrivateWelcomeScreen } from "./pages/private/PrivateWelcomeScreen";
import { PrivateRegisterScreen } from "./pages/private/PrivateRegisterScreen";
import PrivateOTPVerificationScreen from "./pages/private/PrivateOTPVerificationScreen";
import { PrivateProfileScreen } from "./pages/private/PrivateProfileScreen";
import { PrivateProfileEditScreen } from "./pages/private/PrivateProfileEditScreen";
import PrivateAddVehicleScreen from "./pages/private/PrivateAddVehicleScreen";
import { PrivateMyVehiclesScreen } from "./pages/private/PrivateMyVehiclesScreen";
import { PrivateVehicleDetailScreen } from "./pages/private/PrivateVehicleDetailScreen";
import { PrivateEditVehicleScreen } from "./pages/private/PrivateEditVehicleScreen";
import { PrivateContactScreen } from "./pages/private/PrivateContactScreen";

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
                  <Route path="/private/login" element={<PrivateLoginScreen />} />
                  <Route path="/private/register" element={<PrivateRegisterScreen />} />
                  <Route path="/private/otp-verify" element={<PrivateOTPVerificationScreen />} />
                  <Route path="/admin/*" element={<AdminRoutes />} />

                  {/* All Private routes are nested under a single protected element */}
                  <Route element={<PrivateRoutes />}>
                    <Route path="/private/dashboard" element={<PrivateDashboardScreen />} />
                    <Route path="/private/profile" element={<PrivateProfileScreen />} />
                    <Route path="/private/profile/edit" element={<PrivateProfileEditScreen />} />
                    <Route path="/private/add-vehicle" element={<PrivateAddVehicleScreen />} />
                    <Route path="/private/my-vehicles" element={<PrivateMyVehiclesScreen />} />
                    <Route path="/private/vehicle/:id" element={<PrivateVehicleDetailScreen />} />
                    <Route path="/private/vehicle/:id/edit" element={<PrivateEditVehicleScreen />} />
                    <Route path="/private/contact" element={<PrivateContactScreen />} />
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
