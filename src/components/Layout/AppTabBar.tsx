import { Search, FileText, Plus, Gavel, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "search",
    label: "חיפוש",
    icon: Search,
    path: "/search"
  },
  {
    id: "iso",
    label: "חיפוש רכבים",
    icon: FileText,
    path: "/car-search-requests"
  },
  {
    id: "add",
    label: "הוסף",
    icon: Plus,
    path: "/add"
  },
  {
    id: "auctions",
    label: "מכירות פומביות",
    icon: Gavel,
    path: "/auctions"
  },
  {
    id: "profile",
    label: "הפרופיל שלי",
    icon: User,
    path: "/profile"
  }
];

const AppTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="container max-w-md mx-auto">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path || 
              (tab.path === "/search" && location.pathname === "/") ||
              (tab.path === "/car-search-requests" && location.pathname === "/car-search-requests");
            
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

export default AppTabBar;