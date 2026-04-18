import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Alert, Button, Divider, Flex, Spin, Typography, theme } from "antd";
import {
  useAddPostCommentMutation,
  useDeletePostMutation,
  usePostDetailQuery,
  useTrackPostViewMutation,
  useUpdatePostMutation,
} from "@/features/posts/hooks";
import type { UpdatePostInput } from "@/features/posts/types";
import PostCard from "@/pages/Feed/components/PostCard";
import PostCommentComposer from "@/pages/Feed/components/PostCommentComposer";
import PostCommentList from "@/pages/Feed/components/PostCommentList";
import { useAuthStore } from "@/store/authStore";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const trackedPostIdRef = useRef<string | null>(null);
  const { token } = theme.useToken();
  const user = useAuthStore((state) => state.user);

  const postDetailQuery = usePostDetailQuery(id || "", true);
  const addCommentMutation = useAddPostCommentMutation();
  const deletePostMutation = useDeletePostMutation();
  const trackPostViewMutation = useTrackPostViewMutation();
  const updatePostMutation = useUpdatePostMutation();

  useEffect(() => {
    const postId = postDetailQuery.data?.post.id;

    if (!postId || trackedPostIdRef.current === postId) {
      return;
    }

    trackedPostIdRef.current = postId;
    void trackPostViewMutation.mutateAsync(postId);
  }, [postDetailQuery.data?.post.id, trackPostViewMutation]);

  async function handleAddComment(content: string) {
    if (id) {
      await addCommentMutation.mutateAsync({ postId: id, content });
    }
  }

  async function handleUpdatePost(postId: string, input: Omit<UpdatePostInput, "postId">) {
    await updatePostMutation.mutateAsync({ postId, ...input });
  }

  async function handleDeletePost(postId: string) {
    await deletePostMutation.mutateAsync(postId);
    navigate("/", { replace: true });
  }

  const isPostError = postDetailQuery.error instanceof Error;
  const deletingPostId =
    deletePostMutation.isPending && typeof deletePostMutation.variables === "string"
      ? deletePostMutation.variables
      : undefined;
  const updatingPostId =
    updatePostMutation.isPending ? updatePostMutation.variables?.postId : undefined;

  return (
    <div
      style={{
        maxWidth: 600,
        width: "100%",
        margin: "0 auto",
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        minHeight: "100vh",
      }}
    >
      <Flex
        align="center"
        gap={24}
        style={{
          height: 53,
          padding: "0 16px",
          position: "sticky",
          top: 0,
          background: token.colorBgContainer,
          zIndex: 10,
          opacity: 0.95,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Button
          type="text"
          shape="circle"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
        />
        <Typography.Title level={2} style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
          Gönderi
        </Typography.Title>
      </Flex>

      {postDetailQuery.isLoading ? (
        <Flex justify="center" style={{ padding: 40 }}>
          <Spin />
        </Flex>
      ) : isPostError ? (
        <div style={{ padding: 16 }}>
          <Alert type="error" message={postDetailQuery.error?.message} />
        </div>
      ) : postDetailQuery.data?.post ? (
        <div>
          <PostCard
            post={postDetailQuery.data.post}
            canManage={
              postDetailQuery.data.post.userId === user?.id ||
              user?.role === "admin" ||
              user?.role === "moderatör"
            }
            isDeleting={deletingPostId === postDetailQuery.data.post.id}
            isUpdating={updatingPostId === postDetailQuery.data.post.id}
            mode="detail"
            onDelete={(postId) => {
              void handleDeletePost(postId);
            }}
            onUpdate={handleUpdatePost}
          />

          <Divider style={{ margin: 0, borderColor: token.colorBorderSecondary }} />

          <PostCommentComposer
            id="post-comment-composer"
            isSubmitting={addCommentMutation.isPending}
            onSubmit={handleAddComment}
          />

          <Divider style={{ margin: 0, borderColor: token.colorBorderSecondary }} />

          <PostCommentList
            comments={postDetailQuery.data.comments || []}
            postId={postDetailQuery.data.post.id}
            postAuthorId={postDetailQuery.data.post.userId}
          />
        </div>
      ) : (
        <div style={{ padding: 16 }}>Gönderi bulunamadi.</div>
      )}
    </div>
  );
}
