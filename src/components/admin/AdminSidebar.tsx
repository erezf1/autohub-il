import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Car,
  Search,
  Gavel,
  HelpCircle,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { title: "דשבורד", url: "/admin", icon: LayoutDashboard },
  { title: "ניהול משתמשים", url: "/admin/users", icon: Users },
  { title: "ניהול רכבים", url: "/admin/vehicles", icon: Car },
  { title: "רכבים דרושים", url: "/admin/vehicle-requests", icon: Search },
  { title: "מכירות פומביות", url: "/admin/auctions", icon: Gavel },
  { title: "פניות תמיכה", url: "/admin/support", icon: HelpCircle },
  { title: "דוחות", url: "/admin/reports", icon: FileBarChart },
  { title: "הגדרות", url: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar = ({ collapsed, onToggle }: AdminSidebarProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={cn(
      "h-screen bg-card border-r flex flex-col transition-all duration-300 sticky top-0 z-50",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo and Toggle */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/5f941758-f133-4982-a8a0-3da09c4677f5.png" 
              alt="Auto Hub" 
              className="w-8 h-8"
            />
            <div className="hebrew-text">
              <h2 className="font-bold text-primary">אוטו-האב</h2>
              <p className="text-xs text-muted-foreground">פאנל ניהול</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-2"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {adminNavItems.map((item) => (
            <li key={item.url}>
              <NavLink
                to={item.url}
                className={({ isActive: navIsActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  (navIsActive || isActive(item.url)) 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <span className="hebrew-text">{item.title}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">מנ</span>
            </div>
            <div className="hebrew-text">
              <p className="text-sm font-medium">מנהל מערכת</p>
              <p className="text-xs text-muted-foreground">admin@auto-hub.co.il</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;