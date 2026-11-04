import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { messageKeys } from "@/features/messages/hooks";
import type { ReceiveMessagePayload } from "@/features/messages/types";
import { createRealtimeConnection } from "@/lib/realtime";
import { registerSignalRConnection } from "@/lib/signalrLifecycle";

export function useDirectMessagesSignalR(enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const connection = createRealtimeConnection("/hubs/direct-messages");

    connection.on("ReceiveMessage", (payload: ReceiveMessagePayload) => {
      if (!payload?.conversationId) {
        return;
      }
      void queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      void queryClient.invalidateQueries({
        predicate: (q) => {
          const k = q.queryKey;
          return (
            Array.isArray(k) &&
            k[0] === messageKeys.all[0] &&
            k[1] === "messages" &&
            k[2] === payload.conversationId
          );
        },
      });
    });

    const unregister = registerSignalRConnection(connection);
    void connection.start().catch(() => {
      /* REST ile devam */
    });

    return () => {
      unregister();
      void connection.stop();
    };
  }, [enabled, queryClient]);
}
