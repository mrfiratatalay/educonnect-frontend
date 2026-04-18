import { Avatar, Button, Flex, Grid, Typography, theme } from "antd";
import { GraduationCap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getShellLabel,
  getUserInitials,
} from "@/components/layout/shellNavigation";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

export default function Header() {
  const screens = Grid.useBreakpoint();
  const user = useAuthStore((state) => state.user);
  const openMobileDrawer = useUIStore((state) => state.openMobileDrawer);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  if (
    screens.lg ||
    location.pathname === "/profile" ||
    location.pathname.startsWith("/profile/")
  ) {
    return null;
  }

  const isHome = location.pathname === "/";
  const title = isHome ? "" : getShellLabel(location.pathname);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        height: 54,
        paddingInline: 12,
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Button
        type="text"
        aria-label="Menüyü aç"
        onClick={openMobileDrawer}
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar
          src={user?.avatarUrl}
          alt={user?.fullName}
          size={30}
          style={{
            backgroundColor: token.colorPrimaryBg,
            color: token.colorPrimary,
          }}
        >
          {getUserInitials(user?.fullName)}
        </Avatar>
      </Button>

      <Flex
        align="center"
        justify="center"
        style={{
          flex: 1,
          minWidth: 0,
          paddingInline: 12,
        }}
      >
        {isHome ? (
          <Button
            type="text"
            onClick={() => navigate("/")}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              padding: 0,
              color: token.colorPrimary,
            }}
          >
            <GraduationCap size={24} strokeWidth={2.1} />
          </Button>
        ) : (
          <Typography.Text
            strong
            ellipsis
            style={{
              fontSize: 18,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </Typography.Text>
        )}
      </Flex>

      <div style={{ width: 34 }} />
    </div>
  );
}
