import {
  Card,
  ConfigProvider,
  Flex,
  Grid,
  Layout,
  Tabs,
  Typography,
  theme,
} from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppShellBrand from "@/components/layout/AppShellBrand";

function AuthLayoutContent() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const showTabs = pathname === "/login" || pathname === "/register";
  const activeTabKey = pathname === "/register" ? "register" : "login";

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: token.colorBgLayout,
      }}
    >
      <Layout.Content
        style={{
          padding: screens.xs ? "24px 16px" : "56px 24px",
        }}
      >
        <Flex
          align="center"
          justify="center"
          style={{
            minHeight: "100%",
          }}
        >
          <Card
            bordered={false}
            style={{
              width: "100%",
              maxWidth: 560,
              boxShadow: token.boxShadowSecondary,
            }}
            styles={{
              body: {
                padding: screens.xs ? 24 : 36,
              },
            }}
          >
            <Flex vertical gap={28}>
              <Flex vertical gap={10}>
                <AppShellBrand compact to="/login" />
                <Typography.Text type="secondary">
                  Universite ogrencileri icin hesap erisimi.
                </Typography.Text>
              </Flex>

              {showTabs && (
                <Tabs
                  activeKey={activeTabKey}
                  centered
                  destroyOnHidden
                  indicator={{ align: "center", size: (origin) => Math.min(origin, 36) }}
                  items={[
                    { key: "login", label: "Giris Yap" },
                    { key: "register", label: "Kayit Ol" },
                  ]}
                  onChange={(key) => navigate(key === "register" ? "/register" : "/login")}
                  tabBarStyle={{ marginBottom: 0 }}
                />
              )}

              <Outlet />
            </Flex>
          </Card>
        </Flex>
      </Layout.Content>
    </Layout>
  );
}

export default function AuthLayout() {
  return (
    <ConfigProvider
      componentSize="large"
      form={{ requiredMark: false, scrollToFirstError: { focus: true } }}
      variant="filled"
    >
      <AuthLayoutContent />
    </ConfigProvider>
  );
}

