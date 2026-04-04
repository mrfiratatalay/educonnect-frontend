import { Grid, Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import ChatBubble from "@/components/chat/ChatBubble";

export default function AppLayout() {
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const isDesktop = !!screens.lg;

  return (
    <>
      <Layout
        hasSider={isDesktop}
        style={{
          minHeight: "100vh",
          background: token.colorBgLayout,
        }}
      >
        <Sidebar />

        <Layout
          style={{
            minWidth: 0,
            background: "transparent",
          }}
        >
          <Header />

          <Layout.Content
            style={{
              flex: 1,
              overflowX: "hidden",
              paddingBottom: isDesktop ? 0 : 84,
            }}
          >
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>

      <MobileNav />
      <ChatBubble />
    </>
  );
}
