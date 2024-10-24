import { NextRequest, NextResponse } from 'next/server';
import { Ollama } from '@langchain/community/llms/ollama';
import { PromptTemplate } from '@langchain/core/prompts';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const model = new Ollama({
      baseUrl: "http://localhost:11434", // Adjust this if your Ollama instance is running elsewhere
      model: "llama3.1", // Adjust this to the model you want to use
    });

    const promptTemplate = PromptTemplate.fromTemplate(
      "You are a helpful AI assistant. Answer the following question: {question}"
    );

    const formattedPrompt = await promptTemplate.format({ question: prompt });
    const response = await model.call(formattedPrompt);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
}
