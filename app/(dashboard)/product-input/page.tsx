'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import Step6 from './components/Step6';
import ProgressBar from './components/ProgressBar';

const productDetailsSchema = z.object({
  // ... (as defined in your design document)
});

type ProductDetails = z.infer<typeof productDetailsSchema>;

export default function ProductInputForm() {
  const [step, setStep] = useState(1);
  const methods = useForm<ProductDetails>({
    resolver: zodResolver(productDetailsSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: ProductDetails) => {
    console.log(data);
    // TODO: Send data to API
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-4">
        <ProgressBar currentStep={step} totalSteps={6} />
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 />}
        {step === 5 && <Step5 />}
        {step === 6 && <Step6 />}
        <div className="mt-4 flex justify-between">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="btn btn-secondary">
              Previous
            </button>
          )}
          {step < 6 ? (
            <button type="button" onClick={nextStep} className="btn btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}