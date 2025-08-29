export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
}