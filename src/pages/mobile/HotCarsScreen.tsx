import { useState } from "react";
import { Loader2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { useNavigate } from "react-router-dom";
import { useBoosts } from "@/hooks/mobile/useBoosts";
import { VehicleFilterDrawer } from "@/components/mobile/VehicleFilterDrawer";
import { applyVehicleFilters, getActiveFilterCount, VehicleFilters } from "@/utils/mobile/vehicleFilters";
import {
  PageContainer,
  PageHeader,
  FilterButton,
  ActiveFiltersDisplay,
  ResultsCount,
  VehicleCard,
} from "@/components/common";

export const HotCarsScreen = () => {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { boostedVehicles, isLoadingBoosted } = useBoosts();

  // Mock vehicles to show while designing UI or when no boosted vehicles available
  const mockBoostedVehicles = [
    {
      id: 'mock-1',
      images: [],
      make: { name_hebrew: 'טויוטה' },
      model: { name_hebrew: 'קורולה' },
      year: 2020,
      kilometers: 95000,
      transmission: 'automatic',
      fuel_type: 'gasoline',
      price: 165000,
      hot_sale_price: 159000,
      is_boosted: true,
      boosted_until: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 'mock-2',
      images: [],
      make: { name_hebrew: 'מאזדה' },
      model: { name_hebrew: 'מז' },
      year: 2019,
      kilometers: 120000,
      transmission: 'manual',
      fuel_type: 'diesel',
      price: 129000,
      hot_sale_price: null,
      is_boosted: true,
      boosted_until: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: 'mock-3',
      images: [],
      make: { name_hebrew: 'הונדה' },
      model: { name_hebrew: 'אקורד' },
      year: 2021,
      kilometers: 45000,
      transmission: 'automatic',
      fuel_type: 'hybrid',
      price: 235000,
      hot_sale_price: 225000,
      is_boosted: true,
      boosted_until: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    }
  ];

  const sourceVehicles = (boostedVehicles && boostedVehicles.length > 0) ? boostedVehicles : mockBoostedVehicles;

  const filteredResults = applyVehicleFilters(
    sourceVehicles,
    filters,
    ""
  );

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <PageContainer>
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="hebrew-text">מכירות חמות</span>
          </div>
        }
        onBack={() => navigate('/mobile/dashboard')}
        rightAction={
          <GradientBorderContainer className="rounded-md">
            <Button 
              variant="outline"
              onClick={() => navigate('/mobile/boost-management')}
              className="border-0"
            >
              הבוסטים שלי
            </Button>
          </GradientBorderContainer>
        }
      />

      <div className="flex items-center justify-between gap-2 mb-4">
        <ResultsCount count={filteredResults.length} isLoading={isLoadingBoosted} />
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

      {isLoadingBoosted ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredResults.map((car) => {
            const originalPrice = parseFloat(car.price.toString());
            const hotSalePrice = car.hot_sale_price ? parseFloat(car.hot_sale_price.toString()) : null;

            return (
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
    </PageContainer>
  );
};
