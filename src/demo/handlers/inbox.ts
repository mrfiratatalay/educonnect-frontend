import { newId, saveDb } from "@/demo/db";
import { badRequest, intParam, noContent, notFound, ok, route, text } from "@/demo/http";
import { findUser, toNotification } from "@/demo/mappers";
import { emitDemoHubEvent } from "@/demo/realtime";
import { excerpt, notify } from "@/demo/shared";
import { nowIso } from "@/demo/time";
import type { DemoConversation, DemoDb, DemoUser } from "@/demo/types";

route("GET", "/api/notifications", ({ db, me }) =>
  ok(db.notifications
    .filter((n) => n.userId === me.id)
    .sort((a, b) => Date.parse(b.createdAtUtc) - Date.parse(a.createdAtUtc))
    .map(toNotification)));

route("PUT", "/api/notifications/read-all", ({ db, me }) => {
  db.notifications.filter((n) => n.userId === me.id).forEach((n) => { n.isRead = true; });
  saveDb();
  return noContent();
});

route("PUT", "/api/notifications/:id/read", ({ db, me, params }) => {
  const notification = db.notifications.find((n) => n.id === params.id && n.userId === me.id);
  if (!notification) return notFound("Bildirim bulunamadı.");
  notification.isRead = true;
  saveDb();
  return noContent();
});

const mine = (db: DemoDb, me: DemoUser) =>
  db.conversations.filter((c) => c.userLowerId === me.id || c.userHigherId === me.id);
const otherOf = (conversation: DemoConversation, me: DemoUser) =>
  (conversation.userLowerId === me.id ? conversation.userHigherId : conversation.userLowerId);

route("GET", "/api/conversations", ({ db, me }) =>
  ok(mine(db, me)
    .sort((a, b) => Date.parse(b.lastMessageAtUtc) - Date.parse(a.lastMessageAtUtc))
    .map((conversation) => {
      const other = findUser(db, otherOf(conversation, me));
      const last = conversation.messages[conversation.messages.length - 1]?.content ?? null;
      return {
        id: conversation.id,
        otherUserId: other?.id ?? "",
        otherUserName: other?.fullName ?? "",
        otherUserAvatarUrl: other?.avatarUrl ?? null,
        lastMessagePreview: last && last.length > 80 ? `${last.slice(0, 80)}…` : last,
        lastMessageAtUtc: conversation.lastMessageAtUtc,
      };
    })));

route("GET", "/api/conversations/:id/messages", ({ db, me, params, query }) => {
  const conversation = mine(db, me).find((c) => c.id === params.id);
  if (!conversation) return notFound("Sohbet bulunamadı.");
  const page = intParam(query, "page", 1, 1, 10_000);
  const pageSize = intParam(query, "pageSize", 30, 1, 100);
  // Newest page first, then oldest-to-newest inside the page, like the controller.
  const newestFirst = [...conversation.messages].sort((a, b) => Date.parse(b.sentAtUtc) - Date.parse(a.sentAtUtc));
  const items = newestFirst.slice((page - 1) * pageSize, page * pageSize).reverse();
  return ok({ items, page, pageSize, totalCount: conversation.messages.length });
});

route("POST", "/api/conversations", ({ db, me, body }) => {
  const otherUserId = text(body.otherUserId);
  if (otherUserId === me.id) return badRequest("Kendinizle sohbet başlatılamaz.");
  if (!findUser(db, otherUserId)) return notFound("Kullanıcı bulunamadı.");
  const [userLowerId, userHigherId] = me.id < otherUserId ? [me.id, otherUserId] : [otherUserId, me.id];
  const existing = db.conversations.find((c) => c.userLowerId === userLowerId && c.userHigherId === userHigherId);
  if (existing) return ok({ conversationId: existing.id, created: false });
  const conversation = { id: newId("c"), userLowerId, userHigherId, messages: [], lastMessageAtUtc: nowIso() };
  db.conversations.push(conversation);
  saveDb();
  return ok({ conversationId: conversation.id, created: true });
});

const REPLIES: Array<[RegExp, string]> = [
  [/teşekkür|sağ ?ol|eyvallah/i, "Rica ederim, ne zaman istersen!"],
  [/hackathon|takım/i, "Hackathon için çok heyecanlıyım. Takım kurarsak haber ver!"],
  [/etkinlik|saat|ne zaman/i, "Etkinlikler sayfasında saatler yazıyor, orada görüşürüz."],
  [/^(selam|merhaba|hey)/i, "Selam! Nasılsın, derslerin nasıl gidiyor?"],
  [/\?\s*$/, "Güzel soru, bakıp sana döneceğim."],
];

/** The other side answers a few seconds later through the direct-messages hub. */
function scheduleReply(db: DemoDb, conversation: DemoConversation, me: DemoUser, incoming: string) {
  const other = findUser(db, otherOf(conversation, me));
  if (!other) return;
  const content = REPLIES.find(([pattern]) => pattern.test(incoming))?.[1] ?? "Harika, haberleşelim!";
  window.setTimeout(() => {
    const message = { id: newId("m"), senderUserId: other.id, content, sentAtUtc: nowIso() };
    conversation.messages.push(message);
    conversation.lastMessageAtUtc = message.sentAtUtc;
    notify(db, me.id, `${other.fullName} sana mesaj gönderdi`, excerpt(content, "Yeni bir mesajın var."), "social", `/messages?conversation=${conversation.id}`);
    saveDb();
    if (db.sessionUserId === me.id) {
      emitDemoHubEvent("/hubs/direct-messages", "ReceiveMessage", { conversationId: conversation.id, message });
    }
  }, 1800 + Math.random() * 1400);
}

route("POST", "/api/conversations/:id/messages", ({ db, me, params, body }) => {
  const conversation = mine(db, me).find((c) => c.id === params.id);
  if (!conversation) return notFound("Sohbet bulunamadı.");
  const content = text(body.content);
  if (!content) return badRequest("Mesaj boş olamaz.");
  if (content.length > 2000) return badRequest("Mesaj en fazla 2000 karakter olabilir.");
  const message = { id: newId("m"), senderUserId: me.id, content, sentAtUtc: nowIso() };
  conversation.messages.push(message);
  conversation.lastMessageAtUtc = message.sentAtUtc;
  const otherId = otherOf(conversation, me);
  notify(db, otherId, `${me.fullName} sana mesaj gönderdi`, excerpt(content, "Yeni bir mesajın var."), "social", `/messages?conversation=${conversation.id}`);
  saveDb();
  scheduleReply(db, conversation, me, content);
  return ok(message);
});
