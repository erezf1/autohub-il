/**
 * Type definitions for Private Users module
 */

export interface PrivateUser {
  id: string;
  phone_number: string;
  full_name: string;
  location_id: number | null;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface PrivateUserProfile {
  id: string;
  phone_number: string;
  full_name: string;
  location?: {
    id: number;
    name_hebrew: string;
    name_english: string;
  };
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  vehicle_count: number;
  created_at: string;
}

export interface PrivateVehicleListing {
  id: string;
  private_user_id: string;
  is_private_listing: boolean;
  make_id: number;
  model_id: number;
  year: number;
  price: number;
  kilometers?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  description?: string;
  images?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PrivateUserStats {
  total_vehicles: number;
  available_vehicles: number;
  views_count?: number;
  contacts_count?: number;
}
