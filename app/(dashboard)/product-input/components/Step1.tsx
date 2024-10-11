import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Step1() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="productName">Product Name</Label>
        <Input
          id="productName"
          {...register('productName')}
          placeholder="Enter your product name"
        />
        {errors.productName && (
          <p className="text-red-500 text-sm mt-1">{errors.productName.message as string}</p>
        )}
      </div>
      <div>
        <Label htmlFor="tagline">Tagline or Brief Description</Label>
        <Input
          id="tagline"
          {...register('tagline')}
          placeholder="Enter a brief description or tagline"
        />
      </div>
    </div>
  );
}