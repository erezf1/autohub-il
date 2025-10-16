import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, FileText, Upload, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser, useUpdateUserProfile, useUpdateUserStatus } from '@/hooks/admin/useUsers';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminEditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading } = useUser(id!);
  const updateProfileMutation = useUpdateUserProfile();
  const updateStatusMutation = useUpdateUserStatus();
  
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
    subscriptionValidUntil: '',
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
        subscriptionValidUntil: user.profile?.subscription_valid_until || '',
        ratingTier: user.profile?.rating_tier || 'bronze',
      });
    }
  }, [user]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    await updateStatusMutation.mutateAsync({ userId: id, status: newStatus });
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'pending': return 'ממתין לאישור';
      case 'suspended': return 'מושעה';
      case 'subscription_expired': return 'מנוי פג תוקף';
      default: return status;
    }
  };

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
        subscription_valid_until: formData.subscriptionValidUntil || null,
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
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/admin/users/${id}`)}
          className="hebrew-text"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור
        </Button>
        <div>
          <h1 className="text-2xl font-bold hebrew-text">עריכת משתמש</h1>
          <p className="text-sm text-muted-foreground hebrew-text">
            {user?.profile?.full_name || 'משתמש'}
          </p>
        </div>
      </div>

      {/* Status Actions - Top Left */}
      {user?.status && (
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {user.status === 'pending' && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleStatusChange('active')}
                    disabled={updateStatusMutation.isPending}
                    className="hebrew-text"
                  >
                    <UserCheck className="h-4 w-4 ml-2" />
                    אשר
                  </Button>
                )}
                {user.status === 'active' && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleStatusChange('suspended')}
                    disabled={updateStatusMutation.isPending}
                    className="hebrew-text"
                  >
                    <UserX className="h-4 w-4 ml-2" />
                    השעה
                  </Button>
                )}
                {user.status === 'suspended' && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleStatusChange('active')}
                    disabled={updateStatusMutation.isPending}
                    className="hebrew-text"
                  >
                    <UserCheck className="h-4 w-4 ml-2" />
                    הפעל
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground hebrew-text">
                סטטוס: {getStatusText(user.status)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="hebrew-text text-lg">פרטי משתמש</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="hebrew-text text-sm text-right block">שם מלא</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="hebrew-text"
                  dir="rtl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="businessName" className="hebrew-text text-sm text-right block">שם עסק</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                  className="hebrew-text"
                  dir="rtl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="locationId" className="hebrew-text text-sm text-right block">מיקום</Label>
                <Select value={formData.locationId} onValueChange={(value) => setFormData({ ...formData, locationId: value })}>
                  <SelectTrigger className="hebrew-text" dir="rtl">
                    <SelectValue placeholder="בחר מיקום" />
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

              <div className="space-y-1.5">
                <Label htmlFor="subscriptionType" className="hebrew-text text-sm text-right block">מנוי</Label>
                <Select value={formData.subscriptionType} onValueChange={(value) => setFormData({ ...formData, subscriptionType: value })}>
                  <SelectTrigger className="hebrew-text" dir="rtl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular" className="hebrew-text">רגיל</SelectItem>
                    <SelectItem value="premium" className="hebrew-text">פרימיום</SelectItem>
                    <SelectItem value="vip" className="hebrew-text">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subscriptionValidUntil" className="hebrew-text text-sm text-right block">בתוקף עד</Label>
                <Input
                  id="subscriptionValidUntil"
                  type="date"
                  value={formData.subscriptionValidUntil}
                  onChange={(e) => setFormData({ ...formData, subscriptionValidUntil: e.target.value })}
                  dir="rtl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ratingTier" className="hebrew-text text-sm text-right block">דירוג</Label>
                <Select value={formData.ratingTier} onValueChange={(value) => setFormData({ ...formData, ratingTier: value })}>
                  <SelectTrigger className="hebrew-text" dir="rtl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze" className="hebrew-text">ארד</SelectItem>
                    <SelectItem value="silver" className="hebrew-text">כסף</SelectItem>
                    <SelectItem value="gold" className="hebrew-text">זהב</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="businessDescription" className="hebrew-text text-sm text-right block">תיאור</Label>
              <Textarea
                id="businessDescription"
                value={formData.businessDescription}
                onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                className="hebrew-text min-h-[80px]"
                dir="rtl"
                placeholder="תאר את העסק..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="hebrew-text text-sm text-right block">תו סוחר</Label>
                {user?.profile?.trade_license_file_url && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md mb-1.5">
                    <FileText className="h-4 w-4" />
                    <span className="text-xs hebrew-text flex-1">מסמך קיים</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(user.profile.trade_license_file_url, '_blank')}
                      className="hebrew-text h-7 px-2"
                    >
                      צפה
                    </Button>
                  </div>
                )}
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setTradeLicenseFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="hebrew-text text-sm text-right block">תמונה</Label>
                {user?.profile?.profile_picture_url && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <img 
                      src={user.profile.profile_picture_url} 
                      alt="Profile" 
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(user.profile.profile_picture_url, '_blank')}
                      className="hebrew-text h-7 px-2"
                    >
                      צפה
                    </Button>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePictureFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/admin/users/${id}`)}
                className="hebrew-text"
              >
                ביטול
              </Button>
              <Button 
                type="submit" 
                size="sm"
                disabled={updateProfileMutation.isPending}
                className="hebrew-text"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    שומר...
                  </>
                ) : (
                  'שמור'
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
