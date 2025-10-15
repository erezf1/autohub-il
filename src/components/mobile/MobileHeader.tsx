import { MessageCircle, Bell, User, Globe, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/mobile/useProfile";
import logo from "@/assets/auto-hub-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MobileHeader = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile } = useProfile();

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
      <div className="container max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center">
          <button 
            onClick={() => navigate("/mobile/dashboard")}
            className="flex items-center space-x-3 space-x-reverse hover:opacity-80 transition-opacity"
          >
            <img 
              src={logo}
              alt="AutoHub Logo" 
              className="h-8 w-auto"
            />
            <div className="text-right">
              <div className="text-lg font-bold text-primary hebrew-text">
                אוטו-האב
              </div>
              <div className="text-xs text-muted-foreground hebrew-text">
                הבית לסוחרי הרכב
              </div>
            </div>
          </button>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* Chat Icon with Badge */}
          <div className="relative cursor-pointer" onClick={() => navigate("/mobile/chats")}>
            <MessageCircle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 min-w-5 text-xs rounded-full p-0 flex items-center justify-center">
              3
            </Badge>
          </div>

          {/* Notifications Icon with Badge */}
          <div className="relative cursor-pointer" onClick={() => navigate("/mobile/notifications")}>
            <Bell className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 min-w-5 text-xs rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground">
              7
            </Badge>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
              >
                <User className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="hebrew-text">
                {profile?.business_name || 'משתמש'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="hebrew-text">
                <Globe className="ml-2 h-4 w-4" />
                <span>שפה (בקרוב)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                  navigate("/mobile/welcome");
                }}
                className="hebrew-text"
              >
                <LogOut className="ml-2 h-4 w-4" />
                <span>התנתק</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;