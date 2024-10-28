import { SearchResult } from "./types";

type InputMapType = Map<
  string,
  { text: string; url: string; title?: string }[]
>;

export const convertToSearchResultMap = (
  inputMap: InputMapType
): Map<string, SearchResult[]> => {
  const resultMap = new Map<string, SearchResult[]>();

  // Iterate over the input map
  inputMap.forEach((valueArray, key) => {
    // Convert each array of { text, url } to SearchResult[]
    const searchResults: SearchResult[] = valueArray.map((item) => ({
      title: item.title || "No title",
      website: item.url,
      snippet: item.text, // You can replace this with actual content generation logic
    }));

    // Set the converted array in the result map
    resultMap.set(key, searchResults);
  });

  return resultMap;
};
