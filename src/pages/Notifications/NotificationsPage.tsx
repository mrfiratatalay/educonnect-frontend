import { useMemo, useState, type ReactNode } from "react";
import {
  Affix,
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Input,
  Skeleton,
  Tabs,
  Tooltip,
  Typography,
  theme,
} from "antd";
import {
  EllipsisOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Bell,
  CalendarDays,
  MessageCircle,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FollowSuggestionsCard from "@/components/shared/FollowSuggestionsCard";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/features/notifications/hooks";
import { useTrendingHashtagsQuery } from "@/features/posts/hooks";
import type {
  AppNotification,
  NotificationKind,
} from "@/features/notifications/types";
import { useAuthStore } from "@/store/authStore";

const footerLinks = [
  "Hizmet Şartları",
  "Gizlilik Politikası",
  "Cerez Politikasi",
  "Reklam bilgisi",
  "Daha fazla",
];

type NotificationTabKey = "all" | "unread" | "mentions";

export default function NotificationsPage() {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const notificationsQuery = useNotificationsQuery();
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();
  const trendingQuery = useTrendingHashtagsQuery(3);
  const [activeTab, setActiveTab] = useState<NotificationTabKey>("all");
  const [searchValue, setSearchValue] = useState("");

  const isDesktop = !!screens.xl;
  const shellBorderColor = token.colorBorderSecondary;
  const shellBackground = token.colorBgContainer;
  const elevatedBackground = token.colorBgElevated;
  const stickyBackground = token.colorBgContainer + "D4";

  const notifications = notificationsQuery.data ?? [];
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const mentionNotifications = useMemo(
    () => notifications.filter((notification) => isMentionNotification(notification, user)),
    [notifications, user],
  );
  const visibleNotifications = useMemo(() => {
    const scopedNotifications =
      activeTab === "mentions"
        ? mentionNotifications
        : activeTab === "unread"
          ? notifications.filter((notification) => !notification.isRead)
          : notifications;

    const term = searchValue.trim().toLowerCase();
    if (!term) {
      return scopedNotifications;
    }

    return scopedNotifications.filter((notification) =>
      `${notification.title} ${notification.message}`.toLowerCase().includes(term),
    );
  }, [activeTab, mentionNotifications, notifications, searchValue]);

  async function handleNotificationClick(notification: AppNotification) {
    if (!notification.isRead) {
      await markReadMutation.mutateAsync(notification.id);
    }

    navigate(notification.link || "/");
  }

  async function handleMarkAllRead() {
    if (unreadCount === 0) {
      return;
    }

    await markAllReadMutation.mutateAsync();
  }

  async function handleRefresh() {
    await notificationsQuery.refetch();
  }

  return (
    <div style={{ maxWidth: 990, margin: "0 auto", paddingInline: screens.md ? 16 : 0 }}>
      <Flex align="flex-start">
        <div style={{ flex: 1, maxWidth: 600, minWidth: 0 }}>
          <div
            style={{
              minHeight: "100vh",
              background: shellBackground,
              borderInline: screens.md ? `1px solid ${shellBorderColor}` : "none",
            }}
          >
            <Affix offsetTop={0}>
              <div
                style={{
                  background: stickyBackground,
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  borderBottom: `1px solid ${shellBorderColor}`,
                  zIndex: 10,
                }}
              >
                <Flex
                  align="center"
                  justify="space-between"
                  style={{ padding: "8px 16px 0" }}
                >
                  <Typography.Title
                    level={3}
                    style={{
                      margin: 0,
                      fontSize: 31,
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Bildirimler
                  </Typography.Title>

                  <Flex align="center" gap={4}>
                    <Tooltip title="Listeyi yenile">
                      <Button
                        type="text"
                        shape="circle"
                        icon={<ReloadOutlined style={{ fontSize: 18 }} />}
                        onClick={() => void handleRefresh()}
                        loading={notificationsQuery.isFetching && !notificationsQuery.isLoading}
                        style={{
                          width: 36,
                          height: 36,
                          color: token.colorText,
                        }}
                      />
                    </Tooltip>

                    <Tooltip title="Tümunu okundu yap">
                      <Button
                        type="text"
                        shape="circle"
                        icon={<SettingOutlined style={{ fontSize: 18 }} />}
                        onClick={() => void handleMarkAllRead()}
                        loading={markAllReadMutation.isPending}
                        disabled={unreadCount === 0}
                        style={{
                          width: 36,
                          height: 36,
                          color: token.colorText,
                        }}
                      />
                    </Tooltip>
                  </Flex>
                </Flex>

                <Tabs
                  activeKey={activeTab}
                  onChange={(key) => setActiveTab(key as NotificationTabKey)}
                  size="large"
                  tabBarGutter={32}
                  indicator={{ size: 56, align: "center" }}
                  tabBarStyle={{ margin: 0, paddingInline: 16, borderBottom: "none" }}
                  items={[
                    {
                      key: "all",
                      label: (
                        <span style={{ fontWeight: activeTab === "all" ? 700 : 600 }}>
                          Tümu
                        </span>
                      ),
                    },
                    {
                      key: "unread",
                      label: (
                        <span
                          style={{
                            fontWeight: activeTab === "unread" ? 700 : 600,
                            color:
                              activeTab === "unread"
                                ? token.colorText
                                : token.colorTextSecondary,
                          }}
                        >
                          Okunmayanlar
                        </span>
                      ),
                    },
                    {
                      key: "mentions",
                      label: (
                        <span
                          style={{
                            fontWeight: activeTab === "mentions" ? 700 : 600,
                            color:
                              activeTab === "mentions"
                                ? token.colorText
                                : token.colorTextSecondary,
                          }}
                        >
                          Bahsedenler
                        </span>
                      ),
                    },
                  ]}
                />

                <div style={{ padding: "12px 16px 14px", borderTop: `1px solid ${shellBorderColor}` }}>
                  <Flex vertical gap={10}>
                    <Input
                      allowClear
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      placeholder="Bildirimlerde ara"
                      prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                      size="large"
                    />

                    <Flex align="center" justify="space-between" gap={12} wrap>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        {unreadCount} okunmayan • {notifications.length} toplam bildirim
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        {notificationsQuery.isFetching && !notificationsQuery.isLoading
                          ? "Güncelleniyor..."
                          : "Bildirim akişi hazır"}
                      </Typography.Text>
                    </Flex>
                  </Flex>
                </div>
              </div>
            </Affix>

            {notificationsQuery.isLoading ? (
              <NotificationLoadingState borderColor={shellBorderColor} />
            ) : notificationsQuery.error instanceof Error ? (
              <NotificationErrorState
                borderColor={shellBorderColor}
                message={notificationsQuery.error.message}
              />
            ) : visibleNotifications.length === 0 ? (
              <NotificationEmptyState
                activeTab={activeTab}
                hasSearch={searchValue.trim().length > 0}
                borderColor={shellBorderColor}
              />
            ) : (
              <Flex vertical>
                {visibleNotifications.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    borderColor={shellBorderColor}
                    onClick={() => void handleNotificationClick(notification)}
                  />
                ))}
              </Flex>
            )}
          </div>
        </div>

        {isDesktop && (
          <div style={{ width: 350, flexShrink: 0, paddingLeft: 32 }}>
            <div style={{ position: "sticky", top: 12 }}>
              <Flex vertical gap={16}>
                <Input
                  size="large"
                  placeholder="Ara"
                  prefix={
                    <SearchOutlined
                      style={{
                        color: token.colorTextTertiary,
                        fontSize: 18,
                        marginInline: 4,
                      }}
                    />
                  }
                  variant="filled"
                  style={{
                    borderRadius: 8,
                    background: elevatedBackground,
                  }}
                />

                <SidebarCard title="Neler oluyor?" background={elevatedBackground}>
                  {trendingQuery.isLoading ? (
                    <Skeleton active title={false} paragraph={{ rows: 3 }} />
                  ) : trendingQuery.data && trendingQuery.data.length > 0 ? (
                    <>
                      {trendingQuery.data.map((trend) => (
                        <SidebarActionRow key={trend.hashtag}>
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/explore/tag/${encodeURIComponent(trend.hashtag.replace(/^#/, ""))}`)
                            }
                          >
                            <Typography.Text
                              type="secondary"
                              style={{ display: "block", fontSize: 13 }}
                            >
                              {trend.contextLabel}
                            </Typography.Text>
                            <Typography.Text
                              strong
                              style={{
                                display: "block",
                                fontSize: 16,
                                lineHeight: 1.35,
                                marginTop: 2,
                              }}
                            >
                              {trend.hashtag}
                            </Typography.Text>
                            <Typography.Text
                              type="secondary"
                              style={{ display: "block", fontSize: 13, marginTop: 2 }}
                            >
                              {trend.postCount} gönderi
                            </Typography.Text>
                          </div>
                        </SidebarActionRow>
                      ))}
                      <Typography.Link
                        style={{ fontSize: 15, padding: "0 16px 8px", display: "block" }}
                        onClick={() => navigate("/explore")}
                      >
                        Daha fazla göster
                      </Typography.Link>
                    </>
                  ) : (
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 13, padding: "0 16px 8px", display: "block" }}
                    >
                      Henuz aktif bir hashtag gündemi yok.
                    </Typography.Text>
                  )}
                </SidebarCard>

                <FollowSuggestionsCard background={elevatedBackground} bordered={false} />

                <Flex wrap gap={8} style={{ paddingInline: 12 }}>
                  {footerLinks.map((item) => (
                    <Typography.Text
                      key={item}
                      type="secondary"
                      style={{ fontSize: 13 }}
                    >
                      {item}
                    </Typography.Text>
                  ))}
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    (c) 2026 EduConnect Corp.
                  </Typography.Text>
                </Flex>
              </Flex>
            </div>
          </div>
        )}
      </Flex>
    </div>
  );
}

function NotificationLoadingState({ borderColor }: { borderColor: string }) {
  return (
    <Flex vertical>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`notification-skeleton-${index}`}
          style={{
            padding: "18px 16px",
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <Skeleton
            active
            avatar={{ size: 44, shape: "circle" }}
            title={{ width: "42%" }}
            paragraph={{ rows: 2, width: ["88%", "68%"] }}
          />
        </div>
      ))}
    </Flex>
  );
}

function NotificationErrorState({
  borderColor,
  message,
}: {
  borderColor: string;
  message: string;
}) {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={12}
      style={{
        minHeight: "calc(100vh - 126px)",
        padding: "40px 32px",
        borderTop: `1px solid ${borderColor}`,
        textAlign: "center",
      }}
    >
      <Typography.Title level={3} style={{ margin: 0 }}>
        Bildirimler yüklenemedi
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ margin: 0, maxWidth: 420 }}>
        {message}
      </Typography.Paragraph>
    </Flex>
  );
}

function NotificationEmptyState({
  activeTab,
  hasSearch,
  borderColor,
}: {
  activeTab: NotificationTabKey;
  hasSearch: boolean;
  borderColor: string;
}) {
  if (hasSearch) {
    return (
      <Flex
        vertical
        justify="center"
        style={{
          minHeight: "calc(100vh - 126px)",
          padding: "56px 32px",
          borderTop: `1px solid ${borderColor}`,
        }}
      >
        <div style={{ maxWidth: 360, marginInline: "auto" }}>
          <Typography.Title
            level={1}
            style={{
              margin: 0,
              fontSize: 40,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              fontWeight: 900,
            }}
          >
            Aramana uygun bildirim yok
          </Typography.Title>
          <Typography.Paragraph
            type="secondary"
            style={{
              marginTop: 14,
              marginBottom: 0,
              fontSize: 17,
              lineHeight: 1.45,
            }}
          >
            Baska bir kelime dene ya da filtreyi degistir.
          </Typography.Paragraph>
        </div>
      </Flex>
    );
  }

  const title =
    activeTab === "mentions"
      ? "Burada gorecek bir bahsetme yok. Henuz..."
      : activeTab === "unread"
        ? "Okunmayan bildirim kalmadi."
      : "Burada gorecek bir sey yok. Henuz...";
  const description =
    activeTab === "mentions"
      ? "Sana yonelik etkilesimler burada gorunur."
      : activeTab === "unread"
        ? "Yeni bir etkilesim geldiginde bu sekmede hemen gorunur."
      : "Beğeniler, yeniden gönderiler ve çok daha fazlasi burada gerceklesir.";

  return (
    <Flex
      vertical
      justify="center"
      style={{
        minHeight: "calc(100vh - 126px)",
        padding: "56px 32px",
        borderTop: `1px solid ${borderColor}`,
      }}
    >
      <div style={{ maxWidth: 360, marginInline: "auto" }}>
        <Typography.Title
          level={1}
          style={{
            margin: 0,
            fontSize: 48,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontWeight: 900,
          }}
        >
          {title}
        </Typography.Title>
        <Typography.Paragraph
          type="secondary"
          style={{
            marginTop: 14,
            marginBottom: 0,
            fontSize: 18,
            lineHeight: 1.45,
          }}
        >
          {description}
        </Typography.Paragraph>
      </div>
    </Flex>
  );
}

function NotificationRow({
  notification,
  borderColor,
  onClick,
}: {
  notification: AppNotification;
  borderColor: string;
  onClick: () => void;
}) {
  const { token } = theme.useToken();
  const accent = getNotificationAccent(notification.type, token);
  const isUnread = !notification.isRead;

  return (
    <Button
      type="text"
      onClick={onClick}
      style={{
        height: "auto",
        padding: 0,
        borderRadius: 0,
        textAlign: "left",
        whiteSpace: "normal",
        background: isUnread ? token.colorPrimaryBg : "transparent",
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      <Flex
        align="flex-start"
        gap={12}
        style={{ width: "100%", padding: "16px 18px" }}
      >
        <Avatar
          size={40}
          style={{
            background: accent.avatarBackground,
            color: accent.avatarColor,
            flexShrink: 0,
          }}
        >
          {accent.icon}
        </Avatar>

        <div style={{ minWidth: 0, flex: 1 }}>
          <Flex align="flex-start" justify="space-between" gap={12}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <Flex align="center" gap={8} wrap>
                <Typography.Text strong style={{ fontSize: 15 }}>
                  {notification.title}
                </Typography.Text>
                {isUnread && (
                  <Badge
                    color={token.colorPrimary}
                    count=""
                    dot
                    offset={[0, 0]}
                  />
                )}
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  {formatNotificationTime(notification.createdAt)}
                </Typography.Text>
              </Flex>

              <Typography.Paragraph
                type="secondary"
                style={{
                  marginTop: 4,
                  marginBottom: 0,
                  fontSize: 15,
                  lineHeight: 1.45,
                }}
                ellipsis={{ rows: 2, tooltip: notification.message }}
              >
                {notification.message}
              </Typography.Paragraph>
            </div>

            <span
              aria-hidden
              style={{
                width: 32,
                height: 32,
                color: token.colorTextTertiary,
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EllipsisOutlined />
            </span>
          </Flex>
        </div>
      </Flex>
    </Button>
  );
}

function SidebarCard({
  title,
  background,
  children,
}: {
  title: string;
  background: string;
  children: ReactNode;
}) {
  return (
    <Card
      variant="borderless"
      style={{ background, overflow: "hidden" }}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <Flex vertical gap={2}>
        <Typography.Title
          level={4}
          style={{
            margin: 0,
            padding: "14px 16px 10px",
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </Typography.Title>
        {children}
      </Flex>
    </Card>
  );
}

function SidebarActionRow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: "10px 16px",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

function isMentionNotification(notification: AppNotification, user: ReturnType<typeof useAuthStore.getState>["user"]) {
  if (notification.type === "social") {
    return true;
  }

  const haystack = `${notification.title} ${notification.message}`.toLowerCase();
  const userMarkers = [user?.fullName, user?.email?.split("@")[0]]
    .filter(Boolean)
    .map((marker) => marker!.toLowerCase());

  return userMarkers.some((marker) => haystack.includes(marker));
}

function getNotificationAccent(
  type: NotificationKind,
  token: ReturnType<typeof theme.useToken>["token"],
) {
  switch (type) {
    case "social":
      return {
        icon: <MessageCircle size={18} />,
        avatarBackground: token.colorPrimaryBg,
        avatarColor: token.colorPrimary,
      };
    case "event":
      return {
        icon: <CalendarDays size={18} />,
        avatarBackground: "rgba(34, 197, 94, 0.14)",
        avatarColor: "#22C55E",
      };
    case "marketplace":
      return {
        icon: <ShoppingBag size={18} />,
        avatarBackground: "rgba(245, 158, 11, 0.14)",
        avatarColor: "#F59E0B",
      };
    case "system":
      return {
        icon: <Sparkles size={18} />,
        avatarBackground: "rgba(239, 68, 68, 0.14)",
        avatarColor: "#EF4444",
      };
    default:
      return {
        icon: <Bell size={18} />,
        avatarBackground: token.colorFillSecondary,
        avatarColor: token.colorTextSecondary,
      };
  }
}

function formatNotificationTime(value: string) {
  const date = new Date(value);
  const diffInMinutes = Math.round((Date.now() - date.getTime()) / (1000 * 60));
  const absoluteMinutes = Math.abs(diffInMinutes);

  if (absoluteMinutes < 60) {
    return `${absoluteMinutes || 1}dk`;
  }

  const absoluteHours = Math.round(absoluteMinutes / 60);
  if (absoluteHours < 24) {
    return `${absoluteHours}sa`;
  }

  const absoluteDays = Math.round(absoluteHours / 24);
  if (absoluteDays < 7) {
    return `${absoluteDays}g`;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
  }).format(date);
}
