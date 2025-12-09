import { Routes, Route } from "react-router-dom";

// Layouts and Protected Routes
import { ProtectedPrivateRoute } from "@/components/private/ProtectedPrivateRoute";
import { PrivateLayout } from "@/components/private/PrivateLayout";

// Page Imports
import { PrivateWelcomeScreen } from "@/pages/private/PrivateWelcomeScreen";
import { PrivateLoginScreen } from "@/pages/private/PrivateLoginScreen";
import { PrivateRegisterScreen } from "@/pages/private/PrivateRegisterScreen";
import PrivateOTPVerificationScreen from "@/pages/private/PrivateOTPVerificationScreen";
import { PrivateDashboardScreen } from "@/pages/private/PrivateDashboardScreen";
import { PrivateMyVehiclesScreen } from "@/pages/private/PrivateMyVehiclesScreen";
import PrivateAddVehicleScreen from "@/pages/private/PrivateAddVehicleScreen";
import EditVehicleScreen from "@/pages/mobile/EditVehicleScreen"; // Assuming this is shared
import VehicleDetailScreen from "@/pages/mobile/VehicleDetailScreen"; // Assuming this is shared
import { PrivateProfileScreen } from "@/pages/private/PrivateProfileScreen";
import { PrivateProfileEditScreen } from "@/pages/private/PrivateProfileEditScreen";

export const PrivateRoutes = () => (
  <>
    {/* Private User Auth Routes - Not Protected */}
    <Route path="/private" element={<PrivateWelcomeScreen />} />
    <Route path="/private/login" element={<PrivateLoginScreen />} />
    <Route path="/private/register" element={<PrivateRegisterScreen />} />
    <Route path="/private/otp-verify" element={<PrivateOTPVerificationScreen />} />

    {/* Private User Protected Routes */}
    <Route path="/private/*" element={<ProtectedPrivateRoute><PrivateLayout /></ProtectedPrivateRoute>}>
      <Route path="dashboard" element={<PrivateDashboardScreen />} />
      <Route path="my-vehicles" element={<PrivateMyVehiclesScreen />} />
      <Route path="add-vehicle" element={<PrivateAddVehicleScreen />} />
      <Route path="edit-vehicle/:id" element={<EditVehicleScreen />} />
      <Route path="vehicle/:id" element={<VehicleDetailScreen />} />
      <Route path="profile" element={<PrivateProfileScreen />} />
      <Route path="profile/edit" element={<PrivateProfileEditScreen />} />
    </Route>
  </>
);