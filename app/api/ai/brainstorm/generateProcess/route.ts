import { NextRequest, NextResponse } from 'next/server';
import { useAI } from '../../switcherAI';

export async function POST(req: NextRequest) {
  const { processName } = await req.json();
  const companyNameConstant = "${companyName}"

  const prompt = `As an expert prompt engineer, generate a complete process for analyzing a company's strategic trends, market position, and innovative approaches. The process is named "${processName}". Create search phrases, questions, and sections that will yield comprehensive insights about a company.

Your task is to create:

1. 3-5 search phrases that:
   - Include the placeholder '${companyNameConstant}' to be replaced with actual company names later
   - Are likely to yield results about ${companyNameConstant}'s unique business strategies or market approaches
   - Are specific enough to filter out irrelevant information but broad enough to capture various aspects of the company's operations
   - Can be effectively used across different industries

2. 3-5 questions that:
   - Include the placeholder '${companyNameConstant}' to be replaced with actual company names later
   - Focus on uncovering unique aspects of ${companyNameConstant}'s business strategy or market approach
   - Are open-ended to encourage detailed responses
   - Can be applied to various companies in different industries

3. 3-5 sections, each containing:
   - A title that summarizes the section's focus
   - A prompt that guides the AI in generating content for that section
   - Ensure that these sections cover different aspects of the company's strategy, market position, and innovation

Respond in JSON format as follows:
{
  "searchPhrases": ["phrase1", "phrase2", ...],
  "questions": ["question1", "question2", ...],
  "sections": [
    {
      "title": "Section Title 1",
      "prompt": "Detailed prompt for section 1"
    },
    {
      "title": "Section Title 2",
      "prompt": "Detailed prompt for section 2"
    },
    ...
  ]
}

Ensure that all elements are well-crafted and aligned with the process name "${processName}".`;

  try {
    const response = await useAI(prompt);
    const data = JSON.parse(response);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in generateProcess:', error);
    return NextResponse.json({ error: 'Failed to generate process' }, { status: 500 });
  }
}