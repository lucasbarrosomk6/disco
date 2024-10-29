"use client"

import DashboardHeader from '@/components/dashboard/dashboard-header'
import { ReportContent } from '@/components/dashboard/report-content'

import { Loading } from '@/components/ui/loading'
import { Report } from '@/lib/db/schema'
import { useEffect, useState } from 'react'

export default function ReportPage({ params }: { params: { id: string } }) {
    const reportId = parseInt(params.id);
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReport() {
            try {
                const response = await fetch(`/api/dashboard/reports/${reportId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch report');
                }
                const data = await response.json();
                setReport(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching report:', error);
                setError('Failed to fetch report');
                setLoading(false);
            }
        }

        fetchReport();
    }, [reportId]);

    if (loading) {
        return (
            <>
                <DashboardHeader
                    heading="Loading Report..."
                    text="Please wait while we fetch the report details."
                />
                <Loading />
            </>
        );
    }

    if (error || !report) {
        return (
            <>
                <DashboardHeader
                    heading="Error Loading Report"
                    text={error || "Report not found"}
                />
                <p className="text-center text-red-600">{error}</p>
            </>
        );
    }

    return (
        <>
            <DashboardHeader
                heading={`${report.company} - ${report.productName}`}
                text="View your report details below"
            />
            <ReportContent report={report} />
        </>
    );
}