import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePrivateAuth } from "@/contexts/PrivateAuthContext";
import { PrivateHeader } from "@/components/private/PrivateHeader";

/**
 * A component to protect routes that require private user authentication.
 * Includes the shared header for all private user pages.
 */
export const PrivateRoutes = () => {
  const { isPrivateAuthenticated, loading } = usePrivateAuth();
  const location = useLocation();

  // Handle the loading state while authentication is being checked.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">טוען...</div>
      </div>
    );
  }

  // If the user is authenticated, render the layout with header and child route.
  if (isPrivateAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <PrivateHeader />
        <main>
          <Outlet />
        </main>
      </div>
    );
  }

  // If not authenticated, redirect to the login page.
  return <Navigate to="/private/login" state={{ from: location }} replace />;
};
