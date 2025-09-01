import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { cartService, CartItem as ApiCartItem } from '@/services/cartService';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { _id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_CART_ITEMS': {
      const newTotal = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { ...state, items: action.payload, total: newTotal, error: null };
    }
    
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = state.items.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { ...state, items: updatedItems, total: newTotal };
      } else {
        // Add new item
        const newItems = [...state.items, action.payload];
        const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { ...state, items: newItems, total: newTotal };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item._id !== action.payload);
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { ...state, items: updatedItems, total: newTotal };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item._id === action.payload._id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { ...state, items: updatedItems, total: newTotal };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0 };
      
    case 'LOAD_CART': {
      const newTotal = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { ...state, items: action.payload, total: newTotal, error: null };
    }
      
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  removeItem: (_id: string) => Promise<void>;
  updateQuantity: (_id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemQuantity: (_id: string) => number;
  fetchCart: () => Promise<void>;
  syncCartWithAPI: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Convert API cart items to local cart items
  const convertApiCartToLocalCart = (apiItems: ApiCartItem[]): CartItem[] => {
    console.log('Converting API items:', apiItems);
    const result = apiItems.map(apiItem => {
      console.log('Processing API item:', apiItem);
      const localItem = {
        _id: apiItem._id,
        name: apiItem.productId.name, // Changed from apiItem.product.name
        price: apiItem.productId.price, // Changed from apiItem.product.price
        image: apiItem.productId.image, // Changed from apiItem.product.image
        category: apiItem.productId.category, // Changed from apiItem.product.category
        quantity: apiItem.qty,
      };
      console.log('Converted to local item:', localItem);
      return localItem;
    });
    console.log('Final converted items:', result);
    return result;
  };

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      console.log('Fetching cart from API...');
      const response = await cartService.getCart();
      console.log('Cart API response:', response);
      
      if (response.success && response.data) {
        console.log('Converting API cart items to local cart items...');
        console.log('API cart items:', response.data);
        
        // Check if the data structure is correct
        if (response.data.length > 0) {
          const firstItem = response.data[0];
          console.log('First item structure:', firstItem);
          console.log('First item productId:', firstItem.productId);
          console.log('First item productId.name:', firstItem.productId?.name);
        }
        
        const localCartItems = convertApiCartToLocalCart(response.data);
        console.log('Local cart items:', localCartItems);
        dispatch({ type: 'SET_CART_ITEMS', payload: localCartItems });
      } else {
        console.log('No cart data received or success is false');
        console.log('Response success:', response.success);
        console.log('Response data:', response.data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error fetching cart:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Sync local cart with API
  const syncCartWithAPI = async () => {
    await fetchCart();
  };

  const addItem = async (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await cartService.addToCart({
        productId: item._id, // This should be the product ID string
        qty: quantity,
      });
      
      if (response.success) {
        // Refresh cart from API to get updated state
        await fetchCart();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error adding item to cart:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeItem = async (_id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await cartService.deleteCartItem(_id);
      
      if (response.success) {
        // Refresh cart from API to get updated state
        await fetchCart();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item from cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error removing item from cart:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateQuantity = async (_id: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await cartService.updateCartItem(_id, {
        productId: _id, // Use the cart item ID
        qty: quantity,
      });
      
      if (response.success) {
        // Refresh cart from API to get updated state
        await fetchCart();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update item quantity';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error updating item quantity:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await cartService.clearCart();
      
      if (response.success) {
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error clearing cart:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getItemQuantity = (_id: string): number => {
    const item = state.items.find(item => item._id === _id);
    return item ? item.quantity : 0;
  };

  // Load cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    fetchCart,
    syncCartWithAPI,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 