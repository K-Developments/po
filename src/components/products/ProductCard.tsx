"use client";
import Image from 'next/image';
import type { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilePenLine, Trash2, PackageCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image
          src={product.photoUrl}
          alt={product.name}
          width={400}
          height={250}
          className="object-cover w-full h-48"
          data-ai-hint="product merchandise"
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-2 line-clamp-2">{product.name}</CardTitle>
        <div className="space-y-2 text-sm font-body text-muted-foreground">
          <div className="flex items-center">
           
            Price: Rs. {product.price.toFixed(2)}
          </div>
          <div className="flex items-center">
            <PackageCheck className="h-4 w-4 mr-2 text-primary" />
            Stock: <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="ml-1">
              {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto">
        <div className="flex justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
            <FilePenLine className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(product.id)}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}