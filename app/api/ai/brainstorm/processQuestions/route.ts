import { NextRequest, NextResponse } from 'next/server';
import { useAI } from '../../switcherAI';

export async function POST(req: NextRequest) {
  const { processName, searchPhrases, questions, finalQuestion } = await req.json();
    const companyNameConstant = "${companyName}"
  const prompt = `As an expert prompt engineer, generate a thought-provoking question for a process named "${processName}". This question should be designed to extract valuable insights about a company's strategic trends, market position, or innovative approaches. The question must include the placeholder '${companyNameConstant}' to be replaced with actual company names later.

Consider the following context:
- Existing search phrases: ${searchPhrases.join(', ')}
- Existing questions: ${questions.join(', ')}
- Final question: ${finalQuestion}

Your task is to create a question that:
1. Complements the existing questions without redundancy
2. Focuses on uncovering unique aspects of ${companyNameConstant}'s business strategy or market approach
3. Is open-ended to encourage detailed responses
4. Can be applied to various companies in different industries

Generate a single, well-crafted question that meets these criteria.`;

  try {
    const response = await useAI(prompt);
    return NextResponse.json({ question: response.trim() });
  } catch (error) {
    console.error('Error in processQuestions:', error);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}