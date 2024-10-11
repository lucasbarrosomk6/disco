'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { updateTeamSubscription } from './actions';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Icon from '@/app/icon.svg';

export default function PricingPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(updateTeamSubscription, null);

  useEffect(() => {
    if (state?.success) {
      router.push('/welcome');
    }
  }, [state, router]);

  const plans = [
    {
      name: 'Free Trial',
      price: 0,
      interval: '14 days',
      features: [
        'Up to 5 comprehensive company reports',
        'Full access to all basic features',
        'No credit card required',
      ],
    },
    {
      name: 'Basic',
      price: 29,
      interval: 'month',
      features: [
        'Up to 10 reports per month',
        'Instant company reports',
        'Personalized value propositions',
      ],
    },
    {
      name: 'Pro',
      price: 99,
      interval: 'month',
      features: [
        'Up to 50 reports per month',
        'All features in Basic Plan',
        'Advanced insights',
        'Priority email support',
      ],
    },
    {
      name: 'Premium',
      price: 199,
      interval: 'month',
      features: [
        'Unlimited reports',
        'All features in Pro Plan',
        'Early access to new features',
        'Dedicated customer success manager',
      ],
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-center mb-8">
        <Image
          src={Icon}
          alt="disco.ai logo"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <h1 className="text-3xl font-bold text-center ml-2">Choose Your Plan</h1>
      </div>
      {state?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{state.error}</span>
        </div>
      )}
      <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <PricingCard
            key={plan.name}
            name={plan.name}
            price={plan.price}
            interval={plan.interval}
            features={plan.features}
            formAction={formAction}
          />
        ))}
      </div>
    </main>
  );
}

export function PricingCard({
  name,
  price,
  interval,
  features,
  formAction,
  isCurrentPlan = false,
}: {
  name: string;
  price: number;
  interval: string;
  features: string[];
  formAction: (formData: FormData) => void;
  isCurrentPlan?: boolean;
}) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md flex flex-col">
      <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
      <p className="text-4xl font-medium text-gray-900 mb-6">
        ${price}
        <span className="text-xl font-normal text-gray-600">
          /{interval}
        </span>
      </p>
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      {!isCurrentPlan && (
        <form action={formAction}>
          <input type="hidden" name="planName" value={name} />
          <Button type="submit" className="w-full">
            Select Plan
          </Button>
        </form>
      )}
      {isCurrentPlan && (
        <p className="text-center text-green-600 font-semibold">Current Plan</p>
      )}
    </div>
  );
}