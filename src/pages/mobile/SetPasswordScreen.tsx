import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const SetPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();
  
  const phoneNumber = location.state?.phoneNumber || '';

  const handleSetPassword = async () => {
    if (!isValidPassword || !passwordsMatch) return;
    
    setIsLoading(true);
    
    // Create auth user with minimal info
    const { error } = await signUp(phoneNumber, password, '', '');
    
    setIsLoading(false);
    
    if (!error) {
      // Navigate to profile edit screen
      navigate('/mobile/profile-edit', { state: { phoneNumber, isOnboarding: true } });
    }
  };

  const isValidPassword = password.length === 6 && /^\d{6}$/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col" dir="rtl">
      <div className="bg-white shadow-sm px-4 py-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowRight className="w-4 h-4" />
            חזור
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">Auto-Hub</h1>
            <p className="text-muted-foreground">הגדרת סיסמה</p>
          </div>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">הגדירו סיסמה לחשבון</h2>
            <p className="text-muted-foreground text-sm">
              אנא הזינו סיסמה בת 6 ספרות לחשבון שלכם
            </p>
            <p className="text-xs text-muted-foreground">מספר טלפון: {phoneNumber}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה (6 ספרות)</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="הזן 6 ספרות" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                  className="text-center text-lg tracking-widest pr-10" 
                  maxLength={6} 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {password.length > 0 && !isValidPassword && (
                <p className="text-xs text-red-500">הסיסמה חייבת להכיל בדיוק 6 ספרות</p>
              )}
              {isValidPassword && (
                <p className="text-xs text-green-600">סיסמה תקינה ✓</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">אימות סיסמה</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="הזן שוב 6 ספרות" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                  className="text-center text-lg tracking-widest pr-10" 
                  maxLength={6} 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-xs text-red-500">הסיסמאות אינן תואמות</p>
              )}
              {passwordsMatch && (
                <p className="text-xs text-green-600">הסיסמאות תואמות ✓</p>
              )}
            </div>

            <Button 
              onClick={handleSetPassword}
              disabled={!isValidPassword || !passwordsMatch || isLoading}
              className="w-full gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
              {isLoading ? 'יוצר חשבון...' : 'המשך להשלמת פרטים'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              הסיסמה תשמש אתכם להתחברות למערכת
            </p>
          </div>
        </Card>
      </div>

      <div className="bg-gray-50 px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground">© 2024 Auto-Hub. כל הזכויות שמורות.</p>
      </div>
    </div>
  );
};
