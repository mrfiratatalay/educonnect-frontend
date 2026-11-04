/**
 * Browser port of EduAI's offline path: the keyword intent classifier and the
 * knowledge-base lookup from nlp-service, plus ChatbotService's local answer
 * (the one the API returns when Gemini is unavailable). BERTurk and Gemini do
 * not run here. Data files are copies of nlp-service/data.
 */
import { normalizeSearch } from "@/demo/shared";

interface KbEntry {
  id: string;
  intent: string;
  topic: string;
  question: string;
  answer: string;
  keywords: string[];
  source_url?: string;
  confidence: "high" | "medium";
  time_sensitive: boolean;
}

interface Alias {
  alias: string;
  value: string;
  type: string;
}

interface Entity {
  value: string;
  type: string;
}

let dataPromise: Promise<{ kb: KbEntry[]; aliases: Alias[] }> | null = null;

/** Loaded on the first question so the 240 KB knowledge base stays out of the initial bundle. */
function loadData() {
  dataPromise ??= Promise.all([import("./knowledge-base.json"), import("./entity-aliases.json")]).then(([kb, aliases]) => ({
    kb: kb.default as KbEntry[],
    aliases: [...(aliases.default as Alias[])].sort((a, b) => b.alias.length - a.alias.length),
  }));
  return dataPromise;
}

const FOLD: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };
/** Length-preserving fold, so entity offsets still point into the original text. */
const fold = (value: string) => value.toLocaleLowerCase("tr-TR").replace(/[çğıöşü]/g, (c) => FOLD[c]);

const KEYWORDS: Array<[string, string[], number]> = [
  ["exam_and_grading", ["vize", "final", "sinav", "butunleme", "not", "ortalama", "tek ders", "mazeret", "gano", "yano", "harf notu"], 0.82],
  ["course_registration", ["ders", "kredi", "program", "kayit", "mufredat", "danisman onayi", "ekleme", "muafiyet", "intibak", "yatay gecis", "cift anadal", "yandal", "katki payi", "cap"], 0.8],
  ["digital_systems", ["portal", "sifre", "sistem", "obs", "giris yapamiyorum", "e-posta", "eposta", "mail", "rebis", "office 365", "vpn", "wifi", "eduroam", "rteu.net", "e-kampus"], 0.8],
  ["student_services", ["ogrenci belgesi", "transkript", "not dokum", "diploma", "diploma eki", "ilisik kesme", "mezuniyet belgesi", "ogrenci isleri", "hangi birim", "nereye basvur", "gecici mezuniyet", "asli gibidir", "kayit sildirme"], 0.78],
  ["library", ["kutuphane", "kitap", "odunc", "calisma salonu", "veritabani", "vetis", "proxy", "ithenticate", "gecikme cezasi", "grup calisma", "uzaktan erisim"], 0.81],
  ["student_life", ["etkinlik", "konser", "seminer", "konferans", "festival", "senlik", "kulup", "topluluk", "spor", "kariyer", "staj duyurusu", "yemekhane", "menu", "rezervasyon", "bakiye", "barinma", "yurt", "ulasim", "ring", "yerleske", "psikolojik destek", "psikolojik danismanlik", "odk", "ogrenci destek", "engelli ogrenci", "engelsiz universite", "rpduam"], 0.79],
  ["scholarship_support", ["burs", "mali destek", "kredi ve yurtlar", "kyk", "yemek bursu", "kismi zamanli", "tev"], 0.83],
];

/** Port of IntentService._classify_keyword (first best label wins, like Python's max). */
function classify(text: string) {
  const t = fold(text.trim());
  if (["cap", "cift anadal", "yandal"].some((k) => t.includes(k))) return { intent: "course_registration", confidence: 0.84 };
  if (["kayit sildirme", "ilisik kesme"].some((k) => t.includes(k))) return { intent: "student_services", confidence: 0.84 };
  if (["engelli ogrenci", "psikolojik danismanlik", "rpduam"].some((k) => t.includes(k))) return { intent: "student_life", confidence: 0.82 };
  let best: [string, number, number] = ["student_services", 0, 0.35];
  for (const [label, keywords, confidence] of KEYWORDS) {
    const hits = keywords.filter((k) => t.includes(k)).length;
    if (hits > best[1]) best = [label, hits, confidence];
  }
  return { intent: best[0], confidence: best[2] };
}

function extractEntities(text: string, aliases: Alias[]): Entity[] {
  const t = fold(text);
  const seen = new Set<string>();
  const entities: Array<Entity & { start: number }> = [];
  for (const { alias, type } of aliases) {
    const needle = fold(alias);
    for (let i = t.indexOf(needle); needle && i !== -1; i = t.indexOf(needle, i + 1)) {
      const key = `${i}:${i + needle.length}:${type}`;
      if (!seen.has(key)) {
        seen.add(key);
        entities.push({ value: text.slice(i, i + needle.length), type, start: i });
      }
    }
  }
  return entities.sort((a, b) => a.start - b.start);
}

const tokenize = (value: string) => new Set(value.split(/[^\p{L}\p{N}_]+/u).filter(Boolean));
const similar = (a: string, b: string) => a === b || (a.length >= 4 && b.startsWith(a)) || (b.length >= 4 && a.startsWith(b));

function matchesKeyword(keyword: string, text: string, words: Set<string>) {
  if (!keyword) return false;
  if (text.includes(keyword)) return true;
  const tokens = [...tokenize(keyword)];
  if (tokens.length === 0) return false;
  const matched = tokens.filter((token) => [...words].some((word) => similar(token, word))).length;
  return matched / tokens.length >= 0.6;
}

/** Port of KnowledgeService._compute_score and _threshold_for. */
function score(text: string, entry: KbEntry, entities: Entity[]) {
  const words = tokenize(text);
  const keywords = entry.keywords.map(normalizeSearch);
  const keywordScore = keywords.length ? keywords.filter((k) => matchesKeyword(k, text, words)).length / keywords.length : 0;
  const questionWords = tokenize(normalizeSearch(entry.question));
  const questionScore = [...questionWords].filter((w) => words.has(w)).length / Math.max(questionWords.size, 1);
  const topicTerms = new Set(normalizeSearch(entry.topic).split("_"));
  const topicScore = entry.topic ? [...topicTerms].filter((w) => words.has(w)).length / Math.max(topicTerms.size, 1) : 0;
  const values = entities.map((e) => normalizeSearch(e.value));
  const entityScore = values.length ? values.filter((v) => v && text.includes(v)).length / values.length : 0;
  const value = keywordScore * 0.45 + questionScore * 0.25 + topicScore * 0.1 + entityScore * 0.2
    + (text.includes(normalizeSearch(entry.question)) ? 0.1 : 0)
    + (entry.confidence === "high" ? 0.05 : 0)
    - (entry.time_sensitive ? 0.05 : 0);
  const threshold = 0.18 + (entry.confidence === "medium" ? 0.06 : 0) + (entry.time_sensitive ? 0.05 : 0);
  return { value: Math.max(value, 0), threshold };
}

function lookup(entries: KbEntry[], text: string, entities: Entity[]) {
  let best: { entry: KbEntry; score: number; threshold: number } | null = null;
  for (const entry of entries) {
    const result = score(text, entry, entities);
    if (!best || result.value > best.score) best = { entry, score: result.value, threshold: result.threshold };
  }
  return best && best.score >= best.threshold ? best : null;
}

/** Port of ChatbotService.LooksLikeFollowUp: short or "biraz daha"-style messages reuse the last question. */
function looksLikeFollowUp(message: string) {
  const t = fold(message.trim());
  const patterns = ["biraz daha", "tam olarak", "yani", "peki", "ornek", "nasil yani", "neden", "anlamadim", "aciklar misin", "detay", "devam", "baska", "ya da", "iste", "evet ama", "tamam ama"];
  return patterns.some((p) => t.includes(p)) || message.length < 25;
}

const band = (confidence: number): "high" | "medium" | "low" =>
  (confidence >= 0.85 ? "high" : confidence >= 0.6 ? "medium" : "low");

const DEMO_EXAMPLES = [
  "Bütünleme sınavına kimler girebilir?",
  "Kütüphaneden kaç kitap ödünç alabilirim?",
  "Öğrenci belgesi nereden alınır?",
  "Yemek bursu başvurusu nasıl yapılır?",
];

export async function answer(message: string, previousUserMessages: string[]) {
  const { kb, aliases } = await loadData();
  const lastQuestion = previousUserMessages[previousUserMessages.length - 1];
  const classifierInput = lastQuestion && looksLikeFollowUp(message) ? `${lastQuestion} ${message}` : message;
  const { intent, confidence } = classify(classifierInput);
  const entities = extractEntities(message, aliases);
  const text = normalizeSearch(message);

  // Demo-only fallback: without BERTurk the keyword classifier misses more often,
  // so if the predicted intent has no match the whole knowledge base is searched.
  const match = lookup(kb.filter((e) => e.intent === intent), text, entities) ?? lookup(kb, text, entities);
  const kbHit = Boolean(match && match.score >= 0.4);
  const finalIntent = match?.entry.intent ?? intent;
  const grounded = Boolean(match && kbHit && !(match.entry.confidence === "medium" && match.entry.time_sensitive)
    && (confidence >= 0.7 || match.score >= 0.35));

  let content: string;
  if (match && grounded) {
    content = match.entry.answer.trim();
    if (match.entry.time_sensitive) {
      content += "\n\nBu bilgi zamanla değişebilir; kesin tarih, ücret veya başvuru süreci için resmî kaynağı kontrol etmen daha güvenli olur.";
    }
    if (match.entry.source_url) content += `\n\nKaynak: ${match.entry.source_url}`;
  } else if (match) {
    content = `Tam emin değilim ama bilgi tabanında şuna benzer bir cevap buldum:\n\n${match.entry.answer.trim()}`;
    if (match.entry.source_url) content += `\n\nDaha kesin bilgi için: ${match.entry.source_url}`;
  } else {
    content = "Demo modunda yalnızca üniversitenin bilgi tabanındaki 412 kayıttan cevap verebiliyorum ve bu soruya yeterince yakın bir kayıt bulamadım. "
      + "Gerçek sistemde bu durumda Gemini genel bilgiyle bir cevap üretir.\n\nŞunları sorabilirsin:\n"
      + DEMO_EXAMPLES.map((q) => `- ${q}`).join("\n");
  }

  return {
    content,
    intentDetected: finalIntent,
    confidence,
    confidenceBand: band(confidence),
    needsReview: band(confidence) === "low",
    modelUsed: kbHit ? "demo-keyword+kb" : "demo-keyword",
    kbScore: match ? Math.round(match.score * 10_000) / 10_000 : null,
    kbHit,
    isFallback: !kbHit,
  };
}
