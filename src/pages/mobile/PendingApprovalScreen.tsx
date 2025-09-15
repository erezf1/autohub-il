import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Phone, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const PendingApprovalScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const profileData = location.state?.profileData || {};

  const handleLogout = () => {
    navigate('/mobile/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">Auto-Hub</h1>
          <p className="text-muted-foreground">ממתינים לאישור</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            
            <h2 className="text-xl font-semibold">הבקשה נשלחה בהצלחה</h2>
            
            <p className="text-muted-foreground text-sm leading-relaxed">
              קיבלנו את הבקשה שלכם להצטרפות למערכת Auto-Hub. 
              צוות המנהלים שלנו יבדוק את הפרטים ותו הסוחר בהקדם האפשרי.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-blue-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              מה הלאה?
            </h3>
            <ul className="text-sm text-blue-600 space-y-2">
              <li>• בדיקת תו הסוחר ואימות הפרטים</li>
              <li>• יצירת קשר לתיאום מנוי</li>
              <li>• אישור ההרשמה וכניסה למערכת</li>
            </ul>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-800">הפרטים שנרשמו:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">שם מלא:</span>
                <span>{profileData.fullName || 'לא צוין'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">שם העסק:</span>
                <span>{profileData.businessName || 'לא צוין'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">מיקום:</span>
                <span>{profileData.location || 'לא צוין'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              זמן אישור ממוצע: 1-2 ימי עסקים
            </p>
            
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">נדרשת עזרה?</p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="w-4 h-4" />
                  התקשרו אלינו
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="w-4 h-4" />
                  שלחו מייל
                </Button>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="w-full gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            חזור למסך הכניסה
          </Button>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          נישלח אליכם הודעת SMS ומייל עם אישור הפעלת החשבון
        </p>
      </div>
    </div>
  );
};