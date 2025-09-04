import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Landing Page
import LandingPage from "./pages/LandingPage";

// Mobile Layout and Pages
import MobileLayout from "./components/mobile/MobileLayout";
import DashboardScreen from "./pages/mobile/DashboardScreen";
import CarSearchScreen from "./pages/mobile/CarSearchScreen";
import ChatListScreen from "./pages/mobile/ChatListScreen";
import NotificationListScreen from "./pages/mobile/NotificationListScreen";
import AuctionListScreen from "./pages/mobile/AuctionListScreen";
import MyProfileScreen from "./pages/mobile/MyProfileScreen";
import ISORequestsScreen from "./pages/mobile/ISORequestsScreen";
import NotFound from "./pages/mobile/NotFound";

// Admin Layout and Pages
import AdminDesktopLayout from "./components/admin/AdminDesktopLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersList from "./pages/admin/AdminUsersList";
import AdminVehiclesList from "./pages/admin/AdminVehiclesList";
import AdminVehicleDetail from "./pages/admin/AdminVehicleDetail";
import AdminVehicleRequestsList from "./pages/admin/AdminVehicleRequestsList";
import AdminAuctionsList from "./pages/admin/AdminAuctionsList";
import AdminSupportTickets from "./pages/admin/AdminSupportTickets";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminVehicleRequestDetail from "./pages/admin/AdminVehicleRequestDetail";
import AdminAuctionDetail from "./pages/admin/AdminAuctionDetail";
import AdminSupportTicketDetail from "./pages/admin/AdminSupportTicketDetail";
import AdminNotifications from "./pages/admin/AdminNotifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Routes - Must come before mobile catch-all */}
          <Route path="/admin/*" element={
            <AdminDesktopLayout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/notifications" element={<AdminNotifications />} />
                <Route path="/users" element={<AdminUsersList />} />
                <Route path="/users/:id" element={<AdminUserDetail />} />
                <Route path="/vehicles" element={<AdminVehiclesList />} />
                <Route path="/vehicles/:id" element={<AdminVehicleDetail />} />
                <Route path="/vehicle-requests" element={<AdminVehicleRequestsList />} />
                <Route path="/vehicle-requests/:id" element={<AdminVehicleRequestDetail />} />
                <Route path="/auctions" element={<AdminAuctionsList />} />
                <Route path="/auctions/:id" element={<AdminAuctionDetail />} />
                <Route path="/support" element={<AdminSupportTickets />} />
                <Route path="/support/:id" element={<AdminSupportTicketDetail />} />
                <Route path="/reports" element={<AdminReports />} />
                <Route path="/settings" element={<AdminSettings />} />
              </Routes>
            </AdminDesktopLayout>
          } />

          {/* Mobile Routes */}
          <Route path="/mobile/*" element={
            <MobileLayout>
              <Routes>
                <Route path="/" element={<DashboardScreen />} />
                <Route path="/search" element={<CarSearchScreen />} />
                <Route path="/chats" element={<ChatListScreen />} />
                <Route path="/notifications" element={<NotificationListScreen />} />
                <Route path="/auctions" element={<AuctionListScreen />} />
                <Route path="/profile" element={<MyProfileScreen />} />
                <Route path="/car-search-requests" element={<ISORequestsScreen />} />
                
                {/* Mobile placeholder routes */}
                <Route path="/add-car" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">הוספת רכב חדש</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
                <Route path="/add-auction" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">הוספת מכירה פומבית</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
                <Route path="/chat/:id" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">צ'אט</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
                <Route path="/vehicle/:id" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">פרטי רכב</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
                <Route path="/auction/:id" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">מכירה פומבית</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
                
                {/* Catch-all route for mobile */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MobileLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;