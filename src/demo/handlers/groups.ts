import { newId, saveDb } from "@/demo/db";
import { imageToDataUrl, validateImage } from "@/demo/files";
import { badRequest, byNewest, created, forbidden, intParam, noContent, notFound, ok, paged, route, text } from "@/demo/http";
import { findUser, roleIn, toGroup, toGroupDetail, toGroupMember, toPost } from "@/demo/mappers";
import { normalizeSearch, notify, slugify, visiblePosts } from "@/demo/shared";
import { nowIso } from "@/demo/time";
import type { DemoDb, DemoGroup, DemoGroupRole, DemoUser } from "@/demo/types";

const ROLE_RANK: Record<DemoGroupRole, number> = { member: 1, moderator: 2, owner: 3 };
const activeGroups = (db: DemoDb) => db.groups.filter((g) => g.isActive);
const findGroup = (db: DemoDb, id: string) => activeGroups(db).find((g) => g.id === id);
const isMember = (group: DemoGroup, userId: string) => group.members.some((m) => m.userId === userId);

function postsPage(db: DemoDb, me: DemoUser, groupIds: Set<string>, query: URLSearchParams) {
  const posts = visiblePosts(db).filter((p) => p.groupId && groupIds.has(p.groupId)).sort(byNewest);
  const result = paged(posts, query);
  return ok({ ...result, items: result.items.map((post) => toPost(db, post, me)) });
}

function uniqueSlug(db: DemoDb, name: string) {
  const base = slugify(name);
  let slug = base;
  for (let i = 2; db.groups.some((g) => g.slug === slug); i += 1) slug = `${base}-${i}`;
  return slug;
}

function readGroupInput(body: Record<string, unknown>) {
  const rules = Array.isArray(body.rules) ? body.rules.map((rule) => text(rule)).filter(Boolean) : [];
  return {
    name: text(body.name),
    description: text(body.description),
    shortDescription: text(body.shortDescription),
    category: text(body.category),
    rules,
    avatarUrl: text(body.avatarUrl) || undefined,
    bannerUrl: text(body.bannerUrl) || undefined,
  };
}

route("GET", "/api/groups", ({ db, me }) => ok(activeGroups(db).sort(byNewest).map((g) => toGroup(db, g, me))));

async function uploadGroupImage(form: FormData | null, maxSize: number) {
  const file = form?.get("file");
  const error = validateImage(file);
  return error ? badRequest(error) : ok({ url: await imageToDataUrl(file as File, maxSize) });
}

route("POST", "/api/groups/upload-avatar", ({ form }) => uploadGroupImage(form, 320));
route("POST", "/api/groups/upload-banner", ({ form }) => uploadGroupImage(form, 1400));

route("POST", "/api/groups", ({ db, me, body }) => {
  const input = readGroupInput(body);
  if (!input.name || !input.description || !input.category) return badRequest("Ad, açıklama ve kategori zorunludur.");
  const now = nowIso();
  const group: DemoGroup = {
    id: newId("g"), ...input, slug: uniqueSlug(db, input.name),
    shortDescription: input.shortDescription || input.description.slice(0, 200),
    creatorUserId: me.id, isActive: true, members: [{ userId: me.id, role: "owner", joinedAtUtc: now }], createdAtUtc: now,
  };
  db.groups.push(group);
  saveDb();
  return created(toGroup(db, group, me));
});

route("GET", "/api/groups/joined", ({ db, me, query }) => {
  const limit = intParam(query, "limit", 12, 1, 24);
  const joinedAt = (g: DemoGroup) => Date.parse(g.members.find((m) => m.userId === me.id)?.joinedAtUtc ?? "");
  return ok(activeGroups(db).filter((g) => isMember(g, me.id)).sort((a, b) => joinedAt(b) - joinedAt(a))
    .slice(0, limit).map((g) => toGroup(db, g, me)));
});

route("GET", "/api/groups/discover", ({ db, me, query }) => {
  const limit = intParam(query, "limit", 12, 1, 24);
  const term = normalizeSearch(query.get("query") ?? "");
  return ok(activeGroups(db)
    .filter((g) => !isMember(g, me.id))
    .filter((g) => !term || [g.name, g.shortDescription, g.description, g.category].some((v) => normalizeSearch(v).includes(term)))
    .sort((a, b) => b.members.length - a.members.length || byNewest(a, b))
    .slice(0, limit)
    .map((g) => toGroup(db, g, me)));
});

route("GET", "/api/groups/feed", ({ db, me, query }) =>
  postsPage(db, me, new Set(activeGroups(db).filter((g) => isMember(g, me.id)).map((g) => g.id)), query));

route("GET", "/api/groups/slug/:slug", ({ db, me, params }) => {
  const group = activeGroups(db).find((g) => g.slug === params.slug);
  return group ? ok(toGroupDetail(db, group, me)) : notFound("Topluluk bulunamadı.");
});

route("GET", "/api/groups/:id", ({ db, me, params }) => {
  const group = findGroup(db, params.id);
  return group ? ok(toGroupDetail(db, group, me)) : notFound("Topluluk bulunamadı.");
});

route("PUT", "/api/groups/:id", ({ db, me, params, body }) => {
  const group = findGroup(db, params.id);
  if (!group) return notFound("Topluluk bulunamadı.");
  if (group.creatorUserId !== me.id) return forbidden();
  const input = readGroupInput(body);
  if (!input.name || !input.description || !input.category) return badRequest("Ad, açıklama ve kategori zorunludur.");
  Object.assign(group, input, { shortDescription: input.shortDescription || input.description.slice(0, 200) });
  saveDb();
  return ok(toGroupDetail(db, group, me));
});

route("DELETE", "/api/groups/:id", ({ db, me, params }) => {
  const group = findGroup(db, params.id);
  if (!group) return notFound("Topluluk bulunamadı.");
  if (group.creatorUserId !== me.id) return forbidden();
  group.isActive = false;
  saveDb();
  return noContent();
});

route("GET", "/api/groups/:id/members", ({ db, me, params }) => {
  const group = findGroup(db, params.id);
  if (!group) return notFound("Topluluk bulunamadı.");
  const actorRole = roleIn(group, me.id);
  const nameOf = (userId: string) => findUser(db, userId)?.fullName ?? "";
  return ok([...group.members]
    .sort((a, b) => ROLE_RANK[b.role] - ROLE_RANK[a.role] || nameOf(a.userId).localeCompare(nameOf(b.userId), "tr"))
    .map((member) => toGroupMember(db, member, actorRole, me)));
});

route("GET", "/api/groups/:id/posts", ({ db, me, params, query }) =>
  findGroup(db, params.id) ? postsPage(db, me, new Set([params.id]), query) : notFound("Topluluk bulunamadı."));

route("POST", "/api/groups/:id/join", ({ db, me, params }) => {
  const group = findGroup(db, params.id);
  if (!group) return notFound("Topluluk bulunamadı.");
  if (isMember(group, me.id)) return badRequest("Kullanıcı zaten bu grupta.");
  group.members.push({ userId: me.id, role: "member", joinedAtUtc: nowIso() });
  if (group.creatorUserId !== me.id) {
    notify(db, group.creatorUserId, `${me.fullName} grubuna katıldı`, group.name, "social", "/communities");
  }
  saveDb();
  return noContent();
});

route("DELETE", "/api/groups/:id/leave", ({ db, me, params }) => {
  const group = findGroup(db, params.id);
  const membership = group?.members.find((m) => m.userId === me.id);
  if (!group || !membership) return notFound("Üyelik bulunamadı.");
  if (membership.role === "owner") return badRequest("Grup sahibi kendi oluşturduğu gruptan ayrılamaz.");
  group.members = group.members.filter((m) => m.userId !== me.id);
  saveDb();
  return noContent();
});

/** Promote, demote and remove share the same guards as the controller. */
function changeMember(db: DemoDb, me: DemoUser, groupId: string, targetUserId: string, action: "promote" | "demote" | "remove") {
  const group = findGroup(db, groupId);
  if (!group) return notFound("Topluluk bulunamadı.");
  const actorRole = roleIn(group, me.id);
  const target = group.members.find((m) => m.userId === targetUserId);
  if (action === "remove" ? !actorRole || actorRole === "member" : actorRole !== "owner") return forbidden();
  if (!target) return notFound("Üye bulunamadı.");
  if (target.userId === me.id) {
    return badRequest(action === "remove" ? "Kendinizi topluluktan çıkaramazsınız." : "Kendi rolünüzü değiştiremezsiniz.");
  }
  if (action === "promote") {
    if (target.role !== "member") return badRequest("Sadece normal üyeler moderatör yapılabilir.");
    target.role = "moderator";
  } else if (action === "demote") {
    if (target.role !== "moderator") return badRequest("Sadece moderatörler üye rolüne indirilebilir.");
    target.role = "member";
  } else {
    if (target.role === "owner") return badRequest("Topluluk sahibi topluluktan çıkarılamaz.");
    if (actorRole === "moderator" && target.role !== "member") return forbidden();
    group.members = group.members.filter((m) => m.userId !== target.userId);
  }
  saveDb();
  return noContent();
}

route("POST", "/api/groups/:id/members/:userId/promote", ({ db, me, params }) => changeMember(db, me, params.id, params.userId, "promote"));
route("POST", "/api/groups/:id/members/:userId/demote", ({ db, me, params }) => changeMember(db, me, params.id, params.userId, "demote"));
route("DELETE", "/api/groups/:id/members/:userId", ({ db, me, params }) => changeMember(db, me, params.id, params.userId, "remove"));
