//location: pos/src/components/distributions/DistributionForm.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type {
  Product,
  Customer,
  PaymentMethod,
  DistributionRecord,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/labels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { mockProducts, mockCustomers } from "@/lib/mockData"; // For dropdowns

const distributionSchema = z.object({
  productId: z.string().min(1, "Product selection is required"),
  customerId: z.string().min(1, "Customer selection is required"),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Quantity must be at least 1").int()
  ),
  paymentMethod: z.enum(["cash", "credit_card"], {
    required_error: "Payment method is required",
  }),
  paymentAmount: z.preprocess(
    (val) => Number(val),
    z.number().min(0.01, "Payment amount must be positive")
  ),
});

export type DistributionFormData = z.infer<typeof distributionSchema>;

interface DistributionFormProps {
  onSubmit: (data: DistributionRecord) => void;
}

export function DistributionForm({ onSubmit }: DistributionFormProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedProductPrice, setSelectedProductPrice] = useState<
    number | null
  >(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DistributionFormData>({
    resolver: zodResolver(distributionSchema),
    defaultValues: {
      paymentMethod: "cash", // Default payment method
    },
  });

  const quantity = watch("quantity");
  const productId = watch("productId");

  useEffect(() => {
    const product = products.find((p) => p.id === productId);
    setSelectedProductPrice(product ? product.price : null);
  }, [productId, products]);

  useEffect(() => {
    if (selectedProductPrice && quantity > 0) {
      setValue(
        "paymentAmount",
        parseFloat((selectedProductPrice * quantity).toFixed(2))
      );
    } else {
      setValue("paymentAmount", 0);
    }
  }, [selectedProductPrice, quantity, setValue]);

  const handleFormSubmit: SubmitHandler<DistributionFormData> = (data) => {
    const product = products.find((p) => p.id === data.productId);
    const customer = customers.find((c) => c.id === data.customerId);

    if (!product || !customer) {
      // This should ideally be caught by validation or UI logic
      console.error("Selected product or customer not found");
      return;
    }

    const fullRecord: DistributionRecord = {
      id: `dist-${Date.now()}`,
      ...data,
      productName: product.name,
      customerName: customer.name,
      date: new Date().toISOString(),
    };
    onSubmit(fullRecord);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">
          Record New Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="productId" className="font-headline">
              Product
            </Label>
            <Controller
              name="productId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger id="productId" className="mt-1">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} (Stock: {product.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.productId && (
              <p className="text-sm text-destructive mt-1">
                {errors.productId.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="customerId" className="font-headline">
              Customer
            </Label>
            <Controller
              name="customerId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger id="customerId" className="mt-1">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.customerId && (
              <p className="text-sm text-destructive mt-1">
                {errors.customerId.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="quantity" className="font-headline">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              {...register("quantity")}
              className="mt-1"
            />
            {errors.quantity && (
              <p className="text-sm text-destructive mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <Label className="font-headline">Payment Method</Label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="font-body">
                      Cash
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="font-body">
                      Credit Card
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.paymentMethod && (
              <p className="text-sm text-destructive mt-1">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="paymentAmount" className="font-headline">
              Payment Amount ($)
            </Label>
            <Input
              id="paymentAmount"
              type="number"
              step="0.01"
              {...register("paymentAmount")}
              className="mt-1"
            />
            {errors.paymentAmount && (
              <p className="text-sm text-destructive mt-1">
                {errors.paymentAmount.message}
              </p>
            )}
            {selectedProductPrice && quantity > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Calculated total: $
                {(selectedProductPrice * quantity).toFixed(2)}
              </p>
            )}
          </div>

          <CardFooter className="px-0 pt-6">
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Record Distribution
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
