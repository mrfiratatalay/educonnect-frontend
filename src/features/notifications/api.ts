import axios from "axios";
import { getApiErrorMessage } from "@/features/auth/api";
import { executeAuthorizedRequest } from "@/features/auth/authenticatedRequest";
import type {
  AppNotification,
  NotificationKind,
} from "@/features/notifications/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

const notificationsApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

interface ApiNotificationResponse {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationKind;
  createdAtUtc: string;
  targetPath?: string | null;
}

export async function getNotifications(): Promise<AppNotification[]> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      notificationsApi.get<ApiNotificationResponse[]>(
        "/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return response.data.map(normalizeNotification);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function markNotificationRead(notificationId: string) {
  try {
    await executeAuthorizedRequest((accessToken) =>
      notificationsApi.put(
        `/api/notifications/${notificationId}/read`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function markAllNotificationsRead() {
  try {
    await executeAuthorizedRequest((accessToken) =>
      notificationsApi.put(
        "/api/notifications/read-all",
        undefined,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

function normalizeNotification(
  notification: ApiNotificationResponse,
): AppNotification {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    type: notification.type,
    createdAt: notification.createdAtUtc,
    link: notification.targetPath || getNotificationLink(notification.type),
  };
}

function getNotificationLink(type: NotificationKind) {
  switch (type) {
    case "social":
      return "/";
    case "event":
      return "/events";
    case "marketplace":
      return "/market?tab=discounts";
    default:
      return "/";
  }
}
