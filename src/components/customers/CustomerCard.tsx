"use client";
import type { Customer } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FilePenLine, Trash2, Mail, Phone } from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

export function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="h-16 w-16 border-2 border-accent">
          <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(customer.name)}`} alt={customer.name} data-ai-hint="person avatar" />
          <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-headline">{customer.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        {customer.email && (
          <div className="flex items-center text-sm font-body text-muted-foreground mb-1">
            <Mail className="h-4 w-4 mr-2 text-accent" />
            {customer.email}
          </div>
        )}
        {customer.phone && (
          <div className="flex items-center text-sm font-body text-muted-foreground">
            <Phone className="h-4 w-4 mr-2 text-accent" />
            {customer.phone}
          </div>
        )}
         {!customer.email && !customer.phone && (
            <p className="text-sm font-body text-muted-foreground">No contact details available.</p>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto">
        <div className="flex justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={() => onEdit(customer)}>
            <FilePenLine className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(customer.id)}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
