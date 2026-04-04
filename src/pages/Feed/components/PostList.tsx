import { Card, CardContent } from "@/components/ui/card";
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
  onDelete,
  onUpdate,
}: PostListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Paylasimlar yukleniyor...
        </CardContent>
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-destructive">
          {errorMessage}
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Henuz gonderi yok. Ilk paylasimi sen yap.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
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
      ))}
    </div>
  );
}
