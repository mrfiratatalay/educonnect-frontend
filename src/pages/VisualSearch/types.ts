export type SearchMode = "strict" | "discovery";
export type QuerySource = "upload" | "camera" | "example";

export interface QueryImage {
  src: string;
  name: string;
  sizeLabel: string;
  source: QuerySource;
  file?: File;
  presetId?: string;
}

export interface ExampleQuery {
  id: string;
  label: string;
  imageUrl: string;
}

export interface MatchBreakdown {
  label: string;
  value: number;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryLabel: string;
  sellerName: string;
  conditionLabel: string;
  city: string;
  score: number;
  rank: number;
  matchedSignals: string[];
  breakdown: MatchBreakdown[];
}

export interface SearchSession {
  analysis: {
    productName: string;
    categoryLabel: string;
    estimatedPriceRange: string;
    conditionLabel: string;
    confidence: number;
    keywords: string[];
  };
  results: SearchResult[];
  elapsedMs: number;
  candidateCount: number;
  filteredCount: number;
}
