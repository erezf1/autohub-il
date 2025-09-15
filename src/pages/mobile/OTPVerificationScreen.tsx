import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowRight, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const OTPVerificationScreen: React.FC = () => {
  const [otpValue, setOtpValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const phoneNumber = location.state?.phoneNumber || '050-123-4567';

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleVerify = async () => {
    if (otpValue.length !== 6) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Simulate new user flow vs returning user
      const isNewUser = Math.random() > 0.5;
      if (isNewUser) {
        navigate('/mobile/onboarding/profile');
      } else {
        navigate('/mobile/search');
      }
    }, 1500);
  };

  const handleResendOTP = () => {
    setTimeLeft(60);
    setCanResend(false);
    setOtpValue('');
    // Simulate resend API call
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/mobile/login')}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          חזור
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold">אימות מספר טלפון</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">הזינו קוד אימות</h2>
            <p className="text-muted-foreground text-sm">
              נשלח קוד אימות בן 6 ספרות למספר
            </p>
            <p className="font-medium text-blue-600">{phoneNumber}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP 
                maxLength={6} 
                value={otpValue} 
                onChange={setOtpValue}
                dir="ltr"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              onClick={handleVerify}
              disabled={otpValue.length !== 6 || isLoading}
              className="w-full gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
              {isLoading ? 'מאמת...' : 'אמת קוד'}
            </Button>
          </div>

          <div className="text-center space-y-2">
            {!canResend ? (
              <p className="text-sm text-muted-foreground">
                ניתן לשלוח קוד חדש בעוד {timeLeft} שניות
              </p>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleResendOTP}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                שלח קוד חדש
              </Button>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              לא קיבלתם קוד? בדקו בהודעות הספאם או צרו קשר עם התמיכה
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};