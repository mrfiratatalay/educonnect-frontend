export type ExploreTrendTabKey =
  | "for-you"
  | "campus"
  | "academic"
  | "career"
  | "events";

export type ExploreTrendKind =
  | "hashtag"
  | "announcement"
  | "community"
  | "event"
  | "discount";

export interface ExploreTrendItem {
  id: string;
  primaryTab: Exclude<ExploreTrendTabKey, "for-you">;
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
  targetPath: string;
  ctaLabel: string;
}

export interface ExploreDiscoveryData {
  trends: ExploreTrendItem[];
  suggestions: ExploreSidebarSuggestion[];
}

export interface GetExploreDiscoveryInput {
  tab: ExploreTrendTabKey;
  query?: string;
}
