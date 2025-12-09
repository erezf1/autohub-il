import { useState, useEffect } from "react";
import { usePrivateAuth } from "@/contexts/PrivateAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * A login page for private users with OTP-based authentication.
 */
const PrivateLogin = () => {
  const { loading, isPrivateAuthenticated } = usePrivateAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If the user is already authenticated, redirect them away from the login page.
    if (isPrivateAuthenticated) {
      navigate("/private/dashboard", { replace: true });
    }
  }, [isPrivateAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone format
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !cleanPhone.startsWith('05')) {
      toast({
        title: 'שגיאה',
        description: 'מספר טלפון לא תקין. נא להזין 10 ספרות המתחילות ב-05',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Send OTP via 019sms
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone: cleanPhone }
      });

      if (error || !data?.success) {
        toast({
          title: 'שגיאה',
          description: data?.error || 'שליחת הקוד נכשלה',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'קוד נשלח',
        description: `נשלח קוד אימות ל-${cleanPhone}`,
      });

      // Navigate to OTP verification
      navigate('/private/otp-verify', { 
        state: { 
          phone: cleanPhone,
          isRegistration: false 
        } 
      });
    } catch (err) {
      console.error("Send OTP failed:", err);
      toast({
        title: 'שגיאה',
        description: 'שליחת הקוד נכשלה',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" dir="rtl">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">התחברות למשתמש פרטי</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">מספר טלפון</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="050-123-4567" 
              required 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              maxLength={12}
            />
            <p className="text-xs text-muted-foreground">
              פורמט: 10 ספרות, מתחיל ב-05
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "שולח קוד..." : "שלח קוד אימות"}
          </Button>
        </form>
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
      </div>
    </div>
  );
};

export default PrivateLogin;
