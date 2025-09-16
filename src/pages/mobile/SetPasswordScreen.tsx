import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const SetPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const phoneNumber = location.state?.phoneNumber || '';

  const handleSetPassword = async () => {
    if (password.length !== 6 || password !== confirmPassword) return;
    
    setIsLoading(true);
    
    // Simulate API call to set password
    setTimeout(() => {
      setIsLoading(false);
      // After password is set, continue to onboarding
      navigate('/mobile/onboarding/profile', { state: { phoneNumber } });
    }, 1500);
  };

  const isValidPassword = password.length === 6 && /^\d{6}$/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            חזור
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">Auto-Hub</h1>
            <p className="text-muted-foreground">קביעת סיסמה</p>
          </div>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">קביעת סיסמה</h2>
            <p className="text-muted-foreground text-sm">
              קבעו סיסמה בת 6 ספרות עבור החשבון שלכם
            </p>
            <p className="text-xs text-muted-foreground">
              מספר טלפון: {phoneNumber}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה חדשה</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="הזן 6 ספרות"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="pr-10 pl-10 text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password.length > 0 && !isValidPassword && (
                <p className="text-xs text-red-500">
                  הסיסמה חייבת להכיל בדיוק 6 ספרות
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">אימות סיסמה</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="הזן שוב 6 ספרות"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="pr-10 pl-10 text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-xs text-red-500">
                  הסיסמאות אינן תואמות
                </p>
              )}
              {passwordsMatch && (
                <p className="text-xs text-green-600">
                  הסיסמאות תואמות ✓
                </p>
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
              {isLoading ? 'קובע סיסמה...' : 'המשך'}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              הסיסמה תשמש לכניסה עתידית למערכת יחד עם מספר הטלפון
            </p>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          © 2024 Auto-Hub. כל הזכויות שמורות.
        </p>
      </div>
    </div>
  );
};