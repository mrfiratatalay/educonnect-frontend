/**
 * Entry point of the demo backend, loaded lazily by lib/apiClient. It turns an
 * axios request into a call to an in-browser route handler and answers with a
 * normal axios response, or rejects with an AxiosError that carries the same
 * status codes and error bodies as the ASP.NET Core API.
 */
import { AxiosError, AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { getDb } from "@/demo/db";
import { matchRoute, notFound, unauthorized, type DemoResult } from "@/demo/http";
import "@/demo/handlers/auth";
import "@/demo/handlers/users";
import "@/demo/handlers/posts";
import "@/demo/handlers/groups";
import "@/demo/handlers/events";
import "@/demo/handlers/market";
import "@/demo/handlers/inbox";
import "@/demo/handlers/chat";
import "@/demo/handlers/explore";

const STATUS_TEXT: Record<number, string> = {
  200: "OK", 201: "Created", 204: "No Content", 400: "Bad Request", 401: "Unauthorized",
  403: "Forbidden", 404: "Not Found", 500: "Internal Server Error",
};

function readBody(data: unknown) {
  if (typeof data === "string" && data.length > 0) {
    try {
      return { body: JSON.parse(data) as Record<string, unknown>, form: null };
    } catch {
      return { body: {}, form: null };
    }
  }
  if (data instanceof FormData) {
    return { body: {}, form: data };
  }
  return { body: (data && typeof data === "object" ? data : {}) as Record<string, unknown>, form: null };
}

/** The access token looks like "demo.<userId>.<random>" and is only valid for the current session. */
function currentUser(config: InternalAxiosRequestConfig) {
  const header = AxiosHeaders.from(config.headers).get("Authorization");
  const token = typeof header === "string" ? header.replace(/^Bearer\s+/i, "") : "";
  const userId = token.startsWith("demo.") ? token.split(".")[1] : null;
  const db = getDb();
  if (!userId || db.sessionUserId !== userId) return null;
  return db.users.find((user) => user.id === userId && user.isActive) ?? null;
}

const pause = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function handleDemoRequest(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const url = new URL(config.url ?? "/", "https://demo.educonnect.local");
  const query = new URLSearchParams(url.search);
  Object.entries(config.params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) query.set(key, String(value));
  });
  const method = (config.method ?? "get").toUpperCase();
  const { body, form } = readBody(config.data);

  // A small, varying delay so loading states look like they do against the API.
  await pause(90 + Math.random() * 160);

  const matched = matchRoute(method, url.pathname);
  let result: DemoResult;
  if (!matched) {
    result = notFound(`Demo modunda bu uç nokta yok: ${method} ${url.pathname}`);
  } else {
    const me = currentUser(config);
    result = !matched.route.anonymous && !me
      ? unauthorized()
      : await matched.route.handler({ db: getDb(), me: me!, params: matched.params, query, body, form });
  }

  const response: AxiosResponse = {
    data: result.data ?? "",
    status: result.status,
    statusText: STATUS_TEXT[result.status] ?? "",
    headers: new AxiosHeaders({ "content-type": "application/json" }),
    config,
    request: { demo: true },
  };

  if (result.status >= 400) {
    throw new AxiosError(
      `Request failed with status code ${result.status}`,
      result.status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
      config,
      response.request,
      response,
    );
  }
  return response;
}
