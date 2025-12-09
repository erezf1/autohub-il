import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePrivateAuth } from "@/contexts/PrivateAuthContext";

/**
 * A component to protect routes that require private user authentication.
 *
 * This component acts as a "layout route" in React Router v6.
 * - If the user is authenticated, it renders the nested child routes via <Outlet />.
 * - If the user is not authenticated, it redirects them to the private login page.
 */
export const PrivateRoutes = () => {
  const { isPrivateAuthenticated, loading } = usePrivateAuth();
  const location = useLocation();

  // 1. Handle the loading state while authentication is being checked.
  // This prevents a brief flash of the protected content or login page.
  if (loading) {
    return <div>Loading session...</div>; // Or a spinner component
  }

  // 2. If the user is authenticated, render the child route.
  // <Outlet /> is a placeholder where React Router will render the matched
  // nested route from App.tsx (e.g., <PrivateDashboard />).
  if (isPrivateAuthenticated) {
    return <Outlet />;
  }

  // 3. If not authenticated, redirect to the login page.
  // We pass the `location` they were trying to access in the `state` prop.
  return <Navigate to="/private/login" state={{ from: location }} replace />;
};
