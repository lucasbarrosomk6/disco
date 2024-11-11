"use client"

import remarkGfm from 'remark-gfm'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Report } from '@/lib/db/schema'
import ReactMarkdown, { Components } from 'react-markdown'
import { Button } from '../ui/button'
import { RefreshCw } from 'lucide-react'
import { markdownComponents } from '@/app/(dashboard)/dashboard/reports/[id]/utils'


interface DynamicGridPageProps {
    report: Report
    generatingReport: boolean
    redoSection: (sectionIndex: number) => Promise<void>
    status: string
}


export function DynamicGridPage({ report, generatingReport, redoSection, status }: DynamicGridPageProps) {
    console.log(report)


    const markdownContent = "# Heading One \n## Heading Two\n\nRegular paragraph text."

    return (
        <div className="grid grid-cols-1 gap-4">
            {report.sections.map((section, index) => {
                if (typeof section === 'string') {
                    return null
                }

                return (
                    <Card key={index} className="relative max-w-3xl">
                        <Button
                            onClick={() => redoSection(index)}
                            disabled={generatingReport}
                            variant="ghost"
                            className="absolute top-2 right-2"
                        >
                            {generatingReport ? <RefreshCw className="w-12 h-12 animate-spin" /> : <RefreshCw className="w-12 h-12" />}
                        </Button>

                        <CardContent className="pt-0">
                            {generatingReport ? <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="flex items-center justify-center p-12 pb-1">
                                    <RefreshCw className="w-12 h-12 animate-spin-pulse" />
                                </div>
                                <p className="text-muted-foreground">{status}</p>
                            </div> : <div className="prose prose-lg mx-auto my-8">
                                <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                                    {section.content}
                                </ReactMarkdown></div>
                            }
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}