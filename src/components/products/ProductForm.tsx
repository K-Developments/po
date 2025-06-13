"use client";
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/labels';
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea exists for description

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  photoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')), // Optional, allows empty for placeholder
  stock: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)), // Convert empty string to undefined for optional number
    z.number().min(0, 'Stock cannot be negative').int('Stock must be an integer').optional()
  ).transform(val => val ?? 0), // Default to 0 if undefined
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, 'Price cannot be negative').optional()
  ).transform(val => val ?? 0),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null; // Make product optional for Add mode
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      photoUrl: product?.photoUrl || '',
      stock: product?.stock || 0,
      price: product?.price || 0,
    },
  });

  const handleFormSubmit: SubmitHandler<ProductFormData> = (data) => {
    const dataWithDefaults = {
      ...data,
      photoUrl: data.photoUrl || `https://placehold.co/300x200.png?text=${encodeURIComponent(data.name.substring(0,10))}`,
    };
    onSubmit(dataWithDefaults);
  };
  
  return (
    <DialogContent className="sm:max-w-[480px] bg-white">
      <DialogHeader>
        <DialogTitle className="font-headline">{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogDescription className="font-body">
          {product ? 'Update the details of this cool product.' : 'Enter the details for the new cool product.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
        <div>
          <Label htmlFor="name" className="font-headline">Product Name</Label>
          <Input id="name" {...register('name')} className="mt-1"/>
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="photoUrl" className="font-headline">Photo URL (Optional)</Label>
          <Input id="photoUrl" {...register('photoUrl')} placeholder="https://example.com/image.png" className="mt-1"/>
          {errors.photoUrl && <p className="text-sm text-destructive mt-1">{errors.photoUrl.message}</p>}
        </div>
         <div>
          <Label htmlFor="stock" className="font-headline">Stock Quantity</Label>
          <Input id="stock" type="number" {...register('stock')} className="mt-1" />
          {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>}
        </div>
        <div>
          <Label htmlFor="price" className="font-headline">Price</Label>
          <Input id="price" type="number" step="0.01" {...register('price')} className="mt-1"/>
          {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {product ? 'Save Changes' : 'Add Product'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
