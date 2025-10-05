import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminVehicles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['admin-vehicles'],
    queryFn: async () => {
      // First fetch vehicles with make and model
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(name_hebrew, name_english),
          model:vehicle_models(name_hebrew, name_english)
        `)
        .order('created_at', { ascending: false });

      if (vehiclesError) throw vehiclesError;
      if (!vehiclesData) return [];

      // Fetch owner profiles separately
      const ownerIds = [...new Set(vehiclesData.map(v => v.owner_id).filter(Boolean))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, full_name, business_name')
        .in('id', ownerIds);

      if (profilesError) throw profilesError;

      // Merge profiles with vehicles
      const profilesById = new Map((profilesData || []).map(p => [p.id, p]));
      return vehiclesData.map(v => ({
        ...v,
        owner: profilesById.get(v.owner_id) || null,
      }));
    },
  });

  const addVehicleMutation = useMutation({
    mutationFn: async (vehicleData: any) => {
      const { data, error } = await supabase.functions.invoke('admin-add-vehicle', {
        body: vehicleData,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      toast({
        title: 'הרכב נוסף בהצלחה',
        description: 'הרכב נוסף למערכת',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה',
        description: error.message || 'אירעה שגיאה בהוספת הרכב',
        variant: 'destructive',
      });
    },
  });

  return {
    vehicles,
    isLoading,
    error,
    addVehicle: addVehicleMutation.mutate,
    isAddingVehicle: addVehicleMutation.isPending,
  };
};