import { NextRequest, NextResponse } from 'next/server';
import { useAI } from '../../switcherAI';

export async function POST(req: NextRequest) {
  const { processName, searchPhrases, questions, finalQuestion } = await req.json();
  const companyNameConstant = "${companyName}"

  const prompt = `As an expert prompt engineer, generate a strategic search phrase for a process named "${processName}". This search phrase should be designed to find relevant information about a company's strategic trends, market position, or innovative approaches. The phrase must include the placeholder '${companyNameConstant}' to be replaced with actual company names later.

Consider the following context:
- Existing search phrases: ${searchPhrases.join(', ')}
- Existing questions: ${questions.join(', ')}
- Final question: ${finalQuestion}

Your task is to create a search phrase that:
1. Complements the existing search phrases without redundancy
2. Is likely to yield results about ${companyNameConstant}'s unique business strategies or market approaches
3. Is specific enough to filter out irrelevant information but broad enough to capture various aspects of the company's operations

4. Can be effectively used across different industries

here are some more pieces of advice
Use Specific Keywords – Focus on relevant terms for your topic.
Quotation Marks – Search for exact phrases.
Boolean Operators – Use AND, OR, and NOT to refine results.
Minus Symbol (-) – Exclude unwanted words from results.
Asterisks (*) – Use as a wildcard for variable terms.
site: – Limit searches to specific websites.
Date Range – Filter results by time for recent data.
intitle: / inurl: – Search specific words in titles or URLs.

and most importantly, keep it simple and concise.
respond in json like so:
{
  "searchPhrase": "search phrase"
}
Generate a single, well-crafted search phrase that meets these criteria.`;

  try {
    const response = await useAI(prompt);
    const data = JSON.parse(response);

    return NextResponse.json({ searchPhrase: data.searchPhrase });
  } catch (error) {
    console.error('Error in processSearchPhrases:', error);
    return NextResponse.json({ error: 'Failed to generate search phrase' }, { status: 500 });
  }
}