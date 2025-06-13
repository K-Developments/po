//location: pos/src/components/customers/CustomerForm.tsx
"use client";
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/labels';
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog';

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(7, 'Phone number seems too short').optional().or(z.literal('')),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
}

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
    },
  });

  const handleFormSubmit: SubmitHandler<CustomerFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <DialogContent className="sm:max-w-[480px] bg-white">
      <DialogHeader>
        <DialogTitle className="font-headline">{customer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        <DialogDescription className="font-body">
          {customer ? 'Update the details for this customer.' : 'Enter the details for the new customer.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
        <div>
          <Label htmlFor="name" className="font-headline">Full Name</Label>
          <Input id="name" {...register('name')} className="mt-1" />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email" className="font-headline">Email Address (Optional)</Label>
          <Input id="email" type="email" {...register('email')} className="mt-1" />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="font-headline">Phone Number (Optional)</Label>
          <Input id="phone" type="tel" {...register('phone')} className="mt-1" />
          {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {customer ? 'Save Changes' : 'Add Customer'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
