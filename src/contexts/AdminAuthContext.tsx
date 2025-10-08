import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { adminClient } from '@/integrations/supabase/adminClient';
import { cleanPhoneNumber, phoneToEmail, isValidIsraeliPhone } from '@/utils/phoneValidation';

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (phone: string, password: string) => Promise<{ error: any; isAdmin: boolean }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data: roles, error } = await adminClient
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) throw error;

      const hasAdminAccess = roles?.some(r => r.role === 'admin' || r.role === 'support') || false;
      setIsAdmin(hasAdminAccess);
      return hasAdminAccess;
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = adminClient.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Admin auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Defer admin role check to avoid blocking
          setIsLoading(true);
          setTimeout(async () => {
            await checkAdminRole(currentSession.user.id);
            setIsLoading(false);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    adminClient.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log('Initial admin session:', currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await checkAdminRole(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (phone: string, password: string) => {
    try {
      // Force logout any existing session first
      await adminClient.auth.signOut();
      
      // Validate phone format
      const cleanedPhone = cleanPhoneNumber(phone);
      if (!isValidIsraeliPhone(cleanedPhone)) {
        return { error: { message: 'מספר טלפון לא תקין. יש להזין 10 ספרות המתחילות ב-05' }, isAdmin: false };
      }

      // Convert phone to email format for Supabase
      const email = phoneToEmail(cleanedPhone);
      
      const { data, error } = await adminClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error, isAdmin: false };
      }

      // Wait for admin role check to complete
      if (data.user) {
        const hasAdminAccess = await checkAdminRole(data.user.id);
        return { error: null, isAdmin: hasAdminAccess };
      }

      return { error: null, isAdmin: false };
    } catch (error) {
      return { error, isAdmin: false };
    }
  };

  const signOut = async () => {
    await adminClient.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AdminAuthContext.Provider value={{ user, session, isAdmin, isLoading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
