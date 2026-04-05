import axios from "axios";
import { getApiErrorMessage } from "@/features/auth/api";
import { getAccessToken } from "@/features/auth/token";
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
}

export async function getNotifications(): Promise<AppNotification[]> {
  try {
    const response = await notificationsApi.get<ApiNotificationResponse[]>(
      "/api/notifications",
      getAuthorizedConfig(),
    );

    return response.data.map(normalizeNotification);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function markNotificationRead(notificationId: string) {
  try {
    await notificationsApi.put(
      `/api/notifications/${notificationId}/read`,
      undefined,
      getAuthorizedConfig(),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function markAllNotificationsRead() {
  try {
    await notificationsApi.put(
      "/api/notifications/read-all",
      undefined,
      getAuthorizedConfig(),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

function getAuthorizedConfig() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Oturum bulunamadi. Lutfen yeniden giris yapin.");
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
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
    link: getNotificationLink(notification.type),
  };
}

function getNotificationLink(type: NotificationKind) {
  switch (type) {
    case "social":
      return "/feed";
    case "event":
      return "/events";
    case "marketplace":
      return "/market?tab=discounts";
    default:
      return "/";
  }
}
