import { MessageCircle, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
      <div className="container max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-xl font-bold text-primary hebrew-text">
            Auto-Net Dealers
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* Chat Icon with Badge */}
          <div className="relative">
            <MessageCircle className="h-6 w-6 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 min-w-5 text-xs rounded-full p-0 flex items-center justify-center">
              3
            </Badge>
          </div>

          {/* Notifications Icon with Badge */}
          <div className="relative">
            <Bell className="h-6 w-6 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
            <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 min-w-5 text-xs rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground">
              7
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;