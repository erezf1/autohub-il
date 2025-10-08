import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Phone, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatPhoneDisplay, cleanPhoneNumber } from '@/utils/phoneValidation';

export default function AdminLoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, isAdmin } = useAdminAuth();

  // Navigate to admin dashboard when user is authenticated and confirmed as admin
  useEffect(() => {
    if (user && isAdmin && !isLoading) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, isLoading, navigate]);

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
    // Keep loading state - useEffect will handle navigation when isAdmin is confirmed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Auto-Hub</h1>
          <h2 className="text-xl font-semibold text-gray-800">כניסת מנהלים</h2>
          <p className="text-muted-foreground mt-2">התחבר עם מספר הטלפון שלך</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">מספר טלפון</Label>
            <div className="relative">
              <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="050-123-4567"
                value={phone}
                onChange={handlePhoneChange}
                className="pr-10 text-right"
                required
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
                placeholder="הזן סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 text-right"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                מתחבר...
              </>
            ) : (
              'התחבר'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
