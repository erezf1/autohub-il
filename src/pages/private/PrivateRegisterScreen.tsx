import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Phone, User, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatPhoneDisplay } from '@/utils/phoneValidation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

export const PrivateRegisterScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [locationId, setLocationId] = useState<string>('');
  const [locations, setLocations] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user } = usePrivateAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/private/dashboard');
    }
  }, [user, navigate]);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name_hebrew');

      if (!error && data) {
        setLocations(data);
      }
    };

    fetchLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !phoneNumber.trim() || !locationId) {
      toast({
        title: 'שגיאה',
        description: 'נא למלא את כל השדות',
        variant: 'destructive',
      });
      return;
    }

    // Don't create user yet - just navigate to OTP verification
    // User will be created AFTER OTP is verified
    toast({
      title: 'קוד אימות נשלח',
      description: `נשלח קוד אימות ל-${formatPhoneDisplay(phoneNumber)}`,
    });

    navigate('/private/otp-verify', { 
      state: { 
        phone: phoneNumber,
        fullName,
        locationId: parseInt(locationId),
        isRegistration: true
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/private')}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          חזור
        </Button>
        <div className="flex-1 text-center">
          <Logo />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">הרשמה</h1>
            <p className="text-muted-foreground text-sm">
              צור חשבון חדש למכירת רכבים
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">שם מלא</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="יוסי כהן"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium">מספר טלפון</label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="050-123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pr-10"
                  dir="ltr"
                  maxLength={12}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                פורמט: 10 ספרות, מתחיל ב-05
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium">מיקום</label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Select value={locationId} onValueChange={setLocationId}>
                  <SelectTrigger className="pr-10">
                    <SelectValue placeholder="בחר מיקום" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.name_hebrew}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
            >
              <UserPlus className="w-4 h-4" />
              המשך
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">כבר יש לך חשבון? </span>
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => navigate('/private/login')}
            >
              התחבר
            </Button>
          </div>

          {/* Terms */}
          <div className="text-center text-xs text-muted-foreground">
            <p>באמצעות הרשמה, אתה מסכים</p>
            <p>לתנאי השימוש ומדיניות הפרטיות</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
