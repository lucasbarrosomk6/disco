import { NextRequest, NextResponse } from "next/server";
import { useAI } from "../switcherAI";

export async function POST(request: NextRequest) {
  // Parse the request body to get the phrases
  const { text } = await request.json();

  // Ensure that 'phrases' is an array of strings
  if (typeof text !== "string") {
    return NextResponse.json(
      { error: "Invalid input. text provided must be string." },
      { status: 400 }
    );
  }
  //   const resultMap: Map<string, SearchResult[]> = new Map();
  const preamble = "Act as a TLDR bot. Summarize the following text:\n";
  const format =
    "Present your findings as json format like so: {summary:string // a summary of what the text is in natural language in 100 words or less} \n only respond in the desried format.";
  const prompt: string = preamble + text + format;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const result = await useAI(prompt);
  console.log(result);
  const finalResult = JSON.parse(result).summary;
  return NextResponse.json({ data: finalResult });
}
