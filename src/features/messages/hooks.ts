import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getConversations,
  getMessages,
  sendMessage,
  startConversation,
} from "@/features/messages/api";

export const messageKeys = {
  all: ["direct-messages"] as const,
  conversations: () => [...messageKeys.all, "conversations"] as const,
  messages: (conversationId: string, page: number) =>
    [...messageKeys.all, "messages", conversationId, page] as const,
};

export function useConversationsQuery(enabled = true) {
  return useQuery({
    queryKey: messageKeys.conversations(),
    queryFn: () => getConversations(),
    enabled,
  });
}

export function useMessagesQuery(
  conversationId: string | undefined,
  page = 1,
  enabled = true,
) {
  return useQuery({
    queryKey: messageKeys.messages(conversationId ?? "", page),
    queryFn: () => getMessages(conversationId!, page, 30),
    enabled: enabled && Boolean(conversationId),
  });
}

export function useStartConversationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (otherUserId: string) => startConversation(otherUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
    },
  });
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => sendMessage(conversationId, content),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      void queryClient.invalidateQueries({
        queryKey: [...messageKeys.all, "messages", variables.conversationId],
      });
    },
  });
}
