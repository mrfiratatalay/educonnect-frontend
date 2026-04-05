import {
  Button,
  ConfigProvider,
  Divider,
  Flex,
  Grid,
  Layout,
  Modal,
  Typography,
  theme,
} from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

function AuthLayoutContent() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();

  const isModalRoute = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#000000",
      }}
    >
      <Layout.Content>
        {/* Split-screen Landing Page */}
        <Flex
          align="stretch"
          style={{ minHeight: "calc(100vh - 48px)" }}
          wrap={screens.md ? undefined : "wrap"}
        >
          {/* Left: Giant Logo */}
          <Flex
            align="center"
            justify="center"
            style={{
              flex: screens.md ? 1 : undefined,
              width: screens.md ? undefined : "100%",
              minHeight: screens.md ? "100%" : 240,
              background: "#000000",
              padding: 32,
            }}
          >
            <GraduationCap
              size={screens.md ? 320 : 100}
              strokeWidth={0.7}
              color="#FFFFFF"
              style={{ opacity: 0.85 }}
            />
          </Flex>

          {/* Right: Slogan + Buttons */}
          <Flex
            vertical
            justify="center"
            style={{
              flex: screens.md ? 1 : undefined,
              width: screens.md ? undefined : "100%",
              padding: screens.md ? "40px 40px 40px 48px" : "24px 24px 48px",
              background: "#000000",
            }}
          >
            <Typography.Title
              level={1}
              style={{
                color: "#E7E9EA",
                fontSize: screens.md ? 64 : 36,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.04em",
                margin: "0 0 48px 0",
              }}
            >
              Kampüste neler oluyor?
            </Typography.Title>

            <Typography.Title
              level={2}
              style={{
                color: "#E7E9EA",
                fontSize: screens.md ? 31 : 22,
                fontWeight: 800,
                margin: "0 0 32px 0",
              }}
            >
              Bugün katıl.
            </Typography.Title>

            <Flex vertical gap={16} style={{ maxWidth: 300 }}>
              <Button
                block
                size="large"
                onClick={() => navigate("/register")}
                style={{
                  height: 40,
                  borderRadius: 9999,
                  fontWeight: 700,
                  fontSize: 15,
                  background: "#1D9BF0",
                  color: "#FFFFFF",
                  border: "none",
                }}
              >
                Hesap oluştur
              </Button>

              <Divider
                plain
                style={{
                  borderColor: "#2F3336",
                  margin: "4px 0",
                  color: "#71767B",
                  fontSize: 14,
                }}
              >
                ya da
              </Divider>

              <Typography.Text
                style={{
                  color: "#71767B",
                  fontSize: 11,
                  lineHeight: 1.5,
                }}
              >
                Kaydolarak{" "}
                <Typography.Link style={{ color: "#1D9BF0", fontSize: 11 }}>
                  Hizmet Şartları
                </Typography.Link>
                'nı ve{" "}
                <Typography.Link style={{ color: "#1D9BF0", fontSize: 11 }}>
                  Gizlilik Politikası
                </Typography.Link>
                'nı kabul etmiş olursunuz.
              </Typography.Text>
            </Flex>

            <Flex vertical gap={16} style={{ marginTop: 48, maxWidth: 300 }}>
              <Typography.Text
                style={{
                  color: "#E7E9EA",
                  fontSize: 17,
                  fontWeight: 700,
                }}
              >
                Zaten hesabın var mı?
              </Typography.Text>

              <Button
                block
                size="large"
                onClick={() => navigate("/login")}
                style={{
                  height: 40,
                  borderRadius: 9999,
                  fontWeight: 700,
                  fontSize: 15,
                  background: "transparent",
                  color: "#1D9BF0",
                  borderColor: "#536471",
                }}
              >
                Giriş yap
              </Button>
            </Flex>
          </Flex>
        </Flex>

        {/* Footer */}
        <Flex
          wrap="wrap"
          justify="center"
          gap={16}
          style={{
            padding: "12px 16px",
            background: "#000000",
          }}
        >
          {[
            "Hakkında",
            "Yardım Merkezi",
            "Hizmet Şartları",
            "Gizlilik Politikası",
            "Çerez Politikası",
            "Erişilebilirlik",
            "© 2026 EduConnect Corp.",
          ].map((text) => (
            <Typography.Text
              key={text}
              style={{ color: "#71767B", fontSize: 13 }}
            >
              {text}
            </Typography.Text>
          ))}
        </Flex>

        {/* Modal for Login / Register / Forgot Password */}
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorBgBase: "#000000",
              colorBgContainer: "#000000",
              colorBgElevated: "#000000",
              colorBorder: "#333639",
              colorBorderSecondary: "#333639",
            },
            components: {
              Modal: {
                contentBg: "#000000",
                headerBg: "#000000",
              },
              Input: {
                colorBgContainer: "transparent",
                activeBorderColor: "#1D9BF0",
                hoverBorderColor: "#1D9BF0",
              },
              Select: {
                colorBgContainer: "transparent",
              },
            },
          }}
        >
          <Modal
            open={isModalRoute}
            footer={null}
            closable
            centered
            destroyOnHidden
            width={600}
            onCancel={() => navigate("/", { replace: true })}
            styles={{
              body: {
                background: "#000000",
                borderRadius: 16,
                padding: "0",
              },
              mask: {
                background: "rgba(91, 112, 131, 0.4)",
              },
            }}
            title={null}
          >
            <Flex vertical align="center" style={{ padding: "16px 80px 48px" }}>
              <GraduationCap size={32} color="#E7E9EA" style={{ marginBottom: 28 }} />
              <Outlet />
            </Flex>
          </Modal>
        </ConfigProvider>
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
