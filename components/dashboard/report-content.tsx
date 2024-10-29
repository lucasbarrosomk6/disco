"use client"

import { Report } from '@/lib/db/schema'
import { useEffect, useRef, useState } from 'react'
import { DynamicGridPage } from './dynamic-grid-page'
import { Card, CardContent } from '../ui/card'
import { Loading } from '../ui/loading'

interface ReportContentProps {
    report: Report
}

export function ReportContent({ report }: ReportContentProps) {
    const [generatingReport, setGeneratingReport] = useState(false);
    const [sections, setSections] = useState(report.sections);
    const generateLock = useRef(false);

    useEffect(() => {
        if (sections.length === 0 && !generateLock.current) {
            generateReport();
        }
    }, [sections]);

    const generateReport = async () => {
        if (generateLock.current) return;
        generateLock.current = true;
        setGeneratingReport(true);

        try {
            const response = await fetch(`/api/dashboard/reports/${report.id}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ companyName: report.company }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            const data = await response.json();
            //update the report with the new sections
            const updatedReport = { ...report, sections: data.sections };
            const updateResponse = await fetch(`/api/dashboard/reports/${report.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedReport),
            });
            setSections(data.sections);
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setGeneratingReport(false);
        }
    };

    if (sections.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center space-y-4">

                        <p className="text-muted-foreground">
                            Generating report for {report.company}...
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <DynamicGridPage
            report={{ ...report, sections }}
            generatingReport={generatingReport}
        />
    );
}