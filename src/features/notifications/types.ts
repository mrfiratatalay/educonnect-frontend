export type NotificationKind =
  | "general"
  | "social"
  | "event"
  | "marketplace"
  | "system";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationKind;
  createdAt: string;
  link: string;
}
