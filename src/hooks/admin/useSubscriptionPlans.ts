import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminClient } from '@/integrations/supabase/adminClient';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionPlan {
  id: string;
  name_hebrew: string;
  name_english: string;
  max_vehicles: number;
  monthly_boosts: number;
  monthly_auctions: number;
  price_monthly: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await adminClient
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('max_vehicles');
      
      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });
};

export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      planId, 
      updates 
    }: { 
      planId: string; 
      updates: {
        max_vehicles?: number;
        monthly_boosts?: number;
        monthly_auctions?: number;
        price_monthly?: number;
      }
    }) => {
      const { error } = await adminClient
        .from('subscription_plans')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', planId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast({
        title: 'תוכנית עודכנה',
        description: 'תוכנית המינוי עודכנה בהצלחה',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה בעדכון',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
