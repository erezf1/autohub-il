import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Edit, Phone, MapPin, Calendar, Activity, CheckCircle, XCircle, Clock, Car, Gavel, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUser } from "@/hooks/admin/useUsers";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useUser(id!);

  // Fetch user's vehicles
  const { data: vehicles } = useQuery({
    queryKey: ['admin-user-vehicles', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_listings')
        .select('*')
        .eq('owner_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch user's auctions
  const { data: auctions } = useQuery({
    queryKey: ['admin-user-auctions', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('creator_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch user's ISO requests
  const { data: isoRequests } = useQuery({
    queryKey: ['admin-user-iso-requests', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('iso_requests')
        .select('*')
        .eq('requester_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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
      case 'subscription_expired':
        return <Badge variant="outline" className="border-orange-500 text-orange-500">מנוי פג תוקף</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'premium':
        return <Badge className="bg-primary text-primary-foreground">פרימיום</Badge>;
      case 'regular':
        return <Badge variant="outline">רגיל</Badge>;
      default:
        return <Badge variant="secondary">{plan}</Badge>;
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
          onClick={() => navigate('/admin/users')}
          className="hebrew-text"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לרשימת משתמשים
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hebrew-text">{user.profile?.full_name || 'ללא שם'}</h1>
          <p className="text-lg text-muted-foreground hebrew-text mt-1">{user.profile?.business_name || 'ללא שם עסק'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="hebrew-text"
            onClick={() => navigate(`/admin/users/${id}/edit`)}
          >
            <Edit className="h-4 w-4 ml-2" />
            עריכת פרטים
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
            <div className="text-right min-w-0">
              <p className="text-[11px] text-muted-foreground hebrew-text">סטטוס</p>
              <div className="mt-0.5">
                {getStatusBadge(user.status)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-right min-w-0">
              <p className="text-[11px] text-muted-foreground hebrew-text">תוכנית</p>
              <div className="mt-0.5">
                {getPlanBadge(user.profile?.subscription_type || 'regular')}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <div className="text-right min-w-0">
              <p className="text-[11px] text-muted-foreground hebrew-text">רכבים</p>
              <p className="text-lg font-bold">{vehicles?.filter(v => v.status === 'available').length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div className="text-right min-w-0">
              <p className="text-[11px] text-muted-foreground hebrew-text">מכרזים</p>
              <p className="text-lg font-bold">{auctions?.filter(a => a.status === 'active').length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500 flex-shrink-0" />
            <div className="text-right min-w-0">
              <p className="text-[11px] text-muted-foreground hebrew-text">בוסטים</p>
              <p className="text-lg font-bold">{user.profile?.available_boosts || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vehicles" className="hebrew-text">רכבים</TabsTrigger>
          <TabsTrigger value="details" className="hebrew-text">פרטים</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="hebrew-text text-lg">מידע משתמש</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-4 text-right">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text mb-1 text-right">שם מלא</p>
                    <p className="font-medium hebrew-text text-right">{user.profile?.full_name || 'לא צוין'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text mb-1 text-right">שם עסק</p>
                    <p className="font-medium hebrew-text text-right">{user.profile?.business_name || 'לא צוין'}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <p className="text-sm text-muted-foreground hebrew-text text-right">טלפון</p>
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-right" dir="ltr">{user.phone_number}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <p className="text-sm text-muted-foreground hebrew-text text-right">מיקום</p>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="font-medium hebrew-text text-right">{user.profile?.location?.name_hebrew || 'לא צוין'}</p>
                  </div>
                  {user.profile?.business_description && (
                    <div>
                      <p className="text-sm text-muted-foreground hebrew-text mb-1 text-right">תיאור</p>
                      <p className="font-medium hebrew-text text-sm text-right">{user.profile.business_description}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text mb-1 text-right">מנוי</p>
                    <div className="text-right">{getPlanBadge(user.profile?.subscription_type || 'regular')}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text mb-1 text-right">בתוקף עד</p>
                    <p className="font-medium text-right">
                      {user.profile?.subscription_valid_until 
                        ? new Date(user.profile.subscription_valid_until).toLocaleDateString('he-IL')
                        : 'לא צוין'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text mb-1 text-right">דירוג</p>
                    <p className="font-medium hebrew-text text-right">
                      {user.profile?.rating_tier === 'bronze' ? 'ארד' : 
                       user.profile?.rating_tier === 'silver' ? 'כסף' :
                       user.profile?.rating_tier === 'gold' ? 'זהב' : 'לא צוין'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <p className="text-sm text-muted-foreground hebrew-text text-right">הצטרפות</p>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-right">{new Date(user.created_at).toLocaleDateString('he-IL')}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <p className="text-sm text-muted-foreground hebrew-text text-right">פעילות</p>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-right">{new Date(user.updated_at).toLocaleDateString('he-IL')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="hebrew-text text-lg">רכבים ({vehicles?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {vehicles && vehicles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right hebrew-text">שנה</TableHead>
                      <TableHead className="text-right hebrew-text">מחיר</TableHead>
                      <TableHead className="text-right hebrew-text">סטטוס</TableHead>
                      <TableHead className="text-right hebrew-text">תאריך</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle: any) => (
                      <TableRow key={vehicle.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/vehicles/${vehicle.id}`)}>
                        <TableCell className="font-medium">{vehicle.year}</TableCell>
                        <TableCell>₪{vehicle.price?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={vehicle.status === 'available' ? 'default' : 'secondary'} className="text-xs">
                            {vehicle.status === 'available' ? 'זמין' : vehicle.status === 'sold' ? 'נמכר' : 'לא זמין'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(vehicle.created_at).toLocaleDateString('he-IL')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground hebrew-text py-6 text-sm">אין רכבים</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default AdminUserDetail;
