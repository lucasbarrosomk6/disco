'use client';

import React from 'react';
import { usePlan } from '@/lib/plan';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/app/icon.svg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function WelcomePage() {
  const { plan } = usePlan();

  if (!plan) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-center mb-8">
        <Image
          src={Icon}
          alt="disco.ai logo"
          width={48}
          height={48}
          className="h-12 w-12"
        />
        <h1 className="text-3xl font-bold ml-2">Welcome to Disco.ai!</h1>
      </div>

      <div className="text-center mb-8">
        <p className="text-xl">Thank you for joining us. Let's get you started!</p>
      </div>

      <div className="flex justify-center space-x-4 mb-12">
        <Link href="/dashboard/products/add">
          <Button className="text-lg px-6 py-3">Get Started</Button>
        </Link>
        <Link href="/dashboard/team">
          <Button variant="outline" className="text-lg px-6 py-3">Manage Team</Button>
        </Link>
      </div>

      <Card className="w-full max-w-xs
       mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">{plan.name} Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}