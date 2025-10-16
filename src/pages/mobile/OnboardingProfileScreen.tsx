import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Loader2, User, Building } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const OnboardingProfileScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();
  
  const phoneNumber = location.state?.phoneNumber || '';

  const handleComplete = async () => {
    if (!fullName.trim() || !businessName.trim() || password.length !== 6 || password !== confirmPassword) return;
    
    setIsLoading(true);
    const { error } = await signUp(phoneNumber, password, fullName, businessName, 0, '', '', null);
    setIsLoading(false);
    
    if (!error) {
      navigate('/mobile/pending-approval');
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
            <p className="text-muted-foreground">השלמת פרטים</p>
          </div>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">השלמת פרטים אישיים</h2>
            <p className="text-muted-foreground text-sm">אנא מלאו את הפרטים הבאים להשלמת ההרשמה</p>
            <p className="text-xs text-muted-foreground">מספר טלפון: {phoneNumber}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">שם מלא</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="fullName" type="text" placeholder="הזן שם מלא" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pr-10 text-right" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">שם העסק</Label>
              <div className="relative">
                <Building className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="businessName" type="text" placeholder="הזן שם עסק" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="pr-10 text-right" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">סיסמה (6 ספרות)</Label>
              <Input id="password" type="password" placeholder="הזן 6 ספרות" value={password} onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 6))} className="text-center text-lg tracking-widest" maxLength={6} />
              {password.length > 0 && !isValidPassword && (<p className="text-xs text-red-500">הסיסמה חייבת להכיל בדיוק 6 ספרות</p>)}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">אימות סיסמה</Label>
              <Input id="confirmPassword" type="password" placeholder="הזן שוב 6 ספרות" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, '').slice(0, 6))} className="text-center text-lg tracking-widest" maxLength={6} />
              {confirmPassword.length > 0 && password !== confirmPassword && (<p className="text-xs text-red-500">הסיסמאות אינן תואמות</p>)}
              {passwordsMatch && (<p className="text-xs text-green-600">הסיסמאות תואמות ✓</p>)}
            </div>

            <Button onClick={handleComplete} disabled={!fullName.trim() || !businessName.trim() || !isValidPassword || !passwordsMatch || isLoading} className="w-full gap-2">
              {isLoading ? (<Loader2 className="w-4 h-4 animate-spin" />) : (<ArrowLeft className="w-4 h-4" />)}
              {isLoading ? 'נרשם...' : 'המשך להרשמה'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">לאחר השלמת ההרשמה, תועברו למסך המתנה לאישור מנהל</p>
          </div>
        </Card>
      </div>

      <div className="bg-gray-50 px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground">© 2024 Auto-Hub. כל הזכויות שמורות.</p>
      </div>
    </div>
  );
};
