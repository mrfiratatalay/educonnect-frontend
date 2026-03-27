import { mockProducts } from "@/data/mock";
import type { ExampleQuery, QuerySource, SearchSession } from "./types";
import type { VisualSearchApiResponse } from "./api";

const mojibakePattern = /Ã|Ä|Å|â|œ|Ÿ/;

function fixText(value: string) {
  if (!mojibakePattern.test(value)) return value;

  try {
    const bytes = Uint8Array.from(Array.from(value).map((char) => char.charCodeAt(0)));
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return value;
  }
}

export const exampleQueries: ExampleQuery[] = [
  { id: "book", label: "Kitap", imageUrl: mockProducts[0]?.imageUrl ?? "" },
  { id: "calculator", label: "Hesap", imageUrl: mockProducts[1]?.imageUrl ?? "" },
  { id: "maker", label: "Arduino", imageUrl: mockProducts[2]?.imageUrl ?? "" },
  { id: "lamp", label: "Lamba", imageUrl: mockProducts[3]?.imageUrl ?? "" },
];

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("tr-TR").format(price)} TL`;
}

export function getSourceLabel(source: QuerySource) {
  if (source === "camera") return "Kamera";
  if (source === "example") return "Ornek";
  return "Dosya";
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function fetchRemoteFile(url: string, name: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const extension = blob.type.split("/")[1] || "jpg";
  return new File([blob], `${name}.${extension}`, { type: blob.type || "image/jpeg" });
}

export function toSearchSession(response: VisualSearchApiResponse): SearchSession {
  return {
    analysis: {
      productName: fixText(response.analysis.productName),
      categoryLabel: fixText(response.analysis.categoryLabel),
      estimatedPriceRange: fixText(response.analysis.estimatedPriceRange),
      conditionLabel: fixText(response.analysis.conditionLabel),
      confidence: response.analysis.confidence,
      keywords: response.analysis.keywords.map(fixText),
    },
    results: response.results.map((result) => ({
      id: result.productId,
      title: fixText(result.title),
      description: fixText(result.description),
      price: result.price,
      imageUrl: result.imageUrl || "https://placehold.co/800x600?text=No+Image",
      categoryLabel: fixText(result.categoryLabel),
      sellerName: fixText(result.sellerName),
      conditionLabel: fixText(result.conditionLabel),
      city: fixText(result.city),
      score: Math.round(result.similarityScore * 100),
      rank: result.rank,
      matchedSignals: result.matchedSignals.map(fixText),
      breakdown: result.breakdown.map((item) => ({
        label: fixText(item.label),
        value: item.value,
      })),
    })),
    elapsedMs: response.elapsedMs,
    candidateCount: response.candidateCount,
    filteredCount: response.filteredCount,
  };
}
