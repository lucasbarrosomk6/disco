// app/api/hello/route.js
import { NextRequest, NextResponse } from "next/server";
import { fetchFullTextsConcurrently, scrapeConcurrently } from "./scrapeUtils";
import { convertToSearchResultMap } from "./typeConversion";

// GET request handler
export async function GET(request: NextRequest) {
  console.log(request);
  return NextResponse.json({ message: "Hello, World!" });
}

// POST request handler (optional)
export async function POST(request: NextRequest) {
  // Parse the request body to get the phrases
  const { phrases } = await request.json();

  // Ensure that 'phrases' is an array of strings
  if (!Array.isArray(phrases) || !phrases.every((p) => typeof p === "string")) {
    return NextResponse.json(
      { error: "Invalid input. Expected an array of strings." },
      { status: 400 }
    );
  }
  //   const resultMap: Map<string, SearchResult[]> = new Map();
  const googleResults = await scrapeConcurrently(phrases);
  const results = await fetchFullTextsConcurrently(googleResults);

  const resultsObj = Object.fromEntries(convertToSearchResultMap(results));
  console.log(resultsObj);
  return NextResponse.json({ data: resultsObj });
}
