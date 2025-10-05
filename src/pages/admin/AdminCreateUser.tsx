import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateUser } from '@/hooks/admin/useUsers';

const AdminCreateUser = () => {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();
  
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createUserMutation.mutateAsync({
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      fullName: formData.fullName,
      businessName: formData.businessName,
    });
    
    navigate('/admin/users');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/users')}
          className="hebrew-text"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לרשימת משתמשים
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold hebrew-text">יצירת משתמש חדש</h1>
        <p className="text-lg text-muted-foreground hebrew-text mt-1">הוסף סוחר חדש למערכת</p>
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
                  placeholder="050-1234567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="hebrew-text">דוא"ל</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  dir="ltr"
                  placeholder="user@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="hebrew-text">סיסמה</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  dir="ltr"
                  placeholder="••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/users')}
                className="hebrew-text"
              >
                ביטול
              </Button>
              <Button 
                type="submit" 
                disabled={createUserMutation.isPending}
                className="hebrew-text"
              >
                {createUserMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    יוצר משתמש...
                  </>
                ) : (
                  'צור משתמש'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCreateUser;
