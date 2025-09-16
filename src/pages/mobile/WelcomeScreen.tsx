import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Car, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/5f941758-f133-4982-a8a0-3da09c4677f5.png" 
            alt="AutoHub Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Auto-Hub</h1>
          <p className="text-muted-foreground text-lg">פלטפורמת B2B לסוחרי רכב מורשים</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">ברוכים הבאים</h2>
            <p className="text-muted-foreground">
              הצטרפו לרשת הדילרים המובילה בישראל
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Car className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium">מאגר רכבים ענק</p>
                <p className="text-sm text-muted-foreground">אלפי רכבים ממאות דילרים</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium">בטיחות ואמינות</p>
                <p className="text-sm text-muted-foreground">רק דילרים מורשים עם תו סוחר</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <Users className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium">קהילת מקצוענים</p>
                <p className="text-sm text-muted-foreground">חדרי צ'אט ומכרזים בזמן אמת</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/mobile/register')}
              className="w-full"
              size="lg"
            >
              הרשמה חדשה
            </Button>
            
            <Button 
              onClick={() => navigate('/mobile/login')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              התחברות
            </Button>
          </div>

          <Separator />

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              המערכת מיועדת לסוחרי רכב מורשים בלבד
            </p>
            <p className="text-xs text-muted-foreground">
              נדרש תו סוחר בתוקף להרשמה למערכת
            </p>
          </div>

          <div className="text-center">
            <Button variant="ghost" size="sm" className="text-xs">
              תנאי שימוש ומדיניות פרטיות
            </Button>
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