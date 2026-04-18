import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getConversations,
  getMessages,
  searchUsers,
  sendMessage,
  startConversation,
} from "@/features/messages/api";
import type { DirectMessageItem } from "@/features/messages/types";

export const messageKeys = {
  all: ["direct-messages"] as const,
  conversations: () => [...messageKeys.all, "conversations"] as const,
  messages: (conversationId: string) =>
    [...messageKeys.all, "messages", conversationId] as const,
  userSearch: (q: string) => [...messageKeys.all, "user-search", q] as const,
};

export function useConversationsQuery(enabled = true) {
  return useQuery({
    queryKey: messageKeys.conversations(),
    queryFn: () => getConversations(),
    enabled,
    refetchInterval: 30_000,
  });
}

export function useInfiniteMessagesQuery(
  conversationId: string | undefined,
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: messageKeys.messages(conversationId ?? ""),
    queryFn: ({ pageParam }) =>
      getMessages(conversationId!, pageParam as number, 30),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const loaded = (lastPage.page - 1) * lastPage.pageSize + lastPage.items.length;
      return loaded < lastPage.totalCount ? lastPage.page + 1 : undefined;
    },
    enabled: enabled && Boolean(conversationId),
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      messages: data.pages.flatMap((p) => p.items),
      hasOlderMessages: data.pages[data.pages.length - 1] !== undefined &&
        (() => {
          const last = data.pages[data.pages.length - 1]!;
          const loaded = (last.page - 1) * last.pageSize + last.items.length;
          return loaded < last.totalCount;
        })(),
    }),
  });
}

export function useUserSearchQuery(q: string) {
  return useQuery({
    queryKey: messageKeys.userSearch(q),
    queryFn: () => searchUsers(q),
    enabled: q.trim().length >= 2,
    staleTime: 10_000,
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
    onMutate: async ({ conversationId, content }) => {
      await queryClient.cancelQueries({ queryKey: messageKeys.messages(conversationId) });

      const optimisticMsg: DirectMessageItem = {
        id: `optimistic-${Date.now()}`,
        senderUserId: "__optimistic__",
        content,
        sentAtUtc: new Date().toISOString(),
      };

      queryClient.setQueryData(
        messageKeys.messages(conversationId),
        (old: { pages: { items: DirectMessageItem[] }[] } | undefined) => {
          if (!old) return old;
          const pages = [...old.pages];
          const lastPage = { ...pages[0]!, items: [...pages[0]!.items, optimisticMsg] };
          return { ...old, pages: [lastPage, ...pages.slice(1)] };
        },
      );

      return { optimisticMsg, conversationId };
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      void queryClient.invalidateQueries({
        queryKey: messageKeys.messages(variables.conversationId),
      });
    },
    onError: (_err, variables) => {
      void queryClient.invalidateQueries({
        queryKey: messageKeys.messages(variables.conversationId),
      });
    },
  });
}
