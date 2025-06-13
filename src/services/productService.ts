import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import type { Product, ProductFormData } from '@/types';

const productsCollection = collection(db, 'products');

export const addProduct = async (productData: ProductFormData): Promise<string> => {
  const docRef = await addDoc(productsCollection, {
    ...productData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};

export const updateProduct = async (productId: string, productData: ProductFormData): Promise<void> => {
  const productDoc = doc(db, 'products', productId);
  await updateDoc(productDoc, {
    ...productData,
    updatedAt: new Date().toISOString()
  });
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const productDoc = doc(db, 'products', productId);
  await deleteDoc(productDoc);
};

export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  return onSnapshot(productsCollection, (snapshot) => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    callback(products);
  });
};