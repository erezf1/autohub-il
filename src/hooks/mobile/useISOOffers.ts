import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dealerClient } from "@/integrations/supabase/dealerClient";
import { useToast } from "@/hooks/use-toast";

export interface ISOOfferInput {
  iso_request_id: string;
  vehicle_id: string;
  offered_price: number;
  message?: string;
}

// Fetch offers for a specific ISO request (only if user is owner)
export const useOffersByRequestId = (requestId: string | undefined, isOwner: boolean) => {
  return useQuery({
    queryKey: ["iso-offers", requestId],
    queryFn: async () => {
      if (!requestId) throw new Error("No request ID provided");

      const { data, error } = await dealerClient
        .from("iso_request_offers")
        .select(`
          *,
          vehicle_listings(
            id,
            make_id,
            model_id,
            year,
            kilometers,
            price,
            images,
            vehicle_makes!vehicle_listings_make_id_fkey(name_hebrew),
            vehicle_models!vehicle_listings_model_id_fkey(name_hebrew)
          ),
          user_profiles!iso_request_offers_offerer_id_fkey(
            full_name,
            business_name,
            profile_picture_url
          )
        `)
        .eq("iso_request_id", requestId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!requestId && isOwner,
  });
};

// Create new offer
export const useCreateOffer = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ISOOfferInput) => {
      const { data: { user } } = await dealerClient.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await dealerClient
        .from("iso_request_offers")
        .insert({
          ...input,
          offerer_id: user.id,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iso-offers"] });
      toast({
        title: "הצעה נשלחה",
        description: "ההצעה שלך נשלחה בהצלחה למבקש",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "שגיאה בשליחת הצעה",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Update offer status (accept/reject - owner only)
export const useUpdateOfferStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ offerId, status }: { offerId: string; status: "accepted" | "rejected" }) => {
      const { data, error } = await dealerClient
        .from("iso_request_offers")
        .update({ status })
        .eq("id", offerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["iso-offers"] });
      toast({
        title: variables.status === "accepted" ? "הצעה אושרה" : "הצעה נדחתה",
        description: variables.status === "accepted" 
          ? "ההצעה אושרה בהצלחה"
          : "ההצעה נדחתה",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "שגיאה בעדכון הצעה",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Fetch user's own vehicles for offer submission
export const useMyVehiclesForOffer = () => {
  return useQuery({
    queryKey: ["my-vehicles-for-offer"],
    queryFn: async () => {
      const { data: { user } } = await dealerClient.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await dealerClient
        .from("vehicle_listings")
        .select(`
          id,
          make_id,
          model_id,
          year,
          kilometers,
          price,
          images,
          vehicle_makes!vehicle_listings_make_id_fkey(name_hebrew),
          vehicle_models!vehicle_listings_model_id_fkey(name_hebrew)
        `)
        .eq("owner_id", user.id)
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};
