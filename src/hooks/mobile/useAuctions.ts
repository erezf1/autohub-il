import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealerClient } from '@/integrations/supabase/dealerClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface CreateAuctionInput {
  vehicleId: string;
  startingPrice: number;
  reservePrice?: number;
  buyNowPrice?: number;
  durationDays: number;
  startDate?: Date;
  description?: string;
  auctionType?: string;
}

export interface PlaceBidInput {
  auctionId: string;
  bidAmount: number;
}

// Helper function to anonymize dealer names (e.g., "יוסי אברהם" → "י***י א***")
function anonymizeName(name: string): string {
  if (!name || name.length < 2) return '***';
  const parts = name.split(' ');
  return parts.map(part => {
    if (part.length <= 2) return part;
    return part[0] + '***' + (part.length > 1 ? part[part.length - 1] : '');
  }).join(' ');
}

// Calculate time remaining from end time
function calculateTimeRemaining(endTime: string) {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const distance = end - now;

  if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export function useAuctions() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all active auctions (excluding current user's own)
  const { data: activeAuctions, isLoading: isLoadingActive } = useQuery({
    queryKey: ['active-auctions'],
    enabled: !!user,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await dealerClient
        .from('auctions')
        .select(`
          *,
          vehicle:vehicle_listings(
            *,
            make:vehicle_makes(id, name_hebrew, name_english),
            model:vehicle_models(id, name_hebrew, name_english)
          ),
          creator:user_profiles!auctions_creator_id_fkey(
            id,
            business_name,
            full_name,
            rating_tier,
            tenure
          )
        `)
        .in('status', ['scheduled', 'active'])
        .neq('creator_id', user.id)
        .order('auction_end_time', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user's bids with auction details
  const { data: myBids, isLoading: isLoadingBids } = useQuery({
    queryKey: ['my-bids'],
    enabled: !!user,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await dealerClient
        .from('auction_bids')
        .select(`
          *,
          auction:auctions(
            *,
            vehicle:vehicle_listings(
              *,
              make:vehicle_makes(id, name_hebrew, name_english),
              model:vehicle_models(id, name_hebrew, name_english)
            )
          )
        `)
        .eq('bidder_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process to determine if winning or outbid
      return (data || []).map(bid => {
        const auction = bid.auction;
        const isWinning = auction?.highest_bidder_id === user.id;
        return {
          ...bid,
          status: isWinning ? 'winning' : 'outbid'
        };
      });
    },
  });

  // Fetch user's created auctions
  const { data: myAuctions, isLoading: isLoadingMy } = useQuery({
    queryKey: ['my-auctions'],
    enabled: !!user,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await dealerClient
        .from('auctions')
        .select(`
          *,
          vehicle:vehicle_listings(
            *,
            make:vehicle_makes(id, name_hebrew, name_english),
            model:vehicle_models(id, name_hebrew, name_english)
          )
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch single auction by ID
  const useAuctionById = (auctionId?: string) => {
    return useQuery({
      queryKey: ['auction', auctionId],
      enabled: !!user && !!auctionId,
      refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
      queryFn: async () => {
        if (!user || !auctionId) return null;

        // First get the auction
        const { data: auctionData, error: auctionError } = await dealerClient
          .from('auctions')
          .select(`
            *,
            vehicle:vehicle_listings(
              *,
              make:vehicle_makes(id, name_hebrew, name_english),
              model:vehicle_models(id, name_hebrew, name_english)
            )
          `)
          .eq('id', auctionId)
          .single();

        if (auctionError) throw auctionError;
        if (!auctionData) return null;

        // Then fetch creator profile separately
        const { data: creatorProfile, error: creatorError } = await dealerClient
          .from('user_profiles')
          .select('id, business_name, full_name, rating_tier, tenure, profile_picture_url')
          .eq('id', auctionData.creator_id)
          .single();

        if (creatorError) console.error('Error fetching creator:', creatorError);

        return {
          ...auctionData,
          creator: creatorProfile
        };
      },
    });
  };

  // Fetch bid history for an auction
  const useAuctionBidHistory = (auctionId?: string) => {
    return useQuery({
      queryKey: ['auction-bid-history', auctionId],
      enabled: !!user && !!auctionId,
      refetchInterval: 5000,
      queryFn: async () => {
        if (!user || !auctionId) return [];

      // First get the bids
        const { data: bids, error: bidsError } = await dealerClient
          .from('auction_bids')
          .select('*')
          .eq('auction_id', auctionId)
          .order('bid_amount', { ascending: false });

        if (bidsError) throw bidsError;
        if (!bids) return [];

        // Then fetch bidder profiles separately
        const bidderIds = [...new Set(bids.map(b => b.bidder_id))];
        const { data: profiles, error: profilesError } = await dealerClient
          .from('user_profiles')
          .select('id, business_name, full_name')
          .in('id', bidderIds);

        if (profilesError) throw profilesError;

        // Combine and anonymize
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        
        return bids.map((bid, index) => {
          const profile = profileMap.get(bid.bidder_id);
          return {
            ...bid,
            bidderName: anonymizeName(profile?.business_name || profile?.full_name || 'סוחר'),
            isWinning: index === 0 // First one is highest bid
          };
        });
      },
    });
  };

  // Create auction mutation
  const createAuction = useMutation({
    mutationFn: async (input: CreateAuctionInput) => {
      if (!user) throw new Error('Not authenticated');

      const startTime = input.startDate || new Date();
      const endTime = new Date(startTime);
      endTime.setDate(endTime.getDate() + input.durationDays);

      const { data, error } = await dealerClient
        .from('auctions')
        .insert({
          creator_id: user.id,
          vehicle_id: input.vehicleId,
          starting_price: input.startingPrice,
          reserve_price: input.reservePrice || null,
          buy_now_price: input.buyNowPrice || null,
          auction_start_time: startTime.toISOString(),
          auction_end_time: endTime.toISOString(),
          status: 'active',
          auction_type: input.auctionType || 'standard'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-auctions'] });
      queryClient.invalidateQueries({ queryKey: ['my-auctions'] });
      queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
      
      toast({
        title: "המכרז נוצר בהצלחה!",
        description: "המכרז שלך פעיל וזמין להצעות",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה ביצירת מכרז",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Place bid mutation
  const placeBid = useMutation({
    mutationFn: async ({ auctionId, bidAmount }: PlaceBidInput) => {
      if (!user) throw new Error('Not authenticated');

      // Insert bid
      const { error: bidError } = await dealerClient
        .from('auction_bids')
        .insert({
          auction_id: auctionId,
          bidder_id: user.id,
          bid_amount: bidAmount,
          is_automatic: false
        });

      if (bidError) throw bidError;

      return { auctionId, bidAmount };
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: ['auction', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auction-bid-history', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['my-bids'] });
      queryClient.invalidateQueries({ queryKey: ['active-auctions'] });
      
      toast({
        title: "ההצעה הוגשה בהצלחה!",
        description: "ההצעה שלך נרשמה במערכת",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה בהגשת הצעה",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    activeAuctions: activeAuctions || [],
    myBids: myBids || [],
    myAuctions: myAuctions || [],
    isLoadingActive,
    isLoadingBids,
    isLoadingMy,
    createAuction: createAuction.mutate,
    placeBid: placeBid.mutate,
    isCreating: createAuction.isPending,
    isPlacingBid: placeBid.isPending,
    useAuctionById,
    useAuctionBidHistory,
  };
}

// Export individual hooks for convenience
export const useAllActiveAuctions = () => {
  const { activeAuctions, isLoadingActive } = useAuctions();
  return { data: activeAuctions, isLoading: isLoadingActive };
};

export const useMyBids = () => {
  const { myBids, isLoadingBids } = useAuctions();
  return { data: myBids, isLoading: isLoadingBids };
};

export const useMyAuctions = () => {
  const { myAuctions, isLoadingMy } = useAuctions();
  return { data: myAuctions, isLoading: isLoadingMy };
};

export const useCreateAuction = () => {
  const { createAuction, isCreating } = useAuctions();
  return { mutate: createAuction, isPending: isCreating };
};

export const usePlaceBid = () => {
  const { placeBid, isPlacingBid } = useAuctions();
  return { mutate: placeBid, isPending: isPlacingBid };
};
