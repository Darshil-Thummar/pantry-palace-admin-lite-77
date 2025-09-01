import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { saveIntendedRedirect } from '@/utils/redirectUtils';

/**
 * Custom hook to handle authentication redirects
 * Saves the current location when user is not authenticated
 * and redirects to login page
 */
export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect if still loading or if already authenticated
    if (isLoading || isAuthenticated) {
      return;
    }

    // Save the current location as the intended redirect destination
    saveIntendedRedirect(location.pathname);
    
    // Redirect to login page
    navigate('/login', { replace: true });
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  return { isAuthenticated, isLoading };
};

/**
 * Custom hook for components that require authentication
 * Automatically redirects to login if not authenticated
 */
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuthRedirect();
  
  return { isAuthenticated, isLoading };
}; 