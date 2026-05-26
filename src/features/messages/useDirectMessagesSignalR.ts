import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { getAccessToken } from "@/features/auth/token";
import { messageKeys } from "@/features/messages/hooks";
import type { ReceiveMessagePayload } from "@/features/messages/types";
import { registerSignalRConnection } from "@/lib/signalrLifecycle";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

export function useDirectMessagesSignalR(enabled: boolean) {
  const queryClient = useQueryClient();
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const base = API_BASE_URL.replace(/\/$/, "");

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${base}/hubs/direct-messages`, {
        accessTokenFactory: () => getAccessToken() ?? "",
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .build();

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

    connectionRef.current = connection;
    const unregister = registerSignalRConnection(connection);
    void connection.start().catch(() => {
      /* REST ile devam */
    });

    return () => {
      unregister();
      void connection.stop();
      connectionRef.current = null;
    };
  }, [enabled, queryClient]);
}
