import { useMemo, useState } from "react";
import { ArrowLeft, Bookmark, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Affix,
  Alert,
  Button,
  Flex,
  Input,
  List,
  Skeleton,
  Typography,
  theme,
} from "antd";
import {
  useDeletePostMutation,
  useInfiniteBookmarkedPostsQuery,
  useUpdatePostMutation,
} from "@/features/posts/hooks";
import PostCard from "@/pages/Feed/components/PostCard";
import { useAuthStore } from "@/store/authStore";

export default function BookmarksPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const user = useAuthStore((state) => state.user);

  const bookmarkedPostsQuery = useInfiniteBookmarkedPostsQuery(10);
  const deletePostMutation = useDeletePostMutation();
  const updatePostMutation = useUpdatePostMutation();

  const bookmarkedPosts =
    bookmarkedPostsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return bookmarkedPosts;
    }

    return bookmarkedPosts.filter((post) =>
      `${post.userName} ${post.content}`.toLowerCase().includes(normalizedQuery),
    );
  }, [bookmarkedPosts, query]);

  const errorMessage =
    bookmarkedPostsQuery.error instanceof Error
      ? bookmarkedPostsQuery.error.message
      : undefined;
  const deletingPostId =
    deletePostMutation.isPending && typeof deletePostMutation.variables === "string"
      ? deletePostMutation.variables
      : undefined;
  const updatingPostId =
    updatePostMutation.isPending ? updatePostMutation.variables?.postId : undefined;

  async function handleUpdatePost(postId: string, content: string) {
    await updatePostMutation.mutateAsync({ postId, content });
  }

  function handleDeletePost(postId: string) {
    void deletePostMutation.mutateAsync(postId);
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div
        style={{
          minHeight: "100vh",
          background: token.colorBgContainer,
          borderInline: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Affix offsetTop={0}>
          <div
            style={{
              background: `${token.colorBgContainer}E6`,
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              zIndex: 10,
            }}
          >
            <Flex align="center" gap={18} style={{ padding: "10px 16px 8px" }}>
              <Button
                type="text"
                shape="circle"
                aria-label="Geri don"
                style={{ width: 36, height: 36, color: token.colorText }}
                icon={<ArrowLeft size={18} />}
                onClick={() => navigate(-1)}
              />

              <div>
                <Typography.Title
                  level={3}
                  style={{ margin: 0, fontSize: 28, fontWeight: 800 }}
                >
                  Yer Isaretleri
                </Typography.Title>
                <Typography.Text type="secondary">
                  Kaydettigin gonderiler burada gorunur.
                </Typography.Text>
              </div>
            </Flex>

            <div style={{ padding: "0 16px 14px" }}>
              <Input
                size="large"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Kayitlarda ara"
                prefix={<Search size={18} style={{ color: token.colorTextTertiary }} />}
                variant="outlined"
                style={{ borderRadius: 999 }}
              />
            </div>
          </div>
        </Affix>

        {errorMessage ? (
          <div style={{ padding: 16 }}>
            <Alert type="error" showIcon message={errorMessage} />
          </div>
        ) : bookmarkedPostsQuery.isLoading ? (
          <Flex vertical gap={0} style={{ padding: "12px 16px" }}>
            <Skeleton active avatar paragraph={{ rows: 3 }} title={false} />
            <Skeleton active avatar paragraph={{ rows: 3 }} title={false} />
          </Flex>
        ) : filteredPosts.length === 0 ? (
          <Flex
            vertical
            align="center"
            justify="center"
            gap={12}
            style={{ minHeight: "calc(100vh - 152px)", padding: "40px 24px" }}
          >
            <Bookmark size={48} color={token.colorTextTertiary} />
            <Typography.Title level={3} style={{ margin: 0, textAlign: "center" }}>
              {query.trim() ? "Aramana uygun bir kayit yok." : "Henuz kayitli gonderi yok."}
            </Typography.Title>
            <Typography.Paragraph
              type="secondary"
              style={{ margin: 0, textAlign: "center", maxWidth: 360 }}
            >
              {query.trim()
                ? "Farkli bir kelime ile tekrar dene."
                : "Feed'de bookmark ikonuna basarak gonderileri buraya kaydedebilirsin."}
            </Typography.Paragraph>
          </Flex>
        ) : (
          <>
            <List
              itemLayout="vertical"
              dataSource={filteredPosts}
              renderItem={(post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  canManage={
                    post.userId === user?.id ||
                    user?.role === "admin" ||
                    user?.role === "moderator"
                  }
                  isDeleting={deletingPostId === post.id}
                  isUpdating={updatingPostId === post.id}
                  onDelete={handleDeletePost}
                  onUpdate={handleUpdatePost}
                />
              )}
            />

            {bookmarkedPostsQuery.hasNextPage && (
              <Flex justify="center" style={{ padding: "8px 0 24px" }}>
                <Button
                  onClick={() => void bookmarkedPostsQuery.fetchNextPage()}
                  loading={bookmarkedPostsQuery.isFetchingNextPage}
                >
                  Daha Fazla Yukle
                </Button>
              </Flex>
            )}
          </>
        )}
      </div>
    </div>
  );
}
