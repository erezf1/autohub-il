import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { PrivateAuthProvider } from "@/contexts/PrivateAuthContext";
import { ProtectedRoute } from "@/components/mobile/ProtectedRoute";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";
import { ProtectedPrivateRoute } from "@/components/private/ProtectedPrivateRoute";

// Landing Page
import LandingPage from "./pages/LandingPage";

// Mobile Layout and Pages
import MobileLayout from "./components/mobile/MobileLayout";
import DashboardScreen from "./pages/mobile/DashboardScreen";
import CarSearchScreen from "./pages/mobile/CarSearchScreen";
import ChatListScreen from "./pages/mobile/ChatListScreen";
import ChatDetailScreen from "./pages/mobile/ChatDetailScreen";
import NotificationListScreen from "./pages/mobile/NotificationListScreen";
import AuctionListScreen from "./pages/mobile/AuctionListScreen";
import AuctionDetailScreen from "./pages/mobile/AuctionDetailScreen";
import VehicleDetailScreen from "./pages/mobile/VehicleDetailScreen";
import AddVehicleScreen from "./pages/mobile/AddVehicleScreen";
import AddAuctionScreen from "./pages/mobile/AddAuctionScreen";
import MyProfileScreen from "./pages/mobile/MyProfileScreen";
import MyVehiclesScreen from "./pages/mobile/MyVehiclesScreen";
import ISORequestDetailScreen from "./pages/mobile/ISORequestDetailScreen";
import CreateISORequestScreen from "./pages/mobile/CreateISORequestScreen";
import ChatRequestScreen from "./pages/mobile/ChatRequestScreen";
import CreateBidSelectCarScreen from "./pages/mobile/CreateBidSelectCarScreen";
import CreateBidDetailsScreen from "./pages/mobile/CreateBidDetailsScreen";
import { RequiredCarsScreen } from "./pages/mobile/RequiredCarsScreen";
import { HotCarsScreen } from "./pages/mobile/HotCarsScreen";
import { BidsScreen } from "./pages/mobile/BidsScreen";
import BoostManagementScreen from "./pages/mobile/BoostManagementScreen";
import { WelcomeScreen } from "./pages/mobile/WelcomeScreen";
import { RegisterScreen } from "./pages/mobile/RegisterScreen";
import { LoginScreen } from "./pages/mobile/LoginScreen";
import { SetPasswordScreen } from "./pages/mobile/SetPasswordScreen";
import { OTPVerificationScreen } from "./pages/mobile/OTPVerificationScreen";
import { OnboardingProfileScreen } from "./pages/mobile/OnboardingProfileScreen";
import { ProfileEditScreen } from "./pages/mobile/ProfileEditScreen";
import { OnboardingLicenseScreen } from "./pages/mobile/OnboardingLicenseScreen";
import { PendingApprovalScreen } from "./pages/mobile/PendingApprovalScreen";
import NotFound from "./pages/mobile/NotFound";

// Admin Layout and Pages
import AdminDesktopLayout from "./components/admin/AdminDesktopLayout";
import AdminLoginScreen from "./pages/admin/AdminLoginScreen";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersList from "./pages/admin/AdminUsersList";
import AdminVehiclesList from "./pages/admin/AdminVehiclesList";
import AdminVehicleDetail from "./pages/admin/AdminVehicleDetail";
import AdminEditVehicle from "./pages/admin/AdminEditVehicle";
import AdminAddVehicle from "./pages/admin/AdminAddVehicle";
import AdminVehicleRequestsList from "./pages/admin/AdminVehicleRequestsList";
import AdminAuctionsList from "./pages/admin/AdminAuctionsList";
import AdminSupportTickets from "./pages/admin/AdminSupportTickets";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminCreateUser from "./pages/admin/AdminCreateUser";
import AdminEditUser from "./pages/admin/AdminEditUser";
import AdminVehicleRequestDetail from "./pages/admin/AdminVehicleRequestDetail";
import AdminAuctionDetail from "./pages/admin/AdminAuctionDetail";
import AdminSupportTicketDetail from "./pages/admin/AdminSupportTicketDetail";
import AdminNotifications from "./pages/admin/AdminNotifications";
import EditVehicleScreen from "./pages/mobile/EditVehicleScreen";
import AdminPrivateUsersList from "./pages/admin/AdminPrivateUsersList";
import AdminPrivateUserDetail from "./pages/admin/AdminPrivateUserDetail";

// Private User Layout and Pages
import { PrivateLayout } from "./components/private/PrivateLayout";
import { PrivateWelcomeScreen } from "./pages/private/PrivateWelcomeScreen";
import { PrivateLoginScreen } from "./pages/private/PrivateLoginScreen";
import { PrivateRegisterScreen } from "./pages/private/PrivateRegisterScreen";
import PrivateOTPVerificationScreen from "./pages/private/PrivateOTPVerificationScreen";
import { PrivateDashboardScreen } from "./pages/private/PrivateDashboardScreen";
import { PrivateMyVehiclesScreen } from "./pages/private/PrivateMyVehiclesScreen";
import { PrivateProfileScreen } from "./pages/private/PrivateProfileScreen";
import { PrivateProfileEditScreen } from "./pages/private/PrivateProfileEditScreen";
import PrivateAddVehicleScreen from "./pages/private/PrivateAddVehicleScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminAuthProvider>
        <PrivateAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Admin Login - Not Protected */}
            <Route path="/admin/login" element={<AdminLoginScreen />} />

            {/* Admin Routes - Protected - Must come before mobile catch-all */}
            <Route path="/admin/*" element={
              <ProtectedAdminRoute>
                <AdminDesktopLayout>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="notifications" element={<AdminNotifications />} />
                    <Route path="users" element={<AdminUsersList />} />
                    <Route path="users/create" element={<AdminCreateUser />} />
                    <Route path="users/:id" element={<AdminUserDetail />} />
                    <Route path="users/:id/edit" element={<AdminEditUser />} />
                    <Route path="private-users" element={<AdminPrivateUsersList />} />
                    <Route path="private-users/:id" element={<AdminPrivateUserDetail />} />
                    <Route path="vehicles" element={<AdminVehiclesList />} />
                    <Route path="vehicles/create" element={<AdminAddVehicle />} />
                    <Route path="vehicles/:id" element={<AdminVehicleDetail />} />
                    <Route path="vehicles/:id/edit" element={<AdminEditVehicle />} />
                    <Route path="vehicle-requests" element={<AdminVehicleRequestsList />} />
                    <Route path="vehicle-requests/:id" element={<AdminVehicleRequestDetail />} />
                    <Route path="auctions" element={<AdminAuctionsList />} />
                    <Route path="auctions/:id" element={<AdminAuctionDetail />} />
                    <Route path="support" element={<AdminSupportTickets />} />
                    <Route path="support/:id" element={<AdminSupportTicketDetail />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Routes>
                </AdminDesktopLayout>
              </ProtectedAdminRoute>
            } />

          {/* Private User Auth Routes - Not Protected */}
          <Route path="/private" element={<PrivateWelcomeScreen />} />
          <Route path="/private/login" element={<PrivateLoginScreen />} />
          <Route path="/private/register" element={<PrivateRegisterScreen />} />
          <Route path="/private/otp-verify" element={<PrivateOTPVerificationScreen />} />

          {/* Private User Protected Routes */}
          <Route path="/private/*" element={
            <ProtectedPrivateRoute>
              <PrivateLayout />
            </ProtectedPrivateRoute>
          }>
            <Route path="dashboard" element={<PrivateDashboardScreen />} />
            <Route path="my-vehicles" element={<PrivateMyVehiclesScreen />} />
            <Route path="add-vehicle" element={<PrivateAddVehicleScreen />} />
            <Route path="edit-vehicle/:id" element={<EditVehicleScreen />} />
            <Route path="vehicle/:id" element={<VehicleDetailScreen />} />
            <Route path="profile" element={<PrivateProfileScreen />} />
            <Route path="profile/edit" element={<PrivateProfileEditScreen />} />
          </Route>

          {/* Dealer Auth routes without layout */}
          <Route path="/mobile" element={<WelcomeScreen />} />
          <Route path="/mobile/welcome" element={<WelcomeScreen />} />
          <Route path="/mobile/register" element={<RegisterScreen />} />
          <Route path="/mobile/login" element={<LoginScreen />} />
          <Route path="/mobile/verify-otp" element={<OTPVerificationScreen />} />
          <Route path="/mobile/set-password" element={<SetPasswordScreen />} />
          <Route path="/mobile/profile-edit" element={<ProfileEditScreen />} />
          <Route path="/mobile/onboarding-license" element={<OnboardingLicenseScreen />} />
          <Route path="/mobile/onboarding-profile" element={<OnboardingProfileScreen />} />
          <Route path="/mobile/pending-approval" element={<PendingApprovalScreen />} />

          {/* Mobile Protected Routes */}
          <Route path="/mobile/*" element={
            <ProtectedRoute>
              <MobileLayout>
                <Routes>
                <Route path="/" element={<DashboardScreen />} />
                <Route path="/dashboard" element={<DashboardScreen />} />
                <Route path="/search" element={<CarSearchScreen />} />
                <Route path="/chats" element={<ChatListScreen />} />
                <Route path="/chat/:id" element={<ChatDetailScreen />} />
                <Route path="/notifications" element={<NotificationListScreen />} />
                <Route path="/auctions" element={<AuctionListScreen />} />
                <Route path="/auction/:id" element={<AuctionDetailScreen />} />
                <Route path="/vehicle/:id" element={<VehicleDetailScreen />} />
                <Route path="/vehicle/:id/edit" element={<EditVehicleScreen />} />
                <Route path="/my-vehicles" element={<MyVehiclesScreen />} />
                <Route path="/add-vehicle" element={<AddVehicleScreen />} />
                <Route path="/add-auction" element={<AddAuctionScreen />} />
                <Route path="/profile" element={<MyProfileScreen />} />
                <Route path="/required-cars" element={<RequiredCarsScreen />} />
                <Route path="/create-iso-request" element={<CreateISORequestScreen />} />
                <Route path="/hot-cars" element={<HotCarsScreen />} />
                <Route path="/boost-management" element={<BoostManagementScreen />} />
                <Route path="/bids" element={<BidsScreen />} />
                <Route path="/iso-requests/:id" element={<ISORequestDetailScreen />} />
                <Route path="/chat-request/:id" element={<ChatRequestScreen />} />
                <Route path="/create-bid-select-car" element={<CreateBidSelectCarScreen />} />
                
                {/* Legacy route aliases for backward compatibility */}
                <Route path="/add-car" element={<AddVehicleScreen />} />
                
                {/* Catch-all route for mobile */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </MobileLayout>
            </ProtectedRoute>
          } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </PrivateAuthProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;