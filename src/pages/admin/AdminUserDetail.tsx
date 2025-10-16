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
    <div className="space-y-6">
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
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground hebrew-text">סטטוס</p>
                <div className="mt-1">
                  {getStatusBadge(user.status)}
                </div>
              </div>
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground hebrew-text">תוכנית</p>
                <div className="mt-1">
                  {getPlanBadge(user.profile?.subscription_type || 'regular')}
                </div>
              </div>
              <Activity className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground hebrew-text">רכבים פעילים</p>
                <p className="text-xl font-bold">{vehicles?.length || 0}</p>
              </div>
              <Car className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground hebrew-text">מכירות פומביות</p>
                <p className="text-xl font-bold">{auctions?.length || 0}</p>
              </div>
              <Gavel className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground hebrew-text">בוסטים זמינים</p>
                <p className="text-xl font-bold">{user.profile?.available_boosts || 0}</p>
              </div>
              <Activity className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2" dir="rtl">
          <TabsTrigger value="vehicles" className="hebrew-text">רכבים</TabsTrigger>
          <TabsTrigger value="details" className="hebrew-text">פרטי משתמש</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">מידע אישי ועסקי</CardTitle>
            </CardHeader>
            <CardContent dir="rtl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text">שם מלא</p>
                    <p className="font-medium hebrew-text">{user.profile?.full_name || 'לא צוין'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text">שם עסק</p>
                    <p className="font-medium hebrew-text">{user.profile?.business_name || 'לא צוין'}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground hebrew-text">טלפון</p>
                      <p className="font-medium" dir="ltr">{user.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground hebrew-text">מיקום</p>
                      <p className="font-medium hebrew-text">{user.profile?.location?.name_hebrew || 'לא צוין'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text">תיאור העסק</p>
                    <p className="font-medium hebrew-text">{user.profile?.business_description || 'לא צוין'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text">דרגת מוניטין</p>
                    <p className="font-medium hebrew-text">
                      {user.profile?.rating_tier === 'bronze' ? 'ארד' : 
                       user.profile?.rating_tier === 'silver' ? 'כסף' :
                       user.profile?.rating_tier === 'gold' ? 'זהב' :
                       user.profile?.rating_tier === 'platinum' ? 'פלטינום' : 'לא צוין'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text">סוג מנוי</p>
                    <p className="font-medium hebrew-text">
                      {user.profile?.subscription_type === 'regular' ? 'רגיל' :
                       user.profile?.subscription_type === 'premium' ? 'פרימיום' :
                       user.profile?.subscription_type === 'vip' ? 'VIP' : 'לא צוין'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text">מנוי בתוקף עד</p>
                    <p className="font-medium hebrew-text">
                      {user.profile?.subscription_valid_until 
                        ? new Date(user.profile.subscription_valid_until).toLocaleDateString('he-IL')
                        : 'לא צוין'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text">ותק (חודשים)</p>
                    <p className="font-medium">{user.profile?.tenure || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text">זמן תגובה ממוצע (דקות)</p>
                    <p className="font-medium">{user.profile?.avg_response_time || 'לא זמין'}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground hebrew-text">תאריך הצטרפות</p>
                      <p className="font-medium">{new Date(user.created_at).toLocaleDateString('he-IL')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground hebrew-text">פעילות אחרונה</p>
                      <p className="font-medium">{new Date(user.updated_at).toLocaleDateString('he-IL')}</p>
                    </div>
                  </div>
                  {user.profile?.trade_license_file_url && (
                    <div>
                      <p className="text-sm text-muted-foreground hebrew-text mb-2">תו סוחר</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(user.profile.trade_license_file_url, '_blank')}
                        className="hebrew-text"
                      >
                        צפה במסמך
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">רכבים ({vehicles?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicles && vehicles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right hebrew-text">שנה</TableHead>
                      <TableHead className="text-right hebrew-text">מחיר</TableHead>
                      <TableHead className="text-right hebrew-text">סטטוס</TableHead>
                      <TableHead className="text-right hebrew-text">תאריך הוספה</TableHead>
                      <TableHead className="text-right hebrew-text">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle: any) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium hebrew-text">{vehicle.year}</TableCell>
                        <TableCell className="hebrew-text">₪{vehicle.price?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={vehicle.status === 'available' ? 'default' : 'secondary'}>
                            {vehicle.status === 'available' ? 'זמין' : vehicle.status === 'sold' ? 'נמכר' : 'לא זמין'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(vehicle.created_at).toLocaleDateString('he-IL')}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hebrew-text"
                              onClick={() => navigate(`/admin/vehicles/${vehicle.id}`)}
                            >
                              צפה
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground hebrew-text py-8">אין רכבים</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default AdminUserDetail;
