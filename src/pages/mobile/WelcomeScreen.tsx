import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import logo from '@/assets/auto-hub-logo.png';

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

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
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2 hebrew-text">Auto-Hub</h1>
          <p className="text-gray-300 text-lg hebrew-text">פלטפורמת B2B לסוחרי רכב מורשים</p>
        </div>

        <GradientBorderContainer
          className="rounded-md"
        >
          <Card className="w-full p-6 space-y-6 border-0 bg-black">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white hebrew-text">ברוכים הבאים</h2>
              <p className="text-gray-300 hebrew-text">
                הצטרפו לרשת הדילרים המובילה בישראל
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Car className="h-6 w-6 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white hebrew-text">מאגר רכבים ענק</p>
                  <p className="text-sm text-gray-400 hebrew-text">אלפי רכבים ממאות דילרים</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <Shield className="h-6 w-6 text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white hebrew-text">בטיחות ואמינות</p>
                  <p className="text-sm text-gray-400 hebrew-text">רק דילרים מורשים עם תו סוחר</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <Users className="h-6 w-6 text-blue-300 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white hebrew-text">קהילת מקצוענים</p>
                  <p className="text-sm text-gray-400 hebrew-text">חדרי צ'אט ומכרזים בזמן אמת</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700/50"></div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/mobile/register')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white hebrew-text"
                size="lg"
              >
                הרשמה חדשה
              </Button>
              
              <Button 
                onClick={() => navigate('/mobile/login')}
                className="w-full bg-gray-800 text-white hover:bg-gray-700 hebrew-text"
                size="lg"
              >
                התחברות
              </Button>
            </div>

            <div className="border-t border-gray-700/50"></div>

            <div className="text-center space-y-2">
              <p className="text-xs text-gray-400 hebrew-text">
                המערכת מיועדת לסוחרי רכב מורשים בלבד
              </p>
              <p className="text-xs text-gray-400 hebrew-text">
                נדרש תו סוחר בתוקף להרשמה למערכת
              </p>
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