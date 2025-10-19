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
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-card/95 border-b border-border/50 shadow-sm">
      <div className="container max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <button 
            onClick={() => navigate("/mobile/dashboard")}
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src={logo}
              alt="AutoHub Logo" 
              className="h-12 w-auto"
            />
          </button>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-5 space-x-reverse">
          {/* Chat Icon with Badge */}
          <div className="relative cursor-pointer" onClick={() => navigate("/mobile/chats")}>
            <MessageCircle className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 min-w-[20px] text-xs font-semibold rounded-full p-0 flex items-center justify-center">
              3
            </Badge>
          </div>

          {/* Notifications Icon with Badge */}
          <div className="relative cursor-pointer" onClick={() => navigate("/mobile/notifications")}>
            <Bell className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 min-w-[20px] text-xs font-semibold rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-[#5be1fd] to-[#2277ee] text-white border-0">
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