import { Search, FileText, Flame, Gavel, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "search",
    label: "מאגר הרכבים",
    icon: Search,
    path: "/mobile/search"
  },
  {
    id: "required-cars",
    label: "חיפוש רכבים",
    icon: FileText,
    path: "/mobile/required-cars"
  },
  {
    id: "hot-cars",
    label: "רכבים חמים",
    icon: Flame,
    path: "/mobile/hot-cars"
  },
  {
    id: "bids",
    label: "מכרזים",
    icon: Gavel,
    path: "/mobile/bids"
  },
  {
    id: "profile",
    label: "הפרופיל שלי",
    icon: User,
    path: "/mobile/profile"
  }
];

const MobileTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-card/95 border-t border-border/50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="container max-w-md mx-auto">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path || 
              (tab.path === "/mobile/search" && (location.pathname === "/mobile" || location.pathname === "/mobile/"));
            
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 transition-colors hebrew-text relative",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />}
                <Icon className="h-6 w-6" />
                <span className={cn(
                  "text-[11px]",
                  isActive ? "font-bold" : "font-semibold"
                )}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default MobileTabBar;