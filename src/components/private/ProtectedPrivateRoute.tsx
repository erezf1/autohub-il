import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePrivateAuth } from '@/contexts/PrivateAuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface ProtectedPrivateRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route wrapper for private user pages
 * Redirects to login if not authenticated
 */
export const ProtectedPrivateRoute: React.FC<ProtectedPrivateRouteProps> = ({ children }) => {
  const { user, loading } = usePrivateAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/private/login" replace />;
  }

  return <>{children}</>;
};
