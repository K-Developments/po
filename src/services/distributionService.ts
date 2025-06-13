import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { DistributionRecord } from '@/types';

const distributionsCollection = collection(db, 'distributions');

export const addDistribution = async (distributionData: Omit<DistributionRecord, 'id'>): Promise<string> => {
  const docRef = await addDoc(distributionsCollection, {
    ...distributionData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const getDistributions = async (): Promise<DistributionRecord[]> => {
  const q = query(distributionsCollection, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as DistributionRecord[];
};

export const subscribeToDistributions = (callback: (distributions: DistributionRecord[]) => void) => {
  const q = query(distributionsCollection, orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const distributions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DistributionRecord[];
    callback(distributions);
  });
};