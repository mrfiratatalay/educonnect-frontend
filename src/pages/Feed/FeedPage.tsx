import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useInfinitePostsQuery,
  useUpdatePostMutation,
} from "@/features/posts/hooks";
import { Button, Col, Flex, Grid, Row, Typography, Badge, FloatButton, Drawer, Affix, theme } from "antd";
import { CompassOutlined } from "@ant-design/icons";
import FeedSidebar from "@/pages/Feed/components/FeedSidebar";
import PostComposer from "@/pages/Feed/components/PostComposer";
import PostList from "@/pages/Feed/components/PostList";

export default function FeedPage() {
  const { token } = theme.useToken();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const user = useAuthStore((state) => state.user);
  const screens = Grid.useBreakpoint();
  const postsQuery = useInfinitePostsQuery(10);
  const createPostMutation = useCreatePostMutation();
  const deletePostMutation = useDeletePostMutation();
  const updatePostMutation = useUpdatePostMutation();

  const posts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = postsQuery.data?.pages[0]?.totalCount ?? 0;
  const errorMessage =
    postsQuery.error instanceof Error ? postsQuery.error.message : undefined;
  const deletingPostId =
    deletePostMutation.isPending && typeof deletePostMutation.variables === "string"
      ? deletePostMutation.variables
      : undefined;
  const updatingPostId =
    updatePostMutation.isPending ? updatePostMutation.variables?.postId : undefined;

  async function handleCreatePost(content: string) {
    await createPostMutation.mutateAsync({ content });
  }

  async function handleUpdatePost(postId: string, content: string) {
    await updatePostMutation.mutateAsync({ postId, content });
  }

  function handleDeletePost(postId: string) {
    void deletePostMutation.mutateAsync(postId);
  }

  function handleCreatePostClick() {
    const composer = document.getElementById("feed-composer");
    composer?.scrollIntoView({ behavior: "smooth", block: "start" });
    const textarea = composer?.querySelector("textarea");
    if (textarea instanceof HTMLTextAreaElement) {
      window.setTimeout(() => textarea.focus(), 150);
    }
  }

  const pagePadding = screens.xs ? 16 : screens.lg ? 32 : 24;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: pagePadding }}>
      <Flex vertical gap={24}>
        <Affix offsetTop={0}>
          <div style={{
            margin: `-${pagePadding}px -${pagePadding}px 0`,
            padding: `${pagePadding}px ${pagePadding}px 16px`,
            background: `${token.colorBgLayout}CC`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            zIndex: 10
          }}>
            <Flex align="center" gap={12}>
              <Typography.Title level={screens.lg ? 2 : 3} style={{ margin: 0, fontWeight: 800, letterSpacing: "-0.5px" }}>
                Feed
              </Typography.Title>
              <Badge status="processing" text="Canlı Akış" styles={{ indicator: { marginTop: 4 }, root: { marginTop: 4 } }} />
            </Flex>
            <Typography.Text type="secondary" style={{ marginTop: 6, display: "block", fontSize: 15 }}>
              Kampüsteki son paylaşımlar burada listelenir.
            </Typography.Text>
          </div>
        </Affix>

        <Row gutter={24}>
          <Col xs={24} xl={16}>
            <div style={{ 
              background: token.colorBgContainer, 
              border: `1px solid ${token.colorBorderSecondary}`, 
              borderRadius: screens.xs ? 0 : 12,
              overflow: 'hidden'
            }}>
              <PostComposer
                avatarUrl={user?.avatarUrl}
                fullName={user?.fullName}
                isSubmitting={createPostMutation.isPending}
                onSubmit={handleCreatePost}
              />

              <PostList
                posts={posts}
                currentUserId={user?.id}
                currentUserRole={user?.role}
                deletingPostId={deletingPostId}
                updatingPostId={updatingPostId}
                errorMessage={errorMessage}
                isLoading={postsQuery.isLoading}
                onCreatePostClick={handleCreatePostClick}
                onDelete={handleDeletePost}
                onUpdate={handleUpdatePost}
              />

              {postsQuery.hasNextPage && (
                <Flex justify="center" style={{ padding: "8px 0" }}>
                  <Button
                    onClick={() => void postsQuery.fetchNextPage()}
                    loading={postsQuery.isFetchingNextPage}
                  >
                    Daha Fazla Yükle
                  </Button>
                </Flex>
              )}

              {posts.length > 0 && !postsQuery.hasNextPage && (
                <Typography.Text
                  type="secondary"
                  style={{ textAlign: "center", padding: "24px 0", display: "block" }}
                >
                  Gösterilen gönderiler tamamlandı.
                </Typography.Text>
              )}
            </div>
          </Col>

          {screens.xl && (
            <Col xl={8}>
              <div style={{ position: "sticky", top: 24 }}>
                <FeedSidebar posts={posts} totalCount={totalCount} user={user} />
              </div>
            </Col>
          )}
        </Row>
      </Flex>

      {!screens.xl && (
        <>
          <FloatButton 
            icon={<CompassOutlined />} 
            type="primary" 
            style={{ right: 24, bottom: 84 }} 
            onClick={() => setDrawerVisible(true)}
            tooltip="Gündem & Keşfet"
          />
          <Drawer
            title="Gündem & Keşfet"
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={320}
            styles={{ body: { padding: "16px 20px" } }}
          >
            <FeedSidebar posts={posts} totalCount={totalCount} user={user} />
          </Drawer>
        </>
      )}

      <FloatButton.BackTop style={{ right: 24, bottom: 24 }} />
    </div>
  );
}
