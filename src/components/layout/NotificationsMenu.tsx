import { useMemo, useState } from "react";
import { Avatar, Badge, Button, Empty, Flex, Popover, Typography, theme } from "antd";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/features/notifications/hooks";

interface NotificationsMenuProps {
  align?: "start" | "center" | "end";
  buttonSize?: number;
  iconSize?: number;
}

export default function NotificationsMenu({
  align = "end",
  buttonSize = 36,
  iconSize = 18,
}: NotificationsMenuProps) {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const notificationsQuery = useNotificationsQuery();
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();
  const [open, setOpen] = useState(false);

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const placement = useMemo(() => {
    if (align === "start") {
      return "bottomLeft";
    }

    if (align === "center") {
      return "bottom";
    }

    return "bottomRight";
  }, [align]);

  function handleNotificationClick(notificationId: string, link: string) {
    setOpen(false);
    void markReadMutation.mutateAsync(notificationId);
    navigate(link);
  }

  function handleMarkAllRead() {
    void markAllReadMutation.mutateAsync();
  }

  function handleOpenNotificationsPage() {
    setOpen(false);
    navigate("/notifications");
  }

  return (
    <Popover
      trigger="click"
      placement={placement}
      arrow={{ pointAtCenter: true }}
      open={open}
      onOpenChange={setOpen}
      title={
        <Flex align="center" justify="space-between" gap={12}>
          <Typography.Text strong>Bildirimler</Typography.Text>

          {unreadCount > 0 && (
            <Button
              type="text"
              size="small"
              icon={<CheckCheck size={14} />}
              loading={markAllReadMutation.isPending}
              onClick={handleMarkAllRead}
              style={{ paddingInline: 0 }}
            >
              Tümunu Okundu Yap
            </Button>
          )}
        </Flex>
      }
      content={
        <div
          style={{
            width: 320,
            maxWidth: "calc(100vw - 32px)",
          }}
        >
          {notificationsQuery.isLoading && (
            <Typography.Text type="secondary">
              Bildirimler yükleniyor...
            </Typography.Text>
          )}

          {notificationsQuery.error instanceof Error && (
            <Typography.Text type="danger">
              {notificationsQuery.error.message}
            </Typography.Text>
          )}

          {!notificationsQuery.isLoading && notifications.length === 0 && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Henuz bildirimin yok."
              styles={{
                image: { height: 48 },
              }}
            />
          )}

          <Flex vertical gap={8}>
            {notifications.slice(0, 5).map((notification) => (
              <Button
                key={notification.id}
                type="text"
                onClick={() =>
                  handleNotificationClick(notification.id, notification.link)
                }
                style={{
                  height: "auto",
                  padding: 12,
                  justifyContent: "flex-start",
                  textAlign: "left",
                  whiteSpace: "normal",
                  borderRadius: token.borderRadiusLG,
                  background: notification.isRead ? "transparent" : token.colorPrimaryBg,
                }}
              >
                <Flex vertical gap={6} style={{ width: "100%" }}>
                  <Flex align="center" gap={8}>
                    <Avatar
                      size={28}
                      style={{
                        backgroundColor: notification.isRead
                          ? token.colorFillSecondary
                          : token.colorPrimary,
                        color: notification.isRead
                          ? token.colorTextSecondary
                          : token.colorTextLightSolid,
                        flexShrink: 0,
                      }}
                    >
                      <Bell size={14} />
                    </Avatar>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Typography.Text
                        strong
                        ellipsis
                        style={{ display: "block" }}
                      >
                        {notification.title}
                      </Typography.Text>

                      <Typography.Text
                        type="secondary"
                        style={{
                          display: "block",
                          marginTop: 2,
                          whiteSpace: "normal",
                          lineHeight: 1.45,
                        }}
                      >
                        {notification.message}
                      </Typography.Text>

                      <Typography.Text
                        type="secondary"
                        style={{ display: "block", marginTop: 4, fontSize: 12 }}
                      >
                        {formatNotificationTime(notification.createdAt)}
                      </Typography.Text>
                    </div>

                    {!notification.isRead && (
                      <Badge
                        status="processing"
                        text={
                          <Typography.Text style={{ fontSize: 12 }}>
                            Yeni
                          </Typography.Text>
                        }
                      />
                    )}
                  </Flex>
                </Flex>
              </Button>
            ))}
          </Flex>

          {!notificationsQuery.isLoading && notifications.length > 0 && (
            <Button
              type="text"
              onClick={handleOpenNotificationsPage}
              style={{
                marginTop: 8,
                width: "100%",
                justifyContent: "center",
                fontWeight: 600,
              }}
            >
              Tüm bildirimleri gor
            </Button>
          )}
        </div>
      }
    >
      <Badge count={unreadCount} overflowCount={99} size="small">
        <Button
          type="text"
          aria-label="Bildirimler"
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: token.borderRadiusLG,
          }}
        >
          <Bell size={iconSize} />
        </Button>
      </Badge>
    </Popover>
  );
}

function formatNotificationTime(value: string) {
  const date = new Date(value);
  const diffInMinutes = Math.round((Date.now() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${Math.max(diffInMinutes, 1)} dk once`;
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} sa once`;
  }

  const diffInDays = Math.round(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} g once`;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
  }).format(date);
}
