import { newId, saveDb } from "@/demo/db";
import { imageToDataUrl, validateImage } from "@/demo/files";
import { badRequest, forbidden, notFound, noContent, ok, paged, route, text, byNewest, intParam } from "@/demo/http";
import { isPrivileged, toComment, toPost } from "@/demo/mappers";
import { buildTrends, excerpt, extractHashtags, notify, visiblePosts, withinDays } from "@/demo/shared";
import { nowIso } from "@/demo/time";
import type { DemoDb, DemoPost, DemoUser } from "@/demo/types";

const page = (db: DemoDb, me: DemoUser, posts: DemoPost[], query: URLSearchParams) => {
  const result = paged(posts, query);
  return ok({ ...result, items: result.items.map((post) => toPost(db, post, me)) });
};

const canManage = (post: DemoPost, me: DemoUser) => isPrivileged(me) || post.userId === me.id;

route("GET", "/api/posts", ({ db, me, query }) => {
  const userId = query.get("userId");
  const mediaOnly = query.get("mediaOnly") === "true";
  const posts = visiblePosts(db)
    .filter((post) => (!userId || post.userId === userId) && (!mediaOnly || Boolean(post.imageUrl)))
    .sort(byNewest);
  return page(db, me, posts, query);
});

/** Port of PostsController.CalculateForYouScore and BuildForYouReason. */
route("GET", "/api/posts/for-you", ({ db, me, query }) => {
  const followed = new Set(db.follows.filter((f) => f.followerId === me.id).map((f) => f.followedId));
  const joined = new Set(db.groups.filter((g) => g.members.some((m) => m.userId === me.id)).map((g) => g.id));
  const universityOf = (userId: string) => db.users.find((u) => u.id === userId)?.universityId;

  const interestSource = db.posts.filter((p) => !p.isDeleted && withinDays(p.createdAtUtc, 45)
    && (p.userId === me.id || p.likes.some((l) => l.userId === me.id) || p.bookmarks.some((b) => b.userId === me.id)));
  const interests = new Set(buildTrends(interestSource, 6).map((t) => t.hashtag.toLocaleLowerCase("tr-TR")));
  const matchingTags = (post: DemoPost) =>
    extractHashtags(post.content).filter((tag) => interests.has(tag.toLocaleLowerCase("tr-TR"))).length;

  const score = (post: DemoPost) => {
    let value = 0;
    if (followed.has(post.userId)) value += 46;
    if (post.groupId && joined.has(post.groupId)) value += 34;
    if (universityOf(post.userId) === me.universityId) value += 18;
    value += post.groupId ? 4 : 8;
    value += Math.min(post.likes.length, 12);
    value += Math.min(post.comments.length * 2, 12);
    value += Math.min(Math.floor(post.viewerIds.length / 3), 10);
    if (post.likes.some((l) => l.userId === me.id) || post.bookmarks.some((b) => b.userId === me.id)) value += 8;
    const tags = matchingTags(post);
    if (tags > 0) value += 18 + tags * 6;
    const ageHours = (Date.now() - Date.parse(post.createdAtUtc)) / 3_600_000;
    value += ageHours <= 12 ? 14 : ageHours <= 24 ? 10 : ageHours <= 72 ? 6 : ageHours <= 168 ? 3 : 0;
    return value;
  };

  const reason = (post: DemoPost) => {
    if (followed.has(post.userId)) return "Takip ettiklerinden";
    if (post.groupId && joined.has(post.groupId)) return "Topluluğundan";
    if (matchingTags(post) > 0) return "İlgi alanına yakın";
    if (universityOf(post.userId) === me.universityId) return "Aynı üniversiteden";
    if (post.likes.length + post.comments.length + post.viewerIds.length >= 8) return "Etkileşimi yüksek";
    return "Yeni paylaşıldı";
  };

  const ranked = visiblePosts(db)
    .filter((post) => withinDays(post.createdAtUtc, 30))
    .sort(byNewest)
    .slice(0, 250)
    .map((post) => ({ post, score: score(post) }))
    .sort((a, b) => b.score - a.score || Date.parse(b.post.createdAtUtc) - Date.parse(a.post.createdAtUtc));

  const result = paged(ranked, query);
  return ok({ ...result, items: result.items.map(({ post }) => toPost(db, post, me, reason(post))) });
});

route("GET", "/api/posts/following", ({ db, me, query }) => {
  const followed = new Set(db.follows.filter((f) => f.followerId === me.id).map((f) => f.followedId));
  return page(db, me, visiblePosts(db).filter((p) => !p.groupId && followed.has(p.userId)).sort(byNewest), query);
});

route("GET", "/api/posts/trending", ({ db, me, query }) => {
  const limit = intParam(query, "limit", 4, 1, 10);
  const recent = visiblePosts(db).filter((p) => withinDays(p.createdAtUtc, 7) && p.content.includes("#"));
  const universityOf = (userId: string) => db.users.find((u) => u.id === userId)?.universityId;
  let label = "Üniversitende - Gündemdekiler";
  let trends = buildTrends(recent.filter((p) => universityOf(p.userId) === me.universityId), limit);
  if (trends.length === 0) {
    label = "Platformda - Gündemdekiler";
    trends = buildTrends(recent, limit);
  }
  return ok(trends.map((t) => ({ contextLabel: label, hashtag: t.hashtag, postCount: t.postCount, uniqueAuthorCount: t.uniqueAuthorCount })));
});

route("GET", "/api/posts/tags/:tag", ({ db, me, params, query }) => {
  const wanted = `#${params.tag.replace(/^#/, "")}`.toLocaleLowerCase("tr-TR");
  const posts = visiblePosts(db)
    .filter((p) => extractHashtags(p.content).some((tag) => tag.toLocaleLowerCase("tr-TR") === wanted))
    .sort(byNewest);
  return page(db, me, posts, query);
});

const reactionTime = (post: DemoPost, list: "likes" | "bookmarks", userId: string) =>
  Date.parse(post[list].find((r) => r.userId === userId)?.createdAtUtc ?? "");

route("GET", "/api/posts/bookmarks", ({ db, me, query }) => {
  const posts = visiblePosts(db).filter((p) => p.bookmarks.some((b) => b.userId === me.id))
    .sort((a, b) => reactionTime(b, "bookmarks", me.id) - reactionTime(a, "bookmarks", me.id) || b.id.localeCompare(a.id));
  return page(db, me, posts, query);
});

route("GET", "/api/posts/liked", ({ db, me, query }) => {
  const userId = query.get("userId") ?? me.id;
  const posts = visiblePosts(db).filter((p) => p.likes.some((l) => l.userId === userId))
    .sort((a, b) => reactionTime(b, "likes", userId) - reactionTime(a, "likes", userId) || b.id.localeCompare(a.id));
  return page(db, me, posts, query);
});

const findPost = (db: DemoDb, id: string) => visiblePosts(db).find((post) => post.id === id);

route("GET", "/api/posts/:id", ({ db, me, params }) => {
  const post = findPost(db, params.id);
  if (!post) return notFound("Gönderi bulunamadı.");
  return ok({ post: toPost(db, post, me), comments: post.comments.map((c) => toComment(db, c)) });
});

route("POST", "/api/posts", async ({ db, me, form }) => {
  const content = text(form?.get("content"));
  const image = form?.get("image");
  const groupId = text(form?.get("groupId")) || undefined;
  if (!content && !(image instanceof File)) return badRequest("Gönderi metni veya görsel gerekli.");
  if (content.length > 1500) return badRequest("Gönderi en fazla 1500 karakter olabilir.");
  if (image instanceof File) {
    const error = validateImage(image);
    if (error) return badRequest(error);
  }
  if (groupId) {
    const group = db.groups.find((g) => g.id === groupId && g.isActive);
    if (!group) return notFound("Topluluk bulunamadı.");
    if (!group.members.some((m) => m.userId === me.id)) return forbidden();
  }
  const post: DemoPost = {
    id: newId("p"), userId: me.id, groupId, content, isDeleted: false,
    imageUrl: image instanceof File ? await imageToDataUrl(image, 1200) : undefined,
    likes: [], bookmarks: [], viewerIds: [], comments: [], createdAtUtc: nowIso(),
  };
  db.posts.push(post);
  saveDb();
  return ok(toPost(db, post, me));
});

route("PUT", "/api/posts/:id", async ({ db, me, params, form }) => {
  const post = findPost(db, params.id);
  if (!post) return notFound("Gönderi bulunamadı.");
  if (!canManage(post, me)) return forbidden();
  const content = text(form?.get("content"));
  if (!content) return badRequest("Gönderi metni boş olamaz.");
  const image = form?.get("image");
  if (image instanceof File) {
    const error = validateImage(image);
    if (error) return badRequest(error);
    post.imageUrl = await imageToDataUrl(image, 1200);
  } else if (form?.get("removeImage") === "true") {
    post.imageUrl = undefined;
  }
  post.content = content;
  saveDb();
  return ok(toPost(db, post, me));
});

route("DELETE", "/api/posts/:id", ({ db, me, params }) => {
  const post = findPost(db, params.id);
  if (!post) return notFound("Gönderi bulunamadı.");
  if (!canManage(post, me)) return forbidden();
  post.isDeleted = true;
  saveDb();
  return noContent();
});

route("POST", "/api/posts/:id/like", ({ db, me, params }) => {
  const post = findPost(db, params.id);
  if (!post) return notFound("Gönderi bulunamadı.");
  if (post.likes.some((l) => l.userId === me.id)) {
    post.likes = post.likes.filter((l) => l.userId !== me.id);
  } else {
    post.likes.push({ userId: me.id, createdAtUtc: nowIso() });
    if (post.userId !== me.id) {
      notify(db, post.userId, `${me.fullName} gönderini beğendi`, excerpt(post.content, "Gönderine yeni bir beğeni geldi."), "social", `/post/${post.id}`);
    }
  }
  saveDb();
  return noContent();
});

route("POST", "/api/posts/:id/bookmark", ({ db, me, params }) => {
  const post = findPost(db, params.id);
  if (!post) return notFound("Gönderi bulunamadı.");
  const isBookmarked = !post.bookmarks.some((b) => b.userId === me.id);
  post.bookmarks = isBookmarked
    ? [...post.bookmarks, { userId: me.id, createdAtUtc: nowIso() }]
    : post.bookmarks.filter((b) => b.userId !== me.id);
  saveDb();
  return ok({ isBookmarked });
});

route("POST", "/api/posts/:id/view", ({ db, me, params }) => {
  const post = findPost(db, params.id);
  if (!post) return notFound("Gönderi bulunamadı.");
  if (!post.viewerIds.includes(me.id)) {
    post.viewerIds.push(me.id);
    saveDb();
  }
  return ok({ viewsCount: post.viewerIds.length });
});

route("GET", "/api/posts/:id/comments", ({ db, params }) => {
  const post = findPost(db, params.id);
  return post ? ok(post.comments.map((c) => toComment(db, c))) : notFound("Gönderi bulunamadı.");
});

route("POST", "/api/posts/:id/comments", ({ db, me, params, body }) => {
  const post = findPost(db, params.id);
  if (!post) return notFound("Gönderi bulunamadı.");
  const content = text(body.content);
  if (!content) return badRequest("Yorum boş olamaz.");
  if (content.length > 500) return badRequest("Yorum en fazla 500 karakter olabilir.");
  const comment = { id: newId("c"), userId: me.id, content, createdAtUtc: nowIso() };
  post.comments.push(comment);
  if (post.userId !== me.id) {
    notify(db, post.userId, `${me.fullName} gönderine yorum yaptı`, excerpt(content, "Gönderine yeni bir yorum geldi."), "social", `/post/${post.id}`);
  }
  saveDb();
  return ok(toComment(db, comment));
});

route("DELETE", "/api/posts/:postId/comments/:commentId", ({ db, me, params }) => {
  const post = db.posts.find((p) => p.id === params.postId);
  const comment = post?.comments.find((c) => c.id === params.commentId);
  if (!post || !comment) return notFound("Yorum bulunamadı.");
  if (comment.userId !== me.id && post.userId !== me.id && !isPrivileged(me)) return forbidden();
  post.comments = post.comments.filter((c) => c.id !== comment.id);
  saveDb();
  return noContent();
});
