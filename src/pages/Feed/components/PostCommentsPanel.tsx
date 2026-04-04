import { Card, CardContent } from "@/components/ui/card";
import {
  useAddPostCommentMutation,
  usePostDetailQuery,
} from "@/features/posts/hooks";
import PostCommentComposer from "@/pages/Feed/components/PostCommentComposer";
import PostCommentList from "@/pages/Feed/components/PostCommentList";

interface PostCommentsPanelProps {
  postId: string;
  isOpen: boolean;
}

export default function PostCommentsPanel({
  postId,
  isOpen,
}: PostCommentsPanelProps) {
  const postDetailQuery = usePostDetailQuery(postId, isOpen);
  const addCommentMutation = useAddPostCommentMutation();

  async function handleAddComment(content: string) {
    await addCommentMutation.mutateAsync({ postId, content });
  }

  if (!isOpen) {
    return null;
  }

  return (
    <Card className="border border-border/50 bg-secondary/10">
      <CardContent className="space-y-4 p-4">
        {postDetailQuery.isLoading && (
          <p className="text-sm text-muted-foreground">Yorumlar yukleniyor...</p>
        )}

        {postDetailQuery.error instanceof Error && (
          <p className="text-sm text-destructive">
            {postDetailQuery.error.message}
          </p>
        )}

        {postDetailQuery.data && (
          <PostCommentList comments={postDetailQuery.data.comments} />
        )}

        <PostCommentComposer
          isSubmitting={addCommentMutation.isPending}
          onSubmit={handleAddComment}
        />
      </CardContent>
    </Card>
  );
}
