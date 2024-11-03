import { NextRequest, NextResponse } from 'next/server';
import { processCompany, processSections } from '@/app/api/runProcess/processCompany';

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
        questions: ['Who are the primary customers of "${companyName}", and what are their main characteristics?',
            // 'How does "${companyName}" differentiate itself from its main competitors in the market?',
            // 'What is the current business model of "${companyName}", and how has it evolved over recent years?',
            // 'What are the latest financial performance metrics of "${companyName}", including revenue, profit margins, and market share?',
            // 'What are some significant recent developments or news about "${companyName}"?',
            // 'Which top companies are utilizing "${companyName}"s services?',

            // 'What are the primary demographics of "${companyName}" customers (age, income, location)?',
            // 'What are the shopping habits and frequency of "${companyName}" customers?',
            // 'What challenges or pain points do "${companyName}" customers experience in retail?',
            // 'What motivates "${companyName}" customers to choose "${companyName}" over other retailers?',
            // 'How do "${companyName}" customers prefer to engage with the store (in-person, online, mobile app)?',
        ],
        sections: [
            {
                title: "Company Overview",
                prompt: "Provide a comprehensive overview of ${companyName}, including its primary customers, business model, and recent developments."
            },
            {
                title: "Market Position",
                prompt: "Analyze ${companyName}'s market position, including how it differentiates itself from competitors and its financial performance."
            },
            // {
            //     title: "Customer Analysis",
            //     prompt: "Describe ${companyName}'s target audience, their demographics, shopping habits, and preferences."
            // }
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

                controller.enqueue(`event: section\ndata: ${JSON.stringify(sections)}\n\n`);
                // controller.enqueue('event: status\ndata: Generating report sections...z\n\n');
                // if (sectionIndex !== undefined) {
                //     const sectionContent = await processSections([process.sections[sectionIndex]], questionResponses, updateStatus);
                //     controller.enqueue(`event: section\ndata: ${JSON.stringify(sectionContent)}\n\n`);
                // } else {
                //     for (const section of sections) {
                //         controller.enqueue(`event: section\ndata: ${JSON.stringify(section)}\n\n`);
                //     }
                // }

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