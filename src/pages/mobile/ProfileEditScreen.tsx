import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, User, Building, MapPin, FileText, Phone } from 'lucide-react';
import { SuperArrowsIcon } from '@/components/common/SuperArrowsIcon';
import { useNavigate, useLocation } from 'react-router-dom';
import { dealerClient } from '@/integrations/supabase/dealerClient';
import { useAuth } from '@/contexts/AuthContext';
import { formatPhoneDisplay } from '@/utils/phoneValidation';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import { GradientSeparator } from '@/components/ui/gradient-separator';

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
    <div className="flex flex-col h-screen overflow-hidden" dir="rtl">
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-md mx-auto px-4 py-6 space-y-4">
          <div className="flex items-center gap-2">
            <div 
              onClick={() => navigate(-1)}
              className={`h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
            </div>
            <h1 className="text-2xl font-bold text-foreground hebrew-text">
              {isOnboarding ? 'השלמת פרטים' : 'עריכת פרטים'}
            </h1>
          </div>

      <GradientBorderContainer
        className="rounded-md flex-1"
      >
        <Card className="p-6 space-y-6 bg-black border-0 rounded-md">
          {/* SVG Gradient Definition for Icons */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2277ee" />
                <stop offset="100%" stopColor="#5be1fd" />
              </linearGradient>
            </defs>
          </svg>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-white">
              {isOnboarding ? 'השלמת פרטים אישיים' : 'עריכת פרטים אישיים'}
            </h2>
            <p className="text-white/70 text-sm">
              {isOnboarding 
                ? 'אנא מלאו את הפרטים הבאים להשלמת ההרשמה'
                : 'עדכנו את הפרטים האישיים שלכם'}
            </p>
          </div>


          <div className="space-y-4">
            {/* Phone Number (Read-Only) */}
            {userData?.phone_number && (
              <>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex items-center space-x-2 space-x-reverse flex-shrink-0 min-w-[100px]">
                    <Phone className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
                    <Label htmlFor="phone" className="text-base font-bold text-white hebrew-text">טלפון:</Label>
                  </div>
                  <div className="flex-1">
                    <Input 
                      id="phone" 
                      type="text" 
                      value={formatPhoneDisplay(userData.phone_number)}
                      disabled
                      className="text-right bg-muted border-0" 
                      dir="rtl"
                    />
                  </div>
                </div>
                <GradientSeparator />
              </>
            )}

            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse flex-shrink-0 min-w-[100px]">
                <User className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
                <Label htmlFor="fullName" className="text-base font-bold text-white hebrew-text">שם מלא:</Label>
              </div>
              <div className="flex-1">
                <GradientBorderContainer className="rounded-md">
                  <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="הזן שם מלא" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    className="bg-black border-0 text-right hebrew-text text-white" 
                    dir="rtl"
                  />
                </GradientBorderContainer>
              </div>
            </div>

            <GradientSeparator />

            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse flex-shrink-0 min-w-[100px]">
                <Building className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
                <Label htmlFor="businessName" className="text-base font-bold text-white hebrew-text">שם העסק:</Label>
              </div>
              <div className="flex-1">
                <GradientBorderContainer className="rounded-md">
                  <Input 
                    id="businessName" 
                    type="text" 
                    placeholder="הזן שם עסק" 
                    value={businessName} 
                    onChange={(e) => setBusinessName(e.target.value)} 
                    className="bg-black border-0 text-right hebrew-text text-white" 
                    dir="rtl"
                  />
                </GradientBorderContainer>
              </div>
            </div>

            <GradientSeparator />

            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse flex-shrink-0 min-w-[100px]">
                <MapPin className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
                <Label htmlFor="location" className="text-base font-bold text-white hebrew-text">מיקום:</Label>
              </div>
              <div className="flex-1">
                <GradientBorderContainer className="rounded-md">
                  <Select value={locationId} onValueChange={setLocationId}>
                    <SelectTrigger className="bg-black border-0 text-right text-white">
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
                </GradientBorderContainer>
              </div>
            </div>

            <GradientSeparator />

            <div className="space-y-2">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <FileText className="h-4 w-4" style={{ stroke: 'url(#icon-gradient)' }} />
                <Label htmlFor="description" className="text-base font-bold text-white hebrew-text">תיאור</Label>
              </div>
              <GradientBorderContainer className="rounded-md">
                <Textarea 
                  id="description" 
                  placeholder="ספר קצת על העסק שלך..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="bg-black border-0 text-right min-h-[100px] hebrew-text text-white" 
                  dir="rtl"
                />
              </GradientBorderContainer>
            </div>


            <Button 
              onClick={handleSave}
              disabled={!fullName.trim() || !businessName.trim() || isLoading}
              className="w-full gap-2 bg-gradient-to-r from-[#2277ee] to-[#5be1fd] text-black hover:from-[#5be1fd] hover:to-[#2277ee] border-0"
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
          <>
            <GradientSeparator />
            <div className="text-center">
              <p className="text-xs text-white/70 hebrew-text">
                לאחר השלמת ההרשמה, תועברו למסך המתנה לאישור מנהל
              </p>
            </div>
          </>
        )}
            </Card>
          </GradientBorderContainer>
        </div>
      </div>
    </div>
  );
};
