import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminClient } from '@/integrations/supabase/adminClient';
import { useToast } from '@/hooks/use-toast';

export const useAdminVehicles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['admin-vehicles'],
    queryFn: async () => {
      // First fetch vehicles with make and model
      const { data: vehiclesData, error: vehiclesError } = await adminClient
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
      const { data: profilesData, error: profilesError } = await adminClient
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

  // Fetch single vehicle
  const useAdminVehicle = (id: string | undefined) => useQuery({
    queryKey: ['admin-vehicle', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data: vehicle, error: vehicleError } = await adminClient
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(id, name_hebrew, name_english),
          model:vehicle_models(id, name_hebrew, name_english)
        `)
        .eq('id', id)
        .single();

      if (vehicleError) throw vehicleError;
      if (!vehicle) return null;

      // Fetch owner profile
      const { data: profile, error: profileError } = await adminClient
        .from('user_profiles')
        .select('id, full_name, business_name')
        .eq('id', vehicle.owner_id)
        .single();

      if (profileError) throw profileError;

      // Fetch tags
      const { data: tags, error: tagsError } = await adminClient
        .from('vehicle_listing_tags')
        .select('tag_id, vehicle_tags(id, name_hebrew, name_english, color)')
        .eq('vehicle_id', id);

      if (tagsError) throw tagsError;

      return {
        ...vehicle,
        owner: profile,
        tags: tags?.map(t => t.vehicle_tags).filter(Boolean) || [],
      };
    },
    enabled: !!id,
  });

  const addVehicleMutation = useMutation({
    mutationFn: async (vehicleData: any) => {
      const { data, error } = await adminClient.functions.invoke('admin-add-vehicle', {
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
      // Parse error response for field-specific messages
      let errorMessage = 'אירעה שגיאה בהוספת הרכב';
      let errorTitle = 'שגיאה';
      
      if (error?.message) {
        try {
          const parsedError = JSON.parse(error.message);
          if (parsedError.error) {
            errorMessage = parsedError.error;
            if (parsedError.field) {
              errorTitle = `שגיאה בשדה: ${parsedError.field}`;
            }
          }
        } catch {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: async ({ vehicleId, vehicleData }: { vehicleId: string; vehicleData: any }) => {
      // Validate engine size
      if (vehicleData.engine_size !== undefined && vehicleData.engine_size !== null) {
        const engineSize = parseFloat(vehicleData.engine_size);
        if (engineSize >= 100) {
          throw new Error('נפח מנוע חייב להיות קטן מ-100 ליטר');
        }
      }

      // Update vehicle directly using adminClient
      const { data, error } = await adminClient
        .from('vehicle_listings')
        .update(vehicleData)
        .eq('id', vehicleId)
        .select(`
          *,
          make:vehicle_makes(id, name_hebrew, name_english),
          model:vehicle_models(id, name_hebrew, name_english)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-vehicle'] });
      toast({
        title: 'הרכב עודכן בהצלחה',
        description: 'פרטי הרכב עודכנו במערכת',
      });
    },
    onError: (error: any) => {
      let errorMessage = 'אירעה שגיאה בעדכון הרכב';
      let errorTitle = 'שגיאה';
      
      if (error?.message) {
        try {
          const parsedError = JSON.parse(error.message);
          if (parsedError.error) {
            errorMessage = parsedError.error;
            if (parsedError.field) {
              errorTitle = `שגיאה בשדה: ${parsedError.field}`;
            }
          }
        } catch {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      const { error } = await adminClient
        .from('vehicle_listings')
        .update({ status: 'removed' })
        .eq('id', vehicleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      toast({
        title: 'הרכב הוסר בהצלחה',
        description: 'הרכב סומן כמוסר מהמערכת',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה',
        description: error?.message || 'אירעה שגיאה בהסרת הרכב',
        variant: 'destructive',
      });
    },
  });

  return {
    vehicles,
    isLoading,
    error,
    useAdminVehicle,
    addVehicle: addVehicleMutation.mutate,
    isAddingVehicle: addVehicleMutation.isPending,
    updateVehicle: updateVehicleMutation.mutate,
    isUpdatingVehicle: updateVehicleMutation.isPending,
    deleteVehicle: deleteVehicleMutation.mutate,
    isDeletingVehicle: deleteVehicleMutation.isPending,
  };
};