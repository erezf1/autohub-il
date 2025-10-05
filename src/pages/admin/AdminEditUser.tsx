import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useUpdateUserProfile } from '@/hooks/admin/useUsers';

const AdminEditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading } = useUser(id!);
  const updateProfileMutation = useUpdateUserProfile();
  
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.profile?.full_name || '',
        businessName: user.profile?.business_name || '',
        phoneNumber: user.phone_number || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateProfileMutation.mutateAsync({
      userId: id!,
      phoneNumber: formData.phoneNumber,
      profileData: {
        full_name: formData.fullName,
        business_name: formData.businessName,
      },
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
                <Label htmlFor="phoneNumber" className="hebrew-text">מספר טלפון</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                  dir="ltr"
                />
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
