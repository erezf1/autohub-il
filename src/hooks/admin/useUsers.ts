import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUsers = (searchTerm?: string, statusFilter?: string) => {
  const { toast } = useToast();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-users', searchTerm, statusFilter],
    queryFn: async () => {
      // Fetch users first (without relying on implicit FK-based joins)
      let usersQuery = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        usersQuery = usersQuery.eq('status', statusFilter);
      }

      const { data: usersData, error: usersError } = await usersQuery;
      if (usersError) throw usersError;
      if (!usersData || usersData.length === 0) return [] as any[];

      // Fetch related profiles separately and merge on the client
      const userIds = usersData.map((u: any) => u.id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, full_name, business_name, subscription_type, location_id')
        .in('id', userIds);
      if (profilesError) throw profilesError;

      const profilesById = new Map((profilesData || []).map((p: any) => [p.id, p]));
      const merged = usersData.map((u: any) => ({ ...u, profile: profilesById.get(u.id) || null }));

      // Filter by search term if provided (against merged data)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return merged.filter((u: any) =>
          (u.profile?.full_name || '').toLowerCase().includes(term) ||
          (u.profile?.business_name || '').toLowerCase().includes(term) ||
          (u.phone_number || '').toLowerCase().includes(term)
        );
      }

      return merged;
    },
  });

  return { users, isLoading, error };
};

export const useUser = (userId: string) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['admin-user', userId],
    queryFn: async () => {
      // Fetch base user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (userError) throw userError;
      if (!userData) return null;

      // Fetch profile and roles in parallel (avoid implicit joins)
      const [profileRes, rolesRes] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId),
      ]);

      if (profileRes.error) throw profileRes.error;
      if (rolesRes.error) throw rolesRes.error;

      return {
        ...userData,
        profile: profileRes.data || null,
        roles: rolesRes.data || [],
      } as any;
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
      password, 
      phoneNumber,
      fullName, 
      businessName 
    }: { 
      password: string;
      phoneNumber: string;
      fullName: string; 
      businessName: string; 
    }) => {
      // Clean phone and convert to email format
      const cleanedPhone = phoneNumber.replace(/\D/g, '');
      
      // Validate phone format
      if (!/^05\d{8}$/.test(cleanedPhone)) {
        throw new Error('מספר טלפון לא תקין. יש להזין 10 ספרות המתחילות ב-05');
      }

      const email = `${cleanedPhone}@autohub.local`;

      // Call edge function to create user (requires admin privileges)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          phone_number: cleanedPhone,
          full_name: fullName,
          business_name: businessName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }

      const data = await response.json();
      return data;
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
