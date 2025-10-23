import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Phone, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { formatPhoneDisplay, cleanPhoneNumber } from '@/utils/phoneValidation';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import logo from '/src/assets/logo.svg';

export default function AdminLoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allowAutoRedirect, setAllowAutoRedirect] = useState(true);
  const navigate = useNavigate();
  const { signIn, user, isAdmin, isLoading: authLoading } = useAdminAuth();

  // Prevent auto-redirect on mount - user intentionally navigated to login
  useEffect(() => {
    setAllowAutoRedirect(false);
  }, []);

  // Navigate to admin dashboard only after successful login, not on page load
  useEffect(() => {
    if (user && isAdmin && !authLoading && allowAutoRedirect) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, authLoading, allowAutoRedirect, navigate]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = cleanPhoneNumber(value);
    if (cleaned.length <= 10) {
      setPhone(formatPhoneDisplay(value));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error, isAdmin: hasAdminAccess } = await signIn(phone, password);

    if (error) {
      toast.error('שגיאה בהתחברות', {
        description: error.message === 'Invalid login credentials' 
          ? 'מספר טלפון או סיסמה שגויים'
          : error.message,
      });
      setIsLoading(false);
      return;
    }

    if (!hasAdminAccess) {
      toast.error('אין הרשאות גישה', {
        description: 'למשתמש זה אין הרשאות מנהל או תמיכה',
      });
      setIsLoading(false);
      return;
    }

    toast.success('מאמת הרשאות...');
    setAllowAutoRedirect(true); // Enable auto-redirect after successful login
    setIsLoading(false);
    // useEffect will handle navigation when isAdmin is confirmed
  };

  return (
    <div className="min-h-screen h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4 fixed inset-0" dir="rtl">
      <div className="w-full max-w-md my-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src={logo}
            alt="AutoHub Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2 hebrew-text">Auto-Hub</h1>
          <p className="text-gray-300 hebrew-text">כניסת מנהלים</p>
        </div>

        <GradientBorderContainer className="rounded-md">
          <Card className="w-full p-6 space-y-6 border-0 bg-black">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white hebrew-text">התחברות למערכת</h2>
              <p className="text-gray-300 text-sm hebrew-text">
                היכנסו עם מספר הטלפון והסיסמה שלכם
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white hebrew-text">מספר טלפון</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="050-123-4567"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="pr-10 text-right bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    required
                    dir="ltr"
                  />
                </div>
                <p className="text-xs text-gray-400 hebrew-text">
                  הזן מספר טלפון בן 10 ספרות המתחיל ב-05
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white hebrew-text">סיסמה</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="הזן סיסמה"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 text-right bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white hebrew-text"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
                {isLoading ? 'מתחבר...' : 'התחבר'}
              </Button>

              <div className="text-center">
                <Button type="button" variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white hebrew-text">
                  שכחתי סיסמה
                </Button>
              </div>
            </form>

            <div className="text-center">
              <Button type="button" variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white hebrew-text">
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
}
