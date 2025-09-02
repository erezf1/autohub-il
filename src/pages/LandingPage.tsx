import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor, Car, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/5f941758-f133-4982-a8a0-3da09c4677f5.png" 
              alt="Auto Hub" 
              className="w-12 h-12"
            />
            <h1 className="text-4xl font-bold text-primary hebrew-text">אוטו-האב</h1>
          </div>
          <p className="text-xl text-muted-foreground hebrew-text">פלטפורמת מסחר רכב מתקדמת</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Mobile Interface Card */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl hebrew-text">ממשק סוחרים</CardTitle>
              <CardDescription className="text-base hebrew-text">
                עבור סוחרי רכב ולקוחות פרטיים
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-right hebrew-text">
                <div className="flex items-center justify-end gap-3">
                  <span className="text-sm text-muted-foreground">חיפוש וקנייה של רכבים</span>
                  <Car className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-sm text-muted-foreground">השתתפות במכירות פומביות</span>
                  <Car className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-sm text-muted-foreground">ניהול פרופיל אישי</span>
                  <Users className="w-4 h-4 text-primary" />
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={() => navigate('/mobile')}
              >
                <Smartphone className="w-5 h-5 ml-2" />
                <span className="hebrew-text">כניסה לממשק הסוחרים</span>
              </Button>
            </CardContent>
          </Card>

          {/* Admin Interface Card */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl hebrew-text">פאנל ניהול</CardTitle>
              <CardDescription className="text-base hebrew-text">
                עבור מנהלי המערכת
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-right hebrew-text">
                <div className="flex items-center justify-end gap-3">
                  <span className="text-sm text-muted-foreground">ניהול משתמשים וסוחרים</span>
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-sm text-muted-foreground">ניהול רכבים ומכירות</span>
                  <Car className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-sm text-muted-foreground">דוחות וניתוחים</span>
                  <Monitor className="w-4 h-4 text-primary" />
                </div>
              </div>
              
              <Button 
                className="w-full mt-6" 
                size="lg"
                variant="secondary"
                onClick={() => navigate('/admin')}
              >
                <Monitor className="w-5 h-5 ml-2" />
                <span className="hebrew-text">כניסה לפאנל הניהול</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border mt-16">
        <p className="text-sm text-muted-foreground hebrew-text">
          © 2024 אוטו-האב. כל הזכויות שמורות.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;