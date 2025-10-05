import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Phone, ArrowLeft, ArrowRight, Loader2, User, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatPhoneDisplay, cleanPhoneNumber, isValidIsraeliPhone } from '@/utils/phoneValidation';

export const RegisterScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handlePhoneChange = (value: string) => {
    const cleaned = cleanPhoneNumber(value);
    if (cleaned.length <= 10) {
      setPhoneNumber(formatPhoneDisplay(value));
    }
  };

  const isValidPassword = (pwd: string) => /^\d{6}$/.test(pwd);
  const passwordsMatch = password === confirmPassword;

  const handleRegister = async () => {
    // Validation
    const cleaned = cleanPhoneNumber(phoneNumber);
    if (!isValidIsraeliPhone(cleaned)) {
      toast.error('שגיאה', {
        description: 'מספר טלפון לא תקין. יש להזין 10 ספרות המתחילות ב-05',
      });
      return;
    }

    if (!isValidPassword(password)) {
      toast.error('שגיאה', {
        description: 'הסיסמה חייבת להיות בת 6 ספרות',
      });
      return;
    }

    if (!passwordsMatch) {
      toast.error('שגיאה', {
        description: 'הסיסמאות אינן תואמות',
      });
      return;
    }

    if (!fullName.trim() || !businessName.trim()) {
      toast.error('שגיאה', {
        description: 'נא למלא את כל השדות',
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(cleaned, password, fullName, businessName);

    if (error) {
      toast.error('שגיאה בהרשמה', {
        description: error.message || 'אירעה שגיאה במהלך ההרשמה',
      });
      setIsLoading(false);
      return;
    }

    toast.success('נרשמת בהצלחה!', {
      description: 'ממתינים לאישור מנהל המערכת',
    });
    
    navigate('/mobile/pending-approval');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mobile/welcome')}
            className="gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            חזור
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">Auto-Hub</h1>
            <p className="text-muted-foreground">הרשמה חדשה</p>
          </div>
          <div className="w-16"></div>
        </div>

        <Card className="w-full p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">הרשמה למערכת</h2>
            <p className="text-muted-foreground text-sm">
              מלא את הפרטים להרשמה
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">מספר טלפון</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="050-123-4567"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="pr-10 text-right"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                הזן מספר טלפון בן 10 ספרות המתחיל ב-05
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">שם מלא</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="שם מלא"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pr-10 text-right"
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
                  placeholder="שם העסק"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">סיסמה (6 ספרות)</Label>
              <Input
                id="password"
                type="password"
                placeholder="הזן 6 ספרות"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-right"
                maxLength={6}
                dir="ltr"
              />
              {password && (
                <p className={`text-xs ${isValidPassword(password) ? 'text-green-600' : 'text-red-600'}`}>
                  {isValidPassword(password) ? '✓ סיסמה תקינה' : '✗ נדרשות 6 ספרות'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">אימות סיסמה</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="הזן שוב 6 ספרות"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-right"
                maxLength={6}
                dir="ltr"
              />
              {confirmPassword && (
                <p className={`text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordsMatch ? '✓ הסיסמאות תואמות' : '✗ הסיסמאות אינן תואמות'}
                </p>
              )}
            </div>

            <Button 
              onClick={handleRegister}
              disabled={isLoading || !phoneNumber.trim() || !password || !confirmPassword || !fullName.trim() || !businessName.trim()}
              className="w-full gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
              {isLoading ? 'נרשם...' : 'הרשמה'}
            </Button>
          </div>

          <Separator />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              כבר יש לכם חשבון?
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/mobile/login')}
              className="gap-2"
            >
              התחברות לחשבון קיים
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              בהמשך ההרשמה תתבקשו להעלות תו סוחר בתוקף
            </p>
            <p className="text-xs text-muted-foreground">
              ללא תו סוחר לא ניתן להשתמש במערכת
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
