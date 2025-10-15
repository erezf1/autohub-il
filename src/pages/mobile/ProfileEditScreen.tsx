import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Loader2, User, Building, MapPin, FileText, Crown, Calendar, Award } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { dealerClient } from '@/integrations/supabase/dealerClient';
import { useAuth } from '@/contexts/AuthContext';
import { formatPhoneDisplay } from '@/utils/phoneValidation';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { format } from "date-fns";
import { he } from "date-fns/locale";

export const ProfileEditScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [locationId, setLocationId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isOnboarding = location.state?.isOnboarding || false;

  // Fetch locations
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await dealerClient
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name_hebrew');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch user profile for subscription display
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile-for-edit'],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await dealerClient
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !isOnboarding && !!user?.id,
  });

  // Fetch phone number
  const { data: userData } = useQuery({
    queryKey: ['user-data', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await dealerClient
        .from('users')
        .select('phone_number')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch active vehicle count
  const { data: activeVehiclesCount } = useQuery({
    queryKey: ['active-vehicles-count-edit', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count, error } = await dealerClient
        .from('vehicle_listings')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('status', 'available');
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    // Load existing profile data if not onboarding and profile is loaded
    if (!isOnboarding && userProfile) {
      setFullName(userProfile.full_name || '');
      setBusinessName(userProfile.business_name || '');
      setLocationId(userProfile.location_id?.toString() || '');
    }
  }, [isOnboarding, userProfile]);

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

  const handleSave = async () => {
    if (!fullName.trim() || !businessName.trim()) {
      toast({
        title: 'שגיאה',
        description: 'נא למלא את כל השדות',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!user) {
        throw new Error('User not found');
      }

      // Update user profile
      const { error } = await dealerClient
        .from('user_profiles')
        .update({
          full_name: fullName,
          business_name: businessName,
          location_id: locationId ? parseInt(locationId) : null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'הפרטים נשמרו',
        description: 'הפרטים האישיים עודכנו בהצלחה',
      });

      if (isOnboarding) {
        // After onboarding, go to pending approval
        navigate('/mobile/pending-approval');
      } else {
        // Go back to previous page
        navigate(-1);
      }
    } catch (error: any) {
      toast({
        title: 'שגיאה בשמירה',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isLoadingProfile = !isOnboarding && !userProfile;

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4" dir="rtl">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)} 
          disabled={isLoading}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground hebrew-text">
          {isOnboarding ? 'השלמת פרטים' : 'עריכת פרטים'}
        </h1>
      </div>

      {/* Subscription Info (Only when not onboarding) */}
      {!isOnboarding && userProfile && (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Crown className="h-5 w-5 text-primary" />
                <span className="font-bold text-foreground hebrew-text">
                  {getSubscriptionLabel(userProfile?.subscription_type || 'regular')}
                </span>
              </div>
              <Badge variant="outline" className={`${getRatingTierColor(userProfile?.rating_tier || 'bronze')} border-current`}>
                <Award className="h-3 w-3 ml-1" />
                {getRatingTierLabel(userProfile?.rating_tier || 'bronze')}
              </Badge>
            </div>

            {userProfile?.subscription_valid_until && (
              <div className="flex items-center space-x-2 space-x-reverse text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground hebrew-text">
                  תוקף עד: {format(new Date(userProfile.subscription_valid_until), 'dd/MM/yyyy', { locale: he })}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground hebrew-text">רכבים פעילים</span>
              <span className="text-sm font-medium text-foreground">
                {activeVehiclesCount || 0}/{userProfile?.vehicles_limit || 0}
              </span>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">
              {isOnboarding ? 'השלמת פרטים אישיים' : 'עריכת פרטים אישיים'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isOnboarding 
                ? 'אנא מלאו את הפרטים הבאים להשלמת ההרשמה'
                : 'עדכנו את הפרטים האישיים שלכם'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Phone Number (Read-Only) */}
            {userData?.phone_number && (
              <div className="space-y-2">
                <Label htmlFor="phone">טלפון</Label>
                <div className="relative">
                  <Input 
                    id="phone" 
                    type="text" 
                    value={formatPhoneDisplay(userData.phone_number)}
                    disabled
                    className="pr-10 text-right bg-muted" 
                    dir="rtl"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">שם מלא</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="fullName" 
                  type="text" 
                  placeholder="הזן שם מלא" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  className="pr-10 text-right" 
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">שם העסק</Label>
              <div className="relative">
                <Building className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="businessName" 
                  type="text" 
                  placeholder="הזן שם עסק" 
                  value={businessName} 
                  onChange={(e) => setBusinessName(e.target.value)} 
                  className="pr-10 text-right" 
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">מיקום</Label>
              <div className="relative">
                <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <Select value={locationId} onValueChange={setLocationId}>
                  <SelectTrigger className="pr-10 text-right">
                    <SelectValue placeholder="בחר מיקום" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map(loc => (
                      <SelectItem key={loc.id} value={loc.id.toString()}>
                        {loc.name_hebrew}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור</Label>
              <div className="relative">
                <FileText className="absolute right-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                <Textarea 
                  id="description" 
                  placeholder="ספר קצת על העסק שלך..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="pr-10 text-right min-h-[100px] hebrew-text" 
                  dir="rtl"
                />
              </div>
            </div>

            <Button 
              onClick={handleSave}
              disabled={!fullName.trim() || !businessName.trim() || isLoading}
              className="w-full gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
              {isLoading ? 'שומר...' : isOnboarding ? 'סיים הרשמה' : 'שמור שינויים'}
            </Button>
          </div>

        {isOnboarding && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground hebrew-text">
              לאחר השלמת ההרשמה, תועברו למסך המתנה לאישור מנהל
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
