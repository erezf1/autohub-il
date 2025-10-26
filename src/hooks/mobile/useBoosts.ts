import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealerClient } from '@/integrations/supabase/dealerClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface BoostInput {
  vehicleId: string;
  hotSalePrice?: number | null;
}

export function useBoosts() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch boosted vehicles (EXCLUDING current user's own vehicles)
  const { data: boostedVehicles, isLoading: isLoadingBoosted } = useQuery({
    queryKey: ['boosted-vehicles'],
    enabled: !!user,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await dealerClient
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(id, name_hebrew, name_english),
          model:vehicle_models(id, name_hebrew, name_english)
        `)
        .eq('is_boosted', true)
        .gte('boosted_until', new Date().toISOString())
        .eq('status', 'available')
        .neq('owner_id', user.id)
        .order('boosted_until', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch user's active boosted vehicles
  const { data: myActiveBoostedVehicles, isLoading: isLoadingActive } = useQuery({
    queryKey: ['my-active-boosts'],
    enabled: !!user,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await dealerClient
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(id, name_hebrew, name_english),
          model:vehicle_models(id, name_hebrew, name_english)
        `)
        .eq('owner_id', user.id)
        .eq('is_boosted', true)
        .gte('boosted_until', new Date().toISOString())
        .order('boosted_until', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user's boostable vehicles (not currently boosted)
  const { data: myVehicles, isLoading: isLoadingMy } = useQuery({
    queryKey: ['my-boostable-vehicles'],
    enabled: !!user,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await dealerClient
        .from('vehicle_listings')
        .select(`
          *,
          make:vehicle_makes(id, name_hebrew, name_english),
          model:vehicle_models(id, name_hebrew, name_english)
        `)
        .eq('owner_id', user.id)
        .eq('status', 'available')
        .or('is_boosted.is.null,is_boosted.eq.false,boosted_until.lt.' + new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch remaining boosts via RPC function
  const { data: remainingBoosts, isLoading: isLoadingBoosts } = useQuery({
    queryKey: ['user-remaining-boosts'],
    enabled: !!user,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      if (!user) return 0;

      const { data, error } = await dealerClient
        .rpc('get_remaining_boosts', { user_id: user.id });

      if (error) {
        console.error('Error fetching remaining boosts:', error);
        return 0;
      }
      return data as number;
    },
  });

  // Activate boost mutation (FIXED 5-DAY DURATION)
  const activateBoost = useMutation({
    mutationFn: async ({ vehicleId, hotSalePrice }: BoostInput) => {
      if (!user) throw new Error('Not authenticated');

      // Calculate boost end time - FIXED 5 DAYS
      const boostedUntil = new Date();
      boostedUntil.setDate(boostedUntil.getDate() + 5);

      // Update vehicle
      const { error: updateError } = await dealerClient
        .from('vehicle_listings')
        .update({
          is_boosted: true,
          boosted_until: boostedUntil.toISOString(),
          hot_sale_price: hotSalePrice || null,
        })
        .eq('id', vehicleId)
        .eq('owner_id', user.id);

      if (updateError) throw updateError;

      return { vehicleId, boostedUntil };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosted-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['my-boostable-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['my-active-boosts'] });
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
      if (!user) throw new Error('Not authenticated');

      const { error } = await dealerClient
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
      queryClient.invalidateQueries({ queryKey: ['my-active-boosts'] });
      queryClient.invalidateQueries({ queryKey: ['user-remaining-boosts'] });
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
    boostedVehicles: boostedVehicles || [],
    myActiveBoostedVehicles: myActiveBoostedVehicles || [],
    myVehicles: myVehicles || [],
    availableBoosts: remainingBoosts || 0,
    isLoadingBoosted,
    isLoadingActive,
    isLoadingMy,
    isLoadingBoosts,
    activateBoost: activateBoost.mutate,
    deactivateBoost: deactivateBoost.mutate,
    isActivating: activateBoost.isPending,
    isDeactivating: deactivateBoost.isPending,
  };
}
