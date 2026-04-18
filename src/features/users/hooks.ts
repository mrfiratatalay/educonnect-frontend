import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "@/features/posts/hooks";
import { useAuthStore } from "@/store/authStore";
import {
  followUser,
  getFollowers,
  getFollowSuggestions,
  getFollowing,
  getMyProfile,
  getUserProfile,
  type FollowSuggestion,
  type UserConnection,
  uploadMyAvatar,
  uploadMyCover,
  unfollowUser,
  updateMyProfile,
  type PublicUserProfile,
  type UpdateMyProfileInput,
} from "@/features/users/api";
import type { User } from "@/types";

export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  detail: (userId: string) => [...userKeys.all, userId] as const,
  followSuggestions: (limit: number) => [...userKeys.all, "follow-suggestions", limit] as const,
  followers: (userId: string) => [...userKeys.all, userId, "followers"] as const,
  following: (userId: string) => [...userKeys.all, userId, "following"] as const,
};

export function useMyProfileQuery(enabled = true) {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: (): Promise<User> => getMyProfile(),
    enabled,
  });
}

export function usePublicProfileQuery(userId?: string, enabled = true) {
  return useQuery({
    queryKey: userId ? userKeys.detail(userId) : [...userKeys.all, "public"],
    queryFn: (): Promise<PublicUserProfile> => getUserProfile(userId!),
    enabled: enabled && Boolean(userId),
  });
}

export function useFollowSuggestionsQuery(limit = 3, enabled = true) {
  return useQuery({
    queryKey: userKeys.followSuggestions(limit),
    queryFn: (): Promise<FollowSuggestion[]> => getFollowSuggestions(limit),
    enabled,
  });
}

export function useFollowersQuery(userId?: string, enabled = true) {
  return useQuery({
    queryKey: userId ? userKeys.followers(userId) : [...userKeys.all, "followers"],
    queryFn: (): Promise<UserConnection[]> => getFollowers(userId!),
    enabled: enabled && Boolean(userId),
  });
}

export function useFollowingUsersQuery(userId?: string, enabled = true) {
  return useQuery({
    queryKey: userId ? userKeys.following(userId) : [...userKeys.all, "following-users"],
    queryFn: (): Promise<UserConnection[]> => getFollowing(userId!),
    enabled: enabled && Boolean(userId),
  });
}

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (input: UpdateMyProfileInput) => updateMyProfile(input),
    onSuccess: (profile) => {
      syncProfileCaches(queryClient, updateUser, profile);
    },
  });
}

export function useFollowUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => followUser(userId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userKeys.all }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === postKeys.all[0] &&
            query.queryKey[1] === "following",
        }),
      ]);
    },
  });
}

export function useUnfollowUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => unfollowUser(userId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userKeys.all }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === postKeys.all[0] &&
            query.queryKey[1] === "following",
        }),
      ]);
    },
  });
}

export function useToggleFollowUserMutation() {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: async ({
      userId,
      isFollowing,
    }: {
      userId: string;
      isFollowing: boolean;
    }) => {
      if (isFollowing) {
        await unfollowUser(userId);
        return { userId, isFollowing: false };
      }

      await followUser(userId);
      return { userId, isFollowing: true };
    },
    onMutate: async ({ userId, isFollowing }) => {
      const previousQueries = queryClient.getQueriesData({ queryKey: userKeys.all });
      const nextIsFollowing = !isFollowing;

      queryClient.setQueriesData(
        { queryKey: userKeys.all },
        (oldData: unknown) => applyFollowStateToUserCaches(oldData, userId, nextIsFollowing, currentUserId),
      );

      return { previousQueries };
    },
    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userKeys.all }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === postKeys.all[0] &&
            query.queryKey[1] === "following",
        }),
      ]);
    },
  });
}

export function useUploadMyAvatarMutation() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (file: File) => uploadMyAvatar(file),
    onSuccess: (profile) => {
      syncProfileCaches(queryClient, updateUser, profile);
    },
  });
}

export function useUploadMyCoverMutation() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (file: File) => uploadMyCover(file),
    onSuccess: (profile) => {
      syncProfileCaches(queryClient, updateUser, profile);
    },
  });
}

function syncProfileCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  updateUser: (updates: Partial<User>) => void,
  profile: User,
) {
  queryClient.setQueryData(userKeys.me(), profile);
  queryClient.setQueryData(userKeys.detail(profile.id), profile);
  updateUser(profile);
}

function applyFollowStateToUserCaches(
  oldData: unknown,
  targetUserId: string,
  isNowFollowing: boolean,
  currentUserId?: string,
) {
  if (!oldData) {
    return oldData;
  }

  if (Array.isArray(oldData)) {
    return oldData.map((item) => {
      if (!item || typeof item !== "object") {
        return item;
      }

      const record = item as Record<string, unknown>;
      if (String(record.id ?? "") !== targetUserId) {
        return item;
      }

      return {
        ...record,
        isFollowedByCurrentUser:
          "isFollowedByCurrentUser" in record ? isNowFollowing : record.isFollowedByCurrentUser,
      };
    });
  }

  if (typeof oldData === "object") {
    const record = oldData as Record<string, unknown>;

    if (String(record.id ?? "") === targetUserId) {
      return {
        ...record,
        isFollowedByCurrentUser:
          "isFollowedByCurrentUser" in record ? isNowFollowing : record.isFollowedByCurrentUser,
        followersCount:
          typeof record.followersCount === "number"
            ? Math.max(0, record.followersCount + (isNowFollowing ? 1 : -1))
            : record.followersCount,
      };
    }

    if (currentUserId && String(record.id ?? "") === currentUserId) {
      return {
        ...record,
        followingCount:
          typeof record.followingCount === "number"
            ? Math.max(0, record.followingCount + (isNowFollowing ? 1 : -1))
            : record.followingCount,
      };
    }
  }

  return oldData;
}
