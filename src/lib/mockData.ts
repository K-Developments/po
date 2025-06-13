import type { Product, Customer, DistributionRecord, User } from '@/types';

export const mockUsers: User[] = [
  { id: 'user-admin-01', email: 'admin@yocool.com', role: 'admin', name: 'Admin Cool' },
  { id: 'user-user-01', email: 'user@yocool.com', role: 'user', name: 'User Fresh' },
];

export const mockProducts: Product[] = [
  { id: 'prod-001', name: 'YoCool Classic Yo-Yo', photoUrl: 'https://placehold.co/300x200.png', stock: 150, price: 12.99 },
  { id: 'prod-002', name: 'YoCool Pro Spinner', photoUrl: 'https://placehold.co/300x200.png', stock: 75, price: 24.50 },
  { id: 'prod-003', name: 'YoCool Glow-in-the-Dark Edition', photoUrl: 'https://placehold.co/300x200.png', stock: 200, price: 15.75 },
  { id: 'prod-004', name: 'YoCool Mini Collectible', photoUrl: 'https://placehold.co/300x200.png', stock: 300, price: 5.00 },
];

export const mockCustomers: Customer[] = [
  { id: 'cust-001', name: 'Alice Wonderland', email: 'alice@example.com', phone: '555-0101' },
  { id: 'cust-002', name: 'Bob The Builder', email: 'bob@example.com', phone: '555-0102' },
  { id: 'cust-003', name: 'Charlie Chocolate', email: 'charlie@example.com', phone: '555-0103' },
];

export const mockDistributionRecords: DistributionRecord[] = [
  { 
    id: 'dist-001', 
    productId: 'prod-001', 
    productName: 'YoCool Classic Yo-Yo',
    customerId: 'cust-001', 
    customerName: 'Alice Wonderland',
    quantity: 10, 
    paymentMethod: 'credit_card', 
    paymentAmount: 129.90, 
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() 
  },
  { 
    id: 'dist-002', 
    productId: 'prod-002', 
    productName: 'YoCool Pro Spinner',
    customerId: 'cust-002', 
    customerName: 'Bob The Builder',
    quantity: 5, 
    paymentMethod: 'cash', 
    paymentAmount: 122.50, 
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
   { 
    id: 'dist-003', 
    productId: 'prod-001', 
    productName: 'YoCool Classic Yo-Yo',
    customerId: 'cust-003', 
    customerName: 'Charlie Chocolate',
    quantity: 50, // Large quantity to trigger restock suggestion
    paymentMethod: 'credit_card', 
    paymentAmount: 649.50, 
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
   { 
    id: 'dist-004', 
    productId: 'prod-003', 
    productName: 'YoCool Glow-in-the-Dark Edition',
    customerId: 'cust-001', 
    customerName: 'Alice Wonderland',
    quantity: 2, 
    paymentMethod: 'cash', 
    paymentAmount: 31.50, 
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
];

// Function to update stock based on distributions (for more realistic demo)
export function getInitialProductsWithUpdatedStock(): Product[] {
  const products = JSON.parse(JSON.stringify(mockProducts)) as Product[]; // Deep clone
  mockDistributionRecords.forEach(record => {
    const product = products.find(p => p.id === record.productId);
    if (product) {
      product.stock -= record.quantity;
      if (product.stock < 0) product.stock = 0; // Ensure stock doesn't go negative
    }
  });
  return products;
}
