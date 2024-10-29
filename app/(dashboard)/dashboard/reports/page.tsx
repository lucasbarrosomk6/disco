import { Suspense } from 'react';
import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardShell from '@/components/dashboard/dashboard-shell';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { User } from '@/lib/db/schema';
import { ReportList } from '@/components/dashboard/report-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getReports() {
    try {
        const user = await getUser();
        if (!user) {
            return [];
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/reports?userId=${user.id}`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Failed to fetch reports');
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching reports:', error);
        return [];
    }
}

export default async function ReportsPage() {
    const reports = await getReports();
    const user = await getUser()

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Reports"
                text="View and manage your reports here."
            />

            <Suspense fallback={<DashboardSkeleton />}>
                {reports.length > 0 && user ? (
                    <ReportList reports={reports} userId={user.id} />
                ) : (
                    <p>No reports found. Create your first report to get started!</p>
                )}
            </Suspense>
        </DashboardShell>
    );
} 