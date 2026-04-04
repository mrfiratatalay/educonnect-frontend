import {
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  Modal,
  Progress,
  Row,
  Statistic,
  Tag,
  Typography,
  theme,
} from "antd";
import { MapPin, ShoppingBag, TrendingUp, User } from "lucide-react";
import { formatPrice } from "../helpers";
import type { SearchResult, SearchSession } from "../types";

interface SearchResultDialogProps {
  open: boolean;
  result: SearchResult | null;
  session: SearchSession | null;
  onOpenChange: (open: boolean) => void;
}

export function SearchResultDialog({
  open,
  result,
  session,
  onOpenChange,
}: SearchResultDialogProps) {
  const { token } = theme.useToken();

  const scoreColor =
    result && result.score >= 80
      ? token.colorSuccess
      : result && result.score >= 50
        ? token.colorWarning
        : token.colorTextTertiary;

  return (
    <Modal
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={null}
      width={1000}
      centered
      destroyOnHidden
      styles={{
        body: { padding: 0 },
        mask: { 
          backdropFilter: "blur(12px)", 
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: "rgba(0, 0, 0, 0.45)" 
        },
      }}
    >
      {result ? (
        <Row>
          {/* ── Left: Image ── */}
          <Col xs={24} md={12}>
            <div
              style={{
                background: token.colorFillQuaternary,
                height: "100%",
                minHeight: 360,
                position: "relative",
              }}
            >
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
              {/* ── Score overlay ── */}
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  left: 24,
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(16px)",
                  borderRadius: 16,
                  padding: "12px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                }}
              >
                <TrendingUp size={20} color={scoreColor} />
                <span
                  style={{
                    color: token.colorText,
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  %{result.score}
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 12,
                  }}
                >
                  eşleşme
                </span>
              </div>
              {/* ── Rank ── */}
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: token.colorPrimary,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 16,
                  boxShadow: `0 4px 16px ${token.colorPrimary}40`,
                }}
              >
                #{result.rank}
              </div>
            </div>
          </Col>

          {/* ── Right: Details ── */}
          <Col xs={24} md={12}>
            <Flex
              vertical
              gap={20}
              style={{ padding: "28px 28px 24px" }}
            >
              {/* ── Tags ── */}
              <Flex gap={8} wrap="wrap">
                <Tag
                  color={token.colorPrimary}
                  style={{ borderRadius: 8, fontWeight: 700, padding: "2px 10px" }}
                >
                  {result.categoryLabel}
                </Tag>
                <Tag style={{ borderRadius: 8, padding: "2px 10px", background: token.colorFillAlter }}>{result.conditionLabel}</Tag>
              </Flex>

              {/* ── Title & Description ── */}
              <div>
                <Typography.Title
                  level={3}
                  style={{ margin: 0, maxWidth: 380 }}
                >
                  {result.title}
                </Typography.Title>
                <Typography.Paragraph
                  type="secondary"
                  style={{
                    marginTop: 8,
                    marginBottom: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {result.description ||
                    session?.analysis.productName ||
                    "Ürün detayı mevcut değil."}
                </Typography.Paragraph>
              </div>

              {/* ── Price + City cards ── */}
              <Row gutter={12}>
                <Col span={12}>
                  <Card
                    size="small"
                    style={{
                      borderRadius: 16,
                      background: `linear-gradient(135deg, ${token.colorPrimary}0A, ${token.colorInfo}15)`,
                      border: `1px solid ${token.colorPrimary}20`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                    }}
                    styles={{ body: { padding: "16px" } }}
                  >
                    <Statistic
                      title={
                        <Flex gap={4} align="center">
                          <ShoppingBag size={12} /> Fiyat
                        </Flex>
                      }
                      value={formatPrice(result.price)}
                      valueStyle={{
                        color: token.colorPrimary,
                        fontSize: 20,
                        fontWeight: 800,
                      }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    size="small"
                    style={{ 
                      borderRadius: 16,
                      background: token.colorFillQuaternary,
                      border: "1px solid transparent"
                    }}
                    styles={{ body: { padding: "16px" } }}
                  >
                    <Statistic
                      title={
                        <Flex gap={4} align="center">
                          <MapPin size={12} /> Şehir
                        </Flex>
                      }
                      value={result.city || "—"}
                      valueStyle={{ fontSize: 18, fontWeight: 700 }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* ── Seller ── */}
              {result.sellerName && (
                <Flex gap={8} align="center">
                  <User size={14} color={token.colorTextTertiary} />
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    {result.sellerName}
                  </Typography.Text>
                </Flex>
              )}

              {/* ── Matched signals ── */}
              <Flex gap={6} wrap="wrap">
                {result.matchedSignals.map((signal) => (
                  <Tag
                    key={signal}
                    style={{ borderRadius: 6, margin: 0 }}
                  >
                    {signal}
                  </Tag>
                ))}
              </Flex>

              <Divider style={{ margin: "4px 0" }} />

              {/* ── Breakdown progress bars ── */}
              <Flex vertical gap={10}>
                <Typography.Text
                  strong
                  style={{ fontSize: 13, marginBottom: 4 }}
                >
                  Eşleşme Dağılımı
                </Typography.Text>
                {result.breakdown.map((item) => (
                  <div key={item.label}>
                    <Flex justify="space-between" style={{ marginBottom: 4 }}>
                      <Typography.Text style={{ fontSize: 12 }}>
                        {item.label}
                      </Typography.Text>
                      <Typography.Text
                        strong
                        style={{ fontSize: 12, color: token.colorPrimary }}
                      >
                        %{item.value}
                      </Typography.Text>
                    </Flex>
                    <Progress
                      percent={item.value}
                      showInfo={false}
                      strokeColor={{
                        from: token.colorPrimary,
                        to: `${token.colorPrimary}80`,
                      }}
                      trailColor={`${token.colorPrimary}0A`}
                      size="small"
                    />
                  </div>
                ))}
              </Flex>
            </Flex>
          </Col>
        </Row>
      ) : null}
    </Modal>
  );
}
