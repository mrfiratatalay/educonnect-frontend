import { useState } from "react";
import { CompassOutlined } from "@ant-design/icons";
import { Button, Drawer, Flex, FloatButton, Grid, Tabs, Typography, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { useInfiniteJoinedGroupsFeedQuery } from "@/features/groups/hooks";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useInfiniteFollowingPostsQuery,
  useInfinitePostsQuery,
  useUpdatePostMutation,
} from "@/features/posts/hooks";
import type { CreatePostInput, UpdatePostInput } from "@/features/posts/types";
import FeedSidebar from "@/pages/Feed/components/FeedSidebar";
import PostComposer from "@/pages/Feed/components/PostComposer";
import PostList from "@/pages/Feed/components/PostList";

type FeedTabKey = "foryou" | "following" | "groups";

export default function FeedPage() {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<FeedTabKey>("foryou");
  const user = useAuthStore((state) => state.user);
  const openComposeModal = useUIStore((state) => state.openComposeModal);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const postsQuery = useInfinitePostsQuery(10, activeTab === "foryou");
  const followingPostsQuery = useInfiniteFollowingPostsQuery(10, activeTab === "following");
  const groupsFeedQuery = useInfiniteJoinedGroupsFeedQuery(10, activeTab === "groups");
  const createPostMutation = useCreatePostMutation();
  const deletePostMutation = useDeletePostMutation();
  const updatePostMutation = useUpdatePostMutation();
  const isFollowingTab = activeTab === "following";
  const isGroupsTab = activeTab === "groups";
  const isForYouTab = activeTab === "foryou";
  const activeFeedQuery = isGroupsTab
    ? groupsFeedQuery
    : isFollowingTab
      ? followingPostsQuery
      : postsQuery;

  const posts = activeFeedQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = activeFeedQuery.data?.pages[0]?.totalCount ?? 0;
  const errorMessage =
    activeFeedQuery.error instanceof Error ? activeFeedQuery.error.message : undefined;
  const deletingPostId =
    deletePostMutation.isPending && typeof deletePostMutation.variables === "string"
      ? deletePostMutation.variables
      : undefined;
  const updatingPostId =
    updatePostMutation.isPending ? updatePostMutation.variables?.postId : undefined;

  async function handleCreatePost(input: CreatePostInput) {
    await createPostMutation.mutateAsync(input);
  }

  async function handleUpdatePost(postId: string, input: Omit<UpdatePostInput, "postId">) {
    await updatePostMutation.mutateAsync({ postId, ...input });
  }

  function handleDeletePost(postId: string) {
    void deletePostMutation.mutateAsync(postId);
  }

  function handleCreatePostClick() {
    if (isMobile) {
      openComposeModal();
      return;
    }

    const composer = document.getElementById("feed-composer");
    composer?.scrollIntoView({ behavior: "smooth", block: "start" });
    const textarea = composer?.querySelector("textarea");

    if (textarea instanceof HTMLTextAreaElement) {
      window.setTimeout(() => textarea.focus(), 150);
    }
  }

  return (
    <div style={{ maxWidth: 990, margin: "0 auto", padding: isMobile ? 0 : "0 16px" }}>
      <Flex>
        <div style={{ flex: 1, maxWidth: isMobile ? "100%" : 600, minWidth: 0 }}>
          <div
            style={{
              background: token.colorBgContainer,
              borderInline: isMobile ? "none" : `1px solid ${token.colorBorderSecondary}`,
              minHeight: isMobile ? "calc(100vh - 108px)" : "100vh",
            }}
          >
            <div
              style={{
                background: isMobile ? "rgba(255, 255, 255, 0.92)" : `${token.colorBgLayout}CC`,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                position: "sticky",
                top: isMobile ? 54 : 0,
                zIndex: 10,
              }}
            >
              <Tabs
                activeKey={activeTab}
                centered={!isMobile}
                size="large"
                indicator={{ size: isMobile ? 84 : 56, align: "center" }}
                onChange={(key) => setActiveTab(key as FeedTabKey)}
                tabBarGutter={isMobile ? 20 : undefined}
                tabBarStyle={{
                  margin: 0,
                  borderBottom: "none",
                  paddingInline: isMobile ? 6 : 0,
                }}
                items={[
                  {
                    key: "foryou",
                    label: <span style={{ fontWeight: 700, fontSize: isMobile ? 18 : undefined }}>Sana ozel</span>,
                  },
                  {
                    key: "following",
                    label: <span style={{ fontWeight: 700, fontSize: isMobile ? 18 : undefined }}>Takip ettiklerin</span>,
                  },
                  {
                    key: "groups",
                    label: <span style={{ fontWeight: 700, fontSize: isMobile ? 18 : undefined }}>Topluluklar</span>,
                  },
                ]}
              />
            </div>

            {!isMobile && !screens.xl && (
              <Flex justify="flex-end" style={{ padding: "12px 16px 0" }}>
                <Button icon={<CompassOutlined />} onClick={() => setDrawerVisible(true)}>
                  Gündem & Keşfet
                </Button>
              </Flex>
            )}

            {!isMobile && !isGroupsTab ? (
              <PostComposer
                avatarUrl={user?.avatarUrl}
                fullName={user?.fullName}
                isSubmitting={createPostMutation.isPending}
                onSubmit={handleCreatePost}
              />
            ) : null}

            <PostList
              posts={posts}
              currentUserId={user?.id}
              currentUserRole={user?.role}
              deletingPostId={deletingPostId}
              updatingPostId={updatingPostId}
              errorMessage={errorMessage}
              emptyDescription={
                isGroupsTab
                  ? "Katıldigin topluluklardaki paylaşımlar burada akaçak."
                  : isFollowingTab
                    ? "Takip ettigin kullanıcıların kişisel paylaşımlari burada akaçak."
                  : undefined
              }
              emptyActionLabel={isGroupsTab ? "Topluluklari keşfet" : undefined}
              isLoading={activeFeedQuery.isLoading}
              onCreatePostClick={handleCreatePostClick}
              onDelete={handleDeletePost}
              onEmptyActionClick={isGroupsTab ? () => navigate("/communities") : undefined}
              onUpdate={handleUpdatePost}
              showGroupContext={isGroupsTab}
              showRecommendationReason={isForYouTab}
              showCreateAction={!isGroupsTab && !isFollowingTab}
            />

            {activeFeedQuery.hasNextPage && (
              <Flex justify="center" style={{ padding: "8px 0" }}>
                <Button
                  onClick={() => void activeFeedQuery.fetchNextPage()}
                  loading={activeFeedQuery.isFetchingNextPage}
                >
                  Daha Fazla Yükle
                </Button>
              </Flex>
            )}

            {posts.length > 0 && !activeFeedQuery.hasNextPage && (
              <Typography.Text
                type="secondary"
                style={{ textAlign: "center", padding: "24px 0", display: "block" }}
              >
                Gösterilen gönderiler tamamlandi.
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

      {!isMobile && !screens.xl && (
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
      )}

      {!isMobile ? <FloatButton.BackTop style={{ right: 24, bottom: 24 }} /> : null}
    </div>
  );
}
