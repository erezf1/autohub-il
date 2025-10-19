import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/mobile/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MobilePageTitle } from "@/components/mobile";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { 
  User, 
  Building2, 
  Phone, 
  MapPin, 
  FileText,
  Calendar,
  Package,
  Zap,
  Gavel,
  Car
} from "lucide-react";
import { dealerClient } from "@/integrations/supabase/dealerClient";
import { useQuery } from "@tanstack/react-query";

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
    <div className="space-y-5">
      <MobilePageTitle
        title="הפרופיל שלי"
        onBack={() => navigate(-1)}
        rightAction={
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/mobile/profile/edit")}
            className="hebrew-text"
          >
            ערוך
          </Button>
        }
      />

      {/* Subscription Details Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold hebrew-text">פרטי מנוי</CardTitle>
        </CardHeader>
        <Separator className="opacity-30" />
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary/80" />
              <div>
                <p className="text-sm font-medium text-foreground/70 hebrew-text">סוג מנוי</p>
                <p className="font-medium text-foreground hebrew-text">{getSubscriptionLabel(profile.subscription_type)}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-3 opacity-30" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary/80" />
              <div>
                <p className="text-sm font-medium text-foreground/70 hebrew-text">תוקף המנוי</p>
                <p className="font-medium text-foreground hebrew-text">
                  {profile.subscription_valid_until 
                    ? new Date(profile.subscription_valid_until).toLocaleDateString('he-IL')
                    : 'לא מוגדר'}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-3 opacity-30" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary/80" />
              <div>
                <p className="text-sm font-medium text-foreground/70 hebrew-text">בוסטים זמינים</p>
                <p className="font-medium text-foreground hebrew-text">{profile.available_boosts || 0}</p>
              </div>
            </div>
          </div>

          <Separator className="my-3 opacity-30" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gavel className="h-5 w-5 text-primary/80" />
              <div>
                <p className="text-sm font-medium text-foreground/70 hebrew-text">מכרזים זמינים</p>
                <p className="font-medium text-foreground hebrew-text">{profile.available_auctions || 0}</p>
              </div>
            </div>
          </div>

          <Separator className="my-3 opacity-30" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-primary/80" />
              <div>
                <p className="text-sm font-medium text-foreground/70 hebrew-text">מכסת רכבים</p>
                <p className="font-medium text-foreground hebrew-text">{activeVehicles || 0} / {profile.vehicles_limit || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Details Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold hebrew-text">פרטים אישיים</CardTitle>
        </CardHeader>
        <Separator className="opacity-30" />
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary/80" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground/70 hebrew-text">שם העסק</p>
              <p className="font-medium text-foreground hebrew-text">{profile.business_name}</p>
            </div>
          </div>

          <Separator className="my-3 opacity-30" />

          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary/80" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground/70 hebrew-text">שם מלא</p>
              <p className="font-medium text-foreground hebrew-text">{profile.full_name}</p>
            </div>
          </div>

          <Separator className="my-3 opacity-30" />

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary/80" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground/70 hebrew-text">טלפון</p>
              <p className="font-medium text-foreground hebrew-text" dir="ltr">{phoneNumber || 'לא זמין'}</p>
            </div>
          </div>

          <Separator className="my-3 opacity-30" />

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary/80" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground/70 hebrew-text">מיקום</p>
              <p className="font-medium text-foreground hebrew-text">
                {profile.location?.name_hebrew || 'לא מוגדר'}
              </p>
            </div>
          </div>

          <Separator className="my-3 opacity-30" />

          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary/80" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground/70 hebrew-text">רישיון עוסק מורשה</p>
              <p className="font-medium text-foreground hebrew-text">{profile.trade_license_number || 'לא מוגדר'}</p>
            </div>
          </div>

          <Separator className="my-3 opacity-30" />

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary/80" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground/70 hebrew-text">ותק</p>
              <p className="font-medium text-foreground hebrew-text">
                {getRatingTierLabel(profile.rating_tier)}
                <span className={`mr-2 ${getRatingTierColor(profile.rating_tier)}`}>
                  ({profile.rating_tier})
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfileScreen;
