import { Suspense } from 'react';
import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardShell from '@/components/dashboard/dashboard-shell';
import DashboardOverview from '@/components/dashboard/dashboard-overview';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  console.log("dashboard")
  const user = await getUser();
;
  if (!user) {
    console.log('No user');
    redirect('/sign-in');
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome back! Here's an overview of your account."
      />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardOverview userId={user.id} />
      </Suspense>
    </DashboardShell>
  );
}
