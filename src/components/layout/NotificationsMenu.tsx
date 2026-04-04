import type { MouseEvent } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/features/notifications/hooks";

interface NotificationsMenuProps {
  align?: "start" | "center" | "end";
  buttonClassName?: string;
  iconClassName?: string;
}

export default function NotificationsMenu({
  align = "end",
  buttonClassName,
  iconClassName,
}: NotificationsMenuProps) {
  const navigate = useNavigate();
  const notificationsQuery = useNotificationsQuery();
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  function handleNotificationClick(notificationId: string, link: string) {
    void markReadMutation.mutateAsync(notificationId);
    navigate(link);
  }

  function handleMarkAllRead(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    void markAllReadMutation.mutateAsync();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={buttonClassName}
          aria-label="Bildirimler"
        >
          <Bell className={iconClassName} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-80">
        <div className="flex items-center justify-between px-2">
          <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground"
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending}
            >
              <CheckCheck className="w-3 h-3" />
              Tumunu Okundu Yap
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {notificationsQuery.isLoading && (
          <div className="px-2 py-3 text-sm text-muted-foreground">
            Bildirimler yukleniyor...
          </div>
        )}

        {notificationsQuery.error instanceof Error && (
          <div className="px-2 py-3 text-sm text-destructive">
            {notificationsQuery.error.message}
          </div>
        )}

        {!notificationsQuery.isLoading && notifications.length === 0 && (
          <div className="px-2 py-3 text-sm text-muted-foreground">
            Henuz bildirimin yok.
          </div>
        )}

        {notifications.slice(0, 5).map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            onClick={() =>
              handleNotificationClick(notification.id, notification.link)
            }
            className={`flex cursor-pointer flex-col items-start gap-1 py-2 ${!notification.isRead ? "bg-primary/5" : ""}`}
          >
            <div className="flex w-full items-center gap-2">
              <span className="text-sm font-medium">{notification.title}</span>
              {!notification.isRead && (
                <Badge
                  variant="default"
                  className="ml-auto px-1.5 py-0 text-[10px]"
                >
                  Yeni
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {notification.message}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
