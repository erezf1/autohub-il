import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { formatPhoneDisplay } from '@/utils/phoneValidation';
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { GradientSeparator } from "@/components/ui/gradient-separator";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/mobile/useProfile";
import { useQuery } from "@tanstack/react-query";
import { dealerClient } from "@/integrations/supabase/dealerClient";
import { LoadingSpinner, PageContainer, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit3, Crown, Award, Calendar, Flame, Gavel, Car, Building, User, Phone, MapPin } from "lucide-react";

const MyProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  
  // Fetch phone from users table
  const { data: phoneData, isLoading: phoneLoading } = useQuery({
    queryKey: ['user-phone', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await dealerClient
        .from('users')
        .select('phone_number')
        .eq('id', user.id)
        .single();
      return data?.phone_number;
    },
    enabled: !!user?.id,
  });

  const phoneNumber = phoneData;

  // Fetch active vehicle count
  const { data: activeVehicles } = useQuery({
    queryKey: ['active-vehicles-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await dealerClient
        .from('vehicle_listings')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('status', 'available');
      
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const isLoading = profileLoading || phoneLoading;

  if (isLoading || !profile) {
    return <LoadingSpinner />;
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
        <div className="flex items-center gap-2">
          <div 
            onClick={() => navigate('/mobile/dashboard')}
            className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
          >
            <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
          </div>
          <h1 className="text-2xl font-bold text-foreground hebrew-text">הפרופיל שלי</h1>
        </div>
        <GradientBorderContainer
          className="rounded-md"
        >
          <Button 
            onClick={() => navigate('/mobile/profile-edit')} 
            variant="ghost" 
            size="sm"
            className="bg-black border-0 text-white"
          >
            <Edit3 className="h-5 w-5 ml-1" />
            ערוך פרופיל
          </Button>
        </GradientBorderContainer>
      </div>

      {/* Subscription & Status Card */}
      <GradientBorderContainer
        className="rounded-md flex-1"
      >
        <Card className="bg-black border-0 rounded-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium hebrew-text text-white">
                  סוג מנוי
                </Label>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Crown className="h-5 w-5 text-primary" />
                  <span className="text-lg font-bold text-white hebrew-text">
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
              <>
                <GradientSeparator className="mt-2" />
                <div className="flex items-center space-x-2 space-x-reverse pt-2">
                  <Calendar className="h-4 w-4 text-white" />
                  <span className="text-sm text-white hebrew-text">
                    תוקף עד: {format(new Date(profile.subscription_valid_until), 'dd/MM/yyyy', { locale: he })}
                  </span>
                </div>
              </>
            )}

            {/* Subscription Resources */}
            <GradientSeparator className="mt-4" />
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-white">{profile?.available_boosts || 0}</div>
                <div className="text-xs text-white hebrew-text">בוסטים</div>
              </div>
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-white">{profile?.available_auctions || 0}</div>
                <div className="text-xs text-white hebrew-text">מכרזים</div>
              </div>
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center">
                  <Car className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {activeVehicles || 0}/{profile?.vehicles_limit || 0}
                </div>
                <div className="text-xs text-white hebrew-text">רכבים פעילים</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Profile Information */}
      <GradientBorderContainer
        className="rounded-md flex-1"
      >
        <Card className="bg-black border-0 rounded-md">
          <CardContent className="p-6">
          {/* SVG Gradient Definition for Icons */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2277ee" />
                <stop offset="100%" stopColor="#5be1fd" />
              </linearGradient>
            </defs>
          </svg>

          <div className="space-y-4">
          {/* Business Name */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <Building className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
            <Label className="text-base font-bold hebrew-text">
              שם העסק:
            </Label>
            <span className="text-sm text-foreground hebrew-text">{profile?.business_name || 'לא הוגדר'}</span>
          </div>

          <GradientSeparator />

          {/* Full Name */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <User className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
            <Label className="text-base font-bold hebrew-text">
              שם מלא:
            </Label>
            <span className="text-sm text-foreground hebrew-text">{profile?.full_name || 'לא הוגדר'}</span>
          </div>

          <GradientSeparator />

          {/* Phone */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <Phone className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
            <Label className="text-base font-bold hebrew-text">
              טלפון:
            </Label>
            <span className="text-sm text-foreground hebrew-text">
              {phoneNumber ? formatPhoneDisplay(phoneNumber) : 'לא הוגדר'}
            </span>
          </div>

          <GradientSeparator />

          {/* Location */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <MapPin className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
            <Label className="text-base font-bold hebrew-text">
              מיקום:
            </Label>
            <span className="text-sm text-foreground hebrew-text">
              {profile?.location?.name_hebrew || 'לא הוגדר'}
            </span>
          </div>

          {/* License Number */}
          {profile?.trade_license_number && (
            <>
              <GradientSeparator />
              <div className="flex items-center space-x-2 space-x-reverse">
                <Label className="text-base font-bold hebrew-text">
                  מספר רישיון עסק:
                </Label>
                <span className="text-sm text-foreground hebrew-text">{profile.trade_license_number}</span>
              </div>
            </>
          )}

          {/* Tenure */}
          {profile?.tenure !== undefined && profile.tenure > 0 && (
            <>
              <GradientSeparator />
              <div className="flex items-center space-x-2 space-x-reverse">
                <Label className="text-base font-bold hebrew-text">
                  ותק במערכת:
                </Label>
                <span className="text-sm text-foreground hebrew-text">
                  {profile.tenure} {profile.tenure === 1 ? 'חודש' : 'חודשים'}
                </span>
              </div>
            </>
          )}
          </div>
        </CardContent>
      </Card>
      </GradientBorderContainer>
    </div>
  );
};

export default MyProfileScreen;
