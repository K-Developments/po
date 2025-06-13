"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { CustomerForm, CustomerFormData } from '@/components/customers/CustomerForm';
import { PageHeader } from '@/components/PageHeader';
import { PlusCircle, Users2 } from 'lucide-react';
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
  addCustomer,
  updateCustomer,
  deleteCustomer,
  subscribeToCustomers
} from '@/services/customerService';
import { Customer } from '@/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerIdToDelete, setCustomerIdToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToCustomers((data) => {
      setCustomers(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomerIdToDelete(customerId);
  };

  const confirmDeleteCustomer = async () => {
    if (customerIdToDelete) {
      try {
        await deleteCustomer(customerIdToDelete);
        toast({
          title: "Customer Deleted",
          description: "The customer has been successfully removed.",
          variant: "destructive",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete customer.",
          variant: "destructive",
        });
      }
      setCustomerIdToDelete(null);
    }
  };

  const handleFormSubmit = async (data: CustomerFormData) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, data);
        toast({
          title: "Customer Updated",
          description: `${data.name} has been successfully updated.`,
        });
      } else {
        await addCustomer(data);
        toast({
          title: "Customer Added",
          description: `${data.name} has been successfully added.`,
        });
      }
      setIsFormOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving the customer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader 
        title="Customer Management"
        description="View and manage your customer base."
        actionButton={
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddCustomer} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Customer
              </Button>
            </DialogTrigger>
            {isFormOpen && (
              <CustomerForm
                customer={editingCustomer}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingCustomer(null);
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
      ) : customers.length === 0 ? (
        <div className="text-center py-10">
          <Users2 className="mx-auto h-24 w-24 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-xl font-semibold font-headline">No Customers Yet</h3>
          <p className="mt-2 text-muted-foreground font-body">Click "Add New Customer" to build your client list!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {customers.map(customer => (
            <CustomerCard 
              key={customer.id} 
              customer={customer} 
              onEdit={handleEditCustomer} 
              onDelete={handleDeleteCustomer} 
            />
          ))}
        </div>
      )}

      {customerIdToDelete && (
        <AlertDialog open={!!customerIdToDelete} onOpenChange={(open) => !open && setCustomerIdToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="font-body">
                This action cannot be undone. This will permanently delete the customer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCustomerIdToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteCustomer} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}