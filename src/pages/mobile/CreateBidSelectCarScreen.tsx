import { useState } from "react";
import { ArrowRight, Car, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

// Mock data for user's vehicles
const userVehicles = [
  {
    id: 1,
    title: "BMW X5 2021",
    details: "85,000 ק״מ • אוטומט • היברידי",
    estimatedValue: "320,000 ₪",
    image: "/placeholder.svg",
    isAvailable: true
  },
  {
    id: 2,
    title: "אאודי A6 2020",
    details: "120,000 ק״מ • אוטומט • בנזין",
    estimatedValue: "285,000 ₪",
    image: "/placeholder.svg",
    isAvailable: true
  },
  {
    id: 3,
    title: "מרצדס E-Class 2019",
    details: "145,000 ק״מ • אוטומט • בנזין",
    estimatedValue: "265,000 ₪",
    image: "/placeholder.svg",
    isAvailable: false
  },
  {
    id: 4,
    title: "פורשה 911 2022",
    details: "35,000 ק״מ • ידנית • בנזין",
    estimatedValue: "750,000 ₪",
    image: "/placeholder.svg",
    isAvailable: true
  }
];

const CreateBidSelectCarScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleBackClick = () => {
    navigate("/mobile/auctions");
  };

  const handleCarSelect = (vehicleId: number) => {
    navigate(`/mobile/create-bid/${vehicleId}`);
  };

  const filteredVehicles = userVehicles.filter(vehicle =>
    vehicle.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    vehicle.isAvailable
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3 space-x-reverse">
        <Button variant="ghost" size="icon" onClick={handleBackClick}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground hebrew-text">בחר רכב להצעה</h1>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="חפש ברכבים שלך..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 hebrew-text"
        />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200 hebrew-text">
          בחר רכב מהמלאי שלך כדי להגיש אותו למכירה פומבית. הרכב יהיה זמין למכירה לאחר אישור המנהל.
        </p>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground hebrew-text">
        מציג {filteredVehicles.length} רכבים זמינים
      </p>

      {/* Vehicles List */}
      <div className="space-y-3">
        {filteredVehicles.map((vehicle) => (
          <Card 
            key={vehicle.id}
            className="card-interactive cursor-pointer"
            onClick={() => handleCarSelect(vehicle.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4 space-x-reverse">
                {/* Vehicle Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground hebrew-text">
                        {vehicle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground hebrew-text">
                        {vehicle.details}
                      </p>
                    </div>
                    <Badge variant="secondary" className="hebrew-text">
                      זמין
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary hebrew-text">
                      {vehicle.estimatedValue}
                    </p>
                    <p className="text-xs text-muted-foreground hebrew-text">
                      שווי משוער
                    </p>
                  </div>
                </div>

                {/* Vehicle Image */}
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredVehicles.length === 0 && (
          <div className="text-center py-8">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground hebrew-text mb-2">לא נמצאו רכבים זמינים</p>
            <p className="text-sm text-muted-foreground hebrew-text">
              נסה לחפש במילות מפתח אחרות או הוסף רכבים חדשים למלאי
            </p>
          </div>
        )}
      </div>

      {/* Add Vehicle Button */}
      <div className="pt-4">
        <Button 
          variant="outline" 
          className="w-full hebrew-text"
          onClick={() => navigate("/mobile/add-vehicle")}
        >
          <Car className="h-4 w-4 ml-2" />
          הוסף רכב חדש למלאי
        </Button>
      </div>
    </div>
  );
};

export default CreateBidSelectCarScreen;