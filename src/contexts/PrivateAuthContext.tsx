import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { privateClient } from '@/integrations/supabase/privateClient';
import { User, Session } from '@supabase/supabase-js';

interface PrivateUser {
  id: string;
  phone_number: string;
  full_name: string;
  location_id: number | null;
  status: string;
}

interface PrivateAuthContextType {
  isPrivateAuthenticated: boolean;
  user: PrivateUser | null;
  session: Session | null;
  loading: boolean;
  verifyOTP: (phone: string, code: string) => Promise<{ error?: { message: string } }>;
  signUp: (phone: string, fullName: string, locationId: number) => Promise<{ error?: { message: string } }>;
  signOut: () => Promise<void>;
}

const PrivateAuthContext = createContext<PrivateAuthContextType | undefined>(undefined);

export const PrivateAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<PrivateUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isPrivateAuthenticated, setIsPrivateAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = privateClient.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch private user profile
          setTimeout(async () => {
            const { data: privateUser } = await privateClient
              .from('private_users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (privateUser) {
              setUser(privateUser);
              setIsPrivateAuthenticated(true);
            } else {
              setUser(null);
              setIsPrivateAuthenticated(false);
            }
          }, 0);
        } else {
          setUser(null);
          setIsPrivateAuthenticated(false);
        }
      }
    );

    // Check for existing session
    privateClient.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const { data: privateUser } = await privateClient
          .from('private_users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (privateUser) {
          setUser(privateUser);
          setIsPrivateAuthenticated(true);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Generate deterministic password from phone number
   * Used for both signup and login to maintain consistency
   */
  const generatePassword = (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    return `${cleanPhone}_private_autohub_2024`;
  };

  /**
   * Generate fake email from phone number
   */
  const generateEmail = (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    return `${cleanPhone}@autohub.private`;
  };

  /**
   * Verify OTP and sign in existing user
   * Called after OTP is verified via 019sms service
   */
  const verifyOTP = async (phone: string, code: string): Promise<{ error?: { message: string } }> => {
    try {
      const fakeEmail = generateEmail(phone);
      const password = generatePassword(phone);
      
      // Sign in with email/password
      const { data, error } = await privateClient.auth.signInWithPassword({
        email: fakeEmail,
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        return { error: { message: 'משתמש לא נמצא. אנא הירשם תחילה' } };
      }

      return {};
    } catch (error) {
      console.error('VerifyOTP error:', error);
      return { error: { message: 'אירעה שגיאה באימות' } };
    }
  };

  /**
   * Sign up new private user after OTP verification
   */
  const signUp = async (
    phone: string, 
    fullName: string, 
    locationId: number
  ): Promise<{ error?: { message: string } }> => {
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const fakeEmail = generateEmail(phone);
      const password = generatePassword(phone);

      // Create user with email auth
      const { data, error } = await privateClient.auth.signUp({
        email: fakeEmail,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/private/dashboard`,
          data: {
            user_type: 'private',
            phone_number: cleanPhone,
            full_name: fullName,
            location_id: locationId,
          }
        }
      });

      if (error) {
        console.error('SignUp error:', error);
        return { error: { message: error.message } };
      }

      // Auto sign-in after signup
      if (data.user) {
        const { error: signInError } = await privateClient.auth.signInWithPassword({
          email: fakeEmail,
          password: password,
        });
        
        if (signInError) {
          console.error('Auto sign-in error:', signInError);
          return { error: { message: signInError.message } };
        }
      }

      return {};
    } catch (error) {
      console.error('SignUp error:', error);
      return { error: { message: 'אירעה שגיאה ביצירת החשבון' } };
    }
  };

  const signOut = async () => {
    setLoading(true);
    await privateClient.auth.signOut();
    setUser(null);
    setSession(null);
    setIsPrivateAuthenticated(false);
    setLoading(false);
  };

  const value = { 
    isPrivateAuthenticated, 
    user, 
    session,
    loading,
    verifyOTP, 
    signUp, 
    signOut 
  };

  return <PrivateAuthContext.Provider value={value}>{children}</PrivateAuthContext.Provider>;
};

export const usePrivateAuth = () => {
  const context = useContext(PrivateAuthContext);
  if (context === undefined) {
    throw new Error('usePrivateAuth must be used within a PrivateAuthProvider');
  }
  return context;
};
