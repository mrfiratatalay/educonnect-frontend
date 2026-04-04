import {
  HeartOutlined,
  MessageOutlined,
  UserOutlined,
  FireFilled,
} from "@ant-design/icons";
import { Avatar, Flex, Statistic, Typography, theme, Timeline, Card } from "antd";
import type { FeedPost } from "@/features/posts/types";
import { getPostExcerpt } from "@/features/posts/utils";
import type { User } from "@/types";

interface FeedSidebarProps {
  posts: FeedPost[];
  totalCount: number;
  user: User | null;
}

export default function FeedSidebar({
  posts,
  totalCount,
  user,
}: FeedSidebarProps) {
  const { token } = theme.useToken();
  const trendingPosts = [...posts]
    .sort((left, right) => {
      const leftScore = left.likesCount + left.commentsCount;
      const rightScore = right.likesCount + right.commentsCount;
      return rightScore - leftScore;
    })
    .slice(0, 3);

  return (
    <Flex vertical gap={24}>
      <Card bordered={false} style={{ background: token.colorBgContainer, borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        <Flex gap={12} align="flex-start">
          <Avatar
            src={user?.avatarUrl}
            icon={!user?.avatarUrl ? <UserOutlined /> : undefined}
            size={48}
            style={{
              backgroundColor: token.colorPrimaryBg,
              color: token.colorPrimary,
              flexShrink: 0,
            }}
          >
            {user?.fullName?.charAt(0) ?? "K"}
          </Avatar>

          <div style={{ minWidth: 0, flex: 1 }}>
            <Typography.Text strong style={{ display: "block", fontSize: 16 }}>
              {user?.fullName ?? "Kullanıcı"}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              {user?.department || user?.universityName || "Topluluğa bağlı"}
            </Typography.Text>
          </div>
        </Flex>

        <Flex gap={24} style={{ marginTop: 24 }}>
          <div style={{ flex: 1 }}>
            <Statistic value={totalCount} title={<Typography.Text type="secondary" style={{fontSize: 12}}>Toplam</Typography.Text>} valueStyle={{ fontSize: 20, fontWeight: 600 }} />
          </div>
          <div style={{ flex: 1 }}>
            <Statistic value={posts.length} title={<Typography.Text type="secondary" style={{fontSize: 12}}>Bu Sayfa</Typography.Text>} valueStyle={{ fontSize: 20, fontWeight: 600 }} />
          </div>
        </Flex>
      </Card>

      <Card bordered={false} style={{ background: token.colorBgContainer, borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        <Typography.Text
          type="secondary"
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 20,
            display: "block"
          }}
        >
          Öne Çıkan Paylaşımlar
        </Typography.Text>
        
        {trendingPosts.length === 0 ? (
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Feed doldukça burada en çok etkileşim alan paylaşımlar görünecek.
          </Typography.Text>
        ) : (
          <Timeline
            items={trendingPosts.map((post) => ({
              dot: <FireFilled style={{ fontSize: '14px', color: '#ff4d4f' }} />,
              children: (
                <div style={{ marginLeft: 8 }}>
                  <Typography.Text style={{ display: "block", fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>
                    {getPostExcerpt(post.content, 88)}
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    style={{ display: "block", fontSize: 12, marginTop: 4 }}
                  >
                    {post.userName}
                  </Typography.Text>
                  <Flex gap={12} style={{ marginTop: 8 }}>
                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                      <HeartOutlined style={{ marginRight: 4 }} />
                      {post.likesCount}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                      <MessageOutlined style={{ marginRight: 4 }} />
                      {post.commentsCount}
                    </Typography.Text>
                  </Flex>
                </div>
              ),
            }))}
            style={{ marginTop: 12 }}
          />
        )}
      </Card>
    </Flex>
  );
}
