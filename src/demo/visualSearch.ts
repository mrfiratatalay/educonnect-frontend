/**
 * Port of VisualSearchService's heuristic ranking. The real service asks
 * Gemini to describe the photo and ResNet-50 for an embedding; neither runs in
 * the browser, so the description is guessed from the file name and the
 * ranking uses the "no embedding" branch: the heuristic score alone.
 */
import { normalizeSearch } from "@/demo/shared";
import type { DemoDb, DemoProduct, DemoProductCondition } from "@/demo/types";

interface Analysis {
  productName: string;
  categoryLabel: string;
  keywords: string[];
  description: string;
  estimatedPriceRange: string;
  conditionLabel: string;
  confidence: number;
}

const GUESSES: Array<[RegExp, Omit<Analysis, "description" | "confidence">]> = [
  [/hesap|calc|casio/, { productName: "Bilimsel hesap makinesi", categoryLabel: "Elektronik", keywords: ["hesap makinesi", "casio"], estimatedPriceRange: "700-1000 TL", conditionLabel: "Yeni gibi" }],
  [/kulak|head|phone|airpod/, { productName: "Kablosuz kulaklık", categoryLabel: "Elektronik", keywords: ["kulaklik", "kablosuz"], estimatedPriceRange: "800-1200 TL", conditionLabel: "İyi" }],
  [/arduino|devre|circuit|kart/, { productName: "Elektronik geliştirme seti", categoryLabel: "Elektronik", keywords: ["arduino", "set"], estimatedPriceRange: "500-800 TL", conditionLabel: "Yeni gibi" }],
  [/lamba|lamp/, { productName: "Masa lambası", categoryLabel: "Elektronik", keywords: ["lamba", "led"], estimatedPriceRange: "200-300 TL", conditionLabel: "Yeni gibi" }],
  [/kitap|book|calculus|atlas|not/, { productName: "Ders kitabı", categoryLabel: "Ders Kitapları", keywords: ["kitap", "ders"], estimatedPriceRange: "200-500 TL", conditionLabel: "İyi" }],
  [/bilet|ticket|konser/, { productName: "Konser bileti", categoryLabel: "Etkinlik Biletleri", keywords: ["bilet", "konser"], estimatedPriceRange: "150-300 TL", conditionLabel: "Sıfır" }],
  [/cetvel|pergel|cizim|ruler/, { productName: "Çizim seti", categoryLabel: "Kırtasiye", keywords: ["cizim", "cetvel", "pergel"], estimatedPriceRange: "400-700 TL", conditionLabel: "İyi" }],
  [/bisiklet|bike/, { productName: "Bisiklet", categoryLabel: "Diğer", keywords: ["bisiklet"], estimatedPriceRange: "2500-4000 TL", conditionLabel: "İyi" }],
  [/canta|bag|backpack/, { productName: "Sırt çantası", categoryLabel: "Diğer", keywords: ["canta", "laptop"], estimatedPriceRange: "300-500 TL", conditionLabel: "Yeni gibi" }],
];

const CONDITION_WEIGHT: Record<DemoProductCondition, number> = { new: 1, likeNew: 0.88, good: 0.72, fair: 0.54 };
const CONDITION_LABEL: Record<DemoProductCondition, string> = { new: "Sıfır", likeNew: "Yeni gibi", good: "İyi", fair: "Orta" };

function parseCondition(label: string): DemoProductCondition | null {
  const n = normalizeSearch(label);
  if (n.includes("sifir") || n.includes("yeni")) return n.includes("gibi") ? "likeNew" : "new";
  if (n.includes("iyi")) return "good";
  if (n.includes("orta") || n.includes("eski")) return "fair";
  return null;
}

const tokenize = (value: string) => Array.from(new Set(normalizeSearch(value).split(/\s+/).filter((t) => t.length >= 2)));

function categoryScore(category: string, analysisCategory: string) {
  const wanted = normalizeSearch(analysisCategory);
  if (!wanted || wanted === "diger") return 0.45;
  if (category.includes(wanted)) return 1;
  const pairs: Array<[string, string]> = [["kitap", "kitap"], ["elektronik", "elektronik"], ["kirtasiye", "kirtasiye"], ["etkinlik", "bilet"]];
  return pairs.some(([c, a]) => category.includes(c) && wanted.includes(a)) ? 0.82 : 0.18;
}

function textScore(title: string, description: string, keywords: string[], nameTokens: string[]) {
  const searchable = `${title} ${description}`;
  const keywordScore = keywords.length === 0 ? 0.2 : keywords.filter((k) => searchable.includes(k)).length / keywords.length;
  const nameScore = nameTokens.length === 0 ? 0.2 : nameTokens.filter((t) => title.includes(t)).length / nameTokens.length;
  return Math.min(Math.max(keywordScore * 0.65 + nameScore * 0.35, 0), 1);
}

function conditionScore(condition: DemoProductCondition, label: string) {
  const requested = parseCondition(label) ?? "good";
  const distance = Math.abs(CONDITION_WEIGHT[condition] - CONDITION_WEIGHT[requested]);
  return Math.min(Math.max(1 - distance / 0.5, 0.2), 1);
}

function priceScore(price: number, target: number | null) {
  if (!target || target <= 0) return 0.55;
  return Math.min(Math.max(1 - Math.abs(price - target) / target, 0.15), 1);
}

function estimatedPrice(range: string) {
  const numbers = (range.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => Number(n.replace(",", ".")));
  return numbers.length ? numbers.reduce((a, b) => a + b, 0) / numbers.length : null;
}

export function rankForVisualSearch(db: DemoDb, candidates: DemoProduct[], fileName: string, mode: "strict" | "discovery", maxResults: number) {
  const guess = GUESSES.find(([pattern]) => pattern.test(normalizeSearch(fileName)))?.[1];
  const base = guess ?? { productName: "Görseldeki ürün", categoryLabel: "Diğer", keywords: [], estimatedPriceRange: "Belirsiz", conditionLabel: "İyi" };
  const description = guess
    ? "Demo modu: ürün dosya adından tahmin edildi. Gerçek sistemde görseli Gemini analiz eder, ResNet-50 benzerliği de puana eklenir."
    : "Demo modunda görsel analiz yapılmaz; sonuçlar gerçek sistemdeki sezgisel puanlamayla sıralandı. Dosya adında ürün adı geçerse (ör. hesap-makinesi.jpg) tahmin isabetli olur.";

  const keywords = Array.from(new Set([...tokenize(base.productName), ...base.keywords.map(normalizeSearch)])).filter((k) => k.length >= 2).slice(0, 8);
  const nameTokens = tokenize(base.productName);
  const target = estimatedPrice(base.estimatedPriceRange);

  const scored = candidates.map((product) => {
    const title = normalizeSearch(product.title);
    const desc = normalizeSearch(product.description);
    const category = normalizeSearch(db.categories.find((c) => c.id === product.categoryId)?.name ?? "");
    const parts = {
      category: categoryScore(category, base.categoryLabel),
      text: textScore(title, desc, keywords, nameTokens),
      condition: conditionScore(product.condition, base.conditionLabel),
      price: priceScore(product.price, target),
    };
    const score = parts.text * 0.4 + parts.category * 0.3 + parts.condition * 0.15 + parts.price * 0.15;
    const matchedKeyword = keywords.find((k) => title.includes(k) || desc.includes(k));
    const signals = [parts.category >= 0.7 ? "Kategori" : null, matchedKeyword ? matchedKeyword.replace(/^./, (c) => c.toLocaleUpperCase("tr-TR")) : null].filter(Boolean) as string[];
    return { product, score, parts, signals: signals.length ? signals : ["Benzer ürün"] };
  }).sort((a, b) => b.score - a.score);

  const threshold = mode === "discovery" ? 0.32 : 0.42;
  let shortlisted = scored.filter((r) => r.score >= threshold && (mode === "discovery" || r.parts.text >= 0.08)).slice(0, maxResults);
  if (shortlisted.length === 0 && mode === "discovery") shortlisted = scored.slice(0, maxResults);

  const results = shortlisted.map((r, i) => ({
    productId: r.product.id,
    title: r.product.title,
    description: r.product.description,
    price: r.product.price,
    imageUrl: r.product.imageUrls[0] ?? null,
    categoryLabel: db.categories.find((c) => c.id === r.product.categoryId)?.name ?? "Diğer",
    sellerName: db.users.find((u) => u.id === r.product.sellerId)?.fullName ?? "",
    condition: r.product.condition,
    conditionLabel: CONDITION_LABEL[r.product.condition],
    city: r.product.city,
    similarityScore: Math.round(r.score * 10_000) / 10_000,
    rank: i + 1,
    matchedSignals: r.signals.slice(0, 3),
    breakdown: [
      { label: "Kategori", value: Math.round(r.parts.category * 100) },
      { label: "Metin", value: Math.round(r.parts.text * 100) },
      { label: "Durum", value: Math.round(r.parts.condition * 100) },
      { label: "Fiyat", value: Math.round(r.parts.price * 100) },
    ],
  }));

  let confidence = 55;
  if (base.categoryLabel !== "Diğer") confidence += 10;
  confidence += Math.min(base.keywords.length * 4, 16);
  if (results.length) confidence += Math.round((results.slice(0, 3).reduce((s, r) => s + r.similarityScore, 0) / Math.min(results.length, 3)) * 20);

  const analysis: Analysis = { ...base, description, confidence: Math.min(Math.max(confidence, 55), 96) };
  return { analysis, results };
}
