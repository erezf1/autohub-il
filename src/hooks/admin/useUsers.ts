import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUsers = (searchTerm?: string, statusFilter?: string) => {
  const { toast } = useToast();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-users', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select(`
          *,
          profile:user_profiles(
            full_name,
            business_name,
            subscription_type,
            location:locations(name_hebrew)
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by search term if provided
      if (searchTerm && data) {
        return data.filter(user => 
          user.profile?.full_name?.includes(searchTerm) ||
          user.profile?.business_name?.includes(searchTerm) ||
          user.phone_number?.includes(searchTerm)
        );
      }

      return data;
    },
  });

  return { users, isLoading, error };
};

export const useUser = (userId: string) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['admin-user', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profile:user_profiles(
            *,
            location:locations(id, name_hebrew, name_english)
          ),
          roles:user_roles(role)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  return { user, isLoading, error };
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user'] });
      toast({
        title: 'סטטוס עודכן',
        description: 'סטטוס המשתמש עודכן בהצלחה',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה בעדכון סטטוס',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      phoneNumber,
      profileData 
    }: { 
      userId: string; 
      phoneNumber?: string;
      profileData: any;
    }) => {
      // Update phone number if provided
      if (phoneNumber) {
        const { error: phoneError } = await supabase
          .from('users')
          .update({ phone_number: phoneNumber })
          .eq('id', userId);
        
        if (phoneError) throw phoneError;
      }

      // Update profile data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', userId);

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user'] });
      toast({
        title: 'פרטי משתמש עודכנו',
        description: 'הפרטים עודכנו בהצלחה',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה בעדכון פרטים',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      email, 
      password, 
      phoneNumber,
      fullName, 
      businessName 
    }: { 
      email: string; 
      password: string;
      phoneNumber: string;
      fullName: string; 
      businessName: string; 
    }) => {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          phone_number: phoneNumber,
          full_name: fullName,
          business_name: businessName,
        }
      });

      if (authError) throw authError;
      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'משתמש נוצר',
        description: 'המשתמש נוצר בהצלחה',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה ביצירת משתמש',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
