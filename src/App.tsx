import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import AdminLayout from "./components/admin/AdminLayout";

// Import all screens
import DashboardScreen from "./pages/DashboardScreen";
import CarSearchScreen from "./pages/CarSearchScreen";
import ChatListScreen from "./pages/ChatListScreen";
import NotificationListScreen from "./pages/NotificationListScreen";
import AuctionListScreen from "./pages/AuctionListScreen";
import MyProfileScreen from "./pages/MyProfileScreen";
import ISORequestsScreen from "./pages/ISORequestsScreen";
import NotFound from "./pages/NotFound";

// Import admin screens
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersList from "./pages/admin/AdminUsersList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/search" element={<CarSearchScreen />} />
            <Route path="/chats" element={<ChatListScreen />} />
            <Route path="/notifications" element={<NotificationListScreen />} />
            <Route path="/auctions" element={<AuctionListScreen />} />
            <Route path="/profile" element={<MyProfileScreen />} />
            <Route path="/car-search-requests" element={<ISORequestsScreen />} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/users" element={<AdminUsersList />} />
                  <Route path="/vehicles" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">ניהול רכבים</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
                  <Route path="/vehicle-requests" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">רכבים דרושים</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
                  <Route path="/auctions" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">מכירות פומביות</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
                  <Route path="/support" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">פניות תמיכה</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
                  <Route path="/reports" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">דוחות</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
                  <Route path="/settings" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">הגדרות</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
                </Routes>
              </AdminLayout>
            } />
            
            {/* Placeholder routes for navigation */}
            <Route path="/add-car" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">הוספת רכב חדש</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
            <Route path="/add-auction" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">הוספת מכירה פומבית</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
            <Route path="/chat/:id" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">צ'אט</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
            <Route path="/vehicle/:id" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">פרטי רכב</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
            <Route path="/auction/:id" element={<div className="text-center py-12 hebrew-text"><h2 className="text-xl font-bold">מכירה פומבית</h2><p className="text-muted-foreground mt-2">בקרוב...</p></div>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
