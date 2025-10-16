import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Clock, CheckCircle, Phone, Mail, ArrowLeft, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { dealerClient } from '@/integrations/supabase/dealerClient';

export const PendingApprovalScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch complete profile data
  const { data: profile, isLoading, error: profileError } = useQuery({
    queryKey: ['pending-profile', user?.id],
    queryFn: async () => {
      console.log('Fetching profile for user:', user?.id);
      if (!user?.id) {
        console.log('No user ID found');
        return null;
      }

      const { data, error } = await dealerClient
        .from('user_profiles')
        .select(`
          *,
          location:locations(id, name_hebrew, name_english)
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
      
      console.log('Fetched profile data:', data);
      return data;
    },
    enabled: !!user?.id,
    staleTime: 0,
    retry: 3,
    retryDelay: 1000,
  });

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

          {/* Profile Details */}
          {isLoading ? (
            <div className="bg-gray-50 border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
              </div>
            </div>
          ) : profileError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">
                שגיאה בטעינת הפרטים. אנא נסה לרענן את העמוד.
              </p>
            </div>
          ) : profile ? (
            <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                <User className="w-4 h-4" />
                הפרטים שנרשמו:
              </h4>
              
              {/* Profile Picture */}
              {profile.profile_picture_url && (
                <div className="flex justify-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.profile_picture_url} alt="Profile" />
                    <AvatarFallback>{profile.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">שם מלא:</span>
                  <span className="font-medium">{profile.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">שם העסק:</span>
                  <span className="font-medium">{profile.business_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">מיקום:</span>
                  <span className="font-medium">{profile.location?.name_hebrew || 'לא צוין'}</span>
                </div>
                {profile.business_description && (
                  <div className="pt-2 border-t">
                    <span className="text-muted-foreground block mb-1">תיאור העסק:</span>
                    <p className="text-sm">{profile.business_description}</p>
                  </div>
                )}
              </div>

              {/* Trade License Document */}
              {profile.trade_license_file_url && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2"
                  onClick={async () => {
                    try {
                      // Get signed URL for private bucket
                      const filePath = profile.trade_license_file_url.split('/').pop();
                      const { data, error } = await dealerClient.storage
                        .from('dealer-documents')
                        .createSignedUrl(profile.trade_license_file_url.replace(/.*dealer-documents\//, ''), 60);
                      
                      if (error) {
                        console.error('Error creating signed URL:', error);
                        // Try opening the direct URL as fallback
                        window.open(profile.trade_license_file_url, '_blank');
                      } else if (data) {
                        window.open(data.signedUrl, '_blank');
                      }
                    } catch (err) {
                      console.error('Error opening document:', err);
                      window.open(profile.trade_license_file_url, '_blank');
                    }
                  }}
                >
                  <FileText className="w-4 h-4" />
                  צפה בתו סוחר שהועלה
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border rounded-lg p-4">
              <p className="text-sm text-muted-foreground text-center">
                לא נמצאו פרטים. אנא נסה לרענן את העמוד.
              </p>
            </div>
          )}

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
