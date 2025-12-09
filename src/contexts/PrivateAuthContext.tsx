import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Assuming a User type exists, e.g., in @/types
interface User {
  id: string;
  email?: string;
  // other user properties
}

interface PrivateAuthContextType {
  isPrivateAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const PrivateAuthContext = createContext<PrivateAuthContextType | undefined>(undefined);

export const PrivateAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isPrivateAuthenticated, setIsPrivateAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start true to check session

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('privateUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsPrivateAuthenticated(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    // Placeholder for actual API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    console.log(`Signing in private user with email: ${email}`, { password: '***' });
    const userData: User = { id: 'private-user-123', email };
    localStorage.setItem('privateUser', JSON.stringify(userData));
    setUser(userData);
    setIsPrivateAuthenticated(true);
    setIsLoading(false);
  };

  const signOut = async () => {
    setIsLoading(true);
    localStorage.removeItem('privateUser');
    setUser(null);
    setIsPrivateAuthenticated(false);
    setIsLoading(false);
  };

  const value = { isPrivateAuthenticated, user, signIn, signOut, isLoading };

  return <PrivateAuthContext.Provider value={value}>{children}</PrivateAuthContext.Provider>;
};

export const usePrivateAuth = () => {
  const context = useContext(PrivateAuthContext);
  if (context === undefined) {
    throw new Error('usePrivateAuth must be used within a PrivateAuthProvider');
  }
  return context;
};