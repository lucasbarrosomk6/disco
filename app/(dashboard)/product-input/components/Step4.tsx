import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Step4() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="problemsSolved">Problems Your Product Solves</Label>
        <Textarea
          id="problemsSolved"
          {...register('problemsSolved')}
          placeholder="Describe the pain points addressed"
        />
        {errors.problemsSolved && (
          <p className="text-red-500 text-sm mt-1">{errors.problemsSolved.message as string}</p>
        )}
      </div>
    </div>
  );
}