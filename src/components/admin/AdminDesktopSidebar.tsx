import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  Users,
  Car,
  Search,
  Gavel,
  HelpCircle,
  FileBarChart,
  Settings,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  { 
    title: "דשבורד", 
    url: "/admin", 
    icon: LayoutDashboard,
    description: "מבט כללי על המערכת"
  },
  { 
    title: "עדכונים", 
    url: "/admin/notifications", 
    icon: Bell,
    description: "התראות ועדכונים"
  },
  { 
    title: "ניהול משתמשים", 
    url: "/admin/users", 
    icon: Users,
    description: "סוחרים ומשתמשים"
  },
  { 
    title: "ניהול רכבים", 
    url: "/admin/vehicles", 
    icon: Car,
    description: "מלאי רכבים"
  },
  { 
    title: "רכבים דרושים", 
    url: "/admin/vehicle-requests", 
    icon: Search,
    description: "בקשות לרכבים"
  },
  { 
    title: "מכירות פומביות", 
    url: "/admin/auctions", 
    icon: Gavel,
    description: "מכירות פומביות פעילות"
  },
  { 
    title: "פניות תמיכה", 
    url: "/admin/support", 
    icon: HelpCircle,
    description: "טיקטים ופניות"
  },
  { 
    title: "דוחות", 
    url: "/admin/reports", 
    icon: FileBarChart,
    description: "דוחות ואנליטיקס"
  },
  { 
    title: "הגדרות", 
    url: "/admin/settings", 
    icon: Settings,
    description: "הגדרות מערכת"
  },
];

const AdminDesktopSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={cn(
      "bg-card border-l border-border transition-all duration-300 flex flex-col",
      collapsed ? "w-20" : "w-80"
    )}>
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center"
        >
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            collapsed ? "rotate-90" : "-rotate-90"
          )} />
          {!collapsed && (
            <span className="mr-2 hebrew-text">צמצם תפריט</span>
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {adminNavItems.map((item) => (
            <li key={item.url}>
              <NavLink
                to={item.url}
                className={({ isActive: navIsActive }) => cn(
                  "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-primary/10 hover:text-primary group",
                  (navIsActive || isActive(item.url)) 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  collapsed ? "mx-auto" : ""
                )} />
                {!collapsed && (
                  <div className="flex-1 text-right hebrew-text">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs opacity-70 mt-0.5">{item.description}</div>
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin Info Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">מנ</span>
            </div>
            <div className="flex-1 text-right hebrew-text">
              <p className="text-sm font-medium">מנהל מערכת</p>
              <p className="text-xs text-muted-foreground">admin@auto-hub.co.il</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminDesktopSidebar;