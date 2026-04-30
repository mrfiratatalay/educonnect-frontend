import { useState } from "react";
import type { ReactNode } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Skeleton, Typography, theme } from "antd";
import { useNavigate } from "react-router-dom";
import FollowSuggestionsCard from "@/components/shared/FollowSuggestionsCard";
import { useTrendingHashtagsQuery } from "@/features/posts/hooks";
import { useFollowUserMutation } from "@/features/users/hooks";

export default function CommunitiesRail() {
  const navigate = useNavigate();
  const trendingQuery = useTrendingHashtagsQuery(4);

  return (
    <Flex vertical gap={16} style={{ padding: "8px 16px 24px" }}>
      <RailCard
        title="Neler oluyor?"
        footer={
          <Button type="link" style={{ padding: 0 }} onClick={() => navigate("/explore")}>
            Daha fazla göster
          </Button>
        }
      >
        {trendingQuery.isLoading ? (
          <Skeleton active title={false} paragraph={{ rows: 4 }} />
        ) : trendingQuery.isError ? (
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Gündem şimdilik yüklenemedi.
          </Typography.Text>
        ) : trendingQuery.data && trendingQuery.data.length > 0 ? (
          <Flex vertical gap={16}>
            {trendingQuery.data.map((trend) => (
              <TrendRow
                key={trend.hashtag}
                label={trend.contextLabel}
                title={trend.hashtag}
                postCount={trend.postCount}
                onClick={() =>
                  navigate(`/explore/tag/${encodeURIComponent(trend.hashtag.replace(/^#/, ""))}`)
                }
              />
            ))}
          </Flex>
        ) : (
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Henüz aktif bir gündem yok.
          </Typography.Text>
        )}
      </RailCard>

      <FollowSuggestionsCard />

    </Flex>
  );
}

function RailCard({
  title,
  footer,
  children,
}: {
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const { token } = theme.useToken();

  return (
    <Card
      className="communities-side-card"
      variant="outlined"
      style={{
        borderColor: token.colorBorderSecondary,
        overflow: "hidden",
      }}
    >
      <Flex vertical gap={16}>
        <Typography.Title level={4} style={{ margin: 0, fontSize: 26, lineHeight: 1.15 }}>
          {title}
        </Typography.Title>
        {children}
        {footer ? <div>{footer}</div> : null}
      </Flex>
    </Card>
  );
}

function TrendRow({
  label,
  title,
  postCount,
  onClick,
}: {
  label: string;
  title: string;
  postCount: number;
  onClick: () => void;
}) {
  const { token } = theme.useToken();

  return (
    <div style={{ cursor: "pointer" }} onClick={onClick}>
      <Flex align="flex-start" justify="space-between" gap={12}>
        <div style={{ minWidth: 0 }}>
          <Typography.Text type="secondary" style={{ display: "block", fontSize: 13 }}>
            {label}
          </Typography.Text>
          <Typography.Text strong style={{ display: "block", fontSize: 17, lineHeight: 1.25 }}>
            {title}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ display: "block", fontSize: 13, marginTop: 2 }}>
            {postCount} gönderi
          </Typography.Text>
        </div>
        <EllipsisOutlined style={{ color: token.colorTextTertiary, marginTop: 4 }} />
      </Flex>
    </div>
  );
}
