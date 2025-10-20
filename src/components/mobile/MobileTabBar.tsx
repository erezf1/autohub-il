import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Import custom tab icons
import SearchTabIcon from "@/assets/Search-tab.svg";
import StarTabIcon from "@/assets/Star-tab.svg";
import HotTabIcon from "@/assets/Hot-tab.svg";
import BidTabIcon from "@/assets/Bid-tab.svg";
import ProfileTabIcon from "@/assets/Profile-tab.svg";

const tabs = [
  {
    id: "search",
    label: "מאגר הרכבים",
    icon: SearchTabIcon,
    path: "/mobile/search"
  },
  {
    id: "required-cars",
    label: "חיפוש רכבים",
    icon: StarTabIcon,
    path: "/mobile/required-cars"
  },
  {
    id: "hot-cars",
    label: "רכבים חמים",
    icon: HotTabIcon,
    path: "/mobile/hot-cars"
  },
  {
    id: "bids",
    label: "מכרזים",
    icon: BidTabIcon,
    path: "/mobile/bids"
  },
  {
    id: "profile",
    label: "הפרופיל שלי",
    icon: ProfileTabIcon,
    path: "/mobile/profile"
  }
];

const MobileTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-t border-border/20 shadow-lg">
      <div className="w-full max-w-[500px] mx-auto">
        <div className="flex h-16">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path || 
              (tab.path === "/mobile/search" && (location.pathname === "/mobile" || location.pathname === "/mobile/"));
            
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 transition-colors hebrew-text w-1/5 p-0",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground icon-hover-cyan"
                )}
              >
                <img src={tab.icon} alt={tab.label} className="h-9 w-9" />
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