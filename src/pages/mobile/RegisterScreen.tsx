import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Phone, ArrowLeft, ArrowRight, Loader2, User, Building, 
  MapPin, FileText, Upload, Image as ImageIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatPhoneDisplay, cleanPhoneNumber, isValidIsraeliPhone } from '@/utils/phoneValidation';
import { dealerClient } from '@/integrations/supabase/dealerClient';
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mobile/welcome')}
            className="gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            חזור
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">Auto-Hub</h1>
            <p className="text-muted-foreground">הרשמה חדשה</p>
          </div>
          <div className="w-16"></div>
        </div>

        <Card className="w-full p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">הרשמה למערכת</h2>
            <p className="text-muted-foreground text-sm">
              מלא את הפרטים להרשמה
            </p>
          </div>

          <div className="space-y-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">מספר טלפון *</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="050-123-4567"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="pr-10 text-right"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">שם מלא *</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="שם מלא"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName">שם העסק *</Label>
              <div className="relative">
                <Building className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessName"
                  type="text"
                  placeholder="שם העסק"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">מיקום *</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="text-right" id="location">
                  <SelectValue placeholder="בחר מיקום" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name_hebrew}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Business Description */}
            <div className="space-y-2">
              <Label htmlFor="businessDescription">תיאור העסק (אופציונלי)</Label>
              <Textarea
                id="businessDescription"
                placeholder="ספר לנו קצת על העסק שלך..."
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                className="text-right min-h-[80px]"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-left">
                {businessDescription.length}/500
              </p>
            </div>

            {/* Profile Picture */}
            <div className="space-y-2">
              <Label htmlFor="profilePicture">תמונת פרופיל (אופציונלי)</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {profilePicturePreview ? (
                    <AvatarImage src={profilePicturePreview} />
                  ) : (
                    <AvatarFallback>
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <Input
                    id="profilePicture"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleProfilePictureChange}
                    className="text-right"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG או PNG, מקסימום 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Trade License */}
            <div className="space-y-2">
              <Label htmlFor="tradeLicense">תו סוחר *</Label>
              <div className="relative">
                <FileText className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tradeLicense"
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/jpg"
                  onChange={handleTradeLicenseFileChange}
                  className="pr-10 text-right"
                />
              </div>
              {tradeLicenseFile && (
                <p className="text-xs text-green-600">
                  ✓ {tradeLicenseFile.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                PDF או תמונה, מקסימום 10MB
              </p>
            </div>

            <Separator />

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה (6 ספרות) *</Label>
              <Input
                id="password"
                type="password"
                placeholder="הזן 6 ספרות"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-right"
                maxLength={6}
                dir="ltr"
              />
              {password && (
                <p className={`text-xs ${isValidPassword(password) ? 'text-green-600' : 'text-red-600'}`}>
                  {isValidPassword(password) ? '✓ סיסמה תקינה' : '✗ נדרשות 6 ספרות'}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">אימות סיסמה *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="הזן שוב 6 ספרות"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-right"
                maxLength={6}
                dir="ltr"
              />
              {confirmPassword && (
                <p className={`text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordsMatch ? '✓ הסיסמאות תואמות' : '✗ הסיסמאות אינן תואמות'}
                </p>
              )}
            </div>

            <Button 
              onClick={handleRegister}
              disabled={isLoading || !phoneNumber.trim() || !password || !confirmPassword || !fullName.trim() || !businessName.trim() || !selectedLocation || !tradeLicenseFile}
              className="w-full gap-2"
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

          <Separator />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              כבר יש לכם חשבון?
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/mobile/login')}
              className="gap-2"
            >
              התחברות לחשבון קיים
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
