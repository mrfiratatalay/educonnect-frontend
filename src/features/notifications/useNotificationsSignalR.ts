import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { normalizeNotification } from "@/features/notifications/api";
import { notificationKeys } from "@/features/notifications/hooks";
import type { AppNotification, NotificationTypeValue } from "@/features/notifications/types";
import { createRealtimeConnection } from "@/lib/realtime";
import { registerSignalRConnection } from "@/lib/signalrLifecycle";

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

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const connection = createRealtimeConnection("/hubs/notifications");

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

    const unregister = registerSignalRConnection(connection);
    void connection.start().catch(() => {
      /* polling ile devam */
    });

    return () => {
      unregister();
      void connection.stop();
    };
  }, [enabled, queryClient]);
}
