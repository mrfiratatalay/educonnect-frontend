import { CalendarOutlined, CopyOutlined, PercentageOutlined, ShopOutlined, TagOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Flex, Tag, Tooltip, Typography, message, theme } from "antd";
import dayjs from "dayjs";
import type { AppDiscount } from "@/features/discounts/types";

interface DiscountCardProps {
  discount: AppDiscount;
}

export default function DiscountCard({ discount }: DiscountCardProps) {
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const daysLeft = dayjs(discount.validUntil).diff(dayjs(), "day");
  const isEndingSoon = daysLeft <= 3;
  const expiryColor =
    daysLeft <= 3
      ? token.colorError
      : daysLeft <= 7
        ? token.colorWarning
        : token.colorSuccess;

  async function handleCopyCode(event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation();

    if (!discount.code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(discount.code);
      messageApi.success("İndirim kodu kopyalandı.");
    } catch {
      messageApi.error("İndirim kodu kopyalanamadı.");
    }
  }

  return (
    <div className="discount-card-wrapper" style={{ height: "100%" }}>
      {contextHolder}
      <Badge.Ribbon color={token.colorWarning} text={`%${discount.discountRate}`}>
        <Card
          hoverable
          style={{ borderColor: token.colorBorderSecondary, height: "100%" }}
          styles={{ body: { padding: 20, height: "100%" } }}
        >
          <Flex vertical gap={14} style={{ height: "100%" }}>
            <Flex align="center" gap={10}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: token.colorFillQuaternary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {discount.logoUrl ? (
                  <img
                    src={discount.logoUrl}
                    alt={discount.businessName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <ShopOutlined style={{ color: token.colorTextTertiary, fontSize: 18 }} />
                )}
              </div>

              <div style={{ minWidth: 0 }}>
                <Typography.Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                  {discount.businessName}
                </Typography.Text>
                <Typography.Text strong ellipsis style={{ fontSize: 16, display: "block" }}>
                  {discount.title}
                </Typography.Text>
              </div>
            </Flex>

            <Typography.Paragraph
              type="secondary"
              ellipsis={{ rows: 3 }}
              style={{ marginBottom: 0, lineHeight: 1.7 }}
            >
              {discount.description}
            </Typography.Paragraph>

            <Flex gap={8} wrap>
              <Tag color="gold">
                %{discount.discountRate} indirim
              </Tag>
              {isEndingSoon ? <Tag color="error">Yakinda bitiyor</Tag> : null}
              {discount.code ? (
                <Tag
                  color="blue"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    marginInlineEnd: 0,
                    paddingInlineEnd: 4,
                  }}
                >
                  <TagOutlined />
                  <span>{discount.code}</span>
                  <Tooltip title="Kodu kopyala">
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined style={{ fontSize: 13 }} />}
                      onClick={handleCopyCode}
                      style={{ width: 20, height: 20, minWidth: 20, padding: 0 }}
                    />
                  </Tooltip>
                </Tag>
              ) : null}
            </Flex>

            <Typography.Text style={{ fontSize: 12, marginTop: "auto", color: expiryColor }}>
              <CalendarOutlined style={{ marginRight: 6 }} />
              Son tarih: {dayjs(discount.validUntil).format("DD MMMM YYYY")}
            </Typography.Text>
          </Flex>
        </Card>
      </Badge.Ribbon>
    </div>
  );
}
