// src/services/customerService.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import type { Customer, CustomerFormData } from '@/types';

const customersCollection = collection(db, 'customers');

export const addCustomer = async (customerData: CustomerFormData): Promise<string> => {
  const docRef = await addDoc(customersCollection, {
    ...customerData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const getCustomers = async (): Promise<Customer[]> => {
  const snapshot = await getDocs(customersCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Customer[];
};

export const updateCustomer = async (customerId: string, customerData: CustomerFormData): Promise<void> => {
  const customerDoc = doc(db, 'customers', customerId);
  await updateDoc(customerDoc, {
    ...customerData,
    updatedAt: new Date().toISOString()
  });
};

export const deleteCustomer = async (customerId: string): Promise<void> => {
  const customerDoc = doc(db, 'customers', customerId);
  await deleteDoc(customerDoc);
};

export const subscribeToCustomers = (callback: (customers: Customer[]) => void) => {
  return onSnapshot(customersCollection, (snapshot) => {
    const customers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Customer[];
    callback(customers);
  });
};