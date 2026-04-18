import { Avatar, Badge, Button, Drawer, Flex, FloatButton, Grid, Typography, theme } from "antd";
import { LogOut, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getSelectedShellKey,
  getUserInitials,
  shellMobileBottomNavItems,
  shellMobileDrawerNavItems,
} from "@/components/layout/shellNavigation";
import { useUnreadMessages } from "@/features/messages/unread";
import { useNotificationsQuery } from "@/features/notifications/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

function ComposeFabIcon() {
  return (
    <div style={{ position: "relative", width: 22, height: 22 }}>
      <Plus size={12} strokeWidth={2.5} style={{ position: "absolute", top: -2, left: -1 }} />
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 18,
          height: 18,
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      >
        <path d="M12 3c-2.5 0-5 1.2-6.6 3.2C3.8 8.2 3 10.8 3.3 13.4c.3 2.7 1.9 5.1 4.2 6.5l.5.3 1-.8c1.3-1.1 2.7-2.4 3.7-3.8 1.7-2.3 2.9-4.8 3.5-7.5l.2-.7-.6-.4C14.7 3.7 13.4 3 12 3Z" />
        <path d="M14.2 4.1c2.9.3 5.2 2.7 5.5 5.6.3 3.4-1.8 6.5-5 7.5" />
      </svg>
    </div>
  );
}

export default function MobileNav() {
  const screens = Grid.useBreakpoint();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const isMobileDrawerOpen = useUIStore((state) => state.isMobileDrawerOpen);
  const closeMobileDrawer = useUIStore((state) => state.closeMobileDrawer);
  const openComposeModal = useUIStore((state) => state.openComposeModal);
  const isComposeModalOpen = useUIStore((state) => state.isComposeModalOpen);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const notificationsQuery = useNotificationsQuery();
  const { unreadCount: unreadMessageCount } = useUnreadMessages();
  const selectedKey = getSelectedShellKey(location.pathname);
  const userHandle = user?.email?.split("@")[0] ?? "kullanici";
  const unreadCount = (notificationsQuery.data ?? []).filter((item) => !item.isRead).length;
  const previousUnreadCountRef = useRef(0);
  const previousUnreadMessageCountRef = useRef(0);
  const [shouldPulseNotifications, setShouldPulseNotifications] = useState(false);
  const [shouldPulseMessages, setShouldPulseMessages] = useState(false);

  useEffect(() => {
    if (unreadCount > previousUnreadCountRef.current) {
      setShouldPulseNotifications(true);
      const timeoutId = window.setTimeout(() => setShouldPulseNotifications(false), 1800);
      previousUnreadCountRef.current = unreadCount;
      return () => window.clearTimeout(timeoutId);
    }

    previousUnreadCountRef.current = unreadCount;
    return undefined;
  }, [unreadCount]);

  useEffect(() => {
    if (unreadMessageCount > previousUnreadMessageCountRef.current) {
      setShouldPulseMessages(true);
      const timeoutId = window.setTimeout(() => setShouldPulseMessages(false), 1800);
      previousUnreadMessageCountRef.current = unreadMessageCount;
      return () => window.clearTimeout(timeoutId);
    }

    previousUnreadMessageCountRef.current = unreadMessageCount;
    return undefined;
  }, [unreadMessageCount]);

  if (screens.lg) {
    return null;
  }

  return (
    <>
      <Drawer
        open={isMobileDrawerOpen}
        onClose={closeMobileDrawer}
        placement="left"
        width="82vw"
        closable={false}
        destroyOnHidden
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div style={{ padding: "14px 16px 20px" }}>
          <Flex align="flex-start" justify="space-between" gap={12}>
            <div>
              <Avatar
                src={user?.avatarUrl}
                alt={user?.fullName}
                size={42}
                style={{
                  backgroundColor: token.colorPrimaryBg,
                  color: token.colorPrimary,
                }}
              >
                {getUserInitials(user?.fullName)}
              </Avatar>

              <div style={{ marginTop: 14 }}>
                <Typography.Text strong style={{ display: "block", fontSize: 20, lineHeight: 1.15 }}>
                  {user?.fullName ?? "Kullanici"}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ display: "block", marginTop: 4, fontSize: 16 }}>
                  @{userHandle}
                </Typography.Text>
              </div>

              <Flex align="center" gap={24} style={{ marginTop: 16 }}>
                <Typography.Text style={{ fontSize: 15 }}>
                  <span style={{ fontWeight: 700, color: token.colorText }}>0</span>{" "}
                  <span style={{ color: token.colorTextSecondary }}>Takip edilen</span>
                </Typography.Text>
                <Typography.Text style={{ fontSize: 15 }}>
                  <span style={{ fontWeight: 700, color: token.colorText }}>0</span>{" "}
                  <span style={{ color: token.colorTextSecondary }}>Takipçi</span>
                </Typography.Text>
              </Flex>
            </div>

            <Button
              type="text"
              shape="circle"
              icon={<Plus size={18} />}
              onClick={() => {
                closeMobileDrawer();
                openComposeModal();
              }}
              style={{
                width: 36,
                height: 36,
                border: `1px solid ${token.colorBorder}`,
                color: token.colorText,
              }}
            />
          </Flex>

          <Flex vertical gap={2} style={{ marginTop: 24 }}>
            {shellMobileDrawerNavItems.map((item) => {
              const isActive = selectedKey === item.key;

              return (
                <Button
                  key={item.key}
                  type="text"
                  onClick={() => {
                    navigate(item.to);
                    closeMobileDrawer();
                  }}
                  style={{
                    justifyContent: "flex-start",
                    height: "auto",
                    padding: "12px 4px",
                    borderRadius: 14,
                    color: token.colorText,
                    fontWeight: isActive ? 700 : 600,
                  }}
                >
                  <Flex align="center" gap={18}>
                    {item.key === "/notifications" ? (
                      <Badge count={unreadCount} overflowCount={99} size="small">
                        <span
                          style={{
                            display: "inline-flex",
                            transform: shouldPulseNotifications ? "scale(1.12)" : "scale(1)",
                            transition: "transform 180ms ease",
                          }}
                        >
                          <item.icon size={24} fill={isActive ? "currentColor" : "none"} />
                        </span>
                      </Badge>
                    ) : item.key === "/messages" ? (
                      <Badge count={unreadMessageCount} overflowCount={99} size="small">
                        <span
                          style={{
                            display: "inline-flex",
                            transform: shouldPulseMessages ? "scale(1.12)" : "scale(1)",
                            transition: "transform 180ms ease",
                          }}
                        >
                          <item.icon size={24} fill={isActive ? "currentColor" : "none"} />
                        </span>
                      </Badge>
                    ) : (
                      <item.icon size={24} fill={isActive ? "currentColor" : "none"} />
                    )}
                    <span style={{ fontSize: 18, lineHeight: 1.2 }}>{item.label}</span>
                  </Flex>
                </Button>
              );
            })}

            <Button
              type="text"
              danger
              onClick={() => {
                closeMobileDrawer();
                void logout().then(() => queryClient.clear());
              }}
              style={{
                justifyContent: "flex-start",
                height: "auto",
                padding: "14px 4px 10px",
                marginTop: 4,
                borderRadius: 14,
                fontWeight: 700,
              }}
              icon={<LogOut size={22} />}
            >
              <span style={{ fontSize: 18 }}>Çıkış yap</span>
            </Button>
          </Flex>
        </div>
      </Drawer>

      {!isComposeModalOpen && (
        <FloatButton
          type="primary"
          icon={<ComposeFabIcon />}
          onClick={openComposeModal}
          style={{
            right: 18,
            bottom: 84,
            width: 54,
            height: 54,
            boxShadow: "0 8px 24px rgba(29, 155, 240, 0.35)",
          }}
        />
      )}

      <div
        style={{
          position: "fixed",
          insetInline: 0,
          bottom: 0,
          zIndex: 50,
          background: token.colorBgContainer,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: `4px 10px calc(4px + env(safe-area-inset-bottom))`,
        }}
      >
        <Flex align="center" justify="space-between" gap={2}>
          {shellMobileBottomNavItems.map((item) => {
            const isActive = selectedKey === item.key;

            return (
              <Button
                key={item.key}
                type="text"
                onClick={() => navigate(item.to)}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 8,
                  color: isActive ? token.colorPrimary : token.colorTextSecondary,
                  padding: 0,
                }}
              >
                {item.key === "/notifications" ? (
                  <Badge count={unreadCount} overflowCount={99} size="small">
                    <span
                      style={{
                        display: "inline-flex",
                        transform: shouldPulseNotifications ? "scale(1.12)" : "scale(1)",
                        transition: "transform 180ms ease",
                      }}
                    >
                      <item.icon size={26} strokeWidth={isActive ? 2.4 : 2.1} fill={isActive ? "currentColor" : "none"} />
                    </span>
                  </Badge>
                ) : item.key === "/messages" ? (
                  <Badge count={unreadMessageCount} overflowCount={99} size="small">
                    <span
                      style={{
                        display: "inline-flex",
                        transform: shouldPulseMessages ? "scale(1.12)" : "scale(1)",
                        transition: "transform 180ms ease",
                      }}
                    >
                      <item.icon size={26} strokeWidth={isActive ? 2.4 : 2.1} fill={isActive ? "currentColor" : "none"} />
                    </span>
                  </Badge>
                ) : (
                  <item.icon size={26} strokeWidth={isActive ? 2.4 : 2.1} fill={isActive ? "currentColor" : "none"} />
                )}
              </Button>
            );
          })}
        </Flex>
      </div>
    </>
  );
}
