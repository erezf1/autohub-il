import { useQuery } from '@tanstack/react-query';
import { adminClient } from '@/integrations/supabase/adminClient';

export interface SupportTicket {
  id: string;
  ticket_type: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string | null;
  reporter_id: string;
  reported_user_id: string | null;
  assigned_to: string | null;
  resolution_notes: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  reporter?: {
    id: string;
    phone_number: string;
  };
  reporter_profile?: {
    full_name: string;
    business_name: string;
  };
  reported_user?: {
    id: string;
    phone_number: string;
  };
  reported_profile?: {
    full_name: string;
    business_name: string;
  };
  assigned_user?: {
    id: string;
    phone_number: string;
  };
  assigned_profile?: {
    full_name: string;
    business_name: string;
  };
}

export const useSupportTickets = (searchTerm?: string, statusFilter?: string) => {
  return useQuery({
    queryKey: ['admin-support-tickets', searchTerm, statusFilter],
    queryFn: async () => {
      let query = adminClient
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter by search term
      if (searchTerm && data) {
        return data.filter((ticket: any) =>
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return data as unknown as SupportTicket[];
    },
    staleTime: 30000, // 30 seconds
  });
};
