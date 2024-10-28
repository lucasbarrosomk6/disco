export interface SearchResult {
  website: string;
  title: string;
  snippet: string;
}

export interface Source {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content: string;
  id: number;
}

export interface strategicTrendWithSource {
  strategicTrend: string;
  explanation: string;
  sources: Source[];
  productSuggestions?: productSuggestion[];
  kpisImpacted: string[];
  id?: number;
}

export interface productSuggestion {
  id: number;
  productTitle: string;
  reasoning: string[];
}
