import { useState } from "react";
import { Car, MessageCircle, FileText, MoreHorizontal, Edit3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data for user's cars
const myCars = [
  {
    id: 1,
    title: "טויוטה קמרי 2020",
    status: "פעיל",
    chatCount: 3,
    image: "/placeholder.svg",
    price: "185,000 ₪"
  },
  {
    id: 2,
    title: "הונדה סיוויק 2019",
    status: "נמכר",
    chatCount: 0,
    image: "/placeholder.svg",
    price: "145,000 ₪"
  },
  {
    id: 3,
    title: "ניסן אלטימה 2021",
    status: "פעיל",
    chatCount: 7,
    image: "/placeholder.svg",
    price: "195,000 ₪"
  }
];

// Mock data for user's ISO requests
const myISORequests = [
  {
    id: 1,
    title: "טויוטה קורולה 2020",
    status: "פתוח",
    offersCount: 3,
    description: "אוטומט, בנזין, עד 100,000 ק״מ"
  },
  {
    id: 2,
    title: "רכב שטח יוקרתי",
    status: "פתוח",
    offersCount: 8,
    description: "BMW X5 או מקביל, 2019-2023"
  },
  {
    id: 3,
    title: "מרצדס C-Class",
    status: "סגור",
    offersCount: 12,
    description: "2018-2021, אוטומט"
  }
];

const MyProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("cars");
  const navigate = useNavigate();

  const handleCarClick = (carId: number) => {
    navigate(`/edit-car/${carId}`);
  };

  const handleCarChats = (carId: number) => {
    navigate(`/chats?carId=${carId}`);
  };

  const handleISOClick = (isoId: number) => {
    navigate(`/iso-request/${isoId}`);
  };

  return (
    <div className="space-y-4">
      {/* Screen Title */}
      <h1 className="text-2xl font-bold text-foreground hebrew-text">הפרופיל שלי</h1>
      
      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList className="grid w-full grid-cols-2 hebrew-text">
          <TabsTrigger value="cars">הרכבים שלי</TabsTrigger>
          <TabsTrigger value="iso">הבקשות שלי</TabsTrigger>
        </TabsList>

        {/* My Cars Tab */}
        <TabsContent value="cars" className="space-y-3 mt-4">
          {myCars.map((car) => (
            <Card key={car.id} className="card-interactive">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  {/* Car Thumbnail */}
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="h-8 w-8 text-muted-foreground" />
                  </div>

                  {/* Car Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground hebrew-text">
                          {car.title}
                        </h3>
                        <p className="text-sm text-primary font-medium hebrew-text">
                          {car.price}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <Badge 
                        variant={car.status === "פעיל" ? "default" : "secondary"}
                        className="hebrew-text"
                      >
                        {car.status}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        {/* Chat Badge */}
                        {car.chatCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCarChats(car.id)}
                            className="h-8 px-2"
                          >
                            <MessageCircle className="h-4 w-4 ml-1" />
                            <span className="hebrew-text">{car.chatCount}</span>
                          </Button>
                        )}

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCarClick(car.id)}
                          className="h-8 px-2"
                        >
                          <Edit3 className="h-4 w-4 ml-1" />
                          <span className="hebrew-text text-xs">ערוך</span>
                        </Button>
                      </div>

                      {/* More Options */}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {myCars.length === 0 && (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground hebrew-text mb-2">
                אין רכבים למכירה
              </h3>
              <p className="text-muted-foreground hebrew-text mb-4">
                התחל למכור את הרכב הראשון שלך
              </p>
              <Button onClick={() => navigate("/add")}>
                הוסף רכב למכירה
              </Button>
            </div>
          )}
        </TabsContent>

        {/* My ISO Requests Tab */}
        <TabsContent value="iso" className="space-y-3 mt-4">
          {myISORequests.map((request) => (
            <Card 
              key={request.id} 
              className="card-interactive cursor-pointer"
              onClick={() => handleISOClick(request.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground hebrew-text mb-1">
                      {request.title}
                    </h3>
                    <p className="text-sm text-muted-foreground hebrew-text">
                      {request.description}
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  <Badge 
                    variant={request.status === "פתוח" ? "default" : "secondary"}
                    className="hebrew-text"
                  >
                    {request.status}
                  </Badge>
                </div>

                {/* Offers Count */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground hebrew-text">
                    {request.offersCount} הצעות
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          {myISORequests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground hebrew-text mb-2">
                אין בקשות חיפוש פעילות
              </h3>
              <p className="text-muted-foreground hebrew-text mb-4">
                צור בקשת חיפוש ראשונה למציאת הרכב המושלם
              </p>
              <Button onClick={() => navigate("/iso-requests")}>
                צור בקשה חדשה
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyProfileScreen;