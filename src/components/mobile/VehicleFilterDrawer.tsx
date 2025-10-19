import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useVehicleMakes, useVehicleModels, useVehicleTags } from "@/hooks/mobile/useVehicles";
import { VehicleFilters } from "@/utils/mobile/vehicleFilters";
import { VEHICLE_TYPES } from "@/constants/vehicleTypes";

interface VehicleFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: VehicleFilters) => void;
  currentFilters: VehicleFilters;
}

export const VehicleFilterDrawer = ({ 
  open, 
  onOpenChange, 
  onApplyFilters, 
  currentFilters 
}: VehicleFilterDrawerProps) => {
  const [localFilters, setLocalFilters] = useState<VehicleFilters>(currentFilters);
  const { data: makes } = useVehicleMakes();
  const { data: models } = useVehicleModels(localFilters.makeId);
  const { data: tags } = useVehicleTags();

  const currentYear = new Date().getFullYear();

  // Update local filters when currentFilters change
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleMakeChange = (value: string) => {
    const makeId = value === "all" ? undefined : parseInt(value);
    setLocalFilters({ ...localFilters, makeId, modelId: undefined });
  };

  const handleModelChange = (value: string) => {
    const modelId = value === "all" ? undefined : parseInt(value);
    setLocalFilters({ ...localFilters, modelId });
  };

  const handleYearFromChange = (value: string) => {
    const yearFrom = value ? parseInt(value) : undefined;
    setLocalFilters({ 
      ...localFilters, 
      yearFrom,
      // Auto-set yearTo to yearFrom if yearTo is empty or less than yearFrom
      yearTo: (!localFilters.yearTo || (yearFrom && localFilters.yearTo < yearFrom)) 
        ? yearFrom 
        : localFilters.yearTo
    });
  };

  const handleYearToChange = (value: string) => {
    const yearTo = value ? parseInt(value) : undefined;
    setLocalFilters({ ...localFilters, yearTo });
  };

  const handlePriceFromChange = (value: string) => {
    const priceFrom = value ? parseFloat(value) : undefined;
    setLocalFilters({ ...localFilters, priceFrom });
  };

  const handlePriceToChange = (value: string) => {
    const priceTo = value ? parseFloat(value) : undefined;
    setLocalFilters({ ...localFilters, priceTo });
  };

  const handleTagToggle = (tagId: number) => {
    const currentTags = localFilters.tagIds || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    setLocalFilters({ ...localFilters, tagIds: newTags.length > 0 ? newTags : undefined });
  };

  const handleVehicleTypeChange = (value: string) => {
    const vehicleType = value === "all" ? undefined : value;
    setLocalFilters({ ...localFilters, vehicleType });
  };

  const handleReset = () => {
    setLocalFilters({});
    onApplyFilters({});
    onOpenChange(false);
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] max-w-md mx-auto" dir="rtl">
        <DrawerHeader>
          <DrawerTitle className="text-right hebrew-text">סינון רכבים</DrawerTitle>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-4 space-y-4">
          {/* Make Selector - Horizontal */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-3">
            <Label className="hebrew-text text-right">יצרן</Label>
            <Select 
              value={localFilters.makeId?.toString() || "all"} 
              onValueChange={handleMakeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר יצרן" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                {makes?.map(make => (
                  <SelectItem key={make.id} value={make.id.toString()}>
                    {make.name_hebrew}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Selector - Horizontal */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-3">
            <Label className="hebrew-text text-right">דגם</Label>
            <Select 
              value={localFilters.modelId?.toString() || "all"} 
              onValueChange={handleModelChange}
              disabled={!localFilters.makeId}
            >
              <SelectTrigger>
                <SelectValue placeholder={localFilters.makeId ? "בחר דגם" : "בחר תחילה יצרן"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                {models?.map(model => (
                  <SelectItem key={model.id} value={model.id.toString()}>
                    {model.name_hebrew}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Type - Horizontal */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-3">
            <Label className="hebrew-text text-right">סוג רכב</Label>
            <Select 
              value={localFilters.vehicleType || "all"} 
              onValueChange={handleVehicleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר סוג רכב" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                {VEHICLE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Range - Simplified - Horizontal */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-3">
            <Label className="hebrew-text text-right">טווח שנים</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                min={1980}
                max={currentYear}
                value={localFilters.yearFrom || ""}
                onChange={(e) => handleYearFromChange(e.target.value)}
                placeholder="משנה"
              />
              <Input
                type="number"
                min={localFilters.yearFrom || 1980}
                max={currentYear}
                value={localFilters.yearTo || ""}
                onChange={(e) => handleYearToChange(e.target.value)}
                placeholder="עד"
              />
            </div>
          </div>

          {/* Price Range - Simplified - Horizontal */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-3">
            <Label className="hebrew-text text-right">טווח מחירים (₪)</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                min={0}
                value={localFilters.priceFrom || ""}
                onChange={(e) => handlePriceFromChange(e.target.value)}
                placeholder="ממחיר"
              />
              <Input
                type="number"
                min={localFilters.priceFrom || 0}
                value={localFilters.priceTo || ""}
                onChange={(e) => handlePriceToChange(e.target.value)}
                placeholder="עד מחיר"
              />
            </div>
          </div>

          {/* Tags - Compact */}
          <div>
            <Label className="hebrew-text mb-2 block text-right">
              תגיות {localFilters.tagIds && localFilters.tagIds.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({localFilters.tagIds.length} נבחרו)
                </span>
              )}
            </Label>
            <div className="flex flex-wrap gap-2">
              {tags?.map(tag => {
                const isSelected = localFilters.tagIds?.includes(tag.id) || false;
                return (
                  <Badge
                    key={tag.id}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    style={isSelected ? { 
                      backgroundColor: tag.color || '#6B7280',
                      borderColor: tag.color || '#6B7280'
                    } : {}}
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.name_hebrew}
                    {isSelected && <X className="h-3 w-3 mr-1" />}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        <DrawerFooter className="flex-row gap-2" dir="rtl">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex-1"
          >
            אפס הכל
          </Button>
          <Button 
            onClick={handleApply}
            className="flex-1"
          >
            החל פילטרים
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
