import { API_CONFIG } from '@/config/api';

export interface CartItemPayload {
  productId: string;
  qty: number;
}

export interface CartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  userId: string;
  qty: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartResponse {
  success?: boolean;
  message: string;
  data?: CartItem[];
  cartItems?: CartItem[]; // Add this to match actual API response
  totalItems?: number;
}

class CartService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Add item to cart
  async addToCart(payload: CartItemPayload): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.CART_ENDPOINT}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }

      const result = await response.json();
      
      // Transform the API response to match our expected format
      return {
        success: true,
        message: result.message,
        data: result.cartItems || result.data,
        cartItems: result.cartItems,
        totalItems: result.totalItems
      };
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  // Get cart items
  async getCart(): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.CART_ENDPOINT}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch cart');
      }

      const result = await response.json();
      
      // Transform the API response to match our expected format
      return {
        success: true,
        message: result.message,
        data: result.cartItems || result.data, // Use cartItems if available, fallback to data
        cartItems: result.cartItems,
        totalItems: result.totalItems
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  // Update cart item quantity
  async updateCartItem(productId: string, payload: CartItemPayload): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.CART_ENDPOINT}/${productId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cart item');
      }

      const result: CartResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  // Delete cart item
  async deleteCartItem(cartId: string): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.CART_ENDPOINT}/${cartId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete cart item');
      }

      const result: CartResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting cart item:', error);
      throw error;
    }
  }

  // Clear entire cart
  async clearCart(): Promise<CartResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.CART_ENDPOINT}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clear cart');
      }

      const result: CartResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
}

export const cartService = new CartService(); 