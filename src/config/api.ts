// Get API base URL with fallback
const getApiBaseUrl = () => {
  const envUrl = 'https://pantry-palace-be.onrender.com/api';
  
  if (!envUrl) {
    console.warn('VITE_API_BASE_URL not found in environment variables, using fallback');
    return 'http://localhost:3000/api';
  }
  
  // Remove trailing slash if present and ensure /api suffix
  const baseUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  PRODUCTS_ENDPOINT: '/product',
  AUTH_ENDPOINT: '/user',
  CART_ENDPOINT: '/cart',
};

export const getApiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`;

// Debug logging
console.log('Environment variable VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Final API_BASE_URL:', API_CONFIG.BASE_URL);
