"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductForm, ProductFormData } from '@/components/products/ProductForm';
import { PageHeader } from '@/components/PageHeader';
import { PlusCircle, PackageSearch } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  subscribeToProducts
} from '@/services/productService';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductIdToDelete(productId);
  };

  const confirmDeleteProduct = async () => {
    if (productIdToDelete) {
      try {
        await deleteProduct(productIdToDelete);
        toast({
          title: "Product Deleted",
          description: "The product has been successfully removed.",
          variant: "destructive",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product.",
          variant: "destructive",
        });
      }
      setProductIdToDelete(null);
    }
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast({
          title: "Product Updated",
          description: `${data.name} has been successfully updated.`,
        });
      } else {
        await addProduct(data);
        toast({
          title: "Product Added",
          description: `${data.name} has been successfully added.`,
        });
      }
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the product.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader 
        title="Product Catalog"
        description="Manage your cool YoCool products here."
        actionButton={
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
              </Button>
            </DialogTrigger>
            {isFormOpen && (
              <ProductForm
                product={editingProduct}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingProduct(null);
                }}
              />
            )}
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10">
          <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-xl font-semibold font-headline">No Products Yet</h3>
          <p className="mt-2 text-muted-foreground font-body">Click "Add New Product" to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onEdit={handleEditProduct} 
              onDelete={handleDeleteProduct} 
            />
          ))}
        </div>
      )}
      
      {productIdToDelete && (
        <AlertDialog open={!!productIdToDelete} onOpenChange={(open) => !open && setProductIdToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="font-body">
                This action cannot be undone. This will permanently delete the product
                and remove its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setProductIdToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteProduct} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}