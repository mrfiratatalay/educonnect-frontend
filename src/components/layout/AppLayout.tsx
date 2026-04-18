import { Grid, Layout, Modal, Typography, theme, Flex, Button, Drawer } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { usePostComposerStore } from "@/store/postComposerStore";
import { useCreatePostMutation } from "@/features/posts/hooks";
import { useDirectMessagesSignalR } from "@/features/messages/useDirectMessagesSignalR";
import { useNotificationsSignalR } from "@/features/notifications/useNotificationsSignalR";
import type { CreatePostInput } from "@/features/posts/types";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import ChatBubble from "@/components/chat/ChatBubble";
import PostComposer from "@/pages/Feed/components/PostComposer";

interface AppLayoutProps {
  children?: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const isDesktop = !!screens.lg;
  const isMobile = !isDesktop;
  const location = useLocation();
  
  const { isComposeModalOpen, closeComposeModal } = useUIStore();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const draftContent = usePostComposerStore((state) => state.content);
  const draftImageFile = usePostComposerStore((state) => state.imageFile);
  const createPostMutation = useCreatePostMutation();
  const shouldShowChatBubble = isDesktop && !location.pathname.startsWith("/edu-ai");
  const canSubmitDraft = draftContent.trim().length > 0 || draftImageFile !== null;

  useNotificationsSignalR(isAuthenticated);
  useDirectMessagesSignalR(isAuthenticated);

  const handleCreatePost = async (input: CreatePostInput) => {
    await createPostMutation.mutateAsync(input);
    closeComposeModal();
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: token.colorBgLayout,
        }}
      >
        <Layout
          hasSider={isDesktop}
          style={{
            minHeight: "100vh",
            width: "100%",
            maxWidth: 1265, // Sidebar (275) + Feed Max Width (990)
            margin: "0 auto",
            background: "transparent",
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
                paddingBottom: isDesktop ? 0 : 74,
              }}
            >
              {children ?? <Outlet />}
            </Layout.Content>
          </Layout>
        </Layout>
      </div>

      <MobileNav />
      {shouldShowChatBubble && <ChatBubble />}

      {isMobile ? (
        <Drawer
          open={isComposeModalOpen}
          onClose={closeComposeModal}
          placement="bottom"
          height="100%"
          closeIcon={false}
          destroyOnHidden
          title={
            <Flex align="center" justify="space-between" style={{ width: "100%" }}>
              <Button
                type="text"
                shape="circle"
                icon={
                  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 20, height: 20, fill: "currentColor" }}>
                    <g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                  </svg>
                }
                onClick={closeComposeModal}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              />
              <Typography.Link
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0D9488",
                }}
              >
                Taslaklar
              </Typography.Link>
              <Button
                type="primary"
                shape="round"
                size="middle"
                form="compose-modal-form"
                htmlType="submit"
                disabled={createPostMutation.isPending || !canSubmitDraft}
                style={{
                  paddingInline: 16,
                  fontWeight: 700,
                }}
              >
                Gonderi yayinla
              </Button>
            </Flex>
          }
          styles={{
            body: {
              padding: 0,
            },
            header: {
              padding: "10px 12px",
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
            },
          }}
        >
          <PostComposer
            avatarUrl={user?.avatarUrl}
            fullName={user?.fullName}
            isSubmitting={createPostMutation.isPending}
            onSubmit={handleCreatePost}
            isInModal
          />
        </Drawer>
      ) : (
        <Modal
          open={isComposeModalOpen}
          onCancel={closeComposeModal}
          footer={null}
          width={600}
          destroyOnHidden
          closeIcon={false}
          title={
            <Flex align="center" justify="space-between" style={{ width: "100%" }}>
              <Button
                type="text"
                shape="circle"
                icon={
                  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 20, height: 20, fill: "currentColor" }}>
                    <g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g>
                  </svg>
                }
                onClick={closeComposeModal}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              />
              <Typography.Link
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0D9488",
                }}
              >
                Taslaklar
              </Typography.Link>
              <Button
                type="primary"
                shape="round"
                size="middle"
                form="compose-modal-form"
                htmlType="submit"
                disabled={createPostMutation.isPending || !canSubmitDraft}
                style={{
                  paddingInline: 16,
                  fontWeight: 700,
                }}
              >
                Gonderi yayinla
              </Button>
            </Flex>
          }
          styles={{
            body: {
              padding: 0,
              borderRadius: 16,
              top: "5%",
            },
            header: {
              padding: "16px 24px",
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              margin: 0,
              borderRadius: "16px 16px 0 0",
            },
            mask: {
              background: "rgba(0, 0, 0, 0.4)",
            }
          }}
        >
          <div style={{ paddingTop: 16 }}>
            <PostComposer
              avatarUrl={user?.avatarUrl}
              fullName={user?.fullName}
              isSubmitting={createPostMutation.isPending}
              onSubmit={handleCreatePost}
              isInModal
            />
          </div>
        </Modal>
      )}
    </>
  );
}
