import { Alert, Button, ConfigProvider, Empty, List, theme } from "antd";
import type { FeedPost } from "@/features/posts/types";
import type { UserRole } from "@/types";
import PostCard from "@/pages/Feed/components/PostCard";

interface PostListProps {
  posts: FeedPost[];
  currentUserId?: string;
  currentUserRole?: UserRole;
  deletingPostId?: string;
  emptyActionLabel?: string;
  emptyDescription?: string;
  updatingPostId?: string;
  errorMessage?: string;
  isLoading: boolean;
  mode?: "feed" | "detail";
  onEmptyActionClick?: () => void;
  showGroupContext?: boolean;
  showRecommendationReason?: boolean;
  showCreateAction?: boolean;
  onCreatePostClick: () => void;
  onDelete: (postId: string) => void;
  onUpdate: (postId: string, content: string) => Promise<void>;
}

export default function PostList({
  posts,
  currentUserId,
  currentUserRole,
  deletingPostId,
  emptyActionLabel,
  emptyDescription,
  updatingPostId,
  errorMessage,
  isLoading,
  mode = "feed",
  onEmptyActionClick,
  showGroupContext = false,
  showRecommendationReason = false,
  showCreateAction = true,
  onCreatePostClick,
  onDelete,
  onUpdate,
}: PostListProps) {
  const { token } = theme.useToken();

  if (errorMessage) {
    return <Alert type="error" showIcon message={errorMessage} />;
  }

  return (
    <ConfigProvider theme={{ components: { List: { paddingContentHorizontalLG: 0 } } }}>
      <List
        itemLayout="vertical"
        size="large"
        loading={isLoading}
        dataSource={posts}
        locale={{
          emptyText: (
            <Empty
              description={
                <span style={{ color: token.colorTextSecondary }}>
                  {emptyDescription ?? "Henuz gonderi yok. Ilk paylasimi sen yap."}
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: "40px 0" }}
            >
              {showCreateAction ? (
                <Button onClick={onCreatePostClick} type="primary" shape="round" style={{ marginTop: 8 }}>
                  Paylasim olustur
                </Button>
              ) : emptyActionLabel && onEmptyActionClick ? (
                <Button onClick={onEmptyActionClick} type="primary" shape="round" style={{ marginTop: 8 }}>
                  {emptyActionLabel}
                </Button>
              ) : null}
            </Empty>
          ),
        }}
        renderItem={(post) => (
          <PostCard
            key={post.id}
            post={post}
            canManage={
              post.userId === currentUserId ||
              currentUserRole === "admin" ||
              currentUserRole === "moderator"
            }
            isDeleting={deletingPostId === post.id}
            isUpdating={updatingPostId === post.id}
            mode={mode}
            onDelete={onDelete}
            showGroupContext={showGroupContext}
            showRecommendationReason={showRecommendationReason}
            onUpdate={onUpdate}
          />
        )}
      />
    </ConfigProvider>
  );
}
