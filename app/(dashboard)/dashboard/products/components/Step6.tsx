import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Step6() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="successMetrics">Success Metrics</Label>
        <Textarea
          id="successMetrics"
          {...register('successMetrics')}
          placeholder="Describe what success looks like for your customers"
        />
        {errors.successMetrics && (
          <p className="text-red-500 text-sm mt-1">{errors.successMetrics.message as string}</p>
        )}
      </div>
    </div>
  );
}