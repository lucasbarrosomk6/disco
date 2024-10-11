'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { use } from 'react';
import { Team } from '@/lib/db/schema';

export interface PlanInfo {
  name: string;
  price: number;
  interval: string;
  features: string[];
}

type PlanContextType = {
  plan: PlanInfo | null;
  setPlan: (plan: PlanInfo | null) => void;
};

const PlanContext = createContext<PlanContextType | null>(null);

export function usePlan(): PlanContextType {
  let context = useContext(PlanContext);
  if (context === null) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}

export function PlanProvider({
  children,
  planPromise,
}: {
  children: ReactNode;
  planPromise: Promise<PlanInfo | null>;
}) {
  let initialPlan = use(planPromise);
  let [plan, setPlan] = useState<PlanInfo | null>(initialPlan);

  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

  return (
    <PlanContext.Provider value={{ plan, setPlan }}>
      {children}
    </PlanContext.Provider>
  );
}