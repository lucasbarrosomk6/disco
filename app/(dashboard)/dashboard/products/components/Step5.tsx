import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Step5() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="differentiators">Differentiators</Label>
        <Textarea
          id="differentiators"
          {...register('differentiators')}
          placeholder="What makes your product unique?"
        />
        {errors.differentiators && (
          <p className="text-red-500 text-sm mt-1">{errors.differentiators.message as string}</p>
        )}
      </div>
    </div>
  );
}