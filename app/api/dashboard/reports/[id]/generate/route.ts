import { NextRequest, NextResponse } from 'next/server';
import { processCompany } from '@/app/api/runProcess/processCompany';

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { companyName } = await req.json();

    // Hardcoded process for now
    const process = {
        name: `Report for ${companyName}`,
        searchPhrases: [
            '${companyName} overview',
            '${companyName} company information',
            // Add more search phrases
        ],
        questions: [
            'What does ${companyName} do?',
            'What industry does ${companyName} operate in?',
            // Add more questions
        ],
        sections: [
            {
                title: 'About the Company',
                prompt: 'Please provide a paragraph suitable for a report section labled "about the company" for ${companyName}.',
            },
        ],
    };

    try {
        const { sections, questionResponses } = await processCompany(companyName, process);
        return NextResponse.json({ sections, questionResponses });
    } catch (error) {
        console.error('Error generating report:', error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}