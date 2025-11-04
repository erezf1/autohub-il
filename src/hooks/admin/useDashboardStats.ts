import { useQuery } from '@tanstack/react-query';
import { adminClient } from '@/integrations/supabase/adminClient';

interface UsersStats {
  total: number;
  new: number;
  pending: number;
}

interface VehiclesStats {
  total: number;
  new: number;
}

interface AuctionsStats {
  total: number;
  new: number;
  active: number;
}

interface SupportStats {
  total: number;
  new: number;
  pending: number;
}

interface BoostedStats {
  total: number;
  new: number;
}

export interface DashboardStats {
  users: UsersStats;
  vehicles: VehiclesStats;
  auctions: AuctionsStats;
  support: SupportStats;
  boosted: BoostedStats;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [usersResult, vehiclesResult, auctionsResult, supportResult, boostedResult] = await Promise.all([
        adminClient.rpc('get_users_stats'),
        adminClient.rpc('get_vehicles_stats'),
        adminClient.rpc('get_auctions_stats'),
        adminClient.rpc('get_support_tickets_stats'),
        adminClient.rpc('get_boosted_vehicles_stats'),
      ]);

      if (usersResult.error) throw usersResult.error;
      if (vehiclesResult.error) throw vehiclesResult.error;
      if (auctionsResult.error) throw auctionsResult.error;
      if (supportResult.error) throw supportResult.error;
      if (boostedResult.error) throw boostedResult.error;

      return {
        users: usersResult.data as unknown as UsersStats,
        vehicles: vehiclesResult.data as unknown as VehiclesStats,
        auctions: auctionsResult.data as unknown as AuctionsStats,
        support: supportResult.data as unknown as SupportStats,
        boosted: boostedResult.data as unknown as BoostedStats,
      } as DashboardStats;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};
