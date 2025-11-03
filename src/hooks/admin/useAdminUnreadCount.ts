import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export const useAdminUnreadCount = () => {
  const query = useQuery({
    queryKey: ['admin-unread-notifications-count'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_unread_notifications_count');

      if (error) {
        console.error('Error fetching admin unread count:', error);
        return 0;
      }

      return data as number;
    },
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('admin-notification-badge')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_notifications',
        },
        () => {
          query.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query]);

  return query;
};
