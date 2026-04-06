import { Button, ConfigProvider, Flex, Grid, Layout, Modal, Typography, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, X } from "lucide-react";
import {
  AuthLegalText,
  authPalette,
  authPrimaryButtonStyle,
  authSecondaryButtonStyle,
} from "@/pages/Auth/AuthPageParts";

const footerLinks = [
  "Hakkinda",
  "Kampus rehberi",
  "Gizlilik",
  "Cerezler",
  "Kariyer",
  "Yardim merkezi",
  "(c) 2026 EduConnect Corp.",
];

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
              <div
                style={{
                  width: screens.lg ? 320 : 82,
                  height: screens.lg ? 320 : 82,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(15, 20, 25, 0.08)",
                  background: "rgba(15, 20, 25, 0.02)",
                  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.08)",
                }}
              >
                <GraduationCap
                  size={screens.lg ? 180 : 44}
                  strokeWidth={0.9}
                  color={authPalette.text}
                  style={{ opacity: 0.92 }}
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
              <Flex align="center" gap={12} style={{ marginBottom: screens.lg ? 72 : 36 }}>
                <GraduationCap size={screens.lg ? 36 : 30} color={authPalette.text} />
                <Typography.Text
                  style={{
                    color: authPalette.text,
                    fontSize: screens.lg ? 28 : 24,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                  }}
                >
                  EduConnect
                </Typography.Text>
              </Flex>

              <Typography.Title
                level={1}
                style={{
                  color: authPalette.text,
                  fontSize: screens.lg ? 72 : 42,
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  margin: "0 0 20px 0",
                }}
              >
                Kampuste simdi ne oluyor?
              </Typography.Title>

              <Typography.Title
                level={2}
                style={{
                  color: authPalette.text,
                  fontSize: screens.lg ? 34 : 26,
                  fontWeight: 800,
                  margin: "0 0 28px 0",
                }}
              >
                Universite agina bugun katil.
              </Typography.Title>

              <Flex vertical gap={14} style={{ width: "100%", maxWidth: 360 }}>
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={() => navigate("/register")}
                  style={authPrimaryButtonStyle}
                >
                  Hesap olustur
                </Button>

                <AuthLegalText />
              </Flex>

              <Flex vertical gap={14} style={{ width: "100%", maxWidth: 360, marginTop: 44 }}>
                <Typography.Text
                  style={{
                    color: authPalette.text,
                    fontSize: 20,
                    fontWeight: 800,
                  }}
                >
                  Zaten bir hesabin var mi?
                </Typography.Text>

                <Button
                  block
                  size="large"
                  onClick={() => navigate("/login")}
                  style={authSecondaryButtonStyle}
                >
                  Giris yap
                </Button>
              </Flex>
            </Flex>
          </Flex>

          <Flex
            wrap="wrap"
            gap={12}
            justify={screens.lg ? "center" : "flex-start"}
            style={{
              position: "relative",
              zIndex: 1,
              padding: screens.lg ? "0 24px 24px" : "0 24px 28px",
            }}
          >
            {footerLinks.map((text) => (
              <Typography.Text
                key={text}
                style={{
                  color: authPalette.muted,
                  fontSize: 13,
                }}
              >
                {text}
              </Typography.Text>
            ))}
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

                <GraduationCap size={isMobile ? 32 : 34} color={authPalette.text} />
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
          controlOutline: "rgba(29, 155, 240, 0.12)",
          boxShadow: "0 8px 28px rgba(0, 0, 0, 0.12)",
        },
        components: {
          Button: {
            borderRadius: 999,
            controlHeightLG: 48,
            fontWeight: 700,
            colorPrimary: authPalette.ink,
            colorPrimaryHover: "#272C30",
            colorPrimaryActive: "#0F1419",
            colorTextLightSolid: authPalette.white,
            defaultBg: "transparent",
            defaultBorderColor: authPalette.borderStrong,
            defaultColor: authPalette.text,
            defaultHoverBg: "rgba(15, 20, 25, 0.04)",
            defaultHoverColor: authPalette.text,
            defaultHoverBorderColor: "#6E7C86",
            defaultActiveBg: "rgba(15, 20, 25, 0.08)",
            defaultActiveColor: authPalette.text,
            defaultActiveBorderColor: "#6E7C86",
            defaultShadow: "none",
            primaryShadow: "none",
          },
          Input: {
            borderRadius: 14,
            controlHeightLG: 56,
            paddingInlineLG: 16,
            activeBorderColor: authPalette.primary,
            hoverBorderColor: authPalette.primary,
            activeShadow: "0 0 0 2px rgba(29, 155, 240, 0.12)",
          },
          Select: {
            borderRadius: 14,
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
