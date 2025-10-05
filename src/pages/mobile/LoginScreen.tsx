import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Phone, ArrowLeft, ArrowRight, Loader2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { formatPhoneDisplay, cleanPhoneNumber } from '@/utils/phoneValidation';

export const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  useEffect(() => {
    // Redirect if already logged in (only on initial load, not on back navigation)
    if (user && !phoneNumber && !password) {
      navigate('/mobile/dashboard', { replace: true });
    }
  }, [user, navigate, phoneNumber, password]);

  const handleLogin = async () => {
    if (!phoneNumber.trim() || !password.trim()) return;
    
    setIsLoading(true);
    const { error } = await signIn(phoneNumber, password);
    setIsLoading(false);
    
    if (!error) {
      navigate('/mobile/dashboard');
    }
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = cleanPhoneNumber(value);
    if (cleaned.length <= 10) {
      setPhoneNumber(formatPhoneDisplay(value));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Header */}
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
            <p className="text-muted-foreground">התחברות</p>
          </div>
          <div className="w-16"></div>
        </div>
        <Card className="w-full p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">התחברות למערכת</h2>
            <p className="text-muted-foreground text-sm">
              היכנסו עם מספר הטלפון והסיסמה שלכם
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
              <Label htmlFor="password">סיסמה</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="הזן סיסמה בת 6 ספרות"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 text-right"
                  maxLength={6}
                />
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              disabled={!phoneNumber.trim() || !password.trim() || isLoading}
              className="w-full gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
              {isLoading ? 'מתחבר...' : 'התחבר'}
            </Button>

            <div className="text-center">
              <Button variant="ghost" size="sm" className="text-xs">
                שכחתי סיסמה
              </Button>
            </div>
          </div>

          <Separator />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              אין לכם עדיין חשבון?
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/mobile/register')}
              className="gap-2"
            >
              הרשמה חדשה
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" size="sm" className="text-xs">
              תנאי שימוש ומדיניות פרטיות
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};