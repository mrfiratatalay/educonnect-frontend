import type { MenuProps } from "antd";
import {
  Avatar,
  Button,
  Flex,
  Grid,
  Layout,
  Menu,
  Typography,
  theme,
} from "antd";
import { MoreHorizontal } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getSelectedShellKey,
  getUserInitials,
  shellMainNavItems,
} from "@/components/layout/shellNavigation";
import { useAuthStore } from "@/store/authStore";
import { GraduationCap } from "lucide-react";

export default function Sidebar() {
  const screens = Grid.useBreakpoint();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  if (!screens.lg) {
    return null;
  }

  const selectedKey = getSelectedShellKey(location.pathname);
  const mainMenuItems: MenuProps["items"] = shellMainNavItems.map((item) => ({
    key: item.key,
    icon: <item.icon size={26} />,
    label: <span style={{ fontSize: 20, fontWeight: selectedKey === item.key ? 700 : 400 }}>{item.label}</span>,
  }));
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(String(key));
  };

  return (
    <Layout.Sider
      width={275}
      theme="light"
      trigger={null}
      style={{
        background: "transparent",
        borderInlineEnd: "none",
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        insetInlineStart: 0,
        top: 0,
        scrollbarWidth: "thin",
        scrollbarGutter: "stable",
      }}
    >
      <Flex vertical justify="space-between" style={{ minHeight: "100%", padding: "12px 12px 20px" }}>
        {/* Top section: Logo + Nav + Button */}
        <div>
          {/* Logo - X uses just an icon at the top */}
          <div style={{ padding: "12px 16px 8px" }}>
            <Button
              type="text"
              onClick={() => navigate("/")}
              style={{ height: "auto", padding: 6, borderRadius: 9999 }}
            >
              <GraduationCap size={30} strokeWidth={2} />
            </Button>
          </div>

          {/* Navigation Menu */}
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={mainMenuItems}
            onClick={handleMenuClick}
            style={{
              borderInlineEnd: "none",
              background: "transparent",
              fontSize: 20,
            }}
          />

          {/* Post Button */}
          <Button
            type="primary"
            block
            size="large"
            style={{
              marginTop: 16,
              height: 52,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: "0.01em",
            }}
            onClick={() => {
              const composer = document.getElementById("feed-composer");
              composer?.scrollIntoView({ behavior: "smooth", block: "start" });
              const textarea = composer?.querySelector("textarea");
              if (textarea instanceof HTMLTextAreaElement) {
                window.setTimeout(() => textarea.focus(), 150);
              }
            }}
          >
            Gönderi yayınla
          </Button>
        </div>

        {/* Bottom section: User profile row */}
        <Flex
          align="center"
          gap={12}
          style={{
            padding: "12px",
            borderRadius: 9999,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onClick={() => navigate("/profile")}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = token.colorFillTertiary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Avatar
            src={user?.avatarUrl}
            alt={user?.fullName}
            size={40}
            style={{
              backgroundColor: token.colorPrimaryBg,
              color: token.colorPrimary,
              flexShrink: 0,
            }}
          >
            {getUserInitials(user?.fullName)}
          </Avatar>

          <div style={{ minWidth: 0, flex: 1 }}>
            <Typography.Text strong ellipsis style={{ display: "block", fontSize: 15 }}>
              {user?.fullName ?? "Kullanıcı"}
            </Typography.Text>
            <Typography.Text
              type="secondary"
              ellipsis
              style={{ display: "block", fontSize: 15 }}
            >
              @{user?.email?.split("@")[0] ?? "kullanici"}
            </Typography.Text>
          </div>

          <MoreHorizontal size={18} style={{ color: token.colorTextSecondary, flexShrink: 0 }} />
        </Flex>
      </Flex>
    </Layout.Sider>
  );
}
