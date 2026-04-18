import { ArrowLeft, Hash } from "lucide-react";
import { Button, Flex, FloatButton, Grid, Typography, theme } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeletePostMutation,
  useInfiniteTagPostsQuery,
  useUpdatePostMutation,
} from "@/features/posts/hooks";
import type { UpdatePostInput } from "@/features/posts/types";
import FeedSidebar from "@/pages/Feed/components/FeedSidebar";
import PostList from "@/pages/Feed/components/PostList";
import { useAuthStore } from "@/store/authStore";

export default function ExploreTagPage() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const user = useAuthStore((state) => state.user);
  const normalizedTag = normalizeRouteTag(tag);
  const displayTag = normalizedTag ? `#${normalizedTag}` : "#trend";
  const isMobile = !screens.md;
  const isDesktopSidebarVisible = !!screens.xl;
  const postsQuery = useInfiniteTagPostsQuery(
    { tag: normalizedTag, pageSize: 10 },
    Boolean(normalizedTag),
  );
  const deletePostMutation = useDeletePostMutation();
  const updatePostMutation = useUpdatePostMutation();

  const posts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = postsQuery.data?.pages[0]?.totalCount ?? 0;
  const errorMessage = !normalizedTag
    ? "Gecersiz hashtag."
    : postsQuery.error instanceof Error
      ? postsQuery.error.message
      : undefined;
  const deletingPostId =
    deletePostMutation.isPending && typeof deletePostMutation.variables === "string"
      ? deletePostMutation.variables
      : undefined;
  const updatingPostId =
    updatePostMutation.isPending ? updatePostMutation.variables?.postId : undefined;

  async function handleUpdatePost(postId: string, input: Omit<UpdatePostInput, "postId">) {
    await updatePostMutation.mutateAsync({ postId, ...input });
  }

  function handleDeletePost(postId: string) {
    void deletePostMutation.mutateAsync(postId);
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
                position: "sticky",
                top: isMobile ? 54 : 0,
                zIndex: 10,
                background: `${token.colorBgContainer}E6`,
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Flex align="center" gap={14} style={{ padding: "10px 16px 8px" }}>
                <Button
                  type="text"
                  shape="circle"
                  aria-label="Kesfete don"
                  style={{ width: 36, height: 36, color: token.colorText }}
                  icon={<ArrowLeft size={18} />}
                  onClick={() => navigate("/explore")}
                />

                <div style={{ minWidth: 0, flex: 1 }}>
                  <Typography.Text
                    type="secondary"
                    style={{ display: "block", fontSize: 13, lineHeight: 1.3 }}
                  >
                    Hashtag detayi
                  </Typography.Text>
                  <Flex align="center" gap={8} wrap>
                    <Hash size={18} color={token.colorText} />
                    <Typography.Title
                      level={3}
                      style={{
                        margin: 0,
                        fontSize: isMobile ? 24 : 28,
                        fontWeight: 800,
                        lineHeight: 1.1,
                      }}
                    >
                      {displayTag}
                    </Typography.Title>
                  </Flex>
                  <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                    {totalCount > 0
                      ? `${totalCount} gonderi bu trend altinda listeleniyor.`
                      : "Bu trenddeki guncel paylasimlar burada akacak."}
                  </Typography.Text>
                </div>
              </Flex>
            </div>

            <PostList
              posts={posts}
              currentUserId={user?.id}
              currentUserRole={user?.role}
              deletingPostId={deletingPostId}
              updatingPostId={updatingPostId}
              errorMessage={errorMessage}
              emptyDescription={
                normalizedTag
                  ? `${displayTag} etiketiyle eslesen guncel bir paylasim yok.`
                  : "Hashtag baglantisi gecersiz oldugu icin bu trend acilamadi."
              }
              emptyActionLabel="Kesfete don"
              isLoading={Boolean(normalizedTag) && postsQuery.isLoading}
              onCreatePostClick={() => undefined}
              onDelete={handleDeletePost}
              onEmptyActionClick={() => navigate("/explore")}
              onUpdate={handleUpdatePost}
              showCreateAction={false}
              showGroupContext
            />

            {posts.length > 0 && postsQuery.hasNextPage && (
              <Flex justify="center" style={{ padding: "8px 0 24px" }}>
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
                style={{ textAlign: "center", padding: "8px 0 24px", display: "block" }}
              >
                Bu trenddeki gonderilerin sonuna geldin.
              </Typography.Text>
            )}
          </div>
        </div>

        {isDesktopSidebarVisible && (
          <div style={{ width: 350, flexShrink: 0, paddingLeft: 32 }}>
            <div style={{ position: "sticky", top: 12 }}>
              <FeedSidebar posts={posts} totalCount={totalCount} user={user} />
            </div>
          </div>
        )}
      </Flex>

      {!isMobile ? <FloatButton.BackTop style={{ right: 24, bottom: 24 }} /> : null}
    </div>
  );
}

function normalizeRouteTag(value?: string) {
  if (!value) {
    return "";
  }

  try {
    return decodeURIComponent(value).trim().replace(/^#/, "");
  } catch {
    return value.trim().replace(/^#/, "");
  }
}
