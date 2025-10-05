import { useState } from "react";
import { Search, Filter, Car, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "@/hooks/mobile/useVehicles";
import darkCarImage from "@/assets/dark_car.png";

const quickFilters = [
  "רכבי יוקרה",
  "אופנועים",
  "מתחת ל-200,000",
  "היברידי"
];

const CarSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { vehicles, isLoading } = useVehicles();

  const filteredResults = vehicles?.filter(vehicle => {
    const makeModel = `${vehicle.make?.name_hebrew || ''} ${vehicle.model?.name_hebrew || ''}`;
    const matchesSearch = makeModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const vehiclePrice = parseFloat(vehicle.price.toString());
    const matchesFilter = !activeFilter || 
      (activeFilter === "רכבי יוקרה" && vehiclePrice > 400000) ||
      (activeFilter === "מתחת ל-200,000" && vehiclePrice < 200000) ||
      (activeFilter === "היברידי" && vehicle.fuel_type === 'hybrid');
    
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground hebrew-text">חיפוש רכב</h1>
        <Button variant="outline" onClick={() => navigate('/mobile/profile')}>
          הרכבים שלי
        </Button>
      </div>
      
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

      <p className="text-sm text-muted-foreground hebrew-text">
        מציג {filteredResults.length} תוצאות
      </p>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((vehicle) => {
            const transmissionLabel = vehicle.transmission === 'automatic' ? 'אוטומט' : 
                                     vehicle.transmission === 'manual' ? 'ידנית' : 'טיפטרוניק';
            const fuelLabel = vehicle.fuel_type === 'gasoline' ? 'בנזין' :
                             vehicle.fuel_type === 'diesel' ? 'דיזל' :
                             vehicle.fuel_type === 'hybrid' ? 'היברידי' : 'חשמלי';
            
            return (
              <Card 
                key={vehicle.id}
                className="card-interactive cursor-pointer"
                onClick={() => navigate(`/mobile/vehicle/${vehicle.id}`)}
              >
                <CardContent className="p-0">
                  <div className="flex h-32">
                    <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-r-lg">
                      <img
                        src={vehicle.images?.[0] || darkCarImage}
                        alt={`${vehicle.make?.name_hebrew} ${vehicle.model?.name_hebrew}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 p-4 flex flex-col justify-center">
                      <h3 className="font-semibold text-foreground hebrew-text mb-1">
                        {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew} {vehicle.year}
                      </h3>
                      <p className="text-sm text-muted-foreground hebrew-text mb-2">
                        {vehicle.kilometers?.toLocaleString()} ק״מ • {transmissionLabel} • {fuelLabel}
                      </p>
                      <p className="text-lg font-bold text-primary hebrew-text">
                        {parseFloat(vehicle.price.toString()).toLocaleString()} ₪
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default CarSearchScreen;