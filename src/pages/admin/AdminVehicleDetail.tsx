import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Car, Edit, Eye, MapPin, Calendar, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminVehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['admin-vehicle', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(name_hebrew, name_english),
          model:vehicle_models(name_hebrew, name_english)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: ownerProfile } = useQuery({
    queryKey: ['vehicle-owner', vehicle?.owner_id],
    enabled: !!vehicle?.owner_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, business_name')
        .eq('id', vehicle!.owner_id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: vehicleTags } = useQuery({
    queryKey: ['vehicle-tags', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_listing_tags')
        .select(`
          tag_id,
          tag:vehicle_tags(*)
        `)
        .eq('vehicle_id', id);

      if (error) throw error;
      return data;
    },
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'available': 'זמין',
      'sold': 'נמכר',
      'pending': 'בהמתנה',
    };
    const hebrewStatus = statusMap[status] || status;
    
    switch (status) {
      case "available":
        return <Badge variant="default" className="hebrew-text">{hebrewStatus}</Badge>;
      case "sold":
        return <Badge variant="secondary" className="hebrew-text">{hebrewStatus}</Badge>;
      case "pending":
        return <Badge variant="outline" className="hebrew-text">{hebrewStatus}</Badge>;
      default:
        return <Badge variant="secondary" className="hebrew-text">{hebrewStatus}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vehicle) {
    return <div className="text-center hebrew-text">רכב לא נמצא</div>;
  }

  return (
    <div className="space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/vehicles")}
            className="hebrew-text"
          >
            <ArrowRight className="h-4 w-4 ml-2" />
            חזור לרשימה
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground hebrew-text">
              {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew} {vehicle.year}
            </h1>
            <p className="text-muted-foreground hebrew-text">מזהה רכב: #{id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(!isEditing)}
            className="hebrew-text"
          >
            <Edit className="h-4 w-4 ml-2" />
            {isEditing ? "בטל עריכה" : "ערוך פרטי רכב"}
          </Button>
          <Button className="hebrew-text">
            <Eye className="h-4 w-4 ml-2" />
            צפה כמו לקוח
          </Button>
        </div>
      </div>

      {/* Vehicle Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" dir="rtl">
            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
              <Car className="h-16 w-16 text-muted-foreground" />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <h2 className="text-2xl font-bold hebrew-text">₪{vehicle.price.toLocaleString()}</h2>
                  <p className="text-muted-foreground hebrew-text">{vehicle.kilometers.toLocaleString()} ק״מ</p>
                </div>
                {getStatusBadge(vehicle.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className="hebrew-text">{ownerProfile?.business_name || ownerProfile?.full_name}</span>
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="hebrew-text">נוסף: {new Date(vehicle.created_at).toLocaleDateString('he-IL')}</span>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4" dir="rtl">
          <TabsTrigger value="images" className="hebrew-text">תמונות</TabsTrigger>
          <TabsTrigger value="activity" className="hebrew-text">פעילות</TabsTrigger>
          <TabsTrigger value="seller" className="hebrew-text">פרטי מוכר</TabsTrigger>
          <TabsTrigger value="details" className="hebrew-text">פרטי רכב</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text text-right">מפרט טכני</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-right">
                {vehicle.engine_size && (
                  <div>
                    <h4 className="font-medium hebrew-text">נפח מנוע</h4>
                    <p className="text-muted-foreground">{vehicle.engine_size}L</p>
                  </div>
                )}
                {vehicle.transmission && (
                  <div>
                    <h4 className="font-medium hebrew-text">תיבת הילוכים</h4>
                    <p className="text-muted-foreground hebrew-text">{vehicle.transmission}</p>
                  </div>
                )}
                {vehicle.fuel_type && (
                  <div>
                    <h4 className="font-medium hebrew-text">סוג דלק</h4>
                    <p className="text-muted-foreground hebrew-text">{vehicle.fuel_type}</p>
                  </div>
                )}
                {vehicle.color && (
                  <div>
                    <h4 className="font-medium hebrew-text">צבע</h4>
                    <p className="text-muted-foreground hebrew-text">{vehicle.color}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium hebrew-text">בעלים קודמים</h4>
                  <p className="text-muted-foreground">{vehicle.previous_owners}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {vehicle.description && (
            <Card>
              <CardHeader>
                <CardTitle className="hebrew-text text-right">תיאור</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground hebrew-text text-right">{vehicle.description}</p>
              </CardContent>
            </Card>
          )}

          {vehicleTags && vehicleTags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="hebrew-text text-right">תגיות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-end">
                  {vehicleTags.map((vt: any) => (
                    <Badge 
                      key={vt.tag_id} 
                      variant="outline" 
                      className="hebrew-text"
                      style={{ backgroundColor: vt.tag?.color }}
                    >
                      {vt.tag?.name_hebrew}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="seller" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">פרטי מוכר</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium hebrew-text">שם מלא</h4>
                <p className="text-muted-foreground hebrew-text">{ownerProfile?.full_name}</p>
              </div>
              <div>
                <h4 className="font-medium hebrew-text">שם עסק</h4>
                <p className="text-muted-foreground hebrew-text">{ownerProfile?.business_name}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">פעילות אחרונה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="hebrew-text">הרכב נוסף למערכת</span>
                  <span className="text-sm text-muted-foreground">{new Date(vehicle.created_at).toLocaleDateString('he-IL')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">גלריית תמונות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vehicle.images && vehicle.images.length > 0 ? (
                  vehicle.images.map((image: string, index: number) => (
                    <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img src={image} alt={`Vehicle ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Car className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminVehicleDetail;