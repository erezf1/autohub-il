import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, UserPlus, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';

export const PrivateWelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = usePrivateAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/private/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          חזור
        </Button>
        <div className="flex-1 text-center">
          <Logo />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
              <Car className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">ברוכים הבאים</h1>
            <p className="text-muted-foreground">
              מוכר רכב פרטי? הגעת למקום הנכון
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              <p>העלה עד 3 רכבים למכירה</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              <p>סוחרים רבים יראו את הרכב שלך</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              <p>קבל שיחות ישירות מסוחרים מעוניינים</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              <p>ללא עמלות - שירות חינמי לחלוטין</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/private/register')}
              className="w-full gap-2"
              size="lg"
            >
              <UserPlus className="w-5 h-5" />
              הרשמה
            </Button>
            
            <Button
              onClick={() => navigate('/private/login')}
              variant="outline"
              className="w-full gap-2"
              size="lg"
            >
              <LogIn className="w-5 h-5" />
              התחברות
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground pt-4">
            <p>באמצעות הרשמה, אתה מסכים</p>
            <p>לתנאי השימוש ומדיניות הפרטיות</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
