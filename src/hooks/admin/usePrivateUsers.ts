import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminClient } from '@/integrations/supabase/adminClient';
import { useToast } from '@/hooks/use-toast';

// Fetch all private users with optional filters
export const usePrivateUsers = (searchTerm: string = '', statusFilter: string = 'all') => {
  return useQuery({
    queryKey: ['admin-private-users', searchTerm, statusFilter],
    queryFn: async () => {
      let query = adminClient
        .from('private_users')
        .select(`
          *,
          location:locations(name_hebrew)
        `)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Apply search filter locally if needed
      if (searchTerm) {
        const filtered = data?.filter(user => 
          user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone_number?.includes(searchTerm)
        );
        return filtered || [];
      }

      return data || [];
    },
  });
};

// Fetch single private user details
export const usePrivateUser = (userId: string) => {
  return useQuery({
    queryKey: ['admin-private-user', userId],
    queryFn: async () => {
      const { data, error } = await adminClient
        .from('private_users')
        .select(`
          *,
          location:locations(name_hebrew)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

// Update private user status
export const useUpdatePrivateUserStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { error } = await adminClient
        .from('private_users')
        .update({ status })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-private-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-private-user'] });
      toast({
        title: 'סטטוס עודכן',
        description: 'סטטוס המשתמש עודכן בהצלחה',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
