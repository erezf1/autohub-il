import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Loader2, User, Building, MapPin, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

export const ProfileEditScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [locationId, setLocationId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const isOnboarding = location.state?.isOnboarding || false;

  // Fetch locations
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name_hebrew');
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Load existing profile data if not onboarding
    const loadProfile = async () => {
      if (!isOnboarding) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setFullName(profile.full_name || '');
            setBusinessName(profile.business_name || '');
            setLocationId(profile.location_id?.toString() || '');
          }
        }
      }
    };
    
    loadProfile();
  }, [isOnboarding]);

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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not found');
      }

      // Update user profile
      const { error } = await supabase
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

  return (
    <div className="space-y-4" dir="rtl">
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
