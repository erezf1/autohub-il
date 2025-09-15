import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, User, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OnboardingProfileScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    location: ''
  });
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    setIsValid(!!(newData.fullName.trim() && newData.businessName.trim() && newData.location.trim()));
  };

  const handleContinue = () => {
    if (isValid) {
      navigate('/mobile/onboarding/license', { state: { profileData: formData } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/mobile/verify-otp')}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          חזור
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold">הגדרת פרופיל</h1>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">שלב 1 מתוך 2</span>
          <span className="text-sm text-muted-foreground">פרטי הדילר</span>
        </div>
        <Progress value={50} className="h-2" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Card className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">בואו נכיר</h2>
            <p className="text-muted-foreground text-sm">
              אנא מלאו את הפרטים הבסיסיים שלכם
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">שם מלא</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="הזינו את השם המלא שלכם"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">שם העסק</Label>
              <div className="relative">
                <Building className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessName"
                  type="text"
                  placeholder="שם הדילרשיפ או העסק"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                השם הזה יהיה גלוי לסוחרים אחרים במערכת
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">מיקום</Label>
              <Input
                id="location"
                type="text"
                placeholder="עיר או אזור"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="text-right"
              />
            </div>
          </div>

          <Button 
            onClick={handleContinue}
            disabled={!isValid}
            className="w-full gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            המשך להעלאת תו סוחר
          </Button>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            המידע שלכם מוגן ומוצפן בהתאם לתקני האבטחה הגבוהים ביותר
          </p>
        </div>
      </div>
    </div>
  );
};