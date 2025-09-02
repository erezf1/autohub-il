import { useState, ReactNode } from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background" dir="rtl">
      {/* Sidebar */}
      <AdminSidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header - Fixed */}
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2">
                  <h3 className="font-medium mb-2 hebrew-text">התראות אחרונות</h3>
                  <div className="space-y-2">
                    <div className="p-2 text-sm bg-muted rounded hebrew-text">
                      סוחר חדש "אוטו גל" ממתין לאישור
                    </div>
                    <div className="p-2 text-sm bg-muted rounded hebrew-text">
                      דיווח חדש נגד סוחר #345
                    </div>
                    <div className="p-2 text-sm bg-muted rounded hebrew-text">
                      מכירה פומבית הסתיימה
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hebrew-text">ישראל ישראלי</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="hebrew-text">
                  הפרופיל שלי
                </DropdownMenuItem>
                <DropdownMenuItem className="hebrew-text">
                  התנתק
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer - Fixed */}
        <footer className="h-12 border-t bg-card px-6 flex items-center justify-center sticky bottom-0 z-40">
          <p className="text-sm text-muted-foreground hebrew-text">
            © 2024 אוטו-האב. כל הזכויות שמורות.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;