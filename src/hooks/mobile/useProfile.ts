import { useQuery } from '@tanstack/react-query';
import { dealerClient } from '@/integrations/supabase/dealerClient';
import { useAuth } from '@/contexts/AuthContext';

export const useProfile = () => {
  const { user } = useAuth();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await dealerClient
        .from('user_profiles')
        .select(`
          *,
          location:locations(id, name_hebrew, name_english)
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: userStatus } = useQuery({
    queryKey: ['user-status', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await dealerClient
        .from('users')
        .select('status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return {
    profile,
    userStatus: userStatus?.status,
    isLoading,
    error,
  };
};
