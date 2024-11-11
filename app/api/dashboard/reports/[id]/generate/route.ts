import { NextRequest, NextResponse } from 'next/server';
import { processCompany, processSections } from '@/app/api/runProcess/processCompany';
import { processSearchPhrasesPrompt } from '@/prompts/brainstorm/processSearchPhrases';
import { processQuestionsPrompt } from '@/prompts/brainstorm/processQuestions';
import { Process } from '@/app/store/discoAITypes';

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { companyName, sectionIndex } = await req.json();

    // Hardcoded process for now
    const process: Process = {
        id: 0,
        name: "About the company",
        searchPhrases: ['${companyName} company overview history background',
            '${companyName} target market customer demographics data',
            '${companyName} competitive advantage unique selling proposition',
            '${companyName} business model revenue strategy growth',
            '${companyName} latest news updates developments 2024',

        ],

        sections: [
            {
                id: 0,
                title: "Company Overview",
                prompt: "Create a comprehensive overview of ${companyName} using the following structure:\n\n# Core Business\n- Main products/services\n- Target industries\n- Geographic presence\n\n# Customer Analysis\n| Segment | Description | Key Needs |\n|---------|-------------|------------|\n| Primary | [details] | [needs] |\n| Secondary | [details] | [needs] |\n\n# Revenue Model\n> Key revenue streams and business model overview\n\n## Pricing Strategy\n- Product/Service pricing\n- Subscription/Usage models\n\n# Recent Updates\n1. Latest developments\n2. Strategic initiatives\n3. Market expansions\n\n*Include specific metrics and data points where available*",
                questions: [
                    'What are ${companyName}\'s main products/services, target industries, and geographic presence?',
                    'Who are ${companyName}\'s primary and secondary customer segments, and what are their key characteristics and needs?',
                    'What are ${companyName}\'s key revenue streams, business model, and pricing strategies?',
                    'What are ${companyName}\'s most recent developments, strategic initiatives and market expansions in the past year?'
                ],
            },
            {
                id: 1,
                title: "Market Position",
                prompt: "Analyze ${companyName}'s market position using the following structure:\n\n# Market Overview\n- Industry size and growth\n- Key market trends\n- Competitive landscape\n\n# Competitive Analysis\n| Competitor | Market Share | Key Strengths | Key Weaknesses |\n|------------|--------------|---------------|----------------|\n| ${companyName} | [share %] | [strengths] | [weaknesses] |\n| Competitor 1 | [share %] | [strengths] | [weaknesses] |\n\n# Differentiation Strategy\n> Core competitive advantages and unique value proposition\n\n## Key Differentiators\n- Product/Service advantages\n- Technology/Innovation edge\n- Brand positioning\n\n# Financial Performance\n1. Revenue trends\n2. Profitability metrics\n3. Growth indicators\n\n*Include market data and financial metrics where available*",
                questions: [
                    'What is the current state of ${companyName}\'s market, including size, growth trends, and competitive landscape?',
                    'How does ${companyName} compare to its main competitors in terms of market share, strengths, and weaknesses?',
                    'What are ${companyName}\'s key differentiators and unique value propositions in the market?',
                    'What are the key financial performance indicators and trends for ${companyName}?'
                ],
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
                const { sections } = await processCompany(companyName, process, updateStatus);


                // Send the full report
                const report = {
                    companyName,
                    processName: process.name,
                    sections,
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