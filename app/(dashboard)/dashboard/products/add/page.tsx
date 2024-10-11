'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Step1 from '../components/Step1';
import Step2 from '../components/Step2';
import Step3 from '../components/Step3';
import Step4 from '../components/Step4';
import Step5 from '../components/Step5';
import Step6 from '../components/Step6';
import ProgressBar from '../components/ProgressBar';

const productDetailsSchema = z.object({
  productName: z.string().min(1, 'Product Name is required'),
  tagline: z.string().optional(),
  targetAudience: z.string().min(1, 'Target Audience is required'),
  mainUseCase: z.string().min(1, 'Main Use Case is required'),
  keyFeatures: z.array(z.string().min(1, 'Feature cannot be empty')).min(1, 'At least one key feature is required'),
  problemsSolved: z.string().min(1, 'Please describe the problems your product solves'),
  differentiators: z.string().optional(),
  successMetrics: z.string().min(1, 'Please describe what success looks like for your customers'),
});

type ProductDetails = z.infer<typeof productDetailsSchema>;

export default function AddProductPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const methods = useForm<ProductDetails>({
    resolver: zodResolver(productDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ProductDetails) => {
    try {
      const response = await fetch('/api/products/add', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error adding product:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
        <ProgressBar currentStep={step} totalSteps={6} />
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 />}
        {step === 5 && <Step5 />}
        {step === 6 && <Step6 />}
        <div className="mt-4 flex justify-between">
          {step > 1 && (
            <Button type="button" onClick={prevStep} variant="outline">
              Previous
            </Button>
          )}
          {step < 6 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit">
              Add Product
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}