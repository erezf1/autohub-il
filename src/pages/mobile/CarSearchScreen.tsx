import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useVehicles } from "@/hooks/mobile/useVehicles";
import { VehicleFilterDrawer } from "@/components/mobile/VehicleFilterDrawer";
import { applyVehicleFilters, getActiveFilterCount, VehicleFilters } from "@/utils/mobile/vehicleFilters";
import {
  PageContainer,
  PageHeader,
  SearchFilterBar,
  ActiveFiltersDisplay,
  ResultsCount,
  LoadingSpinner,
  VehicleCard,
} from "@/components/common";

const CarSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
    searchQuery
  );

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <PageContainer>
      <PageHeader
        title="חיפוש רכבים"
        onBack={() => navigate('/mobile/dashboard')}
        rightAction={
          <Button 
            variant="outline"
            onClick={() => navigate('/mobile/my-vehicles')}
          >
            הרכבים שלי
          </Button>
        }
      />

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="חפש לפי יצרן, דגם או שנה..."
        filterCount={activeFilterCount}
        onFilterClick={() => setFilterDrawerOpen(true)}
      />

      <ActiveFiltersDisplay
        filterCount={activeFilterCount}
        onClearAll={() => setFilters({})}
      />

      <ResultsCount count={filteredResults.length} isLoading={isLoading} />

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