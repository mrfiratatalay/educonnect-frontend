import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

export interface VisualSearchApiResponse {
  searchId?: string | null;
  analysis: {
    productName: string;
    categoryLabel: string;
    keywords: string[];
    description: string;
    estimatedPriceRange: string;
    conditionLabel: string;
    confidence: number;
  };
  results: Array<{
    productId: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string | null;
    categoryLabel: string;
    sellerName: string;
    conditionLabel: string;
    city: string;
    similarityScore: number;
    rank: number;
    matchedSignals: string[];
    breakdown: Array<{
      label: string;
      value: number;
    }>;
  }>;
  totalFound: number;
  candidateCount: number;
  filteredCount: number;
  elapsedMs: number;
}

export async function runVisualSearch({
  file,
  maxResults,
  mode,
}: {
  file: File;
  maxResults: number;
  mode: "strict" | "discovery";
}) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("maxResults", String(maxResults));
  formData.append("mode", mode);

  const response = await axios.post<VisualSearchApiResponse>(
    `${API_BASE_URL}/api/visualsearch/searches`,
    formData,
  );

  return response.data;
}
