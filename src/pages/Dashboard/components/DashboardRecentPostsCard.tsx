import { Alert, Avatar, Button, Card, Empty, Flex, Spin, Typography, theme } from "antd";
import { ArrowRight, Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { FeedPost } from "@/features/posts/types";
import { formatPostTime, getPostExcerpt } from "@/features/posts/utils";

interface DashboardRecentPostsCardProps {
  posts: FeedPost[];
  errorMessage?: string;
  isLoading: boolean;
}

export default function DashboardRecentPostsCard({
  posts,
  errorMessage,
  isLoading,
}: DashboardRecentPostsCardProps) {
  const { token } = theme.useToken();

  return (
    <Card
      title={
        <Flex align="center" gap={10}>
          <MessageCircle size={18} color={token.colorPrimary} />
          <Typography.Text strong>Son Paylasimlar</Typography.Text>
        </Flex>
      }
      extra={
        <Link to="/feed" style={{ textDecoration: "none" }}>
          <Button type="text" icon={<ArrowRight size={14} />} iconPlacement="end">
            Feed'e Git
          </Button>
        </Link>
      }
      styles={{
        body: {
          padding: 20,
        },
      }}
    >
      <Flex vertical gap={12}>
        {isLoading && (
          <Flex justify="center" style={{ paddingBlock: 32 }}>
            <Spin size="large" />
          </Flex>
        )}

        {!isLoading && errorMessage && (
          <Alert type="error" showIcon title={errorMessage} />
        )}

        {!isLoading && !errorMessage && posts.length === 0 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Henuz paylasim bulunmuyor."
          />
        )}

        {!isLoading &&
          !errorMessage &&
          posts.map((post) => (
            <Link
              key={post.id}
              to="/feed"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Flex
                align="flex-start"
                gap={14}
                style={{
                  padding: 16,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: token.borderRadiusLG,
                  background: token.colorBgLayout,
                }}
              >
                <Avatar
                  src={post.avatarUrl}
                  alt={post.userName}
                  size={44}
                  style={{
                    backgroundColor: token.colorPrimaryBg,
                    color: token.colorPrimary,
                    flexShrink: 0,
                  }}
                >
                  {getInitials(post.userName)}
                </Avatar>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Flex align="center" justify="space-between" gap={12}>
                    <Typography.Text strong ellipsis style={{ maxWidth: "70%" }}>
                      {post.userName}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      {formatPostTime(post.createdAt)}
                    </Typography.Text>
                  </Flex>

                  <Typography.Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{
                      color: token.colorTextSecondary,
                      margin: "8px 0 12px",
                    }}
                  >
                    {getPostExcerpt(post.content, 140)}
                  </Typography.Paragraph>

                  <Flex gap={16} wrap="wrap">
                    <Flex align="center" gap={6}>
                      <Heart size={14} color={token.colorTextSecondary} />
                      <Typography.Text type="secondary">
                        {post.likesCount} begeni
                      </Typography.Text>
                    </Flex>

                    <Flex align="center" gap={6}>
                      <MessageCircle size={14} color={token.colorTextSecondary} />
                      <Typography.Text type="secondary">
                        {post.commentsCount} yorum
                      </Typography.Text>
                    </Flex>
                  </Flex>
                </div>
              </Flex>
            </Link>
          ))}
      </Flex>
    </Card>
  );
}

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}
