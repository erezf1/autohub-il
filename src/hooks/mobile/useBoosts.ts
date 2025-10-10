import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface BoostInput {
  vehicleId: string;
  hotSalePrice: number;
  durationDays: number;
}

export function useBoosts() {
  const queryClient = useQueryClient();

  // Fetch boosted vehicles
  const { data: boostedVehicles, isLoading: isLoadingBoosted } = useQuery({
    queryKey: ['boosted-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(id, name_hebrew, name_english),
          model:vehicle_models(id, name_hebrew, name_english)
        `)
        .eq('is_boosted', true)
        .gte('boosted_until', new Date().toISOString())
        .eq('status', 'available')
        .order('boosted_until', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch user's boostable vehicles
  const { data: myVehicles, isLoading: isLoadingMy } = useQuery({
    queryKey: ['my-boostable-vehicles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(id, name_hebrew, name_english),
          model:vehicle_models(id, name_hebrew, name_english)
        `)
        .eq('owner_id', user.id)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch remaining boosts via RPC function
  const { data: remainingBoosts, isLoading: isLoadingBoosts } = useQuery({
    queryKey: ['user-remaining-boosts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .rpc('get_remaining_boosts', { user_id: user.id });

      if (error) throw error;
      return data as number;
    },
  });

  // Activate boost mutation
  const activateBoost = useMutation({
    mutationFn: async ({ vehicleId, hotSalePrice, durationDays }: BoostInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Calculate boost end time
      const boostedUntil = new Date();
      boostedUntil.setDate(boostedUntil.getDate() + durationDays);

      // Update vehicle
      const { error: updateError } = await supabase
        .from('vehicle_listings')
        .update({
          is_boosted: true,
          boosted_until: boostedUntil.toISOString(),
          hot_sale_price: hotSalePrice,
        })
        .eq('id', vehicleId)
        .eq('owner_id', user.id);

      if (updateError) throw updateError;

      return { vehicleId, boostedUntil };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosted-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['my-boostable-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['user-remaining-boosts'] });
      queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
      
      toast({
        title: "הבוסט הופעל בהצלחה!",
        description: "הרכב שלך כעת מוצג ברשימת המכירות החמות",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה בהפעלת הבוסט",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Deactivate boost mutation
  const deactivateBoost = useMutation({
    mutationFn: async (vehicleId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('vehicle_listings')
        .update({
          is_boosted: false,
          boosted_until: null,
          hot_sale_price: null,
        })
        .eq('id', vehicleId)
        .eq('owner_id', user.id);

      if (error) throw error;
      return vehicleId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosted-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['my-boostable-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
      
      toast({
        title: "הבוסט בוטל",
        description: "הרכב הוסר מרשימת המכירות החמות",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה בביטול הבוסט",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    boostedVehicles,
    isLoadingBoosted,
    myVehicles,
    isLoadingMy,
    availableBoosts: remainingBoosts || 0,
    isLoadingBoosts,
    activateBoost: activateBoost.mutate,
    isActivating: activateBoost.isPending,
    deactivateBoost: deactivateBoost.mutate,
    isDeactivating: deactivateBoost.isPending,
  };
}
