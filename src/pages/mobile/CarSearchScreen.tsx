import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  LoadingSpinner,
  VehicleCard,
} from "@/components/common";

const CarSearchScreen = () => {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { vehicles, isLoading } = useVehicles();

  // Sort to show boosted vehicles first
  const sortedVehicles = [...(vehicles || [])].sort((a, b) => {
    const aIsBoosted = a.is_boosted && a.boosted_until && new Date(a.boosted_until) > new Date();
    const bIsBoosted = b.is_boosted && b.boosted_until && new Date(b.boosted_until) > new Date();
    if (aIsBoosted && !bIsBoosted) return -1;
    if (!aIsBoosted && bIsBoosted) return 1;
    return 0;
  });

  const filteredResults = applyVehicleFilters(
    sortedVehicles,
    filters,
    ""
  );

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <PageContainer>
      <PageHeader
        title="מאגר הרכבים"
        onBack={() => navigate('/mobile/dashboard')}
        rightAction={
          <GradientBorderContainer className="rounded-md">
            <Button 
              variant="outline"
              onClick={() => navigate('/mobile/my-vehicles')}
              className="border-0"
            >
              הרכבים שלי
            </Button>
          </GradientBorderContainer>
        }
      />

      <div className="flex items-center justify-between gap-2 mb-4">
        <ResultsCount count={filteredResults.length} isLoading={isLoading} />
        <GradientBorderContainer className="rounded-md">
          <FilterButton
            activeCount={activeFilterCount}
            onClick={() => setFilterDrawerOpen(true)}
          />
        </GradientBorderContainer>
      </div>

      <ActiveFiltersDisplay
        filterCount={activeFilterCount}
        onClearAll={() => setFilters({})}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-3">
          {filteredResults.map((car) => (
            <VehicleCard
              key={car.id}
              id={car.id}
              images={car.images}
              makeName={car.make?.name_hebrew || ''}
              modelName={car.model?.name_hebrew || ''}
              year={car.year}
              kilometers={car.kilometers}
              transmission={car.transmission}
              fuelType={car.fuel_type}
              price={car.price}
              hotSalePrice={car.hot_sale_price}
              isBoosted={car.is_boosted}
              boostedUntil={car.boosted_until}
              isPrivateListing={car.is_private_listing}
              onClick={() => navigate(`/mobile/vehicle/${car.id}`)}
            />
          ))}
        </div>
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

export default CarSearchScreen;