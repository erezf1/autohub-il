import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Edit, Phone, MapPin, Calendar, Activity, CheckCircle, XCircle, Clock, Car, Gavel, Loader2, Eye, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { GradientSeparator } from "@/components/ui/gradient-separator";
import { useUser } from "@/hooks/admin/useUsers";
import { useQuery } from "@tanstack/react-query";
import { adminClient } from "@/integrations/supabase/adminClient";
import { AdminVehiclesTable } from "@/components/admin/AdminVehiclesTable";

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useUser(id!);

  // Fetch user's vehicles (all statuses)
  const { data: vehicles } = useQuery({
    queryKey: ['admin-user-vehicles', id],
    queryFn: async () => {
      const { data, error } = await adminClient
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(name_hebrew),
          model:vehicle_models(name_hebrew)
        `)
        .eq('owner_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch active boosted vehicles count
  const { data: activeBoostedCount } = useQuery({
    queryKey: ['admin-user-active-boosts', id],
    queryFn: async () => {
      const { count, error } = await adminClient
        .from('vehicle_listings')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', id)
        .eq('is_boosted', true)
        .gt('boosted_until', new Date().toISOString());
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!id,
  });

  // Fetch active bids count
  const { data: activeBidsCount } = useQuery({
    queryKey: ['admin-user-active-bids', id],
    queryFn: async () => {
      const { data, error } = await adminClient
        .from('auction_bids')
        .select('id, auction:auctions!inner(id, status)')
        .eq('bidder_id', id);
      
      if (error) throw error;
      
      // Filter for active/scheduled auctions
      const activeBids = data?.filter(bid => 
        bid.auction && (bid.auction.status === 'active' || bid.auction.status === 'scheduled')
      ) || [];
      
      return activeBids.length;
    },
    enabled: !!id,
  });

  // Fetch user's auctions (all statuses)
  const { data: auctions } = useQuery({
    queryKey: ['admin-user-auctions', id],
    queryFn: async () => {
      const { data, error } = await adminClient
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
      const { data, error } = await adminClient
        .from('iso_requests')
        .select('*')
        .eq('requester_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch remaining boosts using RPC
  const { data: remainingBoosts } = useQuery({
    queryKey: ['admin-user-remaining-boosts', id],
    queryFn: async () => {
      const { data, error } = await adminClient
        .rpc('get_remaining_boosts', { user_id: id });
      
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
      case 'gold':
        return <Badge className="bg-yellow-600 text-white">זהב</Badge>;
      case 'vip':
        return <Badge className="bg-purple-600 text-white">VIP</Badge>;
      case 'regular':
      default:
        return <Badge variant="outline">רגיל</Badge>;
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
          className="hebrew-text btn-hover-cyan"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          חזור לרשימת משתמשים
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white hebrew-text">{user.profile?.full_name || 'ללא שם'}</h1>
          <p className="text-lg text-white/70 hebrew-text mt-1">{user.profile?.business_name || 'ללא שם עסק'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="hebrew-text btn-hover-cyan"
            onClick={() => navigate(`/admin/users/${id}/edit`)}
          >
            <Edit className="h-4 w-4 ml-2" />
            עריכת פרטים
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
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
              <Activity className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="text-right min-w-0">
                <p className="text-[11px] text-white/70 hebrew-text">תוכנית</p>
                <div className="mt-0.5">
                  {getPlanBadge(user.profile?.subscription_type || 'regular')}
                </div>
              </div>
            </div>
          </Card>
        </GradientBorderContainer>

        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md p-3">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-500 flex-shrink-0" />
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
              <Gavel className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="text-right min-w-0">
                <p className="text-[11px] text-white/70 hebrew-text">הצעות פעילות</p>
                <p className="text-lg font-bold text-white">{activeBidsCount || 0}</p>
              </div>
            </div>
          </Card>
        </GradientBorderContainer>

        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md p-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <div className="text-right min-w-0">
                <p className="text-[11px] text-white/70 hebrew-text">בוסטים פעילים</p>
                <p className="text-lg font-bold text-white">{activeBoostedCount || 0}</p>
              </div>
            </div>
          </Card>
        </GradientBorderContainer>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900">
          <TabsTrigger value="vehicles" className="hebrew-text data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">רכבים</TabsTrigger>
          <TabsTrigger value="details" className="hebrew-text data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2277ee] data-[state=active]:to-[#5be1fd] data-[state=active]:text-black">פרטים</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <GradientBorderContainer className="rounded-md">
            <Card className="bg-black border-0 rounded-md">
              <CardHeader className="p-4">
                <CardTitle className="text-white hebrew-text text-lg">מידע משתמש</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-4 text-right">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-white/70 hebrew-text mb-1 text-right">שם מלא</p>
                    <p className="font-medium text-white hebrew-text text-right">{user.profile?.full_name || 'לא צוין'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70 hebrew-text mb-1 text-right">שם עסק</p>
                    <p className="font-medium text-white hebrew-text text-right">{user.profile?.business_name || 'לא צוין'}</p>
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
                    <p className="font-medium text-white hebrew-text text-right">{user.profile?.location?.name_hebrew || 'לא צוין'}</p>
                  </div>
                  {user.profile?.business_description && (
                    <div>
                      <p className="text-sm text-white/70 hebrew-text mb-1 text-right">תיאור</p>
                      <p className="font-medium text-white hebrew-text text-sm text-right">{user.profile.business_description}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-white/70 hebrew-text mb-1 text-right">מנוי</p>
                    <div className="text-right">{getPlanBadge(user.profile?.subscription_type || 'regular')}</div>
                  </div>
                  <div>
                    <p className="text-sm text-white/70 hebrew-text mb-1 text-right">בתוקף עד</p>
                    <p className="font-medium text-white text-right">
                      {user.profile?.subscription_valid_until 
                        ? new Date(user.profile.subscription_valid_until).toLocaleDateString('he-IL')
                        : 'לא צוין'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70 hebrew-text mb-1 text-right">גבולות מינוי</p>
                    <div className="text-sm text-white hebrew-text space-y-1">
                      <div>רכבים: {vehicles?.filter(v => v.status === 'available').length || 0} / {user.profile?.vehicles_limit || 0}</div>
                      <div>בוסטים: {user.profile?.available_boosts || 0} נותרו</div>
                      <div>מכרזים: {user.profile?.available_auctions || 0} נותרו</div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-white/70 hebrew-text mb-1 text-right">דירוג</p>
                    <p className="font-medium text-white hebrew-text text-right">
                      {user.profile?.rating_tier === 'bronze' ? 'ארד' : 
                       user.profile?.rating_tier === 'silver' ? 'כסף' :
                       user.profile?.rating_tier === 'gold' ? 'זהב' : 'לא צוין'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <p className="text-sm text-white/70 hebrew-text text-right">הצטרפות</p>
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-medium text-white text-right">{new Date(user.created_at).toLocaleDateString('he-IL')}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <p className="text-sm text-white/70 hebrew-text text-right">פעילות</p>
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-medium text-white text-right">{new Date(user.updated_at).toLocaleDateString('he-IL')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </GradientBorderContainer>
        </TabsContent>

        <TabsContent value="vehicles">
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
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default AdminUserDetail;
