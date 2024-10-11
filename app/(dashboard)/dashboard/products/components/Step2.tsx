import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Step2() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="targetAudience">Target Audience</Label>
        <Textarea
          id="targetAudience"
          {...register('targetAudience')}
          placeholder="Describe your target audience"
        />
        {errors.targetAudience && (
          <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message as string}</p>
        )}
      </div>
      <div>
        <Label htmlFor="mainUseCase">Main Use Case</Label>
        <Textarea
          id="mainUseCase"
          {...register('mainUseCase')}
          placeholder="Describe the main use case for your product"
        />
        {errors.mainUseCase && (
          <p className="text-red-500 text-sm mt-1">{errors.mainUseCase.message as string}</p>
        )}
      </div>
    </div>
  );
}