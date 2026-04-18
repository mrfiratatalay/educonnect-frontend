import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, Flex, Popconfirm, Typography, theme } from "antd";
import { Trash2 } from "lucide-react";
import type { PostComment } from "@/features/posts/types";
import { useDeleteCommentMutation } from "@/features/posts/hooks";
import { useAuthStore } from "@/store/authStore";
import { formatPostTime } from "@/features/posts/utils";

interface PostCommentListProps {
  comments: PostComment[];
  postId: string;
  postAuthorId?: string;
}

export default function PostCommentList({
  comments,
  postId,
  postAuthorId,
}: PostCommentListProps) {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const currentUser = useAuthStore((s) => s.user);
  const deleteComment = useDeleteCommentMutation();

  if (comments.length === 0) {
    return (
      <Card
        size="small"
        style={{ background: token.colorBgContainer }}
        styles={{ body: { padding: 14 } }}
        variant="borderless"
      >
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          Henüz yorum yok. İlk yorumu sen yaz.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <Flex vertical gap={4}>
      {comments.map((comment) => {
        const canDelete =
          currentUser &&
          (currentUser.id === comment.userId ||
            currentUser.id === postAuthorId ||
            currentUser.role === "admin" ||
            currentUser.role === "moderatör");

        return (
          <div key={comment.id} style={{ padding: "8px 0" }}>
            <Flex gap={12} align="flex-start">
              <Avatar
                src={comment.avatarUrl}
                size={34}
                onClick={() => navigate(`/profile/${comment.userId}`)}
                style={{
                  backgroundColor: token.colorPrimaryBg,
                  color: token.colorPrimary,
                  flexShrink: 0,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                {comment.userName.charAt(0)}
              </Avatar>

              <div style={{ flex: 1, minWidth: 0 }}>
                <Flex align="center" justify="space-between" gap={8}>
                  <Flex align="center" gap={8} wrap="wrap">
                    <Typography.Link
                      onClick={() => navigate(`/profile/${comment.userId}`)}
                      style={{ fontSize: 13, fontWeight: 600 }}
                    >
                      {comment.userName}
                    </Typography.Link>
                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                      {formatPostTime(comment.createdAt)}
                    </Typography.Text>
                  </Flex>

                  {canDelete && (
                    <Popconfirm
                      title="Bu yorumu silmek istediğinize emin misiniz?"
                      okText="Sil"
                      cancelText="Vazgeç"
                      okButtonProps={{ danger: true }}
                      onConfirm={() =>
                        void deleteComment.mutateAsync({
                          postId,
                          commentId: comment.id,
                        })
                      }
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<Trash2 size={13} />}
                        loading={
                          deleteComment.isPending &&
                          deleteComment.variables?.commentId === comment.id
                        }
                        style={{
                          color: token.colorTextTertiary,
                          flexShrink: 0,
                          padding: "0 4px",
                          height: 22,
                        }}
                      />
                    </Popconfirm>
                  )}
                </Flex>

                <Typography.Paragraph
                  style={{ marginBottom: 0, marginTop: 4, fontSize: 13, lineHeight: 1.7 }}
                >
                  {comment.content}
                </Typography.Paragraph>
              </div>
            </Flex>
          </div>
        );
      })}
    </Flex>
  );
}
