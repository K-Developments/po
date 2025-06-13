"use client";
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserPaymentsPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader 
        title="Payment History"
        description="Review your past payment transactions."
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <CreditCard className="mr-2 h-6 w-6 text-primary" />
            Your Payments
          </CardTitle>
          <CardDescription className="font-body">
            This section will display a detailed history of all your recorded payments.
            Functionality for filtering, sorting, and viewing payment details will be available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
            <CreditCard className="mx-auto h-24 w-24 text-muted-foreground opacity-30" />
            <h3 className="mt-4 text-xl font-semibold font-headline text-muted-foreground">Payment History Coming Soon</h3>
            <p className="mt-2 text-muted-foreground font-body">
              A comprehensive view of your payment records is under development.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
