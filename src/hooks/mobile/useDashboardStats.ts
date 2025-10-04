import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Fetch all stats in parallel
      const [
        { count: vehicleCount },
        { count: chatCount },
        { count: unreadMessages },
        { count: myBidsCount },
        { count: activeAuctionsCount },
        { count: myISORequestsCount },
      ] = await Promise.all([
        supabase
          .from('vehicle_listings')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)
          .eq('status', 'available'),
        supabase
          .from('chat_conversations')
          .select('*', { count: 'exact', head: true })
          .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`),
        supabase
          .from('chat_messages')
          .select('*, conversation:chat_conversations!inner(*)', { count: 'exact', head: true })
          .neq('sender_id', user.id)
          .eq('is_read', false)
          .or(`conversation.participant_1_id.eq.${user.id},conversation.participant_2_id.eq.${user.id}`),
        supabase
          .from('auction_bids')
          .select('*', { count: 'exact', head: true })
          .eq('bidder_id', user.id),
        supabase
          .from('auctions')
          .select('*', { count: 'exact', head: true })
          .in('status', ['scheduled', 'active']),
        supabase
          .from('iso_requests')
          .select('*', { count: 'exact', head: true })
          .eq('requester_id', user.id)
          .eq('status', 'active'),
      ]);

      return {
        activeCars: vehicleCount || 0,
        totalChats: chatCount || 0,
        newMessages: unreadMessages || 0,
        myBids: myBidsCount || 0,
        newAuctions: activeAuctionsCount || 0,
        mySearches: myISORequestsCount || 0,
      };
    },
    enabled: !!user,
  });
};
