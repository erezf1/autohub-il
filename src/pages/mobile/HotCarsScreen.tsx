import { useState } from "react";
import { Search, Filter, ArrowRight, Loader2, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useBoosts } from "@/hooks/mobile/useBoosts";
import { VehicleFilterDrawer } from "@/components/mobile/VehicleFilterDrawer";
import { applyVehicleFilters, getActiveFilterCount, VehicleFilters } from "@/utils/mobile/vehicleFilters";
import darkCarImage from "@/assets/dark_car.png";

export const HotCarsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { boostedVehicles, isLoadingBoosted } = useBoosts();

  const filteredResults = applyVehicleFilters(
    boostedVehicles || [],
    filters,
    searchQuery
  );

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <div className="space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/mobile/dashboard')}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <h1 className="text-2xl font-bold text-foreground hebrew-text">מכירות חמות</h1>
          </div>
        </div>
        <Button 
          variant="outline"
          onClick={() => navigate('/mobile/boost-management')}
          className="hebrew-text"
        >
          הבוסטים שלי
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חפש לפי יצרן, דגם או שנה..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setFilterDrawerOpen(true)}
          className="relative"
        >
          <Filter className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <Badge 
              className="absolute -top-2 -left-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground hebrew-text">
            {activeFilterCount} פילטרים פעילים
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setFilters({})}
          >
            נקה הכל
          </Button>
        </div>
      )}

      {/* Results */}
      <p className="text-sm text-muted-foreground hebrew-text">
        נמצאו {filteredResults.length} רכבים חמים
      </p>

      {isLoadingBoosted ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((car) => {
            const transmissionLabel = car.transmission === 'automatic' ? 'אוטומט' : 
                                     car.transmission === 'manual' ? 'ידנית' : 'טיפטרוניק';
            const fuelLabel = car.fuel_type === 'gasoline' ? 'בנזין' :
                             car.fuel_type === 'diesel' ? 'דיזל' :
                             car.fuel_type === 'hybrid' ? 'היברידי' : 'חשמלי';

            const originalPrice = parseFloat(car.price.toString());
            const hotSalePrice = car.hot_sale_price ? parseFloat(car.hot_sale_price.toString()) : null;
            const discount = hotSalePrice ? Math.round(((originalPrice - hotSalePrice) / originalPrice) * 100) : 0;

            return (
              <Card 
                key={car.id}
                className="card-interactive cursor-pointer border-orange-200 dark:border-orange-900"
                onClick={() => navigate(`/mobile/vehicle/${car.id}`)}
              >
                <CardContent className="p-0">
                  <div className="flex h-32">
                    <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-r-lg">
                      <img
                        src={car.images?.[0] || darkCarImage}
                        alt={`${car.make?.name_hebrew} ${car.model?.name_hebrew}`}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">
                        <Flame className="h-3 w-3 ml-1" />
                        מבצע חם
                      </Badge>
                      {discount > 0 && (
                        <Badge className="absolute bottom-2 left-2 bg-red-500">
                          {discount}% הנחה
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground hebrew-text mb-1">
                          {car.make?.name_hebrew} {car.model?.name_hebrew} {car.year}
                        </h3>
                        <p className="text-sm text-muted-foreground hebrew-text">
                          {car.kilometers?.toLocaleString()} ק״מ • {transmissionLabel} • {fuelLabel}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {hotSalePrice ? (
                          <>
                            <p className="text-lg font-bold text-orange-600 hebrew-text">
                              {hotSalePrice.toLocaleString()} ₪
                            </p>
                            <p className="text-sm text-muted-foreground line-through hebrew-text">
                              {originalPrice.toLocaleString()} ₪
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-primary hebrew-text">
                            {originalPrice.toLocaleString()} ₪
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Filter Drawer */}
      <VehicleFilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        currentFilters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  );
};
