"use client"

import { Section } from '@/app/store/discoAITypes'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Report } from '@/lib/db/schema'
import ReactMarkdown from 'react-markdown'

interface DynamicGridPageProps {
    report: Report
    generatingReport: boolean
}

export function DynamicGridPage({ report, generatingReport }: DynamicGridPageProps) {
    const formatSections = (sections: string[]): Section[] | string[] => {
        try {
            return sections.map((section: string) => JSON.parse(section))
        } catch (error) {
            return sections
        }
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {formatSections(report.sections).map((section, index) => {
                if (typeof section === 'string') {
                    return null
                }
                return (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{section.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-slate max-w-none dark:prose-invert">
                                <ReactMarkdown>{section.content}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}