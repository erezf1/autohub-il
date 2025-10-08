export interface VehicleFilters {
  makeId?: number;
  modelId?: number;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  tagIds?: number[];
}

export const applyVehicleFilters = (vehicles: any[], filters: VehicleFilters, searchQuery?: string) => {
  return vehicles.filter(vehicle => {
    // Text search logic
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const makeMatch = vehicle.make?.name_hebrew?.toLowerCase().includes(query) || 
                       vehicle.make?.name_english?.toLowerCase().includes(query);
      const modelMatch = vehicle.model?.name_hebrew?.toLowerCase().includes(query) || 
                        vehicle.model?.name_english?.toLowerCase().includes(query);
      const yearMatch = vehicle.year?.toString().includes(query);
      
      if (!makeMatch && !modelMatch && !yearMatch) {
        return false;
      }
    }

    // Make filter
    if (filters.makeId && vehicle.make_id !== filters.makeId) {
      return false;
    }

    // Model filter
    if (filters.modelId && vehicle.model_id !== filters.modelId) {
      return false;
    }

    // Year range filter
    if (filters.yearFrom && vehicle.year < filters.yearFrom) {
      return false;
    }
    if (filters.yearTo && vehicle.year > filters.yearTo) {
      return false;
    }

    // Price range filter
    if (filters.priceFrom && parseFloat(vehicle.price) < filters.priceFrom) {
      return false;
    }
    if (filters.priceTo && parseFloat(vehicle.price) > filters.priceTo) {
      return false;
    }

    // Tags filter - vehicle must have at least one of the selected tags
    if (filters.tagIds && filters.tagIds.length > 0) {
      // This assumes vehicle has a tags array - adjust based on actual data structure
      // For now, we'll skip tag filtering if vehicle doesn't have tags loaded
      if (vehicle.tags && Array.isArray(vehicle.tags)) {
        const vehicleTagIds = vehicle.tags.map((t: any) => t.id || t.tag_id);
        const hasMatchingTag = filters.tagIds.some(tagId => vehicleTagIds.includes(tagId));
        if (!hasMatchingTag) {
          return false;
        }
      }
    }

    return true;
  });
};

export const getActiveFilterCount = (filters: VehicleFilters): number => {
  let count = 0;
  
  if (filters.makeId) count++;
  if (filters.modelId) count++;
  if (filters.yearFrom) count++;
  if (filters.yearTo) count++;
  if (filters.priceFrom) count++;
  if (filters.priceTo) count++;
  if (filters.tagIds && filters.tagIds.length > 0) count++;

  return count;
};
