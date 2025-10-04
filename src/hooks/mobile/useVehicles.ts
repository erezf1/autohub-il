import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VehicleInput {
  make_id: number;
  model_id: number;
  sub_model?: string;
  year: number;
  kilometers: number;
  transmission: 'manual' | 'automatic' | 'semi_automatic';
  fuel_type: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  engine_size?: number;
  color?: string;
  price: number;
  description?: string;
  had_severe_crash?: boolean;
  previous_owners?: number;
}

export const useVehicles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all available vehicles
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(id, name_hebrew, name_english),
          model:vehicle_models(id, name_hebrew, name_english),
          owner:user_profiles(full_name, business_name)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch user's own vehicles
  const { data: myVehicles } = useQuery({
    queryKey: ['my-vehicles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(id, name_hebrew, name_english),
          model:vehicle_models(id, name_hebrew, name_english)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Add new vehicle
  const addVehicleMutation = useMutation({
    mutationFn: async (vehicleData: VehicleInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('vehicle_listings')
        .insert([{ ...vehicleData, owner_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
      toast({
        title: 'הרכב נוסף בהצלחה!',
        description: 'הרכב שלך פורסם ויופיע ברשימת החיפוש',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה בהוספת הרכב',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    vehicles,
    myVehicles,
    isLoading,
    error,
    addVehicle: addVehicleMutation.mutate,
    isAddingVehicle: addVehicleMutation.isPending,
  };
};

// Fetch vehicle makes and models
export const useVehicleMakes = () => {
  return useQuery({
    queryKey: ['vehicle-makes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_makes')
        .select('*')
        .eq('is_active', true)
        .order('name_hebrew');

      if (error) throw error;
      return data;
    },
  });
};

export const useVehicleModels = (makeId?: number) => {
  return useQuery({
    queryKey: ['vehicle-models', makeId],
    queryFn: async () => {
      if (!makeId) return [];

      const { data, error } = await supabase
        .from('vehicle_models')
        .select('*')
        .eq('make_id', makeId)
        .eq('is_active', true)
        .order('name_hebrew');

      if (error) throw error;
      return data;
    },
    enabled: !!makeId,
  });
};
