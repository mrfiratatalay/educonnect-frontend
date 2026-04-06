import { EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Skeleton, Typography, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { useTrendingHashtagsQuery } from "@/features/posts/hooks";
import { useFollowSuggestionsQuery, useFollowUserMutation } from "@/features/users/hooks";
import type { FeedPost } from "@/features/posts/types";
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
  const navigate = useNavigate();
  const trendingQuery = useTrendingHashtagsQuery(4);
  const followSuggestionsQuery = useFollowSuggestionsQuery(3);
  const followUserMutation = useFollowUserMutation();
  const recentGroups = Array.from(
    posts.reduce(
      (map, post) => {
        if (!post.groupId || !post.groupName) {
          return map;
        }

        map.set(post.groupId, {
          id: post.groupId,
          name: post.groupName,
          avatarUrl: post.groupAvatarUrl,
        });

        return map;
      },
      new Map<
        string,
        {
          id: string;
          name: string;
          avatarUrl?: string;
        }
      >(),
    ).values(),
  ).slice(0, 4);

  return (
    <Flex vertical gap={16}>
      <Card
        variant="outlined"
        styles={{ body: { padding: 18 } }}
        style={{ borderColor: token.colorBorderSecondary, borderRadius: 24 }}
      >
        <Flex vertical gap={12}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Hesabinin ozeti
          </Typography.Title>
          <Flex align="center" gap={12}>
            <Avatar src={user?.avatarUrl} size={52}>
              {user?.fullName?.charAt(0) ?? "K"}
            </Avatar>
            <div>
              <Typography.Text strong style={{ display: "block", fontSize: 15 }}>
                {user?.fullName ?? "Kullanici"}
              </Typography.Text>
              <Typography.Text type="secondary">
                @{user?.email?.split("@")[0] ?? "kullanici"}
              </Typography.Text>
            </div>
          </Flex>
          <QuickRow label="Toplam gonderi" value={`${totalCount}`} />
          <QuickRow label="Akistaki grup izi" value={`${recentGroups.length}`} />
        </Flex>
      </Card>

      <Card
        variant="outlined"
        styles={{ body: { padding: 18 } }}
        style={{ borderColor: token.colorBorderSecondary, borderRadius: 24 }}
      >
        <Flex vertical gap={12}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Neler oluyor?
          </Typography.Title>

          {trendingQuery.isLoading ? (
            <Skeleton active title={false} paragraph={{ rows: 4 }} />
          ) : trendingQuery.isError ? (
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Gundem simdilik yuklenemedi.
            </Typography.Text>
          ) : trendingQuery.data && trendingQuery.data.length > 0 ? (
            <>
              {trendingQuery.data.map((trend) => (
                <TrendPreviewRow
                  key={trend.hashtag}
                  contextLabel={trend.contextLabel}
                  hashtag={trend.hashtag}
                  metricLabel={formatTrendMetric(trend.postCount)}
                  onClick={() =>
                    navigate(`/explore/tag/${encodeURIComponent(trend.hashtag.replace(/^#/, ""))}`)
                  }
                />
              ))}

              <Typography.Link
                style={{ fontSize: 15 }}
                onClick={() => navigate("/explore")}
              >
                Daha fazla goster
              </Typography.Link>
            </>
          ) : (
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Henuz aktif bir hashtag gundemi yok.
            </Typography.Text>
          )}
        </Flex>
      </Card>

      <Card
        variant="outlined"
        styles={{ body: { padding: 18 } }}
        style={{ borderColor: token.colorBorderSecondary, borderRadius: 24 }}
      >
        <Flex vertical gap={12}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Kimi takip etmeli
          </Typography.Title>

          {followSuggestionsQuery.isLoading ? (
            <Skeleton active title={false} paragraph={{ rows: 3 }} />
          ) : followSuggestionsQuery.isError ? (
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Kullanici onerileri simdilik yuklenemedi.
            </Typography.Text>
          ) : followSuggestionsQuery.data && followSuggestionsQuery.data.length > 0 ? (
            <>
              {followSuggestionsQuery.data.map((suggestion) => (
                <FollowSuggestionRow
                  key={suggestion.id}
                  avatarUrl={suggestion.avatarUrl}
                  isSubmitting={
                    followUserMutation.isPending &&
                    followUserMutation.variables === suggestion.id
                  }
                  name={suggestion.fullName}
                  onClick={() => navigate(`/profile/${suggestion.id}`)}
                  onFollow={() => {
                    void followUserMutation.mutateAsync(suggestion.id);
                  }}
                  reasonLabel={suggestion.reasonLabel}
                />
              ))}
            </>
          ) : (
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Su an yeni bir takip onerisi yok.
            </Typography.Text>
          )}
        </Flex>
      </Card>
    </Flex>
  );
}

function QuickRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex align="center" justify="space-between" gap={12}>
      <Typography.Text type="secondary">{label}</Typography.Text>
      <Typography.Text strong>{value}</Typography.Text>
    </Flex>
  );
}

function TrendPreviewRow({
  contextLabel,
  hashtag,
  metricLabel,
  onClick,
}: {
  contextLabel: string;
  hashtag: string;
  metricLabel: string;
  onClick: () => void;
}) {
  const { token } = theme.useToken();

  return (
    <div style={{ cursor: "pointer" }} onClick={onClick}>
      <Flex justify="space-between" align="flex-start" gap={12}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Typography.Text type="secondary" style={{ display: "block", fontSize: 13 }}>
            {contextLabel}
          </Typography.Text>
          <Typography.Text strong style={{ display: "block", fontSize: 16, marginTop: 2 }}>
            {hashtag}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ display: "block", fontSize: 13, marginTop: 2 }}>
            {metricLabel}
          </Typography.Text>
        </div>
        <EllipsisOutlined style={{ color: token.colorTextTertiary, marginTop: 2 }} />
      </Flex>
    </div>
  );
}

function formatTrendMetric(postCount: number) {
  return `${postCount} gonderi`;
}

function FollowSuggestionRow({
  avatarUrl,
  isSubmitting,
  name,
  onClick,
  onFollow,
  reasonLabel,
}: {
  avatarUrl?: string;
  isSubmitting: boolean;
  name: string;
  onClick: () => void;
  onFollow: () => void;
  reasonLabel: string;
}) {
  return (
    <Flex gap={12} align="center" style={{ margin: "4px 0" }}>
      <Avatar
        src={avatarUrl}
        size={40}
        style={{ cursor: "pointer", flexShrink: 0 }}
        onClick={onClick}
      >
        {name.charAt(0)}
      </Avatar>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography.Text
          strong
          ellipsis
          style={{ fontSize: 15, lineHeight: 1.2, cursor: "pointer" }}
          onClick={onClick}
        >
          {name}
        </Typography.Text>
        <Typography.Text type="secondary" ellipsis style={{ fontSize: 15 }}>
          {reasonLabel}
        </Typography.Text>
      </div>
      <Button
        type="primary"
        shape="round"
        loading={isSubmitting}
        onClick={onFollow}
        style={{ fontWeight: 700, padding: "0 16px" }}
      >
        Takip et
      </Button>
    </Flex>
  );
}
