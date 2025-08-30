import { API_CONFIG } from '@/config/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINT}/login`;
      console.log('authService: Login URL:', url);
      console.log('authService: Login payload:', payload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('authService: Login response status:', response.status);
      console.log('authService: Login response headers:', response.headers);

      const data = await response.json();
      console.log('authService: Login response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Handle the actual API response structure
      if (data.message && data.token && data.user) {
        console.log('authService: Login successful - returning formatted data');
        return {
          success: true,
          message: data.message,
          token: data.token,
          user: {
            id: data.user._id, // Note: API uses _id, we map to id
            name: data.user.name,
            email: data.user.email
          }
        };
      } else {
        console.log('authService: Login failed - unexpected response structure');
        throw new Error('Unexpected response structure from server');
      }
    } catch (error) {
      console.error('authService: Login error:', error);
      throw error;
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINT}/register`;
      console.log('authService: Register URL:', url);
      console.log('authService: Register payload:', payload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('authService: Register response status:', response.status);
      console.log('authService: Register response headers:', response.headers);

      const data = await response.json();
      console.log('authService: Register response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('authService: Register error:', error);
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
