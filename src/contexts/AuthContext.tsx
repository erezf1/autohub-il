import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { dealerClient } from '@/integrations/supabase/dealerClient';
import { useToast } from '@/hooks/use-toast';
import { cleanPhoneNumber, phoneToEmail, isValidIsraeliPhone } from '@/utils/phoneValidation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    phone: string, 
    password: string, 
    fullName: string, 
    businessName: string,
    locationId: number,
    businessDescription: string,
    tradeLicenseFileUrl: string,
    profilePictureUrl: string | null
  ) => Promise<{ error: any }>;
  signIn: (phone: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = dealerClient.auth.onAuthStateChange(
      (event, session) => {
        console.log('Dealer auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    dealerClient.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial dealer session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    phone: string, 
    password: string, 
    fullName: string, 
    businessName: string,
    locationId: number,
    businessDescription: string,
    tradeLicenseFileUrl: string,
    profilePictureUrl: string | null
  ) => {
    try {
      // Validate phone format
      const cleanedPhone = cleanPhoneNumber(phone);
      if (!isValidIsraeliPhone(cleanedPhone)) {
        return { error: { message: 'מספר טלפון לא תקין. יש להזין 10 ספרות המתחילות ב-05' } };
      }

      // Convert phone to email format for Supabase
      const email = phoneToEmail(cleanedPhone);
      const redirectUrl = `${window.location.origin}/mobile/dashboard`;

      const { data, error } = await dealerClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            phone_number: cleanedPhone,
            full_name: fullName,
            business_name: businessName,
            location_id: locationId,
            business_description: businessDescription,
            trade_license_file_url: tradeLicenseFileUrl,
            profile_picture_url: profilePictureUrl,
          }
        }
      });

      if (error) {
        toast({
          title: 'שגיאה בהרשמה',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      toast({
        title: 'שגיאה בהרשמה',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signIn = async (phone: string, password: string) => {
    try {
      // Validate phone format
      const cleanedPhone = cleanPhoneNumber(phone);
      if (!isValidIsraeliPhone(cleanedPhone)) {
        return { error: { message: 'מספר טלפון לא תקין. יש להזין 10 ספרות המתחילות ב-05' } };
      }

      // Convert phone to email format for Supabase
      const email = phoneToEmail(cleanedPhone);

      const { data, error } = await dealerClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'שגיאה בהתחברות',
          description: 'מספר טלפון או סיסמה שגויים',
          variant: 'destructive',
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      toast({
        title: 'שגיאה בהתחברות',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await dealerClient.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'התנתקת בהצלחה',
        description: 'נתראה בקרוב!',
      });
    } catch (error: any) {
      toast({
        title: 'שגיאה בהתנתקות',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
