export interface AdminVehicleFilters {
  priceFrom?: number;
  priceTo?: number;
  yearFrom?: number;
  yearTo?: number;
  makeId?: string;
  modelId?: string;
  tagIds?: string[];
  vehicleType?: string;
}

export const applyAdminVehicleFilters = (vehicles: any[], filters: AdminVehicleFilters) => {
  return vehicles.filter(vehicle => {
    // Price filter
    if (filters.priceFrom && vehicle.price < filters.priceFrom) return false;
    if (filters.priceTo && vehicle.price > filters.priceTo) return false;

    // Year filter
    if (filters.yearFrom && vehicle.year < filters.yearFrom) return false;
    if (filters.yearTo && vehicle.year > filters.yearTo) return false;

    // Make filter
    if (filters.makeId && vehicle.make?.id !== filters.makeId) return false;

    // Model filter
    if (filters.modelId && vehicle.model?.id !== filters.modelId) return false;

    // Vehicle type filter
    if (filters.vehicleType && vehicle.sub_model !== filters.vehicleType) return false;

    // Tags filter
    if (filters.tagIds && filters.tagIds.length > 0) {
      const vehicleTagIds = vehicle.tags?.map((tag: any) => tag.id) || [];
      const hasAllTags = filters.tagIds.every(tagId => vehicleTagIds.includes(tagId));
      if (!hasAllTags) return false;
    }

    return true;
  });
};

export const applyAdminRequestFilters = (requests: any[], filters: AdminVehicleFilters, activeTab: string) => {
  return requests.filter(request => {
    // Tab filter
    const matchesTab = activeTab === "all" || 
                      (activeTab === "open" && request.status === "פתוח") ||
                      (activeTab === "closed" && request.status === "סגור") ||
                      (activeTab === "pending" && request.status === "ממתין");
    
    if (!matchesTab) return false;

    // Price filter (from budget string)
    // Note: requests have budget as string, so we'll skip price filtering for now
    // This can be enhanced if we have structured price data

    // Year filter - requests don't have year, skip

    // Make/Model filter - requests don't have structured make/model, skip

    return true;
  });
};

export const applyAdminAuctionFilters = (auctions: any[], filters: AdminVehicleFilters, activeTab: string) => {
  return auctions.filter(auction => {
    // Tab filter
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && auction.status === "פעיל") ||
                      (activeTab === "ended" && auction.status === "הסתיים") ||
                      (activeTab === "cancelled" && auction.status === "בוטל");
    
    if (!matchesTab) return false;

    // Price filter (from current bid)
    if (filters.priceFrom && auction.currentBid && parseFloat(auction.currentBid.replace(/[^\\d]/g, '')) < filters.priceFrom) return false;
    if (filters.priceTo && auction.currentBid && parseFloat(auction.currentBid.replace(/[^\\d]/g, '')) > filters.priceTo) return false;

    // Other filters can be added when auction data structure supports them

    return true;
  });
};

export const getActiveAdminFilterCount = (filters: AdminVehicleFilters): number => {
  let count = 0;
  
  if (filters.priceFrom) count++;
  if (filters.priceTo) count++;
  if (filters.yearFrom) count++;
  if (filters.yearTo) count++;
  if (filters.makeId) count++;
  if (filters.modelId) count++;
  if (filters.vehicleType) count++;
  if (filters.tagIds && filters.tagIds.length > 0) count += filters.tagIds.length;
  
  return count;
};
