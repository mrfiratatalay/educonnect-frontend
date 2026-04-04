import type { MenuProps } from "antd";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  Layout,
  Menu,
  Typography,
  theme,
} from "antd";
import { LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import AppShellBrand from "@/components/layout/AppShellBrand";
import NotificationsMenu from "@/components/layout/NotificationsMenu";
import {
  getSelectedShellKey,
  getUserInitials,
  shellMainNavItems,
  shellSecondaryNavItems,
} from "@/components/layout/shellNavigation";
import { useAuthStore } from "@/store/authStore";

export default function Sidebar() {
  const screens = Grid.useBreakpoint();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  if (!screens.lg) {
    return null;
  }

  const selectedKey = getSelectedShellKey(location.pathname);
  const mainMenuItems: MenuProps["items"] = shellMainNavItems.map((item) => ({
    key: item.key,
    icon: <item.icon size={18} />,
    label: item.label,
  }));
  const secondaryMenuItems: MenuProps["items"] = shellSecondaryNavItems.map((item) => ({
    key: item.key,
    icon: <item.icon size={18} />,
    label: item.label,
  }));
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(String(key));
  };

  return (
    <Layout.Sider
      width={272}
      theme="light"
      trigger={null}
      style={{
        background: token.colorBgContainer,
        borderInlineEnd: `1px solid ${token.colorBorder}`,
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        insetInlineStart: 0,
        top: 0,
        scrollbarWidth: "thin",
        scrollbarGutter: "stable",
      }}
    >
      <Flex vertical style={{ minHeight: "100%" }}>
        <Flex align="center" justify="space-between" style={{ padding: 20 }}>
          <AppShellBrand />
          <NotificationsMenu align="end" buttonSize={36} iconSize={16} />
        </Flex>

        <Divider style={{ margin: 0 }} />

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={mainMenuItems}
            onClick={handleMenuClick}
            style={{
              borderInlineEnd: "none",
              background: "transparent",
            }}
          />
        </div>

        <Divider style={{ margin: 0 }} />

        <div style={{ padding: 12 }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={secondaryMenuItems}
            onClick={handleMenuClick}
            style={{
              borderInlineEnd: "none",
              background: "transparent",
            }}
          />

          <Button
            block
            type="text"
            danger
            icon={<LogOut size={18} />}
            onClick={() => void logout()}
            style={{
              justifyContent: "flex-start",
              height: 44,
              marginTop: 4,
              borderRadius: token.borderRadiusLG,
            }}
          >
            Cikis Yap
          </Button>
        </div>

        <Divider style={{ margin: 0 }} />

        <Flex align="center" gap={12} style={{ padding: "16px 18px 20px" }}>
          <Avatar
            src={user?.avatarUrl}
            alt={user?.fullName}
            size={40}
            style={{
              backgroundColor: token.colorPrimaryBg,
              color: token.colorPrimary,
            }}
          >
            {getUserInitials(user?.fullName)}
          </Avatar>

          <div style={{ minWidth: 0, flex: 1 }}>
            <Typography.Text strong ellipsis style={{ display: "block" }}>
              {user?.fullName ?? "Kullanici"}
            </Typography.Text>

            <Typography.Text
              type="secondary"
              ellipsis
              style={{
                display: "block",
                fontSize: 12,
              }}
            >
              {user?.department ?? user?.email ?? "EduConnect"}
            </Typography.Text>
          </div>
        </Flex>
      </Flex>
    </Layout.Sider>
  );
}
