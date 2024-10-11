import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Step3() {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "keyFeatures",
  });

  return (
    <div className="space-y-4">
      <Label>Key Features of Your Product</Label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center space-x-2">
          <Input
            {...register(`keyFeatures.${index}`)}
            placeholder="Enter a key feature"
          />
          <Button type="button" onClick={() => remove(index)} variant="destructive">
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => append('')}
        variant="secondary"
      >
        Add Feature
      </Button>
      {errors.keyFeatures && (
        <p className="text-red-500 text-sm mt-1">{errors.keyFeatures.message as string}</p>
      )}
    </div>
  );
}