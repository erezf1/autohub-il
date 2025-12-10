import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, UserPlus, LogIn, ArrowLeft, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';
import logo from '@/assets/dealers-logo.jpeg';

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
    <div className="min-h-screen h-screen overflow-y-auto bg-gradient-to-b from-black to-gray-900 flex flex-col" dir="rtl">
      {/* Header */}
      <header className="py-6 text-center border-b border-gray-800">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="absolute right-4 top-4 gap-2 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            חזור
          </Button>
          <div className="flex justify-center items-center gap-3 mb-2">
            <img 
              src={logo}
              alt="Auto Hub" 
              className="w-14 h-12"
            />
          </div>
          <p className="text-sm text-gray-300 hebrew-text">פורטל משתמשים פרטיים</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Welcome Section */}
          <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-500/30">
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-1">
                <Sparkles className="w-3 h-3 ml-1" />
                <span className="hebrew-text font-semibold">למוכרים פרטיים</span>
              </Badge>
            </div>

            {/* Icon */}
            <div className="flex justify-center mt-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-2xl font-bold text-white hebrew-text">ברוכים הבאים</h1>
              <p className="text-gray-300 hebrew-text text-sm">
                מוכר רכב פרטי? הגעת למקום הנכון
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 text-sm text-gray-300 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <p className="hebrew-text">העלה עד 3 רכבים למכירה</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <p className="hebrew-text">סוחרים רבים יראו את הרכב שלך</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <p className="hebrew-text">קבל שיחות ישירות מסוחרים מעוניינים</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <p className="hebrew-text">ללא עמלות - שירות חינמי לחלוטין</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/private/register')}
                className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                size="lg"
              >
                <UserPlus className="w-5 h-5" />
                <span className="hebrew-text font-semibold">הרשמה</span>
              </Button>
              
              <Button
                onClick={() => navigate('/private/login')}
                variant="outline"
                className="w-full gap-2 border-purple-500/50 text-purple-300 hover:bg-purple-900/30 hover:text-white"
                size="lg"
              >
                <LogIn className="w-5 h-5" />
                <span className="hebrew-text font-semibold">התחברות</span>
              </Button>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center text-xs text-gray-500 pt-4">
            <p className="hebrew-text">באמצעות הרשמה, אתה מסכים</p>
            <p className="hebrew-text">לתנאי השימוש ומדיניות הפרטיות</p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-gray-800 bg-black/50">
        <p className="text-xs text-gray-400 hebrew-text">
          © 2024 Dealers. כל הזכויות שמורות.
        </p>
      </footer>
    </div>
  );
};
