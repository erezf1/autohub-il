import { useState } from "react";
import { User, Building, Phone, MapPin, Edit3, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/mobile/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const MyProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  
  // Fetch phone from users table
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user-data', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('users')
        .select('phone_number')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const isLoading = profileLoading || userLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground hebrew-text">הפרופיל שלי</h1>
        <Button onClick={() => navigate('/mobile/profile-edit')} variant="outline" size="sm">
          <Edit3 className="h-4 w-4 ml-1" />
          ערוך פרופיל
        </Button>
      </div>

      {/* Profile Information */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium hebrew-text">
              שם העסק
            </Label>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground hebrew-text">{profile?.business_name || 'לא הוגדר'}</span>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium hebrew-text">
              שם מלא
            </Label>
            <div className="flex items-center space-x-2 space-x-reverse">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground hebrew-text">{profile?.full_name || 'לא הוגדר'}</span>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="text-sm font-medium hebrew-text">
              טלפון
            </Label>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground hebrew-text">{userData?.phone_number || 'לא הוגדר'}</span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-sm font-medium hebrew-text">
              מיקום
            </Label>
            <div className="flex items-center space-x-2 space-x-reverse">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground hebrew-text">
                {profile?.location?.name_hebrew || 'לא הוגדר'}
              </span>
            </div>
          </div>

          {/* License Number */}
          {profile?.trade_license_number && (
            <div className="space-y-2">
              <Label className="text-sm font-medium hebrew-text">
                מספר רישיון עסק
              </Label>
              <span className="text-foreground hebrew-text">{profile.trade_license_number}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfileScreen;