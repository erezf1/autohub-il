import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, FileText, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser, useUpdateUserProfile } from '@/hooks/admin/useUsers';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminEditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading } = useUser(id!);
  const updateProfileMutation = useUpdateUserProfile();
  
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name_hebrew');
      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    locationId: '',
    businessDescription: '',
    subscriptionType: '',
    ratingTier: '',
  });

  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.profile?.full_name || '',
        businessName: user.profile?.business_name || '',
        locationId: user.profile?.location_id?.toString() || '',
        businessDescription: user.profile?.business_description || '',
        subscriptionType: user.profile?.subscription_type || 'regular',
        ratingTier: user.profile?.rating_tier || 'bronze',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateProfileMutation.mutateAsync({
      userId: id!,
      profileData: {
        full_name: formData.fullName,
        business_name: formData.businessName,
        location_id: formData.locationId ? parseInt(formData.locationId) : null,
        business_description: formData.businessDescription || null,
        subscription_type: formData.subscriptionType,
        rating_tier: formData.ratingTier,
      },
      tradeLicenseFile: tradeLicenseFile || undefined,
      profilePictureFile: profilePictureFile || undefined,
    });
    
    navigate(`/admin/users/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/admin/users/${id}`)}
          className="hebrew-text"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לפרטי משתמש
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold hebrew-text">עריכת פרטי משתמש</h1>
        <p className="text-lg text-muted-foreground hebrew-text mt-1">
          {user?.profile?.full_name || 'משתמש'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">פרטי משתמש</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="hebrew-text">שם מלא</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="hebrew-text"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName" className="hebrew-text">שם עסק</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                  className="hebrew-text"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="hebrew-text">מספר טלפון (לא ניתן לעריכה)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={user?.phone_number || ''}
                  disabled
                  dir="ltr"
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationId" className="hebrew-text">איזור</Label>
                <Select value={formData.locationId} onValueChange={(value) => setFormData({ ...formData, locationId: value })}>
                  <SelectTrigger className="hebrew-text" dir="rtl">
                    <SelectValue placeholder="בחר איזור" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()} className="hebrew-text">
                        {location.name_hebrew}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscriptionType" className="hebrew-text">סוג מנוי</Label>
                <Select value={formData.subscriptionType} onValueChange={(value) => setFormData({ ...formData, subscriptionType: value })}>
                  <SelectTrigger className="hebrew-text" dir="rtl">
                    <SelectValue placeholder="בחר סוג מנוי" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular" className="hebrew-text">רגיל</SelectItem>
                    <SelectItem value="premium" className="hebrew-text">פרימיום</SelectItem>
                    <SelectItem value="vip" className="hebrew-text">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratingTier" className="hebrew-text">דרגת מוניטין</Label>
                <Select value={formData.ratingTier} onValueChange={(value) => setFormData({ ...formData, ratingTier: value })}>
                  <SelectTrigger className="hebrew-text" dir="rtl">
                    <SelectValue placeholder="בחר דרגה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze" className="hebrew-text">ארד</SelectItem>
                    <SelectItem value="silver" className="hebrew-text">כסף</SelectItem>
                    <SelectItem value="gold" className="hebrew-text">זהב</SelectItem>
                    <SelectItem value="platinum" className="hebrew-text">פלטינום</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessDescription" className="hebrew-text">תיאור העסק</Label>
              <Textarea
                id="businessDescription"
                value={formData.businessDescription}
                onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                className="hebrew-text min-h-[100px]"
                dir="rtl"
                placeholder="תאר את העסק שלך..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="hebrew-text">תו סוחר</Label>
                {user?.profile?.trade_license_file_url && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md mb-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm hebrew-text flex-1">מסמך קיים</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(user.profile.trade_license_file_url, '_blank')}
                      className="hebrew-text"
                    >
                      צפה
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setTradeLicenseFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  {tradeLicenseFile && (
                    <span className="text-sm text-muted-foreground">{tradeLicenseFile.name}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground hebrew-text">
                  {user?.profile?.trade_license_file_url ? 'העלה קובץ חדש להחלפת המסמך הקיים' : 'העלה תו סוחר (PDF, JPG, PNG)'}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="hebrew-text">תמונת פרופיל</Label>
                {user?.profile?.profile_picture_url && (
                  <div className="flex items-center gap-2 mb-2">
                    <img 
                      src={user.profile.profile_picture_url} 
                      alt="Profile" 
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(user.profile.profile_picture_url, '_blank')}
                      className="hebrew-text"
                    >
                      צפה בגודל מלא
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePictureFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  {profilePictureFile && (
                    <span className="text-sm text-muted-foreground">{profilePictureFile.name}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground hebrew-text">
                  {user?.profile?.profile_picture_url ? 'העלה תמונה חדשה להחלפת התמונה הקיימת' : 'העלה תמונת פרופיל'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/admin/users/${id}`)}
                className="hebrew-text"
              >
                ביטול
              </Button>
              <Button 
                type="submit" 
                disabled={updateProfileMutation.isPending}
                className="hebrew-text"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    שומר שינויים...
                  </>
                ) : (
                  'שמור שינויים'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEditUser;
