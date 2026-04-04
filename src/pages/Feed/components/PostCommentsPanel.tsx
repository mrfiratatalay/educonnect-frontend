import { Alert, Divider, Flex, Skeleton } from "antd";
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
    <div style={{ marginTop: 16, paddingLeft: 16, borderLeft: "2px solid var(--ant-color-border-secondary)" }}>
      <Flex vertical gap={16}>
        {postDetailQuery.isLoading && (
          <div style={{ padding: "8px 0" }}>
            <Skeleton active avatar paragraph={{ rows: 2 }} title={false} />
          </div>
        )}

        {postDetailQuery.error instanceof Error && (
          <Alert type="error" message={postDetailQuery.error.message} showIcon />
        )}

        {postDetailQuery.data && (
          <PostCommentList comments={postDetailQuery.data.comments} />
        )}

        <Divider size="small" style={{ margin: 0 }} />

        <PostCommentComposer
          isSubmitting={addCommentMutation.isPending}
          onSubmit={handleAddComment}
        />
      </Flex>
    </div>
  );
}
