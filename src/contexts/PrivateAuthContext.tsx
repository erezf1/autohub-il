import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { privateClient } from '@/integrations/supabase/privateClient';
import { useToast } from '@/hooks/use-toast';
import { 
  isValidIsraeliPhone, 
  cleanPhoneNumber, 
  phoneToEmail 
} from '@/utils/phoneValidation';

interface PrivateAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (phone: string, fullName: string, locationId: number) => Promise<{ error: any }>;
  signIn: (phone: string) => Promise<{ error: any }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const PrivateAuthContext = createContext<PrivateAuthContextType | undefined>(undefined);

export const PrivateAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = privateClient.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    privateClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    phone: string,
    fullName: string,
    locationId: number
  ): Promise<{ error: any }> => {
    try {
      // Validate phone number
      if (!isValidIsraeliPhone(phone)) {
        return {
          error: {
            message: 'מספר טלפון לא תקין. יש להזין מספר בן 10 ספרות המתחיל ב-05',
          },
        };
      }

      const cleanedPhone = cleanPhoneNumber(phone);
      const email = phoneToEmail(cleanedPhone);

      // Sign up with mock password (OTP-based, no real password needed)
      const { data, error } = await privateClient.auth.signUp({
        email,
        password: `temp_${cleanedPhone}_${Date.now()}`, // Temporary password
        options: {
          data: {
            phone_number: cleanedPhone,
            full_name: fullName,
            location_id: locationId,
            user_type: 'private', // Flag for create_private_user_profile trigger
          },
          emailRedirectTo: `${window.location.origin}/private/dashboard`,
        },
      });

      if (error) {
        // Handle duplicate user error
        if (error.message.includes('already registered')) {
          return {
            error: {
              message: 'מספר הטלפון כבר רשום במערכת. נסה להתחבר',
            },
          };
        }
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signIn = async (phone: string): Promise<{ error: any }> => {
    try {
      // Validate phone number
      if (!isValidIsraeliPhone(phone)) {
        return {
          error: {
            message: 'מספר טלפון לא תקין. יש להזין מספר בן 10 ספרות המתחיל ב-05',
          },
        };
      }

      const cleanedPhone = cleanPhoneNumber(phone);
      
      // For now, we just validate the phone format
      // OTP verification happens in verifyOTP
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<{ error: any }> => {
    try {
      const cleanedPhone = cleanPhoneNumber(phone);
      const email = phoneToEmail(cleanedPhone);

      // Mock OTP verification (until 019sms.co.il integration)
      if (otp !== '9876') {
        return {
          error: {
            message: 'קוד אימות שגוי. נסה שוב',
          },
        };
      }

      // For existing users, sign in with the temporary password pattern
      const { data, error } = await privateClient.auth.signInWithPassword({
        email,
        password: `temp_${cleanedPhone}_${Date.now()}`, // This won't work for existing users
      });

      // If password doesn't match, try to get the user another way
      // In production with real OTP, we'd use a custom token from edge function
      if (error) {
        // For now, we'll need to handle this differently
        // In production: exchange OTP for session token via edge function
        console.error('OTP verification error:', error);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await privateClient.auth.signOut();
      if (error) {
        toast({
          title: 'שגיאה',
          description: 'אירעה שגיאה בהתנתקות',
          variant: 'destructive',
        });
        return;
      }

      setUser(null);
      setSession(null);

      toast({
        title: 'התנתקת בהצלחה',
        description: 'נתראה בפעם הבאה',
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'שגיאה',
        description: 'אירעה שגיאה בהתנתקות',
        variant: 'destructive',
      });
    }
  };

  return (
    <PrivateAuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        verifyOTP,
        signOut,
      }}
    >
      {children}
    </PrivateAuthContext.Provider>
  );
};

export const usePrivateAuth = () => {
  const context = useContext(PrivateAuthContext);
  if (context === undefined) {
    throw new Error('usePrivateAuth must be used within a PrivateAuthProvider');
  }
  return context;
};
