import { Search, FileText, Plus, Gavel, User } from "lucide-react";
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
    icon: Plus,
    path: "/mobile/hot-cars"
  },
  {
    id: "bids",
    label: "הצעות מחיר",
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

  const getAddButtonAction = () => {
    // Always add car to repository
    return "/mobile/add-vehicle";
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="container max-w-md mx-auto">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path || 
              (tab.path === "/mobile/search" && (location.pathname === "/mobile" || location.pathname === "/mobile/")) ||
              (tab.path === "/mobile/car-search-requests" && location.pathname === "/mobile/car-search-requests");
            
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
                <Icon className={cn(
                  "h-5 w-5",
                  tab.id === "add" && "h-6 w-6"
                )} />
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