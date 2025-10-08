import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Car, Edit, Calendar, User, Loader2, AlertTriangle, Download, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { useAdminVehicles } from '@/hooks/admin';
import { getVehicleTypeLabel } from '@/constants/vehicleTypes';

const AdminVehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useAdminVehicle } = useAdminVehicles();

  const { data: vehicle, isLoading } = useAdminVehicle(id);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      available: { label: "זמין", variant: "default" },
      sold: { label: "נמכר", variant: "secondary" },
      pending: { label: "ממתין", variant: "outline" },
      removed: { label: "הוסר", variant: "destructive" }
    };

    const statusInfo = statusMap[status] || { label: status, variant: "outline" as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getFuelTypeLabel = (fuelType: string | null) => {
    const fuelMap: Record<string, string> = {
      gasoline: "בנזין",
      diesel: "דיזל",
      hybrid: "היברידי",
      electric: "חשמלי"
    };
    return fuelMap[fuelType || ''] || fuelType || '-';
  };

  const getTransmissionLabel = (transmission: string | null) => {
    const transMap: Record<string, string> = {
      manual: "ידנית",
      automatic: "אוטומט",
      semi_automatic: "טיפטרוניק"
    };
    return transMap[transmission || ''] || transmission || '-';
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
          <Button onClick={() => navigate(`/admin/vehicles/${id}/edit`)}>
            <Edit className="h-4 w-4 ml-2" />
            ערוך
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">מחיר</p>
              <p className="text-2xl font-bold hebrew-text">₪{vehicle.price?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">קילומטרז׳</p>
              <p className="text-lg font-semibold hebrew-text">{vehicle.kilometers?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">שנה</p>
              <p className="text-lg font-semibold hebrew-text">{vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">סטטוס</p>
              <div className="flex gap-2 items-center">
                {getStatusBadge(vehicle.status || 'available')}
                {vehicle.had_severe_crash && (
                  <Badge variant="destructive" className="flex gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    תאונה
                  </Badge>
                )}
                {vehicle.is_boosted && vehicle.boosted_until && new Date(vehicle.boosted_until) > new Date() && (
                  <Badge className="flex gap-1 bg-amber-500">
                    <Zap className="h-3 w-3" />
                    מודגש
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">בעלים</p>
              <p className="text-lg hebrew-text">{vehicle.owner?.business_name || vehicle.owner?.full_name || '-'}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 ml-2" />
              <span className="hebrew-text">
                נוסף {formatDistanceToNow(new Date(vehicle.created_at), { addSuffix: true, locale: he })}
              </span>
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
              <CardTitle className="hebrew-text">מפרט טכני</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground hebrew-text">יצרן</p>
                  <p className="font-medium hebrew-text">{vehicle.make?.name_hebrew}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground hebrew-text">דגם</p>
                  <p className="font-medium hebrew-text">{vehicle.model?.name_hebrew}</p>
                </div>
                {vehicle.sub_model && (
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text">סוג</p>
                    <p className="font-medium hebrew-text">{getVehicleTypeLabel(vehicle.sub_model)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground hebrew-text">שנה</p>
                  <p className="font-medium">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground hebrew-text">צבע</p>
                  <p className="font-medium hebrew-text">{vehicle.color || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground hebrew-text">סוג דלק</p>
                  <p className="font-medium hebrew-text">{getFuelTypeLabel(vehicle.fuel_type)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground hebrew-text">תיבת הילוכים</p>
                  <p className="font-medium hebrew-text">{getTransmissionLabel(vehicle.transmission)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground hebrew-text">נפח מנוע</p>
                  <p className="font-medium hebrew-text">{vehicle.engine_size ? `${vehicle.engine_size}L` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground hebrew-text">בעלים קודמים</p>
                  <p className="font-medium">{vehicle.previous_owners || 1}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground hebrew-text">תאונה חמורה</p>
                  <p className="font-medium hebrew-text">{vehicle.had_severe_crash ? 'כן' : 'לא'}</p>
                </div>
                {vehicle.is_boosted && vehicle.boosted_until && (
                  <div>
                    <p className="text-sm text-muted-foreground hebrew-text">מודגש עד</p>
                    <p className="font-medium hebrew-text">
                      {new Date(vehicle.boosted_until).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {vehicle.test_result_file_url && (
            <Card>
              <CardHeader>
                <CardTitle className="hebrew-text">תוצאות טסט</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  onClick={() => window.open(vehicle.test_result_file_url, '_blank')}
                  className="hebrew-text"
                >
                  <Download className="h-4 w-4 ml-2" />
                  הורד קובץ טסט
                </Button>
              </CardContent>
            </Card>
          )}

          {vehicle.description && (
            <Card>
              <CardHeader>
                <CardTitle className="hebrew-text">תיאור</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground hebrew-text whitespace-pre-wrap">{vehicle.description}</p>
              </CardContent>
            </Card>
          )}

          {vehicle.tags && vehicle.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="hebrew-text">תגיות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {vehicle.tags.map((tag: any) => (
                    <Badge key={tag.id} variant="secondary" style={{ backgroundColor: tag.color }}>
                      {tag.name_hebrew}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="seller">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">מידע על המוכר</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground hebrew-text">שם מלא</p>
                <p className="font-medium hebrew-text">{vehicle.owner?.full_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground hebrew-text">שם עסק</p>
                <p className="font-medium hebrew-text">{vehicle.owner?.business_name || '-'}</p>
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