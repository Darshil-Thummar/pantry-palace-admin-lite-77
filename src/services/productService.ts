import { API_CONFIG } from '@/config/api';

export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  description: string;
  image?: File;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class ProductService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      // API returns products directly as an array
      const products: Product[] = await response.json();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      // API returns product directly
      const product: Product = await response.json();
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(data: ProductFormData): Promise<Product> {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('category', data.category);
      formData.append('price', data.price.toString());
      formData.append('description', data.description);
      
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}`, {
        method: 'POST',
        headers: {
          ...this.getAuthHeaders(),
          // Don't set Content-Type for FormData, let the browser set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      // API returns product directly
      const product: Product = await response.json();
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, data: ProductFormData): Promise<Product> {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('category', data.category);
      formData.append('price', data.price.toString());
      formData.append('description', data.description);
      
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: {
          ...this.getAuthHeaders(),
          // Don't set Content-Type for FormData, let the browser set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      // API returns product directly
      const product: Product = await response.json();
      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();
