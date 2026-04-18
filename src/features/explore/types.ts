export type ExploreTrendTabKey =
  | "for-you"
  | "campus";

export type ExploreTrendKind =
  | "hashtag"
  | "announcement"
  | "community"
  | "event"
  | "discount";

export interface ExploreTrendItem {
  id: string;
  primaryTab: "campus";
  kind: ExploreTrendKind;
  contextLabel: string;
  title: string;
  metricLabel: string;
  targetPath: string;
}

export interface ExploreSidebarSuggestion {
  id: string;
  name: string;
  handle: string;
  avatarSeed: string;
  avatarUrl?: string;
  targetPath: string;
  ctaLabel: string;
  reasonLabel?: string;
  actionableUserId?: string;
  isFollowedByCurrentUser?: boolean;
}

export interface ExploreDiscoveryData {
  trends: ExploreTrendItem[];
  suggestions: ExploreSidebarSuggestion[];
}

export interface GetExploreDiscoveryInput {
  tab: ExploreTrendTabKey;
  query?: string;
}
