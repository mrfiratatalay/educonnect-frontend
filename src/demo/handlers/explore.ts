import { rankSuggestions } from "@/demo/handlers/users";
import { ok, route } from "@/demo/http";
import { buildTrends, handleOf, normalizeSearch, visiblePosts, withinDays } from "@/demo/shared";
import type { DemoDb, DemoUser } from "@/demo/types";

const DISCOUNT_WORDS = ["indirim", "firsat", "kampanya", "kupon"];
const COMMUNITY_WORDS = ["topluluk", "kulup", "kulübü", "toplulugu"];

/** Port of ExploreController's live trends: last 7 days, scoped to the user's university when possible. */
function liveTrends(db: DemoDb, me: DemoUser, tab: string, query: string) {
  const universityOf = (userId: string) => db.users.find((u) => u.id === userId)?.universityId;
  const recent = visiblePosts(db).filter((p) => withinDays(p.createdAtUtc, 7));
  const campus = recent.filter((p) => universityOf(p.userId) === me.universityId);
  const scoped = campus.length > 0;
  const contextLabel = tab === "for-you"
    ? (scoped ? "Kampüs - Sana özel" : "Platform - Sana özel")
    : (scoped ? "Kampüs - Üniversitende gündemde" : "Platformda - Gündemdekiler");

  return buildTrends(scoped ? campus : recent, 50)
    .map((trend) => {
      const name = normalizeSearch(trend.hashtag.slice(1));
      const kind = DISCOUNT_WORDS.some((w) => name.includes(w)) ? "discount"
        : COMMUNITY_WORDS.some((w) => name.includes(normalizeSearch(w))) ? "community" : "hashtag";
      return {
        id: `trend-${name}`,
        primaryTab: "campus",
        kind,
        contextLabel,
        title: trend.hashtag,
        metricLabel: `${trend.postCount} gönderi`,
        targetPath: `/explore/tag/${encodeURIComponent(trend.hashtag.slice(1))}`,
      };
    })
    .filter((item) => !query || normalizeSearch(`${item.title} ${item.contextLabel}`).includes(query))
    .slice(0, 12);
}

function suggestionReason(mutualGroups: number, sameUniversity: boolean, sameDepartment: boolean, recentPosts: number) {
  if (mutualGroups > 0) return `${mutualGroups} ortak topluluk`;
  if (sameUniversity) return "Aynı üniversiteden";
  if (sameDepartment) return "Benzer bölüm ilgisi";
  if (recentPosts > 0) return "Son günlerde aktif";
  return "Keşfet için öneriliyor";
}

route("GET", "/api/explore/discovery", ({ db, me, query }) => {
  const tab = query.get("tab") === "campus" ? "campus" : "for-you";
  const term = normalizeSearch(query.get("query") ?? "");
  const suggestions = rankSuggestions(db, me).slice(0, 4).map((candidate) => ({
    id: candidate.user.id,
    name: candidate.user.fullName,
    handle: `@${handleOf(candidate.user.fullName)}`,
    avatarSeed: candidate.user.id,
    avatarUrl: candidate.user.avatarUrl ?? null,
    targetPath: `/profile/${candidate.user.id}`,
    ctaLabel: "Takip et",
    reasonLabel: suggestionReason(
      candidate.mutualGroups,
      candidate.user.universityId === me.universityId,
      candidate.user.department === me.department,
      candidate.recentPosts,
    ),
    actionableUserId: candidate.user.id,
    isFollowedByCurrentUser: candidate.followed,
  }));
  return ok({ trends: liveTrends(db, me, tab, term), suggestions });
});
