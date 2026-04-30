import type { ReactNode } from "react";
import { Ellipsis, Search } from "lucide-react";
import { Card, Flex, Input, Skeleton, Typography, theme } from "antd";
import { useNavigate } from "react-router-dom";
import FollowSuggestionsCard from "@/components/shared/FollowSuggestionsCard";
import { useTrendingHashtagsQuery } from "@/features/posts/hooks";

export default function ProfileRightRail() {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const railSurface = token.colorBgElevated;
  const trendingQuery = useTrendingHashtagsQuery(3);

  return (
    <div style={{ width: 350, flexShrink: 0, paddingLeft: 32 }}>
      <div style={{ position: "sticky", top: 12 }}>
        <Flex vertical gap={16}>
          <Input
            size="large" placeholder="Ara"
            prefix={<Search size={18} style={{ color: token.colorTextTertiary }} />}
            variant="filled"
            style={{ borderRadius: 8, background: railSurface }}
          />

          <FollowSuggestionsCard
            title="Kimi takip etmeli"
            background={railSurface}
            bordered={false}
          />

          <RailCard title="Neler oluyor?" background={railSurface}>
            {trendingQuery.isLoading ? (
              <RailRow><Skeleton active title={false} paragraph={{ rows: 3 }} /></RailRow>
            ) : trendingQuery.isError ? (
              <RailRow>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>Gündem şimdilik yüklenemedi.</Typography.Text>
              </RailRow>
            ) : trendingQuery.data && trendingQuery.data.length > 0 ? (
              <>
                {trendingQuery.data.map((trend) => (
                  <RailRow key={trend.hashtag}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/explore/tag/${encodeURIComponent(trend.hashtag.replace(/^#/, ""))}`)}
                    >
                      <Flex justify="space-between" align="flex-start" gap={12}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <Typography.Text type="secondary" style={{ display: "block", fontSize: 13 }}>{trend.contextLabel}</Typography.Text>
                          <Typography.Text strong style={{ display: "block", fontSize: 16, lineHeight: 1.35, marginTop: 2 }}>{trend.hashtag}</Typography.Text>
                          <Typography.Text type="secondary" style={{ display: "block", fontSize: 13, marginTop: 2 }}>{trend.postCount} gönderi</Typography.Text>
                        </div>
                        <Ellipsis size={18} color={token.colorTextTertiary} />
                      </Flex>
                    </div>
                  </RailRow>
                ))}
              </>
            ) : (
              <RailRow>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>Henüz aktif bir gündem yok.</Typography.Text>
              </RailRow>
            )}
            <Typography.Link
              style={{ padding: "0 16px 16px", fontSize: 15 }}
              onClick={() => navigate("/explore")}
            >
              Daha fazla göster
            </Typography.Link>
          </RailCard>

        </Flex>
      </div>
    </div>
  );
}

function RailCard({ title, background, children }: { title: string; background: string; children: ReactNode }) {
  const { token } = theme.useToken();
  return (
    <Card variant="borderless"
      style={{ background, overflow: "hidden", borderRadius: 24, border: `1px solid ${token.colorBorderSecondary}` }}
      styles={{ body: { padding: 0 } }}>
      <Flex vertical gap={2}>
        <Typography.Title level={4}
          style={{ margin: 0, padding: "14px 16px 8px", fontSize: 24, fontWeight: 900, letterSpacing: "-0.03em" }}>
          {title}
        </Typography.Title>
        {children}
      </Flex>
    </Card>
  );
}

function RailRow({ children }: { children: ReactNode }) {
  return <div style={{ padding: "10px 16px" }}>{children}</div>;
}
