"use client"

import { Report } from '@/lib/db/schema'
import { useEffect, useRef, useState } from 'react'
import { DynamicGridPage } from './dynamic-grid-page'
import { Card, CardContent } from '../ui/card'
import { RefreshCw } from 'lucide-react'

interface ReportContentProps {
    report: Report
}

export function ReportContent({ report }: ReportContentProps) {
    const [generatingReport, setGeneratingReport] = useState(false);
    const [sections, setSections] = useState(report.sections);
    const generateLock = useRef(false);
    const [status, setStatus] = useState('');

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

            if (!response.body) throw new Error('No response body available for streaming');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            const sectionsAccumulator: any[] = [];

            const processStream = async ({ done, value }: any): Promise<void> => {
                if (done) {
                    console.log("sectionsAccumulator", sectionsAccumulator)
                    // Save the final state
                    if (sectionsAccumulator.length > 0) {
                        await fetch(`/api/dashboard/reports/${report.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ ...report, sections: sectionsAccumulator }),
                        });
                    }
                    setGeneratingReport(false);
                    generateLock.current = false;
                    return;
                }

                const chunk = decoder.decode(value, { stream: true });
                console.log("chunk", chunk)

                // Split chunk into lines and process each event
                const lines = chunk.split('\n');
                let currentEvent = '';
                let currentData = '';

                for (const line of lines) {
                    if (!line?.trim()) continue;

                    if (line.startsWith('event:')) {
                        // If we have a complete event-data pair, process it
                        if (currentEvent && currentData) {
                            processEventData(currentEvent, currentData);
                        }
                        // Start new event
                        currentEvent = line.replace('event:', '')?.trim();
                        currentData = '';
                    } else if (line.startsWith('data:')) {
                        currentData = line.replace('data:', '')?.trim();
                        // Process immediately if we have both event and data
                        if (currentEvent && currentData) {
                            processEventData(currentEvent, currentData);
                            currentEvent = '';
                            currentData = '';
                        }
                    }
                }

                // Process any remaining event-data pair
                if (currentEvent && currentData) {
                    processEventData(currentEvent, currentData);
                }

                // Continue reading the stream
                return reader.read().then(processStream);
            };

            const processEventData = (eventType: string, data: string) => {
                console.log("eventType", eventType)

                switch (eventType) {
                    case 'status':
                        if (data) {
                            setStatus(data);
                        }
                        break;

                    case 'report':
                        if (data) {
                            try {
                                console.log("report data", data)
                                const reportData = JSON.parse(data);
                                // Validate that reportData.sections is an array
                                if (Array.isArray(reportData.sections)) {
                                    // Update sections with the full report data
                                    sectionsAccumulator.push(...reportData.sections);
                                    setSections(reportData.sections);
                                } else {
                                    console.error('reportData.sections is not an array:', reportData.sections);
                                }
                            } catch (e) {
                                console.error('Error parsing report data:', e);
                            }
                        }
                        break;

                    case 'section':
                        if (data) {
                            try {
                                const section = JSON.parse(data);
                                const sectionToAdd = Array.isArray(section) ? section[0] : section;
                                sectionsAccumulator.push(sectionToAdd);
                                setSections(sections => {
                                    const newSection = Array.isArray(section) ? section[0] : section;
                                    return [...sections, newSection];
                                });
                            } catch (e) {
                                console.error('Error parsing section data:', e);
                            }
                        }
                        break;

                    case 'complete':
                        setGeneratingReport(false);
                        generateLock.current = false;
                        break;
                }
            }

            await reader.read().then(processStream);
        } catch (error) {
            console.error('Error generating report:', error);
            setGeneratingReport(false);
            generateLock.current = false;
        }
    };
    const redoSection = async (sectionIndex: number) => {
        if (generateLock.current) return;
        generateLock.current = true;
        setGeneratingReport(true);

        try {
            const response = await fetch(`/api/dashboard/reports/${report.id}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ companyName: report.company, sectionIndex }),
            });

            if (!response.body) throw new Error('No response body available for streaming');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let updatedSections = [...sections];

            const processStream = async ({ done, value }: any): Promise<void> => {
                if (done) {
                    // Save the final state
                    await fetch(`/api/dashboard/reports/${report.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ...report, sections: updatedSections }),
                    });
                    setGeneratingReport(false);
                    generateLock.current = false;
                    return;
                }

                const chunk = decoder.decode(value, { stream: true });

                // Split chunk into lines and process each event
                const lines = chunk.split('\n');
                let currentEvent = '';
                let currentData = '';

                for (const line of lines) {
                    if (!line?.trim()) continue;

                    if (line.startsWith('event:')) {
                        if (currentEvent && currentData) {
                            processEventData(currentEvent, currentData);
                        }
                        currentEvent = line.replace('event:', '')?.trim();
                        currentData = '';
                    } else if (line.startsWith('data:')) {
                        currentData = line.replace('data:', '')?.trim();
                        if (currentEvent && currentData) {
                            processEventData(currentEvent, currentData);
                            currentEvent = '';
                            currentData = '';
                        }
                    }
                }

                if (currentEvent && currentData) {
                    processEventData(currentEvent, currentData);
                }

                return reader.read().then(processStream);
            };

            const processEventData = (eventType: string, data: string) => {
                switch (eventType) {
                    case 'status':
                        if (data) {
                            setStatus(data);
                        }
                        break;

                    case 'section':
                        if (data) {
                            try {
                                const section = JSON.parse(data);
                                const sectionToUpdate = Array.isArray(section) ? section[0] : section;
                                updatedSections[sectionIndex] = sectionToUpdate;
                                setSections(updatedSections);
                            } catch (e) {
                                console.error('Error parsing section data:', e);
                            }
                        }
                        break;

                    case 'complete':
                        setGeneratingReport(false);
                        generateLock.current = false;
                        break;
                }
            };

            await reader.read().then(processStream);
        } catch (error) {
            console.error('Error regenerating section:', error);
            setGeneratingReport(false);
            generateLock.current = false;
        }
    };
    // Rest of the component remains the same...

    if (sections.length === 0 && generatingReport) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="flex items-center justify-center p-12 pb-1">
                            <RefreshCw className="w-12 h-12 animate-spin-pulse" />
                        </div>
                        <p className="text-muted-foreground">{status}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <DynamicGridPage
            report={{ ...report, sections }}
            generatingReport={generatingReport}
            redoSection={redoSection}
            status={status}
        />
    );
}