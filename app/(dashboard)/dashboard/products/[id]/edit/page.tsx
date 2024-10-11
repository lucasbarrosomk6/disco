'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import Step1 from '../../components/Step1';
import Step2 from '../../components/Step2';
import Step3 from '../../components/Step3';
import Step4 from '../../components/Step4';
import Step5 from '../../components/Step5';
import Step6 from '../../components/Step6';

export const productDetailsSchema = z.object({
  productName: z.string().min(1, 'Product Name is required'),
  tagline: z.string().optional(),
  targetAudience: z.string().min(1, 'Target Audience is required'),
  mainUseCase: z.string().min(1, 'Main Use Case is required'),
  keyFeatures: z.array(z.string().min(1, 'Feature cannot be empty')).min(1, 'At least one key feature is required'),
  problemsSolved: z.string().min(1, 'Please describe the problems your product solves'),
  differentiators: z.string().optional(),
  successMetrics: z.string().min(1, 'Please describe what success looks like for your customers'),
});

export type ProductDetails = z.infer<typeof productDetailsSchema>;

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const methods = useForm<ProductDetails>({
    resolver: zodResolver(productDetailsSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        methods.reset(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [params.id, methods]);

  const onSubmit = async (data: ProductDetails) => {
    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      router.push(`/dashboard/products/${params.id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Edit Product</h1>
        <Step1 />
        <Step2 />
        <Step3 />
        <Step4 />
        <Step5 />
        <Step6 />
        <div className="mt-4 flex justify-between">
          <Button type="button" onClick={() => router.back()} variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Changes
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}