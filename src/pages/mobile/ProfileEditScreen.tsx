import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Loader2, User, Building } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const ProfileEditScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const isOnboarding = location.state?.isOnboarding || false;

  useEffect(() => {
    // Load existing profile data if not onboarding
    const loadProfile = async () => {
      if (!isOnboarding) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('full_name, business_name')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setFullName(profile.full_name || '');
            setBusinessName(profile.business_name || '');
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col" dir="rtl">
      <div className="bg-white shadow-sm px-4 py-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="gap-2"
            disabled={isLoading}
          >
            <ArrowRight className="w-4 h-4" />
            {isOnboarding ? 'חזור' : 'ביטול'}
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">Auto-Hub</h1>
            <p className="text-muted-foreground">
              {isOnboarding ? 'השלמת פרטים' : 'עריכת פרטים'}
            </p>
          </div>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
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
              <p className="text-xs text-muted-foreground">
                לאחר השלמת ההרשמה, תועברו למסך המתנה לאישור מנהל
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="bg-gray-50 px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground">© 2024 Auto-Hub. כל הזכויות שמורות.</p>
      </div>
    </div>
  );
};
