import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowRight, RefreshCw } from "lucide-react";
import { usePrivateAuth } from "@/contexts/PrivateAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/common/Logo";

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

  const handleVerify = async () => {
    if (otpValue.length !== 4) {
      toast({
        title: "שגיאה",
        description: "יש להזין 4 ספרות",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // For registration flow - create user after OTP verification
      if (isRegistration && state?.fullName && state?.locationId) {
        // First verify OTP
        const { error: otpError } = await verifyOTP(phone, otpValue);
        
        if (otpError) {
          toast({
            title: "שגיאה",
            description: otpError.message || "קוד אימות שגוי",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // OTP verified, now create user account
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

        // Success - user created and logged in
        toast({
          title: "הרשמה הושלמה!",
          description: "החשבון שלך נוצר בהצלחה",
        });
        
        navigate("/private/dashboard");
      } else {
        // Login flow - verify OTP only
        const { error } = await verifyOTP(phone, otpValue);

        if (error) {
          toast({
            title: "שגיאה",
            description: error.message || "קוד אימות שגוי",
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

  const handleResendOTP = () => {
    setTimeLeft(60);
    setCanResend(false);
    setOtpValue("");
    
    toast({
      title: "קוד נשלח מחדש",
      description: `קוד אימות חדש נשלח ל-${phone}`,
    });
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
            הזן את הקוד בן 4 הספרות שנשלח ל-
            <br />
            <span className="font-semibold text-foreground">{phone}</span>
          </p>
        </div>

        {/* OTP Input - Numbers typed left-to-right in Hebrew */}
        <div className="flex justify-center py-6">
          <InputOTP
            maxLength={4}
            value={otpValue}
            onChange={(value) => setOtpValue(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={isLoading || otpValue.length !== 4}
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
              className="text-primary"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              שלח קוד מחדש
            </Button>
          )}
        </div>

        {/* Development Note */}
        <div className="pt-4 border-t">
          <p className="text-xs text-center text-muted-foreground">
            לצורכי פיתוח: השתמש בקוד <span className="font-mono font-bold">9876</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
