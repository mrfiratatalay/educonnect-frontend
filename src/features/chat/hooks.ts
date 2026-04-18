import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as chatApi from "@/features/chat/api";
import type { SendMessageInput } from "@/features/chat/types";

const CHAT_KEYS = {
  sessions: ["chat", "sessions"] as const,
  messages: (sessionId: string) =>
    ["chat", "messages", sessionId] as const,
};

export function useSessionsQuery() {
  return useQuery({
    queryKey: CHAT_KEYS.sessions,
    queryFn: chatApi.getSessions,
  });
}

export function useMessagesQuery(sessionId: string | null) {
  return useQuery({
    queryKey: CHAT_KEYS.messages(sessionId ?? ""),
    queryFn: () => chatApi.getMessages(sessionId!),
    enabled: !!sessionId,
  });
}

export function useStartSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.startSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.sessions });
    },
  });
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, message }: SendMessageInput) =>
      chatApi.sendMessage(sessionId, message),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.sessions });
      queryClient.invalidateQueries({
        queryKey: CHAT_KEYS.messages(variables.sessionId),
      });
    },
  });
}

export function useEndSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.endSession,
    onSuccess: (_data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.sessions });
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.messages(sessionId) });
    },
  });
}

export function useDeleteSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.deleteSessionPermanent,
    onSuccess: (_data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.sessions });
      queryClient.removeQueries({ queryKey: CHAT_KEYS.messages(sessionId) });
    },
  });
}
