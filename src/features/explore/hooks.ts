import { useQuery } from "@tanstack/react-query";
import { getExploreDiscovery } from "@/features/explore/api";
import type { ExploreDiscoveryData, GetExploreDiscoveryInput } from "@/features/explore/types";

export const exploreKeys = {
  all: ["explore"] as const,
  discovery: (tab: string, query: string) =>
    [...exploreKeys.all, "discovery", tab, query] as const,
};

export function useExploreDiscoveryQuery(
  input: GetExploreDiscoveryInput,
  enabled = true,
) {
  const query = input.query?.trim() ?? "";

  return useQuery({
    queryKey: exploreKeys.discovery(input.tab, query),
    queryFn: (): Promise<ExploreDiscoveryData> =>
      getExploreDiscovery({ tab: input.tab, query: query || undefined }),
    enabled,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: (previousData) => previousData,
  });
}
