import {
  Alert,
  Badge,
  Card,
  Col,
  Empty,
  Flex,
  Row,
  Skeleton,
  Spin,
  Tag,
  Typography,
  theme,
} from "antd";
import { Clock, Filter, Layers, TrendingUp } from "lucide-react";
import { formatPrice } from "../helpers";
import type { SearchSession } from "../types";

interface SearchResultsProps {
  activeResultId: string | null;
  error: string | null;
  searching: boolean;
  session: SearchSession | null;
  onSelect: (id: string) => void;
}

export function SearchResults({
  activeResultId,
  error,
  searching,
  session,
  onSelect,
}: SearchResultsProps) {
  const { token } = theme.useToken();

  /* ── Skeleton State ── */
  if (searching) {
    return (
      <Flex vertical gap={24}>
        <Row gutter={[20, 20]}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Col key={i} xs={24} sm={12} xl={8}>
              <Card
                style={{ borderRadius: token.borderRadiusLG * 1.5, overflow: "hidden" }}
                styles={{ body: { padding: 0 } }}
              >
                <Skeleton.Image active style={{ width: "100%", height: 200, display: "block" }} />
                <div style={{ padding: 16 }}>
                  <Skeleton active paragraph={{ rows: 2 }} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Flex>
    );
  }

  /* ── Error State ── */
  if (error) {
    return <Alert type="error" showIcon message={error} style={{ borderRadius: 12 }} />;
  }

  /* ── Loaded Image but not Searched yet ── */
  if (!session) {
    return (
      <Flex 
        align="center" 
        justify="center" 
        style={{ height: "100%", minHeight: 400 }}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span style={{ color: token.colorTextSecondary }}>
              Aramayı başlatmak için "Benzer İlanları Bul" veya Enter'a basın
            </span>
          }
        />
      </Flex>
    );
  }

  /* ── Results State ── */
  return (
    <Flex vertical gap={24}>
      {/* ── Summary Info Bar ── */}
      <Card
        style={{
          borderRadius: token.borderRadiusLG * 1.5,
          border: `1px solid ${token.colorBorder}`,
        }}
        styles={{ body: { padding: "12px 20px" } }}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Flex gap={8} wrap="wrap" align="center">
            <Typography.Text strong style={{ fontSize: 13, marginRight: 8 }}>
              AI Analizi:
            </Typography.Text>
            <Tag color={token.colorPrimary} style={{ borderRadius: 6, margin: 0 }}>
              {session.analysis.categoryLabel}
            </Tag>
            <Tag style={{ borderRadius: 6, margin: 0 }}>{session.analysis.conditionLabel}</Tag>
            <Tag style={{ borderRadius: 6, margin: 0 }}>{session.analysis.estimatedPriceRange}</Tag>
            <Typography.Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
              %{session.analysis.confidence} Güven
            </Typography.Text>
          </Flex>

          <Flex gap={16} align="center">
            <Flex gap={6} align="center">
              <Layers size={14} color={token.colorTextTertiary} />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {session.results.length} sonuç
              </Typography.Text>
            </Flex>
            <Flex gap={6} align="center">
              <Clock size={14} color={token.colorTextTertiary} />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {(session.elapsedMs / 1000).toFixed(1)}s
              </Typography.Text>
            </Flex>
          </Flex>
        </Flex>
      </Card>

      {/* ── Result Cards Grid ── */}
      <Row gutter={[20, 20]}>
        {session.results.map((result) => {
          const isActive = result.id === activeResultId;

          return (
            <Col key={result.id} xs={24} sm={12} xl={8}>
              <Badge.Ribbon
                text={`#${result.rank}`}
                color={result.rank <= 3 ? token.colorPrimary : "default"}
              >
                <Card
                  hoverable
                  onClick={() => onSelect(result.id)}
                  className="search-result-card"
                  style={{
                    borderRadius: token.borderRadiusLG * 1.5,
                    overflow: "hidden",
                    border: "none",
                    boxShadow: isActive 
                      ? `0 0 0 2px ${token.colorPrimary}, 0 8px 24px rgba(0,0,0,0.12)` 
                      : "0 4px 16px rgba(0,0,0,0.06)",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    transform: isActive ? "translateY(-4px)" : "none",
                  }}
                  styles={{ body: { padding: 0 } }}
                >
                  {/* Image Area */}
                  <div style={{ position: "relative" }}>
                    <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                      <img
                        src={result.imageUrl}
                        alt={result.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        background: result.rank <= 3 
                          ? `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorInfo})` 
                          : "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(8px)",
                        borderRadius: 10,
                        padding: "6px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        boxShadow: result.rank <= 3 ? `0 4px 12px ${token.colorPrimary}60` : "0 4px 12px rgba(0,0,0,0.1)",
                        border: result.rank <= 3 ? "none" : "1px solid rgba(0,0,0,0.05)"
                      }}
                    >
                      <TrendingUp size={14} color={result.rank <= 3 ? "#fff" : token.colorPrimary} />
                      <span style={{ fontSize: 13, fontWeight: 800, color: result.rank <= 3 ? "#fff" : token.colorText }}>
                        %{result.score}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div style={{ padding: 16 }}>
                    <Flex justify="space-between" align="flex-start" gap={8} style={{ marginBottom: 4 }}>
                      <Typography.Text
                        strong
                        ellipsis
                        style={{ fontSize: 14, flex: 1, minWidth: 0 }}
                      >
                        {result.title}
                      </Typography.Text>
                      <div style={{ fontSize: 15, fontWeight: 800, color: token.colorText, whiteSpace: "nowrap" }}>
                        {formatPrice(result.price)}
                      </div>
                    </Flex>
                    
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 12 }}>
                      {result.city}
                    </Typography.Text>

                    <Flex gap={4} wrap="wrap">
                      {result.matchedSignals.slice(0, 3).map((signal) => (
                        <Tag key={signal} style={{ borderRadius: 4, fontSize: 11, margin: 0, border: "none", background: token.colorFillQuaternary }}>
                          {signal}
                        </Tag>
                      ))}
                    </Flex>
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
          );
        })}
      </Row>
      <style>{`
        .search-result-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 16px 32px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </Flex>
  );
}
