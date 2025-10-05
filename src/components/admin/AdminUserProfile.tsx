import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminUserProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAdminAuth();

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['admin-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, business_name')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch user roles
  const { data: roles } = useQuery({
    queryKey: ['admin-roles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleLogout = async () => {
    await signOut();
    toast.success("התנתקת בהצלחה");
    navigate("/admin/login");
  };

  const displayName = profile?.business_name || profile?.full_name || 'משתמש';
  const roleLabel = roles?.some(r => r.role === 'admin') ? 'מנהל מערכת' : 
                    roles?.some(r => r.role === 'support') ? 'תמיכה' : 'סוחר';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 pr-2">
          <div className="text-right hebrew-text">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="hebrew-text">
          <User className="ml-2 h-4 w-4" />
          הפרופיל שלי
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hebrew-text text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="ml-2 h-4 w-4" />
          התנתק
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminUserProfile;
