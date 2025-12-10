import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, MapPin, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
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
import logo from '@/assets/dealers-logo.jpeg';

export const PrivateRegisterScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [locationId, setLocationId] = useState<string>('');
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

    // Validate phone format
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !cleanPhone.startsWith('05')) {
      toast({
        title: 'שגיאה',
        description: 'מספר טלפון לא תקין. נא להזין 10 ספרות המתחילות ב-05',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Send OTP via 019sms before navigating
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone: cleanPhone }
      });

      if (error || !data?.success) {
        toast({
          title: 'שגיאה',
          description: data?.error || 'שליחת הקוד נכשלה',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: 'קוד אימות נשלח',
        description: `נשלח קוד אימות ל-${formatPhoneDisplay(cleanPhone)}`,
      });

      navigate('/private/otp-verify', { 
        state: { 
          phone: cleanPhone,
          fullName,
          locationId: parseInt(locationId),
          isRegistration: true
        } 
      });
    } catch (error) {
      console.error('Send OTP error:', error);
      toast({
        title: 'שגיאה',
        description: 'שליחת הקוד נכשלה',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4 fixed inset-0" dir="rtl">
      <div className="w-full max-w-md my-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/private')}
            className="gap-2 text-gray-300 hover:text-white"
          >
            <ArrowRight className="w-4 h-4" />
            חזור
          </Button>
          <div className="text-center">
            <img 
              src={logo}
              alt="AutoHub Logo" 
              className="h-16 w-auto mx-auto mb-4"
            />
            <p className="text-gray-300 hebrew-text">הרשמה חדשה</p>
          </div>
          <div className="w-16"></div>
        </div>

        <GradientBorderContainer className="rounded-md">
          <Card className="w-full p-6 space-y-6 border-0 bg-black">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white hebrew-text">הרשמה למערכת</h2>
              <p className="text-gray-300 text-sm hebrew-text">
                צור חשבון חדש למכירת רכבים
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white hebrew-text">שם מלא</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="יוסי כהן"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pr-10 text-right bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white hebrew-text">מספר טלפון</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="050-123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pr-10 text-right bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    dir="ltr"
                    maxLength={12}
                  />
                </div>
                <p className="text-xs text-gray-400 hebrew-text">
                  פורמט: 10 ספרות, מתחיל ב-05
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white hebrew-text">מיקום</Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
                  <Select value={locationId} onValueChange={setLocationId}>
                    <SelectTrigger className="pr-10 text-right bg-gray-800 border-gray-700 text-white" id="location">
                      <SelectValue placeholder="בחר מיקום" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id.toString()} className="text-white">
                          {location.name_hebrew}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white hebrew-text"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
                {isLoading ? 'שולח קוד...' : 'המשך'}
              </Button>
            </form>

            <div className="border-t border-gray-700/50"></div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-300 hebrew-text">
                כבר יש לך חשבון?
              </p>
              <Button 
                size="sm" 
                onClick={() => navigate('/private/login')}
                className="gap-2 bg-gray-800 text-white hover:bg-gray-700 hebrew-text"
              >
                התחברות
              </Button>
            </div>

            <div className="text-center">
              <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white hebrew-text">
                תנאי שימוש ומדיניות פרטיות
              </Button>
            </div>
          </Card>
        </GradientBorderContainer>
        
        {/* Bottom Spacer */}
        <div style={{ height: 'calc(4rem + 20px)' }} aria-hidden="true" />
      </div>
    </div>
  );
};
