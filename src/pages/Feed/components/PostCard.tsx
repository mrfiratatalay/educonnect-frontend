import { useState } from "react";
import { Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTogglePostLikeMutation } from "@/features/posts/hooks";
import type { FeedPost } from "@/features/posts/types";
import { formatPostTime } from "@/features/posts/utils";
import PostCommentsPanel from "@/pages/Feed/components/PostCommentsPanel";
import PostEditForm from "@/pages/Feed/components/PostEditForm";

interface PostCardProps {
  post: FeedPost;
  canManage: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: (postId: string) => void;
  onUpdate: (postId: string, content: string) => Promise<void>;
}

export default function PostCard({
  post,
  canManage,
  isDeleting,
  isUpdating,
  onDelete,
  onUpdate,
}: PostCardProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const toggleLikeMutation = useTogglePostLikeMutation();

  const isLiking =
    toggleLikeMutation.isPending &&
    toggleLikeMutation.variables === post.id;

  function handleToggleLike() {
    void toggleLikeMutation.mutateAsync(post.id);
  }

  async function handleUpdate(content: string) {
    await onUpdate(post.id, content);
    setIsEditing(false);
  }

  return (
    <Card className="border border-border/60 rounded-xl">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Avatar
            className="w-10 h-10 shrink-0 cursor-pointer"
            onClick={() => navigate(`/profile/${post.userId}`)}
          >
            <AvatarImage src={post.avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {post.userName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <button
                  type="button"
                  className="text-sm font-semibold hover:underline"
                  onClick={() => navigate(`/profile/${post.userId}`)}
                >
                  {post.userName}
                </button>
                <p className="text-xs text-muted-foreground">
                  {formatPostTime(post.createdAt)}
                </p>
              </div>

              {canManage && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isUpdating}
                    className="gap-1.5"
                    onClick={() => setIsEditing((current) => !current)}
                  >
                    <Pencil className="w-4 h-4" />
                    {isEditing ? "Kapat" : "Duzenle"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isDeleting}
                    className="gap-1.5 text-destructive hover:text-destructive"
                    onClick={() => onDelete(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? "Siliniyor" : "Sil"}
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <PostEditForm
                initialContent={post.content}
                isSubmitting={isUpdating}
                onCancel={() => setIsEditing(false)}
                onSubmit={handleUpdate}
              />
            ) : (
              <p className="text-sm leading-relaxed text-foreground/90">
                {post.content}
              </p>
            )}

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Gonderi gorseli"
                className="max-h-96 w-full rounded-xl border border-border/50 object-cover"
              />
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={handleToggleLike}
                disabled={isLiking}
                className={`flex items-center gap-1.5 hover:text-red-500 ${post.isLiked ? "text-red-500" : ""}`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current text-red-500" : ""}`} />
                {post.likesCount}
              </button>
              <button
                type="button"
                onClick={() => setShowComments((current) => !current)}
                className={`flex items-center gap-1.5 hover:text-primary ${showComments ? "text-primary" : ""}`}
              >
                <MessageCircle className="w-4 h-4" />
                {post.commentsCount}
              </button>
            </div>
          </div>
        </div>

        {!isEditing && <PostCommentsPanel postId={post.id} isOpen={showComments} />}
      </CardContent>
    </Card>
  );
}
