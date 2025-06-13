"use client";
import React, { useState, useEffect } from 'react';
import type { DistributionRecord } from '@/types';
import { DistributionForm } from '@/components/distributions/DistributionForm';
import { PageHeader } from '@/components/PageHeader';
import { mockDistributionRecords, mockProducts } from '@/lib/mockData'; // Use mock data
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Truck, ListChecks } from 'lucide-react';

export default function UserDistributionsPage() {
  const [distributionRecords, setDistributionRecords] = useState<DistributionRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch records for the logged-in user
    setDistributionRecords(mockDistributionRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const handleDistributionSubmit = (newRecord: DistributionRecord) => {
    // Update product stock (mock)
    const productIndex = mockProducts.findIndex(p => p.id === newRecord.productId);
    if (productIndex !== -1) {
        mockProducts[productIndex].stock -= newRecord.quantity;
        if (mockProducts[productIndex].stock < 0) mockProducts[productIndex].stock = 0;
    }

    setDistributionRecords(prevRecords => [newRecord, ...prevRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({
      title: "Distribution Recorded!",
      description: `Distribution of ${newRecord.quantity} x ${newRecord.productName} to ${newRecord.customerName} saved.`,
      className: "bg-primary text-primary-foreground",
    });
    // Here you would typically send the data to your backend API
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <PageHeader 
        title="Record Distribution"
        description="Log new product distributions and payments."
      />
      
      <DistributionForm onSubmit={handleDistributionSubmit} />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <ListChecks className="mr-2 h-6 w-6" />
            Recent Distributions
          </CardTitle>
          <CardDescription className="font-body">
            View your latest distribution activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {distributionRecords.length === 0 ? (
            <div className="text-center py-10">
              <Truck className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-xl font-semibold font-headline">No Distributions Recorded Yet</h3>
              <p className="mt-2 text-muted-foreground font-body">Use the form above to log your first distribution.</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-headline">Date</TableHead>
                    <TableHead className="font-headline">Product</TableHead>
                    <TableHead className="font-headline">Customer</TableHead>
                    <TableHead className="text-right font-headline">Qty</TableHead>
                    <TableHead className="font-headline">Payment</TableHead>
                    <TableHead className="text-right font-headline">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distributionRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-body">{format(new Date(record.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="font-body">{record.productName}</TableCell>
                      <TableCell className="font-body">{record.customerName}</TableCell>
                      <TableCell className="text-right font-body">{record.quantity}</TableCell>
                      <TableCell className="font-body">
                        <Badge variant={record.paymentMethod === 'cash' ? 'secondary' : 'default'}>
                          {record.paymentMethod === 'cash' ? 'Cash' : 'Credit Card'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-body">${record.paymentAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
