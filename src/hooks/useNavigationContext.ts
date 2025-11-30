import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook to detect navigation context (dealer vs private user)
 * Provides context-aware routes and navigation helpers
 */
export const useNavigationContext = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isPrivateContext = location.pathname.startsWith('/private');
  const isDealerContext = location.pathname.startsWith('/mobile');
  const isAdminContext = location.pathname.startsWith('/admin');
  
  // Context-aware routes
  const routes = {
    dashboard: isPrivateContext ? '/private/dashboard' : '/mobile/dashboard',
    myVehicles: isPrivateContext ? '/private/my-vehicles' : '/mobile/my-vehicles',
    addVehicle: isPrivateContext ? '/private/add-vehicle' : '/mobile/add-vehicle',
    editVehicle: (id: string) => isPrivateContext ? `/private/edit-vehicle/${id}` : `/mobile/edit-vehicle/${id}`,
    vehicleDetail: (id: string) => isPrivateContext ? `/private/vehicle/${id}` : `/mobile/vehicle/${id}`,
    profile: isPrivateContext ? '/private/profile' : '/mobile/profile',
    profileEdit: isPrivateContext ? '/private/profile/edit' : '/mobile/profile/edit',
    login: isPrivateContext ? '/private/login' : '/mobile/login',
    welcome: isPrivateContext ? '/private' : '/mobile/welcome',
  };
  
  // Context-aware navigation
  const goToDashboard = () => navigate(routes.dashboard);
  const goToMyVehicles = () => navigate(routes.myVehicles);
  const goToAddVehicle = () => navigate(routes.addVehicle);
  const goToProfile = () => navigate(routes.profile);
  const goBack = () => navigate(-1);
  
  return {
    isPrivateContext,
    isDealerContext,
    isAdminContext,
    routes,
    navigate,
    goToDashboard,
    goToMyVehicles,
    goToAddVehicle,
    goToProfile,
    goBack,
  };
};
