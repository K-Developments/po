"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; 

    if (user) {
      if (user.role === 'admin') {
        router.replace('/admin/products');
      } else {
        router.replace('/user/distributions');
      }
    } else {
      router.replace('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground p-4">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-headline text-primary">Yo Cool Central</h1>
        <Skeleton className="h-8 w-48 mx-auto" />
        <p className="text-muted-foreground">Loading your awesome experience...</p>
      </div>
    </div>
  );
}
