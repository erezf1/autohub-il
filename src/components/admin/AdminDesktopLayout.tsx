import { ReactNode } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import AdminDesktopSidebar from "./AdminDesktopSidebar";
import AdminUserProfile from "./AdminUserProfile";

interface AdminDesktopLayoutProps {
  children: ReactNode;
}

const AdminDesktopLayout = ({ children }: AdminDesktopLayoutProps) => {
  return (
    <div className="h-screen w-full overflow-hidden" dir="rtl">
      {/* Fixed Admin Header */}
      <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/6daec4a1-44e1-4924-8b14-0ae85967e9a4.png" 
              alt="AutoHub Admin" 
              className="h-8 w-auto"
            />
            <div className="hebrew-text">
              <h1 className="font-bold text-lg text-primary">אוטו-האב</h1>
              <p className="text-xs text-muted-foreground">פאנל ניהול</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3">
                <h3 className="font-medium mb-3 hebrew-text">התראות אחרונות</h3>
                <div className="space-y-2">
                  <div className="p-3 text-sm bg-muted rounded-lg hebrew-text">
                    סוחר חדש "אוטו גל" ממתין לאישור
                  </div>
                  <div className="p-3 text-sm bg-muted rounded-lg hebrew-text">
                    דיווח חדש נגד סוחר #345
                  </div>
                  <div className="p-3 text-sm bg-muted rounded-lg hebrew-text">
                    מכירה פומבית הסתיימה - פורשה 911
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin Profile */}
          <AdminUserProfile />
        </div>
      </header>

      <div className="flex h-[calc(100vh-8rem)]">
        {/* Fixed Admin Sidebar */}
        <AdminDesktopSidebar />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-8">
          <div className="max-w-none mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Fixed Admin Footer */}
      <footer className="h-12 bg-card border-t border-border px-6 flex items-center justify-center sticky bottom-0 z-50">
        <p className="text-sm text-muted-foreground hebrew-text">
          © 2024 אוטו-האב - פאנל ניהול. כל הזכויות שמורות.
        </p>
      </footer>
    </div>
  );
};

export default AdminDesktopLayout;