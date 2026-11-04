import { newId, saveDb } from "@/demo/db";
import { answer } from "@/demo/eduai/engine";
import { badRequest, noContent, notFound, ok, route, text } from "@/demo/http";
import { nowIso } from "@/demo/time";
import type { DemoChatSession, DemoDb, DemoUser } from "@/demo/types";

const findSession = (db: DemoDb, me: DemoUser, id: string) =>
  db.chatSessions.find((s) => s.id === id && s.userId === me.id);

const toSession = (session: DemoChatSession) => ({
  sessionId: session.id,
  startedAtUtc: session.startedAtUtc,
  endedAtUtc: session.endedAtUtc ?? null,
  totalMessages: session.messages.length,
  isActive: !session.endedAtUtc,
});

route("GET", "/api/chat/sessions", ({ db, me }) =>
  ok(db.chatSessions
    .filter((s) => s.userId === me.id)
    .sort((a, b) => Date.parse(b.startedAtUtc) - Date.parse(a.startedAtUtc))
    .slice(0, 20)
    .map(toSession)));

route("POST", "/api/chat/sessions", ({ db, me }) => {
  const now = nowIso();
  db.chatSessions.filter((s) => s.userId === me.id && !s.endedAtUtc).forEach((s) => { s.endedAtUtc = now; });
  const session: DemoChatSession = { id: newId("cs"), userId: me.id, startedAtUtc: now, messages: [] };
  db.chatSessions.push(session);
  saveDb();
  return ok({ sessionId: session.id, startedAtUtc: session.startedAtUtc });
});

route("GET", "/api/chat/sessions/:id/messages", ({ db, me, params }) => {
  const session = findSession(db, me, params.id);
  if (!session) return notFound("Chat oturumu bulunamadı.");
  return ok(session.messages.map((m) => ({
    id: m.id,
    senderType: m.senderType,
    content: m.content,
    intentDetected: m.intentDetected ?? null,
    confidence: m.confidence ?? null,
    confidenceBand: m.confidenceBand ?? null,
    needsReview: m.senderType === "bot" ? Boolean(m.needsReview) : false,
    modelUsed: m.modelUsed ?? null,
    kbScore: m.kbScore ?? null,
    kbHit: m.kbHit,
    isFallback: m.isFallback,
    latencyMs: m.latencyMs ?? null,
    timestampUtc: m.timestampUtc,
    hasFeedback: false,
    feedbackIsHelpful: null,
  })));
});

route("POST", "/api/chat/sessions/:id/messages", async ({ db, me, params, body }) => {
  const message = text(body.message);
  if (!message) return badRequest("Mesaj boş olamaz.");
  if (message.length > 2000) return badRequest("Mesaj çok uzun. Maksimum 2000 karakter.");
  const session = findSession(db, me, params.id);
  if (!session) return notFound("Chat oturumu bulunamadı.");
  if (session.endedAtUtc) return badRequest("Bu chat oturumu kapatılmış.");

  const started = performance.now();
  // A short pause so the typing indicator is visible, as with the real round trip.
  await new Promise((resolve) => window.setTimeout(resolve, 650 + Math.random() * 450));
  const history = session.messages.filter((m) => m.senderType === "user").map((m) => m.content);
  const reply = { ...(await answer(message, history)), latencyMs: Math.round(performance.now() - started) };

  session.messages.push(
    { id: newId("cm"), senderType: "user", content: message, timestampUtc: nowIso() },
    { id: newId("cm"), senderType: "bot", ...reply, timestampUtc: nowIso() },
  );
  saveDb();
  return ok(reply);
});

route("DELETE", "/api/chat/sessions/:id", ({ db, me, params }) => {
  const session = findSession(db, me, params.id);
  if (!session) return notFound("Chat oturumu bulunamadı.");
  session.endedAtUtc = nowIso();
  saveDb();
  return noContent();
});

route("DELETE", "/api/chat/sessions/:id/permanent", ({ db, me, params }) => {
  if (!findSession(db, me, params.id)) return notFound("Chat oturumu bulunamadı.");
  db.chatSessions = db.chatSessions.filter((s) => s.id !== params.id);
  saveDb();
  return noContent();
});
