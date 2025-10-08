export const VEHICLE_TYPES = [
  { value: 'micro', label: 'מיקרו' },
  { value: 'mini', label: 'מיני' },
  { value: 'family', label: 'משפחתי' },
  { value: 'executive', label: 'מנהלים' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: 'יוקרתי' },
  { value: 'sport', label: 'ספורט' },
] as const;

export type VehicleType = typeof VEHICLE_TYPES[number]['value'];

// Helper function to get label from value
export const getVehicleTypeLabel = (value: string | null | undefined): string => {
  if (!value) return '-';
  const type = VEHICLE_TYPES.find(t => t.value === value);
  return type ? type.label : value; // Fallback to value if not found (backward compatibility)
};
