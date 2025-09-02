import { MessageCircle, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const MobileHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
      <div className="container max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 space-x-reverse hover:opacity-80 transition-opacity"
          >
            <img 
              src="/lovable-uploads/5f941758-f133-4982-a8a0-3da09c4677f5.png" 
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
          <div className="relative cursor-pointer" onClick={() => navigate("/chats")}>
            <MessageCircle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 min-w-5 text-xs rounded-full p-0 flex items-center justify-center">
              3
            </Badge>
          </div>

          {/* Notifications Icon with Badge */}
          <div className="relative cursor-pointer" onClick={() => navigate("/notifications")}>
            <Bell className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 min-w-5 text-xs rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground">
              7
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;