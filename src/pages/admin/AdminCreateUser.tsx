import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientBorderContainer } from '@/components/ui/gradient-border-container';
import { useCreateUser } from '@/hooks/admin/useUsers';
import { formatPhoneDisplay, cleanPhoneNumber } from '@/utils/phoneValidation';

const AdminCreateUser = () => {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();
  
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    phoneNumber: '',
    password: '',
  });

  const handlePhoneChange = (value: string) => {
    const cleaned = cleanPhoneNumber(value);
    if (cleaned.length <= 10) {
      setFormData({ ...formData, phoneNumber: formatPhoneDisplay(value) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createUserMutation.mutateAsync({
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
          className="hebrew-text btn-hover-cyan"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לרשימת משתמשים
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white hebrew-text">יצירת משתמש חדש</h1>
        <p className="text-lg text-white/70 hebrew-text mt-1">הוסף סוחר חדש למערכת</p>
      </div>

      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardHeader>
            <CardTitle className="hebrew-text text-white">פרטי משתמש</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="hebrew-text text-white">שם מלא</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="hebrew-text border-0 bg-black rounded-md"
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName" className="hebrew-text text-white">שם עסק</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      required
                      className="hebrew-text border-0 bg-black rounded-md"
                      dir="rtl"
                    />
                  </GradientBorderContainer>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="hebrew-text text-white">מספר טלפון</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      required
                      dir="ltr"
                      placeholder="050-123-4567"
                      className="border-0 bg-black rounded-md"
                    />
                  </GradientBorderContainer>
                  <p className="text-xs text-muted-foreground hebrew-text">
                    הזן מספר טלפון בן 10 ספרות המתחיל ב-05
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="hebrew-text text-white">סיסמה</Label>
                  <GradientBorderContainer className="rounded-md">
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      dir="ltr"
                      placeholder="••••••"
                      minLength={6}
                      className="border-0 bg-black rounded-md"
                    />
                  </GradientBorderContainer>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <GradientBorderContainer className="rounded-md">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => navigate('/admin/users')}
                    className="hebrew-text border-0 bg-black rounded-md hover:bg-gradient-to-r hover:from-[#5be1fd] hover:to-[#2277ee] hover:text-black"
                  >
                    ביטול
                  </Button>
                </GradientBorderContainer>
                <Button 
                  type="submit" 
                  disabled={createUserMutation.isPending}
                  className="hebrew-text bg-gradient-to-r from-[#2277ee] to-[#5be1fd] text-black hover:from-[#5be1fd] hover:to-[#2277ee]"
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
      </GradientBorderContainer>
    </div>
  );
};

export default AdminCreateUser;
