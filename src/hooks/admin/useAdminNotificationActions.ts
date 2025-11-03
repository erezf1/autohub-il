import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminNotificationActions = () => {
  const queryClient = useQueryClient();

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-unread-notifications-count'] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
      toast.error('שגיאה בעדכון ההתראה');
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-unread-notifications-count'] });
      toast.success('כל ההתראות סומנו כנקראו');
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error);
      toast.error('שגיאה בעדכון ההתראות');
    },
  });

  return {
    markAsRead,
    markAllAsRead,
  };
};
