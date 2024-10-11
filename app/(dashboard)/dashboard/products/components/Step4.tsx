import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Step4() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="problemsSolved">Problems Solved</Label>
        <Textarea
          id="problemsSolved"
          {...register('problemsSolved')}
          placeholder="Describe the problems your product solves"
        />
        {errors.problemsSolved && (
          <p className="text-red-500 text-sm mt-1">{errors.problemsSolved.message as string}</p>
        )}
      </div>
    </div>
  );
}