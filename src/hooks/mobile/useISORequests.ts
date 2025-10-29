import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dealerClient } from "@/integrations/supabase/dealerClient";
import { useToast } from "@/hooks/use-toast";

export interface ISORequestInput {
  title: string;
  description?: string;
  make_id?: number;
  model_id?: number;
  year_from?: number;
  year_to?: number;
  price_from?: number;
  price_to?: number;
  max_kilometers?: number;
  transmission_preference?: string;
  fuel_type_preference?: string;
  location_id?: number;
  additional_requirements?: string;
  expires_at?: string;
}

// Fetch all active ISO requests (excluding user's own)
export const useISORequests = () => {
  return useQuery({
    queryKey: ["iso-requests", "all"],
    queryFn: async () => {
      const { data: { user } } = await dealerClient.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await dealerClient
        .from("iso_requests")
        .select(`
          *,
          vehicle_makes!make_id(name_hebrew, name_english),
          vehicle_models!model_id(name_hebrew, name_english),
          locations!location_id(name_hebrew)
        `)
        .eq("status", "active")
        .neq("requester_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

// Fetch user's own ISO requests
export const useMyISORequests = () => {
  return useQuery({
    queryKey: ["iso-requests", "mine"],
    queryFn: async () => {
      const { data: { user } } = await dealerClient.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await dealerClient
        .from("iso_requests")
        .select(`
          *,
          vehicle_makes!make_id(name_hebrew, name_english),
          vehicle_models!model_id(name_hebrew, name_english),
          locations!location_id(name_hebrew),
          iso_request_offers(count)
        `)
        .eq("requester_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Add offer count to each request
      return (data || []).map(request => ({
        ...request,
        offer_count: request.iso_request_offers?.[0]?.count || 0
      }));
    },
  });
};

// Fetch single ISO request by ID
export const useISORequestById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["iso-request", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");

      const { data, error } = await dealerClient
        .from("iso_requests")
        .select(`
          *,
          vehicle_makes!make_id(name_hebrew, name_english),
          vehicle_models!model_id(name_hebrew, name_english),
          locations!location_id(name_hebrew),
          user_profiles!requester_id(full_name, business_name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// Create new ISO request
export const useCreateISORequest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ISORequestInput) => {
      const { data: { user } } = await dealerClient.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await dealerClient
        .from("iso_requests")
        .insert({
          ...input,
          requester_id: user.id,
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iso-requests"] });
      toast({
        title: "בקשה נוצרה בהצלחה",
        description: "בקשת החיפוש שלך פורסמה למערכת",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "שגיאה ביצירת בקשה",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Update ISO request
export const useUpdateISORequest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ISORequestInput> }) => {
      const { data, error } = await dealerClient
        .from("iso_requests")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iso-requests"] });
      toast({
        title: "בקשה עודכנה",
        description: "השינויים נשמרו בהצלחה",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "שגיאה בעדכון בקשה",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Delete ISO request
export const useDeleteISORequest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await dealerClient
        .from("iso_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iso-requests"] });
      toast({
        title: "בקשה נמחקה",
        description: "בקשת החיפוש נמחקה מהמערכת",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "שגיאה במחיקת בקשה",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
