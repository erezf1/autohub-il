import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowRight, RefreshCw } from "lucide-react";
import { usePrivateAuth } from "@/contexts/PrivateAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/common/Logo";
import { supabase } from "@/integrations/supabase/client";

interface LocationState {
  phone: string;
  fullName?: string;
  locationId?: number;
  isRegistration?: boolean;
}

export default function PrivateOTPVerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, signUp } = usePrivateAuth();
  const { toast } = useToast();

  const state = location.state as LocationState;
  const phone = state?.phone || "";
  const isRegistration = state?.isRegistration || false;

  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const verifyOTPWithService = async (code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phone, code }
      });

      if (error) {
        console.error('Verify OTP error:', error);
        return { success: false, error: 'שגיאה באימות הקוד' };
      }

      return data;
    } catch (error) {
      console.error('Verify OTP exception:', error);
      return { success: false, error: 'שגיאה באימות הקוד' };
    }
  };

  const handleVerify = async () => {
    if (otpValue.length !== 6) {
      toast({
        title: "שגיאה",
        description: "יש להזין 6 ספרות",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First verify OTP with 019sms service
      const verifyResult = await verifyOTPWithService(otpValue);

      if (!verifyResult.success) {
        toast({
          title: "שגיאה",
          description: verifyResult.error || "קוד אימות שגוי",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // OTP verified successfully - now handle auth
      if (isRegistration && state?.fullName && state?.locationId) {
        // Registration flow - create user account
        const { error: signUpError } = await signUp(
          phone,
          state.fullName,
          state.locationId
        );

        if (signUpError) {
          toast({
            title: "שגיאה",
            description: signUpError.message || "אירעה שגיאה ביצירת החשבון",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "הרשמה הושלמה!",
          description: "החשבון שלך נוצר בהצלחה",
        });
        
        navigate("/private/dashboard");
      } else {
        // Login flow - sign in existing user
        const { error } = await verifyOTP(phone, otpValue);

        if (error) {
          toast({
            title: "שגיאה",
            description: error.message || "אירעה שגיאה בהתחברות",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "התחברת בהצלחה",
          description: "ברוך הבא בחזרה",
        });

        navigate("/private/dashboard");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה באימות הקוד",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone }
      });

      if (error || !data?.success) {
        toast({
          title: "שגיאה",
          description: data?.error || "שליחת הקוד נכשלה",
          variant: "destructive",
        });
        setIsResending(false);
        return;
      }

      setTimeLeft(60);
      setCanResend(false);
      setOtpValue("");
      
      toast({
        title: "קוד נשלח מחדש",
        description: `קוד אימות חדש נשלח ל-${phone}`,
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast({
        title: "שגיאה",
        description: "שליחת הקוד נכשלה",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Logo size="sm" />
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">אימות קוד</h1>
          <p className="text-muted-foreground">
            הזן את הקוד בן 6 הספרות שנשלח ל-
            <br />
            <span className="font-semibold text-foreground">{phone}</span>
          </p>
        </div>

        {/* OTP Input - 6 digits, Numbers typed left-to-right */}
        <div className="flex justify-center py-6" dir="ltr">
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={(value) => setOtpValue(value)}
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

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={isLoading || otpValue.length !== 6}
          className="w-full"
          size="lg"
        >
          {isLoading ? "מאמת..." : "אימות"}
        </Button>

        {/* Resend OTP */}
        <div className="text-center space-y-2">
          {!canResend ? (
            <p className="text-sm text-muted-foreground">
              שלח קוד מחדש בעוד {timeLeft} שניות
            </p>
          ) : (
            <Button
              variant="ghost"
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-primary"
            >
              <RefreshCw className={`h-4 w-4 ml-2 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? 'שולח...' : 'שלח קוד מחדש'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
