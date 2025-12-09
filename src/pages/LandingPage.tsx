import { Button } from "@/components/ui/button";
import { Car, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import logo from '@/assets/dealers-logo.jpeg';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen h-screen overflow-y-auto bg-gradient-to-b from-black to-gray-900 flex flex-col" dir="rtl">
      {/* Header */}
      <header className="py-8 text-center border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-3 mb-3">
            <img 
              src={logo}
              alt="Auto Hub" 
              className="w-16 h-14"
            />
            <h1 className="text-4xl font-bold hebrew-text">
              <span className="text-blue-400">D</span>
              <span className="text-white">ealer</span>
              <span className="text-blue-400">s</span>
            </h1>
          </div>
          <p className="text-base text-gray-300 hebrew-text">פלטפורמת מסחר רכב מתקדמת</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* About Service */}
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-2xl font-bold text-white hebrew-text">
              מסחר רכבים חכם ומהיר
            </h2>
            <p className="text-gray-300 hebrew-text text-sm leading-relaxed">
              פלטפורמה מתקדמת לסוחרים ומוכרים פרטיים. מכירות, קניות, מכרזים ומידע רלוונטי במקום אחד.
            </p>
          </div>

          {/* Dealers Section */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg p-6 border border-blue-500/30">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Car className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white hebrew-text">סוחרים</h3>
              </div>
              
              <div className="space-y-2 mb-6 text-center">
                <p className="text-sm text-gray-300 hebrew-text">
                  חיפוש רכבים, השתתפות במכרזים, ניהול מלאי ועוד
                </p>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white" 
                size="lg"
                onClick={() => navigate('/mobile')}
              >
                <span className="hebrew-text font-semibold">כניסה לממשק הסוחרים</span>
              </Button>
            </div>
          </div>

          {/* Private Users Section - NEW */}
          <div className="space-y-4">
            <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-500/30">
              {/* New Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-1">
                  <Sparkles className="w-3 h-3 ml-1" />
                  <span className="hebrew-text font-semibold">חדש</span>
                </Badge>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4 mt-2">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white hebrew-text">משתמשים פרטיים</h3>
              </div>
              
              <div className="space-y-2 mb-6 text-center">
                <p className="text-sm text-gray-300 hebrew-text">
                  מוכרים פרטיים - העלו את הרכב שלכם וקבלו הצעות מסוחרים
                </p>
                <p className="text-xs text-purple-300 hebrew-text font-semibold">
                  שירות חינמי לחלוטין • עד 3 רכבים
                </p>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" 
                size="lg"
                onClick={() => navigate('/private')}
              >
                <span className="hebrew-text font-semibold">כניסה למשתמשים פרטיים</span>
              </Button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-gray-800 mt-8 bg-black/50">
        <p className="text-xs text-gray-400 hebrew-text">
          © 2024 Dealers. כל הזכויות שמורות.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;