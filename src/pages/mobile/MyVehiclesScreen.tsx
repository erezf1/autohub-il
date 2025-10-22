import { useState } from "react";
import { Plus, Loader2, Edit, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SuperArrowsIcon } from "@/components/common/SuperArrowsIcon";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "@/hooks/mobile/useVehicles";
import { VehicleFilterDrawer } from "@/components/mobile/VehicleFilterDrawer";
import { applyVehicleFilters, getActiveFilterCount, VehicleFilters } from "@/utils/mobile/vehicleFilters";
import darkCarImage from "@/assets/dark_car.png";

const MyVehiclesScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const { myVehicles, isLoading } = useVehicles();

  const handleBackClick = () => {
    navigate('/mobile/search');
  };

  const filteredVehicles = applyVehicleFilters(
    myVehicles || [],
    filters,
    searchQuery
  );

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <div className="container max-w-md mx-auto px-4 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            onClick={handleBackClick}
            className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
          >
            <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
          </div>
          <h1 className="text-2xl font-bold text-foreground hebrew-text">הרכבים שלי</h1>
        </div>
        <GradientBorderContainer className="rounded-md">
          <Button 
            onClick={() => navigate('/mobile/add-vehicle')} 
            variant="ghost"
            size="sm"
            className="bg-black border-0 text-white hebrew-text"
          >
            <Plus className="h-4 w-4 ml-2" />
            הוסף רכב
          </Button>
        </GradientBorderContainer>
      </div>

      {/* Search and Filter */}
      {myVehicles && myVehicles.length > 0 && (
        <div className="flex gap-2">
          <GradientBorderContainer className="rounded-md flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש ברכבים שלי..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-black border-0 text-right hebrew-text"
                dir="rtl"
              />
            </div>
          </GradientBorderContainer>
          <GradientBorderContainer className="rounded-md">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setFilterDrawerOpen(true)}
              className="relative bg-black border-0"
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
          </GradientBorderContainer>
        </div>
      )}

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
            className="hebrew-text"
          >
            נקה הכל
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : myVehicles && myVehicles.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground hebrew-text">
            מציג {filteredVehicles.length} רכבים
          </p>

          {/* Vehicles List */}
          <div className="space-y-3">
            {filteredVehicles.map((vehicle) => {
              const transmissionLabel = vehicle.transmission === 'automatic' ? 'אוטומט' : 
                                       vehicle.transmission === 'manual' ? 'ידנית' : 'טיפטרוניק';
              const fuelLabel = vehicle.fuel_type === 'gasoline' ? 'בנזין' :
                               vehicle.fuel_type === 'diesel' ? 'דיזל' :
                               vehicle.fuel_type === 'hybrid' ? 'היברידי' : 'חשמלי';
              const statusLabel = vehicle.status === 'available' ? 'זמין' : 
                                 vehicle.status === 'sold' ? 'נמכר' : 'לא פעיל';
              
              return (
                <GradientBorderContainer key={vehicle.id} className="rounded-md">
                  <Card 
                    className="bg-black border-0 rounded-md card-interactive cursor-pointer"
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
                          {vehicle.is_boosted && (
                            <Badge className="absolute top-2 left-2 bg-orange-500">
                              🔥 מבוסט
                            </Badge>
                          )}
                        </div>

                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="font-semibold text-foreground hebrew-text">
                                {vehicle.make?.name_hebrew} {vehicle.model?.name_hebrew} {vehicle.year}
                              </h3>
                              <Badge 
                                variant={vehicle.status === 'available' ? 'default' : 'secondary'}
                                className="hebrew-text"
                              >
                                {statusLabel}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground hebrew-text">
                              {vehicle.kilometers?.toLocaleString()} ק״מ • {transmissionLabel} • {fuelLabel}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-primary hebrew-text">
                              ₪{parseFloat(vehicle.price.toString()).toLocaleString()}
                            </p>
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => navigate(`/mobile/vehicle/${vehicle.id}/edit`)}
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive hover:text-destructive h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </GradientBorderContainer>
              );
            })}
          </div>
        </>
      ) : (
        <GradientBorderContainer className="rounded-md">
          <Card className="bg-black border-0 rounded-md p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white hebrew-text mb-2">
                  אין לך רכבים עדיין
                </h3>
                <p className="text-muted-foreground hebrew-text mb-4">
                  התחל למכור רכבים על ידי הוספת הרכב הראשון שלך
                </p>
                <Button onClick={() => navigate('/mobile/add-vehicle')} className="hebrew-text">
                  <Plus className="h-4 w-4 ml-2" />
                  הוסף רכב ראשון
                </Button>
              </div>
            </div>
          </Card>
        </GradientBorderContainer>
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

export default MyVehiclesScreen;
