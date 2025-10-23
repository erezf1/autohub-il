import { useState } from "react";
import { Plus, Loader2, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "@/hooks/mobile/useVehicles";
import { VehicleFilterDrawer } from "@/components/mobile/VehicleFilterDrawer";
import { applyVehicleFilters, getActiveFilterCount, VehicleFilters } from "@/utils/mobile/vehicleFilters";
import {
  PageContainer,
  PageHeader,
  FilterButton,
  ActiveFiltersDisplay,
  ResultsCount,
} from "@/components/common";
import darkCarImage from "@/assets/dark_car.png";

const MyVehiclesScreen = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const { myVehicles, isLoading } = useVehicles();

  const filteredVehicles = applyVehicleFilters(
    myVehicles || [],
    filters,
    ""
  );

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <PageContainer>
      <PageHeader
        title="הרכבים שלי"
        onBack={() => navigate('/mobile/search')}
        rightAction={
          <GradientBorderContainer className="rounded-md">
            <Button 
              onClick={() => navigate('/mobile/add-vehicle')} 
              variant="outline"
              className="border-0"
            >
              <Plus className="h-4 w-4 ml-2" />
              הוסף רכב
            </Button>
          </GradientBorderContainer>
        }
      />

      {/* Results count and filter button */}
      {myVehicles && myVehicles.length > 0 && (
        <div className="flex items-center justify-between gap-2 mb-4">
          <ResultsCount count={filteredVehicles.length} isLoading={isLoading} />
          <GradientBorderContainer className="rounded-md">
            <FilterButton
              activeCount={activeFilterCount}
              onClick={() => setFilterDrawerOpen(true)}
            />
          </GradientBorderContainer>
        </div>
      )}

      <ActiveFiltersDisplay
        filterCount={activeFilterCount}
        onClearAll={() => setFilters({})}
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : myVehicles && myVehicles.length > 0 ? (
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
    </PageContainer>
  );
};

export default MyVehiclesScreen;
