import { MessageCircle, Bell, User, Globe, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/mobile/useProfile";
import logo from "/src/assets/logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

const MobileHeader = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile } = useProfile();

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-border shadow-sm">
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
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* Chat Icon with Badge */}
          <div className="relative cursor-pointer" onClick={() => navigate("/mobile/chats")}>
            <MessageCircle className="h-6 w-6 text-muted-foreground icon-hover-cyan transition-colors" />
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 min-w-5 text-xs rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-[#5be1fd] to-[#2277ee] text-black border-0">
              3
            </Badge>
          </div>

          {/* Notifications Icon with Badge */}
          <div className="relative cursor-pointer" onClick={() => navigate("/mobile/notifications")}>
            <Bell className="h-6 w-6 text-muted-foreground icon-hover-cyan transition-colors" />
            <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 min-w-5 text-xs rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-[#5be1fd] to-[#2277ee] text-black border-0">
              7
            </Badge>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <User className="h-7 w-7 text-muted-foreground icon-hover-cyan transition-colors" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-56 bg-black border-0 shadow-lg p-0"
              style={{
                background: 'linear-gradient(135deg, #000000 0%, #000000 100%)',
                border: '1px solid transparent',
                backgroundImage: 'linear-gradient(#000000, #000000), linear-gradient(135deg, #2277ee, #5be1fd)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'content-box, border-box',
                boxShadow: '0 4px 12px rgba(34, 119, 238, 0.15)'
              }}
            >
              <DropdownMenuLabel className="hebrew-text text-white px-2 py-1 text-center">
                {profile?.business_name || 'משתמש'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem disabled className="hebrew-text text-gray-300 px-1 py-1 justify-center">
                <Globe className="ml-2 h-4 w-4" />
                <span>שפה (בקרוב)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                  navigate("/mobile/welcome");
                }}
                className="hebrew-text text-white btn-hover-cyan px-1 py-1 justify-center"
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