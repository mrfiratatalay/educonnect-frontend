import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button, Flex, Typography, theme, Spin, Alert, Divider } from "antd";
import { usePostDetailQuery } from "@/features/posts/hooks";
import PostCard from "@/pages/Feed/components/PostCard";
import PostCommentComposer from "@/pages/Feed/components/PostCommentComposer";
import PostCommentList from "@/pages/Feed/components/PostCommentList";
import { useAddPostCommentMutation } from "@/features/posts/hooks";
import { useAuthStore } from "@/store/authStore";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const user = useAuthStore((state) => state.user);

  const postDetailQuery = usePostDetailQuery(id || "", true);
  const addCommentMutation = useAddPostCommentMutation();

  const handleAddComment = async (content: string) => {
    if (id) {
      await addCommentMutation.mutateAsync({ postId: id, content });
    }
  };

  const isPostError = postDetailQuery.error instanceof Error;

  return (
    <div style={{ maxWidth: 600, width: "100%", margin: "0 auto", borderRight: `1px solid ${token.colorBorderSecondary}`, minHeight: "100vh" }}>
      {/* Header */}
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

      {/* Main Content */}
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
          {/* Post itself (rendered via PostCard or custom block if we want specific big fonts) */}
          {/* For exact X, Post details page has larger font for content and shows time inline.
              If we reuse PostCard, it will look like timeline post. X uses a slightly different template for details.
              Since we have PostCard, let's use it for now, and hide the comments panel since we have one below. */}
          <div style={{ pointerEvents: 'none' /* Disable link to itself if PostCard clicks to post */ }}>
             <PostCard
               post={postDetailQuery.data.post}
               canManage={user?.id === postDetailQuery.data.post.userId}
               isDeleting={false}
               isUpdating={false}
               onDelete={() => {}}
               onUpdate={async () => {}}
             />
          </div>

          <Divider style={{ margin: 0, borderColor: token.colorBorderSecondary }} />

          {/* Comment Composer */}
          <PostCommentComposer
            isSubmitting={addCommentMutation.isPending}
            onSubmit={handleAddComment}
          />
          
          <Divider style={{ margin: 0, borderColor: token.colorBorderSecondary }} />

          {/* Comments List */}
          <PostCommentList comments={postDetailQuery.data.comments || []} />
        </div>
      ) : (
        <div style={{ padding: 16 }}>Gönderi bulunamadı.</div>
      )}
    </div>
  );
}
