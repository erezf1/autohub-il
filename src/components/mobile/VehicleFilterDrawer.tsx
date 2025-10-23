import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";
import { Plus, Minus, X } from "lucide-react";
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
      <DrawerContent 
        className="max-h-[90vh] w-full border-0 bg-black" 
        dir="rtl"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)',
          border: '2px solid transparent',
          borderTop: '2px solid #2277ee',
          backgroundOrigin: 'border-box',
          backgroundClip: 'content-box, border-box',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <DrawerHeader>
          <DrawerTitle className="text-right hebrew-text text-white">סינון רכבים</DrawerTitle>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-4 space-y-6">
          {/* Make Selector */}
          <div>
            <Label className="hebrew-text text-white">יצרן</Label>
            <GradientBorderContainer className="rounded-md">
              <Select 
                value={localFilters.makeId?.toString() || "all"} 
                onValueChange={handleMakeChange}
              >
                <SelectTrigger className="text-right" dir="rtl">
                  <SelectValue placeholder="בחר יצרן" />
                </SelectTrigger>
                <SelectContent dir="rtl" align="end">
                  <SelectItem value="all">הכל</SelectItem>
                  {makes?.map(make => (
                    <SelectItem key={make.id} value={make.id.toString()}>
                      {make.name_hebrew}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </GradientBorderContainer>
          </div>

          {/* Model Selector */}
          <div>
            <Label className="hebrew-text text-white">דגם</Label>
            <GradientBorderContainer className="rounded-md">
              <Select 
                value={localFilters.modelId?.toString() || "all"} 
                onValueChange={handleModelChange}
                disabled={!localFilters.makeId}
              >
                <SelectTrigger className="text-right" dir="rtl">
                  <SelectValue placeholder={localFilters.makeId ? "בחר דגם" : "בחר תחילה יצרן"} />
                </SelectTrigger>
                <SelectContent dir="rtl" align="end">
                  <SelectItem value="all">הכל</SelectItem>
                  {models?.map(model => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name_hebrew}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </GradientBorderContainer>
          </div>

          {/* Year Range */}
          <div>
            <Label className="hebrew-text mb-2 block text-white">טווח שנים</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-end gap-2 mt-1">
                  <GradientBorderContainer className="rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const current = localFilters.yearFrom || currentYear;
                        handleYearFromChange(Math.max(1980, current - 1).toString());
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </GradientBorderContainer>
                  <div className="flex-1 flex flex-col">
                    <Label className="text-sm text-gray-300 hebrew-text text-center mb-1">משנה</Label>
                    <GradientBorderContainer className="rounded-md">
                      <Input
                        type="number"
                        min={1980}
                        max={currentYear}
                        value={localFilters.yearFrom || ""}
                        onChange={(e) => handleYearFromChange(e.target.value)}
                        placeholder="1980"
                        className="text-center"
                      />
                    </GradientBorderContainer>
                  </div>
                  <GradientBorderContainer className="rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const current = localFilters.yearFrom || 1980;
                        handleYearFromChange(Math.min(currentYear, current + 1).toString());
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </GradientBorderContainer>
                </div>
              </div>

              <div>
                <div className="flex items-end gap-2 mt-1">
                  <GradientBorderContainer className="rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const current = localFilters.yearTo || currentYear;
                        const minYear = localFilters.yearFrom || 1980;
                        handleYearToChange(Math.max(minYear, current - 1).toString());
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </GradientBorderContainer>
                  <div className="flex-1 flex flex-col">
                    <Label className="text-sm text-gray-300 hebrew-text text-center mb-1">עד שנה</Label>
                    <GradientBorderContainer className="rounded-md">
                      <Input
                        type="number"
                        min={localFilters.yearFrom || 1980}
                        max={currentYear}
                        value={localFilters.yearTo || ""}
                        onChange={(e) => handleYearToChange(e.target.value)}
                        placeholder={currentYear.toString()}
                        className="text-center"
                      />
                    </GradientBorderContainer>
                  </div>
                  <GradientBorderContainer className="rounded-md">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const current = localFilters.yearTo || (localFilters.yearFrom || currentYear);
                        handleYearToChange(Math.min(currentYear, current + 1).toString());
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </GradientBorderContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="hebrew-text mb-2 block">טווח מחירים (₪)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground hebrew-text">ממחיר</Label>
                <GradientBorderContainer className="rounded-md flex-1">
                  <Input
                    type="number"
                    min={0}
                    value={localFilters.priceFrom || ""}
                    onChange={(e) => handlePriceFromChange(e.target.value)}
                    placeholder="0"
                    className="mt-1"
                  />
                </GradientBorderContainer>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground hebrew-text">עד מחיר</Label>
                <GradientBorderContainer className="rounded-md flex-1">
                  <Input
                    type="number"
                    min={localFilters.priceFrom || 0}
                    value={localFilters.priceTo || ""}
                    onChange={(e) => handlePriceToChange(e.target.value)}
                    placeholder="אין מגבלה"
                    className="mt-1"
                  />
                </GradientBorderContainer>
              </div>
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
          <GradientBorderContainer className="rounded-md flex-1">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-full"
            >
              אפס הכל
            </Button>
          </GradientBorderContainer>
          <GradientBorderContainer className="rounded-md flex-1">
            <Button 
              onClick={handleApply}
              className="w-full text-black"
            >
              החל פילטרים
            </Button>
          </GradientBorderContainer>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
