import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import {
  getMyProfile,
  getUserProfile,
  uploadMyAvatar,
  updateMyProfile,
  type PublicUserProfile,
  type UpdateMyProfileInput,
} from "@/features/users/api";
import type { User } from "@/types";

export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  detail: (userId: string) => [...userKeys.all, userId] as const,
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

function syncProfileCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  updateUser: (updates: Partial<User>) => void,
  profile: User,
) {
  queryClient.setQueryData(userKeys.me(), profile);
  queryClient.setQueryData(userKeys.detail(profile.id), profile);
  updateUser(profile);
}
