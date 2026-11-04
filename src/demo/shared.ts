import { newId } from "@/demo/db";
import { toNotification } from "@/demo/mappers";
import { emitDemoHubEvent } from "@/demo/realtime";
import { nowIso } from "@/demo/time";
import type { DemoDb, DemoNotificationType, DemoPost } from "@/demo/types";

/** Same rule as BuildNotificationExcerpt: trimmed content, at most 140 characters. */
export function excerpt(content: string, fallback: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (!normalized) return fallback;
  return normalized.length <= 140 ? normalized : `${normalized.slice(0, 140).trimEnd()}...`;
}

/**
 * Stores a notification and, if it belongs to the signed-in user, pushes it
 * through the notifications hub like NotificationPublisher does.
 */
export function notify(db: DemoDb, userId: string, title: string, message: string, type: DemoNotificationType, targetPath: string) {
  const notification = { id: newId("n"), userId, title, message, type, targetPath, isRead: false, createdAtUtc: nowIso() };
  db.notifications.push(notification);
  if (userId === db.sessionUserId) {
    emitDemoHubEvent("/hubs/notifications", "NotificationReceived", toNotification(notification));
  }
}

export function visiblePosts(db: DemoDb) {
  const activeGroups = new Set(db.groups.filter((g) => g.isActive).map((g) => g.id));
  return db.posts.filter((post) => !post.isDeleted && (!post.groupId || activeGroups.has(post.groupId)));
}

const HASHTAG = /(?<![\p{L}\p{N}_])#([\p{L}\p{N}_]{2,40})/gu;

/** Port of PostTrendAnalyzer.ExtractHashtags. */
export function extractHashtags(content: string) {
  const seen = new Map<string, string>();
  for (const match of content.matchAll(HASHTAG)) {
    const tag = `#${match[1]}`;
    const key = tag.toLocaleLowerCase("tr-TR");
    if (!seen.has(key)) seen.set(key, tag);
  }
  return Array.from(seen.values());
}

export interface TrendAggregate {
  hashtag: string;
  postCount: number;
  uniqueAuthorCount: number;
  lastUsedAtUtc: string;
}

/** Port of PostTrendAnalyzer.Build: most posts, then most authors, then most recent. */
export function buildTrends(posts: DemoPost[], limit: number): TrendAggregate[] {
  const map = new Map<string, { hashtag: string; posts: number; authors: Set<string>; last: number }>();
  for (const post of posts) {
    for (const tag of extractHashtags(post.content)) {
      const key = tag.toLocaleLowerCase("tr-TR");
      const entry = map.get(key) ?? { hashtag: tag, posts: 0, authors: new Set<string>(), last: 0 };
      entry.posts += 1;
      entry.authors.add(post.userId);
      entry.last = Math.max(entry.last, Date.parse(post.createdAtUtc));
      map.set(key, entry);
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.posts - a.posts || b.authors.size - a.authors.size || b.last - a.last)
    .slice(0, limit)
    .map((entry) => ({
      hashtag: entry.hashtag,
      postCount: entry.posts,
      uniqueAuthorCount: entry.authors.size,
      lastUsedAtUtc: new Date(entry.last).toISOString(),
    }));
}

const TURKISH_FOLD: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };

/** Lower-case, Turkish letters folded to ASCII, accents removed. */
export function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıöşü]/g, (char) => TURKISH_FOLD[char])
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export function slugify(value: string) {
  return normalizeSearch(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "topluluk";
}

export function handleOf(fullName: string) {
  return normalizeSearch(fullName).replace(/[^a-z0-9]/g, "") || "educonnect";
}

export function withinDays(isoDate: string, days: number) {
  return Date.now() - Date.parse(isoDate) <= days * 24 * 60 * 60 * 1000;
}
