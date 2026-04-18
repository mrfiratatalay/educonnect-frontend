import { useEffect, useRef, useState } from "react";
import { Avatar, Badge, Button, Flex, Grid, Layout, Popover, Typography, theme } from "antd";
import { Feather, GraduationCap, MoreHorizontal } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getSelectedShellKey,
  isMoreNavPath,
  getUserInitials,
  shellMainNavItems,
  shellMoreNavItems,
} from "@/components/layout/shellNavigation";
import { useUnreadMessages } from "@/features/messages/unread";
import { useNotificationsQuery } from "@/features/notifications/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

export default function Sidebar() {
  const screens = Grid.useBreakpoint();
  const isDesktop = !!screens.lg;
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const { openComposeModal } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const notificationsQuery = useNotificationsQuery();
  const { unreadCount: unreadMessageCount } = useUnreadMessages();
  const [accountPopoverOpen, setAccountPopoverOpen] = useState(false);
  const [morePopoverOpen, setMorePopoverOpen] = useState(false);
  const [shouldPulseNotifications, setShouldPulseNotifications] = useState(false);
  const [shouldPulseMessages, setShouldPulseMessages] = useState(false);
  const previousUnreadCountRef = useRef(0);
  const previousUnreadMessageCountRef = useRef(0);

  const isMessages = location.pathname === "/messages";
  const selectedKey = getSelectedShellKey(location.pathname);
  const isMoreSelected = isMoreNavPath(location.pathname);
  const userHandle = user?.email?.split("@")[0] ?? "kullanici";
  const navIconSize = 24;
  const navLabelFontSize = 18;
  const navRowPadding = isMessages ? "10px" : "10px 20px 10px 10px";
  const unreadCount = (notificationsQuery.data ?? []).filter((item) => !item.isRead).length;

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

  if (!isDesktop) {
    return null;
  }

  const accountPopoverContent = (
    <div style={{ width: 360, maxWidth: "calc(100vw - 32px)" }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setAccountPopoverOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setAccountPopoverOpen(false);
          }
        }}
        style={{
          padding: "20px 22px 16px",
          fontSize: 16,
          fontWeight: 700,
          lineHeight: 1.2,
          color: token.colorText,
          cursor: "pointer",
          outline: "none",
          background: token.colorBgElevated,
        }}
      >
        Var olan bir hesap ekle
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          setAccountPopoverOpen(false);
          void logout().then(() => queryClient.clear());
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setAccountPopoverOpen(false);
            void logout().then(() => queryClient.clear());
          }
        }}
        style={{
          padding: "14px 22px 22px",
          cursor: "pointer",
          outline: "none",
          background: token.colorBgElevated,
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.18, color: token.colorText }}>
          @{userHandle} hesabindan
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.18, color: token.colorText, marginTop: 2 }}>
          cikis yap
        </div>
      </div>
    </div>
  );

  const morePopoverContent = (
    <Flex vertical style={{ minWidth: 360 }}>
      {shellMoreNavItems.map((item) => (
        <Button
          key={item.key}
          type="text"
          onClick={() => {
            navigate(item.to);
            setMorePopoverOpen(false);
          }}
          style={{
            justifyContent: "flex-start",
            height: "auto",
            padding: "15px 18px",
            borderRadius: 18,
            fontSize: 17,
            fontWeight: selectedKey === item.key ? 700 : 600,
            color: token.colorText,
          }}
        >
          <Flex align="center" gap={16}>
            <item.icon size={22} />
            <span>{item.label}</span>
          </Flex>
        </Button>
      ))}
    </Flex>
  );

  return (
    <Layout.Sider
      width={275}
      collapsed={isMessages}
      collapsedWidth={88}
      theme="light"
      trigger={null}
      style={{
        background: "transparent",
        borderInlineEnd: "none",
        overflowX: "hidden",
        overflowY: "auto",
        height: "100vh",
        position: "sticky",
        insetInlineStart: 0,
        top: 0,
      }}
    >
      <Flex vertical justify="space-between" style={{ minHeight: "100%", padding: "6px 10px 12px" }}>
        <div>
          <div style={{ padding: "6px 12px 6px" }}>
            <Button
              type="text"
              onClick={() => navigate("/")}
              style={{ height: "auto", padding: 6, borderRadius: 10 }}
            >
              <GraduationCap size={28} strokeWidth={2} color={token.colorPrimary} />
            </Button>
          </div>

          <Flex vertical gap={2} style={{ marginTop: 2 }}>
            {shellMainNavItems.map((item) => (
              <div
                key={item.key}
                style={{ display: "flex", justifyContent: isMessages ? "center" : "flex-start" }}
              >
                <Flex
                  align="center"
                  gap={18}
                  style={{
                    padding: navRowPadding,
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "background-color 0.18s",
                    width: isMessages ? "auto" : "max-content",
                  }}
                  onClick={() => navigate(item.key)}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = token.colorFillSecondary;
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = "transparent";
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
                        <item.icon size={navIconSize} fill={selectedKey === item.key ? "currentColor" : "none"} />
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
                        <item.icon size={navIconSize} fill={selectedKey === item.key ? "currentColor" : "none"} />
                      </span>
                    </Badge>
                  ) : (
                    <item.icon size={navIconSize} fill={selectedKey === item.key ? "currentColor" : "none"} />
                  )}
                  {!isMessages ? (
                    <Flex align="center" gap={10}>
                      <span style={{ fontSize: navLabelFontSize, fontWeight: selectedKey === item.key ? 700 : 400, lineHeight: 1.2 }}>
                        {item.label}
                      </span>
                      {item.key === "/notifications" && unreadCount > 0 ? (
                        <span
                          style={{
                            minWidth: 24,
                            height: 20,
                            paddingInline: 6,
                            borderRadius: 999,
                            background: token.colorError,
                            color: token.colorWhite,
                            fontSize: 12,
                            fontWeight: 800,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: shouldPulseNotifications ? "scale(1.08)" : "scale(1)",
                            transition: "transform 180ms ease",
                          }}
                        >
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      ) : item.key === "/messages" && unreadMessageCount > 0 ? (
                        <span
                          style={{
                            minWidth: 24,
                            height: 20,
                            paddingInline: 6,
                            borderRadius: 999,
                            background: token.colorPrimary,
                            color: token.colorWhite,
                            fontSize: 12,
                            fontWeight: 800,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: shouldPulseMessages ? "scale(1.08)" : "scale(1)",
                            transition: "transform 180ms ease",
                          }}
                        >
                          {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                        </span>
                      ) : null}
                    </Flex>
                  ) : null}
                </Flex>
              </div>
            ))}

            <Popover
              open={morePopoverOpen}
              onOpenChange={setMorePopoverOpen}
              trigger="click"
              placement="bottomLeft"
              content={morePopoverContent}
              overlayStyle={{ paddingTop: 8 }}
              overlayInnerStyle={{
                padding: 10,
                borderRadius: 24,
                border: `1px solid ${token.colorBorderSecondary}`,
                boxShadow: token.boxShadowSecondary,
                background: token.colorBgElevated,
              }}
            >
              <div style={{ display: "flex", justifyContent: isMessages ? "center" : "flex-start" }}>
                <Flex
                  align="center"
                  gap={18}
                  style={{
                    padding: navRowPadding,
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "background-color 0.18s",
                    width: isMessages ? "auto" : "max-content",
                    background: morePopoverOpen || isMoreSelected ? token.colorFillSecondary : "transparent",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = token.colorFillSecondary;
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background =
                      morePopoverOpen || isMoreSelected ? token.colorFillSecondary : "transparent";
                  }}
                >
                  <MoreHorizontal size={navIconSize} fill={morePopoverOpen || isMoreSelected ? "currentColor" : "none"} />
                  {!isMessages ? (
                    <span style={{ fontSize: navLabelFontSize, fontWeight: isMoreSelected ? 700 : 400, lineHeight: 1.2 }}>
                      Daha fazla
                    </span>
                  ) : null}
                </Flex>
              </div>
            </Popover>
          </Flex>

          {isMessages ? (
            <Flex justify="center" style={{ marginTop: 16 }}>
              <Button
                type="primary"
                shape="circle"
                size="large"
                style={{
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={openComposeModal}
              >
                <Feather size={24} />
              </Button>
            </Flex>
          ) : (
            <div style={{ padding: "0 12px" }}>
              <Button
                type="primary"
                size="large"
                style={{
                  marginTop: 10,
                  height: 48,
                  width: "100%",
                  maxWidth: 220,
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  border: "none",
                }}
                onClick={openComposeModal}
              >
                Gonderi yayinla
              </Button>
            </div>
          )}
        </div>

        <Popover
          open={accountPopoverOpen}
          onOpenChange={setAccountPopoverOpen}
          trigger="click"
          placement="top"
          content={accountPopoverContent}
          arrow={{ pointAtCenter: true }}
          overlayStyle={{
            paddingBottom: 8,
          }}
          overlayInnerStyle={{
            padding: 0,
            borderRadius: 22,
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: token.boxShadowSecondary,
            background: token.colorBgElevated,
          }}
        >
          <Flex
            align="center"
            gap={12}
            style={{
              padding: isMessages ? "0" : "12px",
              justifyContent: isMessages ? "center" : "flex-start",
              margin: isMessages ? "0" : "8px 0 4px",
              borderRadius: 8,
              cursor: "pointer",
              transition: "background 0.18s",
              background: accountPopoverOpen ? token.colorFillTertiary : "transparent",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = token.colorFillTertiary;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = accountPopoverOpen
                ? token.colorFillTertiary
                : "transparent";
            }}
          >
            <Avatar
              src={user?.avatarUrl}
              alt={user?.fullName}
              size={38}
              style={{
                backgroundColor: token.colorPrimaryBg,
                color: token.colorPrimary,
                flexShrink: 0,
              }}
            >
              {getUserInitials(user?.fullName)}
            </Avatar>

            {!isMessages ? (
              <>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <Typography.Text strong ellipsis style={{ display: "block", fontSize: 14 }}>
                    {user?.fullName ?? "Kullanici"}
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    ellipsis
                    style={{ display: "block", fontSize: 14 }}
                  >
                    @{userHandle}
                  </Typography.Text>
                </div>

                <MoreHorizontal size={18} style={{ color: token.colorTextSecondary, flexShrink: 0 }} />
              </>
            ) : null}
          </Flex>
        </Popover>
      </Flex>
    </Layout.Sider>
  );
}
