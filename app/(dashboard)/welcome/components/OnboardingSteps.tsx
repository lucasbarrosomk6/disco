import React from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingStepsProps {
  onStepComplete: (step: string) => void;
}

export default function OnboardingSteps({ onStepComplete }: OnboardingStepsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Step 1: Input Your Product Details</h3>
        <p className="text-gray-600 mb-2">Tell us about your product to generate tailored insights.</p>
        <Button onClick={() => onStepComplete('product_details')}>Add Product Details</Button>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Step 2: Generate Your First Company Report</h3>
        <p className="text-gray-600 mb-2">Start by searching for a company you're targeting.</p>
        <Button onClick={() => onStepComplete('generate_report')}>Generate Report</Button>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Step 3: Explore Your Dashboard</h3>
        <p className="text-gray-600 mb-2">View insights and manage your reports.</p>
        <Button onClick={() => onStepComplete('explore_dashboard')}>Go to Dashboard</Button>
      </div>
    </div>
  );
}