import { CalendarOutlined, PercentageOutlined, TagOutlined } from "@ant-design/icons";
import { Alert, Badge, Card, Col, Empty, Flex, Row, Skeleton, Tag, Typography, theme } from "antd";
import dayjs from "dayjs";
import type { Discount } from "@/types";

interface ExploreDiscountGridProps {
  discounts: Discount[];
  errorMessage?: string;
  isLoading?: boolean;
}

export default function ExploreDiscountGrid({
  discounts,
  errorMessage,
  isLoading = false,
}: ExploreDiscountGridProps) {
  const { token } = theme.useToken();

  if (isLoading) {
    return (
      <Row gutter={[16, 16]}>
        {Array.from({ length: 6 }, (_, index) => (
          <Col key={`discount-skeleton-${index}`} xs={24} sm={12} xl={8}>
            <Card style={{ borderColor: token.colorBorderSecondary }}>
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (errorMessage) {
    return <Alert type="error" showIcon message={errorMessage} />;
  }

  if (discounts.length === 0) {
    return <Empty description="Aramana uygun indirim bulunamadi." />;
  }

  return (
    <Row gutter={[16, 16]}>
      {discounts.map((discount) => (
        <Col key={discount.id} xs={24} sm={12} xl={8}>
          <Badge.Ribbon color={token.colorWarning} text={`%${discount.discountRate}`}>
            <Card
              hoverable
              style={{ borderColor: token.colorBorderSecondary, height: "100%" }}
              styles={{ body: { padding: 20, height: "100%" } }}
            >
              <Flex vertical gap={16} style={{ height: "100%" }}>
                <div>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {discount.businessName}
                  </Typography.Text>
                  <Typography.Title level={5} style={{ margin: "8px 0 0" }}>
                    {discount.title}
                  </Typography.Title>
                </div>

                <Typography.Paragraph
                  type="secondary"
                  ellipsis={{ rows: 3 }}
                  style={{ marginBottom: 0, lineHeight: 1.7 }}
                >
                  {discount.description}
                </Typography.Paragraph>

                <Flex gap={8} wrap="wrap">
                  <Tag icon={<PercentageOutlined />} color="gold">
                    %{discount.discountRate} indirim
                  </Tag>
                  {discount.code ? (
                    <Tag icon={<TagOutlined />} color="blue">
                      {discount.code}
                    </Tag>
                  ) : null}
                </Flex>

                <Typography.Text type="secondary" style={{ fontSize: 12, marginTop: "auto" }}>
                  <CalendarOutlined style={{ marginRight: 6 }} />
                  Son tarih: {dayjs(discount.validUntil).format("DD MMMM YYYY")}
                </Typography.Text>
              </Flex>
            </Card>
          </Badge.Ribbon>
        </Col>
      ))}
    </Row>
  );
}
