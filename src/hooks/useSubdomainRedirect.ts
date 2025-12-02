import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook to detect admin subdomain and redirect to admin login
 * Handles: admin.yourdomain.com → /admin/login
 */
export const useSubdomainRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Check if we're on an admin subdomain
    const isAdminSubdomain = hostname.startsWith('admin.');
    
    // If on admin subdomain and not already on an admin route, redirect
    if (isAdminSubdomain && !location.pathname.startsWith('/admin')) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate, location.pathname]);
};
