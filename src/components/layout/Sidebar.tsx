import { useState } from "react";
import { Avatar, Button, Flex, Grid, Layout, Popover, Typography, theme } from "antd";
import { Feather, GraduationCap, MoreHorizontal } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getSelectedShellKey,
  isMoreNavPath,
  getUserInitials,
  shellMainNavItems,
  shellMoreNavItems,
} from "@/components/layout/shellNavigation";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

export default function Sidebar() {
  const screens = Grid.useBreakpoint();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { openComposeModal } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const [accountPopoverOpen, setAccountPopoverOpen] = useState(false);
  const [morePopoverOpen, setMorePopoverOpen] = useState(false);

  if (!screens.lg) {
    return null;
  }

  const isMessages = location.pathname === "/messages";
  const selectedKey = getSelectedShellKey(location.pathname);
  const isMoreSelected = isMoreNavPath(location.pathname);
  const userHandle = user?.email?.split("@")[0] ?? "kullanici";
  const navIconSize = 24;
  const navLabelFontSize = 18;
  const navRowPadding = isMessages ? "10px" : "10px 20px 10px 10px";

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
          void logout();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setAccountPopoverOpen(false);
            void logout();
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
              style={{ height: "auto", padding: 6, borderRadius: 9999 }}
            >
              <GraduationCap size={28} strokeWidth={2} />
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
                    borderRadius: 9999,
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    width: isMessages ? "auto" : "max-content",
                  }}
                  onClick={() => navigate(item.key)}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = token.colorFillTertiary;
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = "transparent";
                  }}
                >
                  <item.icon size={navIconSize} />
                  {!isMessages ? (
                    <span style={{ fontSize: navLabelFontSize, fontWeight: selectedKey === item.key ? 700 : 400, lineHeight: 1.2 }}>
                      {item.label}
                    </span>
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
                    borderRadius: 9999,
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    width: isMessages ? "auto" : "max-content",
                    background: morePopoverOpen || isMoreSelected ? token.colorFillTertiary : "transparent",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = token.colorFillTertiary;
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background =
                      morePopoverOpen || isMoreSelected ? token.colorFillTertiary : "transparent";
                  }}
                >
                  <MoreHorizontal size={navIconSize} />
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
                  borderRadius: 9999,
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
              borderRadius: 9999,
              cursor: "pointer",
              transition: "background 0.2s",
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
