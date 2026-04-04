import { useNavigate } from "react-router-dom";
import { Avatar, Card, Flex, Typography, theme } from "antd";
import type { PostComment } from "@/features/posts/types";
import { formatPostTime } from "@/features/posts/utils";

interface PostCommentListProps {
  comments: PostComment[];
}

export default function PostCommentList({ comments }: PostCommentListProps) {
  const navigate = useNavigate();
  const { token } = theme.useToken();

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
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{ padding: "8px 0" }}
        >
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

            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
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
              <Typography.Paragraph
                style={{ marginBottom: 0, marginTop: 6, fontSize: 13, lineHeight: 1.7 }}
              >
                {comment.content}
              </Typography.Paragraph>
            </div>
          </Flex>
        </div>
      ))}
    </Flex>
  );
}
