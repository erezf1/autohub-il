import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatPhoneDisplay } from '@/utils/phoneValidation';

export const PrivateLoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, signIn } = usePrivateAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/private/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: 'שגיאה',
        description: 'נא להזין מספר טלפון',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signIn(phoneNumber);

    setIsLoading(false);

    if (error) {
      toast({
        title: 'שגיאה',
        description: error.message || 'אירעה שגיאה בהתחברות',
        variant: 'destructive',
      });
      return;
    }

    // Navigate to OTP verification
    navigate('/private/otp-verify', { 
      state: { 
        phoneNumber: formatPhoneDisplay(phoneNumber),
        isRegister: false 
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
            <h1 className="text-2xl font-bold">התחברות</h1>
            <p className="text-muted-foreground text-sm">
              הזן את מספר הטלפון שלך לקבלת קוד אימות
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gap-2"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4" />
              {isLoading ? 'שולח קוד...' : 'המשך'}
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">עדיין אין לך חשבון? </span>
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => navigate('/private/register')}
            >
              הירשם עכשיו
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
