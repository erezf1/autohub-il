import { Search, FileText, Flame, Gavel, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "search",
    label: "חיפוש רכבים",
    icon: Search,
    path: "/mobile/search"
  },
  {
    id: "required-cars",
    label: "רכבים מבוקשים",
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
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
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
                  "flex flex-col items-center justify-center space-y-1 transition-colors hebrew-text",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default MobileTabBar;