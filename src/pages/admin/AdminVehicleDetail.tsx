import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Car, Edit, Eye, MapPin, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockVehicleData = {
  id: 1,
  make: "טויוטה",
  model: "קורולה",
  year: 2022,
  seller: "אוטו גל",
  sellerEmail: "contact@autogal.co.il",
  sellerPhone: "03-1234567",
  price: "125,000 ₪",
  status: "זמין",
  views: 245,
  dateAdded: "2024-01-15",
  location: "תל אביב",
  description: "רכב במצב מעולה, טופל במוסך מורשה, בעלים יחיד, נהגת זהירה. כולל כל הטיפולים הנדרשים לפי לוח הזמנים של היצרן.",
  features: ["מזגן אוטומטי", "חלונות חשמליים", "מערכת ניווט", "מצלמת רוורס", "Bluetooth"],
  specs: {
    engine: "1.8L",
    transmission: "אוטומטי",
    fuel: "בנזין",
    color: "לבן",
    mileage: "45,000 ק״מ",
    previousOwners: 1
  },
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
};

const AdminVehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "זמין":
        return <Badge variant="default" className="hebrew-text">{status}</Badge>;
      case "נמכר":
        return <Badge variant="secondary" className="hebrew-text">{status}</Badge>;
      case "בהמתנה":
        return <Badge variant="outline" className="hebrew-text">{status}</Badge>;
      default:
        return <Badge variant="secondary" className="hebrew-text">{status}</Badge>;
    }
  };

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
              {mockVehicleData.make} {mockVehicleData.model} {mockVehicleData.year}
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
                  <h2 className="text-2xl font-bold hebrew-text">{mockVehicleData.price}</h2>
                  <p className="text-muted-foreground hebrew-text">{mockVehicleData.specs.mileage}</p>
                </div>
                {getStatusBadge(mockVehicleData.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className="hebrew-text">{mockVehicleData.seller}</span>
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="hebrew-text">{mockVehicleData.location}</span>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="hebrew-text">נוסף: {mockVehicleData.dateAdded}</span>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="hebrew-text">{mockVehicleData.views} צפיות</span>
                  <Eye className="h-4 w-4 text-muted-foreground" />
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
                <div>
                  <h4 className="font-medium hebrew-text">מנוע</h4>
                  <p className="text-muted-foreground">{mockVehicleData.specs.engine}</p>
                </div>
                <div>
                  <h4 className="font-medium hebrew-text">תיבת הילוכים</h4>
                  <p className="text-muted-foreground hebrew-text">{mockVehicleData.specs.transmission}</p>
                </div>
                <div>
                  <h4 className="font-medium hebrew-text">סוג דלק</h4>
                  <p className="text-muted-foreground hebrew-text">{mockVehicleData.specs.fuel}</p>
                </div>
                <div>
                  <h4 className="font-medium hebrew-text">צבע</h4>
                  <p className="text-muted-foreground hebrew-text">{mockVehicleData.specs.color}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text text-right">תיאור</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground hebrew-text text-right">{mockVehicleData.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text text-right">אבזור</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 justify-end">
                {mockVehicleData.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="hebrew-text">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seller" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="hebrew-text">פרטי מוכר</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium hebrew-text">שם עסק</h4>
                <p className="text-muted-foreground hebrew-text">{mockVehicleData.seller}</p>
              </div>
              <div>
                <h4 className="font-medium hebrew-text">דוא"ל</h4>
                <p className="text-muted-foreground">{mockVehicleData.sellerEmail}</p>
              </div>
              <div>
                <h4 className="font-medium hebrew-text">טלפון</h4>
                <p className="text-muted-foreground">{mockVehicleData.sellerPhone}</p>
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
                  <span className="hebrew-text">צפייה בעמוד הרכב</span>
                  <span className="text-sm text-muted-foreground">לפני 2 שעות</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="hebrew-text">עודכן מחיר הרכב</span>
                  <span className="text-sm text-muted-foreground">לפני יום</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="hebrew-text">הרכב נוסף למערכת</span>
                  <span className="text-sm text-muted-foreground">{mockVehicleData.dateAdded}</span>
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
                {mockVehicleData.images.map((image, index) => (
                  <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Car className="h-8 w-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminVehicleDetail;