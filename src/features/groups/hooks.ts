import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGroup,
  getGroup,
  getGroups,
  joinGroup,
  leaveGroup,
} from "@/features/groups/api";
import type { AppGroup, CreateGroupInput } from "@/features/groups/types";

export const groupKeys = {
  all: ["groups"] as const,
  list: () => [...groupKeys.all, "list"] as const,
  detail: (groupId: string) => [...groupKeys.all, "detail", groupId] as const,
};

export function useGroupsQuery(enabled = true) {
  return useQuery({
    queryKey: groupKeys.list(),
    queryFn: (): Promise<AppGroup[]> => getGroups(),
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

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateGroupInput) => createGroup(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: groupKeys.all });
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
