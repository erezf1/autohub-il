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

  const sourceVehicles = boostedVehicles || [];

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
      ) : filteredResults.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Flame className="h-16 w-16 text-orange-500/30 mx-auto" />
          <div className="space-y-2">
            <p className="text-foreground hebrew-text font-medium">אין מכירות חמות כרגע</p>
            <p className="text-sm text-muted-foreground hebrew-text">
              כאשר סוחרים אחרים יפעילו בוסטים, תוכל לראות אותם כאן
            </p>
          </div>
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
