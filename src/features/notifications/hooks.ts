import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/features/notifications/api";
import type { AppNotification } from "@/features/notifications/types";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
};

export function useNotificationsQuery(enabled = true) {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: (): Promise<AppNotification[]> => getNotifications(),
    enabled,
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData<AppNotification[]>(
        notificationKeys.list(),
        (notifications = []) =>
          notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification,
          ),
      );
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.setQueryData<AppNotification[]>(
        notificationKeys.list(),
        (notifications = []) =>
          notifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
      );
    },
  });
}
