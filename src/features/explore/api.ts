import axios from "axios";
import { getApiErrorMessage } from "@/features/auth/api";
import { executeAuthorizedRequest } from "@/features/auth/authenticatedRequest";
import type {
  ExploreDiscoveryData,
  ExploreSidebarSuggestion,
  ExploreTrendItem,
  GetExploreDiscoveryInput,
} from "@/features/explore/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

const exploreApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

interface ApiExploreTrendItemResponse {
  id: string;
  primaryTab: ExploreTrendItem["primaryTab"];
  kind: ExploreTrendItem["kind"];
  contextLabel: string;
  title: string;
  metricLabel: string;
  targetPath: string;
}

interface ApiExploreSuggestionResponse {
  id: string;
  name: string;
  handle: string;
  avatarSeed: string;
  avatarUrl?: string | null;
  targetPath: string;
  ctaLabel: string;
  reasonLabel?: string;
  actionableUserId?: string;
  isFollowedByCurrentUser?: boolean;
}

interface ApiExploreDiscoveryResponse {
  trends: ApiExploreTrendItemResponse[];
  suggestions: ApiExploreSuggestionResponse[];
}

export async function getExploreDiscovery(
  input: GetExploreDiscoveryInput,
): Promise<ExploreDiscoveryData> {
  const query = input.query?.trim();

  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      exploreApi.get<ApiExploreDiscoveryResponse>("/api/explore/discovery", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          tab: input.tab,
          query: query || undefined,
        },
      }),
    );

    return {
      trends: response.data.trends.map(normalizeTrend),
      suggestions: response.data.suggestions.map(normalizeSuggestion),
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

function normalizeTrend(item: ApiExploreTrendItemResponse): ExploreTrendItem {
  return {
    id: item.id,
    primaryTab: item.primaryTab,
    kind: item.kind,
    contextLabel: item.contextLabel,
    title: item.title,
    metricLabel: item.metricLabel,
    targetPath: item.targetPath,
  };
}

function normalizeSuggestion(
  item: ApiExploreSuggestionResponse,
): ExploreSidebarSuggestion {
  return {
    id: item.id,
    name: item.name,
    handle: item.handle,
    avatarSeed: item.avatarSeed,
    avatarUrl: item.avatarUrl || undefined,
    targetPath: item.targetPath,
    ctaLabel: item.ctaLabel,
    reasonLabel: item.reasonLabel || undefined,
    actionableUserId: item.actionableUserId || undefined,
    isFollowedByCurrentUser: Boolean(item.isFollowedByCurrentUser),
  };
}
