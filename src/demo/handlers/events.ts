import { newId, saveDb } from "@/demo/db";
import { badRequest, created, forbidden, noContent, notFound, ok, route, text } from "@/demo/http";
import { isPrivileged, roleIn, toEvent } from "@/demo/mappers";
import { notify } from "@/demo/shared";
import { nowIso } from "@/demo/time";
import type { DemoDb, DemoEvent, DemoUser } from "@/demo/types";

const canManage = (event: DemoEvent, me: DemoUser) => isPrivileged(me) || event.creatorUserId === me.id;

/** Validates the payload shared by create and update; returns an error result or the clean input. */
function readEventInput(db: DemoDb, me: DemoUser, body: Record<string, unknown>) {
  const start = Date.parse(text(body.startDateUtc));
  const end = Date.parse(text(body.endDateUtc));
  const groupId = text(body.groupId) || undefined;
  if (!text(body.title) || !text(body.location) || Number.isNaN(start) || Number.isNaN(end)) {
    return { error: badRequest("Başlık, konum ve tarihler zorunludur.") };
  }
  if (end <= start) return { error: badRequest("Bitiş tarihi başlangıç tarihinden sonra olmalıdır.") };
  if (groupId) {
    const group = db.groups.find((g) => g.id === groupId && g.isActive);
    if (!group) return { error: badRequest("Seçilen grup bulunamadı.") };
    const role = roleIn(group, me.id);
    if (!role) return { error: badRequest("Grup etkinliği oluşturmak için önce o gruba katılmalısınız.") };
    if (role === "member") return { error: badRequest("Grup etkinliği oluşturmak için moderatör veya kurucu olmalısınız.") };
  }
  return {
    input: {
      title: text(body.title),
      description: text(body.description),
      location: text(body.location),
      startDateUtc: new Date(start).toISOString(),
      endDateUtc: new Date(end).toISOString(),
      maxParticipants: Math.max(1, Number(body.maxParticipants) || 1),
      category: text(body.category) || "Sosyal",
      groupId,
    },
  };
}

route("GET", "/api/events", ({ db, me, query }) => {
  const groupId = query.get("groupId");
  return ok(db.events
    .filter((e) => !groupId || e.groupId === groupId)
    .sort((a, b) => Date.parse(a.startDateUtc) - Date.parse(b.startDateUtc))
    .map((e) => toEvent(db, e, me)));
});

route("POST", "/api/events", ({ db, me, body }) => {
  const { error, input } = readEventInput(db, me, body);
  if (error) return error;
  const event: DemoEvent = { id: newId("e"), ...input, creatorUserId: me.id, participants: [], createdAtUtc: nowIso() };
  db.events.push(event);
  saveDb();
  return created(toEvent(db, event, me));
});

route("GET", "/api/events/:id", ({ db, me, params }) => {
  const event = db.events.find((e) => e.id === params.id);
  return event ? ok(toEvent(db, event, me)) : notFound("Etkinlik bulunamadı.");
});

route("PUT", "/api/events/:id", ({ db, me, params, body }) => {
  const event = db.events.find((e) => e.id === params.id);
  if (!event) return notFound("Etkinlik bulunamadı.");
  if (!canManage(event, me)) return forbidden();
  const { error, input } = readEventInput(db, me, body);
  if (error) return error;
  Object.assign(event, input);
  saveDb();
  return ok(toEvent(db, event, me));
});

route("DELETE", "/api/events/:id", ({ db, me, params }) => {
  const event = db.events.find((e) => e.id === params.id);
  if (!event) return notFound("Etkinlik bulunamadı.");
  if (!canManage(event, me)) return forbidden();
  db.events = db.events.filter((e) => e.id !== event.id);
  saveDb();
  return noContent();
});

route("POST", "/api/events/:id/register", ({ db, me, params }) => {
  const event = db.events.find((e) => e.id === params.id);
  if (!event) return notFound("Etkinlik bulunamadı.");
  const existing = event.participants.find((p) => p.userId === me.id);
  if (existing?.status === "registered") return badRequest("Etkinliğe zaten kayıtlısınız.");
  const registered = event.participants.filter((p) => p.status === "registered").length;
  if (registered >= event.maxParticipants) return badRequest("Etkinlik kontenjanı dolu.");
  if (existing) {
    existing.status = "registered";
    existing.registeredAtUtc = nowIso();
  } else {
    event.participants.push({ userId: me.id, status: "registered", registeredAtUtc: nowIso() });
  }
  if (event.creatorUserId !== me.id) {
    notify(db, event.creatorUserId, `${me.fullName} etkinliğine katıldı`, event.title, "event", "/events");
  }
  saveDb();
  return noContent();
});

route("DELETE", "/api/events/:id/cancel", ({ db, me, params }) => {
  const participant = db.events.find((e) => e.id === params.id)?.participants
    .find((p) => p.userId === me.id && p.status === "registered");
  if (!participant) return notFound("Kayıt bulunamadı.");
  participant.status = "cancelled";
  saveDb();
  return noContent();
});
