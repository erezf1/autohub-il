import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Phone, MapPin, Calendar, Loader2, Eye, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { usePrivateUser } from "@/hooks/admin/usePrivateUsers";
import { useQuery } from "@tanstack/react-query";
import { adminClient } from "@/integrations/supabase/adminClient";
import { AdminVehiclesTable } from "@/components/admin/AdminVehiclesTable";

const AdminPrivateUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = usePrivateUser(id!);

  // Fetch user's vehicles
  const { data: vehicles } = useQuery({
    queryKey: ['admin-private-user-vehicles', id],
    queryFn: async () => {
      const { data, error } = await adminClient
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(name_hebrew),
          model:vehicle_models(name_hebrew)
        `)
        .eq('private_user_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success text-success-foreground">פעיל</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 ml-1" />ממתין לאישור</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 ml-1" />מושעה</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground hebrew-text">משתמש לא נמצא</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/private-users')}
          className="hebrew-text btn-hover-cyan"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לרשימת משתמשים פרטיים
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white hebrew-text">{user.full_name || 'ללא שם'}</h1>
          <p className="text-lg text-white/70 hebrew-text mt-1">משתמש פרטי</p>
        </div>
        <div>
          {getStatusBadge(user.status)}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
              <div className="text-right min-w-0">
                <p className="text-[11px] text-white/70 hebrew-text">סטטוס</p>
                <div className="mt-0.5">
                  {getStatusBadge(user.status)}
                </div>
              </div>
            </div>
          </Card>
        </GradientBorderContainer>

        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md p-3">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div className="text-right min-w-0">
                <p className="text-[11px] text-white/70 hebrew-text">רכבים פעילים</p>
                <p className="text-lg font-bold text-white">{vehicles?.filter(v => v.status === 'available').length || 0}</p>
              </div>
            </div>
          </Card>
        </GradientBorderContainer>

        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md p-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="text-right min-w-0">
                <p className="text-[11px] text-white/70 hebrew-text">הצטרפות</p>
                <p className="text-sm font-medium text-white">{new Date(user.created_at).toLocaleDateString('he-IL')}</p>
              </div>
            </div>
          </Card>
        </GradientBorderContainer>
      </div>

      {/* User Details */}
      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardHeader className="p-4">
            <CardTitle className="text-white hebrew-text text-lg">פרטי משתמש</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-4 text-right">
              <div>
                <p className="text-sm text-white/70 hebrew-text mb-1 text-right">שם מלא</p>
                <p className="font-medium text-white hebrew-text text-right">{user.full_name || 'לא צוין'}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <p className="text-sm text-white/70 hebrew-text text-right">טלפון</p>
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <p className="font-medium text-white text-right" dir="ltr">{user.phone_number}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <p className="text-sm text-white/70 hebrew-text text-right">מיקום</p>
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <p className="font-medium text-white hebrew-text text-right">{user.location?.name_hebrew || 'לא צוין'}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <p className="text-sm text-white/70 hebrew-text text-right">הצטרפות</p>
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <p className="font-medium text-white text-right">{new Date(user.created_at).toLocaleDateString('he-IL')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </GradientBorderContainer>

      {/* Vehicles */}
      <GradientBorderContainer className="rounded-md">
        <Card className="bg-black border-0 rounded-md">
          <CardHeader className="p-4">
            <CardTitle className="text-white hebrew-text text-lg">רכבים ({vehicles?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <AdminVehiclesTable 
              vehicles={vehicles || []} 
              showOwner={false}
            />
          </CardContent>
        </Card>
      </GradientBorderContainer>
    </div>
  );
};

export default AdminPrivateUserDetail;
