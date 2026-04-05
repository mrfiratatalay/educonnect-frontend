import { useState } from "react";
import { CompassOutlined } from "@ant-design/icons";
import { Button, Drawer, Flex, FloatButton, Grid, Tabs, Typography, theme } from "antd";
import { useAuthStore } from "@/store/authStore";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useInfinitePostsQuery,
  useUpdatePostMutation,
} from "@/features/posts/hooks";
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

  return (
    <div style={{ maxWidth: 990, margin: "0 auto", padding: "0 16px" }}>
      <Flex>
        <div style={{ flex: 1, maxWidth: 600, minWidth: 0 }}>
          <div
            style={{
              background: token.colorBgContainer,
              borderInline: `1px solid ${token.colorBorderSecondary}`,
              minHeight: "100vh",
            }}
          >
            <div
              style={{
                background: `${token.colorBgLayout}CC`,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <Tabs
                defaultActiveKey="foryou"
                centered
                size="large"
                indicator={{ size: 56, align: "center" }}
                tabBarStyle={{ margin: 0, borderBottom: "none" }}
                items={[
                  {
                    key: "foryou",
                    label: <span style={{ fontWeight: 600 }}>Sana ozel</span>,
                  },
                  {
                    key: "following",
                    label: (
                      <span style={{ color: token.colorTextSecondary }}>
                        Takip ediliyor
                      </span>
                    ),
                  },
                ]}
              />
            </div>

            {!screens.xl && (
              <Flex justify="flex-end" style={{ padding: "12px 16px 0" }}>
                <Button icon={<CompassOutlined />} onClick={() => setDrawerVisible(true)}>
                  Gundem & Kesfet
                </Button>
              </Flex>
            )}

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
                  Daha Fazla Yukle
                </Button>
              </Flex>
            )}

            {posts.length > 0 && !postsQuery.hasNextPage && (
              <Typography.Text
                type="secondary"
                style={{ textAlign: "center", padding: "24px 0", display: "block" }}
              >
                Gosterilen gonderiler tamamlandi.
              </Typography.Text>
            )}
          </div>
        </div>

        {screens.xl && (
          <div style={{ width: 350, flexShrink: 0, paddingLeft: 32 }}>
            <div style={{ position: "sticky", top: 12 }}>
              <FeedSidebar posts={posts} totalCount={totalCount} user={user} />
            </div>
          </div>
        )}
      </Flex>

      {!screens.xl && (
        <Drawer
          title="Gundem & Kesfet"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={320}
          styles={{ body: { padding: "16px 20px" } }}
        >
          <FeedSidebar posts={posts} totalCount={totalCount} user={user} />
        </Drawer>
      )}

      <FloatButton.BackTop style={{ right: 24, bottom: 24 }} />
    </div>
  );
}
