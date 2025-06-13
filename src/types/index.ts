export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface Product {
  id: string;
  name: string;
  photoUrl: string;
  stock: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  photoUrl?: string;
  stock: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerFormData {
  name: string;
  email?: string;
  phone?: string;
}

export type PaymentMethod = 'cash' | 'credit_card';

export interface DistributionRecord {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  paymentAmount: number;
  date: string;
  createdAt?: string;
}