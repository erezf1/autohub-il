import { useState } from "react";
import { Search, Filter, Car } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Mock data for vehicle search results
const searchResults = [
  {
    id: 1,
    title: "אאודי A6 2021",
    details: "120,000 ק״מ • אוטומט • בנזין",
    price: "285,000 ₪",
    image: "/placeholder.svg",
    isAuction: false
  },
  {
    id: 2,
    title: "BMW X3 2020",
    details: "85,000 ק״מ • אוטומט • היברידי",
    price: "320,000 ₪",
    image: "/placeholder.svg",
    isAuction: true
  },
  {
    id: 3,
    title: "מרצדס E-Class 2022",
    details: "45,000 ק״מ • אוטומט • בנזין",
    price: "450,000 ₪",
    image: "/placeholder.svg",
    isAuction: false
  },
  {
    id: 4,
    title: "טויוטה קורולה 2020",
    details: "95,000 ק״מ • אוטומט • היברידי",
    price: "165,000 ₪",
    image: "/placeholder.svg",
    isAuction: false
  },
  {
    id: 5,
    title: "פורשה 911 2019",
    details: "35,000 ק״מ • ידנית • בנזין",
    price: "750,000 ₪",
    image: "/placeholder.svg",
    isAuction: true
  }
];

const quickFilters = [
  "רכבי יוקרה",
  "מכירה פומבית",
  "רכבי שטח",
  "היברידי",
  "חדש מהסוכנות"
];

const CarSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredResults = searchResults.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !activeFilter || 
      (activeFilter === "מכירה פומבית" && car.isAuction) ||
      (activeFilter === "רכבי יוקרה" && parseInt(car.price.replace(/[^\d]/g, "")) > 400000);
    
    return matchesSearch && matchesFilter;
  });

  const handleVehicleClick = (vehicleId: number) => {
    navigate(`/mobile/vehicle/${vehicleId}`);
  };

  return (
    <div className="space-y-4">
      {/* Screen Title */}
      <h1 className="text-2xl font-bold text-foreground hebrew-text">חיפוש רכב</h1>
      
      {/* Search Bar with Filter Button */}
      <div className="flex items-center space-x-2 space-x-reverse">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חפש לפי יצרן, דגם..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 hebrew-text"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <Badge
            key={filter}
            variant={activeFilter === filter ? "default" : "secondary"}
            className="cursor-pointer hebrew-text"
            onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground hebrew-text">
        מציג {filteredResults.length} תוצאות
      </p>

      {/* Search Results List */}
      <div className="space-y-3">
        {filteredResults.map((vehicle) => (
          <Card 
            key={vehicle.id}
            className="card-interactive cursor-pointer"
            onClick={() => handleVehicleClick(vehicle.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4 space-x-reverse">
                {/* Vehicle Image */}
                <div className="relative w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="h-10 w-10 text-muted-foreground" />
                  {vehicle.isAuction && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs">
                      מכירה פומבית
                    </Badge>
                  )}
                </div>

                {/* Vehicle Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground hebrew-text mb-1">
                    {vehicle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground hebrew-text mb-2">
                    {vehicle.details}
                  </p>
                  <p className="text-lg font-bold text-primary hebrew-text">
                    {vehicle.price}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredResults.length === 0 && (
          <div className="text-center py-8">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground hebrew-text">לא נמצאו תוצאות</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarSearchScreen;