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
    <div className="h-screen w-full flex flex-col overflow-hidden fixed inset-0" dir="rtl">
      {/* Fixed Admin Header */}
      <header className="h-16 bg-black border-b border-border shadow-sm px-6 flex items-center justify-between flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img 
              src="/src/assets/logo.svg" 
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
                <Bell className="h-5 w-5 text-muted-foreground icon-hover-cyan transition-colors" />
                <Badge 
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-gradient-to-r from-[#5be1fd] to-[#2277ee] text-black border-0"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-black border-0 shadow-lg p-0" style={{
              background: 'linear-gradient(135deg, #000000 0%, #000000 100%)',
              border: '1px solid transparent',
              backgroundImage: 'linear-gradient(#000000, #000000), linear-gradient(135deg, #2277ee, #5be1fd)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'content-box, border-box',
              boxShadow: '0 4px 12px rgba(34, 119, 238, 0.15)'
            }}>
              <div className="p-3">
                <h3 className="font-medium mb-3 hebrew-text text-white">התראות אחרונות</h3>
                <div className="space-y-2">
                  <div className="p-3 text-sm bg-muted rounded-lg hebrew-text text-white">
                    סוחר חדש "אוטו גל" ממתין לאישור
                  </div>
                  <div className="p-3 text-sm bg-muted rounded-lg hebrew-text text-white">
                    דיווח חדש נגד סוחר #345
                  </div>
                  <div className="p-3 text-sm bg-muted rounded-lg hebrew-text text-white">
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

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Admin Sidebar */}
        <AdminDesktopSidebar />

        {/* Scrollable Content Area - ONLY this scrolls */}
        <main 
          className="flex-1 overflow-y-auto overflow-x-hidden bg-black p-8"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          <div className="max-w-none mx-auto">
            {children}
            {/* Bottom Spacer - Height of footer + 20px breathing room */}
            <div style={{ height: 'calc(3rem + 20px)' }} aria-hidden="true" />
          </div>
        </main>
      </div>

      {/* Fixed Admin Footer */}
      <footer className="h-12 bg-black/70 backdrop-blur-md border-t border-border/20 shadow-lg px-6 flex items-center justify-center flex-shrink-0 z-50">
        <p className="text-sm text-muted-foreground hebrew-text">
          © 2024 אוטו-האב - פאנל ניהול. כל הזכויות שמורות.
        </p>
      </footer>
    </div>
  );
};

export default AdminDesktopLayout;