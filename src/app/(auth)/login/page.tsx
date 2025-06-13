"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/labels';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IceCream2, LogIn } from 'lucide-react';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    // Mock authentication: 'admin' for admin, 'user' for user, anything else fails
    let role: UserRole | null = null;
    if (password.toLowerCase() === 'admin') {
      role = 'admin';
    } else if (password.toLowerCase() === 'user') {
      role = 'user';
    }

    if (!role) {
      setError('Invalid credentials. Use password "admin" or "user".');
      return;
    }

    try {
      await login(email, role);
      // Redirect is handled by AuthContext or can be explicitly done here
      // For example: router.push(role === 'admin' ? '/admin/products' : '/user/distributions');
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <IceCream2 className="h-12 w-12 text-primary" />
            <CardTitle className="text-4xl font-headline ml-2">Yo Cool Central</CardTitle>
          </div>
          <CardDescription className="font-body">Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-headline">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-headline">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="•••••••• (Hint: admin or user)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input"
              />
            </div>
            {error && <p className="text-sm text-destructive font-body">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={authLoading}>
              <LogIn className="mr-2 h-5 w-5" />
              {authLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="font-body">Welcome to the coolest place on the web!</p>
        </CardFooter>
      </Card>
    </div>
  );
}
