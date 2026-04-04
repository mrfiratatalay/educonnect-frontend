import { Avatar, Button, Flex, Grid, Layout, theme } from "antd";
import { useNavigate } from "react-router-dom";
import AppShellBrand from "@/components/layout/AppShellBrand";
import NotificationsMenu from "@/components/layout/NotificationsMenu";
import { getUserInitials } from "@/components/layout/shellNavigation";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const screens = Grid.useBreakpoint();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { token } = theme.useToken();

  if (screens.lg) {
    return null;
  }

  return (
    <Layout.Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        height: 64,
        paddingInline: 16,
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(16px)",
      }}
    >
      <AppShellBrand compact />

      <Flex align="center" gap={8}>
        <NotificationsMenu align="end" buttonSize={36} iconSize={18} />

        <Button
          type="text"
          aria-label="Profil"
          onClick={() => navigate("/profile")}
          style={{
            height: "auto",
            padding: 0,
            borderRadius: token.borderRadiusLG,
          }}
        >
          <Avatar
            src={user?.avatarUrl}
            alt={user?.fullName}
            size={36}
            style={{
              backgroundColor: token.colorPrimaryBg,
              color: token.colorPrimary,
            }}
          >
            {getUserInitials(user?.fullName)}
          </Avatar>
        </Button>
      </Flex>
    </Layout.Header>
  );
}
