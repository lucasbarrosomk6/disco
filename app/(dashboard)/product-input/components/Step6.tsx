import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Step6() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="successMetrics">What Does Success Look Like for Your Customers?</Label>
        <Textarea
          id="successMetrics"
          {...register('successMetrics')}
          placeholder="Explain the benefits and expected outcomes"
        />
        {errors.successMetrics && (
          <p className="text-red-500 text-sm mt-1">{errors.successMetrics.message as string}</p>
        )}
      </div>
    </div>
  );
}