import { useState } from "react";
import { Avatar, Button, Drawer, Flex, Grid, Menu, Typography, theme } from "antd";
import { LogOut, Menu as MenuIcon, MoreHorizontal } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getSelectedShellKey,
  isMoreNavPath,
  getUserInitials,
  shellMainNavItems,
  shellSecondaryNavItems,
} from "@/components/layout/shellNavigation";
import { useAuthStore } from "@/store/authStore";

export default function MobileNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const screens = Grid.useBreakpoint();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const selectedKey = getSelectedShellKey(location.pathname);
  const isMoreSelected = isMoreNavPath(location.pathname);

  if (screens.lg) {
    return null;
  }

  return (
    <>
      <Drawer
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        placement="bottom"
        height={300}
        title="Daha Fazla"
        destroyOnHidden
        styles={{
          body: {
            padding: 12,
          },
        }}
      >
        <Flex align="center" gap={12} style={{ padding: "4px 4px 16px" }}>
          <Avatar
            src={user?.avatarUrl}
            alt={user?.fullName}
            size={44}
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
              style={{ display: "block", fontSize: 12 }}
            >
              {user?.department ?? user?.email ?? "EduConnect"}
            </Typography.Text>
          </div>
        </Flex>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={shellSecondaryNavItems.map((item) => ({
            key: item.key,
            icon: <item.icon size={18} />,
            label: item.label,
          }))}
          onClick={({ key }) => {
            navigate(String(key));
            setMoreOpen(false);
          }}
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
          onClick={() => {
            void logout();
            setMoreOpen(false);
          }}
          style={{
            justifyContent: "flex-start",
            height: 44,
            marginTop: 4,
            borderRadius: token.borderRadiusLG,
          }}
        >
          Cikis Yap
        </Button>
      </Drawer>

      <div
        style={{
          position: "fixed",
          insetInline: 0,
          bottom: 0,
          zIndex: 50,
          background: token.colorBgContainer,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          backdropFilter: "blur(16px)",
          padding: `8px 12px calc(8px + env(safe-area-inset-bottom))`,
        }}
      >
        <Flex gap={4} align="stretch">
          {shellMainNavItems.map((item) => {
            const isActive = selectedKey === item.key;

            return (
              <Button
                key={item.key}
                type="text"
                onClick={() => {
                  navigate(item.to);
                  setMoreOpen(false);
                }}
                style={{
                  flex: 1,
                  height: 56,
                  paddingInline: 4,
                  color: isActive ? token.colorPrimary : token.colorTextSecondary,
                  borderRadius: token.borderRadiusLG,
                }}
              >
                <Flex
                  vertical
                  align="center"
                  justify="center"
                  gap={4}
                  style={{ width: "100%" }}
                >
                  <item.icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                  <Typography.Text
                    style={{
                      fontSize: 11,
                      lineHeight: 1,
                      color: "inherit",
                      margin: 0,
                    }}
                  >
                    {item.label}
                  </Typography.Text>
                </Flex>
              </Button>
            );
          })}

          <Button
            type="text"
            onClick={() => setMoreOpen(true)}
            style={{
              flex: 1,
              height: 56,
              paddingInline: 4,
              color: moreOpen || isMoreSelected ? token.colorPrimary : token.colorTextSecondary,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <Flex
              vertical
              align="center"
              justify="center"
              gap={4}
              style={{ width: "100%" }}
            >
              {moreOpen ? (
                <MoreHorizontal size={20} strokeWidth={2.4} />
              ) : (
                <MenuIcon size={20} />
              )}
              <Typography.Text
                style={{
                  fontSize: 11,
                  lineHeight: 1,
                  color: "inherit",
                  margin: 0,
                }}
              >
                Daha
              </Typography.Text>
            </Flex>
          </Button>
        </Flex>
      </div>
    </>
  );
}
