"use client"

import DashboardHeader from '@/components/dashboard/dashboard-header'
import DashboardShell from '@/components/dashboard/dashboard-shell'
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton'
import DynamicGridPage from '@/components/dashboard/dynamic-grid-page'
import { Report } from '@/lib/db/schema'
import { useEffect, useState } from 'react'

export default function ReportPage({ params }: { params: { id: string } }) {
    const [report, setReport] = useState<Report | null>(null)

    useEffect(() => {
        if (!report?.company) {
            const fetchReport = async () => {
                const res = await fetch(`/api/dashboard/reports/${params.id}`)
                const data = await res.json()
                setReport(data)
            }
            fetchReport()
        }
    }, [])
    return (<DashboardShell>

        {report ? (<>
            <DashboardHeader
                heading={report.company + " - " + report.productName}
                text="Here are the results of the discovery process for this company."
            />

            <DynamicGridPage report={report} />
        </>
        ) : (
            <p>Ooops, something went wrong</p>
        )}

    </DashboardShell>)

}