import { Routes, Route, Outlet } from "react-router-dom";

// Layouts and Protected Routes
import AdminDesktopLayout from "@/components/admin/AdminDesktopLayout";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";

// Page Imports
import AdminLoginScreen from "@/pages/admin/AdminLoginScreen";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsersList from "@/pages/admin/AdminUsersList";
import AdminVehiclesList from "@/pages/admin/AdminVehiclesList";
import AdminVehicleDetail from "@/pages/admin/AdminVehicleDetail";
import AdminEditVehicle from "@/pages/admin/AdminEditVehicle";
import AdminAddVehicle from "@/pages/admin/AdminAddVehicle";
import AdminVehicleRequestsList from "@/pages/admin/AdminVehicleRequestsList";
import AdminAuctionsList from "@/pages/admin/AdminAuctionsList";
import AdminSupportTickets from "@/pages/admin/AdminSupportTickets";
import AdminReports from "@/pages/admin/AdminReports";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminUserDetail from "@/pages/admin/AdminUserDetail";
import AdminCreateUser from "@/pages/admin/AdminCreateUser";
import AdminEditUser from "@/pages/admin/AdminEditUser";
import AdminVehicleRequestDetail from "@/pages/admin/AdminVehicleRequestDetail";
import AdminAuctionDetail from "@/pages/admin/AdminAuctionDetail";
import AdminSupportTicketDetail from "@/pages/admin/AdminSupportTicketDetail";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import AdminPrivateUsersList from "@/pages/admin/AdminPrivateUsersList";
import AdminPrivateUserDetail from "@/pages/admin/AdminPrivateUserDetail";

export const AdminRoutes = () => (
  <Routes>
    {/* Path is relative to /admin. e.g., /admin/login */}
    <Route path="login" element={<AdminLoginScreen />} />
    
    {/* All other admin routes are protected and use the desktop layout */}
    <Route 
      element={
        <ProtectedAdminRoute>
          <AdminDesktopLayout>
            <Outlet />
          </AdminDesktopLayout>
        </ProtectedAdminRoute>
      }
    >
      <Route index element={<AdminDashboard />} /> {/* Matches /admin */}
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
    </Route>
  </Routes>
);