import { useState } from "react";
import { User, Building, Phone, MapPin, Edit3, Loader2, Crown, Calendar, Award, Flame, Gavel, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/mobile/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { he } from "date-fns/locale";

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

  const getSubscriptionLabel = (type: string) => {
    switch(type) {
      case 'silver': return 'כסף';
      case 'unlimited': return 'בלתי מוגבל';
      case 'regular': 
      default: return 'רגיל';
    }
  };

  const getRatingTierLabel = (tier: string) => {
    switch(tier) {
      case 'gold': return 'זהב';
      case 'silver': return 'כסף';
      case 'bronze': 
      default: return 'ברונזה';
    }
  };

  const getRatingTierColor = (tier: string) => {
    switch(tier) {
      case 'gold': return 'text-yellow-600';
      case 'silver': return 'text-gray-600';
      case 'bronze': 
      default: return 'text-orange-700';
    }
  };

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

      {/* Subscription & Status Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium hebrew-text text-muted-foreground">
                סוג מנוי
              </Label>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Crown className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold text-foreground hebrew-text">
                  {getSubscriptionLabel(profile?.subscription_type || 'regular')}
                </span>
              </div>
            </div>
            <Badge variant="outline" className={`${getRatingTierColor(profile?.rating_tier || 'bronze')} border-current`}>
              <Award className="h-3 w-3 ml-1" />
              {getRatingTierLabel(profile?.rating_tier || 'bronze')}
            </Badge>
          </div>

          {profile?.subscription_valid_until && (
            <div className="flex items-center space-x-2 space-x-reverse pt-2 border-t">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground hebrew-text">
                תוקף עד: {format(new Date(profile.subscription_valid_until), 'dd/MM/yyyy', { locale: he })}
              </span>
            </div>
          )}

          {/* Subscription Resources */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">{profile?.available_boosts || 0}</div>
              <div className="text-xs text-muted-foreground hebrew-text">בוסטים</div>
            </div>
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center">
                <Gavel className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">{profile?.available_auctions || 0}</div>
              <div className="text-xs text-muted-foreground hebrew-text">מכרזים</div>
            </div>
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center">
                <Car className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">{profile?.vehicles_limit || 0}</div>
              <div className="text-xs text-muted-foreground hebrew-text">רכבים</div>
            </div>
          </div>
        </CardContent>
      </Card>

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

          {/* Tenure */}
          {profile?.tenure !== undefined && profile.tenure > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium hebrew-text">
                ותק במערכת
              </Label>
              <span className="text-foreground hebrew-text">
                {profile.tenure} {profile.tenure === 1 ? 'חודש' : 'חודשים'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfileScreen;