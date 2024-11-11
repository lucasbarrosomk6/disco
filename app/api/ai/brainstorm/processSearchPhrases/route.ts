import { NextRequest, NextResponse } from 'next/server';
import { useAI } from '../../switcherAI';
import { processSearchPhrasesPrompt } from '@/prompts/brainstorm/processSearchPhrases';

export async function POST(req: NextRequest) {
  const { processName, searchPhrases, questions, finalQuestion, companyName } = await req.json();

  const prompt = processSearchPhrasesPrompt(companyName);

  try {
    const response = await useAI(prompt);
    const data = JSON.parse(response);

    return NextResponse.json({ searchPhrase: data.searchPhrase });
  } catch (error) {
    console.error('Error in processSearchPhrases:', error);
    return NextResponse.json({ error: 'Failed to generate search phrase' }, { status: 500 });
  }
}