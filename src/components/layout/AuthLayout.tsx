import { Avatar, Card, Col, Flex, Grid, Layout, Row, Typography, theme } from "antd";
import { GraduationCap } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import AuthHeroPanel from "@/components/layout/AuthHeroPanel";

export default function AuthLayout() {
  const { pathname } = useLocation();
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const heroRadius = token.borderRadiusLG * 2;
  const panelPadding = screens.xs ? 24 : 40;

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: screens.lg
          ? `linear-gradient(135deg, ${token.colorBgLayout} 0%, ${token.colorBgBase} 42%, ${token.colorPrimaryBg} 100%)`
          : token.colorBgLayout,
      }}
    >
      <Layout.Content style={{ padding: screens.xs ? 16 : 24 }}>
        <Row
          gutter={[24, 24]}
          align="stretch"
          style={{
            maxWidth: 1240,
            minHeight: screens.lg ? "calc(100vh - 48px)" : undefined,
            margin: "0 auto",
          }}
        >
          <Col xs={24} lg={11}>
            <AuthHeroPanel pathname={pathname} />
          </Col>

          <Col xs={24} lg={13}>
            <Flex justify="center" align="center" style={{ height: "100%" }}>
              <Card
                variant="outlined"
                style={{
                  width: "100%",
                  maxWidth: 560,
                  borderRadius: heroRadius,
                  borderColor: token.colorBorderSecondary,
                  boxShadow: token.boxShadowSecondary,
                }}
                styles={{
                  body: {
                    padding: panelPadding,
                  },
                }}
              >
                {!screens.lg && (
                  <Flex align="center" gap={14} style={{ marginBottom: 24 }}>
                    <Avatar
                      shape="square"
                      size={44}
                      style={{
                        backgroundColor: token.colorPrimary,
                        color: token.colorTextLightSolid,
                        borderRadius: token.borderRadiusLG,
                      }}
                    >
                      <GraduationCap size={22} />
                    </Avatar>
                    <div>
                      <Typography.Title level={4} style={{ margin: 0 }}>
                        EduConnect
                      </Typography.Title>
                      <Typography.Text type="secondary">
                        Kampus aginiza tek giris noktasi
                      </Typography.Text>
                    </div>
                  </Flex>
                )}

                <Outlet />
              </Card>
            </Flex>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}
