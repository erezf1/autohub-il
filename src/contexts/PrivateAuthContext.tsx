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
   * Verify OTP and sign in existing user
   * Called after OTP is verified via 019sms service
   */
  const verifyOTP = async (phone: string, code: string): Promise<{ error?: { message: string } }> => {
    try {
      // Clean phone number
      const cleanPhone = phone.replace(/\D/g, '');
      
      // Sign in with OTP (phone auth)
      const { data, error } = await privateClient.auth.signInWithOtp({
        phone: `+972${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) {
        return { error: { message: error.message } };
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
      // Clean phone number
      const cleanPhone = phone.replace(/\D/g, '');
      const formattedPhone = `+972${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`;

      // Create user with phone auth
      const { data, error } = await privateClient.auth.signUp({
        phone: formattedPhone,
        password: crypto.randomUUID(), // Random password for phone auth
        options: {
          data: {
            user_type: 'private',
            phone_number: cleanPhone,
            full_name: fullName,
            location_id: locationId,
          }
        }
      });

      if (error) {
        return { error: { message: error.message } };
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
