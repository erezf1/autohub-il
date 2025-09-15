import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Upload, Camera, Image, FileText, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const OnboardingLicenseScreen: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const profileData = location.state?.profileData || {};

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        setUploadedFile(file);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleSubmit = () => {
    if (uploadedFile) {
      navigate('/mobile/pending-approval', { 
        state: { 
          profileData,
          licenseFile: uploadedFile
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/mobile/onboarding/profile')}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          חזור
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold">העלאת תו סוחר</h1>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">שלב 2 מתוך 2</span>
          <span className="text-sm text-muted-foreground">אימות תו סוחר</span>
        </div>
        <Progress value={100} className="h-2" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Card className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">העלו את תו הסוחר שלכם</h2>
            <p className="text-muted-foreground text-sm">
              נדרש תו סוחר בתוקף לאישור ההרשמה למערכת
            </p>
          </div>

          {!uploadedFile ? (
            <div className="space-y-4">
              {/* Upload Options */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4">
                {isUploading ? (
                  <div className="space-y-2">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-muted-foreground">מעלה קובץ...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div className="space-y-2">
                      <p className="font-medium">העלו תמונה של תו הסוחר</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG או PDF עד 5MB
                      </p>
                    </div>
                  </>
                )}
              </div>

              {!isUploading && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50">
                      <Camera className="w-6 h-6 text-blue-600" />
                      <span className="text-sm font-medium">צלם עכשיו</span>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50">
                      <Image className="w-6 h-6 text-green-600" />
                      <span className="text-sm font-medium">בחר מהגלריה</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Upload Success */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">תו הסוחר הועלה בהצלחה</p>
                  <p className="text-sm text-green-600">{uploadedFile.name}</p>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                className="w-full gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                שלח לאישור
              </Button>

              <Button 
                variant="outline"
                onClick={() => setUploadedFile(null)}
                className="w-full"
              >
                העלה קובץ אחר
              </Button>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">דרישות לתו הסוחר:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• תו סוחר בתוקף מאת משרד התחבורה</li>
              <li>• התמונה חייבת להיות ברורה וקריאה</li>
              <li>• יש לוודא שכל הפרטים נראים בבירור</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};