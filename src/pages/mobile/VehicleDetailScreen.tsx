import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Car, MessageCircle, Phone, Star, MapPin, Calendar, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import darkCarImage from "@/assets/dark_car.png";

// Mock vehicle data
const mockVehicle = {
  id: "456",
  title: "טויוטה קמרי 2020",
  price: "285,000 ₪",
  year: 2020,
  kilometers: 120000,
  transmission: "אוטומט",
  fuelType: "בנזין",
  engineSize: "2.5L",
  color: "לבן פנינה",
  previousOwners: 1,
  location: "תל אביב",
  description: "רכב במצב מעולה, מטופל בסוכנות בלבד. החלפת שמן כל 10,000 ק״מ, צמיגים חדשים. רכב משפחתי שמור מאוד.",
  features: [
    "מערכת מולטימדיה מתקדמת",
    "מצלמת רוורס",
    "חישני חניה",
    "בקרת שיוט",
    "מזגן אוטומטי דו-אזורי",
    "חלונות חשמליים",
    "מנעולי ילדים"
  ],
  seller: {
    name: "משה לוי",
    phone: "050-7654321",
    rating: 4.8,
    salesCount: 23,
    joinDate: "2020"
  },
  images: [
    darkCarImage,
    darkCarImage,
    darkCarImage
  ],
  isAuction: false,
  status: "זמין"
};

const VehicleDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/mobile/search");
  };

  const handleContactSeller = () => {
    navigate(`/mobile/chat/new?vehicle=${id}&seller=${mockVehicle.seller.name}`);
  };

  const handleCallSeller = () => {
    window.location.href = `tel:${mockVehicle.seller.phone}`;
  };

  return (
    <div className="space-y-4">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-3 space-x-reverse mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackClick}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-foreground hebrew-text">
          פרטי רכב
        </h1>
      </div>

      {/* Vehicle Images */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-48 overflow-hidden">
            <img
              src={mockVehicle.images[0]}
              alt={mockVehicle.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <Badge variant="secondary" className="absolute top-2 right-2 hebrew-text">
              {mockVehicle.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Title and Price */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-foreground hebrew-text">
              {mockVehicle.title}
            </h2>
            <div className="text-left">
              <p className="text-2xl font-bold text-primary hebrew-text">
                {mockVehicle.price}
              </p>
              <p className="text-sm text-muted-foreground hebrew-text">
                ניתן למשא ומתן
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
            <div className="flex items-center space-x-1 space-x-reverse">
              <MapPin className="h-4 w-4" />
              <span className="hebrew-text">{mockVehicle.location}</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <Calendar className="h-4 w-4" />
              <span>{mockVehicle.year}</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <Gauge className="h-4 w-4" />
              <span>{mockVehicle.kilometers.toLocaleString()} ק״מ</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">מפרט טכני</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">שנת ייצור</p>
              <p className="font-medium text-foreground">{mockVehicle.year}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">קילומטרז׳</p>
              <p className="font-medium text-foreground">{mockVehicle.kilometers.toLocaleString()} ק״מ</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">תיבת הילוכים</p>
              <p className="font-medium text-foreground hebrew-text">{mockVehicle.transmission}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">סוג דלק</p>
              <p className="font-medium text-foreground hebrew-text">{mockVehicle.fuelType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">נפח מנוע</p>
              <p className="font-medium text-foreground">{mockVehicle.engineSize}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground hebrew-text">צבע</p>
              <p className="font-medium text-foreground hebrew-text">{mockVehicle.color}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">אביזרים ותוספות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mockVehicle.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="hebrew-text">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">תיאור</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground hebrew-text leading-relaxed">
            {mockVehicle.description}
          </p>
        </CardContent>
      </Card>

      {/* Seller Information */}
      <Card>
        <CardHeader>
          <CardTitle className="hebrew-text">פרטי המוכר</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 space-x-reverse mb-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {mockVehicle.seller.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground hebrew-text">
                {mockVehicle.seller.name}
              </h3>
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Star className="h-4 w-4 fill-current text-warning" />
                  <span>{mockVehicle.seller.rating}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="hebrew-text">{mockVehicle.seller.salesCount} מכירות</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="hebrew-text">חבר מאז {mockVehicle.seller.joinDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 space-x-reverse">
            <Button 
              className="flex-1"
              onClick={handleContactSeller}
            >
              <MessageCircle className="h-4 w-4 ml-2" />
              <span className="hebrew-text">שלח הודעה</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleCallSeller}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDetailScreen;