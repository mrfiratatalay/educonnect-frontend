import type { DemoDb, DemoUser } from "@/demo/types";

export interface DemoResult {
  status: number;
  data?: unknown;
}

export interface RouteContext {
  db: DemoDb;
  /** Null only on anonymous routes. */
  me: DemoUser;
  params: Record<string, string>;
  query: URLSearchParams;
  // Request bodies are validated field by field in each handler, like the API does.
  body: Record<string, any>;
  form: FormData | null;
}

type Handler = (ctx: RouteContext) => DemoResult | Promise<DemoResult>;

interface Route {
  method: string;
  pattern: RegExp;
  keys: string[];
  anonymous: boolean;
  handler: Handler;
}

const routes: Route[] = [];

/** Registers a handler, e.g. route("POST", "/api/posts/:id/like", toggleLike). */
export function route(method: string, path: string, handler: Handler, options: { anonymous?: boolean } = {}) {
  const keys: string[] = [];
  const source = path.replace(/:(\w+)/g, (_, key: string) => {
    keys.push(key);
    return "([^/]+)";
  });
  routes.push({ method, pattern: new RegExp(`^${source}$`), keys, anonymous: options.anonymous ?? false, handler });
}

export function matchRoute(method: string, path: string) {
  for (const candidate of routes) {
    if (candidate.method !== method) continue;
    const match = candidate.pattern.exec(path);
    if (!match) continue;
    const params = Object.fromEntries(candidate.keys.map((key, i) => [key, decodeURIComponent(match[i + 1])]));
    return { route: candidate, params };
  }
  return null;
}

export const ok = (data?: unknown): DemoResult => ({ status: 200, data });
export const created = (data: unknown): DemoResult => ({ status: 201, data });
export const noContent = (): DemoResult => ({ status: 204 });

/** Business-rule errors use { message }, like the controllers' BadRequest(new { message }). */
export const badRequest = (message: string): DemoResult => ({ status: 400, data: { message } });

/** Framework-level errors use RFC 7807 Problem Details, like GlobalExceptionHandler. */
export function problem(status: number, title: string, detail: string): DemoResult {
  return { status, data: { type: `https://httpstatuses.io/${status}`, title, status, detail } };
}

export const unauthorized = () => problem(401, "Unauthorized", "Oturum bulunamadı. Lütfen yeniden giriş yapın.");
export const forbidden = () => problem(403, "Forbidden", "Bu işlem için yetkin yok.");
export const notFound = (detail = "Kayıt bulunamadı.") => problem(404, "Not Found", detail);

export function intParam(query: URLSearchParams, key: string, fallback: number, min = 1, max = 50) {
  const value = Number.parseInt(query.get(key) ?? "", 10);
  return Number.isFinite(value) ? Math.min(Math.max(value, min), max) : fallback;
}

export function paged<T>(items: T[], query: URLSearchParams, defaultSize = 10) {
  const page = intParam(query, "page", 1, 1, 10_000);
  const pageSize = intParam(query, "pageSize", defaultSize, 1, 100);
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    totalCount: items.length,
  };
}

export function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export const byNewest = <T extends { createdAtUtc: string }>(a: T, b: T) =>
  Date.parse(b.createdAtUtc) - Date.parse(a.createdAtUtc);
