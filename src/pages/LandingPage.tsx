import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor, Car, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-b from-black to-gray-900 flex flex-col fixed inset-0" dir="rtl">
      {/* Header */}
      <header className="py-12 text-center border-b border-gray-800 flex-shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/5f941758-f133-4982-a8a0-3da09c4677f5.png" 
              alt="Auto Hub" 
              className="w-12 h-12"
            />
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 hebrew-text">אוטו-האב</h1>
          </div>
          <p className="text-lg text-gray-300 hebrew-text">פלטפורמת מסחר רכב מתקדמת</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 flex-1">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Mobile Interface Card */}
          <GradientBorderContainer
            className="rounded-md flex-1"
          >
            <Card className="border-0 bg-black hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-blue-400" />
                </div>
                <CardTitle className="text-2xl hebrew-text text-white">ממשק סוחרים</CardTitle>
                <CardDescription className="text-base hebrew-text text-gray-300">
                  עבור סוחרי רכב ולקוחות פרטיים
                </CardDescription>
              </CardHeader>
              <div className="border-t border-gray-700/50 mx-4"></div>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3 hebrew-text">
                  <div className="flex items-center gap-3">
                    <Car className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">חיפוש וקנייה של רכבים</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Car className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">השתתפות במכירות פומביות</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">ניהול פרופיל אישי</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white" 
                  size="lg"
                  onClick={() => navigate('/mobile')}
                >
                  <Smartphone className="w-5 h-5 ml-2" />
                  <span className="hebrew-text">כניסה לממשק הסוחרים</span>
                </Button>
              </CardContent>
            </Card>
          </GradientBorderContainer>

          {/* Admin Interface Card */}
          <GradientBorderContainer
            className="rounded-md flex-1"
          >
            <Card className="border-0 bg-black hover:shadow-xl transition-shadow duration-300 ">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-8 h-8 text-blue-400" />
                </div>
                <CardTitle className="text-2xl hebrew-text text-white">פאנל ניהול</CardTitle>
                <CardDescription className="text-base hebrew-text text-gray-300">
                  עבור מנהלי המערכת
                </CardDescription>
              </CardHeader>
              <div className="border-t border-gray-700/50 mx-4"></div>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3 hebrew-text">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">ניהול משתמשים וסוחרים</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Car className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">ניהול רכבים ומכירות</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Monitor className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">דוחות וניתוחים</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-gray-700 hover:bg-gray-600 text-white" 
                  size="lg"
                  onClick={() => navigate('/admin/login')}
                >
                  <Monitor className="w-5 h-5 ml-2" />
                  <span className="hebrew-text">כניסה לפאנל הניהול</span>
                </Button>
              </CardContent>
            </Card>
          </GradientBorderContainer>
        </div>
        {/* Bottom Spacer - Height of footer + 20px breathing room */}
 
      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-gray-800 mt-16 bg-black/50">
        <p className="text-xs text-gray-400 hebrew-text">
          © 2024 אוטו-האב. כל הזכויות שמורות.
        </p>
        <div className="md:hidden" style={{ height: 'calc(4rem )' }} aria-hidden="true" />
      </footer>
    </div>
  );
};

export default LandingPage;