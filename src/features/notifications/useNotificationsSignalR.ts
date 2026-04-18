import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { getAccessToken } from "@/features/auth/token";
import { normalizeNotification } from "@/features/notifications/api";
import { notificationKeys } from "@/features/notifications/hooks";
import type { AppNotification, NotificationTypeValue } from "@/features/notifications/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationTypeValue;
  createdAtUtc: string;
  targetPath?: string | null;
}

export function useNotificationsSignalR(enabled: boolean) {
  const queryClient = useQueryClient();
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const base = API_BASE_URL.replace(/\/$/, "");
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${base}/hubs/notifications`, {
        accessTokenFactory: () => getAccessToken() ?? "",
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .build();

    connection.on("NotificationReceived", (payload: NotificationPayload) => {
      if (!payload?.id) {
        return;
      }

      const normalized = normalizeNotification(payload);
      queryClient.setQueryData<AppNotification[]>(
        notificationKeys.list(),
        (current = []) => {
          const withoutCurrent = current.filter((item) => item.id !== normalized.id);
          return [normalized, ...withoutCurrent].sort(
            (left, right) =>
              new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
          );
        },
      );
    });

    connectionRef.current = connection;
    void connection.start().catch(() => {
      /* polling ile devam */
    });

    return () => {
      void connection.stop();
      connectionRef.current = null;
    };
  }, [enabled, queryClient]);
}
