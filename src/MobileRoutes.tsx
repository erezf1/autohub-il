import { Routes, Route, Outlet } from "react-router-dom";

// Layouts and Protected Routes
import MobileLayout from "@/components/mobile/MobileLayout";
import { ProtectedRoute } from "@/components/mobile/ProtectedRoute";

// Page Imports
import DashboardScreen from "@/pages/mobile/DashboardScreen";
import CarSearchScreen from "@/pages/mobile/CarSearchScreen";
import ChatListScreen from "@/pages/mobile/ChatListScreen";
import ChatDetailScreen from "@/pages/mobile/ChatDetailScreen";
import NotificationListScreen from "@/pages/mobile/NotificationListScreen";
import AuctionListScreen from "@/pages/mobile/AuctionListScreen";
import AuctionDetailScreen from "@/pages/mobile/AuctionDetailScreen";
import VehicleDetailScreen from "@/pages/mobile/VehicleDetailScreen";
import AddVehicleScreen from "@/pages/mobile/AddVehicleScreen";
import EditVehicleScreen from "@/pages/mobile/EditVehicleScreen";
import AddAuctionScreen from "@/pages/mobile/AddAuctionScreen";
import MyProfileScreen from "@/pages/mobile/MyProfileScreen";
import MyVehiclesScreen from "@/pages/mobile/MyVehiclesScreen";
import ISORequestDetailScreen from "@/pages/mobile/ISORequestDetailScreen";
import CreateISORequestScreen from "@/pages/mobile/CreateISORequestScreen";
import ChatRequestScreen from "@/pages/mobile/ChatRequestScreen";
import CreateBidSelectCarScreen from "@/pages/mobile/CreateBidSelectCarScreen";
import { RequiredCarsScreen } from "@/pages/mobile/RequiredCarsScreen";
import { HotCarsScreen } from "@/pages/mobile/HotCarsScreen";
import { BidsScreen } from "@/pages/mobile/BidsScreen";
import BoostManagementScreen from "@/pages/mobile/BoostManagementScreen";
import { WelcomeScreen } from "@/pages/mobile/WelcomeScreen";
import { RegisterScreen } from "@/pages/mobile/RegisterScreen";
import { LoginScreen } from "@/pages/mobile/LoginScreen";
import { SetPasswordScreen } from "@/pages/mobile/SetPasswordScreen";
import { OTPVerificationScreen } from "@/pages/mobile/OTPVerificationScreen";
import { OnboardingProfileScreen } from "@/pages/mobile/OnboardingProfileScreen";
import { ProfileEditScreen } from "@/pages/mobile/ProfileEditScreen";
import { OnboardingLicenseScreen } from "@/pages/mobile/OnboardingLicenseScreen";
import { PendingApprovalScreen } from "@/pages/mobile/PendingApprovalScreen";
import NotFound from "@/pages/mobile/NotFound";

export const MobileRoutes = () => (
  <Routes>
    {/* Auth routes without layout. Paths are relative to /mobile */}
    <Route index element={<WelcomeScreen />} /> {/* Matches /mobile */}
    <Route path="welcome" element={<WelcomeScreen />} />
    <Route path="register" element={<RegisterScreen />} />
    <Route path="login" element={<LoginScreen />} />
    <Route path="verify-otp" element={<OTPVerificationScreen />} />
    <Route path="set-password" element={<SetPasswordScreen />} />
    <Route path="profile-edit" element={<ProfileEditScreen />} />
    <Route path="onboarding-license" element={<OnboardingLicenseScreen />} />
    <Route path="onboarding-profile" element={<OnboardingProfileScreen />} />
    <Route path="pending-approval" element={<PendingApprovalScreen />} />

    {/* Mobile Protected Routes */}
    <Route
      element={
        <ProtectedRoute>
          <MobileLayout>
            <Outlet />
          </MobileLayout>
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<DashboardScreen />} />
      <Route path="search" element={<CarSearchScreen />} />
      <Route path="chats" element={<ChatListScreen />} />
      <Route path="chat/:id" element={<ChatDetailScreen />} />
      <Route path="notifications" element={<NotificationListScreen />} />
      <Route path="auctions" element={<AuctionListScreen />} />
      <Route path="auction/:id" element={<AuctionDetailScreen />} />
      <Route path="vehicle/:id" element={<VehicleDetailScreen />} />
      <Route path="vehicle/:id/edit" element={<EditVehicleScreen />} />
      <Route path="my-vehicles" element={<MyVehiclesScreen />} />
      <Route path="add-vehicle" element={<AddVehicleScreen />} />
      <Route path="add-auction" element={<AddAuctionScreen />} />
      <Route path="profile" element={<MyProfileScreen />} />
      <Route path="required-cars" element={<RequiredCarsScreen />} />
      <Route path="create-iso-request" element={<CreateISORequestScreen />} />
      <Route path="hot-cars" element={<HotCarsScreen />} />
      <Route path="boost-management" element={<BoostManagementScreen />} />
      <Route path="bids" element={<BidsScreen />} />
      <Route path="iso-requests/:id" element={<ISORequestDetailScreen />} />
      <Route path="chat-request/:id" element={<ChatRequestScreen />} />
      <Route path="create-bid-select-car" element={<CreateBidSelectCarScreen />} />
      <Route path="add-car" element={<AddVehicleScreen />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);