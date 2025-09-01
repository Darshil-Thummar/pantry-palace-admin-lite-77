import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginPayload, RegisterPayload, AuthResponse } from '@/services/authService';
import { getIntendedRedirect, clearIntendedRedirect } from '@/utils/redirectUtils';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<string>; // Return redirect path
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const token = authService.getToken();
    const savedUser = authService.getUser();
    
    if (token && savedUser) {
      setUser(savedUser);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (payload: LoginPayload): Promise<string> => {
    try {
      console.log('AuthContext: Attempting login with:', payload);
      const response = await authService.login(payload);
      console.log('AuthContext: Login response:', response);
      
      if (response.success && response.token && response.user) {
        console.log('AuthContext: Setting user data and token...');
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        console.log('AuthContext: User logged in successfully:', response.user);
        console.log('AuthContext: Token stored:', response.token);
        console.log('AuthContext: User state updated:', response.user);
        
        // Get the intended redirect destination
        const redirectPath = getIntendedRedirect();
        console.log('AuthContext: Redirecting to:', redirectPath);
        
        return redirectPath;
      } else {
        console.log('AuthContext: Login failed - missing required data');
        console.log('AuthContext: Response success:', response.success);
        console.log('AuthContext: Response token:', response.token);
        console.log('AuthContext: Response user:', response.user);
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      console.log('AuthContext: Attempting registration with:', payload);
      const response = await authService.register(payload);
      console.log('AuthContext: Registration response:', response);
      
      if (response.success) {
        // Don't automatically log in the user after registration
        // Let them login separately for security
        console.log('AuthContext: User registered successfully, but not logged in yet');
        console.log('AuthContext: Returning response:', response);
        return response;
      } else {
        console.log('AuthContext: Registration failed - response not successful');
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out user');
    authService.logout();
    setUser(null);
    // Clear any saved redirect when logging out
    clearIntendedRedirect();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
