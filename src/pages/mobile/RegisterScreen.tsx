import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Phone, ArrowLeft, ArrowRight, Loader2, User, Building, 
  FileText, Image as ImageIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatPhoneDisplay, cleanPhoneNumber, isValidIsraeliPhone } from '@/utils/phoneValidation';
import { dealerClient } from '@/integrations/supabase/dealerClient';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const RegisterScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Fetch locations
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await dealerClient
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name_hebrew');
      if (error) throw error;
      return data;
    }
  });

  const handlePhoneChange = (value: string) => {
    const cleaned = cleanPhoneNumber(value);
    if (cleaned.length <= 10) {
      setPhoneNumber(formatPhoneDisplay(value));
    }
  };

  const handleTradeLicenseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('שגיאה', { description: 'גודל הקובץ לא יכול לעלות על 10MB' });
        return;
      }
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('שגיאה', { description: 'יש להעלות קובץ PDF או תמונה (JPG/PNG)' });
        return;
      }
      setTradeLicenseFile(file);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('שגיאה', { description: 'גודל התמונה לא יכול לעלות על 5MB' });
        return;
      }
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('שגיאה', { description: 'יש להעלות תמונה (JPG/PNG)' });
        return;
      }
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
    try {
      const { data, error } = await dealerClient.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = dealerClient.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('שגיאה בהעלאת קובץ', { description: error.message });
      return null;
    }
  };

  const isValidPassword = (pwd: string) => /^\d{6}$/.test(pwd);
  const passwordsMatch = password === confirmPassword;

  const handleRegister = async () => {
    // Validation
    const cleaned = cleanPhoneNumber(phoneNumber);
    if (!isValidIsraeliPhone(cleaned)) {
      toast.error('שגיאה', {
        description: 'מספר טלפון לא תקין. יש להזין 10 ספרות המתחילות ב-05',
      });
      return;
    }

    if (!isValidPassword(password)) {
      toast.error('שגיאה', {
        description: 'הסיסמה חייבת להיות בת 6 ספרות',
      });
      return;
    }

    if (!passwordsMatch) {
      toast.error('שגיאה', {
        description: 'הסיסמאות אינן תואמות',
      });
      return;
    }

    if (!fullName.trim() || !businessName.trim()) {
      toast.error('שגיאה', {
        description: 'נא למלא את כל השדות החובה',
      });
      return;
    }

    if (!selectedLocation) {
      toast.error('שגיאה', {
        description: 'נא לבחור מיקום',
      });
      return;
    }

    if (!tradeLicenseFile) {
      toast.error('שגיאה', {
        description: 'נא להעלות תו סוחר',
      });
      return;
    }

    setIsLoading(true);
    setUploadingFiles(true);

    try {
      // Upload files first (before creating user)
      const timestamp = Date.now();
      const tempUserId = `temp_${timestamp}`;
      
      // Upload trade license
      const tradeLicenseUrl = await uploadFile(
        tradeLicenseFile,
        'dealer-documents',
        `${tempUserId}/trade_license_${timestamp}.${tradeLicenseFile.name.split('.').pop()}`
      );

      if (!tradeLicenseUrl) {
        setIsLoading(false);
        setUploadingFiles(false);
        return;
      }

      // Upload profile picture if provided
      let profilePictureUrl: string | null = null;
      if (profilePicture) {
        profilePictureUrl = await uploadFile(
          profilePicture,
          'profile-pictures',
          `${tempUserId}/profile_${timestamp}.${profilePicture.name.split('.').pop()}`
        );
      }

      setUploadingFiles(false);

      // Sign up with all data
      const { error } = await signUp(
        cleaned,
        password,
        fullName,
        businessName,
        parseInt(selectedLocation),
        businessDescription,
        tradeLicenseUrl,
        profilePictureUrl
      );

      if (error) {
        toast.error('שגיאה בהרשמה', {
          description: error.message || 'אירעה שגיאה במהלך ההרשמה',
        });
        setIsLoading(false);
        return;
      }

      toast.success('נרשמת בהצלחה!', {
        description: 'ממתינים לאישור מנהל המערכת',
      });
      
      navigate('/mobile/pending-approval');
    } catch (error: any) {
      toast.error('שגיאה', {
        description: error.message || 'אירעה שגיאה במהלך ההרשמה',
      });
    } finally {
      setIsLoading(false);
      setUploadingFiles(false);
    }
  };

  return (
    <div className="min-h-screen h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4 fixed inset-0" dir="rtl">
      <div className="w-full max-w-md my-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mobile/welcome')}
            className="gap-2 text-gray-300 hover:text-white"
          >
            <ArrowRight className="w-4 h-4" />
            חזור
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2 hebrew-text">Auto-Hub</h1>
            <p className="text-gray-300 hebrew-text">הרשמה חדשה</p>
          </div>
          <div className="w-16"></div>
        </div>

        <GradientBorderContainer
   
          className="rounded-md"
        >
          <Card className="w-full p-6 space-y-6 border-0 bg-black">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white hebrew-text">הרשמה למערכת</h2>
              <p className="text-gray-300 text-sm hebrew-text">
                מלא את הפרטים להרשמה
              </p>
            </div>

            <div className="space-y-4">
              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white hebrew-text">מספר טלפון *</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="050-123-4567"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="pr-10 text-right bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white hebrew-text">שם מלא *</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="שם מלא"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pr-10 text-right bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-white hebrew-text">שם העסק *</Label>
                <div className="relative">
                  <Building className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="שם העסק"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="pr-10 text-right bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white hebrew-text">מיקום *</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="text-right bg-gray-800 border-gray-700 text-white" id="location">
                    <SelectValue placeholder="בחר מיקום" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {locations?.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()} className="text-white">
                        {location.name_hebrew}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Business Description */}
              <div className="space-y-2">
                <Label htmlFor="businessDescription" className="text-white hebrew-text">תיאור העסק (אופציונלי)</Label>
                <Textarea
                  id="businessDescription"
                  placeholder="ספר לנו קצת על העסק שלך..."
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="text-right bg-gray-800 border-gray-700 text-white placeholder-gray-500 min-h-[80px]"
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 text-left hebrew-text">
                  {businessDescription.length}/500
                </p>
              </div>

              {/* Profile Picture */}
              <div className="space-y-2">
                <Label htmlFor="profilePicture" className="text-white hebrew-text">תמונת פרופיל (אופציונלי)</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-gray-700">
                    {profilePicturePreview ? (
                      <AvatarImage src={profilePicturePreview} />
                    ) : (
                      <AvatarFallback className="bg-gray-800">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleProfilePictureChange}
                      className="text-right bg-gray-800 border-gray-700 text-white file:text-white file:bg-gray-700"
                    />
                    <p className="text-xs text-gray-400 mt-1 hebrew-text">
                      JPG או PNG, מקסימום 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Trade License */}
              <div className="space-y-2">
                <Label htmlFor="tradeLicense" className="text-white hebrew-text">תו סוחר *</Label>
                <div className="relative">
                  <FileText className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="tradeLicense"
                    type="file"
                    accept="application/pdf,image/jpeg,image/png,image/jpg"
                    onChange={handleTradeLicenseFileChange}
                    className="pr-10 text-right bg-gray-800 border-gray-700 text-white file:text-white file:bg-gray-700"
                  />
                </div>
                {tradeLicenseFile && (
                  <p className="text-xs text-green-400 hebrew-text">
                    ✓ {tradeLicenseFile.name}
                  </p>
                )}
                <p className="text-xs text-gray-400 hebrew-text">
                  PDF או תמונה, מקסימום 10MB
                </p>
              </div>

              <div className="border-t border-gray-700/50"></div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white hebrew-text">סיסמה (6 ספרות) *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="הזן 6 ספרות"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-right bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  maxLength={6}
                  dir="ltr"
                />
                {password && (
                  <p className={`text-xs hebrew-text ${isValidPassword(password) ? 'text-green-400' : 'text-red-400'}`}>
                    {isValidPassword(password) ? '✓ סיסמה תקינה' : '✗ נדרשות 6 ספרות'}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white hebrew-text">אימות סיסמה *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="הזן שוב 6 ספרות"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-right bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  maxLength={6}
                  dir="ltr"
                />
                {confirmPassword && (
                  <p className={`text-xs hebrew-text ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                    {passwordsMatch ? '✓ הסיסמאות תואמות' : '✗ הסיסמאות אינן תואמות'}
                  </p>
                )}
              </div>

              <Button 
                onClick={handleRegister}
                disabled={isLoading || !phoneNumber.trim() || !password || !confirmPassword || !fullName.trim() || !businessName.trim() || !selectedLocation || !tradeLicenseFile}
                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white hebrew-text"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploadingFiles ? 'מעלה קבצים...' : 'נרשם...'}
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4" />
                    הרשמה
                  </>
                )}
              </Button>
            </div>

            <div className="border-t border-gray-700/50"></div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-300 hebrew-text">
                כבר יש לכם חשבון?
              </p>
              <Button 
                size="sm" 
                onClick={() => navigate('/mobile/login')}
                className="gap-2 bg-gray-800 text-white hover:bg-gray-700 hebrew-text"
              >
                התחברות לחשבון קיים
              </Button>
            </div>
          </Card>
        </GradientBorderContainer>
        {/* Bottom Spacer - Height of footer + 20px breathing room */}
        <div style={{ height: 'calc(4rem + 20px)' }} aria-hidden="true" />
      </div>
    </div>
  );
};
