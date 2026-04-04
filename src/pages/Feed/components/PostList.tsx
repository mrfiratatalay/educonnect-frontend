import { Alert, Button, Empty, Skeleton, List, theme, ConfigProvider } from "antd";
import type { FeedPost } from "@/features/posts/types";
import type { UserRole } from "@/types";
import PostCard from "@/pages/Feed/components/PostCard";

interface PostListProps {
  posts: FeedPost[];
  currentUserId?: string;
  currentUserRole?: UserRole;
  deletingPostId?: string;
  updatingPostId?: string;
  errorMessage?: string;
  isLoading: boolean;
  onCreatePostClick: () => void;
  onDelete: (postId: string) => void;
  onUpdate: (postId: string, content: string) => Promise<void>;
}

export default function PostList({
  posts,
  currentUserId,
  currentUserRole,
  deletingPostId,
  updatingPostId,
  errorMessage,
  isLoading,
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
              description={<span style={{ color: token.colorTextSecondary }}>Henüz gönderi yok. İlk paylaşımı sen yap.</span>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: "40px 0" }}
            >
              <Button onClick={onCreatePostClick} type="primary" shape="round" style={{ marginTop: 8 }}>
                Paylaşım Oluştur
              </Button>
            </Empty>
          )
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
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        )}
      />
    </ConfigProvider>
  );
}


