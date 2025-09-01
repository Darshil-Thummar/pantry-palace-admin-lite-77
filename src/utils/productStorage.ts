import { Product, ProductFormData } from "@/types/product";

const STORAGE_KEY = "pantry_palace_products";

// Mock initial products
const initialProducts: Product[] = [
  {
    _id: "1",
    name: "Fresh Organic Apples",
    category: "Fruits",
    description: "Crisp and sweet organic apples, perfect for snacking or baking.",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
    price: 4.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2", 
    name: "Organic Baby Spinach",
    category: "Vegetables",
    description: "Fresh, tender baby spinach leaves perfect for salads and smoothies.",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
    price: 3.49,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "Artisan Whole Grain Bread",
    category: "Bakery",
    description: "Freshly baked whole grain bread with seeds and grains.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    price: 5.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "Fresh Salmon Fillet",
    category: "Seafood",
    description: "Premium Atlantic salmon fillet, sustainably sourced.",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop",
    price: 12.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "5",
    name: "Greek Yogurt",
    category: "Dairy",
    description: "Creamy Greek yogurt with live cultures, high in protein.",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
    price: 6.49,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6",
    name: "Organic Bananas",
    category: "Fruits",
    description: "Sweet and ripe organic bananas, great for smoothies.",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
    price: 2.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }
  return JSON.parse(stored);
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const addProduct = (productData: ProductFormData): Product => {
  const products = getProducts();
  const newProduct: Product = {
    _id: Date.now().toString(),
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id: string, productData: ProductFormData): Product => {
  const products = getProducts();
  const index = products.findIndex(p => p._id === id);
  if (index === -1) throw new Error("Product not found");
  
  const updatedProduct: Product = {
    ...products[index],
    ...productData,
    updatedAt: new Date().toISOString(),
  };
  products[index] = updatedProduct;
  saveProducts(products);
  return updatedProduct;
};

export const deleteProduct = (id: string): void => {
  const products = getProducts();
  const filteredProducts = products.filter(p => p._id !== id);
  saveProducts(filteredProducts);
};

export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p._id === id);
};