import { saveDb } from "@/demo/db";
import { imageToDataUrl, validateImage } from "@/demo/files";
import { badRequest, intParam, notFound, ok, route, text } from "@/demo/http";
import { findUser, isFollowing, toConnection, toPublicProfile, toUserProfile } from "@/demo/mappers";
import { normalizeSearch, notify, withinDays } from "@/demo/shared";
import { nowIso } from "@/demo/time";
import type { DemoDb, DemoUser } from "@/demo/types";

route("GET", "/api/users/me", ({ db, me }) => ok(toUserProfile(db, me)));

route("PUT", "/api/users/me", ({ db, me, body }) => {
  const fullName = text(body.fullName);
  const department = text(body.department);
  const year = Number(body.year);
  if (!fullName) return badRequest("Ad soyad zorunludur.");
  if (!department) return badRequest("Bölüm zorunludur.");
  if (!Number.isInteger(year) || year < 1 || year > 4) return badRequest("Sınıf 1 ile 4 arasında olmalıdır.");
  if (body.universityId && !db.universities.some((u) => u.id === body.universityId)) {
    return badRequest("Seçilen üniversite bulunamadı.");
  }
  Object.assign(me, {
    fullName, department, year,
    bio: text(body.bio) || undefined,
    universityId: body.universityId ?? me.universityId,
  });
  saveDb();
  return ok(toUserProfile(db, me));
});

async function uploadImage(db: DemoDb, me: DemoUser, form: FormData | null, field: "avatarUrl" | "coverImageUrl") {
  const file = form?.get("file");
  const error = validateImage(file);
  if (error) return badRequest(error);
  me[field] = await imageToDataUrl(file as File, field === "avatarUrl" ? 320 : 1400);
  saveDb();
  return ok(toUserProfile(db, me));
}

route("POST", "/api/users/me/avatar/upload", ({ db, me, form }) => uploadImage(db, me, form, "avatarUrl"));
route("POST", "/api/users/me/cover/upload", ({ db, me, form }) => uploadImage(db, me, form, "coverImageUrl"));

route("GET", "/api/users/search", ({ db, me, query }) => {
  const term = normalizeSearch(query.get("q") ?? "");
  if (term.length < 2) return ok([]);
  const limit = intParam(query, "limit", 10, 1, 20);
  return ok(
    db.users
      .filter((user) => user.isActive && user.id !== me.id && normalizeSearch(user.fullName).includes(term))
      .sort((a, b) => a.fullName.localeCompare(b.fullName, "tr"))
      .slice(0, limit)
      .map((user) => {
        const { isFollowedByCurrentUser: _ignored, ...result } = toConnection(db, user, me);
        return result;
      }),
  );
});

interface Candidate {
  user: DemoUser;
  followed: boolean;
  mutualGroups: number;
  recentPosts: number;
}

/** Shared by follow suggestions and the explore page: same ordering as both controllers. */
export function rankSuggestions(db: DemoDb, me: DemoUser): Candidate[] {
  const myGroups = new Set(db.groups.filter((g) => g.members.some((m) => m.userId === me.id)).map((g) => g.id));
  return db.users
    .filter((user) => user.isActive && user.id !== me.id)
    .map((user) => ({
      user,
      followed: isFollowing(db, me.id, user.id),
      mutualGroups: db.groups.filter((g) => myGroups.has(g.id) && g.members.some((m) => m.userId === user.id)).length,
      recentPosts: db.posts.filter((p) => p.userId === user.id && !p.isDeleted && !p.groupId && withinDays(p.createdAtUtc, 14)).length,
    }))
    .sort((a, b) =>
      Number(a.followed) - Number(b.followed)
      || Number(b.user.universityId === me.universityId) - Number(a.user.universityId === me.universityId)
      || b.mutualGroups - a.mutualGroups
      || b.recentPosts - a.recentPosts
      || a.user.fullName.localeCompare(b.user.fullName, "tr"));
}

function suggestionReason(candidate: Candidate, me: DemoUser) {
  if (candidate.user.department && candidate.user.department === me.department) return `${candidate.user.department} bölümünden`;
  if (candidate.mutualGroups > 0) return candidate.mutualGroups === 1 ? "1 ortak topluluk" : `${candidate.mutualGroups} ortak topluluk`;
  if (candidate.user.universityId === me.universityId) return "Aynı üniversitede";
  if (candidate.recentPosts > 0) return "Bu hafta aktif";
  return "Keşfetmeye değer";
}

route("GET", "/api/users/follow-suggestions", ({ db, me, query }) => {
  const limit = intParam(query, "limit", 3, 1, 12);
  return ok(
    rankSuggestions(db, me).slice(0, limit).map((candidate) => ({
      ...toConnection(db, candidate.user, me),
      mutualGroupCount: candidate.mutualGroups,
      reasonLabel: suggestionReason(candidate, me),
    })),
  );
});

route("GET", "/api/users/:id", ({ db, me, params }) => {
  const user = findUser(db, params.id);
  return user ? ok(toPublicProfile(db, user, me)) : notFound("Kullanıcı bulunamadı.");
});

function connections(db: DemoDb, me: DemoUser, userId: string, direction: "followers" | "following") {
  if (!findUser(db, userId)) return notFound("Kullanıcı bulunamadı.");
  const ids = db.follows
    .filter((f) => (direction === "followers" ? f.followedId === userId : f.followerId === userId))
    .sort((a, b) => Date.parse(b.createdAtUtc) - Date.parse(a.createdAtUtc))
    .map((f) => (direction === "followers" ? f.followerId : f.followedId));
  return ok(ids.map((id) => findUser(db, id)).filter((u): u is DemoUser => Boolean(u)).map((u) => toConnection(db, u, me)));
}

route("GET", "/api/users/:id/followers", ({ db, me, params }) => connections(db, me, params.id, "followers"));
route("GET", "/api/users/:id/following", ({ db, me, params }) => connections(db, me, params.id, "following"));

route("POST", "/api/users/:id/follow", ({ db, me, params }) => {
  if (params.id === me.id) return badRequest("Kullanıcı kendini takip edemez.");
  const target = findUser(db, params.id);
  if (!target) return notFound("Kullanıcı bulunamadı.");
  if (!isFollowing(db, me.id, target.id)) {
    db.follows.push({ followerId: me.id, followedId: target.id, createdAtUtc: nowIso() });
    notify(db, target.id, `${me.fullName} seni takip etmeye başladı`, "Profilini ziyaret ederek geri takip edebilirsin.", "social", `/profile/${me.id}`);
    saveDb();
  }
  return ok({ isFollowing: true });
});

route("DELETE", "/api/users/:id/follow", ({ db, me, params }) => {
  db.follows = db.follows.filter((f) => !(f.followerId === me.id && f.followedId === params.id));
  saveDb();
  return ok({ isFollowing: false });
});
