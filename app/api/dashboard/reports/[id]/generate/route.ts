import { NextRequest, NextResponse } from 'next/server';
import { processCompany, processSections } from '@/app/api/runProcess/processCompany';
import { processSearchPhrasesPrompt } from '@/prompts/brainstorm/processSearchPhrases';
import { processQuestionsPrompt } from '@/prompts/brainstorm/processQuestions';

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { companyName, sectionIndex } = await req.json();

    // Hardcoded process for now
    const process = {
        id: 0,
        name: "About the company",
        searchPhrases: ['Comprehensive overview of "${companyName}"',
            'Primary customer demographics of "${companyName}"',
            'How "${companyName}" differentiates itself from competitors',
            'Business model and evolution of "${companyName}"',
            // 'Financial performance and metrics for "${companyName}"',
            // 'Recent news and significant developments about "${companyName}"',
            // 'Which top companies are utilizing "${companyName}"s services?',
            // '"${companyName}" target audience demographics',
            // '"${companyName}" customer behavior analysis',
            // 'Creating a retail customer persona for "${companyName}"',
            // '"${companyName}" shopper motivations and pain points',
            // 'Retail customer persona examples for big box stores like "${companyName}"',
        ],
        questions: ['Who are the primary customers of "${companyName}", and what are their main characteristics?',],
        sections: [
            {
                id: 0,
                title: "Company Overview",
                prompt: "Provide a comprehensive overview of ${companyName}, including its primary customers, business model, and recent developments."
            },
            {
                id: 1,
                title: "Market Position",
                prompt: "Analyze ${companyName}'s market position, including how it differentiates itself from competitors and its financial performance."
            },

        ]
    }

    const stream = new ReadableStream({
        async start(controller) {
            try {
                controller.enqueue('event: status\ndata: Scraping data...\n\n');
                const updateStatus = (status: string) => {
                    controller.enqueue(`event: status\ndata: ${status}\n\n`);
                }

                controller.enqueue('event: status\ndata: Conducting initial research...\n\n');
                const { sections, questionResponses } = await processCompany(companyName, process, updateStatus);


                // Send the full report
                const report = {
                    companyName,
                    processName: process.name,
                    sections,
                    questionResponses
                };
                controller.enqueue(`event: report\ndata: ${JSON.stringify(report)}\n\n`);


                controller.enqueue('event: complete\ndata: Report generation completed.\n\n');
            } catch (error) {
                console.error('Error generating report:', error);
                controller.enqueue(`event: error\ndata: ${error}\n\n`);
            } finally {
                controller.close();
            }
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}