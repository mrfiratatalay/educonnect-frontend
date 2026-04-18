import { Button, ConfigProvider, Flex, Grid, Layout, Modal, Typography, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import {
  authPalette,
  authPrimaryButtonStyle,
  authSecondaryButtonStyle,
} from "@/pages/Auth/AuthPageParts";

function AuthLayoutContent() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const isModalRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/verify-email";

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: authPalette.background,
      }}
    >
      <Layout.Content>
        <Flex
          vertical
          style={{
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
            background: authPalette.background,
          }}
        >
          <Flex
            style={{
              flex: 1,
              position: "relative",
              zIndex: 1,
              padding: screens.lg ? "32px 40px 24px" : "20px 20px 24px",
            }}
            wrap={screens.lg ? undefined : "wrap"}
          >
            <Flex
              align="center"
              justify="center"
              style={{
                flex: screens.lg ? "1 1 52%" : undefined,
                width: screens.lg ? undefined : "100%",
                minHeight: screens.lg ? "auto" : 160,
                padding: screens.lg ? 48 : "8px 0 32px",
              }}
            >
              <div style={{ display: "inline-flex" }}>
                <img
                  src="/logo.png"
                  alt="EduConnect"
                  style={{ width: screens.lg ? 680 : 260, height: screens.lg ? 680 : 260, objectFit: "contain", display: "block" }}
                />
              </div>
            </Flex>

            <Flex
              vertical
              justify="center"
              style={{
                flex: screens.lg ? "1 1 48%" : undefined,
                width: screens.lg ? undefined : "100%",
                padding: screens.lg ? "32px 32px 56px" : 0,
                maxWidth: screens.lg ? 620 : 420,
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <Typography.Title
                  level={1}
                  style={{
                    color: authPalette.text,
                    fontSize: screens.lg ? 72 : 42,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                    margin: 0,
                  }}
                >
                  EduConnect
                </Typography.Title>
                <Typography.Title
                  level={1}
                  style={{
                    color: authPalette.text,
                    fontSize: screens.lg ? 72 : 42,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                    margin: 0,
                  }}
                >
                  Kampüste şimdi ne oluyor?
                </Typography.Title>
              </div>

              <Typography.Title
                level={2}
                style={{
                  color: authPalette.text,
                  fontSize: screens.lg ? 34 : 26,
                  fontWeight: 800,
                  margin: "0 0 28px 0",
                }}
              >
                Üniversite ağına bugün katıl.
              </Typography.Title>

              <Flex vertical gap={14} style={{ width: "100%", maxWidth: 360 }}>
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={() => navigate("/register")}
                  style={authPrimaryButtonStyle}
                >
                  Hesap oluştur
                </Button>

              </Flex>

              <Flex vertical gap={14} style={{ width: "100%", maxWidth: 360, marginTop: 44 }}>
                <Typography.Text
                  style={{
                    color: authPalette.text,
                    fontSize: 20,
                    fontWeight: 800,
                  }}
                >
                  Zaten bir hesabın var mı?
                </Typography.Text>

                <Button
                  block
                  size="large"
                  onClick={() => navigate("/login")}
                  style={authSecondaryButtonStyle}
                >
                  Giriş yap
                </Button>
              </Flex>
            </Flex>
          </Flex>

          <Flex
            wrap="wrap"
            gap={16}
            justify={screens.lg ? "center" : "flex-start"}
            style={{
              position: "relative",
              zIndex: 1,
              padding: screens.lg ? "0 24px 28px" : "0 24px 32px",
            }}
          >
            <Typography.Link href="/terms" target="_blank" style={{ color: authPalette.muted, fontSize: 13 }}>
              Hizmet Şartları
            </Typography.Link>
            <Typography.Link href="/privacy" target="_blank" style={{ color: authPalette.muted, fontSize: 13 }}>
              Gizlilik Politikası
            </Typography.Link>
            <Typography.Text style={{ color: authPalette.muted, fontSize: 13 }}>
              © {new Date().getFullYear()} EduConnect
            </Typography.Text>
          </Flex>

          <Modal
            open={isModalRoute}
            footer={null}
            closable={false}
            centered={!isMobile}
            destroyOnHidden
            maskClosable
            width={isMobile ? "100vw" : 600}
            wrapClassName="auth-route-modal"
            onCancel={() => navigate("/", { replace: true })}
            style={{
              top: isMobile ? 0 : 24,
              paddingBottom: 0,
            }}
            styles={{
              body: {
                padding: 0,
              },
              mask: {
                background: isMobile ? "rgba(0, 0, 0, 0.6)" : "rgba(91, 112, 131, 0.4)",
                backdropFilter: isMobile ? undefined : "blur(10px)",
              },
            }}
            title={null}
          >
            <Flex
              vertical
              className="auth-modal-panel"
              style={{
                minHeight: isMobile ? "100dvh" : undefined,
                padding: isMobile ? "18px 24px 32px" : "20px 40px 40px",
                overflowY: "auto",
              }}
            >
              <Flex
                align="center"
                justify="space-between"
                style={{ marginBottom: isMobile ? 20 : 24 }}
              >
                <Button
                  type="text"
                  shape="circle"
                  aria-label="Close auth dialog"
                  onClick={() => navigate("/", { replace: true })}
                  icon={<X size={20} />}
                  style={{
                    width: 40,
                    height: 40,
                    color: authPalette.text,
                    border: "none",
                    background: "transparent",
                    boxShadow: "none",
                  }}
                />

                <div style={{ width: 40, height: 40 }} />
              </Flex>

              <Flex justify="center" style={{ width: "100%" }}>
                <div style={{ width: "100%", maxWidth: 420 }}>
                  <Outlet />
                </div>
              </Flex>
            </Flex>
          </Modal>
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
      variant="outlined"
      wave={{ disabled: true }}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: authPalette.primary,
          colorLink: authPalette.primary,
          colorBgBase: authPalette.background,
          colorBgContainer: authPalette.background,
          colorBgElevated: authPalette.background,
          colorBorder: authPalette.border,
          colorBorderSecondary: authPalette.border,
          colorTextBase: authPalette.text,
          colorText: authPalette.text,
          colorTextSecondary: authPalette.muted,
          colorTextPlaceholder: authPalette.muted,
          colorIcon: authPalette.muted,
          colorIconHover: authPalette.text,
          controlOutline: "rgba(13, 148, 136, 0.15)",
          boxShadow: "0 8px 28px rgba(0, 0, 0, 0.12)",
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeightLG: 48,
            fontWeight: 700,
            colorPrimary: authPalette.ink,
            colorPrimaryHover: "#0F766E",
            colorPrimaryActive: "#115E59",
            colorTextLightSolid: authPalette.white,
            defaultBg: "transparent",
            defaultBorderColor: authPalette.borderStrong,
            defaultColor: authPalette.text,
            defaultHoverBg: "rgba(13, 148, 136, 0.05)",
            defaultHoverColor: authPalette.text,
            defaultHoverBorderColor: "#64748B",
            defaultActiveBg: "rgba(13, 148, 136, 0.10)",
            defaultActiveColor: authPalette.text,
            defaultActiveBorderColor: "#64748B",
            defaultShadow: "none",
            primaryShadow: "none",
          },
          Input: {
            borderRadius: 8,
            controlHeightLG: 56,
            paddingInlineLG: 16,
            activeBorderColor: authPalette.primary,
            hoverBorderColor: authPalette.primary,
            activeShadow: "0 0 0 2px rgba(13, 148, 136, 0.15)",
          },
          Select: {
            borderRadius: 8,
            controlHeightLG: 56,
            optionHeight: 44,
            activeBorderColor: authPalette.primary,
            hoverBorderColor: authPalette.primary,
            activeOutlineColor: "rgba(29, 155, 240, 0.12)",
            selectorBg: "transparent",
          },
          Modal: {
            borderRadiusLG: 28,
            contentBg: authPalette.background,
            headerBg: authPalette.background,
          },
        },
      }}
    >
      <AuthLayoutContent />
    </ConfigProvider>
  );
}
