import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { AdminFilterButton } from "./AdminFilterButton";
import { AdminResultsCount } from "./AdminResultsCount";
import { AdminActiveFiltersDisplay } from "./AdminActiveFiltersDisplay";
import { AdminVehicleFilters, getActiveAdminFilterCount } from "@/utils/admin/vehicleFilters";
import { useVehicleMakes, useVehicleModels, useVehicleTags } from "@/hooks/mobile/useVehicles";
import { VEHICLE_TYPES } from "@/constants/vehicleTypes";

interface AdminVehicleFilterBarProps {
  filters: AdminVehicleFilters;
  onFiltersChange: (filters: AdminVehicleFilters) => void;
  resultCount: number;
  isLoading?: boolean;
  showTags?: boolean;
  showVehicleType?: boolean;
}

export const AdminVehicleFilterBar = ({
  filters,
  onFiltersChange,
  resultCount,
  isLoading = false,
  showTags = true,
  showVehicleType = true,
}: AdminVehicleFilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<AdminVehicleFilters>(filters);
  
  const { data: makes = [] } = useVehicleMakes();
  const { data: models = [] } = useVehicleModels(localFilters.makeId ? Number(localFilters.makeId) : undefined);
  const { data: tags = [] } = useVehicleTags();

  const activeFilterCount = getActiveAdminFilterCount(filters);

  const handleMakeChange = (value: string) => {
    setLocalFilters({ ...localFilters, makeId: value, modelId: undefined });
  };

  const handleModelChange = (value: string) => {
    setLocalFilters({ ...localFilters, modelId: value });
  };

  const handleVehicleTypeChange = (value: string) => {
    setLocalFilters({ ...localFilters, vehicleType: value });
  };

  const handleTagToggle = (tagId: string) => {
    const currentTags = localFilters.tagIds || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    setLocalFilters({ ...localFilters, tagIds: newTags });
  };

  const handleReset = () => {
    const emptyFilters: AdminVehicleFilters = {};
    setLocalFilters(emptyFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleClearAll = () => {
    const emptyFilters: AdminVehicleFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <>
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <AdminResultsCount count={resultCount} isLoading={isLoading} />
            <div className="flex items-center gap-3">
              {activeFilterCount > 0 && (
                <AdminActiveFiltersDisplay 
                  filterCount={activeFilterCount}
                  onClearAll={handleClearAll}
                />
              )}
              <AdminFilterButton
                activeCount={activeFilterCount}
                onClick={() => setIsOpen(true)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="hebrew-text text-right">סינון מתקדם</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 py-6">
            {/* Make */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-3">
              <Label className="hebrew-text text-right">יצרן</Label>
              <Select value={localFilters.makeId} onValueChange={handleMakeChange}>
                <SelectTrigger className="hebrew-text h-10">
                  <SelectValue placeholder="בחר יצרן" />
                </SelectTrigger>
                <SelectContent>
                  {makes.map(make => (
                    <SelectItem key={make.id} value={String(make.id)} className="hebrew-text">
                      {make.name_hebrew}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-3">
              <Label className="hebrew-text text-right">דגם</Label>
              <Select 
                value={localFilters.modelId} 
                onValueChange={handleModelChange}
                disabled={!localFilters.makeId}
              >
                <SelectTrigger className="hebrew-text h-10">
                  <SelectValue placeholder="בחר דגם" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.id} value={String(model.id)} className="hebrew-text">
                      {model.name_hebrew}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Type */}
            {showVehicleType && (
              <div className="grid grid-cols-[140px_1fr] items-center gap-3">
                <Label className="hebrew-text text-right">סוג רכב</Label>
                <Select value={localFilters.vehicleType} onValueChange={handleVehicleTypeChange}>
                  <SelectTrigger className="hebrew-text h-10">
                    <SelectValue placeholder="בחר סוג רכב" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value} className="hebrew-text">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Year Range */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-3">
              <Label className="hebrew-text text-right">טווח שנים</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="משנה"
                  value={localFilters.yearFrom || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, yearFrom: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="hebrew-text h-10"
                />
                <Input
                  type="number"
                  placeholder="עד"
                  value={localFilters.yearTo || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, yearTo: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="hebrew-text h-10"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-3">
              <Label className="hebrew-text text-right">טווח מחירים (₪)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="ממחיר"
                  value={localFilters.priceFrom || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, priceFrom: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="hebrew-text h-10"
                />
                <Input
                  type="number"
                  placeholder="עד מחיר"
                  value={localFilters.priceTo || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, priceTo: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="hebrew-text h-10"
                />
              </div>
            </div>

            {/* Tags */}
            {showTags && (
              <div>
                <Label className="hebrew-text mb-2 block text-right">תגיות</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => {
                    const isSelected = localFilters.tagIds?.includes(String(tag.id)) || false;
                    return (
                      <Badge
                        key={tag.id}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer hebrew-text"
                        onClick={() => handleTagToggle(String(tag.id))}
                      >
                        {tag.name_hebrew}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="flex gap-2">
            <Button 
              variant="ghost" 
              onClick={handleReset}
              className="hebrew-text flex-1"
            >
              נקה הכל
            </Button>
            <Button 
              onClick={handleApply}
              className="hebrew-text flex-1"
            >
              החל סינון
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
