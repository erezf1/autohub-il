import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, ArrowLeft, ArrowRight, Loader2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { formatPhoneDisplay, cleanPhoneNumber } from '@/utils/phoneValidation';
import { dealerClient } from '@/integrations/supabase/dealerClient';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import logo from '@/assets/dealers-logo.jpeg';

export const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, signOut } = useAuth();

  const handleLogin = async () => {
    if (!phoneNumber.trim() || !password.trim()) return;
    
    setIsLoading(true);
    const { error } = await signIn(phoneNumber, password);
    
    if (!error) {
      // Check user status after successful login
      const { data: { user } } = await dealerClient.auth.getUser();
      
      if (user) {
        const { data: userData, error: statusError } = await dealerClient
          .from('users')
          .select('status')
          .eq('id', user.id)
          .single();
        
        if (!statusError && userData) {
          if (userData.status === 'pending') {
            // Redirect to pending approval page
            navigate('/mobile/pending-approval');
          } else if (userData.status === 'active') {
            // Redirect to dashboard for active users
            navigate('/mobile/dashboard');
          } else {
            // Handle other statuses (suspended, etc.)
            navigate('/mobile/pending-approval');
          }
        } else {
          // If we can't fetch status, assume pending
          navigate('/mobile/pending-approval');
        }
      }
    }
    
    setIsLoading(false);
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = cleanPhoneNumber(value);
    if (cleaned.length <= 10) {
      setPhoneNumber(formatPhoneDisplay(value));
    }
  };

  return (
    <div className="min-h-screen h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4 fixed inset-0" dir="rtl">
      <div className="w-full max-w-md my-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mobile/welcome')}
            className="gap-2 text-gray-300 hover:text-white"
          >
            <ArrowRight className="w-4 h-4" />
            חזור
          </Button>
          <div className="text-center">
            <img 
              src={logo}
              alt="AutoHub Logo" 
              className="h-16 w-auto mx-auto mb-4"
            />
            <p className="text-gray-300 hebrew-text">התחברות</p>
          </div>
          <div className="w-16"></div>
        </div>

        <GradientBorderContainer
   
          className="rounded-md"
        >
          <Card className="w-full p-6 space-y-6 border-0 bg-black">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white hebrew-text">התחברות למערכת</h2>
              <p className="text-gray-300 text-sm hebrew-text">
                היכנסו עם מספר הטלפון והסיסמה שלכם
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white hebrew-text">מספר טלפון</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="050-123-4567"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="pr-10 text-right bg-gray-800 border-gray-700 text-white placeholder-gray-500"
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
                    placeholder="הזן סיסמה בת 6 ספרות"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 text-right bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    maxLength={6}
                  />
                </div>
              </div>

              <Button 
                onClick={handleLogin}
                disabled={!phoneNumber.trim() || !password.trim() || isLoading}
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
                <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white hebrew-text">
                  שכחתי סיסמה
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-700/50"></div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-300 hebrew-text">
                אין לכם עדיין חשבון?
              </p>
              <Button 
                size="sm" 
                onClick={() => navigate('/mobile/register')}
                className="gap-2 bg-gray-800 text-white hover:bg-gray-700 hebrew-text"
              >
                הרשמה חדשה
              </Button>
            </div>

            <div className="text-center">
              <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white hebrew-text">
                תנאי שימוש ומדיניות פרטיות
              </Button>
            </div>
          </Card>
        </GradientBorderContainer>
        {/* Bottom Spacer - Height of footer + 20px breathing room */}
        <div style={{ height: 'calc(4rem + 20px)' }} aria-hidden="true" />
      </div>
    </div>
  );
};