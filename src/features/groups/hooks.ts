import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGroup,
  getDiscoverGroups,
  getGroup,
  getGroupBySlug,
  getGroupPosts,
  getGroups,
  getJoinedGroups,
  getJoinedGroupsFeed,
  joinGroup,
  leaveGroup,
  updateGroup,
} from "@/features/groups/api";
import type {
  AppGroup,
  AppGroupDetail,
  CreateGroupInput,
  DiscoverGroupsInput,
  UpdateGroupInput,
} from "@/features/groups/types";
import type { PostsPage } from "@/features/posts/types";

export const groupKeys = {
  all: ["groups"] as const,
  list: () => [...groupKeys.all, "list"] as const,
  joined: (limit: number) => [...groupKeys.all, "joined", limit] as const,
  discover: (query: string, limit: number) => [...groupKeys.all, "discover", query, limit] as const,
  detail: (groupId: string) => [...groupKeys.all, "detail", groupId] as const,
  detailBySlug: (slug: string) => [...groupKeys.all, "detail-by-slug", slug] as const,
  posts: (groupId: string, pageSize: number) => [...groupKeys.all, "posts", groupId, pageSize] as const,
  feed: (pageSize: number) => [...groupKeys.all, "feed", pageSize] as const,
};

export function useGroupsQuery(enabled = true) {
  return useQuery({
    queryKey: groupKeys.list(),
    queryFn: (): Promise<AppGroup[]> => getGroups(),
    enabled,
  });
}

export function useJoinedGroupsQuery(limit = 12, enabled = true) {
  return useQuery({
    queryKey: groupKeys.joined(limit),
    queryFn: (): Promise<AppGroup[]> => getJoinedGroups(limit),
    enabled,
  });
}

export function useDiscoverGroupsQuery(input: DiscoverGroupsInput = {}, enabled = true) {
  const limit = input.limit ?? 12;
  const query = input.query?.trim() ?? "";

  return useQuery({
    queryKey: groupKeys.discover(query, limit),
    queryFn: (): Promise<AppGroup[]> => getDiscoverGroups({ query, limit }),
    enabled,
  });
}

export function useGroupDetailQuery(groupId?: string, enabled = true) {
  return useQuery({
    queryKey: groupId ? groupKeys.detail(groupId) : [...groupKeys.all, "detail"],
    queryFn: (): Promise<AppGroup> => getGroup(groupId!),
    enabled: enabled && Boolean(groupId),
  });
}

export function useGroupBySlugQuery(slug?: string, enabled = true) {
  return useQuery({
    queryKey: slug ? groupKeys.detailBySlug(slug) : [...groupKeys.all, "detail-by-slug"],
    queryFn: (): Promise<AppGroupDetail> => getGroupBySlug(slug!),
    enabled: enabled && Boolean(slug),
  });
}

export function useInfiniteJoinedGroupsFeedQuery(pageSize = 10, enabled = true) {
  return useInfiniteQuery({
    queryKey: groupKeys.feed(pageSize),
    queryFn: ({ pageParam }): Promise<PostsPage> =>
      getJoinedGroupsFeed({ page: Number(pageParam ?? 1), pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const loadedCount = pages.reduce(
        (count, page) => count + page.items.length,
        0,
      );

      return loadedCount >= lastPage.totalCount ? undefined : pages.length + 1;
    },
    enabled,
  });
}

export function useInfiniteGroupPostsQuery(groupId?: string, pageSize = 10, enabled = true) {
  return useInfiniteQuery({
    queryKey: groupId ? groupKeys.posts(groupId, pageSize) : [...groupKeys.all, "posts", pageSize],
    queryFn: ({ pageParam }): Promise<PostsPage> =>
      getGroupPosts(groupId!, { page: Number(pageParam ?? 1), pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const loadedCount = pages.reduce(
        (count, page) => count + page.items.length,
        0,
      );

      return loadedCount >= lastPage.totalCount ? undefined : pages.length + 1;
    },
    enabled: enabled && Boolean(groupId),
  });
}

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateGroupInput) => createGroup(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}

export function useUpdateGroupMutation(groupId?: string, slug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateGroupInput) => updateGroup(groupId!, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: groupKeys.all }),
        groupId
          ? queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) })
          : Promise.resolve(),
        slug
          ? queryClient.invalidateQueries({ queryKey: groupKeys.detailBySlug(slug) })
          : Promise.resolve(),
      ]);
    },
  });
}

export function useJoinGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => joinGroup(groupId),
    onSuccess: async (_, groupId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: groupKeys.all }),
        queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) }),
      ]);
    },
  });
}

export function useLeaveGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => leaveGroup(groupId),
    onSuccess: async (_, groupId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: groupKeys.all }),
        queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) }),
      ]);
    },
  });
}
