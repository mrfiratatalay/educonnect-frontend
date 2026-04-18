import axios from "axios";
import { getApiErrorMessage } from "@/features/auth/api";
import { executeAuthorizedRequest } from "@/features/auth/authenticatedRequest";
import type {
  AppNotification,
  NotificationKind,
  NotificationTypeValue,
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
  type: NotificationTypeValue;
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

export function normalizeNotification(
  notification: ApiNotificationResponse,
): AppNotification {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    type: normalizeNotificationKind(notification.type),
    createdAt: notification.createdAtUtc,
    link:
      notification.targetPath ||
      getNotificationLink(normalizeNotificationKind(notification.type)),
  };
}

function normalizeNotificationKind(value: NotificationTypeValue): NotificationKind {
  if (typeof value === "number") {
    switch (value) {
      case 2:
        return "social";
      case 3:
        return "event";
      case 4:
        return "marketplace";
      case 5:
        return "system";
      default:
        return "general";
    }
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    switch (normalized) {
      case "social":
      case "event":
      case "marketplace":
      case "system":
      case "general":
        return normalized;
      default:
        return "general";
    }
  }

  return "general";
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
