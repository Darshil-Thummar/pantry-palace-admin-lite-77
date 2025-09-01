// Utility functions for handling redirects after authentication

const REDIRECT_KEY = 'intendedRedirect';

/**
 * Save the current location as the intended redirect destination
 */
export const saveIntendedRedirect = (path: string) => {
  // Don't save login/register pages as redirect destinations
  if (path === '/login' || path === '/register') {
    return;
  }
  
  // Don't save if it's already the current page
  if (path === window.location.pathname) {
    return;
  }
  
  localStorage.setItem(REDIRECT_KEY, path);
};

/**
 * Get the saved intended redirect destination
 */
export const getIntendedRedirect = (): string => {
  const saved = localStorage.getItem(REDIRECT_KEY);
  if (saved) {
    // Clear the saved redirect after retrieving it
    localStorage.removeItem(REDIRECT_KEY);
    return saved;
  }
  
  // Default redirect destinations
  return '/products';
};

/**
 * Clear any saved redirect destination
 */
export const clearIntendedRedirect = () => {
  localStorage.removeItem(REDIRECT_KEY);
};

/**
 * Check if there's a saved redirect destination
 */
export const hasIntendedRedirect = (): boolean => {
  return localStorage.getItem(REDIRECT_KEY) !== null;
}; 