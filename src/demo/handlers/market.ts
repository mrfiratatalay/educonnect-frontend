import { productArt, type ProductShape } from "@/demo/art";
import { newId, saveDb } from "@/demo/db";
import { badRequest, byNewest, created, forbidden, noContent, notFound, ok, paged, route, text } from "@/demo/http";
import { isPrivileged, toProduct } from "@/demo/mappers";
import { normalizeSearch } from "@/demo/shared";
import { nowIso } from "@/demo/time";
import type { DemoDb, DemoProduct, DemoProductCondition, DemoUser } from "@/demo/types";
import { rankForVisualSearch } from "@/demo/visualSearch";

const CONDITIONS: DemoProductCondition[] = ["new", "likeNew", "good", "fair"];
const DEFAULT_ART: Record<string, ProductShape> = {
  "cat-books": "books", "cat-electronics": "circuit", "cat-stationery": "drafting", "cat-tickets": "ticket",
};

const canManage = (product: DemoProduct, me: DemoUser) => isPrivileged(me) || product.sellerId === me.id;

function readProductInput(db: DemoDb, body: Record<string, unknown>) {
  const title = text(body.title);
  const price = Number(body.price);
  const categoryId = text(body.categoryId) || undefined;
  const condition = CONDITIONS.includes(body.condition as DemoProductCondition) ? (body.condition as DemoProductCondition) : "good";
  if (!title) return { error: badRequest("Ürün başlığı zorunludur.") };
  if (!Number.isFinite(price) || price < 0) return { error: badRequest("Geçerli bir fiyat girin.") };
  if (categoryId && !db.categories.some((c) => c.id === categoryId)) return { error: badRequest("Kategori bulunamadı.") };
  const imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls.map((url) => text(url)).filter(Boolean) : [];
  return {
    input: {
      title, price, categoryId, condition,
      description: text(body.description),
      city: text(body.city) || "Rize",
      isNegotiable: Boolean(body.isNegotiable),
      // A listing without photos gets its category illustration, so the grid stays readable.
      imageUrls: imageUrls.length > 0 ? imageUrls : [productArt(DEFAULT_ART[categoryId ?? ""] ?? "backpack", "slate")],
    },
  };
}

route("GET", "/api/categories", ({ db }) => ok(db.categories.map(({ id, name }) => ({ id, name }))));

route("GET", "/api/products", ({ db, query }) => {
  const term = normalizeSearch(query.get("searchTerm") ?? "");
  const minPrice = Number(query.get("minPrice") ?? Number.NaN);
  const maxPrice = Number(query.get("maxPrice") ?? Number.NaN);
  const products = db.products
    .filter((p) => p.isActive)
    .filter((p) => !term || normalizeSearch(`${p.title} ${p.description}`).includes(term))
    .filter((p) => !query.get("sellerId") || p.sellerId === query.get("sellerId"))
    .filter((p) => !query.get("categoryId") || p.categoryId === query.get("categoryId"))
    .filter((p) => Number.isNaN(minPrice) || p.price >= minPrice)
    .filter((p) => Number.isNaN(maxPrice) || p.price <= maxPrice)
    .filter((p) => !query.get("condition") || p.condition === query.get("condition"))
    .sort(byNewest);
  const result = paged(products, query, 12);
  return ok({ ...result, items: result.items.map((p) => toProduct(db, p)) });
});

route("POST", "/api/products", ({ db, me, body }) => {
  const { error, input } = readProductInput(db, body);
  if (error) return error;
  const product: DemoProduct = { id: newId("pr"), ...input, sellerId: me.id, isActive: true, createdAtUtc: nowIso() };
  db.products.push(product);
  saveDb();
  return created(toProduct(db, product));
});

route("GET", "/api/products/:id", ({ db, params }) => {
  const product = db.products.find((p) => p.id === params.id);
  return product ? ok(toProduct(db, product)) : notFound("İlan bulunamadı.");
});

route("PUT", "/api/products/:id", ({ db, me, params, body }) => {
  const product = db.products.find((p) => p.id === params.id);
  if (!product) return notFound("İlan bulunamadı.");
  if (!canManage(product, me)) return forbidden();
  const { error, input } = readProductInput(db, body);
  if (error) return error;
  Object.assign(product, input);
  saveDb();
  return ok(toProduct(db, product));
});

route("DELETE", "/api/products/:id", ({ db, me, params }) => {
  const product = db.products.find((p) => p.id === params.id);
  if (!product) return notFound("İlan bulunamadı.");
  if (!canManage(product, me)) return forbidden();
  product.isActive = false;
  saveDb();
  return noContent();
});

route("GET", "/api/discounts", ({ db }) =>
  ok(db.discounts.filter((d) => d.isActive).map((d) => ({ ...d, logoUrl: d.logoUrl ?? null }))));

route("POST", "/api/visualsearch/searches", ({ db, form }) => {
  const image = form?.get("image");
  if (!(image instanceof File) || image.size === 0) return badRequest("Görsel yüklenmedi.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(image.type.toLowerCase())) {
    return badRequest("Desteklenmeyen format. JPEG, PNG veya WEBP kullanın.");
  }
  const started = performance.now();
  const maxResults = Math.min(Math.max(Number(form?.get("maxResults")) || 8, 1), 20);
  const mode = form?.get("mode") === "discovery" ? "discovery" : "strict";
  const candidates = db.products.filter((p) => p.isActive && p.imageUrls.length > 0);
  const { analysis, results } = rankForVisualSearch(db, candidates, image.name, mode, maxResults);
  return ok({
    searchId: null,
    analysis,
    results,
    totalFound: results.length,
    candidateCount: candidates.length,
    filteredCount: candidates.length,
    elapsedMs: Math.round(performance.now() - started),
  });
});
